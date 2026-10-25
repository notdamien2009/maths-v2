#!/usr/bin/env python3
"""NOVA English: check whether a numbered KS3 lesson is a formal assessment."""
import argparse, json
from pathlib import Path
def route(year, lesson):
    data=json.loads(Path(__file__).with_name('ASSESSMENT-UNIT-MAP.json').read_text(encoding='utf-8'))
    rows=[r for r in data['assessments'] if r['year']==year and r['assessmentLesson']==f'{lesson:03d}']
    if len(rows)>1: raise ValueError('Duplicate assessment routing key')
    return {'route':'ASSESSMENT' if rows else 'TEACHING', 'year':year, 'lesson':f'{lesson:03d}', 'details':rows[0] if rows else {}}
if __name__ == '__main__':
    ap=argparse.ArgumentParser();ap.add_argument('year',type=int);ap.add_argument('lesson',type=int);a=ap.parse_args()
    if a.year not in (7,8,9): ap.error('Year must be 7, 8 or 9')
    print(json.dumps(route(a.year,a.lesson), indent=2))
