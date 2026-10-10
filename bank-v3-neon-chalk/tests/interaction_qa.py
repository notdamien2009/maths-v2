from pathlib import Path
from playwright.sync_api import sync_playwright
import json
R=Path(__file__).resolve().parents[1]
source=(R/'F3/F3-05-prime-sieve-and-factor-tree.html').read_text()
results=[]
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in [380,1280]:
  page=b.new_page(viewport={'width':width,'height':1000},reduced_motion='reduce');errors=[];page.on('pageerror',lambda ex:errors.append(str(ex)))
  page.set_content(source,wait_until='domcontentloaded')
  math=page.evaluate('''() => {const m=F305_MATH;let ok=[];for(let n=2;n<=144;n++){const s=m.normalFactorisation(n);ok.push(s.every(m.prime)&&s.reduce((a,b)=>a*b,1)===n)}const st=m.sieveState(100,[2,3,5,7]);return {treeValues:ok.length,treeFailures:ok.filter(x=>!x).length,primes100:st.left.length,primesCorrect:st.left.join(',')===m.primeList(100).join(','),onePrime:m.prime(1),prime97:m.prime(97),prime49:m.prime(49)} }''')
  page.locator('#F3-05 button').filter(has_text='Challenge').first.click();page.wait_for_timeout(50)
  # sieve four sweeps
  for v in (2,3,5,7):
   page.get_by_label('Prime to sweep').select_option(str(v));page.get_by_role('button',name='Cross multiples').click();page.wait_for_timeout(70)
  page.get_by_label('Identify prime').select_option('97');page.get_by_role('button',name='Check prime').click()
  proof2=page.get_by_text('Proof 2 / 3').count()
  def node_split(div):
   opts=page.get_by_label('Composite leaf').locator('option').all_text_contents();
   # choose first composite that divides by divisor and > divisor
   for txt in opts:
    n=int(txt.replace('Split ','').strip())
    if n%div==0 and n>div:
     page.get_by_label('Composite leaf').select_option(label=txt);page.get_by_label('Divisor').select_option(str(div));page.get_by_role('button',name='Split',exact=True).click();page.wait_for_timeout(80);return True
   return False
  seq60=[6,2,2]
  for d in seq60:
   if not node_split(d):print('FAILED 60',width,d)
  proof3=page.get_by_text('Proof 3 / 3').count()
  seq84=[7,3,2]
  for d in seq84:
   if not node_split(d):print('FAILED 84',width,d)
  complete=page.get_by_text('Complete · three mathematical prime proofs').count()
  stage=page.locator('#F3-05 .nova-stage')
  stage.screenshot(path=str(R/'shots'/f'F3-05-{width}-challenge-complete.png'))
  results.append(dict(width=width,math=math,proof2=proof2,proof3=proof3,challengeComplete=complete,errors=errors,dragActive=page.evaluate('Boolean(NOVA.ui._drag)')))
  page.close()
 b.close()
(R/'tests'/'INTERACTION-RESULTS.json').write_text(json.dumps(results,indent=2));print(json.dumps(results,indent=2))
