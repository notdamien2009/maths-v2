#!/usr/bin/env python3
"""NOVA English v2.0 controlled content insertion.

Usage:
  python NOVA-ENGLISH-INSERT-AND-VALIDATE-v2.0.py \
      --template NOVA-ENGLISH-CLEAN-EMPTY-PRODUCTION-MASTER-v2.0.html \
      --data Y7-001-LESSON-DATA.json \
      --output NOVA-Y7-001-REVIEW.html

Inserts original lesson data without rewriting engine/style code. This is a
STRUCTURAL check, not a substitute for teaching or browser/GOLD QA.
"""
from __future__ import annotations
import argparse, json, re, sys
from pathlib import Path

FAMILIES={'reading-detective','evidence-analysis','paragraph-builder','creative-writing',
          'language-editing','poetry-studio','speaking-argument','spelling-word-study'}
BEATS=['NOTICE / PREDICT','BUILD / REVEAL','EXPLAIN / EVIDENCE','GENERALISE / CARRY FORWARD']
SLOTS=[('S1','core','short'),('S2','core','visual-mcq'),('S3','secure','mcq'),('S4','secure','visual-short'),('S5','stretch','written')]

def require(ok,message):
    if not ok: raise ValueError('NOVA PRODUCTION BLOCK: '+message)

def nonempty(s):return isinstance(s,str) and bool(s.strip())

def credits(items):return sum(int(x.get('credits') or 1) for x in items)

def validate(data):
    m=data.get('meta') or {}
    for k in ('year','lesson','title','objective','websiteRef'):require(bool(m.get(k)),f'meta.{k} required')
    require(m.get('year') in (7,8,9),'year must be Y7/Y8/Y9')
    require(m.get('templateMode') is False,'meta.templateMode must be false on a production candidate')
    require(not re.search(r'\{\{[^{}]+\}\}',json.dumps(data,ensure_ascii=False)),'unresolved {{field}} in content')
    require('data-template-slot' not in json.dumps(data),'unresolved assessment visual slot')
    start=data.get('start') or {};diagnostic=start.get('diagnostic') or []
    require(len(diagnostic)==5,'Start requires exactly 5 diagnostic tasks')
    for i,(id,tier,kind) in enumerate(SLOTS):
        q=diagnostic[i]
        require(q.get('id')==id and q.get('tier')==tier and q.get('type')==kind,f'Start slot {id}: wrong ID/tier/type')
        require(nonempty(q.get('question')),'Start question '+id+' is blank')
    bob=(data.get('bob') or {}).get('concepts') or []
    require(3<=len(bob)<=5,'Bob Board requires 3–5 concepts')
    seen=set()
    for i,concept in enumerate(bob,1):
        cid=concept.get('id');require(nonempty(cid) and cid not in seen,f'Concept {i} ID invalid/duplicated');seen.add(cid)
        states=concept.get('states') or [];require(len(states)==4,f'Concept {i} requires 4 presentation beats')
        for j,st in enumerate(states):
            require(st.get('beat')==BEATS[j],f'Concept {i}, beat {j+1}: required beat name mismatch')
            for k in ('speech','visualHTML','mathHTML','focus'):
                require(nonempty(st.get(k)),f'Concept {i}, beat {j+1}: {k} missing')
            cue=st.get('mascot') or {}
            require(nonempty(cue.get('action')) and nonempty(cue.get('pose')),f'Concept {i}, beat {j+1}: mascot action/pose missing')
    explore=data.get('explore') or []
    require(len(explore)==len(bob),'one Explore activity per Bob concept')
    for i,a in enumerate(explore):
        require(a.get('id')==f'EX{i+1}' and a.get('conceptId')==bob[i]['id'],f'Explore {i+1}: mapping mismatch')
        require(len(a.get('lines') or [])>=2,f'Explore {i+1}: original source lines missing')
        missions=a.get('missions') or []
        require(missions or a.get('format') in ('novel','poem','letter','email','notice','article','script','spag'),f'Explore {i+1}: unsupported activity')
        for t in missions:
            require(t.get('kind') in ('choice','line') and nonempty(t.get('question')),f'Explore {i+1}: invalid mission')
            options=(a.get('lines') or []) if t.get('kind')=='line' else t.get('options') or []
            require(len(options)>=2 and isinstance(t.get('correct'),int) and 0<=t['correct']<len(options),f'Explore {i+1}: answer index invalid')
            require(nonempty(t.get('why')) and nonempty(t.get('wrong')),f'Explore {i+1}: both right/wrong feedback required')
    examples=data.get('examples') or []
    require(3<=len(examples)<=5,'Examples require 3–5 models')
    example_ids=set()
    for i,ex in enumerate(examples,1):
        require(nonempty(ex.get('id')) and ex['id'] not in example_ids,f'Example {i} has duplicated/missing ID')
        example_ids.add(ex['id'])
        require(nonempty(ex.get('visualHtml')) and nonempty(ex.get('question')),f'Example {i}: source/visual missing')
        require(3<=len(ex.get('steps') or [])<=5,f'Example {i}: 3–5 steps required')
        require(len(ex.get('mascotCues') or [])==len(ex['steps']),f'Example {i}: each step needs matching mascot cue')
    for section,target in [('practice',15),('exit',10)]:
        tasks=data.get(section) or []
        require(tasks and credits(tasks)==target,f'{section}: exactly {target} credits required')
        ids=set()
        for task in tasks:
            qid=task.get('id');require(nonempty(qid) and qid not in ids,f'{section}: missing/duplicate question ID')
            ids.add(qid);require(nonempty(task.get('question')),f'{section} {qid}: question missing')
            if task.get('type') in ('written','extended','editing'):
                criteria=task.get('rubric') or task.get('criteria') or task.get('successCriteria') or []
                require(criteria or task.get('checking')=='judgement',f'{section} {qid}: written answer needs judgement pathway')
            if section=='exit':require(not task.get('hint') and task.get('checking')!='live',f'Exit {qid}: hints/live checks forbidden')
    for section,key in [('practiceSources','practice'),('exitSources','exit')]:
        for src in data.get(section) or []:
            require(isinstance(src.get('beforeQuestion'),int) and 0<=src['beforeQuestion']<len(data[key]),f'{section} source position invalid')
            require(nonempty(src.get('text')),f'{section} source text empty')
    ch=data.get('challenge') or {};family=ch.get('type')
    require(family in FAMILIES,'Challenge type missing or unknown')
    require(nonempty(ch.get('id')) and nonempty(ch.get('title')),'Challenge id/title required')
    tasks=ch.get('tasks') or [];require(len(tasks)>=1,'Challenge must have at least one meaningful task')
    for i,t in enumerate(tasks,1):
        kind=t.get('kind');require(kind in ('choice','line','writing','spelling'),f'Challenge task {i}: invalid kind')
        require(nonempty(t.get('question')),f'Challenge task {i}: question required')
        if kind=='choice':
            require(len(t.get('options') or [])>=2 and isinstance(t.get('correct'),int) and 0<=t['correct']<len(t['options']),f'Challenge task {i}: choice config invalid')
        elif kind=='line':
            lines=(ch.get('source') or {}).get('lines') or []
            require(lines and isinstance(t.get('correct'),int) and 0<=t['correct']<len(lines),f'Challenge task {i}: evidence line index invalid')
        elif kind=='writing':
            require(len(t.get('rubric') or [])>=2,f'Challenge task {i}: require 2+ writing success criteria')
        else:
            words=(data.get('spelling') or {}).get('words') or []
            require(family=='spelling-word-study' and isinstance(t.get('wordIndex'),int) and 0<=t['wordIndex']<len(words),f'Challenge task {i}: mapped spelling word invalid')
    if family=='spelling-word-study':
        require(nonempty((data.get('spelling') or {}).get('bankId')),'Word Study Challenge requires stable spelling bankId')
    return {'lesson':m['websiteRef'],'concepts':len(bob),'explore':len(explore),'examples':len(examples),'start':len(diagnostic),'practiceCredits':credits(data['practice']),'exitCredits':credits(data['exit']),'challengeFamily':family}

def main():
    cli=argparse.ArgumentParser(description=__doc__)
    cli.add_argument('--template',type=Path,required=True);cli.add_argument('--data',type=Path,required=True);cli.add_argument('--output',type=Path,required=True)
    a=cli.parse_args();html=a.template.read_text(encoding='utf-8');data=json.loads(a.data.read_text(encoding='utf-8'))
    proof=validate(data)
    pattern=r'(<script id="novaLessonData" type="application/json">).*?(</script>)'
    require(len(re.findall(pattern,html,re.S))==1,'expected exactly one novaLessonData JSON script in master')
    escaped=json.dumps(data,ensure_ascii=False,indent=2).replace('<',r'\u003c')
    filled=re.sub(pattern,lambda m:m.group(1)+'\n'+escaped+'\n'+m.group(2),html,count=1,flags=re.S)
    a.output.parent.mkdir(parents=True,exist_ok=True);a.output.write_text(filled,encoding='utf-8')
    print('NOVA CONTENT PREFLIGHT PASSED — structural only, browser/pedagogy/audio/site QA still required')
    print(json.dumps(proof,indent=2));print('Generated:',a.output)
if __name__=='__main__':
    try:main()
    except (OSError,ValueError,KeyError,TypeError,json.JSONDecodeError) as e:
        print('BLOCKED:',e,file=sys.stderr);sys.exit(2)