# NOVA Maths V2 F0–F18 automated audit | 14 October 2026

Source commit: 45c45a67c0243119445f4a2c0b8f267063718507 (main snapshot); audit ran in isolated branch.

## Coverage
- Master entries: 281
- Preset/shared entries: 26
- Expected standalone HTML: 255
- Standalone inspected statically: 254
- Browser pages inspected: 254 (2 widths each; 4 mode-tab attempts at 380px)
- Findings: 6. Breakdown: {'HIGH': 4, 'MEDIUM': 2}.

## Family overview

| Family | Production HTML | Findings |
|---|---:|---:|
| F0 | 16 | 1 |
| F1 | 10 | 0 |
| F2 | 15 | 0 |
| F3 | 15 | 0 |
| F4 | 10 | 0 |
| F5 | 16 | 0 |
| F6 | 11 | 0 |
| F7 | 8 | 0 |
| F8 | 15 | 0 |
| F9 | 13 | 0 |
| F10 | 20 | 0 |
| F11 | 11 | 0 |
| F12 | 15 | 0 |
| F13 | 14 | 0 |
| F14 | 13 | 3 |
| F15 | 11 | 0 |
| F16 | 16 | 2 |
| F17 | 14 | 0 |
| F18 | 11 | 0 |

## Findings grouped by severity

### CRITICAL (0)
### HIGH (4)
- **F0-02** [inventory] Multiple HTML candidates; ambiguous canonical: F0-02-svg-primitives.html,F0-02-svg-primitives-PREMIUM.html
- **F14-01** [runtime] Shared NOVA core absent after mount at 380px
- **F14-01** [runtime] Shared NOVA core absent after mount at 1280px
- **F16-14** [responsive] Horizontal document overflow at 380px: scrollWidth=386
### MEDIUM (2)
- **F14-01** [house_style] NOVA Chalk font not identifiable
- **F16-15** [console] Browser console errors during smoke test: ['Error: <rect> attribute width: A negative value is not valid. ("-1")', 'Error: <rect> attribute width: A negative value is not valid. ("-1")', 'Error: <rect> attribute width: A n
### LOW (0)

## Limits of evidence
- Browser smoke tests do NOT validate every answer, mathematical proof, state transition, drag stress, print page, narration or all responsive layouts.
- DOM-based checks can raise false positives; reproduce each finding manually before a production edit.
- Screenshots and screenshot-based visual comparisons were NOT performed by this automated pass.
- Existing legacy QA evidence is not treated as current proof of acceptance.
- No production code was modified by this audit.