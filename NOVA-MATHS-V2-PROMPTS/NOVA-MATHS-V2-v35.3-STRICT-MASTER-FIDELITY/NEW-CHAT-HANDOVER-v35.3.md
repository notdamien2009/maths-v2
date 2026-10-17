# NOVA MATHS V2 — NEW CHAT / NEXT LESSON HANDOVER v35.3

We are producing NOVA KS3 Maths lessons through the **four production runs**. The user will normally say "Run 1", "Run 2", "Run 3" or "Run 4" and then proceed to the next lesson; the assistant is responsible for all routine lesson QA. The user reviews the full school year after production, not each individual lesson.

**Required sources:** (1) the approved v35.3 prompts and locked master from `maths-v2/NOVA-MATHS-V2-PROMPTS`, including the derived v35.1 template; (2) the approved immutable local ChatGPT Library snapshot of the complete GitHub `notdamien2009/maths-v2/NOVA-production` F0–F18 folder; (3) previous run deliverables for Run 2/3/4. No live GitHub fetch during individual lesson production. Source must exist for every mapped component/preset; fail if missing.

**Absolute authority:** from the `master/nova-master-LOCKED.html` extract the exact lesson row `LS`, component list `MAP`, and aliases `AL`. For a changed master, regenerate the master SHA and lock; never silently swap. Preserve every mapped component including aliases and canonical F0-12. Reject assistant-selected or recreated visuals/game controllers.

**Specific repeated failure to prohibit:** A Start or Practice question asks about `43.07`, but its native diagram shows source-demo `0`, `250` or an unrelated earlier question's number. All visible Start/Practice/Exit diagrams and all Challenge states must be configured with *that item's own public givens*, keep the answer concealed, and have browser + mathematical screenshot evidence keyed by question ID. This is NOT optional.

**Bob:** full five-stage continuous Board; four distinct explanatory beats per stage (Notice/Predict, Build/Reveal, Explain/Evidence, Generalise). Detailed pupil-friendly reasoning with changing native drawings and accurate TTS/captions, Play/Stop/skip correct, definitions clickable. Never present minimal captions or 'teaching' count as completion.

**4-run boundaries:** Run 1 curriculum/maths/banks; Run 2 native state/narration; Run 3 actual runnable HTML integration; Run 4 exhaustive browser/mathematical QA and repair. Follow `V35.3-MASTER-AND-VISUAL-FIDELITY-CONTRACT.md` and numbered run prompt to completion. Do not call GOLD without the original-source/master/number-visual/bob/game/all-mode evidence. If hardware/audio-only tests remain impossible, report them accurately, but finish every feasible QA task before stopping. Never require owner to perform routine lesson QA.

**Example Y7-001 immutable source test:** F0-12, F2-01, F2-03, F2-04 (decimal preset of F2-03), F2-08. Any missing item is a BLOCKER. New source and original source hashes must match. Use `tools/verify_master_fidelity.py` as an early hard gate; it is not a substitute for the browser audit.


**Upstream source lock (17 October 2026):** `notdamien2009/maths-v2/NOVA-production` supersedes the old F0–F3 ZIP. Preserve the original F0–F18 files, exact LS/MAP/AL mappings and aliases, and F0-12 provenance. `F5-08` is specified as a lesson-configurable multiplication preset of F5-03 Precision Area Model; test that the preset is genuinely present before claiming it works. The current preflight's `--source-zip` input may point to a ZIP made from the complete local Library snapshot, not the superseded subset.
