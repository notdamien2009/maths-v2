# NOVA F5-02 · Precision sector circle · Premium rebuild

A working component, not a mockup. Preserve F0/F1 Neon Tube + NOVA Chalk design and the previous F5-02 Precision Dial direction.

## Open

Open `F5/F5-02-fraction-circles.html` in a browser. It is self-contained.

## Explore

Choose a preset, then drag the sector pieces (halves through eighths) from the tray into the original circle. A sector snaps into the next empty angle. Only the same equal-sized pieces may be used until the circle is cleared. To remove, drag a fitted wedge back to the tray, focus one and press Delete, or use the panel button. Full circles reject further pieces. Change the subdivision factor ×2 or ×3 to compare the same shaded area with more parts.

## Build

The package uses exactly one shared core stylesheet and one shared JavaScript file. Source `build/F5-02.src.html` is compiled by `python build/build.py`, which includes F5-01 and the F0 foundation, or by `python build/build_f502.py` in the development workspace. The canonical bank source was not changed. The bundled core is the patched v3.6.2 working copy previously supplied with F5-01.

The HTML works as a standalone file because the bank build inlines the shared core and embedded helper artwork. Do not split or replace the embedded NOVA Chalk assets with different fonts. Do not treat the earlier `fraction design TBD` notation as active; stacked NOVA Chalk fractions are the owner-locked rule.

## Files

- `build/F5-02.src.html`: editable component source, including local CSS and SVG drawing code.
- `F5/F5-02-fraction-circles.html`: finished component, all modes.
- `core/`: v3.6.2 working core with inherited drag pointer-capture fix.
- `build/build.py`: current build entry including F5-01/F5-02 and filter validations.
- `shots/F5/`: Watch/Guided/Explore/Challenge screenshots at both screen sizes.
- `tests/`: browser interaction QA scripts and logs.

## Not yet claimed

Not yet owner-approved GOLD, not yet integrated into a NOVA live lesson, and not yet merged into the user's upstream bank.
