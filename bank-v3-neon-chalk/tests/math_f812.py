"""Independent tests of all Year 8/9 quadratic presets and Challenge mathematics."""
import json,math
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 page=b.new_page(reduced_motion='reduce')
 page.set_content((R/'F8/F8-12-quadratic-solve-routes.html').read_text(),wait_until='commit')
 report=page.evaluate('''() => {
  const t=F812_TEST,checks=[];const near=(x,y)=>Math.abs(x-y)<1e-8;
  function add(n,v){checks.push({name:n,pass:!!v})}
  for(const [id,p] of Object.entries(t.presets)) {
   const d=t.solution(p),[r1,r2]=d.roots;
   add(id+' discriminant',d.discriminant===p.b*p.b-4*p.a*p.c);
   add(id+' two ordered roots',r1<r2);
   add(id+' Viete root sum',near(r1+r2,-p.b/p.a));
   add(id+' Viete root product',near(r1*r2,p.c/p.a));
   add(id+' root one gives zero',near(t.fn(p,r1),0));
   add(id+' root two gives zero',near(t.fn(p,r2),0));
   add(id+' vertex y',near(t.fn(p,d.vertex.x),d.vertex.y));
   for(let i=-50;i<=50;i++) {
    const x=i/10, fact=p.a*(x-r1)*(x-r2);
    add(id+' factor identity at '+x,near(t.fn(p,x),fact));
   }
   let s=t.state();add(id+' cannot pass blank',!t.verify(p,s,r1,r2));
   s=t.state();t.choose(s,'graph');t.put(s,0,r1);t.put(s,1,r2);
   add(id+' rejects only one input',!t.verify(p,s,r1,NaN));
   add(id+' rejects wrong root value',!t.verify(p,s,r1,r2+1));
   add(id+' valid reversed numeric answers',t.verify(p,s,r2,r1));
   add(id+' cannot edit completed',!t.put(s,0,0));
   s=t.state();t.choose(s,'factor');t.put(s,0,r2);t.put(s,1,r1);
   add(id+' valid swapped ring order',t.verify(p,s,r1,r2));
   s=t.state();t.choose(s,'formula');t.put(s,0,d.vertex.x);t.put(s,1,r2);
   add(id+' rejects vertex as root',!t.verify(p,s,r1,r2));
   s=t.state();t.choose(s,'formula');t.put(s,0,r1);t.put(s,1,r2);
   add(id+' accepted formula route',t.verify(p,s,r1,r2));
   s=t.state();t.put(s,0,r1);t.choose(s,'graph');t.undo(s);
   add(id+' undo route',s.route===null);
  }
  return {passed:checks.filter(x=>x.pass).length,total:checks.length,failed:checks.filter(x=>!x.pass),checks}
 }''')
 (R/'tests/F8-12-math-results.json').write_text(json.dumps(report,indent=2))
 print('MATHEMATICAL',report['passed'],'/',report['total'],'FAIL',report['failed'][:8],flush=True)
 b.close()
 assert not report['failed']
