from pathlib import Path
from playwright.sync_api import sync_playwright
import json,traceback
root=Path('/mnt/data/f9_work');html=(root/'F9-03-position-to-term-table.html').read_text();shots=root/'f903-shots';shots.mkdir(exist_ok=True)
res=[]
def ck(name,ok,detail=''):
 res.append({'name':name,'pass':bool(ok),'detail':str(detail)[:650]});print(('PASS' if ok else 'FAIL'),name,str(detail)[:140])
def mode(p,k):p.locator(f'#F9-03 .nova-tab[data-m="{k}"]').click();p.wait_for_timeout(80)
with sync_playwright() as sp:
 b=sp.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox']);
 for width in [1280,380]:
  p=b.new_page(viewport=dict(width=width,height=900),reduced_motion='reduce');errors=[]
  p.on('pageerror',lambda e:errors.append(str(e)))
  p.set_default_timeout(3000);p.set_content(html,wait_until='domcontentloaded',timeout=18000);p.wait_for_timeout(150)
  ck(f'{width} mounted',p.locator('#F9-03').count()==1)
  ck(f'{width} chalk',p.evaluate("getComputedStyle(document.querySelector('#F9-03 .f903-maths')).fontFamily.includes('NOVA Chalk')"))
  ck(f'{width} 4 modes',p.locator('#F9-03 .nova-tab').count()==4)
  ck(f'{width} no horizontal overflow',p.evaluate('document.documentElement.scrollWidth<=innerWidth'),p.evaluate('({scrollWidth:document.documentElement.scrollWidth,innerWidth:innerWidth})'))
  for i in range(6):
   p.evaluate(f"NOVA.engines['F9-03'].timeline.pause();NOVA.engines['F9-03'].timeline.go({i},'qa')")
   p.wait_for_timeout(80)
   ck(f'{width} Watch {i+1} live SVG',p.locator('#F9-03 .f903-stage svg.f903-svg').count()==1)
   p.locator('#F9-03 .nova-stage').screenshot(path=str(shots/f'F9-03-{width}-watch-step{i+1}.png'))
  for k in ['guided','explore','challenge']:
   mode(p,k)
   ck(f'{width} {k} live SVG',p.locator('#F9-03 .f903-stage svg.f903-svg').count()==1)
   p.locator('#F9-03 .nova-stage').screenshot(path=str(shots/f'F9-03-{width}-{k}.png'))
  mode(p,'explore')
  sliders=p.locator('#F9-03 .nova-panel input[type=range]')
  ck(f'{width} Explore sliders',sliders.count()==3)
  sliders.nth(0).fill('3');sliders.nth(1).fill('-2');sliders.nth(2).fill('10')
  ck(f'{width} Explore T(10)=28', '28' in p.locator('#F9-03 .nova-panel output').inner_text(),p.locator('#F9-03 .nova-panel output').inner_text())
  mode(p,'challenge')
  try:
   p.get_by_role('button',name='Check all three').click()
   ck(f'{width} incomplete rejected','missing' in p.locator('#F9-03 .nova-fb').last.inner_text().lower() or 'need' in p.locator('#F9-03 .nova-fb').last.inner_text().lower())
   # select rule and drop through keyboard equivalents
   src=p.locator('#F9-03 [data-source="rule-2n+3"]');src.focus();p.keyboard.press('Enter');p.locator('#F9-03 [data-slot="rule"]').focus();p.keyboard.press('Enter')
   ck(f'{width} keyboard rule',p.locator('#F9-03 [data-placed="rule"]').count()==1)
   # term 11
   src=p.locator('#F9-03 [data-source="term-11"]');src.focus();p.keyboard.press('Enter');p.locator('#F9-03 [data-slot="term-4"]').focus();p.keyboard.press('Enter')
   ck(f'{width} keyboard term 4',p.locator('#F9-03 [data-placed="term-4"]').count()==1)
   # term 13
   src=p.locator('#F9-03 [data-source="term-13"]');src.focus();p.keyboard.press('Enter');p.locator('#F9-03 [data-slot="term-5"]').focus();p.keyboard.press('Enter')
   ck(f'{width} keyboard term 5',p.locator('#F9-03 [data-placed="term-5"]').count()==1)
   p.get_by_role('button',name='Check all three').click()
   ck(f'{width} task 1 correct',p.get_by_role('button',name='Continue to challenge 2').count()==1)
   p.get_by_role('button',name='Continue to challenge 2').click()
   ck(f'{width} task 2 initialized', 'negative' in p.locator('#F9-03 .f903-taskhead').inner_text().lower())
   p.locator('#F9-03 [data-source="rule-3n+2"]').focus();p.keyboard.press('Enter');p.locator('#F9-03 [data-slot="rule"]').focus();p.keyboard.press('Enter')
   ck(f'{width} misconception sign', 'minus two' in p.locator('#F9-03 .nova-fb').last.inner_text().lower())
  except Exception as ex:ck(f'{width} challenge progression',False,traceback.format_exc()[-900:])
  ck(f'{width} one mascot',p.locator('#F9-03 .nova-stage .nv-dock').count()==1)
  ck(f'{width} background inheritance',p.evaluate("(()=>{let e=document.querySelector('#F9-03 .nova-stage');return getComputedStyle(e).backgroundImage.includes('linear-gradient')&&getComputedStyle(e,'::before').backgroundImage.includes('data:image/svg')})()"))
  ck(f'{width} no page errors',not errors,errors[:3]);p.close()
 b.close()
output={'passed':sum(t['pass'] for t in res),'total':len(res),'failures':[t for t in res if not t['pass']],'tests':res}
(root/'F9-03-qa-results.json').write_text(json.dumps(output,indent=2));print('SUMMARY',output['passed'],output['total']);
if output['failures']:raise SystemExit(1)
