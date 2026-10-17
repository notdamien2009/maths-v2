"""Build F11 audit docs + merge folder. Usage: python3 build_docs_f11.py  (env NOVA_F11_WORK, NOVA_F11_MERGE; defaults relative to this file)."""
import json,glob,os,hashlib,re,shutil,subprocess,zipfile
H=os.path.dirname(os.path.abspath(__file__))
W=os.environ.get('NOVA_F11_WORK',os.path.join(H,'..','work'));A=os.path.join(W,'audit','f11-production-2026-10-17')
MR=os.environ.get('NOVA_F11_MERGE',os.path.join(H,'..','merge'));M=os.path.join(MR,'NOVA-F0-F3-production');D=os.path.join(M,'documentation','f11-production-2026-10-17')
sha=lambda p:hashlib.sha256(open(p,'rb').read()).hexdigest()
reg={r['id']:r for r in json.load(open(os.path.join(W,'integration','component-adapters.json'))) if r['id'].startswith('F11')}
gen={r['id']:r for r in json.load(open(os.path.join(W,'qa-after','results-0.json')))}
names={}
for f in sorted(glob.glob(os.path.join(W,'F11','*.html'))):
    b=os.path.basename(f);m=re.search(r'data-title="([^"]*)"',open(f,encoding='utf8').read());names[b[:6]]=(b,(m.group(1) if m else b).replace('&amp;','&'))
pay=open(os.path.join(H,'f11payload.js')).read()
qs=json.loads(subprocess.check_output(['node','-e',pay+';const o={};for(const id of %s)o[id]=[0,1,2,3,4,5].map(j=>payload(id,j));console.log(JSON.stringify(o))'%json.dumps(list(names))]))
GROUPS=[('F0 foundation: neon filters userSpaceOnUse, no glyph/star leaks',r'^F0 '),('F1 notation: no inline slash fractions in drawings, no TBD',r'^F1 '),('F2 chalk typography and no dark frames',r'^F2 '),('F3 approved mascot pack, containment 390/1024/1440, no undefined/NaN',r'^F3 |^no .undefined'),
 ('Phone layout at 390 inside template (resize redraw + label size)',r'^390 |^resize'),
 ('Pupil state kept across a 1440→390 layout redraw in native Explore and Challenge',r'^(explore|challenge): '),
 ('Template integration: F0-12 Challenge, concealment, Guided, Bob, multi-view, Explore',r'question|wrong answer|six correct|canonical scoring|badge|reset score|retry|guided|Bob|views|duplicate|Explore|lesson page width|apparatus frame width|unanswered|no runtime errors')]
rows=[];man=[];L=['# F11 individual audit — angles, protractor, polygons, constructions, loci, bearings (2026-10-17)','','Each component was tested separately against the F0, F1, F2 and F3 standards, the phone-layout requirement and the approved template (F0-12). Raw evidence: `evidence/semantic-browser-F11-XX.json`, `evidence/per/F11-XX.log`, screenshots.','']
for id,(b,title) in names.items():
    p=os.path.join(A,'semantic-browser-%s.json'%id);R=json.load(open(p))[0] if os.path.exists(p) else {'checks':[],'error':'not run','errors':[]}
    ch=R['checks'];bad=[c for c in ch if not c['pass']];err=R.get('error') or (R['errors'][0] if R['errors'] else '')
    chall=[c for c in ch if re.search(r'question|wrong answer|six correct|canonical scoring|badge|reset score|retry|unanswered',c['name'])]
    cready=len(chall)>=15 and all(c['pass'] for c in chall) and not err
    g=gen.get(id,{});gi=g.get('integration',{});genok=bool(not g.get('error') and not g.get('errors') and gi.get('game',{}).get('correctAdvanced') and gi.get('game',{}).get('wrongHeld'))
    comp=[]
    for gname,rx in GROUPS:
        sel=[c for c in ch if re.search(rx,c['name'])];comp.append({'standard':gname,'pass':bool(sel) and all(c['pass'] for c in sel) and not err,'checks':len(sel),'failed':[c['name'] for c in sel if not c['pass']]})
    allpass=not bad and not err and genok
    onlyLayout=not allpass and genok and not err and all(re.search(r'^390 |^resize',c['name']) for c in bad)
    st='PASS WITH LIMITATIONS' if allpass else ('FAIL — phone readability at 390' if onlyLayout else 'FAIL')
    rz=R.get('resize',{})
    sk=[c for c in ch if re.search(r'^(explore|challenge): ',c['name'])];skok=bool(sk) and all(c['pass'] for c in sk)
    rows.append((id,title,sum(c['pass'] for c in ch),len(ch),genok,cready,st,rz,skok))
    man.append({'id':id,'name':title,'path':'F11/'+b,'status':st,'productionReady':allpass,'challengeReady':cready,'sourceSha256':sha(os.path.join(W,'F11',b)),'originalSha256':sha(os.path.join(W,'originals',b)),
      'nativeSteps':gi.get('descriptor',{}).get('stepCount'),'nativeFieldsByStep':reg[id].get('nativeFieldsByStep'),'draws':reg[id].get('draws'),'tables':reg[id].get('tables'),'exploreFields':reg[id].get('exploreFields'),
      'valueInterface':'scene:{function,arguments} with the native value-driven draw function and its option object (challenge/hide flags keep the answer hidden); validated by NovaF11Contracts; see F11-configuration-examples.json','configurationKeys':list(gi.get('descriptor',{}).get('config',{}).keys()),'presets':gi.get('descriptor',{}).get('config',{}).get('presets'),
      'modes':['watch','guided','explore','challenge'],'templateModes':['Learn-Watch','Learn-Explore','Learn-Challenge (F0-12)','Examples-Guided','Bob Board'],'events':['value','correct','step','hintUsed','mode','value:layoutRedraw','value:statePreservedRedraw'],
      'statePreservedOnResize':skok,'layout390':{'dedicatedNarrowLayout':rz.get('dedicatedNarrowLayout'),'fresh':rz.get('fresh'),'afterResize':rz.get('narrow')},
      'challengeQuestionExample':{k:v for k,v in qs[id][0].items() if k!='expected'},'compliance':comp,'tests':{'f11Production':{'passed':sum(c['pass'] for c in ch),'total':len(ch),'error':err or None},'bankRegression':genok}})
    L+=['## %s — %s'%(id,title),'','**File:** `F11/%s`  '%b,'**Final component status:** %s  '%st,'**challengeReady:** %s'%str(cready).lower(),'','| Standard | Result | Checks | Evidence |','|---|---|---|---|']
    for c in comp:L.append('| %s | %s | %d | %s |'%(c['standard'],'PASS' if c['pass'] else 'FAIL',c['checks'],'all passed' if c['pass'] else (', '.join(c['failed'])[:300] or err or 'not run')))
    L.append('| Bank regression (test-components.cjs) | %s | — | evidence/bank-regression-results.json |'%('PASS' if genok else 'FAIL'))
    f=rz.get('fresh') or {};L+=['','**Phone layout at 390 (iframe %spx):** dedicated narrow layout: %s; main SVG viewBox %s drawn at %spx; median label %.1fpx, 10th percentile %.1fpx.'%(f.get('inner'),rz.get('dedicatedNarrowLayout'),f.get('viewBoxWidth'),f.get('svgWidth'),f.get('median') or 0,f.get('p10') or 0),
      '**Values:** lesson values go through `scene` records using the native draw `%s` with its option object.'%', '.join(reg[id].get('draws',{}).keys()),
      '**Example question:** `%s` → %s'%(qs[id][0]['prompt'],qs[id][0]['privateAnswer']),'**Checks:** %d/%d passed.'%(sum(c['pass'] for c in ch),len(ch)),'']
os.makedirs(D,exist_ok=True)
json.dump({'family':'F11','revision':'2026-10-17','componentCount':len(man),'template':'00-master/NOVA-MATHS-LESSON-LAYOUT-TEMPLATE.html','templateSha256':sha(os.path.join(W,'00-master','NOVA-MATHS-LESSON-LAYOUT-TEMPLATE.html')),'components':man},open(os.path.join(D,'F11-capability-manifest.json'),'w'),indent=1)
json.dump({id:[{k:v for k,v in x.items() if k!='expected'} for x in q] for id,q in qs.items()},open(os.path.join(D,'F11-configuration-examples.json'),'w'),indent=1)
open(os.path.join(D,'F11-individual-audit.md'),'w').write('\n'.join(L))
T=['| Component | Upgraded | F11 tests | Bank regression | challengeReady | 390 label median / p10 | State kept on resize | Status |','|---|---|---|---|---|---|---|---|']
for r in rows:T.append('| %s %s | yes | %d/%d | %s | %s | %.1f / %.1fpx | %s | %s |'%(r[0],r[1],r[2],r[3],'pass' if r[4] else 'FAIL',str(r[5]).lower(),(r[7].get('fresh') or {}).get('median') or 0,(r[7].get('fresh') or {}).get('p10') or 0,'yes' if r[8] else 'NO',r[6]))
open(os.path.join(D,'status-table.md'),'w').write('\n'.join(T))
# merge files
for d in ['F11','integration/qa','test-lessons/f11','tools/f11']:os.makedirs(os.path.join(M,d),exist_ok=True)
for f in glob.glob(os.path.join(W,'F11','*.html')):shutil.copy(f,os.path.join(M,'F11'))
for n in ['nova-f11-contracts.js','nova-f11-runtime.js']:shutil.copy(os.path.join(W,'integration',n),os.path.join(M,'integration'))
shutil.copy(os.path.join(W,'integration','qa','test-f11-production.cjs'),os.path.join(M,'integration','qa'))
rowsA=[]
for id,r in reg.items():
    r=dict(r);b=os.path.basename(r['path']);r['previous_sha256']=r.get('sha256');r['sha256']=sha(os.path.join(W,'F11',b));r['f11Production']='2026-10-17';rowsA.append(r)
json.dump(rowsA,open(os.path.join(M,'integration','F11-adapter-rows.json'),'w'),indent=1)
for f in glob.glob(os.path.join(A,'fixtures','*.html')):shutil.copy(f,os.path.join(M,'test-lessons','f11',os.path.basename(f).replace('.html','-challenge-test-lesson.html')))
for t in ['patch_f11.py','build_docs_f11.py','f11payload.js','run-f11.sh']:shutil.copy(os.path.join(H,t),os.path.join(M,'tools','f11'))
for sd in ['edits']:shutil.copytree(os.path.join(H,sd),os.path.join(M,'tools','f11',sd),dirs_exist_ok=True,ignore=shutil.ignore_patterns('__pycache__'))
ev=os.path.join(D,'evidence');os.makedirs(ev,exist_ok=True)
for f in glob.glob(os.path.join(A,'semantic-browser-*.json')):shutil.copy(f,ev)
shutil.copy(os.path.join(W,'qa-after','results-0.json'),os.path.join(ev,'bank-regression-results.json'))
shutil.copytree(os.path.join(A,'per'),os.path.join(ev,'per'),dirs_exist_ok=True)
from PIL import Image
def jpg(src,dst,maxh=2600):
    im=Image.open(src).convert('RGB');im=im.crop((0,0,im.width,min(im.height,maxh)));im.save(dst,'JPEG',quality=72,optimize=True)
for sub,src in [('native','screenshots/native/*.png'),('challenge','screenshots/*.png'),('resize-390','screenshots/resize/*.png')]:
    os.makedirs(os.path.join(D,'screenshots',sub),exist_ok=True)
    for f in glob.glob(os.path.join(A,src)):jpg(f,os.path.join(D,'screenshots',sub,os.path.basename(f)[:-4]+'.jpg'))
with zipfile.ZipFile(os.path.join(D,'F11-originals.zip'),'w',zipfile.ZIP_DEFLATED) as z:
    for f in sorted(glob.glob(os.path.join(W,'originals','*.html'))):z.write(f,'F11-originals/'+os.path.basename(f))
E=os.path.join(MR,'_entries');os.makedirs(E,exist_ok=True)
hs={}
for f in sorted(glob.glob(os.path.join(M,'F11','*.html'))+glob.glob(os.path.join(M,'integration','nova-f11-*.js'))+[os.path.join(M,'integration','qa','test-f11-production.cjs'),os.path.join(M,'integration','F11-adapter-rows.json')]):hs[os.path.relpath(f,M).replace('\\','/')]=sha(f)
json.dump(hs,open(os.path.join(E,'source-hashes.F11.json'),'w'),indent=1)
open(os.path.join(E,'TEST-RESULTS.F11.md'),'w').write('## F11 test results (2026-10-17)\n\n'+'\n'.join(T)+'\n\nF11 production test per component (native 4 modes × 390/1024/1440, template F0-12 Challenge with 6 question states, concealment, Guided, Bob, multi-view, 390 resize redraw and label size, pupil state kept across a 1440→390 redraw in native Explore and Challenge) plus bank regression test-components.cjs. Details: documentation/f11-production-2026-10-17/F11-test-and-QA.md.\n')
print('\n'.join(T))
