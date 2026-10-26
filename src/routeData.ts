// Builds the sidebar per page: a product's pages only see that product's
// guides, grouped by category, instead of one sidebar listing every product.
import { defineRouteMiddleware, type StarlightRouteData } from '@astrojs/starlight/route-data';
import { guideHref, guidesByCategory } from './lib/guides';
import { productForId, productHref } from './lib/products';

type SidebarEntry = StarlightRouteData['sidebar'][number];
type SidebarLink = Extract<SidebarEntry, { type: 'link' }>;

const SITE_PAGES = [
	{ label: 'All products', href: '/' },
	{ label: 'Contributing', href: '/contributing/' },
	{ label: 'Terms of Service', href: '/terms/' },
	{ label: 'Privacy Policy', href: '/privacy/' },
];

const withSlash = (path: string) => (path.endsWith('/') ? path : `${path}/`);

function link(
	label: string,
	href: string,
	currentPath: string,
	badge?: SidebarLink['badge']
): SidebarLink {
	return { type: 'link', label, href, isCurrent: href === currentPath, badge, attrs: {} };
}

export const onRequest = defineRouteMiddleware(async (context) => {
	const route = context.locals.starlightRoute;
	const currentPath = withSlash(decodeURI(context.url.pathname));
	const product = productForId(route.id);

	if (!product) {
		route.sidebar = SITE_PAGES.map((page) => link(page.label, page.href, currentPath));
		route.pagination = { prev: undefined, next: undefined };
		return;
	}

	const overview = link('Overview', productHref(product), currentPath);
	const groups = (await guidesByCategory(product)).map(({ category, guides }) => ({
		type: 'group' as const,
		label: category.label,
		collapsed: false,
		badge: undefined,
		entries: guides.map((guide) =>
			link(
				guide.data.sidebar.label ?? guide.data.title,
				guideHref(guide),
				currentPath,
				guide.data.sidebar.badge
			)
		),
	}));
	route.sidebar = [overview, ...groups];

	// Previous/next stay inside the product.
	const flat = [overview, ...groups.flatMap((g) => g.entries)];
	const index = flat.findIndex((entry) => entry.isCurrent);
	const { prev, next } = route.entry.data;
	route.pagination = {
		prev: index > 0 && prev !== false ? flat[index - 1] : undefined,
		next: index >= 0 && index < flat.length - 1 && next !== false ? flat[index + 1] : undefined,
	};
});
