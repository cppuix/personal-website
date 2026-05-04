import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const books = defineCollection({
  loader: glob({ pattern: "*.json", base: "src/content/books" }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    description: z.string(),
    category: z.string(),
    language: z.string(),
    featured: z.boolean().default(false),
    pdfUrl: z.string().url(),
    archiveUrl: z.string().url(),
    coverImage: z.string().url().optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),  // allow string → Date coercion
    tags: z.array(z.string()).optional(),
    featured: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "*.json", base: "src/content/projects" }),
  schema: z.object({
    title: z.string(),
    titleAr: z.string().optional(),
    description: z.string(),
    descriptionAr: z.string().optional(),
    href: z.string(),
    coverImage: z.string().optional(),
    type: z.enum(["PWA", "Website"]),
    featured: z.boolean().default(false),
    order: z.number().optional(),
    note: z.string().optional(),
    noteAr: z.string().optional(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: "*.md", base: "src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

export const collections = { books, blog, projects, pages };
