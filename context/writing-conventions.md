## Writing conventions

How Korean and English terms are marked in the chapters under `src/content/docs/chapter/`.

Backticks mean "this is the term being talked about". Backticks that contain only Korean are rendered as a Korean term (`<span lang="ko" class="ko-term">`) by `src/plugins/satteri-korean.mjs`. Anything else in backticks stays inline code. Both share one highlight color, set in `src/styles/custom.css`.

| Situation | Rule | Example |
|---|---|---|
| Korean inside an English sentence | Always backticks | ``Use `나` instead of `저`.`` |
| English meaning, where the sentence pairs it with a Korean term | Backticks, no quotes around them | `` `지만` means `but` `` |
| English word or phrase anywhere else | Plain text, or quotes for a quoted phrase. No bold as a highlight | `by asking "Shall we?"` |
| Grammar formulas | Backticks around the whole formula, sentence case | `` `Verb stem + 겠다` `` |
| Headings | No backticks. Korean plain, English meanings in quotes | `## Saying "because" with (으)니까` |
| Lines that start with Korean: vocabulary lists, derivations with + and → | No backticks. Bold for the result | `나 + 의 → 나의 → **내**` |
| Inline examples after a colon, long enumerations | No backticks | `For example: 살다 → 사니까` |
| Translations in parentheses | Plain | `` `바라다` (to hope) `` |
| `<Sentence>` examples and tables | No backticks | |