from pathlib import Path
from playwright.sync_api import sync_playwright
import json,traceback
root=Path(__file__).resolve().parent
html=(root/'F9-05-linear-nth-term-derivation.html').read_text()
shots=root/'f905-shots';shots.mkdir(exist_ok=True)
checks=[]
def ck(label,yes,detail=''):
 checks.append({'name':label,'pass':bool(yes),'detail':str(detail)[:600]});print(('PASS' if yes else 'FAIL'),label,str(detail)[:100])
def mode(p,x):p.locator(f'#F9-05 .nova-tab[data-m="{x}"]').click();p.wait_for_timeout(100)
with sync_playwright() as sp:
 b=sp.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in (1280,380):
  p=b.new_page(viewport={'width':width,'height':900},reduced_motion='reduce');p.set_default_timeout(3500);errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
  p.set_content(html,wait_until='domcontentloaded',timeout=30000);p.wait_for_timeout(130)
  ck(f'{width} engine mounts',p.locator('#F9-05').count()==1)
  ck(f'{width} four modes',p.locator('#F9-05 .nova-tab').count()==4)
  ck(f'{width} chalk font',p.evaluate("getComputedStyle(document.querySelector('#F9-05 .f905-maths')).fontFamily.includes('NOVA Chalk')")) if p.locator('.f905-maths').count() else ck(f'{width} Chalk in main SVG',p.evaluate("getComputedStyle(document.querySelector('#F9-05 .f905-svg text')).fontFamily.includes('NOVA Chalk')"))
  ck(f'{width} no horizontal overflow',p.evaluate('document.documentElement.scrollWidth<=innerWidth'))
  for i in range(6):
   p.evaluate(f"NOVA.engines['F9-05'].timeline.pause();NOVA.engines['F9-05'].timeline.go({i},'qa')");p.wait_for_timeout(60)
   ck(f'{width} Watch step {i+1} table',p.locator('#F9-05 .f905-svg .nv-neon-box').count()>=10)
   ck(f'{width} Watch step {i+1} one mascot',p.locator('#F9-05 .nova-stage .nv-dock').count()==1)
   p.locator('#F9-05 .nova-stage').screenshot(path=str(shots/f'F9-05-{width}-watch-step{i+1}.png'))
  for m in ('guided','explore','challenge'):
   mode(p,m)
   ck(f'{width} {m} SVG exists',p.locator('#F9-05 .f905-svg').count()==1)
   ck(f'{width} {m} one mascot',p.locator('#F9-05 .nova-stage .nv-dock').count()==1)
   p.locator('#F9-05 .nova-stage').screenshot(path=str(shots/f'F9-05-{width}-{m}.png'))
  mode(p,'explore')
  ck(f'{width} three named presets',p.locator('#F9-05 .f905-choices button').count()==3)
  p.get_by_role('button',name='Y8 · 5n − 3').click();ck(f'{width} Y8 negative offset','5n − 3' in p.locator('#F9-05 .f905-side').inner_text())
  p.get_by_role('button',name='Y8 · 22 − 4n').click();ck(f'{width} decreasing sequence','−4n' in p.locator('#F9-05 .f905-side').inner_text())
  mode(p,'challenge')
  try:
   p.get_by_role('button',name='Check nth term').click();ck(f'{width} incomplete blocked','correct difference' in p.locator('#F9-05 .nova-fb').last.inner_text())
   p.locator('#F9-05 [data-source="d:+4"]').focus();p.keyboard.press('Enter');p.locator('#F9-05 [data-slot="d"]').focus();p.keyboard.press('Enter')
   ck(f'{width} wrong d rejected',p.locator('#F9-05 [data-placed="d"]').count()==0)
   ck(f'{width} diagnostic feedback', 'difference' in p.locator('#F9-05 .nova-fb').last.inner_text().lower())
   for src,slot in [('d:+3','d'),('c:+2','c')]:
    p.locator(f'#F9-05 [data-source="{src}"]').focus();p.keyboard.press('Enter');p.locator(f'#F9-05 [data-slot="{slot}"]').focus();p.keyboard.press('Enter')
   ck(f'{width} keyboard placement',p.locator('#F9-05 [data-placed]').count()==2)
   p.get_by_role('button',name='Check nth term').click();ck(f'{width} task 1 completion',p.get_by_role('button',name='Continue to challenge 2').count()==1)
   p.get_by_role('button',name='Continue to challenge 2').click();ck(f'{width} task 2 title','negative adjustment' in p.locator('#F9-05 .f905-taskhead').inner_text().lower())
   for src,slot in [('d:+5','d'),('c:−3','c')]:
    p.locator(f'#F9-05 [data-source="{src}"]').focus();p.keyboard.press('Enter');p.locator(f'#F9-05 [data-slot="{slot}"]').focus();p.keyboard.press('Enter')
   p.get_by_role('button',name='Check nth term').click();ck(f'{width} task2 complete',p.get_by_role('button',name='Continue to challenge 3').count()==1)
   p.get_by_role('button',name='Continue to challenge 3').click()
   for src,slot in [('d:−4','d'),('c:+22','c')]:
    p.locator(f'#F9-05 [data-source="{src}"]').focus();p.keyboard.press('Enter');p.locator(f'#F9-05 [data-slot="{slot}"]').focus();p.keyboard.press('Enter')
   p.get_by_role('button',name='Check nth term').click();ck(f'{width} all three complete','3 / 3' in p.locator('#F9-05 .nova-panel').inner_text())
  except Exception:ck(f'{width} full challenge flow',False,traceback.format_exc()[-1100:])
  ck(f'{width} shared algebra background',p.evaluate("(()=>{const el=document.querySelector('#F9-05 .nova-stage');return getComputedStyle(el).backgroundImage.includes('linear-gradient')&&getComputedStyle(el,'::before').backgroundImage.includes('data:image/svg')})()"))
  ck(f'{width} no browser JS errors',not errors,errors[:3]);p.close()
 b.close()
res={'passed':sum(c['pass'] for c in checks),'total':len(checks),'failures':[c for c in checks if not c['pass']],'tests':checks}
(root/'F9-05-qa-results.json').write_text(json.dumps(res,indent=2));print('SUMMARY',res['passed'],res['total'])
if res['failures']:raise SystemExit(1)
