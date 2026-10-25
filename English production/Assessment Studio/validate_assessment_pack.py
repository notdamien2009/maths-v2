#!/usr/bin/env python3
"""NOVA English Assessment Studio: validate public papers and private marking schemes.
Usage: python validate_assessment_pack.py PAPER.json PRIVATE-MARK-SCHEME.json
Run on content data before embedding a paper into the universal HTML template.
"""
import json,sys,re
from pathlib import Path
TYPES={'single-choice','multi-select','short-answer','quote-selection','evidence-explanation','analysis-paragraph','extended-writing','paired-comparison','proofreading-edit'}
FORBIDDEN={'answer','answers','correct','correctIndex','acceptedAnswers','markScheme','markingScheme','markscheme','modelAnswer','rubric','scoringKey','isCorrect','solution','solutions','lookFor','expectedResponse'}
def check(c,msg):
 if not c:raise ValueError(msg)
def forbidden(obj,path='paper'):
 if isinstance(obj,dict):
  for k,v in obj.items():
   check(k not in FORBIDDEN,'Private field in public paper: '+path+'.'+k)
   forbidden(v,path+'.'+k)
 elif isinstance(obj,list):
  for i,v in enumerate(obj):forbidden(v,f'{path}[{i}]')
def validate(paper,scheme=None):
 check(paper.get('schema')=='nova-english-assessment/v1','Wrong public paper schema')
 forbidden(paper)
 for f in ('assessmentId','paperVersion','year','lesson','title','unit','profile','maxMarks','sections','sources'):check(f in paper,'Missing '+f)
 sources=paper['sources'];check(isinstance(sources,list),'sources must be a list')
 ids=[s['id'] for s in sources];check(len(ids)==len(set(ids)),'Duplicate source IDs')
 for s in sources:check(isinstance(s.get('lines'),list),'Missing source lines for '+s['id'])
 sectIds=[];questions=[]
 for sec in paper['sections']:
  check(sec.get('id') and isinstance(sec.get('questions'),list) and sec['questions'],'Empty/invalid section')
  sectIds.append(sec['id']);questions.extend(sec['questions'])
 check(len(sectIds)==len(set(sectIds)),'Duplicate section IDs')
 qids=[q['id'] for q in questions];check(len(qids)==len(set(qids)),'Duplicate question IDs')
 for q in questions:
  check(q.get('type') in TYPES,'Unsupported question type for '+q['id'])
  check(isinstance(q.get('marks'),int) and q['marks']>0,'Invalid marks for '+q['id'])
  check(q.get('prompt'),'Missing question prompt for '+q['id'])
  check(isinstance(q.get('sourceRefs'),list) and set(q['sourceRefs']).issubset(ids),'Bad source reference for '+q['id'])
  if q['type'] in ('single-choice','multi-select'):
   ops=q.get('options',[]);check(len(ops)>=2 and len(ops)==len({o['id'] for o in ops}),'Bad choices '+q['id'])
  if q['type']=='proofreading-edit':check(q.get('original'),'Missing original editing passage in '+q['id'])
 check(sum(q['marks'] for q in questions)==paper['maxMarks'],'Question total does not equal maximum marks')
 if scheme is not None:
  check(scheme.get('schema')=='nova-english-mark-scheme/v1','Wrong mark scheme schema')
  check(scheme.get('private') is True,'Scheme must be tagged private')
  check(scheme.get('assessmentId')==paper['assessmentId'] and scheme.get('paperVersion')==paper['paperVersion'],'Paper and scheme ID/version mismatch')
  keyed={q['id']:q for q in scheme.get('questions',[])};check(len(keyed)==len(questions),'Missing/duplicate scheme entries')
  for q in questions:
   m=keyed.get(q['id']);check(m is not None,'No mark scheme for '+q['id'])
   check(m.get('marks')==q['marks'],'Question mark mismatch: '+q['id'])
   check(bool(m.get('model') or m.get('exactAnswer')),'No model/accepted answer: '+q['id'])
   check(bool(m.get('lookFor')),'Missing look-for checklist: '+q['id'])
 return {'assessmentId':paper['assessmentId'],'questions':len(questions),'maxMarks':paper['maxMarks'],'profiles':paper['profile'],'privateSchemeChecked':bool(scheme)}
if __name__=='__main__':
 if len(sys.argv)<2 or len(sys.argv)>3:sys.exit(__doc__)
 try:
  p=json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'));s=json.loads(Path(sys.argv[2]).read_text(encoding='utf-8')) if len(sys.argv)==3 else None
  print('PASS:',json.dumps(validate(p,s)))
 except (ValueError,KeyError,TypeError,json.JSONDecodeError) as e:
  print('FAIL:',e,file=sys.stderr);sys.exit(1)
