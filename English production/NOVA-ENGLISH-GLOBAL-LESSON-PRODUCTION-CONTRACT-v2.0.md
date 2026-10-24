# NOVA Academy KS3 English — Global Lesson Production Contract v2.0

**Status:** Controlled engineering candidate, 24 October 2026. This is the proposed common standard derived from the user-reviewed Y7-001 **Reading for Meaning** lesson, the approved boxed mascot pilot, the CGP-informed teaching review and the revised Challenge allocation draft v1.1. **It is not GOLD-certified across all eight Challenge families.**

## 0. Governing principle and source precedence

NOVA creates **original, full teaching lessons from first principles**, not revision notes or CGP replicas. Use CGP KS3 English Complete Study & Practice, the KS3 English Workbook, and the SPaG Workbook to evaluate teaching sequence, worked modelling, scaffolding and exercise variety. Never reproduce copyrighted CGP pages, unique illustrations, paragraphs, exercises or brand presentation. Independently author all passages, questions, feedback and teaching explanations; secure/attribute literary extracts as required.

Source precedence: (1) latest explicit user-approved visual/functionality decisions; (2) NOVA KS3 English curriculum and canonical lesson plan; (3) `NOVA-ENGLISH-CLEAN-EMPTY-PRODUCTION-MASTER-v2.0.html`; (4) user-approved Y7-001 lesson as a **design and teaching reference**, never as copied lesson data; (5) revised Y7–Y9 Challenge allocation v1.1, which remains a **draft** until audited. If documents conflict, flag and resolve before scaling. No Git push. Do not save or overwrite Library files without explicit authorisation.

## 1. The locked seven stages

`Start → Learn (Bob Board only) → Explore → Examples → Challenge → Practice → Exit`.

- **Start:** Big Idea, lesson overview, original relevant source where appropriate; **five** prior-knowledge diagnostic questions. Do not test a new rule before Bob teaches it as though it were already known. Include supported visual question types where educationally useful, never leak an answer through the image.
- **Learn:** **One** Bob Board, never a duplicate Learn workshop. **3–5 purposeful concepts**, chosen by teaching progression, **four meaningful narrated beats per concept**: Notice/Predict → Build/Reveal → Explain/Evidence → Generalise/Carry Forward. Teach each skill explicitly from the beginning. Every visual and spoken example must agree.
- **Explore:** One **distinct, purposeful and interactive** investigation per Learn concept: 3, 4 or 5. Explorations must allow the student to try, receive specific feedback and revise their reasoning. Do not repeat the same mini-quiz with changed labels and call it four interactions.
- **Examples:** **3–5** progressively more demanding worked models, including at least one fully narrated example from original source material. Use the existing Examples workbench, fixed layout and character box. Vary reasoning demands; use clear prompts and accurate feedback.
- **Challenge:** Exactly **one primary Challenge family**, allocated because it meaningfully applies that lesson's central objective. Individual tasks within it may combine a main task and a short written explanation. See §3.
- **Practice:** **15 credits** of structured independent application, generally Core → Secure → Stretch. Use original and appropriately unseen sources. Mix exact-answer retrieval with judgement-marked writing where the objective warrants it. Specific misconception-based responses, not generic “wrong”.
- **Exit:** **10 credits** assessing transfer on sufficiently fresh content. No hints or live checks. Written and extended answers must use rubrics or defer to real review; never grade nuanced writing by one exact string. Preserve hand-in semantics.

If a longer writing Challenge is required, rebalance effort and difficulty within Practice without silently removing the agreed assessment coverage. Differentiate by quality and thinking, not filler question count.

## 2. Teaching standard: CGP-informed, NOVA-original

Each concept and worked model must follow a complete instructional line: **teach the idea → demonstrate → explain why → inspect a plausible misconception → let the learner apply → revisit independently**. Skills like inference, paragraph construction, punctuation, analysis and creative writing must be explained in age-appropriate terms before jargon is introduced. Use glossary terms selectively and check that speech, visual highlights and question-specific answers agree exactly. Do not create five concepts solely to satisfy a slot.

Progression must respect preceding/following lessons. Intentional recall is good; pointless same-level duplication is not. In Y7-001, do not pre-empt Y7-002's deeper inference and evidence unit. In literature lessons, teach from text and context, not only plot summaries.

## 3. Lesson Challenge allocation — eight families

The family is selected in **Run 1**, before teaching text or HTML is authored. Never assign randomly or choose simply for variety. Current v1.1 draft counts (for planning, not quotas):

| Family ID | Family | Curriculum use | v1.1 draft |
|---|---|---|---:|
| `reading-detective` | Reading Detective | Gist, scanning, comprehension and precise meaning | 21 |
| `evidence-analysis` | Evidence & Analysis | Textual inference, quotation, character, theme, comparison | 94 |
| `paragraph-builder` | Paragraph Builder | Analytical paragraphs, evidence explanation, structured writing | 44 |
| `creative-writing` | Creative Writing Studio | Stories, setting description, narrative voices, diary tasks | 18 |
| `language-editing` | Language & Editing Lab | SPaG, proofreading, sentence transformation, vocabulary choices | 27 |
| `poetry-studio` | Poetry Studio | Original poems, imagery, form, rhythm and deliberate editing | 7 |
| `speaking-argument` | Speaking & Argument Studio | Speech planning, debate, persuasive claims and discussion | 29 |
| `spelling-word-study` | Spelling & Word Study Lab | Spelling patterns, word families, vocabulary meaning and usage | 16 |
| **Total** |  |  | **256** |

**Family selection rule:** Choose the activity with the strongest transfer to the lesson objective. Reading a poem may require *Evidence & Analysis*, not *Poetry Studio*, unless the lesson actually teaches composing poetry. Analysis of a novel does not always mean another identical quotation question; adapt the case, evidence demands and reasoning. A SPaG lesson about sentence structure normally uses Language & Editing Lab; spelling is appropriate where word pattern, word formation or accurate recall is the actual learning objective.

**Spelling is both curriculum learning and a reusable record.** A `spelling-word-study` Challenge points to a uniquely identified bank (`DATA.spelling.bankId`) with a word, definition/clue, spelling rule where relevant and optional sample usage. Record completion/progress and bank ID for future website use; preserve the same set for independent redo. Do not award spelling completion in unrelated reading/creative-writing lessons. Weekly spelling practice can be scheduled separately, without consuming an unrelated lesson Challenge.

**Implementation status:** The clean v2.0 engine has a common data-driven Challenge renderer for multiple-choice, exact-source-line, written/rubric and spelling recall tasks. The user-approved visual implementation is Reading Detective in Y7-001. **Specialised interfaces for the other seven families have not all been independently teaching-tested**. A family needs a representative working pilot and functional/teaching QA before bulk use. The generic renderer is a scaffold, not proof that every studio is premium-ready.

## 4. Bob Board visual and player contract

- Preserve the approved English **royal blue** theme. No pale source-paper backgrounds, recolouring or unapproved redesign.
- Desktop Bob Board visual presentation **750px fixed height**, no board-content scrolling, no layout jumping between beats and **stationary playback controls**. Do not crop sources or teacher narration to force a fit; reframe content safely inside existing geometry.
- Only Bob Board on Learn. Continuous Next/Previous across concepts; **Skip Slide means skip one beat**, not the whole concept; when autoplay is on, continue appropriately. Presenter controls must not shift as narration lengths change.
- Prefer the approved Bob Ryan voice when the browser/site supports it. Audible TTS quality and spoken-to-visual timing require **real playback QA**, not merely seeing text advance. Provide silent/readable fallback; don't make audio essential to comprehension.
- Exact source words highlighted or annotated only when justified by the spoken explanation. No decorative connector lines from mascot to text.

## 5. Mascots: identity and teaching roles

Exactly one selectable companion: **Pip, Nova or Izaac**, with a website override/lock; never insert a second selector. The website assignment is authoritative when locked. Preserve identities and original approved illustrations. Use the newly approved **full-body Nova reading sprite** (both ears, feet and tail visible), not the earlier cropped clip. Mascots remain in their **fixed dedicated box** inside Bob Board, Explore, Examples and appropriate Challenge activities, with subtle pose/gesture changes and short contextual coaching text. **No roaming mascot, long pointing line, jumping buttons or boxes covering teaching.** Script cues in lesson data: for Bob use `bob.concepts[].states[].mascot`; for Examples use `examples[].mascotCues[]`; for Explore use `explore[].mascot`.

Animations must communicate the English reasoning process (read, notice, compare, think, correct, encourage) and change at purposeful moments; mere continuous bouncing is not enough. Preserve reduced-motion behaviour and meaningful image alt/label text. Check each of the three characters/poses for visible ears, hands, shoes, feet and accessories.

## 6. Content/data ownership and empty template use

The master contains **valid empty JSON**, not sample answers; `meta.templateMode=true` displays a safe empty preview and **does not run assessments**. To assemble a real lesson, populate `script#novaLessonData` with the lesson's original structured content, `meta.year`, `meta.lesson`, `meta.title`, `meta.objective`, unique `meta.websiteRef`, `meta.templateMode=false`; do not overwrite the shared CSS/JS for ordinary lesson variation. Optionally use the accompanying insertion utility. Fill `start`, `bob`, `explore`, `examples`, `challenge`, `practice`, `exit`, `practiceSources`, `exitSources` and, where required, `spelling`.

- `start.diagnostic`: exactly 5, correct IDs/types/modes/feedback.
- `bob.concepts`: 3–5; exactly four valid states each; meaningful original HTML content and `speech`, `focus`, `misconception`, `mascot` cues.
- `explore`: exactly one object per concept with stable `id`/`conceptId`. For choice/line investigations, author `missions[]` with `kind`, `question`, `options` if choice, integer `correct`, distinct `why` and `wrong` feedback. Other authored Explore modes must retain and test their actual activity mechanics. `sourceText`/`lines` must match task evidence.
- `examples`: 3–5; 3–5 meaningful worked steps each; include `mascotCues[]` matched to the actual reasoning steps.
- `challenge`: `id`, `type`, `title`, `intro`, optional `source:{title,genre,label,lines}`, one or more `tasks` with `kind` = `choice`, `line`, `writing`, `spelling`. For `writing`, include a measurable prompt, an authentic rubric and `minWords` only as a minimum-length check (never an automatic quality grade). For `spelling`, give a `wordIndex` pointing to the bank and word-specific feedback. More sophisticated family mechanics can be added only with pilot and regression QA.
- `practiceSources`/`exitSources`: arrays of objects `{beforeQuestion, title, text}`, giving placement of **original passages** in the respective assessment; don't bake those passages into template JS. Ensure unseen sources are not already used verbatim in worked examples and have no answer leakage.
- `spelling`: `{bankId,title,fromLesson,toLesson,words:[{word,clue,rule?,example?}]}`. Empty/unused unless a scheduled or lesson-linked set requires it; website persists progress separately.
- Unique question IDs, tier/correct responses/rubric and credits. No unreplaced `{{field}}`, `data-template-slot`, hidden source passages, unrelated sample scripts or copied CGP paragraphs in a production lesson.

Do not reuse `Y7-001` source material or answers merely because the component scaffold matches. Preserve the current English template's interaction shells and mascot artwork rather than building alternate pages from scratch.

## 7. Production process — four runs

**Run 1 — Architect:** Read canonical lesson plan and adjacent lessons; confirm scope and prior knowledge; choose 3–5 concepts, matching Explore mechanics, 3–5 worked models and one Challenge family from the mapping; identify original/licensed passages and explicit spelling-bank plan. Produce a lesson route and risks/gates. Challenge allocation remains revisable when the curriculum objective clearly demands it.

**Run 2 — Teaching and assessment:** Write every Bob beat (words/audio/visual target), Explore task, original source, worked example, Challenge mission, Start 5, Practice 15 credits, Exit 10 credits; validate pedagogy, unique questions, all answer keys, feedback, spelling rules and rubrics before any HTML insertion. Writing tasks have genuine success criteria and review method.

**Run 3 — Build HTML:** Insert the validated data into an unmodified copy of the **clean v2.0 master**. Keep 750px board, original seven-stage player, boxed mascot, royal-blue colour, answers/feedback and website selection API. Do not change original source or rewrite reusable components to solve a one-lesson placement problem. For new Challenge families, pilot and isolate implementation once instead of patching each lesson.

**Run 4 — GOLD QA:** Browser-test full seven stages, all beats/skip/play/navigation, all challenge interactions, independent source/answer alignment, unique practice/exit items and writing marks; verify all three mascot selections/website lock, responsive view, keyboard/reduced motion, no JS exceptions, readable images, and actual Ryan TTS if available. Run at least one wrong→feedback→retry, correct→advance and writing→pending-review path. Test site persistence and hand-in in the deployed integration separately. Mark **REVIEW CANDIDATE**, not GOLD, until every required gate has evidence. Audit against CGP for clarity/progression, not literal content.

## 8. Engineering hard gates and regression list

**Block release when:** a page contains inherited text from a different lesson; Bob Board has double Learn, shifting play controls or the wrong 750px geometry; mascot text/feet/ears are clipped or any pointer line returns; old spelling game appears in unrelated lesson; Challenge family conflicts with lesson objective; answers or feedback contradict source; obvious duplicated questions; an Exit prompt exposes a hint; an extended answer receives fake exact-match marking; a source contains an unlicensed modern extract; standalone file throws in browser or fails page navigation.

**Before the first mass-production run:** Pilot Y7-001 reading, one grammar/word-study lesson and one extended-writing/analysis lesson using the same master. For each, produce actual browser evidence and repair defects in the master/runtime, not through serial lesson patches. Audit the 256-family mapping before declaring it locked. Do not publish or push Git without user review.

## 9. Website integration (future, not claimed deployed)

Expose `window.NovaEnglishMascot.setWebsiteSelection(id,locked)` and `window.NovaEnglishChallenge.getSummary()`. Challenge progress/completion events provide typed IDs, results and the spelling bank ID where relevant. Treat browser storage as a temporary standalone fallback; the future NOVA website should maintain per-pupil progress/word-bank retakes using explicit account identity and permissions. Never claim website persistence or automatic extended-writing marking without end-to-end testing.

## 10. Release state of this contract and master

**Verified at candidate level:** empty preview opens at 1360/1024/390 without observed JS errors/overflow; each script parses; a populated regression copy navigates all seven stages; a generic Reading Detective choice/line/writing sequence and separate spelling recall path complete with correct state/feedback and pending-review flag.

**Not verified for GOLD:** all eight families' specialist pedagogy/UI, real audible Ryan voice and precise sync, actual production-site student persistence, deployed hand-in, real assistive-technology audit, every future lesson variant. Do not claim a blanket 256-lesson certification.