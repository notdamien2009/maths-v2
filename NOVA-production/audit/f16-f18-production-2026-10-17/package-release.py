from pathlib import Path
import os,json,hashlib,zipfile,shutil,time
r=Path(r'C:\Users\PC Deals\Desktop\CODEX\NOVA-F0-F15-production');out=Path(r'C:\Users\PC Deals\Documents\Codex\2026-10-16\i-h\outputs');out.mkdir(exist_ok=True);a=r/'audit/f16-f18-production-2026-10-17';d=r/'documentation/f16-f18-production-2026-10-17'
files=[]
for base,dirs,names in os.walk(r,followlinks=False):
 dirs[:]=[n for n in dirs if n not in ['node_modules','__pycache__','.git']]
 for name in names:
  p=Path(base)/name
  if name=='source-hashes.json':continue
  files.append(p)
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();hashes={p.relative_to(r).as_posix():sha(p) for p in files};(r/'source-hashes.json').write_text(json.dumps(hashes,indent=2),encoding='utf8');files.append(r/'source-hashes.json')
shutil.copy2(d/'LESSON-PRODUCTION-GUIDE.md',out/'F16-F18-production-guide.md');shutil.copy2(d/'test-results.md',out/'F16-F18-test-results.md');shutil.copy2(d/'release-summary.json',out/'F16-F18-release-summary.json')
full=out/'NOVA-production-with-F16-F17-F18.zip';delta=out/'NOVA-F16-F18-upgrade.zip'
newAudit='audit/f16-f18-production-2026-10-17/'
def selected(p):
 s=p.relative_to(r).as_posix();return s.startswith(('F16/','F17/','F18/','documentation/f16-f18-production-2026-10-17/','test-lessons/f16-f18/',newAudit)) or s in ['README.md','START-HERE.html','source-hashes.json','integration/component-adapters.json','integration/nova-control-labels.js','integration/qa/test-f16-f18-production.cjs'] or any(s.startswith('integration/nova-f'+f+'-') or s=='integration/F'+f+'-adapter-rows.json' for f in ['16','17','18'])
# Repeated generated fixtures are already delivered in test-lessons; retain final phone Explore/resize screenshots.
def keep(p):
 s=p.relative_to(r).as_posix()
 if s.startswith(newAudit+'fixtures/'):return False
 if s.startswith(newAudit+'screenshots/native/'):return s.endswith('-explore-390.png')
 return True
report=[]
for dest,items,prefix in [(delta,[p for p in files if selected(p) and keep(p)],'NOVA-F16-F18-upgrade'),(full,[p for p in files if keep(p)],'NOVA-production-with-F16-F17-F18')]:
 print('Packaging',dest.name,len(items),'files',flush=True)
 with zipfile.ZipFile(dest,'w',zipfile.ZIP_DEFLATED,compresslevel=4,allowZip64=True) as z:
  for p in items:z.write(p,prefix+'/'+p.relative_to(r).as_posix())
  z.writestr(prefix+'/PACKAGING-NOTE.txt','Open START-HERE.html. F16/F17/F18 are the added verified families. F12/F14 were excluded from the supplied production ZIP; source files exist in the older bank but their production approval is not established here. The upgrade ZIP overlays the supplied NOVA-F0-F15-production base. The full ZIP includes that base. Node dependencies are excluded. Repeated generated audit fixtures and non-phone native screenshots remain in the working folder; delivered test-lessons and phone/resize evidence are included. source-hashes.json describes the working folder including those omitted generated artifacts. See documentation/f16-f18-production-2026-10-17 for verification scope.')
 with zipfile.ZipFile(dest) as z:
  bad=z.testzip();assert bad is None,bad
  for id in ['F16','F17','F18']:assert any(n.startswith(prefix+'/'+id+'/') for n in z.namelist())
 report.append({'file':dest.name,'bytes':dest.stat().st_size,'sha256':sha(dest),'zipCRC':'PASS','entries':len(items)+1})
 print(dest.name,dest.stat().st_size,'CRC PASS',flush=True)
(out/'package-verification.json').write_text(json.dumps(report,indent=2),encoding='utf8');print('DELIVERABLES READY',flush=True)
