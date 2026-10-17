# Year 7 — cumulative end-of-year acceptance register

This register is retained across every lesson. It is **not** a place to conceal unfinished software or content fixes: those block a lesson's internal production gate immediately. Use it only for genuinely hardware-only/owner-signoff limitations not testable in the production environment. The owner reviews and signs off the completed year together.

| Lesson | Item requiring target-device/owner review | Why deferred | Current status | Evidence / next action |
|---|---|---|---|---|
| Y7-001 | Hear Bob, Watch and Guided speech in Chrome/Edge, UK voice, entire lesson, correct synchronisation | Browser speech event mocks do not prove audible output | DEVICE_PENDING | Review full narration and timing on Windows at year-end |
| Y7-001 | Download and open standalone HTML directly, test storage across save/reload | Automated sandbox blocked `file://` navigation | DEVICE_PENDING | Test normal Windows Chrome/Edge local-file workflow |
| Y7-001 | Finger drag/pointer cancel/keyboard of every Explore control | Physical touch hardware unavailable | DEVICE_PENDING | Test tablet/phone and keyboard on target devices |

When production progresses, append new lessons with exact check IDs, links, status and tested evidence. No generic 'QA pending' entries.
