#!/usr/bin/env python3
"""Conservative read-only core audit: proves missing API contracts, never patches core."""
from pathlib import Path
from datetime import datetime, timezone
import re

ROOT = Path(__file__).resolve().parents[1]
CORE = ROOT / 'core' / 'nova-core.js'
REF = ROOT / 'F3' / 'F3-01-array-builder.html'
OUT = ROOT / 'docs' / 'CORE-CONTRACT-AUDIT-2026-10-11.md'
CHECKS = {
    'Number-line constructor': re.compile(r'NOVA\.numberLine\s*='),
    'Drag-and-drop API': re.compile(r'NOVA\.ui\.svgDrag\s*='),
    'Motion API': re.compile(r'NOVA\.motion\s*='),
    'House-style lock': re.compile(r'NOVA\.houseStyle\s*='),
    'Narration hook': re.compile(r'NOVA\.bob\s*='),
    'Native helper dock': re.compile(r'NOVA\.scene\.helperStrip\s*='),
}

def main():
    if not CORE.is_file() or not REF.is_file():
        raise RuntimeError('Expected canonical core and F3-01 reference files are missing')
    core = CORE.read_text(encoding='utf-8')
    ref = REF.read_text(encoding='utf-8')
    rows = []
    for title, pattern in CHECKS.items():
        a, b = bool(pattern.search(core)), bool(pattern.search(ref))
        rows.append((title, 'Present' if a else '**ABSENT**', 'Present' if b else 'Not found'))
    lines = [
        '# NOVA Core Contract Audit (local checkout)', '',
        f'Generated UTC: {datetime.now(timezone.utc).isoformat(timespec="seconds")}', '',
        'This is a static API-presence check, NOT a substitute for browser regression, keyboard, mobile or mathematical QA.', '',
        '| Contract | Checked-in core | F3-01 compiled review reference |',
        '|---|---|---|'
    ]
    lines.extend(f'| {name} | {a} | {b} |' for name,a,b in rows)
    lines.extend(['',
        '**Interpretation:** A compiled preview can work because it contains a later embedded runtime while `core/nova-core.js` still lacks some APIs. ',
        'Do not copy the entire compiled F3 runtime over the central core. Its implementation diverges from the checked-in shared core; a replacement requires a focused reconciliation, tests and owner approval.',
        '',
        '**Next step:** Treat missing APIs as an explicit integration blocker for new builds, not as permission to invent fresh drag/number-line primitives. Recover the exact approved implementation from the reference and review a minimal compatibility patch separately.',
        '',
        'This repair pack changes no canonical core bytes and produces no new standalone engine.', ''
    ])
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text('\n'.join(lines), encoding='utf-8')
    print(f'Wrote conservative read-only core audit: {OUT}')
    for title,a,b in rows: print(f'  {title}: core={a}; F3 compiled={b}')

if __name__ == '__main__':
    main()
