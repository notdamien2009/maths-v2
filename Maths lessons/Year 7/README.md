# NOVA Maths V2 — Year 7 audited lesson archive

**Status: INDEX ONLY — 21 HTML lessons are NOT uploaded to this Git branch.**

Prepared 24 October 2026. The corrected source-of-truth lessons 001–021 are saved in the ChatGPT Library folder:

`/NOVA-MATHS-V2-LESSON-OUTPUTS/Y7-AUDITED-001-021-2026-10-24/`

That Library folder contains:
- 21 standalone `NOVA-Y7-NNN-AUDITED.html` files
- `NOVA-Maths-Y7-001-021-ALL-REPAIRED.zip`
- `AUDIT-REPORT.md`
- `LESSON-MANIFEST-2026-10-24.json` (SHA-256 per lesson)

The GitHub connector could not upload a 6.7 MB HTML lesson in this session (transport failure). Do not assume the HTML files exist in this branch because the manifest does.

## Completion gate

Before merging any archive changes into `main`, verify:
1. All 21 full HTML files are present under `Maths lessons/Year 7/`.
2. SHA-256 hashes equal the values in `LESSON-MANIFEST-2026-10-24.json`.
3. No files in `NOVA-production/F0`–`F18` or the master runtime changed.
4. Live audio/TTS and deployed interactions are independently tested if GOLD is claimed.

Keep subsequent audited versions labelled/date-stamped; do not overwrite the sole known-good snapshot before verifying replacements.
