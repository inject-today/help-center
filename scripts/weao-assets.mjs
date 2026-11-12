// Downloads each product's logo and first screenshot from WEAO into
// src/assets/products/<slug>/, re-encoded as WebP. Only fetches what's missing;
// pass --force to download everything again. Run with `npm run assets`.
// For a logo WEAO doesn't have, use `npm run logo` instead.
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { saveLogo } from './lib/logo.mjs';
import { loadProducts, ROOT } from './lib/products.mjs';

const API = 'https://weao.gg/api/status/exploits';
const force = process.argv.includes('--force');

const products = loadProducts();
const entries = await (await fetch(API)).json();

async function download(url) {
	const response = await fetch(url);
	if (!response.ok) throw new Error(`HTTP ${response.status}`);
	const type = response.headers.get('content-type') ?? '';
	if (!type.startsWith('image/')) throw new Error(`not an image (${type || 'no type'})`);
	return Buffer.from(await response.arrayBuffer());
}

let listChanged = false;

for (const product of products) {
	const listings = entries.filter((e) => product.weaoIds?.includes(e.trackerId));
	const logoUrl = listings.map((e) => e.slug?.logo).find(Boolean);
	const screenshotUrl = listings.flatMap((e) => e.slug?.screenshots ?? []).find(Boolean);
	const dir = new URL(`src/assets/products/${product.slug}/`, ROOT);
	const logoFile = new URL('logo.webp', dir);
	const screenshotFile = new URL('screenshot.webp', dir);

	if (logoUrl && (force || !existsSync(logoFile))) {
		try {
			if (await saveLogo(product, await download(logoUrl))) listChanged = true;
			console.log(`${product.name}: logo`);
		} catch (error) {
			console.warn(`${product.name}: no logo (${error.message})`);
		}
	}

	if (screenshotUrl && (force || !existsSync(screenshotFile))) {
		try {
			mkdirSync(dir, { recursive: true });
			await sharp(await download(screenshotUrl))
				.resize({ width: 1600, withoutEnlargement: true })
				.webp({ quality: 82 })
				.toFile(fileURLToPath(screenshotFile));
			console.log(`${product.name}: screenshot`);
		} catch (error) {
			console.warn(`${product.name}: no screenshot (${error.message})`);
		}
	}
}

if (listChanged) {
	writeFileSync(new URL('src/data/products.json', ROOT), JSON.stringify(products, null, '\t') + '\n');
	console.log('Updated logoFit and color in src/data/products.json');
}
