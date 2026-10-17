import json,os,shutil,glob,hashlib,zipfile,subprocess,re,sys
B=os.path.dirname(os.path.abspath(__file__));W=os.environ.get('NOVA_F10_WORK',os.path.dirname(B))
R=W+'/root';A=R+'/audit/f10-production-2026-10-17';SRC=W+'/src'
M=W+'/merge';O=M+'/NOVA-F0-F3-production';E=M+'/_entries';D=O+'/documentation/f10-production-2026-10-17'
shutil.rmtree(M,ignore_errors=True)
for d in [O+'/F10',O+'/integration/qa',D+'/evidence/per',D+'/screenshots',O+'/test-lessons/f10',O+'/tools/f10',E]:os.makedirs(d,exist_ok=True)
h=lambda p:hashlib.sha256(open(p,'rb').read()).hexdigest()
sys.path.insert(0,B);from normrows import norm
rows=norm(json.load(open(A+'/F10-adapter-rows.json')));byid={r['id']:r for r in rows}
def nice(f):
    b=os.path.basename(f)[:-5];b=re.sub(r'^NOVA-','',b);b=re.sub(r'^F10-\d\d-','',b);b=re.sub(r'-(PREMIUM-REVIEW|Premium-Preview)$','',b);return b.replace('-',' ').replace('y mx plus c','y = mx + c')
names={re.search(r'F10-\d\d',os.path.basename(p)).group(0):nice(p) for p in glob.glob(SRC+'/*F10-[0-9]*.html') if not re.search('gallery',p,re.I)}
rep=json.load(open(B+'/build-report.json'));native={x['id']:x for x in json.load(open(A+'/native-regression.json'))}
rz=json.load(open(A+'/resize-390-1024-1440.json'))
bank={x['id']:x for x in json.load(open(A+'/bank-regression-results.json'))}
g390={x['id']:x for x in json.load(open(A+'/f10-game-390.json'))}
bok=lambda x:not x['errors'] and all(x['native']['modes'].values()) and not x['native']['stepErrors'] and x['integration'].get('invalidRejected') and x['integration'].get('changed') and x['guided'] and x['bob']
for p in sorted(glob.glob(R+'/F10/*.html')):shutil.copy(p,O+'/F10/')
for f in ['nova-f10-contracts.js','nova-f10-runtime.js']:shutil.copy(R+'/integration/'+f,O+'/integration/')
json.dump(rows,open(O+'/integration/F10-adapter-rows.json','w'),indent=2,ensure_ascii=False)
for f in ['test-f10-production.cjs','test-f10-resize.cjs','test-native-regression.cjs','f10-questions.cjs','test-f6-08-host.cjs','test-f10-game-390.cjs']:shutil.copy(A+'/'+f,O+'/integration/qa/'+('test-f10-native-regression.cjs' if f=='test-native-regression.cjs' else f))
for f in ['run-f10.sh','chain.sh','adapter-rows.cjs']:shutil.copy(A+'/'+f,O+'/tools/f10/')
for f in ['build10.py','hooks10.py','hook.js','probe10.cjs','nova-f10-contracts.js','rules10.js','nova-f10-runtime.js','merge10.py','normrows.py','notes10.json','build-report.json']:shutil.copy(B+'/'+f,O+'/tools/f10/')
def _san(p):
    s=open(p).read();o=s
    s=s.replace('${NOVA_F10_WORK}/','${NOVA_F10_WORK}/').replace('${NOVA_F8_WORK}/','${NOVA_F8_WORK}/').replace('${NOVA_F6_WORK}/','${NOVA_F6_WORK}/')
    if s!=o:open(p,'w').write(s)
for _p in glob.glob(O+'/tools/f10/*')+glob.glob(O+'/integration/qa/*'):_san(_p)
# the test suite references the native-regression file by its shipped name
for p in glob.glob(O+'/tools/f10/*.sh'):
    s=open(p).read().replace('node test-native-regression.cjs','node test-f10-native-regression.cjs');open(p,'w').write(s)
for p in glob.glob(A+'/fixtures/F10-*.html'):shutil.copy(p,O+'/test-lessons/f10/'+os.path.basename(p)[:6]+'-challenge-test-lesson.html')
for p in glob.glob(A+'/per/*.json'):shutil.copy(p,D+'/evidence/per/semantic-browser-'+os.path.basename(p))
for f in ['native-regression.json','resize-390-1024-1440.json','bank-regression-results.json','f6-08-host.json','f10-game-390.json']:shutil.copy(A+'/'+f,D+'/evidence/')
shutil.copytree(A+'/screenshots',D+'/screenshots',dirs_exist_ok=True)
with zipfile.ZipFile(D+'/F10-originals.zip','w',zipfile.ZIP_DEFLATED) as z:
    for p in sorted(glob.glob(SRC+'/*.html')):z.write(p,'F10/'+os.path.basename(p))
notes=json.load(open(B+'/notes10.json'))
comp=[];status=[]
for id_ in sorted(names):
    r=byid[id_]
    sem=json.load(open(A+'/per/%s.json'%id_))[0];ch=sem['checks'];ok=sum(c['pass'] for c in ch)
    nat=native[id_];nok=sum(c['pass'] for c in nat['checks']);rr=[x for x in rz['rep'] if x['id']==id_];rok=sum(x['ok'] for x in rr)
    st=all(c['pass'] for c in ch if c['name'].startswith(('explore:','challenge:')))
    game=all(c['pass'] for c in ch if c['name'] in ('six correct auto-advance and completion','canonical scoring after retry','badge and confetti','wrong answer holds question and costs life','no round reveals its answer','reset score lives and question','hint cost and retry resets streak'))
    n=sem['resize']['narrow'];f=sem['resize']['fresh'];bk=id_ in bank and bok(bank[id_]);allok=bk and ok==len(ch) and nok==len(nat['checks']) and rok==len(rr) and not sem['errors'] and all(c['pass'] for c in g390[id_]['checks'])
    c={'id':id_,'name':names[id_],'path':r['path'],'engineId':r.get('engineId',id_),'status':'PASS WITH LIMITATIONS' if allok else 'FAIL','productionReady':allok,'challengeReady':game and allok,
       'sourceSha256':r['sha256'],'originalSha256':r['original_sha256'],'nativeSteps':len(r['nativeFieldsByStep']),'draws':r['draws'],'tables':r['tables'],
       'valueInterface':'data.lesson = {state: {preset?: native preset key, ...overrides of that preset\'s fields or of the engine model fields}, phase: 0-12, motion?: {from,to,durationMs}, title?}. Records with concealAnswers draw the engine\'s own Challenge view for the lesson state.',
       'tests':{'semantic':'%d/%d'%(ok,len(ch)),'nativeRegression':'%d/%d'%(nok,len(nat['checks'])),'resize390_1024_1440':'%d/%d'%(rok,len(rr)),'bankRegression':'pass' if bk else 'FAIL','challengeGame390':'%d/%d'%(sum(c['pass'] for c in g390[id_]['checks']),len(g390[id_]['checks']))},
       'phoneLabels390':{'afterResize':{'median':n['median'],'p10':n['p10']},'fresh':{'median':f['median'],'p10':f['p10']}},'statePreservedOnResize':st,'limitations':notes[id_],'buildChanges':rep[id_]}
    comp.append(c);status.append('| %s %s | yes | %d/%d | %d/%d | %s | %s | %.1f / %.1fpx | %s | %s |'%(id_,names[id_],ok,len(ch),nok,len(nat['checks']),'pass' if bk else 'FAIL',str(c['challengeReady']).lower(),n['median'],n['p10'],'yes' if st else 'NO',c['status']))
# F6-08 preset row patch (hosted by F10-05)
f105=next(c for c in comp if c['id']=='F10-05')
F6ROWS=os.environ.get('NOVA_F6_ROWS',os.environ.get('NOVA_F6_WORK',os.path.join(os.path.dirname(W),'codex-f6'))+'/merge/NOVA-F0-F3-production/integration/F6-adapter-rows.json')
src_rows=json.load(open(F6ROWS)) if os.path.exists(F6ROWS) else json.load(open(R+'/integration/component-adapters.json'))
f608=dict(next(x for x in src_rows if x['id']=='F6-08'))
hostres=json.load(open(A+'/f6-08-host.json'));hostok=all(c['pass'] for c in hostres['checks']) and not hostres['errors']
hostN='%d/%d'%(sum(c['pass'] for c in hostres['checks']),len(hostres['checks']))
f608=norm([f608])[0]
f608.update({'kind':'preset','presetOnly':True,'hostEngine':'F10-05','host':f105['path'],'hostSha256':f105['sourceSha256'],
 'lessonMountable':True,'lessonMount':{'component':f105['path'],'record':{'nativeIndex':0,'data':{'lesson':{'state':{'preset':'Y7-060'},'phase':5}}},'presets':['Y7-060','Y8-035','Y8-036','Y9-020']},
 'challengeReady':bool(f105['challengeReady'] and hostok),'status':('hosted by F10-05; F10-05 Challenge rounds 1-4 are the four F6-08 presets and pass the F10 suite; F6-08 host test '+hostN if (f105['challengeReady'] and hostok) else 'hosted by F10-05; F10-05 suite or F6-08 host test ('+hostN+') did not all pass, so challengeReady is false'),
 'verifiedBinding':{'component':f105['path'],'nativeIndex':0,'data':{'lesson':{'state':{'preset':'Y7-060'},'phase':5}},'note':'replaces the old preview binding (its config showed slope 3 for Y7-060; the F6-08 file and F10-05 both use slope/m = 2)'},
 'hostTest':{'file':'integration/qa/test-f6-08-host.cjs','result':hostN,'evidence':'documentation/f10-production-2026-10-17/evidence/f6-08-host.json'},
 'f10Production':{'date':'2026-10-17','evidence':['documentation/f10-production-2026-10-17/evidence/per/semantic-browser-F10-05.json','documentation/f10-production-2026-10-17/evidence/f6-08-host.json']}})
f608.pop('presetOf',None)
json.dump(f608,open(O+'/integration/F6-08-adapter-row.F10.json','w'),indent=2,ensure_ascii=False)
tsha=h(R+'/00-master/NOVA-MATHS-LESSON-LAYOUT-TEMPLATE.html')
nready=sum(c['challengeReady'] for c in comp);N=len(comp)
json.dump({'family':'F10','revision':'2026-10-17','componentCount':N,'upgradedCount':N,'challengeReadyCount':nready,'template':'00-master/NOVA-MATHS-LESSON-LAYOUT-TEMPLATE.html','templateSha256':tsha,'components':comp,'presetRows':[f608]},open(D+'/F10-capability-manifest.json','w'),indent=1,ensure_ascii=False)
hdr='| Component | Upgraded | F10 tests | Native regression | Bank regression | challengeReady | 390 label median / p10 | State kept on resize | Status |\n|---|---|---|---|---|---|---|---|---|\n'
status.append('| F6-08 Direct proportion (preset row) | hosted by F10-05 | see F10-05 | n/a | n/a | %s | see F10-05 | see F10-05 | %s |'%(str(f608['challengeReady']).lower(),'PASS (via host)' if f608['challengeReady'] else 'FAIL (via host)'))
open(D+'/status-table.md','w').write(hdr+'\n'.join(status)+'\n')
ex=json.loads(subprocess.check_output(['node','-e',"const {payload}=require('%s/f10-questions.cjs');const o={};for(const id of %s)o[id]=[0,1].map(j=>{const {expected,...r}=payload(id,j);return r;});console.log(JSON.stringify(o))"%(A,json.dumps(sorted(names)))]))
json.dump({'note':'Lesson records for each F10 engine (the first two Challenge rounds used in QA). privateAnswer is read by the F0-12 controller and is never drawn.','examples':ex},open(D+'/F10-configuration-examples.json','w'),indent=1,ensure_ascii=False)
ind=['# F10 individual audit (2026-10-17)\n','Each component was rebuilt from the F10 pack file (F10.zip; originals in `F10-originals.zip`). The upgrade adds hooks and keeps the original artwork, apparatus and mascot placement. Where a native bug or an answer give-away was found, a minimal anchored engine patch is listed under build changes. The status table is in `status-table.md`.\n']
for c in comp:
    t=c['tests'];pl=c['phoneLabels390']
    ind.append('\n## %s %s: %s\n'%(c['id'],c['name'],c['status']))
    ind.append('- Tests: semantic %s · native regression %s · resize 390/1024/1440 %s · bank regression %s.\n'%(t['semantic'],t['nativeRegression'],t['resize390_1024_1440'],t['bankRegression']))
    ind.append('- F0-12 Challenge: six rounds from lesson records. A wrong answer holds the round; auto-advance, scoring 85, badge, reset and hint were all checked. challengeReady: **%s**.\n'%str(c['challengeReady']).lower())
    ind.append('- Phone (390): label median %.1f px, p10 %.1f px after resize (fresh load %.1f / %.1f). Pupil state kept on 1440→390→1440 in Explore and Challenge: %s.\n'%(pl['afterResize']['median'],pl['afterResize']['p10'],pl['fresh']['median'],pl['fresh']['p10'],'yes' if c['statePreservedOnResize'] else 'NO'))
    ind.append('- Build changes: '+'; '.join(x for x in c['buildChanges'] if not x.startswith('core:'))+'; %d F3 core fixes applied.\n'%sum(1 for x in c['buildChanges'] if x.startswith('core:')))
    ind.append('- Limitations / notes: '+c['limitations']+'\n')
ind.append('\n## F6-08 Direct proportion (preset row): hosted by F10-05\n- F6-08 is a configuration-only preset. Its four presets (Y7-060, Y8-035, Y8-036, Y9-020) are native presets of F10-05 and are mounted with `data.lesson.state.preset`.\n- F10-05 Challenge rounds 1-4 are exactly these presets (answers 18, 24, 15, 9; the concealed view shows y = kx). challengeReady: **%s** (follows F10-05).\n- Dedicated host test `integration/qa/test-f6-08-host.cjs`: %s (host handshake, preset parity with the F6-08 file, each preset mounts through the template as y = kx through the origin, concealed view shows y = kx, c ≠ 0 rejected).\n- Row patch: `integration/F6-08-adapter-row.F10.json`.\n'%(str(f608['challengeReady']).lower(),hostN))
open(D+'/F10-individual-audit.md','w').write(''.join(ind))
open(D+'/F10-code-changes.md','w').write('''# F10 code changes
All 20 engine files (F10-01 to F10-20) get the changes below. `tools/f10/build10.py` makes them, using per-engine settings from `hooks10.py`, and stops if an anchor is missing or appears twice.
1. **Lesson API:** canonical `integration/nova-v2-lesson-api.js` plus the support scripts (`nova-explore-policy`, `nova-speech-policy`, `nova-f10-runtime`, `nova-f10-contracts`, `nova-f4-runtime`), embedded inline.
2. **F3 core fixes:** the timeline reset, drag-snap, speech and game-scoring hunks, the same set F4, F6 and F8 used (`f3-core-hunks.json` [8:18]).
3. **Lesson hook** (`tools/f10/hook.js`):
   - `data.lesson.state.preset` picks a native preset. Other state keys override either the engine's model fields or that preset's fields (a merged preset is registered under a hidden, non-enumerable `__lessonN` key, last 24 kept).
   - The engine model is snapshotted before the lesson draw and restored afterwards, so native Guided, Explore and Challenge are unchanged.
   - Concealed records (and phases before the reveal) use the engine's own Challenge draw call. Other phases use the engine's own scene/step renderer with short generic captions. No new artwork.
   - The lesson apply/restore pair is recorded with the draw, so a width relayout replays the lesson values.
4. **Contracts** (`integration/nova-f10-contracts.js`): only native keys with native value types; no functions or markup; |numbers| ≤ 500; phase 0 to 12. Per-engine rules (`rules10.js`) follow each engine's own drag/slider/drawing limits, for example whole-number grid points, distinct ids, increasing x for graphs, a non-zero quadratic coefficient, radius within the grid, a < b for the trapezium interval, and c = 0 for direct-proportion presets in F10-05.
5. **Runtime** (`integration/nova-f10-runtime.js`): the F8 runtime with the lesson context replay. Width relayout on breakpoint crossings (760 px; F10-14 also 350 px) replays the last draw, keeping pupil state and the F0-12 host. Accessibility tidy-up and the phone-label floor (SVG labels under 11 px at narrow widths are enlarged, up to 2.4×).
6. **Engine patches (anchored, minimal):**
   - F10-05: the task-0 caption prints the lesson's own gradient (native always printed y = −x + c).
   - F10-15: inequality text uses the sign of the constant (native showed y ≤ −x − 2 for y ≤ −x + 2); the test-point verdict is hidden in an unmarked Challenge.
   - F10-17, F10-18: motion trails receive path data (native passed an SVG group, logging an SVG error on every draw).
   - F10-19: the asymptote note is hidden in an unmarked Challenge.
   - F10-20: the over/under note is hidden in an unmarked Challenge; the scene is recorded for relayout (it had no draw hook).
''')
open(D+'/F10-template-integration.md','w').write('''# F10 template integration
- **Mount:** mount the F10 file as the lesson component (same as F4 to F8). `integration/F10-adapter-rows.json` holds the 20 rows for `integration/component-adapters.json`: replace the F10 rows with them. Replace the F6-08 row with `integration/F6-08-adapter-row.F10.json`.
- **Lesson record:** `{nativeIndex:0, data:{lesson:{state:{preset?:'<native key>', ...overrides}, phase:n, motion?:{from,to,durationMs}, title?}}, prompt, privateAnswer, answerType}`. See `F10-configuration-examples.json`. answerType: numeric for most rounds; coordinates ("x, y") for F10-02, F10-08 and some F10-14 rounds; ordered ("a, b") for some F10-18/F10-19 rounds; text for yes/no (F10-15), undefined (F10-19) and over/under (F10-20); choice with choices ["A","B","C"] for F10-17.
- **F6-08:** mount F10-05 with `state.preset` one of Y7-060, Y8-035, Y8-036, Y9-020.
- **Challenge:** the F0-12 controller renders each round with `concealAnswers:true`, which draws the engine's own Challenge view for the lesson state.
- **Validation:** `NovaLessonComponent.validate(record)` uses the F10 contracts and rejects impossible states before anything is drawn.
''')
tot=lambda k:(sum(int(c['tests'][k].split('/')[0]) for c in comp),sum(int(c['tests'][k].split('/')[1]) for c in comp))
s,n_,z=tot('semantic'),tot('nativeRegression'),tot('resize390_1024_1440');bk=sum(c['tests']['bankRegression']=='pass' for c in comp)
nsem=len(json.load(open(A+'/per/F10-01.json'))[0]['checks'])
qa='''# F10 test and QA
All tests ran in real Chrome (Playwright, headless Google Chrome) against the repo root with the canonical template, at 1440, 1024 and 390 px.

| Suite | File | Result |
|---|---|---|
| Semantic production (%d checks per engine) | integration/qa/test-f10-production.cjs | %d/%d |
| Native regression (default presets, original vs upgraded, axe-core criticals) | integration/qa/test-f10-native-regression.cjs | %d/%d |
| Resize 390/1024/1440 (layout after resize = fresh load, learn + challenge) | integration/qa/test-f10-resize.cjs | %d/%d |
| Bank regression (repo component test: modes, steps, data.lesson hook changes the view, invalid data rejected, guided, Bob) | integration/qa/test-components.cjs with NOVA_ONLY_IDS | %d/%d |

The semantic suite is the F8 suite plus one check: each engine's own rule must reject an impossible engine-specific state (generic limits alone are not enough). It also checks:
- Two distinct question states each draw their given values; the answer is concealed in text, aria and data attributes (for F10-17 choice rounds: no matched, focused or selected graph and no proof text).
- Every Challenge round draws its own apparatus with no reveal. A wrong answer holds the round and costs a life. Six correct answers auto-advance and complete with score 85, a badge and confetti. Reset and hint cost work.
- Guided stage 1 hides the answer; Guided and Bob show at least 3 distinct stages.
- Style locks: userSpaceOnUse glow, Chalk font, no duplicate IDs. Widths 1440, 1024 and 390.
- Pupil state kept on resize (Explore and live F0-12 Challenge, 1440→390→1440).
- Phone labels: after 1440→390 and on a fresh 390 load, SVG label median ≥ 11 px and 10th percentile ≥ 8 px, no horizontal overflow.

Before the browser suites, `tools/f10/probe10.cjs` rendered all 120 questions concealed and at phases 0/2/4/6 and checked validity, answer leaks (including unicode-minus forms), expected givens, distinct rounds and bad-state rejection. Answers equal to axis labels were redesigned (decimals, off-axis values, "x, y" or "a, b" answers).

Run: `bash tools/f10/chain.sh` (place it in `audit/f10-production-2026-10-17/` with the QA files) or `bash tools/f10/run-f10.sh`. It needs `integration/node_modules/playwright` and axe-core, which are not shipped.
'''%(nsem,s[0],s[1],n_[0],n_[1],z[0],z[1],bk,N)
g390ok=sum(all(c['pass'] for c in x['checks']) for x in g390.values())
qa+='\n## Extra checks\n- Challenge game at 390 px (`integration/qa/test-f10-game-390.cjs`, evidence `evidence/f10-game-390.json`): %d/%d engines pass. After 1440→390 the game repaints in the narrow layout (viewBoxes and widths match a fresh 390 load), with no hidden copy of the drawing in the game or the page.\n- F6-08 hosted by F10-05 (`integration/qa/test-f6-08-host.cjs`, evidence `evidence/f6-08-host.json`): %s.\n'%(g390ok,len(g390),hostN)
open(D+'/F10-test-and-QA.md','w').write(qa)
open(D+'/START-HERE.md','w').write('''# F10 production (2026-10-17)
- All 20 F10 graphs and coordinates engines (F10-01 to F10-20) have been upgraded with lesson data, contracts, resize-safe relayout, the phone-label floor and the F0-12 Challenge. %d of 20 have challengeReady = true (see status-table.md).
- F6-08 (direct proportion, preset-only) is hosted by F10-05; its row patch is `integration/F6-08-adapter-row.F10.json`.

Read in this order:
1. status-table.md
2. F10-individual-audit.md
3. F10-capability-manifest.json
4. F10-template-integration.md
5. F10-code-changes.md
6. F10-test-and-QA.md
'''%nready)
files=sorted(os.path.relpath(p,O) for p in glob.glob(O+'/**/*',recursive=True) if os.path.isfile(p))
sh={'family':'F10','generated':'2026-10-17','entries':{f:h(O+'/'+f) for f in files if f.startswith(('F10/','integration/','test-lessons/'))},'originals':{'F10/'+os.path.basename(p):h(p) for p in sorted(glob.glob(SRC+'/*.html'))}}
for n in ['source-hashes.F10.json','source-hashes.F10-entries.json']:json.dump(sh,open(E+'/'+n,'w'),indent=1)
open(E+'/TEST-RESULTS.F10.md','w').write('# F10 test results (2026-10-17)\n\n'+open(D+'/status-table.md').read()+'\nChallenge game at 390 px (no stale desktop drawing, no hidden copy): %d/%d. F6-08 host test: %s.\n'%(g390ok,len(g390),hostN)+'\nTotals: semantic %d/%d, native regression %d/%d, resize %d/%d, bank %d/%d. Details: documentation/f10-production-2026-10-17/F10-test-and-QA.md\n'%(s[0],s[1],n_[0],n_[1],z[0],z[1],bk,N))
open(E+'/README.F10.md','w').write('''## F10 (graphs and coordinates), revision 2026-10-17
- All 20 engines (F10-01 to F10-20) have been upgraded with lesson data (`state.preset` plus overrides), the F0-12 Challenge, contracts, resize-safe relayout and the phone-label floor. challengeReady is true for %d of 20.
- F6-08 is hosted by F10-05 (row patch `integration/F6-08-adapter-row.F10.json`, challengeReady %s).
- Docs: documentation/f10-production-2026-10-17/START-HERE.md · Adapter rows: integration/F10-adapter-rows.json · Test lessons: test-lessons/f10/
'''%(nready,str(f608['challengeReady']).lower()))
json.dump(f608,open(E+'/F6-08-row-patch.F10.json','w'),indent=2,ensure_ascii=False)
mn='''# F10 merge notes (2026-10-17)
Base: the production root with F0 to F8 merged. Overlay `NOVA-F0-F3-production/` onto the repo root. Every file is either new or a replacement for the F10 file with the same name.

1. Copy `NOVA-F0-F3-production/*` over the root. This touches only F10/, the new integration files (nova-f10-contracts.js, nova-f10-runtime.js, F10-adapter-rows.json, F6-08-adapter-row.F10.json), integration/qa/*f10*, documentation/f10-production-2026-10-17/, test-lessons/f10/ and tools/f10/. No existing core or F0 to F8 file changes.
2. In `integration/component-adapters.json`, replace the 20 rows with ids F10-01 to F10-20 with the rows in `integration/F10-adapter-rows.json` (sha256 values match the new F10 files), and replace the F6-08 row with `integration/F6-08-adapter-row.F10.json`.
3. Add the _entries snippets (README.F10.md, TEST-RESULTS.F10.md, source-hashes.F10.json) to the repo-level README, TEST-RESULTS and source-hashes.
4. Not shipped: node_modules and the playwright/axe symlinks. To run QA, install playwright and axe-core in integration/node_modules.

Files (%d):
'''%len(files)+''.join('- %s\n'%f for f in files)
open(M+'/MERGE-NOTES.md','w').write(mn);shutil.copy(M+'/MERGE-NOTES.md',E+'/MERGE-NOTES.F10.md')
print('done',len(files),'challengeReady',nready,'F6-08',f608['challengeReady'])
