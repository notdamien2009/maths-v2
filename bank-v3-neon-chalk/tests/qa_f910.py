from pathlib import Path
from playwright.sync_api import sync_playwright
import json, traceback, math
root=Path(__file__).resolve().parent;html=(root/'F9-10-pascals-triangle.html').read_text();shots=root/'f910-shots';shots.mkdir(exist_ok=True);checks=[]
def ck(name,ok,detail=''):
 ok=bool(ok);checks.append({'name':name,'pass':ok,'detail':str(detail)[:500]});print(('PASS' if ok else 'FAIL'),name,str(detail)[:110],flush=True)
def mode(p,m): p.locator(f'#F9-10 .nova-tab[data-m="{m}"]').click();p.wait_for_timeout(60)
def kb(p,v):
 p.locator(f'#F9-10 [data-source="value-{v}"]').focus();p.keyboard.press('Enter')
 p.locator('#F9-10 [data-slot="cell"]').focus();p.keyboard.press('Enter');p.wait_for_timeout(100)
with sync_playwright() as sp:
 b=sp.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in (380,1280):
  p=b.new_page(viewport={'width':width,'height':900},reduced_motion='reduce');p.set_default_timeout(5500);errs=[];p.on('pageerror',lambda e:errs.append(str(e)))
  p.set_content(html,wait_until='domcontentloaded',timeout=35000);p.wait_for_timeout(90)
  ck(f'{width} mount',p.locator('#F9-10').count()==1)
  ck(f'{width} four modes',p.locator('#F9-10 .nova-tab').count()==4)
  ck(f'{width} no page overflow',p.evaluate('document.documentElement.scrollWidth<=innerWidth'))
  ck(f'{width} NOVA chalk font',p.evaluate("getComputedStyle(document.querySelector('#F9-10 .f910-svg text')).fontFamily.includes('NOVA Chalk')"))
  ck(f'{width} canonical algebra background',p.evaluate("(()=>{let e=document.querySelector('#F9-10 .nova-stage');return getComputedStyle(e).backgroundImage.includes('linear-gradient')&&getComputedStyle(e,'::before').backgroundImage.includes('data:image/svg')})()"))
  for i in range(6):
   p.evaluate(f"NOVA.engines['F9-10'].timeline.pause();NOVA.engines['F9-10'].timeline.go({i},'qa')");p.wait_for_timeout(70)
   s=p.locator('#F9-10 .nova-stage');svg=s.locator('.f910-svg');value=svg.text_content()
   ck(f'{width} slide{i+1} canonical hexes',svg.locator('.f910-hex').count()==(3 if i==0 else 6) if i<2 else svg.locator('.f910-hex').count()>=6)
   ck(f'{width} slide{i+1} single helper',s.locator('.nv-dock').count()==1 and s.locator('img').count()<=1)
   ck(f'{width} slide{i+1} no duplicate stage heading',s.locator('.nova-cap').count()<=1)
   if i==0:ck(f'{width} intro no premature 6',svg.locator('.f910-hex[data-value="6"]').count()==0)
   if i==3:ck(f'{width} row4 centre 6',svg.locator('.f910-hex[data-value="6"]').count()==1)
   if i==4:ck(f'{width} row sums', '32' in value and 'ROW SUMS DOUBLE' in value)
   if i==5:ck(f'{width} diagonal correctly highlighted',svg.locator('.f910-hex').count()==28 and '15' in value)
   s.screenshot(path=str(shots/f'F9-10-{width}-watch-step{i+1}.png'))
  for m in ('guided','explore','challenge'):
   mode(p,m)
   ck(f'{width} {m} has SVG',p.locator('#F9-10 .f910-svg').count()==1)
   ck(f'{width} {m} single mascot',p.locator('#F9-10 .nova-stage .nv-dock').count()==1)
   ck(f'{width} {m} default background',p.evaluate("getComputedStyle(document.querySelector('#F9-10 .nova-stage'),'::before').backgroundImage.includes('data:image/svg')"))
   p.locator('#F9-10 .nova-stage').screenshot(path=str(shots/f'F9-10-{width}-{m}.png'))
  mode(p,'explore')
  ck(f'{width} 3 named presets',p.locator('#F9-10 .f910-choices button').count()==3)
  p.get_by_role('button',name='KS3 · Powers of two').click()
  ck(f'{width} row sums preset', '128' not in p.locator('#F9-10 .f910-side').text_content() and '64' in p.locator('#F9-10 .f910-side').text_content())
  p.get_by_role('button',name='KS3 · Diagonal patterns').click()
  ck(f'{width} diagonal preset','THIRD DIAGONAL' in p.locator('#F9-10 .f910-svg').text_content())
  p.get_by_role('slider',name='Number of Pascal triangle rows').evaluate("el=>{el.value='4';el.dispatchEvent(new Event('input',{bubbles:true}));}")
  ck(f'{width} range 4 rows',p.locator('#F9-10 .f910-hex').count()==10)
  p.get_by_role('button',name='KS3 · Grow the rows').click()
  ck(f'{width} addition preset',p.locator('#F9-10 .f910-svg').count()==1)
  mode(p,'challenge')
  try:
   p.get_by_role('button',name='Check missing number').click()
   ck(f'{width} missing answer rejected','place' in p.locator('#F9-10 .nova-fb').last.text_content().lower())
   kb(p,2)
   ck(f'{width} one-parent error rejected',p.locator('#F9-10 [data-placed="cell"]').count()==0)
   ck(f'{width} specific feedback','parent' in p.locator('#F9-10 .nova-fb').last.text_content().lower())
   for i,(right,wrong) in enumerate([(3,2),(6,3),(20,10)]):
    kb(p,right)
    ck(f'{width} task{i+1} placed',p.locator('#F9-10 [data-placed="cell"]').count()==1)
    ck(f'{width} task{i+1} correct value',p.locator('#F9-10 [data-placed="cell"]').get_attribute('aria-label').find(str(right))>=0)
    p.get_by_role('button',name='Check missing number').click()
    if i<2:
     ck(f'{width} task{i+1} accepted',p.get_by_role('button',name=f'Continue to challenge {i+2}').count()==1)
     p.get_by_role('button',name=f'Continue to challenge {i+2}').click()
    else:ck(f'{width} completed three tasks', '3 / 3' in p.locator('#F9-10 .nova-panel').text_content())
  except Exception:ck(f'{width} complete challenge flow',False,traceback.format_exc()[-1600:])
  ck(f'{width} no JS exceptions',not errs,errs[:3]);p.close()
 b.close()
res={'passed':sum(x['pass'] for x in checks),'total':len(checks),'failures':[x for x in checks if not x['pass']],'tests':checks};(root/'F9-10-qa-results.json').write_text(json.dumps(res,indent=2));print('SUMMARY',res['passed'],res['total']);
if res['failures']:raise SystemExit(1)
