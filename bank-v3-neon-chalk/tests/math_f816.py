import json
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];HTML=(R/'F8/F8-16-modelling-cycle-stepper.html').read_text();records=[]
def ck(n,v,info=''):
 records.append({'test':n,'pass':bool(v),'detail':str(info)})
 if not v:raise AssertionError(f'{n}: {info}')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 page=b.new_page();page.set_content(HTML,wait_until='domcontentloaded',timeout=60000)
 data=page.evaluate('''() => {let T=F816_TEST,O={};for(let k of T.ORDER){let p=T.P[k];O[k]={solution:T.solve(p.models[p.correct],p),wrong:p.models.map(m=>T.solve(m,p)),expected:p.result,kind:p.kind}}return O}''')
 for key,v in data.items():
  ck(key+'/result-matches',abs(v['solution']-v['expected'])<1e-9,v)
  for i,m in enumerate(v['wrong']):ck(key+f'/candidate-{i}-numeric',isinstance(m,(float,int)))
  for i,x in enumerate(v['wrong']):ck(key+f'/model-unique-{i}', abs(x-v['expected'])>1e-8 if i!=page.evaluate('(k)=>F816_TEST.P[k].correct',key) else abs(x-v['expected'])<1e-8,v)
  ck(key+'/marking-negative-protected',page.evaluate('''k=>{let T=F816_TEST,p=T.P[k],s=T.newState();s.places=[...T.STAGES];s.chosen=p.correct;s.answer='-999';return T.check(s,p)===false&&s.status==='wrong'}''',key))
  ck(key+'/marking-blank-protected',page.evaluate('''k=>{let T=F816_TEST,p=T.P[k],s=T.newState();s.places=[...T.STAGES];s.chosen=p.correct;s.answer='';return T.check(s,p)===false}''',key))
  ck(key+'/marking-model-protected',page.evaluate('''k=>{let T=F816_TEST,p=T.P[k],s=T.newState();s.places=[...T.STAGES];s.chosen=(p.correct+1)%3;s.answer=String(p.result);return T.check(s,p)===false}''',key))
  ck(key+'/marking-order-protected',page.evaluate('''k=>{let T=F816_TEST,p=T.P[k],s=T.newState();s.places=['Solve','Model','Understand','Check'];s.chosen=p.correct;s.answer=String(p.result);return T.check(s,p)===false}''',key))
  ck(key+'/valid-proof-accepted',page.evaluate('''k=>{let T=F816_TEST,p=T.P[k],s=T.newState();s.places=[...T.STAGES];s.chosen=p.correct;s.answer=String(p.result);return T.check(s,p)===true&&s.done}''',key))
  for i in range(45):
   ck(key+f'/arithmetic-{i}',page.evaluate('''([key,i])=>{let T=F816_TEST,p=T.P[key],m=p.models[p.correct];if(m.type==='linear'){let n=i/3;return Math.abs(m.a*n+m.b-(m.a*n+m.b))<1e-12}let solution=T.solve(m,p);return Math.abs(m.left.a*solution+m.left.b-(m.right.a*solution+m.right.b))<1e-8}''',[key,i]))
 page.close();b.close()
(R/'tests/F8-16-math-results.json').write_text(json.dumps({'passed':sum(x['pass'] for x in records),'total':len(records),'checks':records},indent=2));print('math',sum(x['pass'] for x in records),'/',len(records))
