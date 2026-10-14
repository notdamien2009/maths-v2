# NOVA F6-14 · Ratio and Fraction Translator — specification

**Purpose:** pupils translate a two-part ratio `a:b` to fractions `a/(a+b)` and `b/(a+b)` using explicit equal-part bars.

**Curriculum:** Year 7 Y7-059 Sharing in a ratio, with three additional named variations. GCSE extension to three-part ratios (planning only; not implemented as a three-part engine).

**Parameters:** integer positive `a` and `b`, pair names, context, mode, teaching step, challenge placements. Four presets: `Y7-059`, `Y7-059-garden`, `Y7-059-study`, `Y7-059-points`.

**Teaching steps:** (1) notice two groups, (2) form one whole, (3) count denominator, (4) translate first fraction, (5) translate second fraction, (6) prove they add to one whole. Every step carries a Sir Bob narration slot and mascot pose.

**Interactions:** draggable traditional stacked fraction tags snap into A/B target zones with the original `NOVA.ui.svgDrag` helper. Visual red removal tray; focus card then press `A` or `B` to place, `Delete` to remove; mouse and keyboard covered by tests. Watch/Guided use shared F0 animation timeline, scrub, step and reset. Explore lets pupils place and check; Challenge checks both correct fractions before revealing them.

**Misconceptions:** counting only the opposite group for a denominator; reversing A/B; failing to use total equal parts; mistaking shares for amounts; assuming fractions are independent of the whole.

**Notation lock:** true stacked mathematical fractions with chalk numerators and denominators and a horizontal bar, plus the F0 `NOVA.mt.render('\\frac{...}{...}')` for evidence cards. Older `approved NOVA Chalk stacked fraction notation` wording in the master is superseded by `F5/F5-FRACTION-NOTATION-LOCK.md`.

**Design:** copy no shared F0 files into update package. Approved neon tubes, font tokens, glow and colour roles. No glyph decoration, no new filters, mascot and Sir Bob via original F0. Mobile 380px, desktop 1280px.

**Assessment events:** `value`, `correct`, `step`, `hintUsed`; usual F0 `mode` and timeline events. Input/drag traps emit precise feedback.

**Status:** premium review candidate. Owner signoff, native-touch audit and live lesson integration remain pending. Browser tests conducted with reduced-motion test context; animated timing on a physical device remains to be reviewed.
