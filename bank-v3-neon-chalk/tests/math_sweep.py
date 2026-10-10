import json,math
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1]
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=b.new_page()
 page.set_content((R/'F3/F3-11-root-finder.html').read_text(),wait_until='domcontentloaded')
 result=page.evaluate('''()=>{let M=F311_MATH,count=0,fail=[];function ok(c,msg){count++;if(!c)fail.push(msg)}
 for(let n=2;n<=144;n++){let s={kind:'square',target:n},r=Math.sqrt(n),d=M.domain(s),b=M.bounds(s);ok(Math.abs(M.trueRoot(s)-r)<1e-10,'sqrt '+n);ok(b.low<=r&&r<=b.high,'bounds sqrt '+n);ok(d.lo<=r&&r<=d.hi,'domain sqrt '+n);ok(Math.abs(M.compared(s,r)-n)<1e-8,'comparison sqrt '+n);ok(Math.abs(M.quantise(s,r)-r)<=.0500000001,'quantise sqrt '+n)}
 for(let n=8;n<=216;n++){let s={kind:'cube',target:n},r=Math.cbrt(n),d=M.domain(s),b=M.bounds(s);ok(Math.abs(M.trueRoot(s)-r)<1e-10,'cbrt '+n);ok(b.low<=r&&r<=b.high,'bounds cbrt '+n);ok(d.lo<=r&&r<=d.hi,'domain cbrt '+n);ok(Math.abs(M.compared(s,r)-n)<1e-8,'comparison cbrt '+n);ok(Math.abs(M.quantise(s,r)-r)<=.0500000001,'quantise cbrt '+n)}
 for(let k=2;k<=12;k++){let s={kind:'square',target:k*k,tolerance:.049};ok(M.misconception(s,k)==='','exact square '+k);ok(M.misconception(s,k+1)!=='','wrong square '+k)}
 for(let k=2;k<=6;k++){let s={kind:'cube',target:k*k*k,tolerance:.049};ok(M.misconception(s,k)==='','exact cube '+k);ok(M.misconception(s,k+1)!=='','wrong cube '+k)}
 return {assertions:count,failed:fail.length,failures:fail.slice(0,15)};}''')
 b.close()
(R/'tests/MATH-RESULTS.json').write_text(json.dumps(result,indent=2));print(result)
