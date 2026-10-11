import json,random
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];HTML=(R/'F8/F8-08-equivalence-checker.html').read_text();checks=[]
def test(n,ok,d=''):
 checks.append({'test':n,'pass':bool(ok),'detail':str(d)[:130]})
 if not ok:print('FAIL',n,d)
with sync_playwright() as P:
 b=P.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=b.new_page();page.set_content(HTML,wait_until='load');truth={'Y7-029-A':True,'Y7-029-B':False,'Y9-006-A':True,'Y9-006-B':True,'Y9-006-C':False}
 for id,exp in truth.items():
  p=page.evaluate('(id)=>F808_TEST.presets[id]',id)
  test(f'{id}/symbolic-truth',page.evaluate('(id)=>F808_TEST.classify(F808_TEST.presets[id])=== "equivalent"',id)==exp)
  # independently authored Python equations for every relevant x over wide range
  for x in range(-30,31):
   a,bb=page.evaluate('([id,x])=>F808_TEST.evaluate(F808_TEST.presets[id],x)',[id,x]);
   py={'Y7-029-A':(3*x+2*x,5*x),'Y7-029-B':(4*x+3,7*x),'Y9-006-A':(2*(x+3),2*x+6),'Y9-006-B':((x+2)*(x+3),x*x+5*x+6),'Y9-006-C':(x*x,x)}[id]
   test(f'{id}/x{x}/values', (a,bb)==py,(a,bb,py))
  # constant/multiplication/negative-sign mutations must be correct
  st=page.evaluate('''(id)=>{let p=F808_TEST.presets[id],s=F808_TEST.makeState();F808_TEST.insert(p,s,-2,0);F808_TEST.insert(p,s,0,1);F808_TEST.insert(p,s,2,2);F808_TEST.choose(p,s,p.truth);let ok=F808_TEST.check(p,s);return {ok,values:s.values}}''',id)
  test(f'{id}/correct-check',st['ok'],st)
  wrong=page.evaluate('''(id)=>{let p=F808_TEST.presets[id],s=F808_TEST.makeState();[-2,0,2].forEach((v,i)=>F808_TEST.insert(p,s,v,i));F808_TEST.choose(p,s,p.truth==='equivalent'?'different':'equivalent');return F808_TEST.check(p,s)}''',id)
  test(f'{id}/reject-opposite',wrong is False)
 # accidental two matches at zero and one do not prove x²=x; need a counterexample
 counter=page.evaluate('''()=>{let p=F808_TEST.presets['Y9-006-C'],s=F808_TEST.makeState();[0,1].forEach((v,i)=>F808_TEST.insert(p,s,v,i));F808_TEST.insert(p,s,2,2);F808_TEST.choose(p,s,'different');return {ok:F808_TEST.check(p,s),values:s.values}}''')
 test('counterexample/0-1-2',counter['ok'] and counter['values']==[0,1,2],counter)
 # ensure parser rejects malformed strings and has correct integer sign
 for expr,expect in [('2(x + 3)',{0:6,1:2}),('(x + 2)(x + 3)',{0:6,1:5,2:1}),('x²',{2:1}),('4x + 3',{0:3,1:4})]:
  actual=page.evaluate('(x)=>F808_TEST.polynomial(x)',expr);test(f'parser/{expr}',{int(k):v for k,v in actual.items()}==expect,actual)
 page.close();b.close()
result={'component':'F8-08','passed':sum(x['pass'] for x in checks),'total':len(checks),'failed':[x for x in checks if not x['pass']],'checks':checks};(R/'tests/F8-08-math-results.json').write_text(json.dumps(result,indent=2));print('MATH',result['passed'],'/',result['total'])
