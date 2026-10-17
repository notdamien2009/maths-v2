#!/usr/bin/env python3
"""NOVA v35.3 master/source fidelity preflight; never a replacement for live QA.

Commands:
  lock --master MASTER.html --source-zip components.zip --lesson Y7-001 --out lock.json
  verify --master MASTER.html --source-zip components.zip --lock lock.json
         --coverage component-mode-coverage.json --assessments assessment-visual-matrix.json
  selftest --master MASTER.html --source-zip components.zip --lesson Y7-001

Evidence-file checks resolve against --evidence-root or coverage/assessment file parent.
No script can prove a picture's mathematical correctness or audible pronunciation;
those require actual browser inspection and real device listening.
"""
import argparse, hashlib, json, pathlib, re, sys, zipfile, tempfile
from collections import Counter

class GateError(Exception): pass

def fail(msg): raise GateError(msg)
def sha(b): return hashlib.sha256(b).hexdigest()
def readj(p): return json.loads(pathlib.Path(p).read_text(encoding='utf-8'))

def parse_master(path):
    data=pathlib.Path(path).read_bytes();s=data.decode('utf-8'); dec=json.JSONDecoder()
    def part(name):
        m=re.search(r'(?<![\w])'+re.escape(name)+r'=',s)
        if not m:fail(f'MASTER missing {name}=')
        try:return dec.raw_decode(s[m.end():])[0]
        except (json.JSONDecodeError, ValueError) as e:fail(f'MASTER {name} parse failed: {e}')
    rows, mp, aliases=part('LS'),part('MAP'),part('AL')
    ls={row[0]:row for row in rows if isinstance(row,list) and len(row)>=6}
    if not ls or not mp:fail('MASTER has no LS or MAP')
    return {'hash':sha(data),'ls':ls,'map':mp,'al':aliases}

def resolve(cid, aliases):
    seen=set(); cur=cid; chain=[]
    while cur in aliases:
        if cur in seen:fail(f'Alias cycle: {cid}')
        seen.add(cur)
        val=aliases[cur]
        if not isinstance(val,list) or len(val)<2:fail(f'Malformed alias {cur}')
        chain.append({'aliasId':cur,'sourceId':val[0],'meaning':val[1]})
        cur=val[0]
    return cur,chain

def source_lookup(z):
    by={}
    for n in z.namelist():
        m=re.search(r'/(F\d+-\d{2})-[^/]*\.html$',n)
        if m:by.setdefault(m.group(1),[]).append(n)
    return by

def expected_lock(master, zip_path, lesson):
    if lesson not in master['ls'] or lesson not in master['map']:fail(f'Lesson {lesson} missing in master LS/MAP')
    ids=master['map'][lesson]
    if not isinstance(ids,list) or not ids or len(ids)!=len(set(ids)):fail(f'Invalid MAP[{lesson}]')
    with zipfile.ZipFile(zip_path) as z:
        lookup=source_lookup(z); entries={}
        for cid in ids:
            src, chain=resolve(cid,master['al']);paths=lookup.get(src,[])
            if len(paths)!=1:fail(f'{cid} resolves to {src}, expected 1 original HTML in source ZIP but found {len(paths)}; paths={paths}')
            path=paths[0]
            entries[cid]={'mappedId':cid,'sourceId':src,'sourcePath':path,
                          'sourceSha256':sha(z.read(path)), 'aliasChain':chain,
                          'presetRequirement':(' | '.join(x['meaning'] for x in chain)) if chain else None}
        if 'F0-12' in ids:
            paths=[n for n in z.namelist() if n.endswith('/integration/nova-f0-12-game-wrapper.js')]
            if len(paths)!=1:fail('Original F0-12 integration controller missing from source ZIP')
            entries['F0-12']['canonicalAdapterPath']=paths[0]
            entries['F0-12']['canonicalAdapterSha256']=sha(z.read(paths[0]))
    row=master['ls'][lesson]
    return {'contractVersion':'35.3','lessonId':lesson,'masterSha256':master['hash'],
            'sourceArchiveSha256':sha(pathlib.Path(zip_path).read_bytes()),
            'title':row[1],'objective':row[3],'scope':row[4],
            'requiredIds':ids,'componentSources':entries}

def eq_json(a,b):return json.dumps(a,sort_keys=True,ensure_ascii=False)==json.dumps(b,sort_keys=True,ensure_ascii=False)

def check_lock(master,zip_path,actual):
    exp=expected_lock(master,zip_path,actual.get('lessonId',''))
    if not eq_json(exp,actual):
        bad=[k for k in exp if not eq_json(exp[k],actual.get(k))]
        fail('MASTER LOCK MISMATCH fields='+', '.join(bad)+'; missing IDs/aliases or modified source not permitted')
    return exp

def path_check(path, base):
    if not path or not isinstance(path,str):fail('Missing evidenceFile')
    p=pathlib.Path(path)
    p=p if p.is_absolute() else (base/p)
    if not p.is_file() or p.stat().st_size==0:fail(f'Evidence file absent/empty: {p}')


def verify_coverage(lock, path, evidence_root):
    j=readj(path); required=lock['requiredIds']
    if j.get('lessonId')!=lock['lessonId'] or j.get('requiredIds')!=required:fail('Coverage manifest lessonId/requiredIds mismatch')
    if 'namedActivity' in j or 'namedActivityExecution' in j:
        fail('Retired standalone game fields may not appear in component coverage')
    base=pathlib.Path(evidence_root) if evidence_root else pathlib.Path(path).parent
    f0=j.get('canonicalF012',{})
    original=lock['componentSources'].get('F0-12',{})
    if 'F0-12' in required:
        if (f0.get('sourceSha256')!=original.get('sourceSha256') or
            f0.get('canonicalAdapterSha256')!=original.get('canonicalAdapterSha256') or
            not f0.get('runtimeVerified')):fail('Canonical ORIGINAL F0-12 runtime provenance FAILED; recreated controller not allowed')
        if any(x in (f0.get('runtimeConstructor','')) for x in ['NovaF012WrapperFactory','CustomF012','Recreated']):
            fail('Recreated F0-12 runtime detected')
        path_check(f0.get('evidenceFile'),base)
    rows=j.get('modeAssignments',[])
    if not rows:fail('No actual component-mode coverage')
    used=set();seen_concepts=set();shown_modes=set()
    allowed_modes={'Bob','Watch','Explore','Challenge','Guided','Start','Practice','Exit'}
    for r in rows:
        mid=r.get('mappedId');
        if mid not in required:fail(f'Unmapped component {mid} in {r}')
        src=lock['componentSources'][mid]
        if r.get('sourceId')!=src['sourceId']:fail(f'Wrong native source for {mid}')
        if src['aliasChain'] and r.get('nativePreset')!=src['presetRequirement']:
            fail(f'Alias preset missing/wrong for {mid}')
        if r.get('mode') not in allowed_modes:fail(f'Unknown mode {r.get("mode")}')
        concept=r.get('concept')
        if isinstance(concept,int) and 1<=concept<=5:seen_concepts.add(concept)
        if not r.get('nativeStateRef'):fail(f'Missing actual source state reference for {mid}')
        if not r.get('questionIds') and r.get('mode') in ['Challenge','Start','Practice','Exit']:
            fail(f'Missing question-IDs for visual mode {r.get("mode")}')
        path_check(r.get('evidenceFile'),base)
        used.add(mid);shown_modes.add(r.get('mode'))
    missing=set(required)-used
    if missing:fail('Mapped components unaccounted for in actual lesson: '+str(sorted(missing)))
    if seen_concepts!={1,2,3,4,5}:fail('All 5 concepts do not have mode coverage')
    for m in ('Watch','Explore','Challenge','Guided','Bob'):
        if m not in shown_modes:fail(f'No {m} mode coverage evidence')
    return f'Component-mode coverage {len(rows)} rows, all exact IDs and aliases preserved'


def verify_assessments(lock,path,evidence_root):
    j=readj(path); base=pathlib.Path(evidence_root) if evidence_root else pathlib.Path(path).parent
    if j.get('lessonId')!=lock['lessonId']:fail('Assessment matrix different lesson')
    rows=j.get('items',[]); expected=[f'S{i}' for i in range(1,6)]+[f'P{i}' for i in range(1,16)]+[f'X{i}' for i in range(1,11)]
    ids=[r.get('id') for r in rows]
    if len(ids)!=30 or Counter(ids)!=Counter(expected):fail('S1–S5/P1–P15/X1–X10 missing/duplicated')
    count=0; sections=set()
    for row in rows:
        qid=row['id'];givens=row.get('publicGivens')
        if not isinstance(givens,list):fail(f'{qid}: publicGivens must be exact list of strings')
        if not all(isinstance(x,str) for x in givens):fail(f'{qid}: publicGivens not strings')
        if not row.get('questionText'):fail(f'{qid}: question text missing')
        v=row.get('visual',{})
        if v.get('kind')=='none':
            if len(v.get('reason',''))<18:fail(f'{qid}: no-visual reason missing or vague')
            continue
        if v.get('kind')!='native':fail(f'{qid}: unknown visual kind')
        cid=v.get('mappedId')
        if cid not in lock['requiredIds']:fail(f'{qid}: native visual unmapped {cid}')
        src=lock['componentSources'][cid]
        if v.get('sourceId')!=src['sourceId']:fail(f'{qid}: wrong source ID for mapped visual')
        if src['aliasChain'] and v.get('nativePreset')!=src['presetRequirement']:
            fail(f'{qid}: missing alias preset')
        if not isinstance(v.get('nativeConfig'),dict) or not v['nativeConfig']:
            fail(f'{qid}: question specific nativeConfig absent')
        if v.get('renderedGivens')!=givens:
            fail(f'{qid}: QUESTION-VISUAL NUMBER MISMATCH public {givens} displayed {v.get("renderedGivens")}')
        if v.get('answerVisibleBeforeFeedback') is not False:
            fail(f'{qid}: answer leakage or concealment unverified')
        if not v.get('browserInspected') or not v.get('mathsChecked'):
            fail(f'{qid}: visible screenshot requires browser and maths verification, not schema alone')
        path_check(v.get('evidenceFile'),base)
        count+=1; sections.add(qid[0])
    if count<6 or not {'S','P'}.issubset(sections):
        fail(f'Expected >=6 genuine assessment visual aids across Start and Practice; got {count}, sections {sections}')
    return f'All 30 assessments have visual policy; {count} native visual states with exact reported givens and evidence'


def main():
    p=argparse.ArgumentParser(description=__doc__); sub=p.add_subparsers(dest='command',required=True)
    a=sub.add_parser('lock');a.add_argument('--master',required=True);a.add_argument('--source-zip',required=True);a.add_argument('--lesson',required=True);a.add_argument('--out',required=True)
    b=sub.add_parser('verify');b.add_argument('--master',required=True);b.add_argument('--source-zip',required=True);b.add_argument('--lock',required=True);b.add_argument('--coverage',required=True);b.add_argument('--assessments',required=True);b.add_argument('--evidence-root')
    c=sub.add_parser('selftest');c.add_argument('--master',required=True);c.add_argument('--source-zip',required=True);c.add_argument('--lesson',required=True)
    args=p.parse_args()
    try:
        master=parse_master(args.master)
        if args.command=='lock':
            obj=expected_lock(master,args.source_zip,args.lesson);pathlib.Path(args.out).write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
            print('PASS: exact mapping '+ ' / '.join(obj['requiredIds'])+'; canonical F0-12 Challenge only');return 0
        if args.command=='verify':
            locked=check_lock(master,args.source_zip,readj(args.lock))
            print('PASS: immutable master MAP/AL/source lock')
            print('PASS:',verify_coverage(locked,args.coverage,args.evidence_root))
            print('PASS:',verify_assessments(locked,args.assessments,args.evidence_root))
            print('STATIC + EVIDENCE GATES PASSED — STILL REQUIRE REAL BROWSER/VOICE/NATIVE RUNTIME TESTS BEFORE GOLD')
            return 0
        if args.command=='selftest':
            obj=expected_lock(master,args.source_zip,args.lesson)
            assert obj['requiredIds']==master['map'][args.lesson]
            # Deliberately remove mapped alias to prove hard fail
            tampered=json.loads(json.dumps(obj));tampered['requiredIds'].pop()
            try:check_lock(master,args.source_zip,tampered)
            except GateError:pass
            else:fail('Selftest did not reject incomplete map')
            if 'F2-04' in obj['componentSources']:
                tampered=json.loads(json.dumps(obj));tampered['componentSources']['F2-04']['presetRequirement']='generic blocks'
                try:check_lock(master,args.source_zip,tampered)
                except GateError:pass
                else:fail('Selftest did not reject erased alias')
            # Prove assessment checker rejects a recorded mismatch independently.
            with tempfile.TemporaryDirectory() as td:
                td=pathlib.Path(td)
                (td/'browser-evidence.png').write_bytes(b'test-fixture-not-real-qa')
                items=[]
                ids=[f'S{i}' for i in range(1,6)]+[f'P{i}' for i in range(1,16)]+[f'X{i}' for i in range(1,11)]
                valid_id=next(x for x in obj['requiredIds'] if x!='F0-12' and not obj['componentSources'][x]['aliasChain'])
                for idx,qid in enumerate(ids):
                    item={'id':qid,'questionText':'Fixture prompt shows 43.07','publicGivens':['43.07']}
                    if idx<6:
                        item['visual']={'kind':'native','mappedId':valid_id,'sourceId':valid_id,
                             'nativeConfig':{'number':'43.07'},'renderedGivens':['43.07'],
                             'answerVisibleBeforeFeedback':False,'browserInspected':True,
                             'mathsChecked':True,'evidenceFile':'browser-evidence.png'}
                    else:item['visual']={'kind':'none','reason':'No additional image is needed for this text-only assessment item.'}
                    items.append(item)
                j={'lessonId':args.lesson,'items':items}
                f=td/'assess.json'; f.write_text(json.dumps(j))
                verify_assessments(obj,f,None)
                items[0]['visual']['renderedGivens']=['0']
                f.write_text(json.dumps(j))
                try:verify_assessments(obj,f,None)
                except GateError:pass
                else:fail('Selftest did not reject mismatched question visual numbers')
            print('PASS selftest: exact map, alias lock, 30 assessment slots and mismatched diagram rejection');return 0
    except (GateError,FileNotFoundError,zipfile.BadZipFile) as e:
        print('HARD FAIL:',e,file=sys.stderr);return 2
    except Exception as e:
        print('FAIL: unexpected checker issue:',repr(e),file=sys.stderr);return 3

if __name__=='__main__':sys.exit(main())
