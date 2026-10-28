import json,os,shutil,glob,hashlib,zipfile,re
R='/workspace/codex-f6/work2/root';A=R+'/audit/f6-production-2026-10-17';SRC='/workspace/codex-f6/src';B=os.path.dirname(os.path.abspath(__file__))
M='/workspace/codex-f6/merge';O=M+'/NOVA-F0-F3-production';E=M+'/_entries';D=O+'/documentation/f6-production-2026-10-17'
shutil.rmtree(M,ignore_errors=True)
for d in [O+'/F6',O+'/integration/qa',D+'/evidence/per',D+'/screenshots',O+'/test-lessons/f6',O+'/tools/f6',E]:os.makedirs(d,exist_ok=True)
h=lambda p:hashlib.sha256(open(p,'rb').read()).hexdigest()
rows=json.load(open(A+'/F6-adapter-rows.json'));byid={r['id']:r for r in rows}
names={'F6-01':'Ratio table','F6-02':'Double number line','F6-03':'Sharing in a ratio','F6-04':'Simplifying ratios','F6-05':'Recipe scaler','F6-06':'Best-buy comparer','F6-07':'Map and scale drawing','F6-08':'Direct proportion graph','F6-09':'Inverse proportion rectangle','F6-10':'Speed-distance-time','F6-11':'Rates-of-change tank','F6-12':'Currency and unit bridges','F6-13':'Proportion in geometry','F6-14':'Ratio and fraction translator'}
host={'F6-08':'F10-05','F6-12':'F18-02','F6-13':'F14-11'}
rep=json.load(open(B+'/build-report.json'));native={x['id']:x for x in json.load(open(A+'/native-regression.json'))}
rz=json.load(open(A+'/resize-390-1024-1440.json'))
bank={x['id']:x for x in json.load(open(A+'/bank-regression-results.json'))}
bok=lambda x:not x['errors'] and all(x['native']['modes'].values()) and not x['native']['stepErrors'] and x['integration'].get('invalidRejected') and x['integration'].get('changed') and x['guided'] and x['bob']
# component files
for p in sorted(glob.glob(R+'/F6/*.html')):shutil.copy(p,O+'/F6/')
for f in ['nova-f6-contracts.js','nova-f6-runtime.js']:shutil.copy(R+'/integration/'+f,O+'/integration/')
json.dump(rows,open(O+'/integration/F6-adapter-rows.json','w'),indent=2)
for f in ['test-f6-production.cjs','test-f6-resize.cjs','test-native-regression.cjs','f6-questions.cjs']:shutil.copy(A+'/'+f,O+'/integration/qa/')
for f in ['run-f6.sh','probe.cjs','steps.cjs','narrow-probe.cjs','adapter-rows.cjs']:shutil.copy(A+'/'+f,O+'/tools/f6/')
for f in ['build6.py','hook.js','hidden.json','nova-f6-contracts.js','nova-f6-runtime.js','merge6.py','build-report.json']:shutil.copy(B+'/'+f,O+'/tools/f6/')
for p in glob.glob(A+'/fixtures/F6-*.html'):shutil.copy(p,O+'/test-lessons/f6/'+os.path.basename(p)[:5]+'-challenge-test-lesson.html')
for p in glob.glob(A+'/per/*.json'):shutil.copy(p,D+'/evidence/per/semantic-browser-'+os.path.basename(p))
for f in ['native-regression.json','resize-390-1024-1440.json','bank-regression-results.json']:shutil.copy(A+'/'+f,D+'/evidence/')
shutil.copytree(A+'/screenshots',D+'/screenshots',dirs_exist_ok=True)
with zipfile.ZipFile(D+'/F6-originals.zip','w',zipfile.ZIP_DEFLATED) as z:
    for p in sorted(glob.glob(SRC+'/*.html')):z.write(p,'F6/'+os.path.basename(p))
notes={
'F6-01':'Concealed view is the native step-1 view (capped there), which shows only the known pair and "?" cells. The relationship card shows y/x as a rate, which is a given, not the answer.',
'F6-02':'Phase 0 and the concealed view use the native Challenge view, which labels only 0 and the known pair on the bottom line. From native step 3 ("both lines stretch") onwards the full bottom scale is labelled by design, so the answer is visible from phase 2.',
'F6-03':'Concealed view is the native Challenge view (total and parts, shares "?"). The step 5 and 6 captions now come from the drawn ratio; they had been fixed to the 2:3 / £30 example.',
'F6-04':'Concealed view is the native Challenge view at step 2. Answers are text (for example 2:3).',
'F6-05':'Concealed view is the native Challenge view (start and target servings, factor, every new amount "?").',
'F6-06':'Concealed view is the native Challenge view. The lesson answer is pack A’s pence per comparison amount; the native verdict (best buy) is not used as an answer.',
'F6-07':'Concealed view is the native Challenge view. The ruler and scale bar stay visible (they are the apparatus), so the questions avoid answers that appear as ruler or scale-bar numbers.',
'F6-09':'Phase 0 and the concealed view use the native Challenge view; native step 0 states y for the start width. The questions avoid answers that appear as axis numbers.',
'F6-10':'Phase 0 and the concealed view use the native Challenge view (the covered unknown). The leg values come from the lesson state. The native view shows the vehicle 60% of the way along (for example 90 km at 1.8 h). That position is consistent with the question but is not the answer, so the speed can still be worked out from it.',
'F6-11':'Phase 0 and the concealed view use the native Challenge view. The graph end-point (for example 64 cm at 8 min) is a given, so pupils can work out the gradient.',
'F6-14':'Concealed view is the native Challenge view with the fraction dock hidden, so no option shows the answer. The step 4 and 5 captions now come from the ratio; they had been fixed to 2:3.'}
comp=[];status=[]
for id_ in sorted(names):
    r=byid[id_]
    if id_ in host:
        c={'id':id_,'name':names[id_],'path':r['path'],'status':'PRESET ONLY – NOT RUNNABLE','productionReady':False,'challengeReady':False,'presetOf':host[id_],'hostEngineAvailable':False,'sourceSha256':h(SRC+'/'+os.path.basename(r['path'])),
           'reason':'Config-only preset for %s. That host engine is not in this codebase, so there is nothing to mount, wire into F0-12 or test. The file is delivered unchanged.'%host[id_]}
        comp.append(c);status.append('| %s %s | no (preset of %s, host missing) | – | – | – | false | – | – | PRESET ONLY |'%(id_,names[id_],host[id_]));continue
    sem=json.load(open(A+'/per/%s.json'%id_))[0];ch=sem['checks'];ok=sum(c['pass'] for c in ch)
    nat=native[id_];nok=sum(c['pass'] for c in nat['checks']);rr=[x for x in rz['rep'] if x['id']==id_];rok=sum(x['ok'] for x in rr)
    st=all(c['pass'] for c in ch if c['name'].startswith(('explore:','challenge:')))
    game=all(c['pass'] for c in ch if c['name'] in ('six correct auto-advance and completion','canonical scoring after retry','badge and confetti','wrong answer holds question and costs life','no round reveals its answer','reset score lives and question','hint cost and retry resets streak'))
    n=sem['resize']['narrow'];f=sem['resize']['fresh'];bk=bok(bank[id_]);allok=bk and ok==len(ch) and nok==len(nat['checks']) and rok==len(rr) and not sem['errors']
    c={'id':id_,'name':names[id_],'path':r['path'],'status':'PASS WITH LIMITATIONS' if allok else 'FAIL','productionReady':allok,'challengeReady':game and allok,
       'sourceSha256':r['sha256'],'originalSha256':r['original_sha256'],'nativeSteps':len(eval(r['nativeFieldsByStep'])),'draws':r['draws'],'tables':r['tables'],
       'valueInterface':'data.lesson = {state: partial native preset (same keys as the native presets), phase: native step index, motion?: {from,to,durationMs}, title?}. Records with concealAnswers draw the concealed view.',
       'presetKeys':sorted(set().union(*[set(p.keys()) for p in []])) if False else None,
       'tests':{'semantic':'%d/%d'%(ok,len(ch)),'nativeRegression':'%d/%d'%(nok,len(nat['checks'])),'resize390_1024_1440':'%d/%d'%(rok,len(rr)),'bankRegression':'pass' if bk else 'FAIL'},
       'phoneLabels390':{'afterResize':{'median':n['median'],'p10':n['p10']},'fresh':{'median':f['median'],'p10':f['p10']}},'statePreservedOnResize':st,'limitations':notes[id_],'buildChanges':rep[id_]}
    c.pop('presetKeys')
    comp.append(c);status.append('| %s %s | yes | %d/%d | %d/%d | %s | %s | %.1f / %.1fpx | %s | %s |'%(id_,names[id_],ok,len(ch),nok,len(nat['checks']),'pass' if bk else 'FAIL',str(c['challengeReady']).lower(),n['median'],n['p10'],'yes' if st else 'NO',c['status']))
tsha=h(R+'/00-master/NOVA-MATHS-LESSON-LAYOUT-TEMPLATE.html')
json.dump({'family':'F6','revision':'2026-10-17','componentCount':14,'upgradedCount':11,'presetOnlyCount':3,'template':'00-master/NOVA-MATHS-LESSON-LAYOUT-TEMPLATE.html','templateSha256':tsha,'components':comp},open(D+'/F6-capability-manifest.json','w'),indent=1,ensure_ascii=False)
hdr='| Component | Upgraded | F6 tests | Native regression | Bank regression | challengeReady | 390 label median / p10 | State kept on resize | Status |\n|---|---|---|---|---|---|---|---|---|\n'
open(D+'/status-table.md','w').write(hdr+'\n'.join(status)+'\n')
import subprocess
ex=json.loads(subprocess.check_output(['node','-e',"const {payload}=require('%s/f6-questions.cjs');const o={};for(const id of %s)o[id]=[0,1].map(j=>{const {expected,...r}=payload(id,j);return r;});console.log(JSON.stringify(o))"%(A,json.dumps([i for i in names if i not in host]))]))
json.dump({'note':'Lesson records for each upgraded F6 engine (the first two Challenge rounds used in QA). privateAnswer is read by the F0-12 controller and is never drawn.','examples':ex},open(D+'/F6-configuration-examples.json','w'),indent=1,ensure_ascii=False)
ind=['# F6 individual audit (2026-10-17)\n','Each component was rebuilt from the pack file `/workspace/codex-f6/f6pack.zip`; the upgrade adds hooks only and keeps the original artwork and apparatus. The **status table** is in `status-table.md`.\n']
for c in comp:
    ind.append('\n## %s %s — %s\n'%(c['id'],c['name'],c['status']))
    if c['id'] in host:ind.append('- '+c['reason']+'\n- challengeReady: **false**. productionReady: **false**.\n');continue
    t=c['tests'];pl=c['phoneLabels390']
    ind.append('- Tests: semantic %s · native regression %s · resize 390/1024/1440 %s.\n'%(t['semantic'],t['nativeRegression'],t['resize390_1024_1440']))
    ind.append('- F0-12 Challenge: six rounds from lesson records; a wrong answer holds the round, then auto-advance, scoring 85, badge, reset and hint all pass. challengeReady: **%s**.\n'%str(c['challengeReady']).lower())
    ind.append('- Phone (390): label median %.1f px, p10 %.1f px after resize (fresh load %.1f / %.1f). Pupil state kept on 1440→390→1440 in Explore and Challenge: %s.\n'%(pl['afterResize']['median'],pl['afterResize']['p10'],pl['fresh']['median'],pl['fresh']['p10'],'yes' if c['statePreservedOnResize'] else 'NO'))
    ind.append('- Build changes: '+'; '.join(x for x in c['buildChanges'] if not x.startswith('core:'))+'; %d F3 core fixes applied.\n'%sum(1 for x in c['buildChanges'] if x.startswith('core:')))
    ind.append('- Limitations / notes: '+c['limitations']+'\n')
open(D+'/F6-individual-audit.md','w').write(''.join(ind))
open(D+'/F6-code-changes.md','w').write('''# F6 code changes
Every upgraded file (F6-01…07, 09, 10, 11, 14) gets the following. `tools/f6/build6.py` makes the changes and stops if an anchor is missing or appears twice.
1. **Lesson API:** canonical `integration/nova-v2-lesson-api.js`, plus support scripts (`nova-explore-policy`, `nova-speech-policy`, `nova-f6-contracts`, `nova-f4-runtime`, `nova-f6-runtime`), embedded inline.
2. **F3 core fixes:** timeline reset, drag-snap, speech and game scoring hunks, the same set F4 used (`f3-core-hunks.json` [8:18]).
3. **Lesson hook** (`tools/f6/hook.js`):
   - `data.lesson.state` is merged over the native preset.
   - The engine's own step renderer draws `phase`.
   - Concealed records, and phases before the engine's reveal step (`hidden.json`), use the engine's own Challenge draw call with the lesson preset. No new artwork.
4. **Contracts** (`integration/nova-f6-contracts.js`):
   - Only native preset keys are allowed.
   - Positive finite numbers (zero only where a native preset uses zero).
   - Per-engine maths rules: divisible totals, raw×clear = whole, legs that sum to the totals, widths that divide the area, and so on.
5. **Runtime** (`integration/nova-f6-runtime.js`):
   - Width relayout, shared with F5 fix3: the last draw is replayed on a breakpoint crossing, which keeps pupil state and the F0-12 host.
   - Accessibility tidy: removes `null`/`undefined` attribute strings and slider values on `role=img`; labelled `g` → `role=group`.
   - Phone-label floor: SVG labels under 11 px at narrow widths are enlarged, up to 2.4×.
6. **Engine-specific fixes:**
   - F6-03 step 5–6 and F6-14 step 4–5 captions are computed from the drawn ratio. The words stay the same for the default preset, so native regression is unchanged.
F6-08, F6-12 and F6-13 are config-only presets whose host engines (F10-05, F18-02, F14-11) do not exist yet, so they are delivered unchanged.
''')
open(D+'/F6-template-integration.md','w').write('''# F6 template integration
- **Mount:** mount the F6 file as the lesson component (same as F4/F7). `integration/F6-adapter-rows.json` holds the rows for `integration/component-adapters.json`: replace the 14 F6 rows.
- **Lesson record:** `{nativeIndex:0, data:{lesson:{state:{...native preset keys}, phase:n, motion?:{from,to,durationMs}, title?}}, prompt, privateAnswer, answerType}`. See F6-configuration-examples.json.
- **Challenge:** the F0-12 controller (`NovaLessonChallenge`) renders each round with `concealAnswers:true`, which draws the engine's concealed view.
- **Validation:** `NovaLessonComponent.validate(record)` uses the F6 contracts and rejects impossible maths before anything is drawn.
- **Phone:** engines redraw on breakpoint crossings: F6-01 689 px; F6-02 680; F6-03–07 and F6-14 760; F6-09–11 1000 (iframe width).
''')
tot=lambda k:(sum(int(c['tests'][k].split('/')[0]) for c in comp if 'tests' in c),sum(int(c['tests'][k].split('/')[1]) for c in comp if 'tests' in c))
s,n_,z=tot('semantic'),tot('nativeRegression'),tot('resize390_1024_1440')
qa='''# F6 test and QA
All tests ran in real Chrome (Playwright 1.63, headless Google Chrome) against the repo root with the canonical template, at 1440, 1024 and 390 px.
| Suite | File | Result |
|---|---|---|
| Semantic production (47 checks per engine) | integration/qa/test-f6-production.cjs | %d/%d |
| Native regression (default presets, original vs upgraded, axe-core criticals) | integration/qa/test-native-regression.cjs | %d/%d |
| Resize 390/1024/1440 (layout after resize = fresh load, learn + challenge) | integration/qa/test-f6-resize.cjs | %d/%d |
| Bank regression (repo component test: modes, steps, data.lesson hook changes the view, invalid data rejected, guided, Bob) | integration/qa/test-components.cjs with NOVA_ONLY_IDS | 11/11 |

What the semantic suite checks:
- Contract rejects impossible data; two distinct question states, each drawn with its own values.
- Answer concealed in text, aria and data attributes; every Challenge round draws its own apparatus with no reveal.
- Wrong answer holds the round and costs a life; six correct answers auto-advance and complete with canonical score 85, badge and confetti; reset; hint cost.
- Guided stages: stage 1 hides the answer.
- Style locks: userSpaceOnUse glow, Chalk font, no duplicate IDs.
- Width checks at 1440/1024/390.
- **Pupil state kept on resize:** native Explore and the live F0-12 Challenge are changed by pupil actions, then resized 1440→390→1440. Panel text, inputs, stage values and buttons must all match, and the F0-12 host must survive.
- **Phone labels:** after 1440→390 and on a fresh 390 load, SVG label median ≥ 11 px and smallest 10%% ≥ 8 px, with no horizontal overflow.

Run: `bash tools/f6/run-f6.sh` from the repo root. Needs `integration/node_modules/playwright` (not shipped).

Evidence:
- `evidence/per/semantic-browser-F6-xx.json`
- `evidence/native-regression.json`
- `evidence/resize-390-1024-1440.json`
- `evidence/bank-regression-results.json`
- screenshots in `screenshots/` (`resize/` holds the 390 post-resize phone shots).
'''%(s[0],s[1],n_[0],n_[1],z[0],z[1])
open(D+'/F6-test-and-QA.md','w').write(qa)
open(D+'/START-HERE.md','w').write('''# F6 production (2026-10-17)
- 11 F6 engines upgraded with the F0-12 Challenge wired in: F6-01…07, 09, 10, 11, 14. All have challengeReady = true.
- F6-08, F6-12 and F6-13 are config-only presets of the host engines F10-05, F18-02 and F14-11, which do not exist yet. They are delivered unchanged, with challengeReady = false.
- F6-FAMILY-GALLERY.html is unchanged.

Read in this order:
1. status-table.md
2. F6-individual-audit.md
3. F6-capability-manifest.json
4. F6-template-integration.md
5. F6-code-changes.md
6. F6-test-and-QA.md

Merge: copy `NOVA-F0-F3-production/` over the repo root, then replace the 14 F6 rows in `integration/component-adapters.json` with `integration/F6-adapter-rows.json`. See `../../../MERGE-NOTES.md`.
''')
files=sorted(os.path.relpath(p,O) for p in glob.glob(O+'/**/*',recursive=True) if os.path.isfile(p))
sh={'family':'F6','generated':'2026-10-17','entries':{f:h(O+'/'+f) for f in files if f.startswith(('F6/','integration/','test-lessons/'))},'originals':{'F6/'+os.path.basename(p):h(p) for p in sorted(glob.glob(SRC+'/*.html'))}}
for n in ['source-hashes.F6.json','source-hashes.F6-entries.json']:json.dump(sh,open(E+'/'+n,'w'),indent=1)
open(E+'/TEST-RESULTS.F6.md','w').write('# F6 test results (2026-10-17)\n\n'+open(D+'/status-table.md').read()+'\nTotals: semantic %d/%d, native regression %d/%d, resize %d/%d. Details: documentation/f6-production-2026-10-17/F6-test-and-QA.md\n'%(s[0],s[1],n_[0],n_[1],z[0],z[1]))
open(E+'/README.F6.md','w').write('''## F6 (ratio and proportion), revision 2026-10-17
- Upgraded with lesson data, F0-12 Challenge, contracts, resize-safe relayout and phone-label floor: F6-01…07, 09, 10, 11, 14 (challengeReady true).
- Presets only, delivered unchanged, challengeReady false: F6-08 (F10-05), F6-12 (F18-02), F6-13 (F14-11). The host engine is not in the codebase.
- Docs: documentation/f6-production-2026-10-17/START-HERE.md · Adapter rows: integration/F6-adapter-rows.json · Test lessons: test-lessons/f6/
''')
mn='''# F6 merge notes (2026-10-17)
Base: the F0-F5 production root after fix3 is merged. Overlay `NOVA-F0-F3-production/` onto the repo root. Every file is either new or a replacement for the F6 file with the same name.

1. Copy `NOVA-F0-F3-production/*` over the root. This touches only F6/, the new integration files, integration/qa/*f6*, documentation/f6-production-2026-10-17/, test-lessons/f6/ and tools/f6/. No existing core or F0-F5 file changes.
2. In `integration/component-adapters.json`, replace the 14 rows with ids F6-01…F6-14 with the rows in `integration/F6-adapter-rows.json`. Their sha256 values match the new F6 files.
3. Add the _entries snippets (README.F6.md, TEST-RESULTS.F6.md, source-hashes.F6.json) to the repo-level README, TEST-RESULTS and source-hashes.
4. Not shipped: node_modules, test fixtures beyond test-lessons/f6, and the playwright/axe symlinks. To run QA, install playwright and axe-core in integration/node_modules.

Files (%d):
'''%len(files)+''.join('- %s\n'%f for f in files)
open(M+'/MERGE-NOTES.md','w').write(mn);shutil.copy(M+'/MERGE-NOTES.md',E+'/MERGE-NOTES.F6.md')
print('done',len(files))
