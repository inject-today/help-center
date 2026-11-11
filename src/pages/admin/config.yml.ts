// Guide editor (Sveltia CMS) settings, generated so every product in
// src/data/products.json gets its own section without editing this file.
// JSON is valid YAML, so the editor reads this as its config.yml.
import type { APIRoute } from 'astro';
import { categories, products } from '../../lib/products';

const AUTH_URL = 'https://inject-today-cms-auth.injecttoday.workers.dev';

// Every new guide starts with these sections.
const GUIDE_TEMPLATE = `## Symptom

What you see: the exact error text, what happens and when.

## Cause

Why it happens, if you know.

## Fix

1. First step.
2. Second step.

## Still not working?

What to try next, or where to ask.
`;

const guideFields = [
	{
		label: 'Title',
		name: 'title',
		widget: 'string',
		hint: 'The problem as people would search for it. Put error messages in quotes, word for word. [Examples](/contributing/write-a-guide/#3-fill-in-the-details)',
	},
	{
		label: 'One-line summary',
		name: 'description',
		widget: 'string',
		required: false,
		hint: 'One sentence saying what this guide fixes.',
	},
	{
		label: 'Category',
		name: 'category',
		widget: 'select',
		options: categories.map((c) => ({ label: c.label, value: c.id })),
		default: 'other',
	},
	{
		label: 'Applies to version',
		name: 'appliesTo',
		widget: 'string',
		required: false,
		hint: 'Product versions the fix works on, if it matters. For example: v2.1 and newer.',
	},
	{
		label: 'Last verified',
		name: 'verifiedOn',
		widget: 'datetime',
		time_format: false,
		date_format: 'YYYY-MM-DD',
		format: 'YYYY-MM-DD',
		required: false,
		hint: 'The last date someone confirmed this fix works.',
	},
	{
		label: 'Guide',
		name: 'body',
		widget: 'markdown',
		hint: "One action per step. Button names in **bold**, error text in `code`. Delete sections that don't apply. [Tips](/contributing/write-a-guide/#4-write-the-steps)",
		default: GUIDE_TEMPLATE,
	},
];

const config = {
	backend: {
		name: 'github',
		repo: 'inject-today/help-center',
		branch: 'main',
		base_url: AUTH_URL,
		open_authoring: true,
		// Enough for a public repository, and nothing on the contributor's private ones.
		auth_scope: 'public_repo',
		commit_messages: {
			create: 'New guide: {{slug}}',
			update: 'Update guide: {{slug}}',
			delete: 'Delete guide: {{slug}}',
			uploadMedia: 'Add image: {{path}}',
			deleteMedia: 'Delete image: {{path}}',
			openAuthoring: '{{message}} (by {{author-login}})',
		},
	},
	publish_mode: 'editorial_workflow',
	site_url: 'https://inject.today',
	display_url: 'https://inject.today',
	// Required globally; each product's guides keep their images in their own folder.
	media_folder: 'public/images',
	public_folder: '/images',
	collections: products.map((product) => ({
		name: product.slug,
		label: product.name,
		label_singular: `${product.name} guide`,
		description: `Guides for ${product.name}. New here? Read [How to write a guide](/contributing/write-a-guide/) first.`,
		folder: `src/content/docs/${product.slug}`,
		create: true,
		extension: 'md',
		format: 'frontmatter',
		slug: '{{slug}}',
		summary: '{{title}}',
		media_folder: 'images',
		public_folder: './images',
		preview_path: `${product.slug}/{{slug}}`,
		fields: guideFields,
	})),
};

export const GET: APIRoute = () =>
	new Response(JSON.stringify(config, null, 2), {
		headers: { 'Content-Type': 'text/yaml; charset=utf-8' },
	});
