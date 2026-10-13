# NOVA F8-15 · Misconception Spotter — component specification

## Purpose and provenance

F8-15 from `00-master/NOVA-MASTER-FOR-OTHER-AI.md`, Family F8, Run 15. New presentation engine on the existing F0 neon/chalk rendering and interaction system; no changes to GitHub, F0 source or prior F8 components.

- KS3 lessons: Y7-012 (negative number multiplication/division); Y7-018 (priority of operations); Y8-018 (multi-step and compound inequalities).
- Six named, reusable presets: Y7-012-A/B, Y7-018-A/B, Y8-018-A/B.
- Modes: Watch, Guided, Explore and Challenge (F0 bank shell).
- Shared drawing primitives: `NOVA.svg.root`, `NOVA.neonBox`, `NOVA.neonLine`, `NOVA.neonRing`, `NOVA.chalkText`, `NOVA.scene.helperStrip`.
- Shared drag helper: `NOVA.ui.svgDrag`. Keyboard: inspect buttons, row Enter, correction buttons or correction-card Enter. Escape/Delete on lens restores previous selection.
- Presentation: four glass-neon working cards and a draggable magnifying lens, with red lens-return area, and three draggable correction cards. A located line only unlocks fixes when it is truly wrong.
- Mathematical success: both the exact error location and the correct mathematical replacement must be identified. All other statements stay unchanged. Incorrect line guesses and misconception-preserving replacements are rejected, with specific feedback.
- Teaching: six named teaching states (Read → Follow → Scan → Locate → Repair → Verify), step-specific Sir Bob narration and pose changes through existing NOVA helper/mascot system.
- Events: fixed declared value keys `preset`, `locate`, `replace`, `undo`, `reset`, `hint`, `check`; `mode`, `step`, `correct`, `hintUsed` from existing core.
- GCSE extension: proof debugging and algebraic reasoning using same visual/feedback model.

## Preset mathematical evidence

| Preset | Faulty step | Correct replacement |
|---|---|---|
| Y7-012-A | negative × negative = negative | negative × negative = positive |
| Y7-012-B | unlike division signs give positive | unlike signs give negative |
| Y7-018-A | 6 + 10 = 40 | 6 + 10 = 16 |
| Y7-018-B | 4 × 4 = 8 | 4 × 4 = 16 |
| Y8-018-A | dividing an inequality by −2 keeps direction | direction must reverse: x < −4 |
| Y8-018-B | −6 + 4 = −10 | −6 + 4 = −2 |

The intentional wrong line is the third of four working cards in these six teaching presets; the other cards present accurate set-up, valid preceding working, or instructions to check rather than additional false claims. Correction choices are shuffled between presets so the correct answer is not always shown first.

## Accessibility and constraints

SVG provides a descriptive title, row elements have accessible names and keyboard equivalents, feedback has a live region, `prefers-reduced-motion` is respected. Challenge does not reveal the correction until the error is found; final feedback appears after the pupil applies the correct repair. Tested widths: 360, 380, 414, 760, 1024, 1280 and 1536 CSS px.
