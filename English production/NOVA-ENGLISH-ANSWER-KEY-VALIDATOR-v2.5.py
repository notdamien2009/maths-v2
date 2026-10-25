#!/usr/bin/env python3
"""NOVA English v2.5 answer-key coverage gate (structural only).

Run: python NOVA-ENGLISH-ANSWER-KEY-VALIDATOR-v2.5.py LESSON-DATA.json
Add --manifest-out /private/answer-keys.json to write a PRIVATE review index.
Never publish that index as a student asset. Human source/quotation checks
and authenticated parent access remain separate production requirements.
"""
import argparse,json,re
from pathlib import Path

COUNTS={'start':5,'practice':15,'exit':5}
BAD=re.compile(r'answers? (may|will) vary|see (the )?rubric|review against (the )?criteria|parent should check|insert (an? )?answer',re.I)
def filled(v,n=1):return isinstance(v,str) and len(v.strip())>=n
def check(data):
    errors=[];keys=[];ids=set()
    def fail(where,msg): errors.append(where+': '+msg)
    def inspect(section,q,where):
        kind=q.get('kind') or q.get('type')
        qid=q.get('id') or where.replace(':','-')
        if qid in ids: fail(where,'duplicate answer-key ID')
        ids.add(qid)
        if not filled(q.get('question')): fail(where,'question missing')
        writing=q.get('marking')=='judgement' or kind=='writing'
        item={'id':qid,'section':section,'question':q.get('question'),
              'target':None,'sourceEvidence':'REQUIRES HUMAN CHECK',
              'errorToWatchFor':None,'humanReview':writing}
        if writing:
            if section=='practice' and q.get('checking')!='deferred':fail(where,'writing Practice must be deferred')
            if section=='exit' and q.get('checking')!='independent':fail(where,'Exit must be independent')
            guide=q.get('parentGuide') or {}
            model=guide.get('exampleAnswer','')
            if not filled(model,55) or BAD.search(str(model)):fail(where,'specific model answer missing')
            criteria=guide.get('lookFor')
            if not isinstance(criteria,list) or not 2<=len(criteria)<=5 or any(not filled(x,10) for x in criteria):
                fail(where,'2–5 meaningful parent-checklist points required')
            if not filled(guide.get('acceptAlternatives'),20):fail(where,'supported alternative guidance missing')
            mistakes=guide.get('commonMistakes')
            if not isinstance(mistakes,list) or not mistakes or any(not filled(x,10) for x in mistakes):
                fail(where,'source-specific common mistake missing')
            if not filled(guide.get('nextStep'),20):fail(where,'specific next step missing')
            item['target']=model;item['errorToWatchFor']=mistakes
        elif section in COUNTS:
            if q.get('marking')!='exact':fail(where,'objective question must be exact-marked')
            expected='independent' if section=='exit' else 'live'
            if q.get('checking')!=expected:fail(where,'checking must be '+expected)
            answer=q.get('answer')
            if not filled(answer):fail(where,'correct answer missing')
            if kind in ('mcq','visual-mcq') and answer not in (q.get('options') or []):
                fail(where,'MCQ answer absent from displayed options')
            if not filled(q.get('feedbackRight'),12) or not filled(q.get('feedbackWrong'),12):
                fail(where,'source-specific correct/incorrect feedback missing')
            item['target']=answer;item['errorToWatchFor']=q.get('feedbackWrong')
        else:
            source=(data.get('challenge') or {}).get('source') or {}
            opts=q.get('options') if kind=='choice' else source.get('lines') if kind=='line' else None
            if kind in ('choice','line'):
                idx=q.get('correct')
                if not isinstance(idx,int) or not isinstance(opts,list) or not 0<=idx<len(opts):
                    fail(where,'invalid indexed correct answer')
                else:item['target']=opts[idx]
            elif kind=='spelling':
                bank=((data.get('spelling') or {}).get('words') or [])
                idx=q.get('wordIndex')
                if not isinstance(idx,int) or not 0<=idx<len(bank):fail(where,'spelling index invalid')
                else:item['target']=bank[idx].get('word')
            else:fail(where,'unsupported Challenge type')
            if not filled(q.get('success'),12) or not filled(q.get('wrong'),12):
                fail(where,'Challenge explanation missing')
            item['errorToWatchFor']=q.get('wrong')
        keys.append(item)
    for section,count in COUNTS.items():
        a=(data.get('start') or {}).get('diagnostic') or [] if section=='start' else data.get(section) or []
        if len(a)!=count:fail(section,'expected '+str(count)+' tasks, got '+str(len(a)))
        for i,q in enumerate(a,1):
            if q.get('credits',1)!=1:fail(section,'only one credit per question')
            inspect(section,q,section+':'+str(i))
    tasks=((data.get('challenge') or {}).get('tasks') or [])
    if not tasks:fail('challenge','no missions')
    for i,q in enumerate(tasks,1):inspect('challenge',q,'challenge:'+str(i))
    for i,ex in enumerate(data.get('explore') or [],1):
        for j,q in enumerate(ex.get('missions') or [],1):
            opts=q.get('options') if q.get('kind')=='choice' else ex.get('lines')
            idx=q.get('correct')
            if not isinstance(idx,int) or not isinstance(opts,list) or not 0<=idx<len(opts):
                fail('explore:'+str(i)+'.'+str(j),'invalid answer index')
            if not filled(q.get('why'),10) or not filled(q.get('wrong'),10):
                fail('explore:'+str(i)+'.'+str(j),'answer-specific explanation missing')
    return errors,{'status':'PRIVATE QA INDEX — SOURCE ACCURACY UNVERIFIED',
                   'coverage':len(keys),'requiresHumanSourceCheck':True,
                   'questionCounts':COUNTS,'challengeTasks':len(tasks),'keys':keys}

def main():
    p=argparse.ArgumentParser()
    p.add_argument('lesson_json');p.add_argument('--manifest-out')
    a=p.parse_args()
    data=json.loads(Path(a.lesson_json).read_text(encoding='utf8'))
    errors,manifest=check(data)
    for e in errors:print('BLOCK:',e)
    if a.manifest_out and not errors:
        f=Path(a.manifest_out);f.parent.mkdir(parents=True,exist_ok=True)
        f.write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+'\n',encoding='utf8')
        print('PRIVATE manifest:',str(f))
    print('STRUCTURAL '+('PASS — human source verification still required' if not errors else 'FAIL'))
    return bool(errors)
if __name__=='__main__':raise SystemExit(main())
