import { createMarkdownProcessor } from '@astrojs/markdown-remark';

// Share initialization across components, including concurrent renders.
export const markdownProcessor = createMarkdownProcessor({
  smartypants: false,
  syntaxHighlight: false,
});
