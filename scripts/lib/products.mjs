// Shared by astro.config.mjs and the maintenance scripts, so the product
// list is validated the same way at build time and in CI.
import { existsSync, readdirSync, readFileSync } from 'node:fs';

export const ROOT = new URL('../../', import.meta.url);
export const DOCS_DIR = new URL('src/content/docs/', ROOT);

// Top-level URLs that are not products.
export const RESERVED_SLUGS = [
	'admin',
	'contributing',
	'terms',
	'privacy',
	'pagefind',
	'images',
	'404',
];

export const PLATFORMS = ['Windows', 'Mac', 'Android', 'iOS'];
export const KINDS = ['executor', 'external'];
export const STATUSES = ['active', 'updating', 'down'];

export function loadProducts() {
	return JSON.parse(readFileSync(new URL('src/data/products.json', ROOT), 'utf8'));
}

export function loadCategories() {
	return JSON.parse(readFileSync(new URL('src/data/categories.json', ROOT), 'utf8'));
}

/** Returns a list of human-readable problems; empty when the product list is valid. */
export function validateProducts(products) {
	const problems = [];
	const slugs = new Set();
	const featured = new Set();

	for (const [i, p] of products.entries()) {
		const at = `products.json entry ${i + 1} (${p.name ?? 'no name'})`;
		if (!p.name) problems.push(`${at}: missing "name".`);
		if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug ?? '')) {
			problems.push(`${at}: "slug" must be lowercase letters, numbers and dashes.`);
		}
		if (slugs.has(p.slug)) problems.push(`${at}: slug "${p.slug}" is used twice.`);
		if (RESERVED_SLUGS.includes(p.slug)) problems.push(`${at}: slug "${p.slug}" is reserved.`);
		slugs.add(p.slug);
		if (!KINDS.includes(p.kind)) problems.push(`${at}: "kind" must be one of ${KINDS.join(', ')}.`);
		if (!Array.isArray(p.platforms) || p.platforms.length === 0) {
			problems.push(`${at}: list at least one platform.`);
		}
		for (const platform of p.platforms ?? []) {
			if (!PLATFORMS.includes(platform)) {
				problems.push(`${at}: unknown platform "${platform}" (use ${PLATFORMS.join(', ')}).`);
			}
		}
		if (!STATUSES.includes(p.status)) {
			problems.push(`${at}: "status" must be one of ${STATUSES.join(', ')}.`);
		}
		if (p.logoFit !== undefined && !['cover', 'contain'].includes(p.logoFit)) {
			problems.push(`${at}: "logoFit" must be "cover" or "contain".`);
		}
		if (p.color !== undefined && !/^#[0-9a-f]{6}$/i.test(p.color)) {
			problems.push(`${at}: "color" must be a hex color like #3a7bd5.`);
		}
		if (p.featured !== undefined) {
			if (!Number.isInteger(p.featured) || p.featured < 1) {
				problems.push(`${at}: "featured" must be a whole number from 1 up (its position).`);
			} else if (featured.has(p.featured)) {
				problems.push(`${at}: featured position ${p.featured} is used twice.`);
			}
			featured.add(p.featured);
		}
	}

	// Every top-level folder of guides must belong to a product, and product
	// overview pages are generated, so a hand-written index would collide.
	if (existsSync(DOCS_DIR)) {
		for (const entry of readdirSync(DOCS_DIR, { withFileTypes: true })) {
			if (!entry.isDirectory()) continue;
			if (!slugs.has(entry.name)) {
				problems.push(
					`src/content/docs/${entry.name}/ has no matching product in src/data/products.json.`
				);
				continue;
			}
			for (const file of ['index.md', 'index.mdx']) {
				if (existsSync(new URL(`${entry.name}/${file}`, DOCS_DIR))) {
					problems.push(
						`src/content/docs/${entry.name}/${file} would replace the generated product page; give the guide another name.`
					);
				}
			}
		}
	}

	return problems;
}
