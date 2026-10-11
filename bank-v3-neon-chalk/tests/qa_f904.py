#!/usr/bin/env python3
"""F9-04 functional + visual QA (review build)."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,traceback
root=Path(__file__).resolve().parent
html=(root/'F9-04-sequence-on-a-graph.html').read_text()
shots=root/'f904-shots';shots.mkdir(exist_ok=True)
checks=[]
def ck(name,cond,detail=''):
 checks.append({'name':name,'pass':bool(cond),'detail':str(detail)[:650]})
 print(('PASS' if cond else 'FAIL'),name,str(detail)[:120])
def mode(p,k):p.locator(f'#F9-04 .nova-tab[data-m="{k}"]').click();p.wait_for_timeout(65)
with sync_playwright() as sp:
 b=sp.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in (1280,380):
  p=b.new_page(viewport={'width':width,'height':900},reduced_motion='reduce');errors=[]
  p.on('pageerror',lambda e:errors.append(str(e)))
  p.set_default_timeout(3500);p.set_content(html,wait_until='domcontentloaded',timeout=20000);p.wait_for_timeout(180)
  ck(f'{width} engine mounts',p.locator('#F9-04').count()==1)
  ck(f'{width} four modes',p.locator('#F9-04 .nova-tab').count()==4)
  ck(f'{width} NOVA Chalk',p.evaluate("getComputedStyle(document.querySelector('#F9-04 .f904-maths')).fontFamily.includes('NOVA Chalk')"))
  ck(f'{width} no horizontal overflow',p.evaluate('document.documentElement.scrollWidth<=innerWidth'))
  for i in range(6):
   p.evaluate(f"NOVA.engines['F9-04'].timeline.pause();NOVA.engines['F9-04'].timeline.go({i},'qa')")
   p.wait_for_timeout(45)
   ck(f'{width} Watch step {i+1} graph',p.locator('#F9-04 .f904-svg .nv-plot').count()==1)
   ck(f'{width} Watch step {i+1} one mascot',p.locator('#F9-04 .nova-stage .nv-dock').count()==1)
   p.locator('#F9-04 .nova-stage').screenshot(path=str(shots/f'F9-04-{width}-watch-step{i+1}.png'))
  for k in ('guided','explore','challenge'):
   mode(p,k)
   ck(f'{width} {k} graph visible',p.locator('#F9-04 .f904-svg .nv-plot').count()==1)
   ck(f'{width} {k} single mascot',p.locator('#F9-04 .nova-stage .nv-dock').count()==1)
   p.locator('#F9-04 .nova-stage').screenshot(path=str(shots/f'F9-04-{width}-{k}.png'))
  mode(p,'explore')
  ck(f'{width} four named presets',p.locator('#F9-04 .f904-choices button').count()==4)
  p.get_by_role('button',name='Y9 · n² − n + 2').click();p.wait_for_timeout(80)
  ck(f'{width} Y9 graph fifth term 22','22' in p.locator('#F9-04 .f904-side').inner_text())
  p.get_by_role('button',name='Y8 · 14 − 2n').click();p.wait_for_timeout(70)
  ck(f'{width} decreasing graph fifth term 4','4' in p.locator('#F9-04 .f904-side').inner_text())
  mode(p,'challenge')
  try:
   p.get_by_role('button',name='Check the two points').click()
   ck(f'{width} challenge refuses incomplete','must be plotted' in p.locator('#F9-04 .nova-fb').last.inner_text())
   p.locator('#F9-04 [data-source="4,8"]').focus();p.keyboard.press('Enter');p.locator('#F9-04 [data-slot="point-4"]').focus();p.keyboard.press('Enter')
   ck(f'{width} incorrect coordinate rejected',p.locator('#F9-04 [data-placed="point-4"]').count()==0)
   ck(f'{width} diagnostic feedback present','two' in p.locator('#F9-04 .nova-fb').last.inner_text().lower() or '+2' in p.locator('#F9-04 .nova-fb').last.inner_text().lower())
   for card,slot in [('4,9','point-4'),('5,11','point-5')]:
    p.locator(f'#F9-04 [data-source="{card}"]').focus();p.keyboard.press('Enter');p.locator(f'#F9-04 [data-slot="{slot}"]').focus();p.keyboard.press('Enter')
   ck(f'{width} keyboard two points',p.locator('#F9-04 [data-placed]').count()==2)
   p.get_by_role('button',name='Check the two points').click()
   ck(f'{width} task 1 correct',p.get_by_role('button',name='Continue to challenge 2').count()==1)
   p.get_by_role('button',name='Continue to challenge 2').click()
   ck(f'{width} task 2 falling sequence','falling' in p.locator('#F9-04 .f904-taskhead').inner_text().lower())
   for card,slot in [('4,6','point-4'),('5,4','point-5')]:
    p.locator(f'#F9-04 [data-source="{card}"]').focus();p.keyboard.press('Enter');p.locator(f'#F9-04 [data-slot="{slot}"]').focus();p.keyboard.press('Enter')
   p.get_by_role('button',name='Check the two points').click()
   ck(f'{width} task 2 correct',p.get_by_role('button',name='Continue to challenge 3').count()==1)
   p.get_by_role('button',name='Continue to challenge 3').click()
   ck(f'{width} task 3 quadratic','quadratic' in p.locator('#F9-04 .f904-taskhead').inner_text().lower())
   for card,slot in [('4,17','point-4'),('5,26','point-5')]:
    p.locator(f'#F9-04 [data-source="{card}"]').focus();p.keyboard.press('Enter');p.locator(f'#F9-04 [data-slot="{slot}"]').focus();p.keyboard.press('Enter')
   p.get_by_role('button',name='Check the two points').click()
   ck(f'{width} all tasks complete','3 / 3' in p.locator('#F9-04 .nova-panel').inner_text())
  except Exception:ck(f'{width} full challenge workflow',False,traceback.format_exc()[-1200:])
  ck(f'{width} inherits NOVA background',p.evaluate("(()=>{let e=document.querySelector('#F9-04 .nova-stage');return getComputedStyle(e).backgroundImage.includes('linear-gradient')&&getComputedStyle(e,'::before').backgroundImage.includes('data:image/svg')})()"))
  ck(f'{width} no browser errors',not errors,errors[:4]);p.close()
 b.close()
output={'passed':sum(t['pass'] for t in checks),'total':len(checks),'failures':[t for t in checks if not t['pass']],'tests':checks}
(root/'F9-04-qa-results.json').write_text(json.dumps(output,indent=2));print('SUMMARY',output['passed'],output['total']);
if output['failures']:raise SystemExit(1)
