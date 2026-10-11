# NOVA F5-19 · Pizza & Chocolate Equal-Parts Workshop

F5-19 is the final **numbered** engine in the NOVA F5 fraction/decimal/percentage family. This is a **Premium review candidate**; it is not owner-approved GOLD or lesson-shell integrated.

## Open and test

Open `F5/F5-19-pizza-and-chocolate-fraction-contexts.html` in a browser. This is a self-contained HTML build, including NOVA core, fonts, Chalk writing and mascots. Test the four modes: Watch, Guided, Explore and Challenge.

## Premium representations

- **Pizza:** equal-angle sectors of one fixed-size circle, available as 4, 6 or 8 slices. Individual sectors remain exact equal areas.
- **Chocolate:** equal-size rectangular chocolate squares arranged in a grid, with 6, 8 or 12 pieces per whole.
- Both contexts show a whole/reference model and a matching-size serving model, with every selected piece retaining its position/size.
- Explore supports drag-to-serve, drag-back-to-return, Enter/Space to serve, Delete to return, reset, preset changes, and live counts.
- The worked evidence uses **traditional stacked NOVA Chalk fractions**, simplifying, for example, nine twelfths to three quarters.
- Six Guided steps teach whole → equal partitions → selection → mathematical notation → representation transfer → simplification.
- Challenge provides three contextual problems with answer hiding: 1/2 of eight slices, 2/3 of six slices, 3/4 of twelve squares.

## Project structure

This ZIP is an **incremental bank patch** and should be extracted/merged into an existing `bank-v3-neon-chalk` project. It contains the F5-19 built HTML, its editable source, the integrated build script, unchanged shared core files, QA files and screenshots. It deliberately does **not** overwrite or reproduce the original F0/F1/F2 source engines or the previous F5 packages.

Do not update GitHub until owner review and permission. The original bank and GitHub repository have not been changed.

## Rebuild

Within a fully populated current bank directory run `python build/build.py`, which writes `F5/F5-19-pizza-and-chocolate-fraction-contexts.html` with core v3.6.2 CSS/JS embedded. A standalone build from this incremental patch alone is not supported because the shared build script also compiles earlier bank engines.

## Review gates

- Owner visual GOLD approval outstanding.
- Live NOVA lesson integration outstanding.
- Cross-family independent audit outstanding.
- A combined four-width exhaustive QA run was interrupted by a runner timeout after completing 380, 1280 and 320. A separate 768 test suite passed; see QA report for precise coverage.
