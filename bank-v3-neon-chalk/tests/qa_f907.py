from pathlib import Path
from playwright.sync_api import sync_playwright
import json,traceback
root=Path(__file__).resolve().parent
html_path=root/'F9-07-special-sequences.html'
if not html_path.exists():html_path=root.parent/'F9/F9-07-special-sequences.html'
html=html_path.read_text();shots=root/'f907-shots';shots.mkdir(exist_ok=True);checks=[]
def ck(name,ok,detail=''):
 ok=bool(ok);checks.append({'name':name,'pass':ok,'detail':str(detail)[:850]});print(('PASS' if ok else 'FAIL'),name,str(detail)[:120],flush=True)
def mode(p,m):p.locator(f'#F9-07 .nova-tab[data-m="{m}"]').click();p.wait_for_timeout(75)
def kb(p,v):
 p.locator(f'#F9-07 [data-source="{v}"]').focus();p.keyboard.press('Enter')
 p.locator('#F9-07 [data-slot="sequence"]').focus();p.keyboard.press('Enter');p.wait_for_timeout(80)
with sync_playwright() as sp:
 b=sp.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for w in (1280,380):
  p=b.new_page(viewport={'width':w,'height':900},reduced_motion='reduce');p.set_default_timeout(4200);errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
  p.set_content(html,wait_until='domcontentloaded',timeout=30000);p.wait_for_timeout(100)
  ck(f'{w} engine mounts',p.locator('#F9-07').count()==1)
  ck(f'{w} all four modes',p.locator('#F9-07 .nova-tab').count()==4)
  ck(f'{w} no document overflow',p.evaluate('document.documentElement.scrollWidth<=window.innerWidth'))
  ck(f'{w} NOVA Chalk',p.evaluate("getComputedStyle(document.querySelector('#F9-07 .f907-svg text')).fontFamily.includes('NOVA Chalk')"))
  ck(f'{w} shared background texture',p.evaluate("(()=>{let e=document.querySelector('#F9-07 .nova-stage');return getComputedStyle(e).backgroundImage.includes('linear-gradient')&&getComputedStyle(e,'::before').backgroundImage.includes('data:image/svg')})()"))
  for i in range(6):
   p.evaluate(f"NOVA.engines['F9-07'].timeline.pause();NOVA.engines['F9-07'].timeline.go({i},'qa')")
   p.wait_for_timeout(35)
   ck(f'{w} Watch {i+1} drawn pattern',p.locator('#F9-07 .f907-svg [data-pattern]').count()>0)
   ck(f'{w} Watch {i+1} canonical mascot count',p.locator('#F9-07 .nova-stage .nv-dock').count()==1)
   ck(f'{w} Watch {i+1} stage header',p.locator('#F9-07 .nova-stage').inner_text().strip().startswith('SEQUENCE') or p.locator('#F9-07 .nova-stage').inner_text().strip().startswith('Sequence'))
   p.locator('#F9-07 .nova-stage').screenshot(path=str(shots/f'F9-07-{w}-watch-{i+1}.png'))
  for m in ('guided','explore','challenge'):
   mode(p,m);ck(f'{w} {m} SVG',p.locator('#F9-07 .f907-svg').count()==1)
   ck(f'{w} {m} single mascot',p.locator('#F9-07 .nova-stage .nv-dock').count()==1)
   p.locator('#F9-07 .nova-stage').screenshot(path=str(shots/f'F9-07-{w}-{m}.png'))
  mode(p,'explore')
  ck(f'{w} two source lesson presets',p.locator('#F9-07 .f907-choices').first.locator('button').count()==2)
  ck(f'{w} four family switches',p.locator('#F9-07 .f907-choices').nth(1).locator('button').count()==4)
  for kind in ('square','triangular','cube','fibonacci'):
   p.get_by_role('button',name=kind,exact=True).click();p.wait_for_timeout(50)
   ck(f'{w} explore {kind} structure',p.locator('#F9-07 .f907-svg [data-pattern]').count()>0)
  p.get_by_role('button',name='Y8 · Compare rules').click()
  ck(f'{w} Y8 preset selects cube',p.locator('#F9-07 .f907-svg text').filter(has_text='CUBE NUMBERS').count()>0)
  p.get_by_role('slider',name='Sequence stage').evaluate("el=>{el.value='2';el.dispatchEvent(new Event('input',{bubbles:true}));}")
  ck(f'{w} stage slider updates',p.locator('#F9-07 .f907-side').get_by_text('Stage').count()>0 and '2' in p.locator('#F9-07 .f907-side').inner_text())
  mode(p,'challenge')
  try:
   p.get_by_role('button',name='Check match').click()
   ck(f'{w} incomplete match prevented','place' in p.locator('#F9-07 .nova-fb').last.inner_text().lower())
   kb(p,'triangle')
   ck(f'{w} wrong triangle card rejected',p.locator('#F9-07 [data-placed="sequence"]').count()==0)
   ck(f'{w} triangle misconception-specific feedback','triangular' in p.locator('#F9-07 .nova-fb').last.inner_text().lower())
   for i,k in enumerate(['square','triangle','cube','fibonacci']):
    kb(p,k)
    ck(f'{w} challenge {i+1} keyboard placement',p.locator('#F9-07 [data-placed="sequence"]').count()==1)
    p.get_by_role('button',name='Check match').click()
    if i<3:
     ck(f'{w} challenge {i+1} accepted',p.get_by_role('button',name=f'Continue to challenge {i+2}').count()==1)
     p.get_by_role('button',name=f'Continue to challenge {i+2}').click()
    else:ck(f'{w} all four tasks finished','4 / 4' in p.locator('#F9-07 .nova-panel').inner_text())
  except Exception:ck(f'{w} four-task challenge workflow',False,traceback.format_exc()[-1750:])
  ck(f'{w} no browser exceptions',not errors,errors[:3]);p.close()
 b.close()
res={'passed':sum(x['pass'] for x in checks),'total':len(checks),'failures':[x for x in checks if not x['pass']],'tests':checks}
(root/'F9-07-qa-results.json').write_text(json.dumps(res,indent=2));print('SUMMARY',res['passed'],res['total'],flush=True)
if res['failures']:raise SystemExit(1)
