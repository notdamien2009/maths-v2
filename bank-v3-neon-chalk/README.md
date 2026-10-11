# NOVA F5-16 · Reverse Percentages · Premium Edition candidate

## Files
- `F5/F5-16-reverse-percentage-preset.html` — standalone interactive browser review build.
- `build/F5-16.src.html` — editable source with `@@CSS@@` and `@@JS@@` placeholders.
- `core/nova-core.js` and `.css` — unmodified NOVA v3.6.2 foundation required to rebuild.
- `scripts/build_f516.py` — self-contained build; run from any folder with `python scripts/build_f516.py`.
- `shots/` — desktop and mobile screenshots for Watch, Guided, Explore and Challenge plus percentage edge cases.
- `tests/` — Python Playwright QA script and captured results.

## Integration
F5-16 is logically a preset/adapter of future **F4-06**. The actual F4-06 master engine was not present in the working bank, so F5-16 presently provides its own component entry point while reusing the locked shared NOVA core. When F4-06 is delivered, mount this as its reverse-percentage preset without changing the F5-16 identifier. Do **not** merge this code blindly into F4-06.

To register with your integrated bank build, add the source `build/F5-16.src.html` to the F5 build list with output path `F5/F5-16-reverse-percentage-preset.html`, using the same CSS/JS injection and validation as F5-15. The ZIP does not modify or replace the existing bank.

## Mathematical rules
Known final £k = p% of original. Original = k ÷ (p/100). The 100% reference stays fixed; p may range from 10% to 250% in 0.5% steps; zero multiplier is deliberately rejected because the original is not recoverable by division. Bar lengths reflect the original scale; extra 100% amounts use successive equal-length bands. Challenge conceals the original amount while keeping the proportions visible.

## Acceptance
- Final post-change responsive and interaction regression: 120/120 checks passed.
- Earlier extended pre-unitary-panel regression: 234/234 checks passed.
- Integrated bank build passed; standalone output identical byte-for-byte.
- No page JS errors or horizontal overflow in the completed tests.
- Still requires owner GOLD visual approval and live lesson-shell integration.

No GitHub changes were made.
