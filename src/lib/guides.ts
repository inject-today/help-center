import { getCollection, type CollectionEntry } from 'astro:content';
import { categories, type Category, type Product } from './products';

export type Guide = CollectionEntry<'docs'>;

/** Published guides of one product, in sidebar order. */
export async function guidesFor(product: Product): Promise<Guide[]> {
	const guides = await getCollection(
		'docs',
		(entry) =>
			entry.id.startsWith(`${product.slug}/`) &&
			!entry.data.sidebar.hidden &&
			!(import.meta.env.PROD && entry.data.draft)
	);
	return guides.toSorted(
		(a, b) =>
			(a.data.sidebar.order ?? Infinity) - (b.data.sidebar.order ?? Infinity) ||
			a.data.title.localeCompare(b.data.title, 'en', { sensitivity: 'base' })
	);
}

/** Guides of one product grouped by category, skipping empty categories. */
export async function guidesByCategory(
	product: Product
): Promise<{ category: Category; guides: Guide[] }[]> {
	const guides = await guidesFor(product);
	return categories
		.map((category) => ({
			category,
			guides: guides.filter((g) => (g.data.category ?? 'other') === category.id),
		}))
		.filter((group) => group.guides.length > 0);
}

export const guideHref = (guide: Guide) => `/${guide.id}/`;

const dateFormat = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'UTC' });
export const formatDate = (date: Date) => dateFormat.format(date);
