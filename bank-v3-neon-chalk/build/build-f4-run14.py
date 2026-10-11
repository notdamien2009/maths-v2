#!/usr/bin/env python3
"""NOVA F4 Run14: read-only SHA-guarded core compatibility staging.

Intentionally does not replace core/, existing F4 HTML, prior source, or GitHub.
The staged output is review-only until Chromium and owner checks pass.
"""
from pathlib import Path
import argparse,hashlib,json,re,sys,datetime

BANK=Path(__file__).resolve().parents[1]
BASELINES={
  'legacy-v3.6.2':{
    'js':'45b41ce94d27ed63e877faac6023e483855da76d',
    'css':'aad5139b1a5de01983efcb78dee6aabf917ea0a4'},
  'github-48a7eb7-f12':{
    'js':'ac0b40a0bf19246ec3a9824798bd67dfe738c91c',
    'css':'1830cd68b3a345cbeefae69782bf2b309765d5fa'}}

ENGINE_FILES={
 'F4-01':'F4-01-part-whole-bar.html',
 'F4-02':'F4-02-comparison-bar.html',
 'F4-03':'F4-03-cuisenaire-rod-builder.html',
 'F4-04':'F4-04-multi-step-bar-model.html',
 # F4-05 is deliberately frozen: F5-11 preset already contains its own runtime.
 'F4-06':'F4-06-percentage-bar.html',
 'F4-07':'F4-07-ratio-bar.html',
 'F4-08':'F4-08-algebra-bar.html', # also F4-10 integrated preset
 'F4-09':'F4-09-before-and-after-bar.html',
 'F4-11':'F4-11-word-problem-highlighter.html',
 'F4-12':'F4-12-rates-tape-diagram.html',
}
TAGS={'@@CSS@@':'core/nova-core.css','@@JS@@':'core/nova-core.js'}


def gitblob(data):
 return hashlib.sha1(f'blob {len(data)}\0'.encode()+data).hexdigest()
def sha(data):return hashlib.sha256(data).hexdigest()
def classify(js,css):
 actual={'js':gitblob(js),'css':gitblob(css)}
 for name,ref in BASELINES.items():
  if actual==ref:return name,actual
 raise ValueError('Core is NOT one of the two inspected baselines. Refusing build. '
                 f'Found blob IDs {actual}; expected {BASELINES}. '
                 'Update the compatibility audit before proceeding, not just the checksum.')

def stage(root=BANK,out=None):
 root=Path(root).resolve()
 out=Path(out or root/'review/F4-RUN14-stage').resolve()
 if out == root or out == root/'F4' or root/'core' in out.parents:
  raise ValueError('The stage output must not overwrite F4/ or core/.')
 if not (out==root/'review/F4-RUN14-stage' or (out.is_relative_to(root/'review/'))):
  raise ValueError('Output must be underneath bank-v3-neon-chalk/review/, never the live folders.')
 js=(root/'core/nova-core.js').read_bytes()
 css=(root/'core/nova-core.css').read_bytes()
 baseline,blob=classify(js,css)
 additions={}
 if baseline=='github-48a7eb7-f12':
  shim_js=(root/'compat/nova-f4-f2-compat.js').read_text(encoding='utf8')
  shim_css=(root/'compat/nova-f4-f2-compat.css').read_text(encoding='utf8')
  # This Git commit removed v3.5/v3.6 additions. Restore them in *F4 pages only*.
  for absent in ('NOVA.numberLine=function','NOVA.ui.svgDrag=function','NOVA.motion='):
   if absent in js.decode('utf8'):raise ValueError('Unexpected helper already present; review core diff before overlay')
  for present in ('NOVA.numberLine=function','NOVA.ui.svgDrag=function','NOVA.motion='):
   if present not in shim_js:raise ValueError('Compatibility overlay incomplete: '+present)
  additions={'js':shim_js,'css':shim_css}
 else:
  additions={'js':'','css':''}
 corejs=js.decode('utf8')+'\n'+additions['js']
 corecss=css.decode('utf8')+'\n'+additions['css']
 result={'status':'STAGED_REQUIRES_QA','baseline':baseline,'core_git_blobs':blob,
  'built':{},'skipped':{'F4-05':'Existing F5-11 presentation preset; keep frozen standalone (no shared-core rebuild).',
  'F4-10':'Preset integrated into F4-08; no duplicate engine.'},
  'core_edited':False,'original_engines_edited':False,'github_edited':False,
  'next':'Execute tests/f4-run14-smoke.py; inspect all four modes; then owner approval.'}
 for id,filename in ENGINE_FILES.items():
  source=(root/'build'/f'{id}.src.html').read_text(encoding='utf8')
  replacements={'@@CSS@@':corecss,'@@JS@@':corejs,
    '@@F4CSS@@':(root/'src'/f'{id}.css').read_text(encoding='utf8'),
    '@@F4JS@@':(root/'src'/f'{id}.js').read_text(encoding='utf8')}
  for token,value in replacements.items():
   if token not in source:raise ValueError(f'{id}: missing build token {token}')
   source=source.replace(token,value)
  if re.search(r'@@[A-Z0-9_]+@@',source):raise ValueError(f'{id}: unresolved placeholder')
  target=out/filename
  target.parent.mkdir(parents=True,exist_ok=True)
  target.write_text(source,encoding='utf8')
  result['built'][id]={'file':str(target.relative_to(root)),'sha256':sha(target.read_bytes()),'bytes':target.stat().st_size}
 # The guard never writes inside core/, F4/, src/, or an existing handover.
 out.mkdir(parents=True,exist_ok=True)
 (out/'F4-RUN14-BUILD-RESULTS.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf8')
 return result

if __name__=='__main__':
 try:
  r=stage()
  print('STAGED',len(r['built']),'review-only components using',r['baseline'])
  print('No existing engines or core were changed. No GitHub operation was performed.')
 except Exception as e:
  print('REBUILD REFUSED:',e,file=sys.stderr);sys.exit(2)
