// Adds a logo from an image file, for products WEAO has no logo for or a worse one:
//   npm run logo -- <slug> <file>
// Any common image format works, SVG included. Square images at 256×256 or
// larger look best. The product is marked `customLogo`, so `npm run assets`
// never swaps it back for WEAO's.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { saveLogo } from './lib/logo.mjs';
import { loadProducts, ROOT } from './lib/products.mjs';

const [slug, file] = process.argv.slice(2);
if (!slug || !file) {
	console.error('Usage: npm run logo -- <slug> <file>');
	process.exit(1);
}

const products = loadProducts();
const product = products.find((p) => p.slug === slug);
if (!product) {
	console.error(`No product with the slug "${slug}" in src/data/products.json.`);
	process.exit(1);
}

const changed = await saveLogo(product, readFileSync(resolve(file)));
if (changed || !product.customLogo) {
	product.customLogo = true;
	writeFileSync(new URL('src/data/products.json', ROOT), JSON.stringify(products, null, '\t') + '\n');
}
console.log(`${product.name}: logo saved (${product.logoFit}${product.color ? `, glow ${product.color}` : ''})`);
