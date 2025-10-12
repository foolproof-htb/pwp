import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import defaultHeroImage from './assets/default-hero-image.jpg';

const post = defineCollection({
  // Load Markdown and MDX files in the `src/content/post/` directory.
  loader: glob({ base: './src/content/post', pattern: '**/*.{md,mdx}' }),
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        description: z.string().default(''),
        tags: z.array(z.string()),
        // Transform string to Date object
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        heroImage: image().optional(),
      })
      .transform((data) => ({
        ...data,
        heroImage: data.heroImage ?? defaultHeroImage,
      })),
});

const about = defineCollection({
  loader: glob({ base: './src/content/about', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(''),
  }),
});

export const collections = { post, about };
