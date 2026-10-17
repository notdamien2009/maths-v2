# fix3 (2026-10-17): the 3 open issues only
This folder holds changed files only, in release layout. Copy them over NOVA-F0-F3-production (the F0–F4 merge plus the F5 merge). Hashes are in `source-hashes.fix3-entries.json`. In `integration/component-adapters.json`, each changed row (F4-05, F4-08, F4-10 and F5-01…F5-19) has a new `sha256` and a `previous_sha256`.

1. **F4-10 still view band.** Fixed in `F4/F4-08-algebra-bar.html`; F4-10 is a preset of F4-08.
   - In the lesson still view the translator now gets `compact:true`. The viewBox ends 34 units under the equation slots: 0 0 1000 788 instead of 898.
   - The empty band went from 141 to 31 units at 390, 1024 and 1440 inside the template.
   - Style, connectors and the interactive view are unchanged.
2. **F4-05 consistent with the audited F5-11.**
   - The engine was rebuilt from the audited F5-11, with the F4-05 bar-preset additions put back on top. Guided/Watch now use each step's own lesson values (a/n/d).
   - It keeps the F4 `data.lesson` hook and validates with both the F4 and F5 contracts.
   - It uses the same F5 runtime and relayout.
3. **F5 resize.** F5 engines choose phone or desktop geometry from innerWidth when they draw, and inside the template the iframe is narrow at the first draw, so even 1440 got the phone layout. `integration/nova-f5-runtime.js`, which is embedded in every F5 file and in F4-05, now does the following:
   - records each stage's last top-level draw;
   - replays it when the width crosses that engine's breakpoint (670, or 820 for F5-01), 120 ms after the resize stops;
   - draws the replay with reduced motion, re-applies finish/conceal and keeps the F0-12 game host in place.
   - Each engine only gets one `record` line and its breakpoint.

Test results:

| Test | Before | After |
|---|---|---|
| New Bot's F5 test, 18 engines | – | 2571/2571 checks, 0 page errors |
| Resize test, F5 (390/1024/1440, plus Challenge) | 108/288 | 288/288 |
| Resize test, F4-05 | 6/16 | 16/16 |
| F4 semantic test (F4-05, F4-08, F4-10) | – | 33/33 each |

Scripts are in `audit/fix3-2026-10-16/tests/`, results in `results/`, and screenshots in `screenshots/{before,after}/`.
