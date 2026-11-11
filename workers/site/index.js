// The site's Worker. Pages and files are served straight from ./dist; only
// requests under /api/ run this code (`run_worker_first` in wrangler.jsonc).
import products from '../../src/data/products.json';
import { WEAO_API, summarize } from '../../src/lib/weao.js';

// WEAO rate-limits its API (120 requests per window) and a product's status
// changes a few times a week, so asking once a minute per Cloudflare location
// is plenty.
const FRESH_FOR_SECONDS = 60;

/** The last good answer, kept for as long as Cloudflare keeps this Worker warm. */
let cached;

async function statusBody() {
	if (cached && Date.now() - cached.at < FRESH_FOR_SECONDS * 1000) return cached.body;
	try {
		const response = await fetch(WEAO_API, {
			headers: { accept: 'application/json' },
			cf: { cacheTtl: FRESH_FOR_SECONDS, cacheEverything: true },
			signal: AbortSignal.timeout(5000),
		});
		if (!response.ok) throw new Error(`WEAO answered ${response.status}`);
		const body = JSON.stringify({
			checked: new Date().toISOString(),
			products: summarize(products, await response.json()),
		});
		cached = { at: Date.now(), body };
		return body;
	} catch (error) {
		console.error(`Couldn't get status from WEAO: ${error}`);
		// An answer from a few minutes ago beats none.
		return cached?.body;
	}
}

export default {
	async fetch(request, env) {
		const { pathname } = new URL(request.url);

		if (pathname === '/api/status') {
			if (request.method !== 'GET' && request.method !== 'HEAD') {
				return new Response(null, { status: 405, headers: { allow: 'GET, HEAD' } });
			}
			const body = await statusBody();
			if (!body) {
				return Response.json(
					{ error: 'WEAO is unreachable right now.' },
					{ status: 503, headers: { 'cache-control': 'no-store' } }
				);
			}
			return new Response(request.method === 'HEAD' ? null : body, {
				headers: {
					'content-type': 'application/json; charset=utf-8',
					'cache-control': `public, max-age=${FRESH_FOR_SECONDS}`,
					'x-content-type-options': 'nosniff',
				},
			});
		}

		return env.ASSETS.fetch(request);
	},
};
