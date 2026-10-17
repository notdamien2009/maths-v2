#!/usr/bin/env python3
"""Compare an inserted lesson with its supplied immutable template. No dependencies."""
import argparse,hashlib,json,re,sys
from pathlib import Path
ALLOWED=('novaLessonData','novaProductionData','novaV2Sources')
def digest(data):return hashlib.sha256(data).hexdigest()
def inspect(text):
 values={}
 for ident in ALLOWED:
  pattern=r'(<script\b(?=[^>]*\bid=[\"\x27]'+re.escape(ident)+r'[\"\x27])[^>]*>)(.*?)(</script\s*>)'
  matches=list(re.finditer(pattern,text,re.S|re.I))
  if len(matches)!=1:raise ValueError(f'{ident}: expected exactly one script, found {len(matches)}')
  values[ident]=json.loads(matches[0][2]);text=re.sub(pattern,lambda m:m[1]+'__INSERTION_CONTENT__'+m[3],text,flags=re.S|re.I)
 titles=list(re.finditer(r'<title>.*?</title>',text,re.S|re.I))
 if len(titles)!=1:raise ValueError('Expected one outer document title')
 text=re.sub(r'(<title>).*?(</title>)',r'\1__LESSON_TITLE__\2',text,flags=re.S|re.I)
 return text,values
parser=argparse.ArgumentParser();parser.add_argument('template');parser.add_argument('lesson');parser.add_argument('--allow-placeholders',action='store_true');args=parser.parse_args()
try:
 base=Path(args.template).read_text(encoding="utf-8-sig");result=Path(args.lesson).read_text(encoding="utf-8-sig");shell,_=inspect(base);output,values=inspect(result)
 if shell!=output:raise ValueError('PROTECTED SHELL CHANGED: changes outside the three JSON blocks and outer title')
 data=values['novaLessonData'];production=values['novaProductionData'];assets=values['novaV2Sources']
 if not args.allow_placeholders:
  if data['meta'].get('templateMode') is not False:raise ValueError('meta.templateMode must be false in a produced lesson')
  editable=json.dumps([data,production],ensure_ascii=False)
  if re.search(r'\[\s*insert\b',editable,re.I):raise ValueError('Unfilled insertion placeholder remains in content')
  for key in ('title','curriculumCode','objective'):
   if not str(data['meta'].get(key,'')).strip():raise ValueError('Missing metadata: '+key)
  for key in ('learn','examples'):
   if not data.get(key):raise ValueError('Empty '+key+' array')
  if not data['bob'].get('concepts'):raise ValueError('No Bob concepts')
  expected={'start':5,'practice':15,'exit':10}
  groups={'start':data['start']['diagnostic'],'practice':data['practice'],'exit':data['exit']}
  for name,items in groups.items():
   if len(items)!=expected[name]:raise ValueError(f'{name}: expected {expected[name]} question slots')
   for q in items:
    if not str(q.get('answer','')).strip():raise ValueError('Missing private key: '+q['id'])
    if q['type'] in ('mcq','visual-mcq') and len(q.get('options',[]))!=3:raise ValueError('Expected three options: '+q['id'])
  sourceids=production['sourceIds'];refs=[]
  refs.extend(b['source'] for c in data['bob']['concepts'] for b in c['beats'])
  refs.extend(s['source'] for e in data['examples'] for s in e['steps'])
  refs.extend(c['source'] for c in data['learn'])
  for ref in set(refs):
   if not ref or ref not in sourceids or not isinstance(assets.get(ref),str) or '<html' not in assets[ref].lower():raise ValueError('Unresolved V2 asset: '+repr(ref))
 print(json.dumps({'status':'PASS','template_sha256':digest(base.encode()),'protected_shell_sha256':digest(shell.encode()),'counts':{'learn':len(data.get('learn',[])),'bob':len(data.get('bob',{}).get('concepts',[])),'examples':len(data.get('examples',[]))},'scope':'Shell/content-shape check only; not mathematical, browser, source-lineage or audio certification'},indent=2))
except (ValueError,KeyError,TypeError,json.JSONDecodeError) as error:
 print('FAIL:',error,file=sys.stderr);sys.exit(1)
