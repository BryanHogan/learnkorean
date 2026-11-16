const hangul = /\p{Script=Hangul}/u;
const latin = /\p{Script=Latin}/u;

/** Korean-only means Hangul plus punctuation, e.g. `(을/ㄹ)까요`; formulas with English stay code. */
export function isKoreanOnly(value) {
	return hangul.test(value) && !latin.test(value);
}

/** Render Korean-only inline code as a Korean term instead of computer code. */
export default function koreanPlugin() {
	return {
		name: 'korean-terms',
		inlineCode(node, context) {
			if (!isKoreanOnly(node.value)) return;
			// Changing only the element keeps the value as escaped text, inline in its parent.
			context.setProperty(node, 'data', {
				hName: 'span',
				hProperties: { lang: 'ko', className: ['ko-term'] },
			});
		},
	};
}
