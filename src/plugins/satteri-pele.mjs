import { render } from 'pele';

// Pele needs concrete font names at build time, not CSS var() expressions.
// Match Starlight's --sl-font-system and our custom.css --sl-font-mono stack.
const fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
const fontFamilyMono = 'ui-monospace, "SFMono-Regular", Consolas, "Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans CJK KR", sans-serif';

/** Render Mermaid fences at build time; each compilation gets its own SVG IDs. */
export default function pelePlugin() {
	let diagramIndex = 0;

	return {
		name: 'pele-diagrams',
		code(node, context) {
			if (node.lang !== 'mermaid') return;

			let svg;
			try {
				({ svg } = render(node.value, {
					idPrefix: `pele-diagram-${diagramIndex++}`,
					responsive: false,
					fontFamily,
					fontFamilyMono,
				}));
			} catch (error) {
				throw new Error(
					`Pele diagram in ${context.fileURL ?? 'Markdown'} at line ${node.position?.start.line ?? '?'}: ${error.message}`,
					{ cause: error },
				);
			}

			// rawHtml parses SVG as HTML in both Markdown and MDX, keeping braces literal.
			context.replaceNode(node, {
				rawHtml: `<div class="pele-diagram" tabindex="0" role="region" aria-label="Diagram (scroll horizontally if needed)">${svg}</div>`,
			});
		},
	};
}
