# Assessment Pipeline Release Gates & Evidence

| Gate | Requirement | Failure consequence |
|---|---|---|
| G1 source truth | Correct canonical unit bounds/objective; actual lesson files inventoried, versions explicit | Provisional coverage only, no GOLD |
| G2 taught concepts | Each assessable construct taught and traced to lesson evidence | Remove/replace unsupported task or HOLD |
| G3 unseen | All authored source and question text independent of previous lessons, old papers and demos; exact/near and semantic review | Rewrite; never rename-only repair |
| G4 paper validity | Original age-suitable source genuinely supports all questions and alternatives; mark allocations/fairness independently solved | BLOCKED |
| G5 private answer key | Scheme source quotes/alternatives/criteria checked; `model+lookFor` every item; partial credits add to max | BLOCKED |
| G6 student privacy | Public JSON passes forbidden-key validator; HTML does NOT contain private rubric/model; student ZIP no scheme | BLOCKED |
| G7 engine fidelity | Only data script replaced; original blue theme/layout/runtime unchanged; schema currently supported | BLOCKED |
| G8 learner journey | Actual navigation, long-writing, source access, save/review/submit, mobile/desktop, keyboard tested | Candidate if partial; no GOLD |
| G9 real platform | Permissioned adult mark scheme, pupil identity, server save/recover, hand-in, release of results tested | Candidate only, no production GOLD |

## What the originality script actually does
`assessment_novelty_gate.py` checks common exact and high lexical similarity between pupil paper sources/questions and earlier papers/lesson data JSON embedded in HTML. It **cannot prove** copyright originality, semantic change, plot novelty, appropriateness or complete availability of the preceding unit lesson corpus. A zero-flag run means only no *detected* close lexical matches in the supplied files. Always read the full originals and manually compare tasks; report missing lesson sources.

## Worked example of a VALID transfer
Earlier lesson: pupils analysed a short unseen narrator's mixed feelings about leaving home. New assessment: pupils interpret an entirely independent character's gradual change in their attitude towards a neighbour's difficult choice using a new story, new evidence and their own sustained analysis. The *skill* of justified inference transfers; no lesson passage, answer or prompt is recycled.

## INVALID novelty claims
- Replacing Mara/Eli with Leah/Sam while keeping a bell, river, mysterious memory motif and identical question sequence.
- Repeating 'What does the character's reaction suggest about their feelings? Support with evidence' and pointing to an analogous reaching/pulling-away moment.
- Using the previous question's exact solution with altered punctuation, shuffled MCQ options or reordered source sentences.
- Reusing the demonstration's exact 40-mark 15/20/5 split without an independent blueprint and workload rationale.