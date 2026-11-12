// Turns a logo image into src/assets/products/<slug>/logo.webp and works out
// how the site should show it. Used by `npm run assets` and `npm run logo`.
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { ROOT } from './products.mjs';

/**
 * Saves the logo and sets `logoFit` and `color` on the product.
 * Returns true when either of those changed.
 */
export async function saveLogo(product, buffer) {
	const meta = await sharp(buffer).metadata();
	const { channels, isOpaque } = await sharp(buffer).stats();
	// Logos that fill their square (allowing for rounded corners) fill the tile;
	// transparent marks sit on a dark one.
	const coverage = (channels[3]?.mean ?? 255) / 255;
	const logoFit = coverage > 0.94 ? 'cover' : 'contain';

	let image = sharp(buffer);
	// A logo on its own background, but not square: crop to the middle square so
	// it fills the tile instead of being squashed or letterboxed.
	if (isOpaque && meta.width !== meta.height) {
		const side = Math.min(meta.width, meta.height);
		image = image.resize(side, side, { fit: 'cover', position: 'centre' });
	}
	const dir = new URL(`src/assets/products/${product.slug}/`, ROOT);
	mkdirSync(dir, { recursive: true });
	await image
		.resize(256, 256, { fit: 'inside', withoutEnlargement: true })
		.webp({ quality: 90 })
		.toFile(fileURLToPath(new URL('logo.webp', dir)));

	const color = await brandColor(buffer);
	if (product.logoFit === logoFit && product.color === color) return false;
	product.logoFit = logoFit;
	if (color) product.color = color;
	else delete product.color;
	return true;
}

/**
 * The logo's most prominent saturated color as #rrggbb, used to tint its glow.
 * Undefined for mostly black, white or gray logos.
 */
export async function brandColor(buffer) {
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
