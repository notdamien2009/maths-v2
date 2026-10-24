# NOVA Maths V2 — Template v1.7.1 review status

**Branch:** `review/mathsv2-v1.7.1-lesson-feedback-20261024`  
**Source artifact:** `NOVA-MATHS-V2-TEMPLATE-v1.7.1-LESSON-FEEDBACK.html`  
**Blob SHA-1:** `ff4d5798eb7608d2758e5fbdc29c445e402fae57`  
**SHA-256:** `76e976486890d79bc8d3fe489a1c8eb5174dc14c729b4a91df3cb685a0d0b68e`

## Purpose

Introduce the v1.7.1 lesson-specific feedback engine as a **separate, reviewable template**, alongside (not replacing) the previously published v1.5 candidate.

The associated four-run production **prompt pack v2.4** remains a separate distribution artifact; use it with this exact v1.7.1 template when testing new lessons. It requires:

- Exit-result feedback authored for excellent, developing and review-level outcomes, matched to the lesson's actual mathematical objective.
- Question-specific wrong-attempt feedback: first attempt hint, second attempt scaffold, and clear worked method after the permitted attempts are exhausted.
- Start/Practice/Exit and Challenge feedback consistency checks in Run 4.
- Three data insertion slots: `novaLessonData`, `novaProductionData` and `novaV2Sources`; original component sources remain immutable.

## Status / restrictions

1. **Do not treat this pull request as a GOLD certificate.** Template/code-level validators were exercised, but browser end-to-end playback, Ryan TTS, accessibility, native interactions and website hand-in require representative pilot testing.
2. **Do not silently replace the approved original F0–F18 components**, change their internal layouts, or alter the approved geometry. This change adds a new master file, not an engine-wide redesign.
3. The checked-in HTML is byte-identical to the approved v1.7.1 release artifact; its historical header still mentions the v1.6 candidate provenance. The file name and this note record its actual review status.
4. Existing lessons Y7-001, Y7-002, Y7-010 and Y7-059 have **not** been migrated by this branch. Their acceptance history remains intact, while lesson-specific feedback repairs and regression tests must be applied separately.

## Promotion gate

After the owner reviews the PR and one representative lesson passes full desktop/mobile and feedback-path browser QA, the approved production entrypoint can be updated in a separate, explicit promotion. Until then, `main` retains its current v1.5 template.
