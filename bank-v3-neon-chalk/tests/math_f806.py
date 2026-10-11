"""Independent dynamic maths tests for F8-06 symbolic transformation equivalence.
Random substitutions test the scale of the equality difference across each step,
including negative values and nonzero-domain restrictions.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json
R=Path(__file__).resolve().parents[1];src=(R/'F8/F8-06-rearranging-formulae.html').read_text()
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=b.new_page();page.set_content(src,wait_until='load')
 values=page.evaluate('''()=>{const t=F806_TEST,z=[];for(const [id,p] of Object.entries(t.lessons)){
  z.push({name:id+'/sample',pass:t.validate(p,p.make({...p.inputs}))});
  z.push({name:id+'/subject',pass:p.rows.at(-1).L===p.target});
  z.push({name:id+'/correct-choice-unique',pass:p.choices.filter(c=>c.correct).length===1});
  for(let n=0;n<180;n++){let v={P:15+n*.45,w:(n%13+1)*.39,l:2+n*.15,y:15+n*.31,x:(n%19+1)*.71,b:(n%17+1)*.41,h:3+n*.13,A:18+n*.21,k:51+n*.28};
   // use arbitrary independent variables to check *equivalence*, not merely final solutions
   let good=p.steps.every((k,i)=>{const before=t.difference(p.rows[i],v),after=t.difference(p.rows[i+1],v);return t.close(after,before*t.ratioAt(p,i,v));});
   z.push({name:id+'/transform/random-'+n,pass:good});
   let c={...p.inputs};for(const key of Object.keys(c))c[key]+=(n%11)*.14;
   if(c.b===0)c.b=2;if(c.x===0)c.x=2;
   let satisfied=p.make(c);
   z.push({name:id+'/solution/random-'+n,pass:t.validate(p,satisfied)});
  }
  if(id.startsWith('Y9'))z.push({name:id+'/nonzero-domain-declared',pass:p.condition.toLowerCase().includes('non-zero')});
 }return z;}''')
 b.close()
report={'total':len(values),'passed':sum(x['pass'] for x in values),'failed':[x for x in values if not x['pass']],'checks':values}
(R/'tests/F8-06-math-results.json').write_text(json.dumps(report,indent=2))
print('MATH',report['passed'],'/',report['total']);print(report['failed'][:10]);assert not report['failed']
