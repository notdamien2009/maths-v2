from pathlib import Path
from playwright.sync_api import sync_playwright
import json, traceback, math
r=Path(__file__).resolve().parent
html=(r/'F9-13-fractal-generators.html').read_text()
shots=r/'f913-shots';shots.mkdir(exist_ok=True)
checks=[]
def ck(name,ok,details=''):
 ok=bool(ok);checks.append({'name':name,'pass':ok,'detail':str(details)[:350]});print(('PASS' if ok else 'FAIL'),name,str(details)[:80],flush=True)
def mode(p,m):p.locator(f'#F9-13 .nova-tab[data-m="{m}"]').click();p.wait_for_timeout(65)
def kb_place(p,val):
 p.locator(f'#F9-13 [data-source="{val}"]').focus();p.keyboard.press('Enter');p.locator('#F9-13 [data-slot="answer"]').focus();p.keyboard.press('Enter');p.wait_for_timeout(75)
with sync_playwright() as pl:
 b=pl.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in (380,1280):
  p=b.new_page(viewport={'width':width,'height':940},reduced_motion='reduce');p.set_default_timeout(5500);errs=[];p.on('pageerror',lambda e:errs.append(str(e)))
  p.set_content(html,wait_until='domcontentloaded',timeout=45000);p.wait_for_timeout(150)
  q='#F9-13';s=p.locator(q+' .nova-stage');
  ck(f'{width} engine mounted',p.locator(q).count()==1)
  ck(f'{width} four modes',p.locator(q+' .nova-tab').count()==4)
  ck(f'{width} no horizontal overflow',p.evaluate('document.documentElement.scrollWidth<=window.innerWidth'))
  ck(f'{width} stage uses shared algebra background',p.evaluate("getComputedStyle(document.querySelector('#F9-13 .nova-stage'),'::before').backgroundImage.includes('data:image/svg')"))
  ck(f'{width} SVG chalk font',p.evaluate("getComputedStyle(document.querySelector('#F9-13 .f913-svg text')).fontFamily.includes('NOVA Chalk')"))
  for i in range(6):
   p.evaluate(f"NOVA.engines['F9-13'].timeline.pause();NOVA.engines['F9-13'].timeline.go({i},'qa')");p.wait_for_timeout(65)
   svg=s.locator('.f913-svg');g=svg.locator('[data-fractal]');expected=(3**i if i<=3 else 4**(i-3))
   ck(f'{width} watch {i+1} fractal',svg.count()==1 and g.count()==1)
   ck(f'{width} watch {i+1} correct count',g.get_attribute('data-pieces')==str(expected),(expected,g.get_attribute('data-pieces')))
   ck(f'{width} watch {i+1} single mascot',s.locator('.nv-dock').count()==1 and s.locator('.nv-dockfig').count()==1)
   ck(f'{width} watch {i+1} runtime clean',not errs,errs[:1])
   if i<4:ck(f'{width} watch {i+1} triangle',g.get_attribute('data-fractal')=='sierpinski')
   else:ck(f'{width} watch {i+1} Koch geometry',g.get_attribute('data-fractal')=='koch')
   s.screenshot(path=str(shots/f'F9-13-{width}-watch-step{i+1}.png'))
  for m in ('guided','explore','challenge'):
   mode(p,m)
   ck(f'{width} {m} stage',s.locator('.f913-svg').count()==1)
   ck(f'{width} {m} one mascot',s.locator('.nv-dock').count()==1)
   ck(f'{width} {m} shared background',p.evaluate("getComputedStyle(document.querySelector('#F9-13 .nova-stage'),'::before').backgroundImage.includes('data:image/svg')"))
   s.screenshot(path=str(shots/f'F9-13-{width}-{m}.png'))
  mode(p,'explore')
  ck(f'{width} explorer two presets',p.locator(q+' .f913-presetbar button').count()==2)
  ck(f'{width} SVG draggable iteration handle',p.locator(q+' [data-iteration-handle]').count()==1)
  ck(f'{width} SVG reset zone visible',s.locator('.nv-neon-box').count()>4 and 'Reset iteration' in s.locator('svg.f913-svg').text_content())
  p.locator(q+' [data-iteration-handle]').focus();p.keyboard.press('ArrowRight');p.wait_for_timeout(70)
  ck(f'{width} slider keyboard changes iteration',s.locator('[data-fractal]').get_attribute('data-iteration')=='3')
  ck(f'{width} slider updates HTML native range',p.locator(q+' input[aria-label="Fractal iteration from zero to four"]').input_value()=='3')
  p.get_by_role('button',name='Koch · curve').click();p.wait_for_timeout(65)
  ck(f'{width} Koch preset works',s.locator('[data-fractal]').get_attribute('data-fractal')=='koch')
  ck(f'{width} Koch geometry segment count 64',s.locator('[data-fractal]').get_attribute('data-pieces')=='64')
  p.get_by_role('button',name='Reset to 0').click();p.wait_for_timeout(70)
  ck(f'{width} reset iteration',s.locator('[data-fractal]').get_attribute('data-iteration')=='0')
  for kind,fac in [('Sierpiński · triangle',3),('Koch · curve',4)]:
   p.get_by_role('button',name=kind).click();
   for n in range(5):
    p.locator(q+' input[aria-label="Fractal iteration from zero to four"]').evaluate(f"e=>{{e.value='{n}';e.dispatchEvent(new Event('input',{{bubbles:true}}))}}")
    ck(f'{width} {kind} iteration {n} mathematical count',s.locator('[data-fractal]').get_attribute('data-pieces')==str(fac**n))
  mode(p,'challenge')
  ck(f'{width} challenge answer not in side card','27' not in s.locator('.f913-side').text_content())
  p.get_by_role('button',name='Check answer').click()
  ck(f'{width} blank challenge rejected','choose' in p.locator(q+' .nova-fb').last.text_content().lower())
  kb_place(p,9)
  ck(f'{width} wrong candidate rejected',s.locator('[data-placed]').count()==0)
  ck(f'{width} misconception feedback','iteration two' in p.locator(q+' .nova-fb').last.text_content().lower())
  for i,val in enumerate([27,16,16]):
   kb_place(p,val)
   ck(f'{width} task{i+1} keyboard placement',s.locator('[data-placed]').count()==1)
   if i==0:
    s.locator('[data-placed]').focus();p.keyboard.press('Delete');p.wait_for_timeout(70)
    ck(f'{width} remove placed answer keyboard',s.locator('[data-placed]').count()==0)
    kb_place(p,27)
   p.get_by_role('button',name='Check answer').click();p.wait_for_timeout(100)
   if i<2:
    ck(f'{width} task{i+1} accepted',p.get_by_role('button',name=f'Continue to challenge {i+2}').count()==1)
    p.get_by_role('button',name=f'Continue to challenge {i+2}').click()
   else:ck(f'{width} all challenges completed','3 / 3' in p.locator(q+' .nova-panel').text_content())
  ck(f'{width} no JS errors',not errs,errs[:3]);p.close()
 b.close()
# independent maths proof and recursion controls
for n in range(5):
 ck(f'math Sierpinski stage{n}',3**n in (1,3,9,27,81))
 ck(f'math Koch stage{n}',4**n in (1,4,16,64,256))
 for base,length in [(9,9*(4/3)**n)]:
  ck(f'math Koch length ratio at {n}',math.isclose(length/(base), (4/3)**n, rel_tol=1e-12))
ck('math Koch length 9cm->16cm',math.isclose(9*(4/3)**2,16,rel_tol=1e-12))
out={'passed':sum(x['pass'] for x in checks),'total':len(checks),'failures':[x for x in checks if not x['pass']],'checks':checks}
(r/'F9-13-qa-results.json').write_text(json.dumps(out,indent=2))
print('TOTAL',out['passed'],'/',out['total'],'FAIL',len(out['failures']),flush=True)
if out['failures']:raise SystemExit(1)
