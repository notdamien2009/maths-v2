import json,os,shutil,glob,hashlib,zipfile,subprocess
R=os.environ.get('NOVA_F8_WORK','.')+'/root';A=R+'/audit/f8-production-2026-10-17';SRC=os.environ.get('NOVA_F8_WORK','.')+'/src';B=os.path.dirname(os.path.abspath(__file__))
M=os.environ.get('NOVA_F8_WORK','.')+'/merge';O=M+'/NOVA-F0-F3-production';E=M+'/_entries';D=O+'/documentation/f8-production-2026-10-17'
shutil.rmtree(M,ignore_errors=True)
for d in [O+'/F8',O+'/integration/qa',D+'/evidence/per',D+'/screenshots',O+'/test-lessons/f8',O+'/tools/f8',E]:os.makedirs(d,exist_ok=True)
h=lambda p:hashlib.sha256(open(p,'rb').read()).hexdigest()
import sys;sys.path.insert(0,B);from normrows import norm
rows=norm(json.load(open(A+'/F8-adapter-rows.json')));byid={r['id']:r for r in rows}
names={os.path.basename(p)[:5]:os.path.basename(p)[6:-5].replace('-',' ').capitalize() for p in glob.glob(SRC+'/F8-[0-9]*.html')}
rep=json.load(open(B+'/build-report.json'));native={x['id']:x for x in json.load(open(A+'/native-regression.json'))}
rz=json.load(open(A+'/resize-390-1024-1440.json'))
bank={x['id']:x for x in json.load(open(A+'/bank-regression-results.json'))}
bok=lambda x:not x['errors'] and all(x['native']['modes'].values()) and not x['native']['stepErrors'] and x['integration'].get('invalidRejected') and x['integration'].get('changed') and x['guided'] and x['bob']
for p in sorted(glob.glob(R+'/F8/*.html')):shutil.copy(p,O+'/F8/')
for f in ['nova-f8-contracts.js','nova-f8-runtime.js']:shutil.copy(R+'/integration/'+f,O+'/integration/')
json.dump(rows,open(O+'/integration/F8-adapter-rows.json','w'),indent=2)
for f in ['test-f8-production.cjs','test-f8-resize.cjs','test-native-regression.cjs','f8-questions.cjs']:shutil.copy(A+'/'+f,O+'/integration/qa/'+('test-f8-native-regression.cjs' if f=='test-native-regression.cjs' else f))
for f in ['run-f8.sh','adapter-rows.cjs']:shutil.copy(A+'/'+f,O+'/tools/f8/')
for f in ['build8.py','hooks8.py','hook.js','probe8.cjs','nova-f8-contracts.js','nova-f8-runtime.js','merge8.py','normrows.py','build-report.json']:shutil.copy(B+'/'+f,O+'/tools/f8/')
import re as _re
def _san(p):
    s=open(p).read();o=s
    if p.endswith('.py'):
        s=s.replace("os.environ['NOVA_F3_CORE_HUNKS']","os.environ['NOVA_F3_CORE_HUNKS']")
        s=s.replace("os.environ.get('NOVA_F8_WORK','.')+'/","os.environ.get('NOVA_F8_WORK','.')+'/")
    else:
        s=s.replace("require(os.environ.get('NOVA_F8_WORK','.')+'/probe/pw')","require(process.env.NOVA_PLAYWRIGHT||'playwright')")
        s=s.replace("'file:///workspace/codex-f8/root/F8/'","'file://'+(process.env.NOVA_ROOT||process.cwd())+'/F8/'")
        s=s.replace("os.environ.get('NOVA_F8_WORK','.')+'/root/F8'","(process.env.NOVA_ROOT||process.cwd())+'/F8'")
        s=s.replace("os.environ.get('NOVA_F8_WORK','.')+'/src'","(process.env.NOVA_F8_ORIGINALS||'F8-originals')")
    if s!=o:open(p,'w').write(s)
for _p in glob.glob(O+'/tools/f8/*')+glob.glob(O+'/integration/qa/*'):_san(_p)
for p in glob.glob(A+'/fixtures/F8-*.html'):shutil.copy(p,O+'/test-lessons/f8/'+os.path.basename(p)[:5]+'-challenge-test-lesson.html')
for p in glob.glob(A+'/per/*.json'):shutil.copy(p,D+'/evidence/per/semantic-browser-'+os.path.basename(p))
for f in ['native-regression.json','resize-390-1024-1440.json','bank-regression-results.json']:shutil.copy(A+'/'+f,D+'/evidence/')
shutil.copytree(A+'/screenshots',D+'/screenshots',dirs_exist_ok=True)
with zipfile.ZipFile(D+'/F8-originals.zip','w',zipfile.ZIP_DEFLATED) as z:
    for p in sorted(glob.glob(SRC+'/*.html')):z.write(p,'F8/'+os.path.basename(p))
notes=json.load(open(B+'/notes8.json'))
comp=[];status=[]
for id_ in sorted(names):
    r=byid[id_]
    sem=json.load(open(A+'/per/%s.json'%id_))[0];ch=sem['checks'];ok=sum(c['pass'] for c in ch)
    nat=native[id_];nok=sum(c['pass'] for c in nat['checks']);rr=[x for x in rz['rep'] if x['id']==id_];rok=sum(x['ok'] for x in rr)
    st=all(c['pass'] for c in ch if c['name'].startswith(('explore:','challenge:')))
    game=all(c['pass'] for c in ch if c['name'] in ('six correct auto-advance and completion','canonical scoring after retry','badge and confetti','wrong answer holds question and costs life','no round reveals its answer','reset score lives and question','hint cost and retry resets streak'))
    n=sem['resize']['narrow'];f=sem['resize']['fresh'];bk=id_ in bank and bok(bank[id_]);allok=bk and ok==len(ch) and nok==len(nat['checks']) and rok==len(rr) and not sem['errors']
    c={'id':id_,'name':names[id_],'path':r['path'],'engineId':r.get('engineId',id_),'status':'PASS WITH LIMITATIONS' if allok else 'FAIL','productionReady':allok,'challengeReady':game and allok,
       'sourceSha256':r['sha256'],'originalSha256':r['original_sha256'],'nativeSteps':len(r['nativeFieldsByStep']),'draws':r['draws'],'tables':r['tables'],
       'valueInterface':'data.lesson = {state: {preset: native preset key, ...overrides of that preset\'s data fields}, phase: native step index, motion?: {from,to,durationMs}, title?}. Records with concealAnswers draw the engine\'s own Challenge view for the lesson preset.',
       'tests':{'semantic':'%d/%d'%(ok,len(ch)),'nativeRegression':'%d/%d'%(nok,len(nat['checks'])),'resize390_1024_1440':'%d/%d'%(rok,len(rr)),'bankRegression':'pass' if bk else 'FAIL'},
       'phoneLabels390':{'afterResize':{'median':n['median'],'p10':n['p10']},'fresh':{'median':f['median'],'p10':f['p10']}},'statePreservedOnResize':st,'limitations':notes[id_],'buildChanges':rep[id_]}
    comp.append(c);status.append('| %s %s | yes | %d/%d | %d/%d | %s | %s | %.1f / %.1fpx | %s | %s |'%(id_,names[id_],ok,len(ch),nok,len(nat['checks']),'pass' if bk else 'FAIL',str(c['challengeReady']).lower(),n['median'],n['p10'],'yes' if st else 'NO',c['status']))
tsha=h(R+'/00-master/NOVA-MATHS-LESSON-LAYOUT-TEMPLATE.html')
nready=sum(c['challengeReady'] for c in comp)
json.dump({'family':'F8','revision':'2026-10-17','componentCount':len(comp),'upgradedCount':len(comp),'challengeReadyCount':nready,'template':'00-master/NOVA-MATHS-LESSON-LAYOUT-TEMPLATE.html','templateSha256':tsha,'components':comp},open(D+'/F8-capability-manifest.json','w'),indent=1,ensure_ascii=False)
hdr='| Component | Upgraded | F8 tests | Native regression | Bank regression | challengeReady | 390 label median / p10 | State kept on resize | Status |\n|---|---|---|---|---|---|---|---|---|\n'
open(D+'/status-table.md','w').write(hdr+'\n'.join(status)+'\n')
ex=json.loads(subprocess.check_output(['node','-e',"const {payload}=require('%s/f8-questions.cjs');const o={};for(const id of %s)o[id]=[0,1].map(j=>{const {expected,...r}=payload(id,j);return r;});console.log(JSON.stringify(o))"%(A,json.dumps(sorted(names)))]))
json.dump({'note':'Lesson records for each F8 engine (the first two Challenge rounds used in QA). privateAnswer is read by the F0-12 controller and is never drawn.','examples':ex},open(D+'/F8-configuration-examples.json','w'),indent=1,ensure_ascii=False)
ind=['# F8 individual audit (2026-10-17)\n','Each component was rebuilt from the F8 pack file (F8.zip; originals in `F8-originals.zip`). The upgrade adds hooks only and keeps the original artwork, apparatus and mascot placement. The status table is in `status-table.md`.\n']
for c in comp:
    t=c['tests'];pl=c['phoneLabels390']
    ind.append('\n## %s %s: %s\n'%(c['id'],c['name'],c['status']))
    if c['engineId']!=c['id']:ind.append('- This file runs the %s engine (`NovaLessonComponent.id` = %s). The manifest records it under its own file id.\n'%(c['engineId'],c['engineId']))
    ind.append('- Tests: semantic %s · native regression %s · resize 390/1024/1440 %s · bank regression %s.\n'%(t['semantic'],t['nativeRegression'],t['resize390_1024_1440'],t['bankRegression']))
    ind.append('- F0-12 Challenge: six rounds from lesson records. A wrong answer holds the round; auto-advance, scoring 85, badge, reset and hint were all checked. challengeReady: **%s**.\n'%str(c['challengeReady']).lower())
    ind.append('- Phone (390): label median %.1f px, p10 %.1f px after resize (fresh load %.1f / %.1f). Pupil state kept on 1440→390→1440 in Explore and Challenge: %s.\n'%(pl['afterResize']['median'],pl['afterResize']['p10'],pl['fresh']['median'],pl['fresh']['p10'],'yes' if c['statePreservedOnResize'] else 'NO'))
    ind.append('- Build changes: '+'; '.join(x for x in c['buildChanges'] if not x.startswith('core:'))+'; %d F3 core fixes applied.\n'%sum(1 for x in c['buildChanges'] if x.startswith('core:')))
    ind.append('- Limitations / notes: '+c['limitations']+'\n')
open(D+'/F8-individual-audit.md','w').write(''.join(ind))
open(D+'/F8-code-changes.md','w').write('''# F8 code changes
All 18 engine files (F8-01 to F8-18) get the changes below. `tools/f8/build8.py` makes them, using per-engine settings from `hooks8.py`, and stops if an anchor is missing or appears twice. F8-gallery.html is unchanged.
1. **Lesson API:** canonical `integration/nova-v2-lesson-api.js` plus the support scripts (`nova-explore-policy`, `nova-speech-policy`, `nova-f8-runtime`, `nova-f8-contracts`, `nova-f4-runtime`), embedded inline.
2. **F3 core fixes:** the timeline reset, drag-snap, speech and game-scoring hunks, the same set F4 and F6 used (`f3-core-hunks.json` [8:18]).
3. **Lesson hook** (`tools/f8/hook.js`):
   - `data.lesson.state.preset` picks a native preset. The other state keys override that preset's data fields: objects are merged and lists are replaced.
   - The merged preset is registered under a hidden key (`__lessonN`, not enumerable, last 24 kept), so the engine's own code draws it.
   - `phase` is drawn by the engine's own step renderer in Guided mode.
   - Concealed records and phase 0 use the engine's own Challenge draw call with that preset. No new artwork.
   - Active preset and mode are restored afterwards, so the native Guided, Explore and Challenge modes are unchanged.
4. **Contracts** (`integration/nova-f8-contracts.js`):
   - Only native keys are accepted, with the native value types. No functions, no markup, |numbers| ≤ 500, phase 0 to 12.
   - Per-engine maths rules, checked with a small algebra evaluator (`NovaF8Algebra`). For example: every working line is equivalent to the previous one; function-machine output matches the gears; both-sides rows keep the same solution; simultaneous lines intersect on the drawable grid; inequality steps agree; quadratics have two real roots; index-law kinds and ranges; fraction simplification is equal and the excluded value makes the denominator zero; the engine's own `validPreset` for F8-18.
5. **Runtime** (`integration/nova-f8-runtime.js`): this is the F6 runtime with a recursive `merge`.
   - Width relayout: on a 760 px breakpoint crossing, the last draw is replayed. This keeps pupil state and the F0-12 host.
   - Accessibility tidy-up.
   - Phone-label floor: SVG labels under 11 px at narrow widths are enlarged, up to 2.4×.
''')
open(D+'/F8-template-integration.md','w').write('''# F8 template integration
- **Mount:** mount the F8 file as the lesson component (same as F4, F6 and F7). `integration/F8-adapter-rows.json` holds the 18 rows for `integration/component-adapters.json`: replace the F8 rows with them.
- **Engine ids:** F8-02 and F8-04 are built on the F8-03 configuration. In those files `NovaLessonComponent.id` is `F8-03` and the window object is `F8_03`. The adapter rows record this as `engineId`.
- **Lesson record:** `{nativeIndex:0, data:{lesson:{state:{preset:'<native key>', ...overrides}, phase:n, motion?:{from,to,durationMs}, title?}}, prompt, privateAnswer, answerType}`. See `F8-configuration-examples.json`. answerType is numeric for most engines, text for F8-14/15/17, coordinates for F8-10 ("x, y") and ordered for F8-12 (roots in ascending order, "a, b").
- **Challenge:** the F0-12 controller (`NovaLessonChallenge`) renders each round with `concealAnswers:true`, which draws the engine's own Challenge view for the lesson preset.
- **Validation:** `NovaLessonComponent.validate(record)` uses the F8 contracts and rejects impossible maths before anything is drawn.
- **Phone:** all 18 engines redraw on a 760 px breakpoint crossing (iframe width).
''')
tot=lambda k:(sum(int(c['tests'][k].split('/')[0]) for c in comp),sum(int(c['tests'][k].split('/')[1]) for c in comp))
s,n_,z=tot('semantic'),tot('nativeRegression'),tot('resize390_1024_1440');bk=sum(c['tests']['bankRegression']=='pass' for c in comp)
qa='''# F8 test and QA
All tests ran in real Chrome (Playwright 1.63, headless Google Chrome) against the repo root with the canonical template, at 1440, 1024 and 390 px.

| Suite | File | Result |
|---|---|---|
| Semantic production (47 checks per engine) | integration/qa/test-f8-production.cjs | %d/%d |
| Native regression (default presets, original vs upgraded, axe-core criticals) | integration/qa/test-f8-native-regression.cjs | %d/%d |
| Resize 390/1024/1440 (layout after resize = fresh load, learn + challenge) | integration/qa/test-f8-resize.cjs | %d/%d |
| Bank regression (repo component test: modes, steps, data.lesson hook changes the view, invalid data rejected, guided, Bob) | integration/qa/test-components.cjs with NOVA_ONLY_IDS | %d/18 |

The semantic suite checks:
- The contract rejects impossible data. Two distinct question states each draw their own values.
- The answer is concealed in text, aria and data attributes. Every Challenge round draws its own apparatus with no reveal.
- A wrong answer holds the round and costs a life. Six correct answers auto-advance and complete with the canonical score of 85, a badge and confetti. Reset and hint cost work.
- Guided stage 1 hides the answer.
- Style locks: userSpaceOnUse glow, Chalk font, no duplicate IDs.
- Widths 1440, 1024 and 390.
- **Pupil state kept on resize:** native Explore and the live F0-12 Challenge are changed by pupil actions, then resized 1440→390→1440. Panel text, inputs, stage values and buttons must all match, and the F0-12 host must survive.
- **Phone labels:** after 1440→390 and on a fresh 390 load, the SVG label median is ≥ 11 px and the smallest 10%% is ≥ 8 px, with no horizontal overflow.

Before the browser suites, `tools/f8/probe8.cjs` rendered all 108 questions concealed and at phases 0/2/4/6. Each one was checked for validity, answer leaks and expected values. Answers that matched apparatus labels (for example "LINE 3", "Step 3" or a tray value) were redesigned.

Run: `bash tools/f8/run-f8.sh` from the repo root. It needs `integration/node_modules/playwright` and axe-core, which are not shipped.

Evidence:
- `evidence/per/semantic-browser-F8-xx.json`
- `evidence/native-regression.json`
- `evidence/resize-390-1024-1440.json`
- `evidence/bank-regression-results.json`
- `screenshots/`
'''%(s[0],s[1],n_[0],n_[1],z[0],z[1],bk)
open(D+'/F8-test-and-QA.md','w').write(qa)
open(D+'/START-HERE.md','w').write('''# F8 production (2026-10-17)
- All 18 F8 algebra engines (F8-01 to F8-18) have been upgraded with lesson data, contracts, resize-safe relayout, the phone-label floor and the F0-12 Challenge. %d of 18 have challengeReady = true (see status-table.md).
- F8-gallery.html is unchanged.

Read in this order:
1. status-table.md
2. F8-individual-audit.md
3. F8-capability-manifest.json
4. F8-template-integration.md
5. F8-code-changes.md
6. F8-test-and-QA.md

Merge: copy `NOVA-F0-F3-production/` over the repo root, then replace the F8 rows in `integration/component-adapters.json` with `integration/F8-adapter-rows.json`. See `../../../MERGE-NOTES.md`.
'''%nready)
files=sorted(os.path.relpath(p,O) for p in glob.glob(O+'/**/*',recursive=True) if os.path.isfile(p))
sh={'family':'F8','generated':'2026-10-17','entries':{f:h(O+'/'+f) for f in files if f.startswith(('F8/','integration/','test-lessons/'))},'originals':{'F8/'+os.path.basename(p):h(p) for p in sorted(glob.glob(SRC+'/*.html'))}}
for n in ['source-hashes.F8.json','source-hashes.F8-entries.json']:json.dump(sh,open(E+'/'+n,'w'),indent=1)
open(E+'/TEST-RESULTS.F8.md','w').write('# F8 test results (2026-10-17)\n\n'+open(D+'/status-table.md').read()+'\nTotals: semantic %d/%d, native regression %d/%d, resize %d/%d, bank %d/18. Details: documentation/f8-production-2026-10-17/F8-test-and-QA.md\n'%(s[0],s[1],n_[0],n_[1],z[0],z[1],bk))
open(E+'/README.F8.md','w').write('''## F8 (algebra), revision 2026-10-17
- All 18 engines (F8-01 to F8-18) have been upgraded with lesson data (`state.preset` plus overrides), the F0-12 Challenge, contracts, resize-safe relayout and the phone-label floor. challengeReady is true for %d of 18.
- F8-02 and F8-04 run the F8-03 engine (`NovaLessonComponent.id` F8-03).
- Docs: documentation/f8-production-2026-10-17/START-HERE.md · Adapter rows: integration/F8-adapter-rows.json · Test lessons: test-lessons/f8/
'''%nready)
mn='''# F8 merge notes (2026-10-17)
Base: the production root with F0 to F7 merged. Overlay `NOVA-F0-F3-production/` onto the repo root. Every file is either new or a replacement for the F8 file with the same name.

1. Copy `NOVA-F0-F3-production/*` over the root. This touches only F8/, the new integration files (nova-f8-contracts.js, nova-f8-runtime.js, F8-adapter-rows.json), integration/qa/*f8*, documentation/f8-production-2026-10-17/, test-lessons/f8/ and tools/f8/. No existing core or F0 to F7 file changes.
2. In `integration/component-adapters.json`, replace the 18 rows with ids F8-01 to F8-18 with the rows in `integration/F8-adapter-rows.json`. Their sha256 values match the new F8 files.
3. Add the _entries snippets (README.F8.md, TEST-RESULTS.F8.md, source-hashes.F8.json) to the repo-level README, TEST-RESULTS and source-hashes.
4. Not shipped: node_modules, test fixtures beyond test-lessons/f8, and the playwright/axe symlinks. To run QA, install playwright and axe-core in integration/node_modules.

Files (%d):
'''%len(files)+''.join('- %s\n'%f for f in files)
open(M+'/MERGE-NOTES.md','w').write(mn);shutil.copy(M+'/MERGE-NOTES.md',E+'/MERGE-NOTES.F8.md')
print('done',len(files),'challengeReady',nready)
