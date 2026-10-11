from pathlib import Path
from playwright.sync_api import sync_playwright
import json, math
R=Path(__file__).resolve().parent.parent
r={'assertions':0,'failures':[]}
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 pg=b.new_page(reduced_motion='reduce')
 pg.set_content((R/'F3/F3-15-surd-and-exact-value-builder.html').read_text())
 results=pg.evaluate('''()=>{const M=window.F315_MATH;let checks=0,fail=[];
 for(let n=2;n<=200;n++){
 const s=M.surd(n);
 const assert=(ok,msg)=>{checks++;if(!ok)fail.push([n,msg]);};
 assert(s.a*s.a*s.b===n,'factor conservation');
 assert(M.squareFree(s.b),'simplest radicand');
 assert(s.square===s.a*s.a,'square base');
 assert(M.squareChoices(n).includes(s.square),'correct square-choice present');
 assert(M.errorFactor(n,s.square)==='', 'correct square accepted');
 assert(M.errorResult(n,{a:s.a,b:s.b,src:s.src})==='', 'correct simplest form accepted');
 assert(M.proposed(n).length===3,'three answer cards');
 for(const c of M.proposed(n))assert(Boolean(M.errorResult(n,c))===(c.a!==s.a||c.b!==s.b),'incorrect exact card rejected');
 for(const q of [1,4,9,16,25,36,49,64,81,100,121,144]) if(q!==s.square){assert(M.errorFactor(n,q)!=='','other square rejected');}
 }
 return {assertions:checks,failures:fail.slice(0,25),failureCount:fail.length};}''')
 r.update(results);b.close()
(R/'tests/MATH-RESULTS.json').write_text(json.dumps(r,indent=2));print(json.dumps(r,indent=2))
