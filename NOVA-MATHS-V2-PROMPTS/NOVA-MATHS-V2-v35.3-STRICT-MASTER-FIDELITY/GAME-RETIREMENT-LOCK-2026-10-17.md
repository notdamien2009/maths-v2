# NOVA Maths V2 — Standalone Lesson Games Retired (17 October 2026)

**CURRENT AUTHORITATIVE PRODUCTION RULE**

The original list of 202 lessons carried historical one-off game ideas. All of these have been removed from the production master. Do not create or request a named activity, extra game, bespoke minigame, game-specific canvas/visual, or additional template stage in Runs 1, 2, 3, or 4. Such historical ideas are not release gates or blockers.

**What remains unchanged**

- Learn Challenge runs via the canonical original **F0-12** shared game wrapper/controller, with scoring, lives, streaks, hints, Bob feedback, randomised lesson-specific question banks, victory and replay.
- All authoritative `MAP` component IDs, `AL` alias resolutions/presets, F0–F18 mathematical apparatus, Watch, Explore, Examples Guided, Bob Board, Start, Practice, Exit, original approved lesson template, TTS, quality gates and assessment requirements.
- A visual component may itself be called 'rolling ball', 'game', 'activity' or similar by its original source name: these are approved teaching apparatus, *not* permission to invent a second standalone lesson game.

**Source consistency**

- Edited master: `master/nova-master-LOCKED.html` and `NOVA-production/00-master/nova-master-updated.html` (byte-identical).
- New master SHA-256: `4057fef67c337325c682e9c0cb61514ba6ce32f6075c9179a36c00d259d06e86`
- All 202 `LS` game-idea slots are empty for backward compatibility; 202 mapped lesson objectives, `MAP` and `AL` are intact.
- `master/master-curriculum-map-LOCKED.json` has no `namedActivity` field; it retains all component mappings and aliases.
- The `tools/verify_master_fidelity.py` gate now checks the real component/alias/F0-12 coverage and rejects obsolete `namedActivity` / `namedActivityExecution` evidence fields, without requiring a standalone game.
- Recalculate new per-lesson lock files from these edited source files. Existing lock files referencing the old master SHA are historical and do not validate against this master.

**Use in other chats**: v35.3 core standards remain; this 2026-10-17 retirement amendment supersedes any old clause instructing the assistant to produce a lesson-specific named game.
