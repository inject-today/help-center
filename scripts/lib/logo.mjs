// Turns a logo image into src/assets/products/<slug>/logo.webp and works out
// how the site should show it. Used by `npm run assets` and `npm run logo`.
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { ROOT } from './products.mjs';

const SIZE = 256;

/**
 * Saves the logo and sets `logoFit` and `color` on the product.
 * Returns true when either of those changed.
 */
export async function saveLogo(product, buffer) {
	// Draw SVGs large enough to stay sharp, and make everything 8-bit RGBA so
	// grayscale and palette images are measured the same way as the rest.
	const { data, info } = await sharp(buffer, { density: 384 })
		.toColourspace('srgb')
		.ensureAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });
	const raw = { raw: { width: info.width, height: info.height, channels: 4 } };

	// A mark on a plain black square shows up as a black box on the tile, so
	// lift it off the black and let it sit on the tile like the other marks.
	if (onBlack(data, info)) liftOffBlack(data);

	// Logos that fill their square (allowing for rounded corners) fill the tile;
	// transparent marks sit on a dark one.
	const logoFit = coverage(data) > 0.94 ? 'cover' : 'contain';

	// Covering logos that aren't square keep their middle square, instead of
	// being squashed. Marks lose their empty margins, so the tile's padding
	// alone decides how big every mark looks.
	const side = Math.min(info.width, info.height);
	const box =
		logoFit === 'cover'
			? { left: (info.width - side) >> 1, top: (info.height - side) >> 1, width: side, height: side }
			: bounds(data, info);
	const png = await sharp(data, raw)
		.extract(box)
		.resize(SIZE, SIZE, { fit: 'inside', withoutEnlargement: true })
		.png()
		.toBuffer();

	const dir = new URL(`src/assets/products/${product.slug}/`, ROOT);
	mkdirSync(dir, { recursive: true });
	await sharp(png).webp({ quality: 90 }).toFile(fileURLToPath(new URL('logo.webp', dir)));

	const color = await brandColor(png);
	if (product.logoFit === logoFit && product.color === color) return false;
	product.logoFit = logoFit;
	if (color) product.color = color;
	else delete product.color;
	return true;
}

/** Share of the image that isn't transparent, from 0 to 1. */
function coverage(data) {
	let sum = 0;
	for (let i = 3; i < data.length; i += 4) sum += data[i];
	return sum / (data.length / 4) / 255;
}

/** True when the outer edge of the image is solid black, all the way around. */
function onBlack(data, { width, height }) {
	const band = Math.max(2, Math.round(Math.min(width, height) * 0.02));
	let edge = 0;
	let black = 0;
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			if (x >= band && x < width - band && y >= band && y < height - band) continue;
			const i = (y * width + x) * 4;
			edge++;
			if (data[i + 3] > 240 && Math.max(data[i], data[i + 1], data[i + 2]) <= 16) black++;
		}
	}
	return black / edge >= 0.95;
}

/**
 * Turns black into transparency, keeping each pixel's color: the reverse of
 * laying the mark over black, so glows and soft edges stay soft.
 */
function liftOffBlack(data) {
	// Ignore the faint noise compression leaves in "black" areas.
	const FLOOR = 10;
	for (let i = 0; i < data.length; i += 4) {
		const brightest = Math.max(data[i], data[i + 1], data[i + 2]);
		const alpha = Math.max(0, (brightest - FLOOR) / (255 - FLOOR));
		if (alpha > 0) {
			for (let c = 0; c < 3; c++) data[i + c] = Math.round((data[i + c] * 255) / brightest);
		}
		data[i + 3] = Math.round(alpha * data[i + 3]);
	}
}

/** The smallest box holding everything visible, as a sharp extract region. */
function bounds(data, { width, height }) {
	let [left, top, right, bottom] = [width, height, -1, -1];
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			if (data[(y * width + x) * 4 + 3] <= 8) continue;
			if (x < left) left = x;
			if (x > right) right = x;
			if (y < top) top = y;
			if (y > bottom) bottom = y;
		}
	}
	if (right < 0) return { left: 0, top: 0, width, height };
	return { left, top, width: right - left + 1, height: bottom - top + 1 };
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
