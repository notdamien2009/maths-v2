# F5 owner-approved fraction notation lock — 10 October 2026

This owner decision SUPERSEDES the old `fraction design TBD` wording in older bank/master copies.

- Display written fractions as **traditional stacked mathematical fractions**, with the numerator above a horizontal fraction bar and the denominator beneath it.
- Use the **NOVA Chalk writing** family for written maths and **NOVA Chalk drawing** for labels inside the SVG apparatus. Maintain colour roles and accessible contrast.
- Use the existing `NOVA.mt.render('\\frac{n}{d}')` for standard HTML maths. In SVG, compose fractions from `NOVA.chalkText` and `NOVA.neonLine` (no new font or drawing primitive).
- Inline `n/d` is permissible only for compact controls when stacked notation would not fit, never as the primary teaching evidence.
- Do not emit the `nv-frac-tbd` placeholder in new production components.
- This is a visual formatting lock, not a mathematical curriculum change.

The upstream bank/master ZIP is preserved; this file provides an explicit production override in this candidate pack.
