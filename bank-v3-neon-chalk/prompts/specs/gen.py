#!/usr/bin/env python3
"""Extract canonical SPEC JSON without inventing the old missing s1-s6.py sources."""
from pathlib import Path
import json
import sys

ROOT = Path(__file__).resolve().parents[2]
MASTER = ROOT / '00-master' / 'nova-master.html'
OUTPUT = Path(__file__).with_name('specs.json')

def main():
    txt = MASTER.read_text(encoding='utf-8')
    marker = '/*SPEC*/var SPEC='
    if marker not in txt:
        raise RuntimeError('Canonical master no longer has the expected SPEC block')
    data, offset = json.JSONDecoder().raw_decode(txt.split(marker, 1)[1])
    if not isinstance(data, dict) or len(data) < 150:
        raise RuntimeError('SPEC appears incomplete; refusing to overwrite generated output')
    encoded = json.dumps(data, ensure_ascii=False, indent=2, sort_keys=True) + '\n'
    if '--check' in sys.argv:
        if not OUTPUT.exists() or OUTPUT.read_text(encoding='utf-8') != encoded:
            raise SystemExit('OUT OF SYNC: run python prompts/specs/gen.py')
        print(f'PASS: {len(data)} canonical studio specifications synchronized')
        return
    OUTPUT.write_text(encoded, encoding='utf-8')
    print(f'Generated {len(data)} canonical studio specifications: {OUTPUT}')

if __name__ == '__main__':
    main()
