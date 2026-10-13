from pathlib import Path
from playwright.sync_api import sync_playwright
import json,traceback
root=Path(__file__).resolve().parent;html=(root/'F9-09-quadratic-sequence.html').read_text();shots=root/'f909-shots';shots.mkdir(exist_ok=True);checks=[]
def ck(name,ok,detail=''):
 ok=bool(ok);checks.append({'name':name,'pass':ok,'detail':str(detail)[:600]});print(('PASS' if ok else 'FAIL'),name,str(detail)[:100],flush=True)
def mode(p,m): p.locator(f'#F9-09 .nova-tab[data-m="{m}"]').click();p.wait_for_timeout(50)
def kb(p,k,v):
 p.locator(f'#F9-09 [data-source="{k}-{v}"]').focus();p.keyboard.press('Enter')
 p.locator(f'#F9-09 [data-slot="{k}"]').focus();p.keyboard.press('Enter');p.wait_for_timeout(90)
with sync_playwright() as sp:
 b=sp.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in (380,1280):
  p=b.new_page(viewport={'width':width,'height':900},reduced_motion='reduce');p.set_default_timeout(5500);errs=[];p.on('pageerror',lambda e:errs.append(str(e)))
  p.set_content(html,wait_until='domcontentloaded',timeout=35000);p.wait_for_timeout(70)
  ck(f'{width} mount',p.locator('#F9-09').count()==1)
  ck(f'{width} four modes',p.locator('#F9-09 .nova-tab').count()==4)
  ck(f'{width} no overflow',p.evaluate('document.documentElement.scrollWidth<=innerWidth'))
  ck(f'{width} NOVA Chalk embedded',p.evaluate("getComputedStyle(document.querySelector('#F9-09 .f909-svg text')).fontFamily.includes('NOVA Chalk')"))
  ck(f'{width} canonical algebra patterned background',p.evaluate("(()=>{let e=document.querySelector('#F9-09 .nova-stage');return getComputedStyle(e).backgroundImage.includes('linear-gradient')&&getComputedStyle(e,'::before').backgroundImage.includes('data:image/svg')})()"))
  for i in range(6):
   p.evaluate(f"NOVA.engines['F9-09'].timeline.pause();NOVA.engines['F9-09'].timeline.go({i},'qa')");p.wait_for_timeout(40)
   svg=p.locator('#F9-09 .f909-svg');t=svg.text_content()
   ck(f'{width} step{i+1} drawn table',svg.locator('.nv-neon-box').count()>=11)
   ck(f'{width} step{i+1} one mascot',p.locator('#F9-09 .nova-stage .nv-dock').count()==1 and p.locator('#F9-09 .nova-stage img').count()<=1)
   ck(f'{width} step{i+1} mathematical terms',all(v in t for v in ('6','15','28','45','66')))
   if i==0:ck(f'{width} no early coefficient reveal','A QUADRATIC HAS' not in t)
   if i==2:ck(f'{width} second differences shown',p.locator('#F9-09 .f909-svg').text_content().count('4')>=3)
   if i==5:
    ck(f'{width} remainder linear', '4, 7, 10' in t)
    ck(f'{width} nth-term proof', '2n² + 3n + 1' in t)
   p.locator('#F9-09 .nova-stage').screenshot(path=str(shots/f'F9-09-{width}-watch-step{i+1}.png'))
  for m in ('guided','explore','challenge'):
   mode(p,m)
   ck(f'{width} {m} has SVG',p.locator('#F9-09 .f909-svg').count()==1)
   ck(f'{width} {m} single helper',p.locator('#F9-09 .nova-stage .nv-dock').count()==1)
   p.locator('#F9-09 .nova-stage').screenshot(path=str(shots/f'F9-09-{width}-{m}.png'))
  mode(p,'explore')
  ck(f'{width} 3 presets',p.locator('#F9-09 .f909-choices button').count()==3)
  p.get_by_role('button',name='Y9 · Quadratic structure').click()
  ck(f'{width} year9 negative b', '-2n' in p.locator('#F9-09 .nova-stage').text_content())
  ck(f'{width} second difference is 2', '2' in p.locator('#F9-09 .f909-side').text_content())
  p.get_by_role('slider',name='Visible number of terms').evaluate("el=>{el.value='3';el.dispatchEvent(new Event('input',{bubbles:true}));}")
  ck(f'{width} slider shows 3 terms',p.locator('#F9-09 .f909-side').text_content().find('T(3) = 7')>=0)
  mode(p,'challenge')
  try:
   p.get_by_role('button',name='Check nth-term rule').click()
   ck(f'{width} incomplete rejected','complete' in p.locator('#F9-09 .nova-fb').last.text_content().lower())
   kb(p,'a',2);ck(f'{width} incorrect a rejected',p.locator('#F9-09 [data-placed="a"]').count()==0)
   ck(f'{width} half-second-difference hint','half' in p.locator('#F9-09 .nova-fb').last.text_content().lower() or 'divide' in p.locator('#F9-09 .nova-fb').last.text_content().lower())
   for idx,preset in enumerate([(1,2,1),(2,3,1),(1,-2,4)]):
    for k,v in zip('abc',preset):
     kb(p,k,v)
     ck(f'{width} task{idx+1} {k} placed',p.locator(f'#F9-09 [data-placed="{k}"]').count()==1)
    p.get_by_role('button',name='Check nth-term rule').click()
    if idx<2:
     ck(f'{width} task{idx+1} accepted',p.get_by_role('button',name=f'Continue to challenge {idx+2}').count()==1)
     p.get_by_role('button',name=f'Continue to challenge {idx+2}').click()
    else:ck(f'{width} all 3 tasks finished','3 / 3' in p.locator('#F9-09 .nova-panel').text_content())
  except Exception:ck(f'{width} complete challenge flow',False,traceback.format_exc()[-1600:])
  ck(f'{width} no runtime errors',not errs,errs[:3]);p.close()
 b.close()
res={'passed':sum(x['pass'] for x in checks),'total':len(checks),'failures':[x for x in checks if not x['pass']],'tests':checks};(root/'F9-09-qa-results.json').write_text(json.dumps(res,indent=2));print('SUMMARY',res['passed'],res['total']);
if res['failures']:raise SystemExit(1)
