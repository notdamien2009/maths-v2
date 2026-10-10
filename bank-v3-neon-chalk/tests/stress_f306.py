from playwright.sync_api import sync_playwright
from pathlib import Path
import json
R=Path(__file__).resolve().parents[1]
HTML=(R/'F3/F3-06-prime-factor-ladder.html').read_text()
results=[]
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in [380,1280]:
  page=browser.new_page(viewport={'width':width,'height':980},reduced_motion='reduce')
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(HTML,wait_until='domcontentloaded')
  out=page.evaluate('''() => {
   const M=window.F306_MATH,fail=[],checks=[];
   const a=(test,name)=>{checks.push(name);if(!test)fail.push(name);};
   for(let n=2;n<=420;n++){
    const p=M.factorise(n);a(p.every(M.prime),'primes:'+n);
    a(p.reduce((a,b)=>a*b,1)===n,'product:'+n);
    a(M.verifyLadder(n,p),'verify:'+n);
    a(p.every((v,i)=>v===M.smallestPrime(n/p.slice(0,i).reduce((a,b)=>a*b,1))),'smallest:'+n);
    a(M.quotient(n,p)===1,'ends-at-1:'+n);
    if(p.length)a(!M.verifyLadder(n,p.slice(0,-1)),'incomplete:'+n);
   }
   a(!M.validNext(60,[],4).ok,'reject composite');
   a(!M.validNext(60,[],7).ok,'reject nondivisor');
   a(!M.validNext(60,[],3).ok,'reject non-smallest prime');
   a(M.validNext(60,[],2).ok,'accept two');
   a(!M.validNext(60,[2,2,3,5],2).ok,'reject extra rung');
   a(M.indexPlain([2,2,3,5])==='2^2 × 3 × 5','index sixty');
   a(M.indexPlain([2,2,3,7])==='2^2 × 3 × 7','index eighty-four');
   return {assertions:checks.length,failed:fail,passed:checks.length-fail.length};
  }''')
  results.append({'width':width,'kind':'math','result':out,'errors':errors[:]})
  page.locator('#F3-06 button').filter(has_text='Challenge').first.click()
  page.wait_for_timeout(130)
  for round_i,n in enumerate([60,84,180]):
   factors=page.evaluate('(n)=>F306_MATH.factorise(n)',n)
   for divisor in factors:
    control=page.locator('#F3-06 select[aria-label="Choose a prime for the next rung"]')
    control.select_option(str(divisor))
    page.locator('#F3-06 button').filter(has_text='Divide').last.click()
    page.wait_for_timeout(85)
   got=page.locator('#F3-06 [data-rung]').count()
   complete='Check index form' in page.locator('#F3-06').inner_text()
   exp=page.evaluate('(x)=>F306_MATH.exponents(x)',factors)
   for prime,k in exp.items():
    page.locator(f'#F3-06 input[aria-label="Power of {prime}"]').fill(str(k))
    page.locator(f'#F3-06 input[aria-label="Power of {prime}"]').dispatch_event('change')
   page.locator('#F3-06 button').filter(has_text='Check index form').last.click()
   results.append({'width':width,'kind':'challenge-round','round':round_i+1,'n':n,'factors':factors,'rungs':got,'indexFields':len(exp),'completeBefore':complete,'errors':errors[:]})
   page.wait_for_timeout(110)
  results.append({'width':width,'kind':'challenge-complete','pass':'three ladders and three index-form proofs' in page.locator('#F3-06').inner_text(),'errors':errors[:]})
  page.screenshot(path=str(R/'shots'/f'F3-06-{width}-challenge-complete.png'))
  page.close()
 browser.close()
(R/'tests/STRESS-RESULTS.json').write_text(json.dumps(results,indent=2))
print(json.dumps(results,indent=2))
assert all(not row.get('errors') for row in results)
assert all(not row['result']['failed'] for row in results if row['kind']=='math')
assert all(row['completeBefore'] and row['rungs']==len(row['factors']) for row in results if row['kind']=='challenge-round')
assert all(row['pass'] for row in results if row['kind']=='challenge-complete')
