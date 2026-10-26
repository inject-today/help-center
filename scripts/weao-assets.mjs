// Downloads each product's logo and first screenshot from WEAO into
// src/assets/products/<slug>/, re-encoded as WebP. Only fetches what's missing;
// pass --force to download everything again. Run with `npm run assets`.
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { loadProducts, ROOT } from './lib/products.mjs';

const API = 'https://weao.gg/api/status/exploits';
const force = process.argv.includes('--force');

const products = loadProducts();
const entries = await (await fetch(API)).json();

/**
 * The logo's most prominent saturated color as #rrggbb, used to tint its glow.
 * Undefined for mostly black, white or gray logos.
 */
async function brandColor(buffer) {
	const { data } = await sharp(buffer)
		.resize(24, 24, { fit: 'cover' })
		.ensureAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });
	// Weight pixels by saturation into 30° hue buckets, then average the heaviest bucket.
	const buckets = Array.from({ length: 12 }, () => ({ weight: 0, r: 0, g: 0, b: 0 }));
	for (let i = 0; i < data.length; i += 4) {
		const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
		if (a < 128) continue;
		const max = Math.max(r, g, b) / 255;
		const min = Math.min(r, g, b) / 255;
		const delta = max - min;
		const lightness = (max + min) / 2;
		if (delta === 0) continue;
		const saturation = delta / (1 - Math.abs(2 * lightness - 1));
		if (saturation < 0.3 || lightness < 0.08 || lightness > 0.9) continue;
		const [R, G, B] = [r / 255, g / 255, b / 255];
		const hue =
			max === R ? ((G - B) / delta) % 6 : max === G ? (B - R) / delta + 2 : (R - G) / delta + 4;
		const bucket = buckets[Math.floor((((hue * 60) % 360) + 360) % 360 / 30)];
		bucket.weight += saturation;
		bucket.r += r * saturation;
		bucket.g += g * saturation;
		bucket.b += b * saturation;
	}
	const best = buckets.reduce((a, b) => (b.weight > a.weight ? b : a));
	if (best.weight < 2) return undefined;
	// Keep the hue but bring lightness into a range that reads as a glow.
	const [r, g, b] = [best.r, best.g, best.b].map((v) => v / best.weight / 255);
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const delta = max - min;
	const hue = (((max === r ? ((g - b) / delta) % 6 : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4) * 60) + 360) % 360;
	const lightness = Math.min(0.66, Math.max(0.5, (max + min) / 2));
	const saturation = Math.max(0.55, delta / (1 - Math.abs(max + min - 1)));
	const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
	const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
	const m = lightness - chroma / 2;
	const [r1, g1, b1] =
		hue < 60 ? [chroma, x, 0] : hue < 120 ? [x, chroma, 0] : hue < 180 ? [0, chroma, x]
		: hue < 240 ? [0, x, chroma] : hue < 300 ? [x, 0, chroma] : [chroma, 0, x];
	const hex = [r1, g1, b1].map((v) => Math.round((v + m) * 255).toString(16).padStart(2, '0'));
	return `#${hex.join('')}`;
}

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
			const buffer = await download(logoUrl);
			const image = sharp(buffer);
			const { channels } = await image.stats();
			mkdirSync(dir, { recursive: true });
			await image
				.resize(256, 256, { fit: 'inside', withoutEnlargement: true })
				.webp({ quality: 90 })
				.toFile(fileURLToPath(logoFile));
			// Logos that fill their square (allowing for rounded corners) fill the tile;
			// transparent marks sit on a dark one.
			const coverage = (channels[3]?.mean ?? 255) / 255;
			const logoFit = coverage > 0.94 ? 'cover' : 'contain';
			const color = await brandColor(buffer);
			if (product.logoFit !== logoFit || product.color !== color) {
				product.logoFit = logoFit;
				if (color) product.color = color;
				else delete product.color;
				listChanged = true;
			}
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
