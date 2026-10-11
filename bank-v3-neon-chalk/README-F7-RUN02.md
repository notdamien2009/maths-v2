# NOVA F7 Run 02 — F7-02 Zero-Pair Animation

**Review candidate. NOT GOLD-approved.**

Open `F7/F7-02-zero-pair-animation.html` for a standalone offline preview with the complete original NOVA F0 core inlined. It is not a replacement for F7-01.

Files in this pack:

- `F7/F7-02-zero-pair-animation.html` — standalone production review HTML
- `src/F7-02.js` and `.css` — editable engine
- `build/F7-02.src.html` — template that uses the four `@@` placeholders
- `build/build-f7-02.py` — incremental build against the current, **unchanged** `core/nova-core.js/css` already in your bank
- `docs/F7-02-SPEC.md` — maths teaching and build specification
- `shots/F7-02/` — visual evidence at desktop and mobile sizes
- `tests/` — browser, physical drag and normal/reduced-motion stress regression scripts/results
- `QA-REPORT-F7-02.md` — pass evidence and pending sign-off gate

## Integration

Copy the pack's top-level `bank-v3-neon-chalk/` contents into your local repository's existing `bank-v3-neon-chalk/` folder, preserving unrelated files. Do not replace the existing core. Then run:

```bash
cd bank-v3-neon-chalk
python build/build-f7-02.py
```

This creates the same self-contained engine HTML without modifying any other engine. Review the HTML offline in a browser. Add to your family gallery after personal acceptance. Do not push to GitHub until the owner explicitly requests it.

## Important

F7-02 makes the zero-pair cancellation itself the learning interaction, not a cosmetic animation or an extra F7-01 tile recolour. Challenge requires mathematically valid physical cancellation before the signed answer can be submitted.
