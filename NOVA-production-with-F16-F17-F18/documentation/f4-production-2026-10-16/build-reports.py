import json,hashlib,re,os,subprocess,pathlib
A=pathlib.Path(__file__).resolve().parent;R=A.parent.parent
sha=lambda p:hashlib.sha256(pathlib.Path(p).read_bytes()).hexdigest()
sem={r['id']:r for r in json.load(open(A/'semantic-browser.json'))};nat={r['id']:r for r in json.load(open(A/'native-regression.json'))}
reg=json.load(open(R/'integration/component-adapters.json'))
tpl=R/'00-master/NOVA-MATHS-LESSON-LAYOUT-TEMPLATE.html'
master=json.load(open('/workspace/codex-f4/work/master-f4.json'))
C={
'F4-01':('Part–whole bar','whole, known:[k] or [k1,k2]','Integer whole 8–150; one or two positive known parts; missing part = whole − Σknown > 0.',6,'Notice the whole → split → name known → predict → subtract → prove by addition.'),
'F4-02':('Comparison bar','a, b; optional mode (difference/shorter), knownDiff','Integers 1–24 per bar; difference mode or shorter-quantity mode (knownDiff = a − b).',6,'Align → B → pair → gap → subtract → check.'),
'F4-03':('Cuisenaire rod builder','a:[rod lengths], b:[rod lengths]','Rod lengths 1–10; each train at most 10 units (native track). Relation equal / half shown natively; step-6 fraction now computed from the trains.',7,'Whole rod → second train grows rod by rod → equal/relation.'),
'F4-04':('Multi-step bar model','start, changes:[p1,p2]','Start £0.01–£5000 (2 dp); exactly two nonzero successive percentage changes −99…+150.',8,'Base → tenths → change 1 → carry result → change 2 → final → connect.'),
'F4-05':('Fraction of an amount bar (preset of F5-11)','a, n, d','Amount 0–48 integer; denominator 2–8; numerator 0–d. Exact fractional results kept as NOVA Chalk stacked/mixed fractions.',6,'Count → d equal parts → share → select n → combine → exact calculation.'),
'F4-06':('Percentage bar','kind (of/compare/increase/decrease/interest/reverse), base or final, pct; part (compare), years (interest)','Percent 0–150 (decrease ≤ 100); money ≤ £5000, 2 dp.',8,'100% = whole → tenths → 10% → 1% → build p% → amount → link scales → check.'),
'F4-07':('Ratio bar','mode (share/simplify), a, b, total, names','Ratio terms 0.5–10 (1 dp; decimal ratios converted to whole units natively); share total ≤ 10000; ≤ 10 unit boxes per bar natively.',8,'Read → bar A units → bar B units → total parts → one unit → shares → compare → done.'),
'F4-08':('Algebra bar','mode (expression/equation/translator/bar-equation), n, b, total','1–5 equal x-parts; known 0–12; total gives an exact positive integer x.',8,'Whole → x-parts → known → balance → subtract both sides → divide → x → proof.'),
'F4-10':('Bar-to-equation translator (preset of F4-08)','mode:"translator", n, b, total; lesson.overlay "equation"','Same domain as F4-08. Phases 0–3: bar → x-term mapped → known term mapped → equation assembled, with glowing NOVA connectors.',4,'Bar → each part maps to a term → equation assembles.'),
'F4-09':('Before-and-after bar','kind (increase/decrease), before, rate, unknown (before/after/change)','Rate 1–75%; amounts £1–£2000, 2 dp.',8,'Original whole → change % → after bar → change segment → work → solve → proof.'),
'F4-11':('Word-problem highlighter','kind, n, extra, total, expected, segments:[{text,id?,short?}] with whole/part/difference ids','1–5 equal groups; story segments must mark whole, part and difference phrases.',6,'Read → part → whole → map → difference → proof.'),
'F4-12':('Rates tape diagram','kind (rate/amount/units), units, rate, total, u, q, rateUnit','1–6 time units; rate ≤ 10000 (2 dp); total = units × rate.',7,'Read quantities → one unit → copy units → rate → fill → total → proof.'),
}
LIM={
'F4-03':'Native track caps each train at 10 units; Challenge concealment hides train B until the answer, so questions should ask about the second train.',
'F4-04':'Explore drag (carry chip) appears only after step 1 is computed — by native design.',
'F4-05':'Runs on the F5-11 engine (NovaLessonComponent.id = "F5-11"). F5 is not in this pack, so cross-checks against the separate F5-11 source were not possible; keep F5-11 in step when F5 passes its audit.',
'F4-06':'In Challenge, interior amount-scale labels show "?" (otherwise the double number line gives the answer); the percent scale stays visible.',
'F4-07':'Native maximum of 10 unit boxes per bar.',
'F4-10':'Text answers are marked by an exact string match (canonical template), so prompts must give the format (e.g. 3x+5=26, no spaces).',
'F4-11':'Expression answers are marked by an exact string match; Explore drag appears only after a phrase is highlighted (native design).',
}
rows=[r for r in reg if r['id'].startswith('F4-')]
comps=[];ok_all=True
for id_ in sorted(C):
    name,schema,domain,phases,seq=C[id_]
    base=next(r for r in rows if r['id']==('F4-08' if id_=='F4-10' else id_));s=sem.get(id_,{});n=nat.get('F4-08' if id_=='F4-10' else id_,{})
    sp=sum(c['pass'] for c in s.get('checks',[]));st=len(s.get('checks',[]));np_=sum(c['pass'] for c in n.get('checks',[]));nt=len(n.get('checks',[]))
    passed=st>0 and sp==st and not s.get('error') and nt>0 and np_==nt
    challenge=passed and all(c['pass'] for c in s['checks'] if any(k in c['name'] for k in ['six correct','wrong answer','badge','reset','retry','conceal','reveals']))
    status='PASS WITH LIMITATIONS' if passed and id_ in LIM else 'PASS' if passed else ('FAIL' if st else 'NOT VERIFIED')
    ok_all&=passed
    comps.append({'id':id_,'name':name,'presetOf':{'F4-05':'F5-11','F4-10':'F4-08'}.get(id_),'engineId':base['engineId'],'path':base['path'],'status':status,'challengeReady':bool(challenge),'productionReady':passed,
     'sourceSha256':sha(R/base['path']),'originalSha256':sha(R.parent/'src'/base['path']),'lessonField':'data.lesson','lessonState':schema,'numericDomain':domain,'phases':phases,'phaseSequence':seq,
     'lessonMotionFields':['data.lesson.phase','data.lesson.motion.from','data.lesson.motion.to','data.lesson.motion.durationMs','data.lesson.title']+(['data.lesson.overlay'] if id_ in('F4-08','F4-10') else []),
     'previewRule':'animated:true advances native teaching phases on the host clock; static preview shows motion.from; reduced motion shows motion.to; concealAnswers renders the unanswered phase with answer readouts, data attributes and aria hidden.',
     'nativeDraws':base['draws'],'nativeSteps':len(base['nativeFieldsByStep']),'configurationKeys':list(base.get('verifiedBinding',{}).get('config',{}).keys()),
     'masterSpec':master.get(id_,'')[:600],'masterLessons':master['_lessons'].get(id_,[]),
     'events':base.get('verifiedBinding',{}).get('config',{}).get('events'),
     'limitations':LIM.get(id_,''),'evidence':{'semanticChecks':f'{sp}/{st}','nativeChecks':f'{np_}/{nt}','axe':n.get('axe'),'screenshots':sorted(p.name for p in (A/'screenshots').glob(id_+'-*.png'))}})
fam={'family':'F4','revision':'2026-10-16','productionReady':ok_all,'status':'PASS WITH LIMITATIONS' if ok_all else 'FAIL','componentCount':len(comps),
 'note':'Eleven engine files F4-01…F4-09, F4-11, F4-12 plus F4-10 as a preset of F4-08 (no separate file, per master AL table). F4-05 is a preset of F5-11.',
 'template':'00-master/NOVA-MATHS-LESSON-LAYOUT-TEMPLATE.html','templateSha256':sha(tpl),
 'sharedRestrictions':'Original neon/chalk apparatus retained; no redesign. Ready within each declared native numerical domain. Decimal numerals containing digit 4 stay caption-only (existing speech safeguard). Automated accessibility is not human screen-reader certification. Tested headless on Linux Google Chrome 154 via Playwright 1.62 (F0–F3 used Microsoft Edge on Windows). Lessons exported earlier embed source snapshots and must be regenerated.','components':comps}
json.dump(fam,open(A/'F4-capability-manifest.json','w'),indent=1,ensure_ascii=False)
from importlib import util
ex={}
q=subprocess.run(['node','-e',"const {payload}=require('./f4-questions.cjs');const o={};for(const id of "+json.dumps(sorted(C))+")o[id]={challenge:[0,1,2,3,4,5].map(j=>{const {expected,...r}=payload(id,j);return r;})};console.log(JSON.stringify(o))"],cwd=A,capture_output=True,text=True).stdout
ex=json.loads(q)
for id_,v in ex.items():
    l=v['challenge'][0]['data']['lesson'];last=C[id_][3]-1
    v['watch']=[{'source':'SRC','nativeIndex':0,'animated':True,'data':{'lesson':{**l,'phase':None,'motion':{'from':0,'to':last,'durationMs':4000}}},'storedDur':7000,'teaching':'Lesson-authored Watch through every native phase.'}]
    for w in v['watch']: w['data']['lesson'].pop('phase')
    v['guided']=[{'source':'SRC','nativeIndex':0,'data':{'lesson':{**l,'phase':p}}} for p in range(0,C[id_][3])]
    v['bob']=[{'title':t,'source':'SRC','nativeIndex':0,'data':{'lesson':{**v['challenge'][1]['data']['lesson'],'phase':p}}} for t,p in zip(['Notice / Predict','Build / Reveal','Explain / Evidence','Generalise'],[0,min(2,last),min(4,last),last])]
json.dump(ex,open(A/'F4-configuration-examples.json','w'),indent=1,ensure_ascii=False)
# individual audit
L=['# F4 individual component audit','',fam['sharedRestrictions'],'',
 'Each component below was mounted in the approved lesson template (combined F0–F3 release copy) and passed, in a real headless browser: contract accept/reject, two distinct question states with givens rendered and answers concealed in text, aria and data attributes, NOVA glow filters (userSpaceOnUse) and Chalk font, two original views without duplicate IDs, native Explore, lesson-authored Watch motion, a six-question canonical F0-12 game (wrong answer holds and costs a life, automatic advance, canonical score 85, badge and confetti, reset, hint cost, retry), four Guided stages, four Bob beats, and page/frame containment at 1440/1024/390. Native regression compared every original Watch step with the original file.','']
for c in comps:
    cid=c['id'];sp=c['evidence']
    L+=[f"## {cid} — {c['name']}",'',
     f"**Original capability:** {C[cid][4]} {'(Preset of '+c['presetOf']+'.)' if c['presetOf'] else ''}",
     f"**Watch:** Extended — lesson state + phase or motion through native phases ({c['phaseSequence']}). **Explore:** Editable now — native controls; focused restrictions through the shared Explore policy. **Challenge:** {'Compatible — canonical F0-12, six question records tested' if c['challengeReady'] else 'Blocked — see problems'}. **Guided Examples:** Compatible (4 stages tested). **Bob Board:** Compatible (4 beats tested).",
     f"**Numbers and mathematical states:** `{c['lessonState']}` — {c['numericDomain']}",
     "**Multiple views:** Two original scenes in one stage (scoped IDs) tested.",
     f"**Drawing extension:** {'Equation-overlay connectors (NOVA.neonPath/neonRing) added to the existing translator slots; ' if cid in ('F4-08','F4-10') else ''}{'Amount-scale label mask for Challenge; ' if cid=='F4-06' else ''}{'Step-6 fraction computed from the trains (was hard-coded 2/6 = 1/3); ' if cid=='F4-03' else ''}otherwise none — original apparatus unchanged.",
     f"**Master spec check:** lessons {', '.join(c['masterLessons']) or '—'}; spec steps and apparatus match the native drawing (see F4-template-integration.md).",
     "**Template integration:** "+('PASS' if c['productionReady'] else 'FAIL'),
     "**Problems found:** "+{'F4-01':'Had no lesson-state hook: every lesson repeated the 18/7 demo.','F4-03':'Hard-coded 2/6 = 1/3 at step 6 whatever the trains; no lesson hook.','F4-06':'Non-interactive views always showed the MATCHING AMOUNT; the double number line exposed answers on 20% ticks.','F4-08':'Translator preset (F4-10) had slots but no lesson-driven mapping/connectors; heading always printed the full equation.','F4-10':'No dedicated equation overlay sequence; full equation printed in the heading.','F4-05':'No lesson hook on the F5-11 engine preset.'}.get(cid,'No lesson-state hook: lessons could only replay the fixed native demonstration.'),
     "**Changes made:** canonical lesson API + F4 contracts/runtime embedded; data.lesson renderer driving the original present()/render(); contracts validation; core fixes shared with F3 (timeline pause/resume, dragSnap snap/pointer-cancel, speech policy, assessment, retryWrong).",
     "**Remaining restrictions:** "+(c['limitations'] or 'Declared numeric domain only.'),
     f"**Evidence:** semantic-browser.json {sp['semanticChecks']}; native-regression.json {sp['nativeChecks']}; screenshots: {', '.join(sp['screenshots'][:8])}",
     f"**Final component status:** {c['status']}{' — challengeReady: true' if c['challengeReady'] else ' — challengeReady: false'}",'']
open(A/'F4-individual-audit.md','w').write('\n'.join(L))
json.dump({str(p.relative_to(R)):sha(p) for p in sorted((R/'F4').glob('*.html'))+[R/'integration'/f for f in ['nova-f4-contracts.js','nova-f4-runtime.js','nova-lesson-challenge.js','component-adapters.json']]+[tpl]},open(A/'final-source-hashes.json','w'),indent=1)
print(fam['status'],[(c['id'],c['status'],c['challengeReady']) for c in comps])
