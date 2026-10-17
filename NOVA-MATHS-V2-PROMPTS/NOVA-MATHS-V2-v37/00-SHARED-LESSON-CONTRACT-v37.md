# NOVA MATHS V2 — SHARED LESSON CONTRACT v37.0
**Read this before every run. User's 17 October 2026 seven-page lesson plan supersedes conflicts in earlier prompts.**

## A. Non-negotiable principle and precedence
1. Latest explicit user instruction for the assigned lesson and locked current seven-page layout.
2. Authoritative master curriculum: lesson code, title, objective and progression; five coherent teachable concepts serving ONE objective.
3. Approved NOVA Production original mathematical apparatus and actual source capabilities, `MAP` / `AL` as verified identity, provenance and preferred teaching resources.
4. This v37.0 lesson-first production contract, run handoffs, verified mathematical answers.
5. Older production materials may be consulted ONLY for compatible technical details; they do not reinstate the old five-stage layout or per-component Challenge restrictions.

**Curriculum scope is fixed; visual choreography is flexible.** Start with each mapped approved original component; resolve original aliases/presets correctly and account for mapping coverage. The lesson architect may reconfigure it, rearrange its native shapes, swap mathematical data, focus on particular features (e.g. hide thousands/hundreds to illustrate decimals), combine multiple **existing** approved apparatus views, and select another genuinely available approved component as a supporting teaching view when it materially improves pedagogy. Record every variation and its reason. Do not change the objective, invent an alias, pretend a component exists, or omit a uniquely required teaching idea merely for convenience. F5-08 reference resolves to original F5-03 multiplication/area-model preset as documented; do not invent a separate F5-08 engine.

## B. Original library remains immutable
All changes occur in the **lesson-local copy, data/configuration, view adapter or presentation composition**. NEVER alter the canonical library sources, original ZIPs, shared F0-12 implementation, global component identifiers or the approved master template file. Track for each adapted view: source family/file/hash, alias/preset, new view ID, adjustments, mathematical reason, question/beat usage. Prefer original APIs/state setters; if the native source lacks a required adaptation, make a small local, traceable adapter or derived view using ONLY its original source geometry and NOVA-design primitives. No independent from-scratch mathematical illustrations, generic substitutes, emoji-as-apparatus or external drawings. Do not fabricate component APIs. Nonfunctional adaptation is a recorded blocker, not permission to substitute silently.

NOVA look is fixed: premium DARK NOVA shell; exact neon apparatus/drawing conventions, designated NOVA Chalk fonts and mathematics glyphs; proper stacked fractions in teaching displays; native mascots/Pip/Nova/Izaac when supplied; Bob portrait from approved assets; no white panels/backgrounds; no style imports from other subjects. Source artwork can be resized/repositioned only to fit cleanly and preserve its geometry and mathematical meaning.

## C. Seven pages — exact navigation
**Start → Learn → Explore → Examples → Challenge → Practice → Exit.** The approved template's navigation is four upper buttons and three offset lower buttons, with Challenge on the lower row. No additional page, learning-mode tabs for Explore/Challenge inside Learn, named activity, standalone game, bonus module or lesson-specific game. Preserve approved card/group layout in each page, without lesson-local structural compatibility patches.

### Start
Lesson title and EXACT master learning objective; Bob's Big Idea (title), learner-friendly lesson introduction, learning goals, concept overview. Five diagnostic questions S1–S5. ONLY S1 and S2 have question-specific static native NOVA visual aids; S2 and S3 are MCQ (S2 visual MCQ). No visual obstruction, cropping or accidental answer reveal.

### Learn / Bob Board
Bob Board retains approved **700px DESKTOP presentation height** in the v37 final template. Never shrink it, change its responsive constraints arbitrarily, cover content, overlap signs with artwork, clip native frames, or require browser zoom-out. The page may scroll normally at 100% browser zoom; play/navigation must remain reachable. Bob gives ONE continuous five-concept presentation with **4–6 meaningful beats per concept** (20–30 total), using editable original NOVA Watch apparatus. Each beat has a precise mathematical demonstration, a conceptual explanation, explicit verbal-to-visual connection and corresponding written working. Use Notice/Predict → Build/Reveal → Explain/Evidence → Generalise as a foundation; add beats if mathematically valuable. The board supports uninterrupted TTS/animation between concepts; manual forward/backward while playing must continue from the selected beat, paused skipping stays paused; keywords are clickable pills with toggle definitions and do not interrupt playback.

Learn separately contains exactly FIVE concept Watch presentations, each tailored to its mathematical idea using mapped NOVA apparatus, edited native states, and clear Bob narration. No Explore or Challenge controls inside Learn. No autoplaying unrelated component slideshow.

### Explore
Dedicated page with a distinct pupil-operable experiment/manipulation for EACH of the five concepts. Existing approved component machinery only. Supply concrete initial state, learner instruction, meaningful actions/drag/slider/input, visual feedback, reset/replay and accessible keyboard path where supported. Depth of interaction depends on topic; never fake interactivity when a component does not support it. If a source is limited, supply the strongest truthful pupil-controlled manipulation achievable through original state/config without inventing apparatus.

### Examples
Dedicated Guided page. **No more than 5 worked examples per lesson**, normally one per concept. Use native approved Guided apparatus, freely configure/resequence its original stages and combine existing views as necessary; show full written mathematical steps alongside each explanation, not an answer-only slideshow. Each example can have multiple substeps, but those substeps are NOT additional examples. Existing Play control triggers synchronised Bob TTS. Steps and narrative must align with what is visibly changing.

### Challenge
Exactly **ONE central lesson-wide F0-12 original game wrapper/controller**, outside Learn. **10 standard questions across the five concepts + 5 optional additional Stretch questions** (15 bank entries), preferably 2 standard + 1 stretch per concept. Do not mount F0-12 separately per concept/component/question or make a replacement version. Question chooses the appropriate native view (which may change each question) and exact **question-specific public values**; source `nativeIndex`, config/data and initial native scene must hold while pupil thinks. No slideshow/autoplay in question view, no stale data from previous question, no answer revealed early. Right answer → F0-12 auto-advance; wrong → feedback and retain same question/state. Preserve original HUD, lives, points, streak, hints, Bob feedback, completion badge/confetti, reset/replay and keyboard handling. Stretch is additional, not a second Challenge game. TTS reads prompts/feedback on the existing control pattern without announcing secret answers before marking.

### Practice
FIFTEEN questions: **5 Core (P1–P5), 5 Secure (P6–P10), 5 Stretch (P11–P15)**. Exactly FOUR question-specific visual aids: Core **P1/P2**, Secure **P6**, Stretch **P11**. No other Practice pictures. Maintain suitable answer types and writing spaces, progressive challenge, marking and feedback.

### Exit
FIVE independent questions: **2 Core (X1/X2), 2 Secure (X3/X4), 1 Stretch (X5)**. NO visual aids. Do not use the former 10-question Exit or the old template's 3-Core/2-Secure split.

## D. Number and assessment quality
- Design maths FIRST, then choose representative values. Questions within and between Start, Learn, Board, Examples, Challenge, Practice and Exit must not recycle identical or cosmetic variants of the same values/structure. Avoid serial patterns like 0.7, 7, 27, 0.007 across the whole lesson. Reuse a value ONLY where an explicit teaching link requires it, and record why.
- Vary magnitudes, place-value patterns, operands, denominators and contexts in ways that still fit progression and pupil level. Avoid mathematical impossibilities, excessive mental load and meaningless randomness. TTS speaks mathematical expressions clearly.
- Randomise Challenge selection/ordering and MCQ answer positions in a mathematically safe way while guaranteeing intended concept and difficulty coverage. Store correct answers as *values*, not brittle positions. Across the lesson, distribute MCQ correct slots rather than always B/second; shuffle distractors without changing correctness. Use deterministic seed for test reproduction and independent session variation when appropriate.
- For each question: ID, concept/tier, unambiguous text, public givens, expected answer, independently checked derivation, marking/rubric, hint, wrong and correct feedback, visual source and native-state contract IF visual-backed. For Challenge, private answer never appears in question-facing HTML/state before marking.
- Exact rendered numeric state is part of correctness. The real displayed numerals, columns, operators, signs, units and positions must match the active question; not merely a matching slide somewhere in the original source.

## E. TTS, layout, persistence and accessibility
TTS integrated with EXISTING Play/control behavior on Bob Board, Learn Watch, Examples Guided and Challenge. Narration, highlighted steps and visual changes must synchronise. Play/Pause/Stop/Skip must cancel stale speech properly; no added duplicate players. Keyword pills open definitions without stopping audio. Preserve template assessment autosave, feedback, hand-in and site/parent integration. Maintain no overlaps/clipping at 100% zoom; test desktop ~1280px+ and mobile ~390px, responsive keyboard focus, reduced motion and accessible control labels. No white backgrounds. App/browser console must be checked.

## F. Production gates
1. Source and template provenance; immutable original hashes; no phantom components.
2. All 5 concepts taught correctly and clearly; per-concept mapped-source coverage with teaching justification.
3. Exact section/question counts, aids and tiers; max 5 Examples; single F0-12 Challenge.
4. Real rendered/native-state verification for EVERY visual-backed question and every teaching presentation; no placeholders.
5. TTS, navigation, interactivity, marking, randomisation and persistence checked in a real browser when available. If not actually tested, status **NOT VERIFIED**. A syntax/structural script alone does not justify GOLD.

Do not mark any run complete if required deliverables are missing. Report blockers precisely with paths and evidence; never invent success, test results, source names or links.