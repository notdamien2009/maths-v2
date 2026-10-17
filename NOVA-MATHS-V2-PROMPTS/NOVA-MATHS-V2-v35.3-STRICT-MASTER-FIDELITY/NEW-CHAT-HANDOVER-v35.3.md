# NOVA MATHS V2 — NEW CHAT / NEXT LESSON HANDOVER v35.3

We are producing NOVA KS3 Maths lessons through the **four production runs**. The user will normally say "Run 1", "Run 2", "Run 3" or "Run 4" and then proceed to the next lesson; the assistant is responsible for all routine lesson QA. The user reviews the full school year after production, not each individual lesson.

**Required attachments:** (1) this v35.3 prompts ZIP (includes locked master and approved derived v35.1 template), (2) current approved original NOVA component source ZIP for the families used by the lesson, (3) previous runs' deliverables for Run 2/3/4 if not already in context. No GitHub fetch. Source must exist for every mapped component; fail if missing.

**Absolute authority:** from the `master/nova-master-LOCKED.html` extract the exact lesson row `LS`, component list `MAP`, and aliases `AL`. For a changed master, regenerate the master SHA and lock; never silently swap. Preserve the original named activity and every mapped component including aliases and canonical F0-12. Reject assistant-selected or recreated visuals/game controllers.

**Specific repeated failure to prohibit:** A Start or Practice question asks about `43.07`, but its native diagram shows source-demo `0`, `250` or an unrelated earlier question's number. All visible Start/Practice/Exit diagrams and all Challenge states must be configured with *that item's own public givens*, keep the answer concealed, and have browser + mathematical screenshot evidence keyed by question ID. This is NOT optional.

**Bob:** full five-stage continuous Board; four distinct explanatory beats per stage (Notice/Predict, Build/Reveal, Explain/Evidence, Generalise). Detailed pupil-friendly reasoning with changing native drawings and accurate TTS/captions, Play/Stop/skip correct, definitions clickable. Never present minimal captions or 'teaching' count as completion.

**4-run boundaries:** Run 1 curriculum/maths/banks; Run 2 native state/narration; Run 3 actual runnable HTML integration; Run 4 exhaustive browser/mathematical QA and repair. Follow `V35.3-MASTER-AND-VISUAL-FIDELITY-CONTRACT.md` and numbered run prompt to completion. Do not call GOLD without the original-source/master/number-visual/bob/game/all-mode evidence. If hardware/audio-only tests remain impossible, report them accurately, but finish every feasible QA task before stopping. Never require owner to perform routine lesson QA.

**Example Y7-001 immutable source test:** F0-12, F2-01, F2-03, F2-04 (decimal preset of F2-03), F2-08 and Digit Vault. Any missing item is a BLOCKER. New source and original source hashes must match. Use `tools/verify_master_fidelity.py` as an early hard gate; it is not a substitute for the browser audit.
