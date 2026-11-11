// Product status from WEAO at build time, so pages ship with a status already
// in them. The browser then asks /api/status for anything newer, because the
// site is only rebuilt when something is merged.
import { products } from './products';
import { WEAO_API, summarize, type Status } from './weao.js';

export type { State, Status } from './weao.js';

let pending: Promise<Record<string, Status>> | undefined;

/** Every product's status, fetched once per build. Empty when WEAO can't be reached. */
export function getStatuses(): Promise<Record<string, Status>> {
	pending ??= load();
	return pending;
}

async function load(): Promise<Record<string, Status>> {
	try {
		const response = await fetch(WEAO_API, { signal: AbortSignal.timeout(10_000) });
		if (!response.ok) throw new Error(`WEAO answered ${response.status}`);
		return summarize(products, await response.json());
	} catch (error) {
		// A status is nice to have; a build that fails because WEAO is down isn't.
		console.warn(`[status] Building without status badges: ${error}`);
		return {};
	}
}
