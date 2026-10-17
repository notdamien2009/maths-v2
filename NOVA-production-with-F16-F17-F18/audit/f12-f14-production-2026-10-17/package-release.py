from pathlib import Path
import os,json,hashlib,zipfile,shutil
r=Path(r'C:\Users\PC Deals\Desktop\CODEX\NOVA-F0-F15-production');out=Path(r'C:\Users\PC Deals\Documents\Codex\2026-10-16\i-h\outputs');a=r/'audit/f12-f14-production-2026-10-17';d=r/'documentation/f12-f14-production-2026-10-17';sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
summary=json.loads((d/'release-summary.json').read_text(encoding='utf8'));assert summary['browserChecks']==summary['passedBrowserChecks'] and summary['components']==28
files=[]
for base,dirs,names in os.walk(r,followlinks=False):
 dirs[:]=[n for n in dirs if n not in ['node_modules','__pycache__','.git']]
 for name in names:
  p=Path(base)/name;s=p.relative_to(r).as_posix()
  if name=='source-hashes.json':continue
  if s.startswith('audit/') and '/fixtures/' in s:continue
  if '/screenshots/native/' in s and not s.endswith('-explore-390.png'):continue
  files.append(p)
hashes={p.relative_to(r).as_posix():sha(p) for p in files};(r/'source-hashes.json').write_text(json.dumps(hashes,indent=2),encoding='utf8');files.append(r/'source-hashes.json')
for src,name in [(d/'LESSON-PRODUCTION-GUIDE.md','F12-F14-production-guide.md'),(d/'test-results.md','F12-F14-test-results.md'),(d/'release-summary.json','F12-F14-release-summary.json'),(r/'test-lessons/f12-f14/Garden-design-F12-F14-F18.html','F12-F14-F18-test-lesson.html'),(r/'test-lessons/f12-f14/Answer-key.json','F12-F14-F18-answer-key.json')]:shutil.copy2(src,out/name)
def delta(p):
 s=p.relative_to(r).as_posix();return s.startswith(('F12/','F14/','audit/f12-f14-production-2026-10-17/','documentation/f12-f14-production-2026-10-17/','test-lessons/f12-f14/')) or s in ['README.md','START-HERE.html','MERGE-NOTES.md','source-hashes.json','integration/component-adapters.json','integration/F12-adapter-rows.json','integration/F14-adapter-rows.json','integration/qa/test-f12-f14-production.cjs'] or s.startswith(('integration/nova-f12-','integration/nova-f14-'))
report=[]
for name,prefix,items in [('NOVA-F12-F14-upgrade.zip','NOVA-F12-F14-upgrade',[p for p in files if delta(p)]),('NOVA-F0-F18-production.zip','NOVA-F0-F18-production',files)]:
 dest=out/name;print('Packaging',name,len(items),'files',flush=True)
 with zipfile.ZipFile(dest,'w',zipfile.ZIP_DEFLATED,compresslevel=4,allowZip64=True) as z:
  for p in items:z.write(p,prefix+'/'+p.relative_to(r).as_posix())
  z.writestr(prefix+'/PACKAGING-NOTE.txt','Open START-HERE.html. Full ZIP contains F0 through F18. Upgrade ZIP overlays the existing bank with F12/F14 and updated integration metadata. Node dependencies, repeated generated audit fixtures and non-phone native screenshots are excluded; individual test lessons and current phone/resize evidence are included. source-hashes.json lists the files selected for the full combined archive, excluding the manifest itself and this note. Historical audits retain their original scope and can contain superseded pending-family references or pilot failures. Current F12/F14 evidence: audit/f12-f14-production-2026-10-17/release-browser.json.')
 with zipfile.ZipFile(dest) as z:
  assert z.testzip() is None
  for p in [x for x in files if x.parent.name in ['F12','F14'] and x.suffix=='.html']:
   assert hashlib.sha256(z.read(prefix+'/'+p.relative_to(r).as_posix())).hexdigest()==sha(p)
  if 'F0-F18' in name:
   for i in range(19):assert any(n.startswith(prefix+f'/F{i}/') for n in z.namelist())
   for row in json.loads((r/'integration/component-adapters.json').read_text(encoding='utf8')):
    if row['id'].startswith(('F12-','F14-','F16-','F17-','F18-')):assert hashlib.sha256(z.read(prefix+'/'+row['path'])).hexdigest()==row['sha256']
 report.append({'file':name,'bytes':dest.stat().st_size,'sha256':sha(dest),'zipCRC':'PASS','entries':len(items)+1});print(name,'CRC PASS',dest.stat().st_size,flush=True)
(out/'F12-F14-package-verification.json').write_text(json.dumps(report,indent=2),encoding='utf8');print('DELIVERABLES READY',flush=True)
