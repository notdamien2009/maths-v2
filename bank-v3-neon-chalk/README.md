# NOVA F3-09 · Square and Cube Builders · Premium Review

**Build**: 2026-10-10. **Status**: Review only — not owner-approved GOLD.

## Open

Open `F3/F3-09-square-and-cube-builders.html` directly. It includes its own CSS, JavaScript, embedded F0 mascots and chalk fonts and requires no network access.

## Specification card

- **Maths purpose**: Prove a square has n × n unit tiles and a solid cube contains n layers of n × n unit cubes; connect the counts to n², n³ and inverse square/cube roots.
- **Year groups**: Years 7, 8 and 9; GCSE link through roots and fractional indices.
- **Parameters**: Square side 2–5, cube side 2–4, whole-number unit tiles/cubes. Two separate 2D and 3D apparatus layouts.
- **Presets**: Y7-017 (`3²`); Y8-001 (`3³`); Y9-002 (`4³`); Y9-003 (`3³`, with `27^(1/3) = 3` shown with a stacked fraction).
- **Named teaching steps**: One row → complete square → one layer → stacked cube → power/root connection. Sir Bob's narration is in each step; the F0 mascot dock uses short encouragement.
- **Interactions**: F0 SVG drag a unit to the highlighted next grid space; grab completed tiles/cubes and drag back to red Remove; keyboard controls Add unit, Fill row, Fill layer, Undo and Reset. Four modes: Watch, Guided, Explore, Challenge.
- **Correct answer**: The complete spatial configuration AND the correctly checked total; Challenge stages `2²=4`, `2³=8`, `3³=27`.
- **Misconceptions**: Confusing square area with volume, treating `n³` as `n × 3`, stopping after one n² layer, incomplete shape, roots not being inverse powers.
- **GCSE extension**: Fractional indices, roots, exact integer powers through F3-10/F3-11.

## Structure

- `F3/`: finished standalone HTML
- `src/`: component JS/CSS
- `core/`: unmodified canonical F0 core (same SHA256 as F3-08)
- `build/`: source template and deterministic packer
- `shots/`: actual Chromium screenshots from 380px and 1280px, plus mode/preset images
- `tests/`: browser checks, mathematical stress, normal and reduced-motion fast-drag, cancellation and machine-readable outputs
- `QA-REPORT.md`: evidence per guard rule and outstanding acceptance gates

The previous F3 engines and all F0/F1/F2/F5 engines are unchanged. Do not mark GOLD until visually inspected and approved.
