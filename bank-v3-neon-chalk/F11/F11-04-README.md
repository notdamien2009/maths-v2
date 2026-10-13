# NOVA F11-04 — Triangle Angle-Sum Tear-Off · Premium Review

**Status:** Owner review candidate, not GOLD-approved. GitHub untouched.

## Contents and installation

Unzip into the existing `bank-v3-neon-chalk/` repository folder. Files are path-relative. This ZIP does **not** replace `core/nova-core.js` or `.css`: it relies on your existing approved F0/F1 core.

- `F11/F11-04-triangle-angle-sum-tear-off.html`: offline, self-contained page, current F0/F1 core already inlined.
- `src/F11-04.js` / `.css`: component-specific source, no shared core modifications.
- `build/F11-04.src.html` and `build/build-F11-04.py`: rebuild from the repository's installed shared core.
- `tests/*-QA.json`, `tests/F11-04-PRODUCTION-MANIFEST.json`: test results and content hashes.
- `shots/F11-04`: desktop/mobile Watch, Guided, Explore, Challenge, and assembled-stage screenshots.

After copying into your local repo, rebuild with `python build/build-F11-04.py` from **inside** the `bank-v3-neon-chalk` folder (or run the script with its full path). No GitHub push is performed.

## Drawing and interaction proof

The triangle is defined by exact vertex coordinates. All three interior angles are computed with dot products and `acos`, with the final angle calculated as `180° − A − B`. Each corner wedge is generated using its original two side rays. All three sectors are **rigidly rotated and translated** to a common point along a straight-line semicircle. Their start and end angles meet without gaps or overlaps; no resizing of a wedge occurs. F0 `NOVA.neonPath`, `neonLine`, `neonRing` and `chalkText` draw the maths. The shipped core lacks F12 `neonShape`, so these are deliberately **not** called or copied into a private core.

Presets: scalene, right, isosceles, obtuse, and quadrilateral transfer (a diagonal makes two triangles).

Four modes: Watch (11 progressive stages), Guided, Explore (independent drag-to-target corner sectors with keyboard Enter/Delete and Escape cancellation), Challenge (5 graded answer-and-reason tasks, including exact triangle geometry for given numerical angles). Reason cards support click, keyboard and drag-to-target.

Mascot: F9-inspired larger dock **inside** the NOVA stage; the separate F0 Sir Bob strip remains below the stage as in earlier engines.

## QA evidence

- Browser / mathematical / responsive: **58/58 passed**, 380px and 1280px.
- Fast pointer drag / snap / re-grab / Escape release: **24/24 passed**, 380px and 1280px.
- Reason-card drag-to-target: **2/2 passed**, 380px and 1280px.
- No reported browser runtime errors or horizontal overflow in tested modes.

Testing uses browser automation and does not replace owner's manual visual/touch stress test. See screenshots and QA files. No claim of GOLD approval until inspected and signed off by owner.
