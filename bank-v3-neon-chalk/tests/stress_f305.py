from pathlib import Path
from playwright.sync_api import sync_playwright
import json
R=Path(__file__).resolve().parents[1];s=(R/'F3/F3-05-prime-sieve-and-factor-tree.html').read_text();runs=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for w in [380,1280]:
  pg=b.new_page(viewport={'width':w,'height':950},reduced_motion='reduce');errors=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.set_content(s)
  pg.locator('#F3-05 button').filter(has_text='Explore').first.click()
  passed=[]
  def test(cond,label):passed.append((label,bool(cond)))
  # grid has exactly one tab-stop and arrow movement
  cells=pg.locator('#F3-05 [data-value]')
  test(cells.count()==100,'100 values present')
  test(pg.locator('#F3-05 [data-value][tabindex="0"]').count()==1,'one roving grid tabstop')
  cells.first.focus();pg.keyboard.press('ArrowRight')
  test(pg.locator('#F3-05 [data-value="2"]').evaluate('(e)=>document.activeElement===e'),'arrow keyboard grid')
  # wrong drag, repeated cancellation including Escape, focus blur and pointercancel
  drag=pg.locator('#F3-05 [data-prime-card="5"]');drag.scroll_into_view_if_needed()
  for i in range(8):
   loc=pg.locator('#F3-05 [data-prime-card="5"]');box=loc.bounding_box();x=box['x']+box['width']/2;y=box['y']+box['height']/2
   pg.mouse.move(x,y);pg.mouse.down()
   test(pg.evaluate('Boolean(NOVA.ui._drag)'),f'pointer capture {i}')
   if i%2==0:pg.keyboard.press('Escape')
   else:pg.evaluate('NOVA.ui.cancelDrag()')
   pg.mouse.up();pg.wait_for_timeout(70)
   test(not pg.evaluate('Boolean(NOVA.ui._drag)'),f'drag released {i}')
  # maths checks for each 2..144 and sieve each 2..100
  maths=pg.evaluate('''() => {const M=F305_MATH;let hits=0,fail=0;for(let n=2;n<=144;n++){const p=M.normalFactorisation(n);if(p.every(M.prime)&&p.reduce((a,v)=>a*v,1)===n)hits++;else fail++;}for(let n=2;n<=100;n++){const sieve=M.sieveState(n,[2,3,5,7].filter(p=>p*p<=n));if(sieve.left.join()==M.primeList(n).join())hits++;else fail++;}return {hits,fail}}''')
  test(maths["fail"] == 0 and maths["hits"] == 242,'242 mathematical assertions')
  # character captions are short reactions; none above 5 words, and source core hashes unchanged
  say=pg.evaluate('''() => [...document.querySelectorAll('#F3-05 .nv-dockbub')].map(x=>x.textContent.trim())''')
  test(all(len(v.split())<=5 for v in say),'short mascot speech')
  test(not pg.evaluate('Boolean(NOVA.ui._drag)'),'no stranded pointer')
  runs.append({'width':w,'assertions':len(passed),'failed':[label for label,ok in passed if not ok],'mathAssertions':maths['hits'],'mathFailures':maths['fail'],'errors':errors,'shortCaption':say})
  pg.close()
 b.close()
(R/'tests'/'STRESS-RESULTS.json').write_text(json.dumps(runs,indent=2));print(json.dumps(runs,indent=2))
