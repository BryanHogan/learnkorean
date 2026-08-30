# Korean Inline Markup Implementation Plans

## Goal

Add concise, explicit markup for Korean text in lesson content without changing the established meaning of Markdown backticks.

The preferred authoring syntax is:

```md
- I wrote a letter with a pencil. → =편지를 연필로 썼어요.=
```

It should render as:

```html
<span lang="ko" class="korean-example">편지를 연필로 썼어요.</span>
```

## Requirements

- Preserve the existing behavior of backticks and all other standard Markdown syntax.
- Only recognize paired, inline `=` delimiters.
- Require at least one Hangul character between the delimiters.
- Do not allow a marked value to span multiple lines.
- Do not process inline code or fenced code blocks.
- Keep unmatched delimiters as ordinary text.
- Generate semantic Korean markup with `lang="ko"`.
- Apply presentation through the shared `.korean-example` CSS class.
- Keep the implementation build-time-only, with no client-side JavaScript.

## Plan A: Add `=…=` with a local Remark transform

This is the recommended plan for the current content. It adds one narrowly scoped rule to the Markdown pipeline and does not reinterpret an existing Markdown construct.

### 1. Add the AST utility

Install `mdast-util-find-and-replace` as a direct dependency:

```sh
npm install mdast-util-find-and-replace
```

### 2. Create the Remark plugin

Create `src/plugins/remark-korean-equals.mjs`:

```js
import { findAndReplace } from 'mdast-util-find-and-replace';

const koreanEquals =
	/(?<![=])=([^=\r\n]*\p{Script=Hangul}[^=\r\n]*)=(?![=])/gu;

export default function remarkKoreanEquals() {
	return (tree) => {
		findAndReplace(tree, [
			koreanEquals,
			(_match, content) => ({
				type: 'korean',
				data: {
					hName: 'span',
					hProperties: {
						lang: 'ko',
						className: ['korean-example'],
					},
				},
				children: [{ type: 'text', value: content }],
			}),
		]);
	};
}
```

This transforms Markdown text nodes into structured nodes instead of injecting an HTML string. Normal HTML escaping therefore remains part of the Markdown rendering pipeline.

### 3. Register the plugin

Update `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import remarkKoreanEquals from './src/plugins/remark-korean-equals.mjs';

export default defineConfig({
	site: 'https://tolearnkorean.com',
	markdown: {
		remarkPlugins: [remarkKoreanEquals],
	},
	integrations: [
		starlight({
			// Existing Starlight configuration.
		}),
	],
});
```

The new `markdown` property should be added without replacing the existing Starlight configuration.

### 4. Add shared styling

Add a rule to `src/styles/custom.css`. The exact values should be chosen after comparing the result with existing inline-code presentation.

```css
.korean-example {
	font-family: var(--sl-font-mono);
	background-color: var(--sl-color-gray-6);
	border-radius: 0.25rem;
	padding: 0.125rem 0.25rem;
}
```

### 5. Verify behavior

Add a temporary fixture or automated tests covering the following cases:

```md
=한국어=                 <!-- transformed -->
=편지를 연필로 썼어요.= <!-- transformed -->
=English text=            <!-- unchanged -->
`=한국어=`                <!-- unchanged -->
==한국어==                <!-- unchanged -->
=한국어                  <!-- unchanged -->
```

Then run:

```sh
npm run build
```

Inspect the generated page and confirm that:

- The build succeeds without MDX errors.
- The generated element is `<span lang="ko" class="korean-example">`.
- Inline and fenced code are unchanged.
- Light and dark themes both have sufficient contrast.
- Long Korean sentences wrap naturally.

### Limitations

- Nested Markdown inside `=…=` is not supported. For example, `=편지를 **연필로** 썼어요.=` will not be treated as one Korean span because Markdown splits it into multiple syntax-tree nodes.
- The syntax is project-specific and will appear as literal equals signs on Markdown renderers that do not load the plugin.
- Literal examples of the syntax should be placed in inline code, such as `` `=한국어=` ``.
- If richer nested content or formal delimiter escaping becomes necessary, replace the AST transform with a Micromark syntax extension.

## Plan B: Add a named Markdown directive

Use a dedicated directive instead of punctuation delimiters:

```md
:ko[편지를 연필로 썼어요.]
```

Implementation outline:

1. Install `remark-directive`.
2. Register it in `markdown.remarkPlugins`.
3. Add a local transform that recognizes the `ko` text directive.
4. Set `data.hName` to `span` and add `lang="ko"` and `class="korean-example"`.
5. Reuse the CSS and verification steps from Plan A.

Advantages:

- The intent is explicit and searchable.
- It is less likely to collide with ordinary prose.
- The syntax can be expanded with attributes later.

Disadvantages:

- It is more verbose than `=…=`.
- It introduces a directive dependency and project-specific syntax.

## Plan C: Add a reusable MDX component

Create a component used as:

```mdx
<Ko>편지를 연필로 썼어요.</Ko>
```

The component would render:

```astro
<span lang="ko" class="korean-example"><slot /></span>
```

Advantages:

- Explicit behavior with no Markdown parser extension.
- Easy to enhance with properties such as romanization or audio.
- Supports nested MDX content.

Disadvantages:

- Each MDX document normally needs to import the component.
- The authoring syntax is visually heavier than `=…=`.

## Plan D: Create a structured example component

If examples later gain audio, romanization, vocabulary notes, or reveal controls, use a higher-level component:

```mdx
<Example
	english="I wrote a letter with a pencil."
	korean="편지를 연필로 썼어요."
/>
```

Advantages:

- Guarantees consistent structure and styling.
- Provides one place to add learning features.
- Can enforce `lang="ko"` without custom Markdown parsing.

Disadvantages:

- Less pleasant for simple prose authoring.
- Excessive if examples remain plain bilingual lines.

## Plan E: Keep backticks unchanged

Continue writing Korean text as inline code:

```md
`편지를 연필로 썼어요.`
```

This requires no implementation. If desired, a plugin could later add `lang="ko"` to Hangul-containing inline code without changing the generated element type.

Advantages:

- No new syntax or authoring changes.
- Retains the existing visual treatment.

Disadvantages:

- Korean natural-language content remains represented by `<code>`.
- Korean examples and genuine code share the same element and styling rules.

## Recommendation

Start with Plan A because `=…=` is concise, additive, and sufficient for the current plain-text examples. Keep the plugin narrowly constrained and document the syntax for contributors.

If Korean examples later need nested formatting or interactive learning features, migrate to Plan C or Plan D rather than making the delimiter grammar increasingly complex.
