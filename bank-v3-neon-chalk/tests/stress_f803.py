from pathlib import Path
from playwright.sync_api import sync_playwright
import json
R=Path(__file__).resolve().parents[1];html=(R/'F8/F8-03-function-machine.html').read_text(); checks=[]
def rec(n,ok,detail=''):checks.append({'test':n,'pass':bool(ok),'detail':str(detail)[:200]})
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for width in (380,1280):
  p=b.new_page(viewport={'width':width,'height':1600 if width==1280 else 940},reduced_motion='reduce')
  p.set_default_timeout(3500);p.set_content(html,wait_until='load');p.locator('#F8-03 .nova-tab[data-m="explore"]').click()
  p.locator('#F8-03 .f803-select').select_option('Y7-028')
  def dest(x,y):
   return p.evaluate('''([x,y])=>{const s=document.querySelector('#F8-03 .f803-svg'),b=s.getBoundingClientRect(),v=s.viewBox.baseVal;return{x:b.x+x/v.width*b.width,y:b.y+y/v.height*b.height}}''',[x,y])
  def drag(selector,x,y,steps=3):
   elt=p.locator(selector).first
   elt.scroll_into_view_if_needed(timeout=3000);box=elt.bounding_box();pos=dest(x,y)
   if not box:return False
   p.mouse.move(box['x']+box['width']/2,box['y']+box['height']/2)
   p.mouse.down();p.mouse.move(pos['x'],pos['y'],steps=steps);p.mouse.up();p.wait_for_timeout(130)
   return True
  mobile=width<=760
  hop=(220,248) if mobile else (154,234)
  try:
   drag('#F8-03 [data-input="4"]',*hop)
   rec(f'{width}/input-hopper',p.locator('#F8-03 [data-input="4"][data-placed="hopper"]').count()==1)
   rec(f'{width}/drag-clean-input',p.evaluate('!NOVA.ui._drag'))
   slots=([(100,563),(304,563)] if mobile else [(400,410),(660,410)])
   for i,k in enumerate(('m3','a2')):
    drag(f'#F8-03 [data-rule-card="{k}"]',*slots[i],steps=3)
    rec(f'{width}/rule-drop-{i}',p.locator(f'#F8-03 [data-placed-rule="{i}"]').count()==1)
    rec(f'{width}/no-stranded-{i}',p.evaluate('!NOVA.ui._drag'))
   rec(f'{width}/calculated-14',p.locator('#F8-03 .f803-feedback').get_attribute('data-status')=='correct' and '14' in p.locator('#F8-03 .f803-feedback').inner_text())
   # remove and replace rule by actual pointer to red return tray
   r=(220,1107) if mobile else (960,681)
   drag('#F8-03 [data-placed-rule="1"]',*r,steps=3)
   rec(f'{width}/regrab-return',p.locator('#F8-03 [data-placed-rule="1"]').count()==0)
   rec(f'{width}/no-stranded-return',p.evaluate('!NOVA.ui._drag'))
   # invalid drop must not place a rule or orphan an event
   drag('#F8-03 [data-rule-card="a2"]',*( (15,320) if mobile else (20,400)),steps=3)
   p.wait_for_timeout(440)
   rec(f'{width}/invalid-drop-rejected',p.locator('#F8-03 [data-placed-rule="1"]').count()==0)
   rec(f'{width}/invalid-drop-clean',p.evaluate('!NOVA.ui._drag'))
  except Exception as e:rec(f'{width}/pointer-error',False,e)
  p.close()
 b.close()
report={'checks':checks,'total':len(checks),'passed':sum(c['pass'] for c in checks),'failed':[c for c in checks if not c['pass']]};(R/'tests/F8-03-stress-results.json').write_text(json.dumps(report,indent=2));print(report['total'],report['passed'],len(report['failed']));print('\n'.join(str(x) for x in report['failed']))
