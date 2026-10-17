#!/usr/bin/env python3
"""NOVA Maths V2: zero-drift structural preflight (not browser/visual proof).
Usage: python verify_ui_drift.py lesson.html [MASTER-COMPONENT-MAPPING-LOCKED.json]
Exit 1 on defects. This is deliberately narrower than full screenshot/math QA.
"""
import argparse
import json
import re
import sys
from pathlib import Path

def script_json(html, tag):
    match = re.search(r'<script\b[^>]*\bid=[\"\']' + re.escape(tag) + r'[\"\'][^>]*>(.*?)</script>', html, re.I | re.S)
    if not match:
        raise ValueError('Required script not found: '+tag)
    return json.loads(match.group(1))

def test(path, mapping=None):
    html=Path(path).read_text(encoding='utf-8',errors='replace')
    data=script_json(html,'novaLessonData')
    prod=script_json(html,'novaProductionData')
    failures=[]
    def require(ok, msg):
        if not ok:failures.append(msg)
    start=data.get('start',{}).get('diagnostic',[]) if isinstance(data.get('start'),dict) else data.get('start',[])
    practice=data.get('practice',[])
    exits=data.get('exit',[])
    examples=data.get('examples',[])
    concepts=data.get('learn',[])
    require(len(start)==5, f'Start count must be 5 (found {len(start)})')
    require(len(practice)==15, f'Practice must have 15 questions (found {len(practice)})')
    require(len(exits)==10, f'Exit must have 10 questions (found {len(exits)})')
    require(len(concepts)==5, f'Learn must have five concepts (found {len(concepts)})')
    require(1<=len(examples)<=5, f'Examples count max FIVE (found {len(examples)})')
    if len(start)>=3:
        for i in (1,2):
            actual=str(start[i].get('type','')).lower()
            require('mcq' in actual or 'multiple-choice' in actual, f'Start S{i+1} must be MCQ (found {actual!r})')
    raw_aids=prod.get('assessmentVisuals',[])
    aids=[str(item.get('id','')).upper() for item in raw_aids]
    require(len(aids)==6 and len(set(aids))==6, f'Exactly 6 distinct assessment aid IDs required (found {aids})')
    starts=[id for id in aids if id.startswith('S')]
    pracs=[id for id in aids if id.startswith('P')]
    exit_aids=[id for id in aids if id.startswith('X')]
    require(sorted(starts)==['S1','S2'],f'Start visuals only S1/S2 (found {starts})')
    require(len(pracs)==4,f'Practice needs exactly FOUR visuals (found {pracs})')
    require(not exit_aids,f'Exit must have ZERO visuals (found {exit_aids})')
    by_id={str(q.get('id','')).upper():q for q in practice}
    tiers=[str(by_id.get(id,{}).get('tier','')).lower() for id in pracs]
    require(sorted(tiers)==['core','core','secure','stretch'],f'Practice visual split must be two Core/one Secure/one Stretch (got {tiers})')
    if 'NUMBER BOUNCER' in html.upper():
        # Native V2 source may legitimately contain historic names in embedded demos;
        # inspect lesson-facing data, not the entire immutable component source bundle.
        pass
    visible_labels=' '.join(str(c.get('badgeTitle',''))+' '+str(c.get('challengeTitle','')) for c in concepts)
    names=re.findall(r'\b(?:NUMBER BOUNCER|DIGIT VAULT|ROLLING ROUNDER)\b',visible_labels,re.I)
    require(not names,f'Retired named standalone game leaked into lesson UI: {names}')
    if mapping:
        master=json.loads(Path(mapping).read_text())
        id=data.get('meta',{}).get('lesson') or data.get('meta',{}).get('curriculumCode')
        m=master.get('map',{}).get(id)
        if m is None:failures.append('No master MAP row for '+str(id))
        else:
            required={id for id in m if id!='F0-12'}
            source_values=set(prod.get('sourceIds',{}).values()) | set(prod.get('sourceIds',{}))
            aliases=master.get('aliases',{})
            source_ids={id for id in required if id in source_values or (id in aliases and aliases[id][0] in source_values)}
            require(required<=source_ids,f'Missing mapped teaching sources: {sorted(required-source_ids)}')
            # Runtime family teaching assignment verification requires browser plus alias resolution.
    print(json.dumps({'lesson':data.get('meta',{}).get('lesson'), 'status':'FAIL' if failures else 'STRUCTURAL_PREFLIGHT_PASS_BROWSER_QA_STILL_REQUIRED','observed':{'learnConcepts':len(concepts),'examples':len(examples),'visualAids':aids,'visualTiers':tiers},'issues':failures},indent=2))
    return not failures

if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('html')
    parser.add_argument('master_map',nargs='?')
    args=parser.parse_args()
    try:sys.exit(0 if test(args.html,args.master_map) else 1)
    except Exception as error:
        print(json.dumps({'status':'ERROR','error':str(error)}),file=sys.stderr)
        sys.exit(2)