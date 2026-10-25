# NOVA English — Parent Answer Keys and Marking Contract v2.5
**Status: review-branch candidate, not approved for live production.** 25 October 2026.
**Applies to every future Year 7–9 English lesson.** This supplements the currently committed v2.2 engine, Run 1–4 prompts and curriculum; earlier weaker wording is superseded for answers and parent review.

## Non-negotiable result
Every lesson must give a parent an **example of what a good written answer could say**, the source evidence or reasoning, 2–5 simple checkable success criteria, defensible alternatives, mistakes to watch for and a precise improvement suggestion. The parent must not need subject expertise. The example is a guide, not the sole permitted correct wording.

## Assessment coverage
- 5 Start diagnostics, 15 Practice questions and 5 Exit questions: **25 distinct IDs, 1 credit each**, plus each Challenge task. Verify Explore answers and Example outcomes as part of the teaching QA.
- Exact/MCQ/line/spelling: valid `answer`/`acceptedAnswers`, correct choice/line index (Challenge and Explore), precise `feedbackRight`/`feedbackWrong` or `success`/`wrong`, and an explanation grounded in the actual pupil-visible passage or rule. Provide accepted equivalent wording when applicable. Do not mark ambiguous interpretation by exact string.
- Practice objective questions: `marking:"exact"`, `checking:"live"`. Practice open answers: `marking:"judgement"`, `checking:"deferred"`. Exit: `checking:"independent"`, without live hints or revealing model answers.
- Every judgement-marked Start/Practice/Exit response and every `kind:"writing"` Challenge task must contain `parentGuide`:

```json
{
  "parentGuide":{
    "exampleAnswer":"A complete model answer using the *actual* passage and this question",
    "lookFor":["2–5 specific, observable understanding points","Include evidence and an explanation where relevant"],
    "acceptAlternatives":"Identify concrete, evidence-supported other readings or wording",
    "commonMistakes":["At least one realistic, specific misconception"],
    "nextStep":"A clear correction or prompt the parent can give the pupil"
  }
}
```
A rubric alone, “answers may vary”, “review against criteria”, generic advice, placeholder, or solely a word-count threshold FAILS.

## Four-run gate
**Run 1 / Architect:** map each S/P/X/Challenge question to a target answer, source and plausible misconception. Plan the full model response and checklist for every writing question. Preserve neighbouring-lesson scope and original CGP-informed pedagogy, not borrowed CGP extracts.

**Run 2 / Teaching & Assessment:** write all complete answer keys in lesson data; ensure actual quote text, source lines and correct indexes match. Output a *private* `Y7-XXX-R2-PARENT-ANSWER-KEY-MANIFEST.json` with one entry for each of the 25 questions plus each Challenge task. Include source evidence, answer or model, accepted alternatives and parent criteria. Do not distribute this private manifest to pupils.

**Run 3 / Build:** use approved matching empty master/validator, not a filled lesson as template. Retain all `parentGuide` fields and the pre-existing 750px Board, royal-blue appearance, seven-stage route, boxed companions, Ryan voice and Challenge layout. Parent models appear only in review surfaces after hand-in. Do not claim client-hidden HTML answer data is secure.

**Run 4 / QA:** fail release for missing, generic, mismatched or unsupported answers. Count each question, independently check all source quotations and correct indexes, test live feedback vs deferred reviews vs independent Exit, and verify two real parent marking guides (short + extended), alternative valid answers, mobile and keyboard. Document evidence and uncertainty; **no GOLD label** on static validation alone.

## Technical/privacy safety
The existing GitHub v2.2 empty master does **not** by itself establish that the separate v2.4 Parent Answer Guide review renderer is installed. Pilot/review a compatible shared master before releasing lessons under v2.5. Standalone HTML can expose embedded answers in developer tools; the deployed NOVA website must enforce authenticated **server-side** parent access to answer keys and review actions. Parent approval does not automatically mark free writing without evidence.

## Release blockers
Incorrect lesson source; duplicate or missing key; mismatched answer/options; non-supported quotation; unexplained feedback; open answer without full model/checklist/alternatives/mistakes/next step; pupil-visible model before hand-in; phantom auto-grading of prose; failed website role gate. Preserve the approved lesson geometry and 5/15/5 counts.

**No direct merge to `main`:** this review branch is for user inspection and approval.
