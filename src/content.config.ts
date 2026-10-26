import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import categories from './data/categories.json';

const categoryIds = categories.map((c) => c.id) as [string, ...string[]];

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema({
			extend: z.object({
				/** Groups the guide in its product's sidebar; guides without one go under "Other". */
				category: z.enum(categoryIds).optional(),
				/** Product version the guide applies to, e.g. "v4.2+". */
				appliesTo: z.string().optional(),
				/** Last date someone confirmed the fix still works. */
				verifiedOn: z.coerce.date().optional(),
			}),
		}),
	}),
};
