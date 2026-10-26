// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';
import { loadProducts, validateProducts } from './scripts/lib/products.mjs';

const products = loadProducts();
const problems = validateProducts(products);
if (problems.length > 0) {
	throw new Error(`The product list has problems:\n- ${problems.join('\n- ')}`);
}

export default defineConfig({
	site: 'https://inject.today',
	integrations: [
		starlight({
			title: 'Inject.Today',
			description: 'Community-driven help center for all things Roblox.',
			favicon: '/favicon.svg',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/inject-today/help-center' },
			],
			editLink: {
				baseUrl: 'https://github.com/inject-today/help-center/edit/main/',
			},
			lastUpdated: true,
			credits: false,
			// Sidebars are built per product in src/routeData.ts.
			routeMiddleware: './src/routeData.ts',
			customCss: [
				'@fontsource-variable/geist',
				'@fontsource-variable/geist-mono',
				'./src/styles/custom.css',
			],
			components: {
				Head: './src/components/overrides/Head.astro',
				SiteTitle: './src/components/overrides/SiteTitle.astro',
				PageTitle: './src/components/overrides/PageTitle.astro',
				Sidebar: './src/components/overrides/Sidebar.astro',
				Footer: './src/components/overrides/Footer.astro',
			},
			plugins: [
				starlightLinksValidator({
					errorOnRelativeLinks: false,
					// Product overview pages are generated and the editor is a static
					// app, so neither is a content file the validator knows about.
					exclude: ['/admin/', ...products.map((p) => `/${p.slug}/`)],
				}),
			],
		}),
	],
});
