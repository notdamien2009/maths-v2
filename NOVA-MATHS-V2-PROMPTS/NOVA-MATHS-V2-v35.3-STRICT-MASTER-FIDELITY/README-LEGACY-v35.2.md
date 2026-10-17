# NOVA Maths V2 v35.2 — strict autonomous production

**Start here:** Read `MANDATORY-PRODUCTION-COMPLETION-GATE-v35.2.md` before running 01–04. The owner does not inspect each lesson during production; the owner will review the finished school year. The assistant must run all feasible internal QA on each authorised run, fix and retest, and use a JSON release gate on Run 4. Device-only unresolved checks go into the cumulative year register, not into a false GOLD assertion.

**Source note:** v35.2 changes prompt/handover policy, *not* native artwork or the approved v35.1 derived template. SHA entries named v35.1 continue to refer to those unchanged originals. The F0–F3 ZIP is still an independent source attachment.

# NOVA Maths V2 v35.1 — F0–F3 production prompts (keyword + audio polish)

Start here. Use the user-attached source ZIP, curriculum/blueprints and the accompanying **NOVA-MATHS-V2-DERIVED-TEMPLATE-v35.1-KEYWORDS-TTS.html** as the reusable INTEGRATION baseline. Keep the underlying F0–F3 source pack and its immutable master unchanged. Run 1→2→3→4.

**New mandatory behaviours:** Bob Board keyword pills and click-to-define; automatic TTS on existing Learn Watch and Examples Guided Play; uninterrupted Bob presentation across all concepts and forward skip without stopping. No extra playback controls. See `BOB-KEYWORDS-AND-TTS-v35.1.md`.

# NOVA Maths v35 — F0–F3 production prompts

Attach this prompt ZIP AND your current NOVA-F0-F3-production.zip, plus curriculum row/topic/year/lesson identity. Run numbered prompts 01→02→03→04. Each embeds the shared contract and can be pasted alone with the pack attached. Say “run all four” to authorize all stages in one task.

Only the attached F0–F3 source folder is used. Native numeric/state/animation/drawing exposure edits and necessary Bob/sampling hooks are authorized, using the SAME component drawing code/type/style. Bob orchestrates the native apparatus; Explore is a genuine concept investigation with lesson-based reset. Each concept gets 38 mixed questions; 6–8 randomly selected per game (default 8). Retry/resume retain the session; New game creates a fresh sample in original F0-12.

The sampler helper is unit tested; Run 3 must still implement and browser-test its existing-controller lifecycle integration. Updating prompts does not itself upgrade the attached runtime or create a tested lesson. No old executable template is bundled; use the template inside the attached combined source ZIP.

Read V35-PRODUCTION-CONTRACT.md, CHALLENGE-INTEGRATION-v35.md, CONCEPT-EXPLORE-AND-BOB-v35.md and NATIVE-EDITING-AND-QA-v35.md. Planning JSON fields must be mapped to real native APIs; they are not automatically consumed by the shell. source-reference holds convenience guides; attached runtime is authoritative.

Commands:
- python v35-preflight.py SOURCE.zip --extract work/source --select F1-01,F2-07,F3-01 --out work/integration-lock.json
- python v35-qa.py plan lesson-plan.json question-banks.json
- python verify_template.py ORIGINAL-OR-RECORDED-DERIVED-TEMPLATE.html LESSON.html
- python v35-qa.py release release-evidence.json --root LESSON_OUTPUT_DIR
- node test-v35-sampler.cjs
- python test-v35-validators.py

Scripts check data/source/evidence consistency, not screenshot pixels, teaching quality or audible pronunciation. The actual final lesson still needs real browser/maths/audio QA. Original shell and 5/15/10 assessment roles, written review, stacked fractions and speech safeguards remain.
