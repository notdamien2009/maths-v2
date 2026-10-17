# NOVA Maths V2 — v35.2 MANDATORY COMPLETE-PRODUCTION GATE

**Owner production directive — 17 October 2026**

## NON-NEGOTIABLE OUTCOME

NOVA is a premium KS3 education product. The pupil must receive a **fully taught, fully populated, mathematically correct, interactive lesson**, not a plausible-looking demo. The assistant is responsible for lesson-level QA during production. The owner will generally review **the complete school year after production**, not inspect or authorise every intermediate lesson. Never transfer routine debugging, visual coverage checks, or unfinished teaching content to that year-end review.

**Do not end an authorised production run while fixable defects, missing sections, incomplete question banks, untested native components, or untested critical behaviours remain.** Discover, repair, rerun the affected tests, run regression tests, and document results **within the requested run**. Do not stop after the first successful parse, test, or screenshot. Do not stop just because a previous agent reported PASS. Do not label a build complete to avoid more work.

A run is **complete** only when its own mandatory deliverables and exit checks have been performed. Run 3 is an implementation handoff, **never final lesson acceptance**. Run 4 is the production QA and repair gate. Run 4 must continue iterating while there is actionable work that the environment permits; produce the repaired artifact and evidence, not a to-do list instead of work.

## RUN EXIT REQUIREMENTS

### Run 1 — Planning and verified mathematics
- Read the real curriculum row and attached source; establish **one lesson objective** and five coherent teaching stages of that objective (not five unrelated objectives).
- Complete all teaching scripts, worked solutions, misconceptions, vocabulary and `keywordDefinitions`, 38 distinct Challenge records per concept with 12/18/8 tiers, exact native component aliases/configs, and the required Start/Practice/Exit items.
- Independently recalculate every key, distractor and worked solution; audit duplicates, unsupported representations and answer leakage. Every item has an ID and clear pedagogical purpose.
- Deliver actual Run 1 plan/banks/coverage/evidence files; no `TBD`, placeholders, fabricated source APIs or claim of runtime testing.

### Run 2 — Executable visual and narration specification
- Map **every** Bob beat, Watch and Guided step, Explore control and Challenge item to a **real, inspected native API** and its exact mathematical state.
- Specify beginning/intermediate/end states, controlled reveal, accurate spoken explanation, TTS safety and correct visual numbers. The same apparatus must not show generic/default numbers when the question changes.
- Test supported data contracts programmatically against real source; fix unsupported fields and missing bridges now, not in Run 3.
- Preserve existing Play controls; continuous Bob and skip semantics, clickable keyboard-accessible definition pills, independent Explore and Challenge state.
- Deliver complete Run 2 source-state mapping and handoff, with real `PLANNED` status for behaviour not yet executable.

### Run 3 — Real integrated lesson, not a populated shell
- Build using the approved derived template and original source components. Do **not** invent/redraw apparatus, silently replace native visuals, or modify immutable source files.
- Verify all five stages, Bob Board, Learn Watch/Explore/Challenge, Guided Examples, Start/Practice/Exit, all questions and input types, hand-in/save behaviour, F0-12 wrapper, glossary, and TTS bindings exist and are connected.
- Run scripts, bank checks, exact source/derived-template checks and browser smoke tests; repair build blockers in Run 3.
- Deliver runnable self-contained HTML **plus the detailed evidence for Run 4**; status remains `RUN3-INTEGRATED-REVIEW`, not GOLD.

### Run 4 — FULL QA/REPAIR UNTIL AUTOMATED GATES PASS
For **each and every concept and question**, verify the visible native mathematical representation matches the exact prompt/givens, including values, scales, column colours, units, intermediate state and concealment. A visible SVG or correct answer key alone does **not** prove fidelity. Use stable per-ID evidence and deterministic bank coverage (all 38 items per concept, not merely one sample). No blank/zero-filled/generic diagram where a given number exists; no leaked answer.

Execute and record: all Bob beats and manual forward skip during autoplay; complete Watch and Guided sequences with Play/pause/seek/stop/restart; spoken-text event lifecycle; every keyword pill/definition and keyboard toggle; all Explore start/change/contrast/boundary/reset controls; native Challenge for every bank item plus actual 6-, 7-, and 8-round complete games, wrong answers/lives/hints, answer concealment, victory, replay/new random sample; all assessment items, input types, marking/rubric, storage/safe reload; 390/768/1024/1440 layouts and all stages; keyboard/reduced motion, touch/pointer handling where supported; offline/local resources, console and resource errors. Verify source hashes, shell preservation and the exact delivered HTML after final patch.

**Repair and retest loop:** failure → identify root cause → patch the appropriate permitted controller/configuration → run the failing test again → run related regression suite → update `production-gate.json` with evidence. Repeat; never report the first failure as a finished lesson unless it is truly unrepairable within authorised tools. Do not label a syntax pass as visual verification. Do not present simulated speech events as real audible pronunciation.

## MANDATORY MACHINE-READABLE GATE AND HUMAN-READABLE HANDOVER
- Write `production-gate.json` using `production-gate-template.json`, attach actual artefact paths and a per-state visual inventory covering every lesson record. Run `verify_production_gate.py production-gate.json --root OUTPUT_DIR`. This validator checks **documentation completeness and file existence**, not the truth of visual/audio test results; independent browser and maths QA remains mandatory.
- Every check has `PASS`, `FAIL`, `UNVERIFIED`, or (for device-only checks) `DEVICE_PENDING`; each PASS must contain specific proof with an existing file path, method, expected/observed result, and scope. A previous run's PASS must identify its original source/run and be regression-checked after relevant code changes.
- **No missing sections or unexplained failures.** Any failed/unverified internal critical check => `BLOCKED-NOT-COMPLETE`, not GOLD and not `QA-PASSED`. Fix what is possible before the run concludes. If browser, audio, device or external resources truly cannot be exercised in the environment, say so and mark exact scope unverified. Never fabricate evidence or claim the unperformed checks have passed.
- If all reproducible internal checks pass but genuine hardware-only checks remain, label `INTERNAL-QA-PASSED / DEVICE-SIGNOFF-PENDING` — **not GOLD**. Put device-only exceptions in the **cumulative school-year audit register**. Continue to the next authorised lesson without routine owner approval, but do not hide critical pedagogical/software defects in that register.
- **GOLD** requires all mandatory checks passed with applicable real-device evidence and any owner-required acceptance. If the owner deliberately waits until the end of the year to sign off, keep lessons as fully automated QA-tested candidates and perform one consolidated year-end device/user acceptance review.

## RESPONSE AND HANDOVER DISCIPLINE
- At the end of each run report **what was built, what was really executed, what was repaired, what is still blocked, and the actual files**. Do not write 'finished' unless the stage is actually complete.
- Do not ask the owner to inspect each lesson or approve routine repairs. The owner will trigger successive runs and do the **full-year review later**. The assistant owns the interim QA.
- Never infer that uploaded files, runnable HTML, sampler tests, DOM presence, or a JSON PASS collectively prove every lesson requirement.
- Keep immutable originals, preserve exact source component art, no Git push, and do not edit the canonical template without an explicit new derived-template version and regression proof.
- If a tool/environment limitation cannot be removed, do maximum independent useful testing and hand over a **clearly BLOCKED/REVIEW** artifact with the specific failed gates and next technical step. Do not promise offline/future work or manufacture a GREEN result.
