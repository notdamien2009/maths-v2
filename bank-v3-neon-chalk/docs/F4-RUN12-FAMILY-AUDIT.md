> **CURRENT F0–F18 STATUS (2026-10-14): APPROVED FOR LESSON PRODUCTION.** Any older component-library sign-off, blocker, release gate or pending-approval statement below is historical and superseded by [00-master/PRODUCTION-RELEASE-F0-F18-2026-10-14.md](../00-master/PRODUCTION-RELEASE-F0-F18-2026-10-14.md). All functional QA and mathematical correctness requirements still apply.

# NOVA Maths F4 — Run 12: Family Final Audit

**Audit date:** 11 October 2026  
**Status:** REVIEW / CORRECTIONS IDENTIFIED — NOT OWNER GOLD.  
**Source:** 11 actual F4 production ZIPs recovered and compared, plus current read-only `notdamien2009/maths-v2` GitHub snapshot (HEAD `48a7eb7`). **No repository or existing engine files changed.**

## Scope and coverage

The F4 master plans 12 entries. They are represented by **11 standalone F4 review pages** and one integrated preset within F4-08: F4-01–09, F4-11–12 are distinct review HTMLs; F4-10 is an F4-08 equation-translator preset. F4-05 is a standalone F4 review page derived from the existing F5-11 maths engine—not an independently forked maths engine.

| Run | Entry | Role | Status |
|---|---|---|---|
| 01 | F4-01 | Part–Whole Bar | On GitHub and archived; owner visual approval pending |
| 02 | F4-02 | Comparison Bar | On GitHub and archived; owner visual approval pending |
| 03 | F4-03 | Cuisenaire-Rod Builder | On GitHub and archived; owner visual approval pending |
| 04 | F4-04 | Multi-Step Bar Model | On GitHub and archived; owner visual approval pending |
| 05 | F4-05 | Fraction-of-Amount Bar · F5-11 preset | On GitHub and archived; owner visual approval pending |
| 06 | F4-06 | Percentage Bar | On GitHub and archived; owner visual approval pending |
| 07 | F4-07 | Ratio Bar | On GitHub and archived; owner visual approval pending |
| 08 | F4-08 | Algebra Bar · includes F4-10 | On GitHub and archived; owner visual approval pending |
| 09 | F4-09 | Before-and-After Bar | On GitHub and archived; owner visual approval pending |
| 10 | F4-11 | Word-Problem Highlighter | Local ZIP only; not on GitHub as checked; owner visual approval pending |
| 11 | F4-12 | Rates Tape Diagram | Local ZIP only; not on GitHub as checked; owner visual approval pending |

## New independent cross-family browser smoke

- **11 standalone HTML engines × 2 viewports (380px and 1280px) × 4 modes = 88 checks**.
- Passed **88/88**: Watch, Guided, Explore and Challenge tabs all activated; relevant stage SVGs rendered; **0 JavaScript page exceptions; 0 document-wide horizontal-overflow failures**.
- Method: headless Chromium via Playwright using document `set_content` because navigation to local `file://` is administratively blocked in this environment. Reduced-motion emulation was used for deterministic smoke. The test data is in `tests/F4-FAMILY-RUN12-RESULTS.json`.
- **Limits:** A document-level no-overflow result does not prove every SVG annotation lies within its visual apparatus. This family-wide run does **not** repeat every engine's original high-speed mouse stress and complete maths challenge suites. Individual ZIPs contain those earlier reports; do not represent them as rerun by Run 12. Native-device touch and screen-reader operation, integration into the v21 lesson shell, and owner sign-off remain outstanding.

## Findings, ordered by priority

### P1 · Build/packaging compatibility — ACTION REQUIRED BEFORE NEXT REBUILD

1. **Run 04 and Run 08 ZIPs contain shared-core files** (`core/nova-core.js` and `core/nova-core.css`). This contradicts the component-only delivery rule. Both ZIPs carry core JS SHA-256 `1e3a118e…` (1,075,513 bytes) and CSS SHA-256 `eaf043ca…` (83,805 bytes).
2. **The GitHub core has since changed:** as of `48a7eb7`, Git lists core JS at 1,074,164 bytes and CSS at 83,764 bytes. Therefore blindly merging the old ZIP's `core/` is unsafe. **Do not overwrite current `core/` from Run 04 or Run 08.**
3. **F4 rebuilding is pinned to the older core.** Multiple `build/build-f4-xx.py` scripts SHA-lock the old core; earlier scripts additionally refer to the old Git blob SHAs. They may refuse to rebuild after the Git core changes. Do not disable integrity checks. Before new F4 revisions, compare old/new shared-core APIs, approve a supported current-core baseline, update scripts with reviewed correct checksums, and run regression tests.
4. `build/build.py` in the current Git version is not a universal F4 builder. Use the per-engine `build/build-f4-xx.py` route after its core validation is resolved. The run-specific HTML files themselves currently load under browser smoke testing.

### P2 · Mobile teaching clarity — F4-12

At 380px, the explanatory line for total distance is visually long and extends outside the intended tape/model area in the archived `shots/F4-12/F4-12-380-watch.png`. This is **not** detected by document-wide horizontal-scroll checks. Fix only that caption/annotation: shorten or wrap, allow line-specific space, and verify Watch/Guided/Explore/Challenge at 380 and 1280. Do not alter the mathematics or F0 design tokens.

### P3 · Readability review — F4-06

The 380px percentage-bar scene is information-dense, especially at higher percentage presets. Check labels on the real learner device to confirm no crowding or tiny values. This is a **manual review recommendation**, not an automated failure.

## Passed and protected design rules

- F0 Neon Tube apparatus, NOVA Chalk drawing/writing, existing role colours, neon ring mathematical markers, and mascot staging retained across the review pack.
- F4-05 uses F5-11's fraction maths; F4-10 stays an integrated F4-08 translator preset. Traditional stacked NOVA Chalk fractions remain the approved notation, despite outdated `approved NOVA Chalk stacked fraction notation` text elsewhere in older master prompts.
- All original run QA reports inspected report zero failures for their stored checks. These are **archived run evidence**, not fresh Run 12 stress passes.
- Screenshots side by side included: `shots/F4-family/F4-FAMILY-380-WATCH-CONTACT-SHEET.jpg` and `...1280-WATCH-CONTACT-SHEET.jpg`.

## Next production gate

1. Correct F4-12's mobile explanation line and recapture responsive evidence.
2. Review the current-Git shared-core SHA changes and decide on a safe, consistent F4 rebuild contract—without overwriting or weakening the canonical core.
3. Repeat high-speed pointer stress on any component whose source/rebuild is changed.
4. Complete owner's side-by-side 380px and 1280px review. **Only the owner can grant F4 GOLD approval.**

**Delivery scope:** This Run 12 ZIP is an **audit-only additive pack**: gallery, reports, machine-readable evidence and actual contact sheets. It does not replace any F4 engine, shared core, shell, or existing handover. You control GitHub updates.
