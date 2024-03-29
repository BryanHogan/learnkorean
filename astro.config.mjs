import { defineConfig } from 'astro/config';
import { remarkReadingTime } from './remark-reading-time.mjs';
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://tolearnkorean.com",
  integrations: [sitemap()],
  markdown: {
    remarkPlugins: [remarkReadingTime],
  },
});