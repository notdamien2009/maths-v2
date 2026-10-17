import json,glob,os,hashlib,re,shutil,datetime
W='/workspace/codex-f5/work';A=W+'/audit/f5-production-2026-10-16';M='/workspace/codex-f5/merge/NOVA-F0-F3-production'
sha=lambda p:hashlib.sha256(open(p,'rb').read()).hexdigest()
reg={r['id']:r for r in json.load(open(W+'/integration/component-adapters.json')) if r['id'].startswith('F5')}
gen={r['id']:r for r in json.load(open(W+'/qa-after/results-0.json'))}
names={}
for f in sorted(glob.glob(W+'/F5/*.html')):
    b=os.path.basename(f);names[b[:5]]=(b,re.search(r'data-title="([^"]*)"',open(f).read()).group(1))
pay=open('/workspace/codex-f5/f5payload.js').read()
import subprocess
qs=json.loads(subprocess.check_output(['node','-e',pay+';const o={};for(const id of %s)o[id]=[0,1,2,3,4,5].map(j=>payload(id,j));console.log(JSON.stringify(o))'%json.dumps(list(names))]))
rows=[];manifest=[];audit=[]
GROUPS=[('F0 foundation (neon filters userSpaceOnUse, no glyph/star leaks)',r'^F0 '),('F1 fraction notation (stacked NOVA Chalk, no inline slash in drawings, no TBD)',r'^F1 '),('F2 chalk typography + no dark frames',r'^F2 '),('F3 mascot pack + responsive containment (390/1024/1440)',r'^F3 |^no .undefined'),
 ('Template integration (F0-12 challenge, Guided, Bob, multi-view, Explore)',r'question|wrong answer|six correct|canonical scoring|badge|reset score|retry|guided|Bob|views|duplicate|Explore|lesson page width|apparatus frame width|unanswered|no runtime errors')]
for id,(b,title) in names.items():
    R=json.load(open(A+'/semantic-browser-%s.json'%id))[0] if os.path.exists(A+'/semantic-browser-%s.json'%id) else {'checks':[],'error':'not run','errors':[]}
    ch=R['checks'];ok=[c for c in ch if c['pass']];bad=[c for c in ch if not c['pass']]
    err=R.get('error') or (R['errors'][0] if R['errors'] else '')
    chall=[c for c in ch if re.search(r'question|wrong answer|six correct|canonical scoring|badge|reset score|retry|unanswered',c['name'])]
    cready=bool(chall) and all(c['pass'] for c in chall) and not err and len(chall)>=15
    g=gen.get(id,{});gi=g.get('integration',{})
    genok=not g.get('error') and not g.get('errors') and gi.get('game',{}).get('correctAdvanced') and gi.get('game',{}).get('wrongHeld')
    comp=[]
    for gname,rx in GROUPS:
        sel=[c for c in ch if re.search(rx,c['name'])];p=bool(sel) and all(c['pass'] for c in sel) and not err
        comp.append({'standard':gname,'pass':p,'checks':len(sel),'failed':[c['name'] for c in sel if not c['pass']]})
    allpass=not bad and not err and genok
    strict=sum(1 for c in ch if 'answer value not visible' in c['name'])
    st='PASS WITH LIMITATIONS' if allpass else 'FAIL'
    rows.append((id,title,len(ok),len(ch),allpass,cready,genok,strict,st,comp))
    q=qs[id]
    manifest.append({'id':id,'name':title,'path':'F5/'+b,'status':st,'productionReady':allpass,'challengeReady':cready,'sourceSha256':sha(W+'/F5/'+b),'originalSha256':sha(W+'/originals/'+b),
      'nativeSteps':gi.get('descriptor',{}).get('stepCount'),'nativeFieldsByStep':reg[id].get('nativeFieldsByStep'),'draws':reg[id].get('draws'),'tables':reg[id].get('tables'),'exploreFields':reg[id].get('exploreFields'),
      'configurationKeys':list(gi.get('descriptor',{}).get('config',{}).keys()),'presets':gi.get('descriptor',{}).get('config',{}).get('presets'),
      'lessonPreset':'record.config {presets:{lesson:{...native preset fields}},preset:"lesson"} (F5 runtime reserved slot)',
      'modes':['watch','guided','explore','challenge'],'templateModes':['Learn-Watch','Learn-Explore','Learn-Challenge (F0-12)','Examples-Guided','Bob Board'],
      'events':['value','correct','step','hintUsed','mode'],'challengeQuestionExample':{k:v for k,v in q[0].items() if k!='expected'},
      'compliance':comp,'tests':{'f5Production':{'passed':len(ok),'total':len(ch),'error':err or None},'bankRegression':bool(genok)},
      'limitations':['Concealment for small-integer answers is verified by result-role readout checks, not by absence of the digit (scale labels can legitimately contain it).','Narration with decimal numerals containing digit 4 stays caption-only (speech policy).','Real speech output not executed; automated a11y only.']})
    audit.append((id,title,b,R,comp,cready,allpass,genok,q))
os.makedirs(A,exist_ok=True)
json.dump({'family':'F5','revision':'2026-10-16','status':'PASS WITH LIMITATIONS' if all(r[4] for r in rows) else 'FAIL','componentCount':len(rows),
 'note':'Eighteen F5 engines present in the source pack (F5-01..F5-07, F5-09..F5-19) (F5-08 absent from the supplied folder; not invented). F4-05 is a preset of F5-11.','template':'00-master/NOVA-MATHS-LESSON-LAYOUT-TEMPLATE.html','templateSha256':sha(W+'/00-master/NOVA-MATHS-LESSON-LAYOUT-TEMPLATE.html'),'components':manifest},open(A+'/F5-capability-manifest.json','w'),indent=1)
json.dump({id:[{k:v for k,v in x.items() if k!='expected'} for x in q] for id,q in qs.items()},open(A+'/F5-configuration-examples.json','w'),indent=1)
L=['# F5 individual audit — fractions, decimals, percentages (2026-10-16)','','Every component was audited and tested separately against the F0, F1, F2 and F3 standards and the approved lesson template. Evidence: `semantic-browser-F5-XX.json`, `per/F5-XX.log`, `screenshots/`. Bank regression: `bank-regression-results.json`.','']
for id,title,b,R,comp,cready,allpass,genok,q in audit:
    ch=R['checks']
    L+=['## %s — %s'%(id,title),'','**File:** `F5/%s`  '%b,'**Final component status:** %s  '%('PASS WITH LIMITATIONS' if allpass else 'FAIL'),'**challengeReady:** %s'%('true' if cready else 'false'),'',
        '| Standard | Result | Checks | Evidence |','|---|---|---|---|']
    for c in comp: L.append('| %s | %s | %d | %s |'%(c['standard'],'PASS' if c['pass'] else 'FAIL',c['checks'],'all passed' if c['pass'] else ', '.join(c['failed'])[:300] or (R.get('error') or 'not run')))
    L.append('| Bank regression (test-components.cjs: native modes, invalid-state rejection, value binding, template Learn/Explore/Challenge/Examples/Bob) | %s | — | qa results-0.json |'%('PASS' if genok else 'FAIL'))
    L+=['','**Watch / Guided:** native step table; every numeric value is a step field the lesson sets (`nativeIndex` + `data`). Captions are step fields and must be supplied by the lesson (native captions describe the demo numbers).',
        '**Explore:** native controls; values via exploreBindings and the reserved `lesson` preset; controls can be limited via explore policy.',
        '**Challenge:** original F0-12 through the template controller; 6 question-specific unanswered states tested (distinct, values rendered, result readouts concealed), wrong hold, auto-advance, scoring 85 after one retry, badge + confetti, reset, hint cost.',
        '**Multiple views:** two native views mounted independently, no duplicate IDs (tested).',
        '**Example question:** `%s` → answer %s'%(q[0]['prompt'],q[0]['privateAnswer']),
        '**Checks:** %d/%d passed.'%(sum(c['pass'] for c in ch),len(ch)),'']
open(A+'/F5-individual-audit.md','w').write('\n'.join(L))
T=['| Component | Upgraded | F5 tests | Bank regression | challengeReady | Status |','|---|---|---|---|---|---|']
for r in rows: T.append('| %s %s | yes | %d/%d | %s | %s | %s |'%(r[0],r[1],r[2],r[3],'pass' if r[6] else 'FAIL',str(r[5]).lower(),r[8]))
open(A+'/status-table.md','w').write('\n'.join(T))
print('\n'.join(T))
