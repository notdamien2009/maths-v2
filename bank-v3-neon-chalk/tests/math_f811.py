from pathlib import Path
import json,random
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];out=[]
def chk(ok,case):out.append({'case':case,'pass':bool(ok)})
with sync_playwright() as P:
 b=P.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 page=b.new_page(reduced_motion='reduce');page.set_content((R/'F8/F8-11-inequality-solver.html').read_text(),wait_until='commit')
 exp={'Y8-017-A':('single',4,'left',False), 'Y8-017-B':('single',4,'left',True), 'Y8-017-C':('single',3,'left',True), 'Y8-018-A':('single',-3,'left',False), 'Y8-018-B':('compound',-2,3,True,False), 'Y8-018-C':('compound',1,4,False,True)}
 for key,item in exp.items():
  p=page.evaluate('(k)=>F811_TEST.presets[k]',key)
  v=page.evaluate('(k)=>F811_TEST.solve(F811_TEST.presets[k])',key)
  if item[0]=='single':chk(v['kind']=='single' and v['bound']==item[1] and v['dir']==item[2] and v['closed']==item[3],key+'/exact-bound')
  else:chk(v['kind']=='compound' and (v['low'],v['high'],v['lowClosed'],v['highClosed'])==tuple(item[1:]),key+'/compound-exact')
  for x in [-8,-7,-4,-3,-2,-1,0,1,2,3,4,5,7,8]:
   observed=page.evaluate('([k,x])=>F811_TEST.accepts(F811_TEST.presets[k],x)',[key,x]);actual=p['a']*x+p['b'];
   if p['kind']=='single':expected={'<':lambda a,b:a<b,'>':lambda a,b:a>b,'≤':lambda a,b:a<=b,'≥':lambda a,b:a>=b}[p['op']](actual,p['c'])
   else:expected=(actual>=p['low'] if p['lowClosed'] else actual>p['low']) and (actual<=p['high'] if p['highClosed'] else actual<p['high'])
   chk(expected==observed,key+f'/sample-{x}')
 # Exhaustively test all integer affine inequalities (including sign flip) against their solved ranges.
 for a in range(-7,8):
  if a==0:continue
  for c in range(-8,9,2):
   for offset in [-6,0,7]:
    for op in ['<','>','≤','≥']:
     p={'kind':'single','a':a,'b':offset,'op':op,'c':c}
     result=page.evaluate('(p)=>F811_TEST.solve(p)',p)
     bound=(c-offset)/a
     op2=op if a>0 else {'<':'>','>':'<','≤':'≥','≥':'≤'}[op]
     correctDir='left' if op2 in ['<','≤'] else 'right'
     correctClosed=op2 in ['≤','≥']
     chk(abs(result['bound']-bound)<1e-9 and result['dir']==correctDir and result['closed']==correctClosed,f'generated-a{a}-c{c}-b{offset}-op{op}')
 # Negative-compound coefficients change which endpoint is left/right.
 for a in [-4,-2,-1,1,2,4]:
  for offset in [-5,0,6]:
   for lo,hi in [(-5,5),(-1,9),(0,8)]:
    for lc,hc in [(True,False),(False,True),(True,True),(False,False)]:
     p={'kind':'compound','a':a,'b':offset,'low':lo,'high':hi,'lowClosed':lc,'highClosed':hc}
     v=page.evaluate('(p)=>F811_TEST.solve(p)',p)
     left=min((lo-offset)/a,(hi-offset)/a);right=max((lo-offset)/a,(hi-offset)/a)
     expLc,expHc=(lc,hc) if a>0 else (hc,lc)
     chk(abs(v['low']-left)<1e-9 and abs(v['high']-right)<1e-9 and v['lowClosed']==expLc and v['highClosed']==expHc,f'compound-a{a}-b{offset}-low{lo}-up{hi}-closed{lc}{hc}')
 page.close();b.close()
rep={'total':len(out),'passed':sum(z['pass'] for z in out),'failed':[z for z in out if not z['pass']],'checks':out};(R/'tests/F8-11-math-results.json').write_text(json.dumps(rep,indent=2));print('MATH',rep['passed'],'/',rep['total'],'failed',rep['failed'][:5]);assert not rep['failed']
