"""Independent numerical cross-check against algebraic polynomial parser; 1000 cases."""
from pathlib import Path
import json,random
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];html=(R/'F8/F8-07-expression-builder.html').read_text();random.seed(807);checks=[]
def rec(n,ok,detail=''):checks.append({'test':n,'passed':bool(ok),'detail':str(detail)[:130]})
with sync_playwright() as P:
 b=P.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox']);p=b.new_page();p.set_content(html)
 for id in ['Y7-028','Y7-034-T','Y7-034-P','Y9-007-D','Y9-007-G']:
  tokens=p.evaluate('(id)=>F807_TEST.presets[id].tokens',id)
  rec(id+'/self-equivalence',p.evaluate('(id)=>F807_TEST.equivalent(F807_TEST.presets[id].tokens,F807_TEST.presets[id].tokens)',id))
  altered=tokens.copy();ix=altered.index('+') if '+' in altered else 0;altered[ix]='−' if altered[ix]=='+' else '+'
  rec(id+'/mutated-rejection',not p.evaluate('([id,alt])=>F807_TEST.equivalent(alt,F807_TEST.presets[id].tokens)',[id,altered]))
  for i in range(200):
   vals={k:random.randrange(-12,13) for k in (['n'] if id=='Y7-028' else ['t'] if id=='Y7-034-T' else ['l','w'] if id=='Y7-034-P' else ['d'] if id=='Y9-007-D' else ['n','x'])}
   expect={'Y7-028':lambda v:5*v['n']+3,'Y7-034-T':lambda v:7*v['t']+2,'Y7-034-P':lambda v:2*(v['l']+v['w']),'Y9-007-D':lambda v:2*(3*v['d']+5),'Y9-007-G':lambda v:v['n']*(v['x']+3)+4}[id](vals)
   got=p.evaluate('([id,vals])=>F807_TEST.calculate(F807_TEST.presets[id],vals)',[id,vals]);rec(id+'/sample-'+str(i),got==expect,(vals,got,expect))
 for id,alt in {'Y7-034-P':['2','l','+','2','w'],'Y9-007-D':['6','d','+','10'],'Y9-007-G':['n','x','+','3','n','+','4']}.items():rec(id+'/expanded-is-equivalent',p.evaluate('([id,t])=>F807_TEST.equivalent(t,F807_TEST.presets[id].tokens)',[id,alt]))
 rec('reject-unpaired-brackets',not p.evaluate("()=>F807_TEST.equivalent(['2','(','n','+','3'],['2','n','+','6'])"))
 p.close();b.close()
res={'component':'F8-07','passed':sum(x['passed'] for x in checks),'total':len(checks),'failed':[x for x in checks if not x['passed']],'checks':checks};(R/'tests/F8-07-math-results.json').write_text(json.dumps(res,indent=2));print('Math:',res['passed'],'/',res['total'],res['failed'][:3])
