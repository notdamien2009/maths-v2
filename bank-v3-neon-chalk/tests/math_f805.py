#!/usr/bin/env python3
"""Independent browser-computed affine invariant checks across all F8-05 presets."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json
R=Path(__file__).resolve().parents[1]
html=(R/'F8/F8-05-both-sides-equation-solver.html').read_text(encoding='utf8')
checks=[]
def record(name,p,detail=''):
 checks.append({'check':name,'passed':bool(p),'detail':str(detail)[:210]})
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 p=b.new_page();p.set_content(html,wait_until='load')
 data=p.evaluate('''()=>{const t=window.F805_TEST,result=[];for(const [id,z] of Object.entries(t.lessons)){for(const challenge of [false,true]){const a=challenge?z.challenge:z;result.push({id,challenge,valid:t.validateTrack(z,challenge),operations:a.steps.length,solution:a.solution,rows:a.rows.length});for(let i=0;i<a.rows.length;i++){const row=a.rows[i];for(let x=-50;x<=50;x+=5){const v=t.equationValue(row,x);result.push({id,challenge,i,x,lh:v[0],rh:v[1],solution:a.solution,res:t.resultFor(row)});}}for(let i=0;i<a.steps.length;i++){const key=a.steps[i],a0=t.nextState(a.rows[i],key),a1=a.rows[i+1];result.push({id,challenge,transform:i,match:t.sameEquation(a0,a1),operation:key});}}}return result;}''')
 for z in data:
  id=z['id'];suffix='challenge' if z['challenge'] else 'guided';stem=id+'/'+suffix
  if 'valid' in z:record(stem+'/track-valid',z['valid'],f"{z['operations']} operations, {z['rows']} lines")
  elif 'transform' in z:record(stem+f"/operation-{z['transform']}",z['match'],z['operation'])
  else:
   # A linear equation's solution must be invariant across every step; the RHS/LHS are
   # equal precisely at the solution (all given equations have a unique root).
   record(stem+f"/row{z['i']}-x{z['x']}",abs(z['res']-z['solution'])<1e-8 and (abs(z['lh']-z['rh'])<1e-8)==(z['x']==z['solution']),f"root {z['res']}; lhs {z['lh']}; rhs {z['rh']}")
 p.close();b.close()
report={'total':len(checks),'passed':sum(z['passed'] for z in checks),'failed':[z for z in checks if not z['passed']],'checks':checks}
(R/'tests/F8-05-math-results.json').write_text(json.dumps(report,indent=2))
print('MATH',report['passed'],'/',report['total'],'failed',len(report['failed']))
for z in report['failed'][:12]:print(z)
assert not report['failed']
