#!/usr/bin/env python3
"""Combine exact-core F4 Run14-16 reports. Fail closed. NEVER marks GOLD.
Writes only review/F4-RUN17-ACCEPTANCE.json.
"""
from pathlib import Path
import hashlib, json, sys, datetime
R=Path(__file__).resolve().parents[1]
REVIEW=R/'review'; EXP={'js':'ac0b40a0bf19246ec3a9824798bd67dfe738c91c','css':'1830cd68b3a345cbeefae69782bf2b309765d5fa'}
IDS=['F4-01','F4-02','F4-03','F4-04','F4-06','F4-07','F4-08','F4-09','F4-11','F4-12']

def sha(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def blob(path):
 d=path.read_bytes();return hashlib.sha1(('blob %d\0'%len(d)).encode()+d).hexdigest()
def read_json(path):return json.loads(path.read_text(encoding='utf8'))
def main():
 gates={}
 core={k:blob(R/'core'/f'nova-core.{k}') if (R/'core'/f'nova-core.{k}').is_file() else None for k in ('js','css')}
 gates['current_git_core']=core==EXP
 stage=REVIEW/'F4-RUN14-stage'; mf=stage/'F4-RUN14-BUILD-RESULTS.json'
 try:
  m=read_json(mf)
  gates['staged_core_identical']=m.get('core_git_blobs')==EXP and m.get('baseline')=='github-48a7eb7-f12'
  gates['ten_staged_engine_hashes_match']=all((lambda entry: entry and (stage/Path(entry.get('file','')).name).is_file() and sha(stage/Path(entry['file']).name)==entry['sha256'])(m.get('built',{}).get(i)) for i in IDS)
 except Exception as e:
  gates['staged_core_identical']=False;gates['ten_staged_engine_hashes_match']=False
 try:
  a=read_json(REVIEW/'F4-RUN15-ALL-RESULTS.json')
  gs=a.get('groups',{})
  gates['exact_core_browser_maths']=(a.get('mode')=='EXACT_GITHUB_CORE_ACCEPTANCE' and a.get('pass') is True and a.get('core_unchanged') is True and set(gs)==set('ABCDE') and all(g.get('passed') is True and g.get('exact_core') is True for g in gs.values()))
 except Exception: gates['exact_core_browser_maths']=False
 try:
  b=read_json(REVIEW/'F4-RUN16-PHYSICAL-RESULTS.json')
  bs=b.get('summary',{})
  gates['exact_core_physical']=(b.get('exact_current_github_core') is True and b.get('core_blob_sha')==EXP and b.get('status')=='EXACT_CORE_POINTER_QA_PASS_OWNER_REVIEW_PENDING' and bs.get('passed_scripts')==bs.get('total_scripts')==12 and bs.get('timed_out_scripts')==0 and set(b.get('engines',[]))==set(IDS))
 except Exception:gates['exact_core_physical']=False
 # Reject stale green reports left behind by earlier runs. Current stage must precede
 # the fresh Run15 and Run16 reports, which the one-click launcher regenerates.
 try:
  f15=REVIEW/'F4-RUN15-ALL-RESULTS.json'; f16=REVIEW/'F4-RUN16-PHYSICAL-RESULTS.json'
  gates['run15_and_run16_evidence_fresh']=(mf.is_file() and f15.is_file() and f16.is_file()
     and f15.stat().st_mtime+2 >= mf.stat().st_mtime
     and f16.stat().st_mtime+2 >= f15.stat().st_mtime)
 except Exception:gates['run15_and_run16_evidence_fresh']=False
 gates['fraction_preset_present']=(R/'F4'/'F4-05-fraction-of-amount-bar.html').is_file()
 gates['equation_translator_source_present']=(R/'F4'/'F4-08-algebra-bar.html').is_file()
 all_ok=all(gates.values())
 outcome='EXACT_CORE_TECHNICAL_GATE_PASSED_OWNER_REVIEW_PENDING' if all_ok else 'BLOCKED_TECHNICAL_GATES_PENDING'
 report={'run':'F4-RUN17','evaluated_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'status':outcome,'git_commit_expected':'48a7eb7309cb37e6f23efea5204152704f42f03c','core_git_blobs_expected':EXP,'core_git_blobs_observed':core,'gates':gates,'all_technical_gates_passed':all_ok,'owner_gold_approval':False,'github_modified':False,'notes':['This report is generated from live LOCAL test evidence, not earlier simulated reports.','Native touchscreen, real screen reader and live lesson integration are separate owner decisions.','Does not update GitHub or overwrite canonical engines.']}
 REVIEW.mkdir(parents=True,exist_ok=True)
 dst=REVIEW/'F4-RUN17-ACCEPTANCE.json';dst.write_text(json.dumps(report,indent=2)+'\n',encoding='utf8')
 print(outcome,'\n',json.dumps(gates,indent=2),'\nReport:',dst)
 return 0 if all_ok else 1
if __name__=='__main__':sys.exit(main())
