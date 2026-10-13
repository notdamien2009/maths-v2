from pathlib import Path
from playwright.sync_api import sync_playwright
import json,traceback
root=Path(__file__).resolve().parent
html=(root/'F9-12-sequence-continuer.html').read_text()
shots=root/'f912-shots'; shots.mkdir(exist_ok=True); checks=[]
def ck(label,actual,detail=''):
 ok=bool(actual);checks.append({'name':label,'pass':ok,'detail':str(detail)[:450]});print(('PASS' if ok else 'FAIL'),label,str(detail)[:90],flush=True)
def mode(p,m):p.locator(f'#F9-12 .nova-tab[data-m="{m}"]').click();p.wait_for_timeout(90)
def place_kb(p,v,slot):
 p.locator(f'#F9-12 [data-source="term-{v}"]').focus();p.keyboard.press('Enter')
 p.locator(f'#F9-12 [data-slot="{slot}"]').focus();p.keyboard.press('Enter');p.wait_for_timeout(85)
with sync_playwright() as sp:
 b=sp.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in (380,1280):
  p=b.new_page(viewport={'width':width,'height':960},reduced_motion='reduce');p.set_default_timeout(6000);errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
  p.set_content(html,wait_until='domcontentloaded',timeout=45000);p.wait_for_timeout(160)
  ck(f'{width} mounted',p.locator('#F9-12').count()==1)
  ck(f'{width} four modes',p.locator('#F9-12 .nova-tab').count()==4)
  ck(f'{width} no horizontal overflow',p.evaluate('document.documentElement.scrollWidth<=innerWidth'))
  ck(f'{width} chalk typography',p.evaluate("getComputedStyle(document.querySelector('#F9-12 .f912-svg text')).fontFamily.includes('NOVA Chalk')"))
  ck(f'{width} shared algebra background',p.evaluate("(()=>{let e=document.querySelector('#F9-12 .nova-stage');return getComputedStyle(e).backgroundImage.includes('linear-gradient') && getComputedStyle(e,'::before').backgroundImage.includes('data:image/svg')})()"))
  for i in range(6):
   p.evaluate(f"NOVA.engines['F9-12'].timeline.pause();NOVA.engines['F9-12'].timeline.go({i},'qa')");p.wait_for_timeout(75)
   s=p.locator('#F9-12 .nova-stage');svg=s.locator('.f912-svg');text=svg.text_content()
   ck(f'{width} step {i+1} five nodes',svg.locator('.f912-term').count()==5)
   ck(f'{width} step {i+1} single mascot',s.locator('.nv-dock').count()==1 and s.locator('img').count()<=1)
   ck(f'{width} step {i+1} maths visible',svg.locator('.nv-neon-box').count()>=5)
   ck(f'{width} step {i+1} no browser exception',not errors,errors[:2])
   if i==0:ck(f'{width} reveal no early answer','13 + 3 = 16' not in text and 'Rule found: +3' not in text)
   if i==1:ck(f'{width} repeated +3 evidence', '7 − 4 = 3' in text and '10 − 7 = 3' in text)
   if i==2:ck(f'{width} first missing term', '10 + 3 = 13' in text)
   if i==3:ck(f'{width} second missing term', '13 + 3 = 16' in text)
   if i==4:ck(f'{width} subtract evidence', '16 − 4 = 12' in text and '12 − 4 = 8' in text)
   if i==5:ck(f'{width} multiplication evidence','8 × 2 = 16' in text and '16 × 2 = 32' in text)
   s.screenshot(path=str(shots/f'F9-12-{width}-watch-step{i+1}.png'))
  for m in ('guided','explore','challenge'):
   mode(p,m);s=p.locator('#F9-12 .nova-stage')
   ck(f'{width} {m} stage drawing',s.locator('.f912-svg').count()==1)
   ck(f'{width} {m} one mascot',s.locator('.nv-dock').count()==1)
   ck(f'{width} {m} background',p.evaluate("getComputedStyle(document.querySelector('#F9-12 .nova-stage'),'::before').backgroundImage.includes('data:image/svg')"))
   s.screenshot(path=str(shots/f'F9-12-{width}-{m}.png'))
  mode(p,'explore')
  ck(f'{width} three presets',p.locator('#F9-12 .f912-choices button').count()==3)
  p.get_by_role('button',name='Y7-036 · Subtract four').click()
  ck(f'{width} negative rule explored', '−4' in p.locator('#F9-12 .f912-svg').text_content())
  p.get_by_role('button',name='Y7-036 · Double each term').click()
  ck(f'{width} multiplying rule explored', '×2' in p.locator('#F9-12 .f912-svg').text_content())
  p.get_by_role('slider',name='How many terms are revealed').evaluate("e=>{e.value='4';e.dispatchEvent(new Event('input',{bubbles:true}))}")
  ck(f'{width} reveal slider works','4 terms' in p.locator('#F9-12 .nova-panel').text_content())
  mode(p,'challenge')
  try:
   ck(f'{width} challenge answers not in side cards','13' not in p.locator('#F9-12 .f912-side').text_content())
   ck(f'{width} two accessible slots',p.locator('#F9-12 [data-slot]').count()==2)
   p.get_by_role('button',name='Check both terms').click()
   ck(f'{width} blank challenge rejected', 'place both' in p.locator('#F9-12 .nova-fb').last.text_content().lower())
   place_kb(p,14,3)
   ck(f'{width} wrong term rejected',p.locator('#F9-12 [data-placed]').count()==0)
   ck(f'{width} misconception feedback','four' in p.locator('#F9-12 .nova-fb').last.text_content().lower())
   for i,(first,second) in enumerate([(13,16),(12,8),(16,32)]):
    place_kb(p,first,3);ck(f'{width} task {i+1} first term placed',p.locator('#F9-12 [data-placed="3"]').count()==1)
    place_kb(p,second,4);ck(f'{width} task {i+1} second term placed',p.locator('#F9-12 [data-placed="4"]').count()==1)
    ck(f'{width} task {i+1} no errors',not errors,errors[:2])
    p.get_by_role('button',name='Check both terms').click()
    if i<2:
     ck(f'{width} task {i+1} accepted',p.get_by_role('button',name=f'Continue to challenge {i+2}').count()==1)
     p.get_by_role('button',name=f'Continue to challenge {i+2}').click()
    else:ck(f'{width} all challenges complete','3 / 3' in p.locator('#F9-12 .nova-panel').text_content())
  except Exception:ck(f'{width} complete progression exception',False,traceback.format_exc()[-1450:])
  ck(f'{width} no JavaScript errors',not errors,errors[:4]);p.close()
 b.close()
r={'passed':sum(x['pass'] for x in checks),'total':len(checks),'failures':[x for x in checks if not x['pass']],'tests':checks}
(root/'F9-12-qa-results.json').write_text(json.dumps(r,indent=2));print('SUMMARY',r['passed'],r['total'])
if r['failures']:raise SystemExit(1)
