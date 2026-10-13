"""Independent algebraic identities, original exclusions, factor-pair integrity, false-cancellation traps."""
import json
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];H=(R/'F8/F8-14-algebraic-fraction-simplifier.html').read_text();checks=[]
def rec(n,ok,detail=''):
 checks.append({'test':n,'pass':bool(ok),'detail':str(detail)[:130]})
 if not ok:raise AssertionError(f'{n}: {detail}')
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage']);pg=b.new_page();pg.goto('about:blank');pg.set_content(H,wait_until='domcontentloaded',timeout=60000)
 keys=pg.evaluate('F814_TEST.ORDER');rec('six presets',len(keys)==6)
 for key in keys:
  data=pg.evaluate('''(key)=>{const t=F814_TEST,p=t.P[key],pairs=t.pairs(p),s=t.fresh();let values=[];for(let x=-9;x<=9;x++){let f=t.proof(p,x);values.push({x,valid:f===null?null:f.valid});}return {p,pairs,values}}''',key)
  v=data['values'];rec(key+'/domain-only-excluded',len([x for x in v if x['valid'] is None])==1 and next(x['x'] for x in v if x['valid'] is None)==data['p']['exclude'])
  for d in v:rec(key+f"/numeric-{d['x']}",d['valid'] is None and d['x']==data['p']['exclude'] or d['valid'] is True)
  resMulti=pg.evaluate('''(key)=>{let p=F814_TEST.P[key],ok=true,count=0;for(let y=-5;y<=5;y++)for(let x=-5;x<=5;x++){const q=F814_TEST.proof(p,x,y);if(q!==null){ok=ok&&q.valid;count++}}return {ok,count}}''',key)
  rec(key+'/variable-y-identity',resMulti['ok'],resMulti)
  rec(key+'/valid-pairs',all(data['p']['n'][x['n']]==data['p']['d'][x['d']] for x in data['pairs']))
  rec(key+'/sufficient-pairs',len(data['pairs'])>=1)
  res=pg.evaluate('''(key)=>{const t=F814_TEST,p=t.P[key],s=t.fresh();const early=t.verdict(p,s,p.answer,String(p.exclude));const factor=t.reveal(s);const wrong=t.verdict(p,s,p.answer,String(p.exclude));for(let i=0;i<t.pairs(p).length;i++)t.cancel(s,p,i);const badDomain=t.verdict(p,s,p.answer,String(p.exclude+1));const wrongExpr=t.verdict(p,s,'x+999',String(p.exclude));const win=t.verdict(p,s,p.answer,String(p.exclude));return {early,factor,wrong,badDomain,wrongExpr,win,done:s.solved}}''',key)
  for k,expect in [('early',False),('factor',True),('wrong',False),('badDomain',False),('wrongExpr',False),('win',True),('done',True)]:rec(key+'/'+k,res[k] is expect,res)
 print('math',sum(x['pass'] for x in checks),'/',len(checks))
 b.close()
(R/'tests/F8-14-math-results.json').write_text(json.dumps({'passed':sum(x['pass'] for x in checks),'total':len(checks),'checks':checks},indent=2))
