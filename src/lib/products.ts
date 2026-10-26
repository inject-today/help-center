import type { ImageMetadata } from 'astro';
import categoriesData from '../data/categories.json';
import productsData from '../data/products.json';

export type Platform = 'Windows' | 'Mac' | 'Android' | 'iOS';
export type ProductKind = 'executor' | 'external';
// TODO(weao): every product is "active" until status comes from the WEAO API.
// See MAINTAINING.md → "Status badges".
export type ProductStatus = 'active' | 'updating' | 'down';

export interface Product {
	name: string;
	slug: string;
	kind: ProductKind;
	platforms: Platform[];
	links: { website?: string; discord?: string };
	/** WEAO tracker IDs, one per platform listing. */
	weaoIds: string[];
	status: ProductStatus;
	/** Position in the featured grid on the home page; omit to not feature. */
	featured?: number;
	/** `cover`: the logo fills its tile. `contain`: a mark on a dark tile. Set by `npm run assets`. */
	logoFit?: 'cover' | 'contain';
	/** Brand color taken from the logo, for glows and tinted shadows. Set by `npm run assets`. */
	color?: string;
}

export interface Category {
	id: string;
	label: string;
	description: string;
}

export const products = (productsData as Product[]).toSorted((a, b) =>
	a.name.localeCompare(b.name, 'en', { sensitivity: 'base' })
);

export const featuredProducts = products
	.filter((p) => p.featured !== undefined)
	.toSorted((a, b) => a.featured! - b.featured!);

export const categories = categoriesData as Category[];

export const PLATFORMS: Platform[] = ['Windows', 'Mac', 'Android', 'iOS'];

export const kindLabel: Record<ProductKind, string> = {
	executor: 'Executor',
	external: 'External',
};

export const statusLabel: Record<ProductStatus, string> = {
	active: 'Active',
	updating: 'Updating',
	down: 'Down',
};

const bySlug = new Map(products.map((p) => [p.slug, p]));

/** The product a page belongs to, from its Starlight route id (e.g. `solara/missing-dll`). */
export function productForId(id: string): Product | undefined {
	return bySlug.get(id.split('/')[0]);
}

export function productHref(product: Product): string {
	return `/${product.slug}/`;
}

export function categoryFor(id: string | undefined): Category {
	return categories.find((c) => c.id === id) ?? categories.at(-1)!;
}

// Logos and screenshots from WEAO, fetched by `npm run assets`.
const assetFiles = import.meta.glob<ImageMetadata>('../assets/products/*/*.webp', {
	eager: true,
	import: 'default',
});
const asset = (slug: string, name: string) => assetFiles[`../assets/products/${slug}/${name}.webp`];

export const logoFor = (product: Product): ImageMetadata | undefined => asset(product.slug, 'logo');
export const screenshotFor = (product: Product): ImageMetadata | undefined =>
	asset(product.slug, 'screenshot');

/** One or two letters standing in for a missing logo, e.g. "Synapse Z" → "SZ". */
export function monogram(name: string): string {
	const words = name.split(/\s+/).filter(Boolean);
	return words.length > 1 ? `${words[0][0]}${words[1][0]}`.toUpperCase() : name.slice(0, 1).toUpperCase();
}

/** A stable hue per product, so letter tiles are told apart at a glance. */
export function hueFor(slug: string): number {
	let hash = 0;
	for (const char of slug) hash = (hash * 31 + char.charCodeAt(0)) % 360;
	return hash;
}

/** The color a product's glow and shadow take: its brand color, a neutral, or its letter-tile hue. */
export function tintFor(product: Product): string {
	if (product.color) return product.color;
	return logoFor(product) ? 'hsl(228 12% 62%)' : `hsl(${hueFor(product.slug)} 50% 52%)`;
}

export function platformsLabel(product: Product): string {
	return product.platforms.join(', ');
}

const REPO = 'https://github.com/inject-today/help-center';

/** A prefilled "Report a fix" issue for one product. */
export function reportFixUrl(product?: Product): string {
	const params = new URLSearchParams({ template: 'fix-report.yml' });
	if (product) {
		params.set('product', product.name);
		params.set('title', `[${product.name}] `);
	}
	return `${REPO}/issues/new?${params}`;
}

export const repoUrl = REPO;
