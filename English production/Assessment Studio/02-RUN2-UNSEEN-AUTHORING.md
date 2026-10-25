# RUN 2 — Unseen Sources, Questions & Private Marking Authorship
**Role:** original KS3 English exam-paper author, editor and question-setter. Use the Run 1 evidence; no copying earlier tasks.

## Original unseen source commission
1. Independently write age-appropriate, engaging, coherent source material **after** reviewing the Run 1 do-not-reuse inventory. Match the precise paper genre: full short story/extract, original poem with line/stanza accuracy, credible drama scene with named speakers, distinct paired sources, authentic original nonfiction, or creative-writing stimulus.
2. Make the source rich enough for multiple evidence-supported plausible interpretations; include deliberate choices in diction, imagery, pacing, structure, voice and/or context according to the skills tested. The passage must remain interesting even without questions. Avoid over-explicit explanatory paragraphs that give away interpretation.
3. Never manufacture copyrighted novel/poet/play text or fictitious citations. If no licensing permission for a published extract, create an **original** comparable source and disclose it. Do not copy text or unusual phrasing from CGP, earlier lessons, prior assessments, web sources or engine demos. Avoid close plot/stimulus analogy (e.g. avoid the demonstration's mysterious found object by a river for Y7-015).
4. Annotate source internally with references: source ID, genre, author credit, line IDs, intended evidence and possible alternate readings. These annotations belong in **editorial notes/private scheme**, never as student hints.

## Write the paper questions freshly — no exercise recycling
- For each Run 1 criterion, design a question involving a **new stimulus, new cognitive demand and new response**. Changing names/setting only fails novelty.
- Candidate question must answer: (i) where taught, (ii) what the pupil must independently demonstrate, (iii) which unseen evidence supports the marking, (iv) whether another interpretation can score, (v) why its mark value is fair, (vi) how it differs in meaningful reasoning from nearby lesson questions.
- Include suitable variety **only where meaningful**: precise short retrieval; inference+quoted support; analysis of language/structure; comparison; sustained writing; optional proofreading. Avoid inflating MCQ counts or 1-mark recall questions in an extended-writing assessment.
- Ensure pupils are not asked to recognise jargon never taught in actual unit lessons. A literary-method label alone earns fewer marks than explanation of an effect.
- Do not build a repetitive chain of questions whose earlier stems, answer choices or source annotation give away a later analytical response. Keep questioning neutral, self-contained, unambiguous and accessible.
- Written assignments should allow individual legitimate responses with meaningful, compatible interpretations. The main response should offer a high ceiling (sustained argument, integrated evidence, development across text), not simply rewrite the source.
- Mark budget matches effort: if only two words are required, don't allocate 6 marks; for a 20-mark essay define 20 marks of measurable criteria and descriptors. Use authentic, age-appropriate mark bands.

## Mark scheme authored separately in parallel
Prepare `PRIVATE-MARK-SCHEME-...json` (never embed in student JSON). For **EVERY** public question, include same ID and maximum marks, marking method (human rubric for analysis/writing; `exact` for truly objective outcomes only when supported), strong but not compulsory model answer, `lookFor` assessment points, plausible alternative correct answers and practical partial-credit `guidance`.
- Keep source evidence faithful to exact words and line references; no invented citations.
- Different correct interpretations must be credited where defensible; avoid arbitrary exact-word dependence, particularly inference, opinion grounded in text, prose analysis, comparison and creative writing.
- Essay rubrics specify dimensions and caps adding to question total (e.g. interpretation, text evidence, effects, organisation, accuracy where appropriate) plus meaningful progression from emerging to sophisticated responses.
- Distinguish analysis/interpretation marks from SPaG accuracy marks; do not double-penalise one mistake. A pupil answer may differ from the model yet earn full credit.
- For spelling/editing, independent verification every identified error is truly an error, every correction is valid, and all stated alternatives preserve meaning. Avoid dialect-sensitive false positives.
- No answer keys/model text or rubric in pupil `PAPER-...json`, public HTML, ordinary learner exports, student bundles or insecure page globals.

## Novelty checks BEFORE assembly
Compare all source passages and question stems against **every** available actual unit lesson question/reading source, prior assessment and four demonstration papers. Use exact/near-duplicate tool for flags; then **manual semantic comparison** for same thinking operation, order, plot, evidence, answer pattern and memorised response reuse. Log per-question fresh-skill-transfer rationale and prior nearest neighbour, then revise any suspicious item (do not just exchange names/verbs). If prior outputs are missing, disclose no full unit anti-copy verification.

## Proof test for every item
Solve each item without looking at planned answer; then compare to source and scheme. Mark valid alternatives and each distractor independently. Check line/paragraph refs, grammar terminology, quotation accuracy, cognitive level, material length, reading demand, instructions, genre authenticity, timing estimate, repeated ideas, readability and copyright. If a question can be answered without reading its source when source reading is the skill, replace it. Remove hidden coaching from prompts.

## Run 2 deliverables
- `PAPER-Y{YEAR}-{NNN}.json`: full pupil-safe `nova-english-assessment/v1` with **wholly original** source(s), sections, prompts and marks.
- `PRIVATE-MARK-SCHEME-Y{YEAR}-{NNN}.json`: full separate adult guide matching IDs and version.
- `Y{YEAR}-{NNN}-R2-EDITORIAL-REVIEW.md`: evidence for copyright originality, question→skill mapping, source quotes/answers, alternate answers, word/reading/time expectations, and one row per question stating new transfer vs closest earlier task.
- `Y{YEAR}-{NNN}-R2-NOVELTY-AUDIT.json` if tool used; include prior corpus manifest and unverified gaps.

**Gate:** Only enter Run 3 after complete source, fully checked individual answers, mark scheme, paper maxMarks and supported response widget types. A tool passing does not prove semantic novelty.