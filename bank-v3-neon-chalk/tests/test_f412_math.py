#!/usr/bin/env python3
"""Mathematical acceptance, including the decimal preset and correct compound units."""
import json,sys
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];tests=[]
def ck(n,x):
 tests.append({'test':n,'passed':bool(x)})
 if not x:print('FAIL',n)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage']);page=b.new_page()
 page.set_content((R/'F4/F4-12-rates-tape-diagram.html').read_text(),wait_until='load')
 cases=page.evaluate('''() => Object.entries({...F412_CONFIG.presets,...Object.fromEntries(F412_CONFIG.challenge.map((x,i)=>['challenge-'+i,x]))}).map(([k,v])=>{
 let ans=F412_MATH.math(v).answer;
 return {key:k,kind:v.kind,rate:v.rate,units:v.units,total:v.total,answer:ans,roundTrip:F412_MATH.pretty(ans),correct:F412_MATH.validate(v,String(ans),true,v.units),wrong:F412_MATH.validate(v,String(ans+1),true,v.units),noChip:F412_MATH.validate(v,String(ans),false,v.units),wrongDivider:F412_MATH.validate(v,String(ans),true,v.units===6?5:v.units+1)};
 })''')
 for item in cases:
  k=item['key'];ck(k+' positive',item['answer']>0)
  ck(k+' exact rate x time',abs(item['rate']*item['units']-item['total'])<1e-8)
  ck(k+' correct proof',item['correct']['ok'] and item['correct']['kind']=='proved')
  ck(k+' wrong math rejected',not item['wrong']['ok'] and item['wrong']['kind']=='math')
  ck(k+' omitted chip rejected',not item['noChip']['ok'] and item['noChip']['kind']=='rate')
  ck(k+' mismatched segments rejected',not item['wrongDivider']['ok'] and item['wrongDivider']['kind']=='divider')
 b.close()
out={'passed':sum(x['passed'] for x in tests),'failed':sum(not x['passed'] for x in tests),'results':tests};(R/'tests/F4-12-MATH-RESULTS.json').write_text(json.dumps(out,indent=2));print('MATH',out['passed'],'pass',out['failed'],'fail')
if out['failed']:sys.exit(1)
