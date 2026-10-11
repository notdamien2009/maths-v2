from pathlib import Path
from playwright.sync_api import sync_playwright
import json, traceback
root=Path(__file__).resolve().parent
html_path=root/'F9-06-geometric-sequence.html'
if not html_path.exists(): html_path=root.parent/'F9/F9-06-geometric-sequence.html'
html=html_path.read_text(); shots=root/'f906-shots';shots.mkdir(exist_ok=True)
checks=[]
def ck(name,ok,details=''):
 ok=bool(ok);checks.append({'name':name,'pass':ok,'detail':str(details)[:850]});print(('PASS' if ok else 'FAIL'),name,str(details)[:100],flush=True)
def mode(p,m):p.locator(f'#F9-06 .nova-tab[data-m="{m}"]').click();p.wait_for_timeout(80)
def source(p,kind,value):
 p.locator(f'#F9-06 [data-source="{kind}:{value}"]').focus();p.keyboard.press('Enter');p.locator(f'#F9-06 [data-slot="{kind}"]').focus();p.keyboard.press('Enter');p.wait_for_timeout(60)
with sync_playwright() as sp:
 b=sp.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for w in (1280,380):
  p=b.new_page(viewport={'width':w,'height':900},reduced_motion='reduce');p.set_default_timeout(3500)
  errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
  p.set_content(html,wait_until='domcontentloaded',timeout=30000);p.wait_for_timeout(100)
  ck(f'{w} engine mounts',p.locator('#F9-06').count()==1)
  ck(f'{w} has exactly four modes',p.locator('#F9-06 .nova-tab').count()==4)
  ck(f'{w} no document overflow',p.evaluate('document.documentElement.scrollWidth<=window.innerWidth'))
  ck(f'{w} NOVA Chalk',p.evaluate("getComputedStyle(document.querySelector('#F9-06 .f906-svg text')).fontFamily.includes('NOVA Chalk')"))
  ck(f'{w} canonical texture',p.evaluate("(()=>{let e=document.querySelector('#F9-06 .nova-stage');return getComputedStyle(e).backgroundImage.includes('linear-gradient')&&getComputedStyle(e,'::before').backgroundImage.includes('data:image/svg')})()"))
  for i in range(6):
   p.evaluate(f"NOVA.engines['F9-06'].timeline.pause();NOVA.engines['F9-06'].timeline.go({i},'qa')")
   p.wait_for_timeout(30)
   ck(f'{w} Watch {i+1} glass bars',p.locator('#F9-06 .f906-svg [data-bar]').count()>0)
   ck(f'{w} Watch {i+1} single mascot',p.locator('#F9-06 .nova-stage .nv-dock').count()==1)
   p.locator('#F9-06 .nova-stage').screenshot(path=str(shots/f'F9-06-{w}-watch-step{i+1}.png'))
  ck(f'{w} stacked exponent displayed',p.locator('#F9-06 .f906-maths sup').count()==1 and p.locator('#F9-06 .f906-svg text').filter(has_text='n−1').count()>0)
  for m in ('guided','explore','challenge'):
   mode(p,m);ck(f'{w} {m} SVG',p.locator('#F9-06 .f906-svg').count()==1)
   ck(f'{w} {m} single mascot',p.locator('#F9-06 .nova-stage .nv-dock').count()==1)
   p.locator('#F9-06 .nova-stage').screenshot(path=str(shots/f'F9-06-{w}-{m}.png'))
  mode(p,'explore')
  ck(f'{w} three named presets',p.locator('#F9-06 .f906-choices button').count()==3)
  p.get_by_role('button',name='Y9 · Halving').click()
  ck(f'{w} halving preset',p.locator('#F9-06 .f906-side').get_by_text('÷2',exact=True).count()==1)
  p.get_by_role('button',name='Y9 · Tripling').click()
  ck(f'{w} tripling preset',p.locator('#F9-06 .f906-side').get_by_text('×3',exact=True).count()==1)
  p.get_by_role('slider',name='Number of visible terms').evaluate("el=>{el.value='5';el.dispatchEvent(new Event('input',{bubbles:true}));}")
  ck(f'{w} reveal term five',p.locator('#F9-06 .f906-svg [data-bar]').count()==5)
  mode(p,'challenge')
  try:
   p.get_by_role('button',name='Check pattern').click()
   ck(f'{w} incomplete prevented','ratio' in p.locator('#F9-06 .nova-fb').last.inner_text().lower())
   source(p,'ratio','+3')
   ck(f'{w} additive misconception rejected',p.locator('#F9-06 [data-placed="ratio"]').count()==0)
   ck(f'{w} specific feedback','addition' in p.locator('#F9-06 .nova-fb').last.inner_text().lower() or 'adds' in p.locator('#F9-06 .nova-fb').last.inner_text().lower())
   source(p,'ratio','×2');source(p,'term','48')
   ck(f'{w} keyboard placements',p.locator('#F9-06 [data-placed]').count()==2)
   p.get_by_role('button',name='Check pattern').click()
   ck(f'{w} task1 complete',p.get_by_role('button',name='Continue to challenge 2').count()==1)
   p.get_by_role('button',name='Continue to challenge 2').click()
   ck(f'{w} task2 setup','multiply by three' in p.locator('#F9-06 .f906-taskhead').inner_text().lower())
   source(p,'ratio','×3');source(p,'term','162');p.get_by_role('button',name='Check pattern').click()
   ck(f'{w} task2 complete',p.get_by_role('button',name='Continue to challenge 3').count()==1)
   p.get_by_role('button',name='Continue to challenge 3').click()
   source(p,'ratio','÷2');source(p,'term','4');p.get_by_role('button',name='Check pattern').click()
   ck(f'{w} task3 finish','3 / 3' in p.locator('#F9-06 .nova-panel').inner_text())
  except Exception:ck(f'{w} full challenge workflow',False,traceback.format_exc()[-1600:])
  ck(f'{w} no browser exceptions',not errors,errors[:4]);p.close()
 b.close()
res={'passed':sum(x['pass'] for x in checks),'total':len(checks),'failures':[x for x in checks if not x['pass']],'tests':checks}
(root/'F9-06-qa-results.json').write_text(json.dumps(res,indent=2))
print('SUMMARY',res['passed'],res['total'],flush=True)
if res['failures']:raise SystemExit(1)
