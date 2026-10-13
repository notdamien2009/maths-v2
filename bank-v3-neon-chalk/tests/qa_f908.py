from pathlib import Path
from playwright.sync_api import sync_playwright
import json, traceback
root=Path(__file__).resolve().parent
html=(root/'F9-08-triangular-numbers-dot-arrays.html').read_text();shots=root/'f908-shots';shots.mkdir(exist_ok=True);checks=[]
def ck(name,ok,detail=''):
 ok=bool(ok);checks.append({'name':name,'pass':ok,'detail':str(detail)[:700]});print(('PASS' if ok else 'FAIL'),name,str(detail)[:100],flush=True)
def mode(p,m):p.locator(f'#F9-08 .nova-tab[data-m="{m}"]').click();p.wait_for_timeout(65)
def kb(p,slot,v):
 p.locator(f'#F9-08 [data-source="{slot}-{v}"]').focus();p.keyboard.press('Enter')
 p.locator(f'#F9-08 [data-slot="{slot}"]').focus();p.keyboard.press('Enter');p.wait_for_timeout(85)
with sync_playwright() as sp:
 b=sp.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for w in (1280,380):
  p=b.new_page(viewport={'width':w,'height':900},reduced_motion='reduce');p.set_default_timeout(4500);errs=[];p.on('pageerror',lambda e:errs.append(str(e)))
  p.set_content(html,wait_until='domcontentloaded',timeout=30000);p.wait_for_timeout(90)
  ck(f'{w} mounts',p.locator('#F9-08').count()==1)
  ck(f'{w} four modes',p.locator('#F9-08 .nova-tab').count()==4)
  ck(f'{w} no document overflow',p.evaluate('document.documentElement.scrollWidth<=window.innerWidth'))
  ck(f'{w} embedded Chalk font',p.evaluate("getComputedStyle(document.querySelector('#F9-08 .f908-svg text')).fontFamily.includes('NOVA Chalk')"))
  ck(f'{w} canonical shared algebra pattern',p.evaluate("(()=>{let e=document.querySelector('#F9-08 .nova-stage');return getComputedStyle(e).backgroundImage.includes('linear-gradient')&&getComputedStyle(e,'::before').backgroundImage.includes('data:image/svg')})()"))
  for i in range(6):
   p.evaluate(f"NOVA.engines['F9-08'].timeline.pause();NOVA.engines['F9-08'].timeline.go({i},'qa')")
   p.wait_for_timeout(30)
   ck(f'{w} Watch {i+1} math drawn',p.locator('#F9-08 .f908-svg [data-pattern]').count()>0)
   ck(f'{w} Watch {i+1} one mascot',p.locator('#F9-08 .nova-stage .nv-dock').count()==1)
   ck(f'{w} Watch {i+1} no second mascot',p.locator('#F9-08 .nova-stage img').count()<=1)
   if i>=3:
    ck(f'{w} Watch {i+1} double rectangle drawn',p.locator('#F9-08 .f908-svg [data-pattern="rectangle"]').count()==1)
    if i==3:
     original=p.locator('#F9-08 [data-half="original"]').count();copy=p.locator('#F9-08 [data-half="flipped-copy"]').count()
     ck(f'{w} mirrored copy exact 10+10',original==10 and copy==10,f'{original}+{copy}')
   p.locator('#F9-08 .nova-stage').screenshot(path=str(shots/f'F9-08-{w}-watch-{i+1}.png'))
  for m in ('guided','explore','challenge'):
   mode(p,m)
   ck(f'{w} {m} SVG present',p.locator('#F9-08 .f908-svg').count()==1)
   ck(f'{w} {m} one mascot',p.locator('#F9-08 .nova-stage .nv-dock').count()==1)
   p.locator('#F9-08 .nova-stage').screenshot(path=str(shots/f'F9-08-{w}-{m}.png'))
  mode(p,'explore')
  ck(f'{w} two lesson presets',p.locator('#F9-08 .f908-choices').first.locator('button').count()==2)
  ck(f'{w} two mathematical views',p.locator('#F9-08 .f908-choices').nth(1).locator('button').count()==2)
  p.get_by_role('button',name='Double into rectangle').click()
  ck(f'{w} explore duplicate rectangle',p.locator('#F9-08 .f908-svg [data-pattern="rectangle"]').count()==1)
  p.get_by_role('slider',name='Triangular pattern stage').evaluate("el=>{el.value='6';el.dispatchEvent(new Event('input',{bubbles:true}));}")
  ck(f'{w} slider to 6 yields 42 rectangle dots',p.locator('#F9-08 .f908-svg [data-half]').count()==42)
  p.get_by_role('button',name='One triangle').click()
  ck(f'{w} switch back triangle stage six has 21 dots',p.locator('#F9-08 .f908-svg [data-pattern="triangle"] .nv-ring').count()>=21)
  mode(p,'challenge')
  try:
   p.get_by_role('button',name='Check triangle').click()
   ck(f'{w} incomplete prevented','place' in p.locator('#F9-08 .nova-fb').last.inner_text().lower())
   kb(p,'row',3)
   ck(f'{w} wrong row rejected',p.locator('#F9-08 [data-placed="row"]').count()==0)
   ck(f'{w} wrong row misconception','too short' in p.locator('#F9-08 .nova-fb').last.inner_text().lower())
   kb(p,'count',16)
   ck(f'{w} square-number trap rejected',p.locator('#F9-08 [data-placed="count"]').count()==0)
   ck(f'{w} square-number feedback','square' in p.locator('#F9-08 .nova-fb').last.inner_text().lower())
   for i,(row,count) in enumerate([(4,10),(5,15),(6,21)]):
    kb(p,'row',row)
    ck(f'{w} Challenge {i+1} row placed',p.locator('#F9-08 [data-placed="row"]').count()==1)
    kb(p,'count',count)
    ck(f'{w} Challenge {i+1} total placed',p.locator('#F9-08 [data-placed="count"]').count()==1)
    p.get_by_role('button',name='Check triangle').click()
    if i<2:
     ck(f'{w} Challenge {i+1} accepted',p.get_by_role('button',name=f'Continue to challenge {i+2}').count()==1)
     p.get_by_role('button',name=f'Continue to challenge {i+2}').click()
    else:
     ck(f'{w} all tasks finished','3 / 3' in p.locator('#F9-08 .nova-panel').inner_text())
  except Exception:ck(f'{w} full challenge progression',False,traceback.format_exc()[-1400:])
  ck(f'{w} no JS exceptions',not errs,errs[:3]);p.close()
 b.close()
res={'passed':sum(q['pass'] for q in checks),'total':len(checks),'failures':[q for q in checks if not q['pass']],'tests':checks}
(root/'F9-08-qa-results.json').write_text(json.dumps(res,indent=2));print('SUMMARY',res['passed'],res['total'],flush=True)
if res['failures']:raise SystemExit(1)
