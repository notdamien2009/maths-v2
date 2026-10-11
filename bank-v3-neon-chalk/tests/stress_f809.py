"""Real pointer checks and keyboard handling. Verify the core drag state is always released."""
import json
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];HTML=(R/'F8/F8-09-substitution-table.html').read_text();checks=[]
def rec(n,ok,d=''):
 checks.append({'test':n,'pass':bool(ok),'detail':str(d)[:160]})
 if not ok:print('FAIL',n,d)
with sync_playwright() as P:
 b=P.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for width in [380,1280]:
  p=b.new_page(viewport={'width':width,'height':900},reduced_motion='reduce');p.set_content(HTML);p.locator('#F8-09 .nova-tab[data-m="explore"]').click()
  def state():return p.evaluate('({drag:NOVA.ui?._drag?.el?.getAttribute("data-tray-card")||NOVA.ui?._drag?.el?.getAttribute("data-placed-card")||null,placed:[...document.querySelectorAll("#F8-09 [data-placed-card]")].map(e=>[e.dataset.placedCard,e.dataset.col])})')
  card=p.locator('#F8-09 .f809-svg [data-tray-card="a0"]');zone=p.locator('#F8-09 .f809-svg [data-answer-slot="0"]')
  card.scroll_into_view_if_needed();p.wait_for_timeout(30);c=card.bounding_box();z=zone.bounding_box();rec(f'{width}/bounding-box',bool(c and z),(c,z))
  if c and z:
   p.mouse.move(c['x']+c['width']/2,c['y']+c['height']/2);p.mouse.down();p.mouse.move(z['x']+z['width']/2,z['y']+z['height']/2,steps=16);p.mouse.up();p.wait_for_timeout(50)
   v=state();rec(f'{width}/drag-to-slot',('a0','0') in [tuple(q) for q in v['placed']],v)
   rec(f'{width}/released',v['drag'] is None,v)
   # Re-grab and return the placed card to the red removal tray.
   placed=p.locator('#F8-09 .f809-svg [data-placed-card="a0"]');tray=p.locator('#F8-09 .f809-svg text').filter(has_text='RETURN VALUE').first
   placed.scroll_into_view_if_needed();p.wait_for_timeout(30);cc=placed.bounding_box();zz=tray.bounding_box();rec(f'{width}/regrab-boxes',bool(cc and zz))
   if cc and zz:
    p.mouse.move(cc['x']+cc['width']/2,cc['y']+cc['height']/2);p.mouse.down();p.mouse.move(zz['x']+zz['width']/2,zz['y']+zz['height']/2,steps=16);p.mouse.up();p.wait_for_timeout(60);v=state();rec(f'{width}/regrab-return',not v['placed'],v);rec(f'{width}/regrab-release',v['drag'] is None,v)
  # Keyboard alternative: focus value card and press Enter, then remove via Delete.
  button=p.locator('#F8-09 .f809-svg [data-tray-card="a1"]');button.focus();p.keyboard.press('Enter');p.wait_for_timeout(25);v=state();rec(f'{width}/keyboard-place',('a1','0') in [tuple(q) for q in v['placed']],v)
  if p.locator('#F8-09 .f809-svg [data-placed-card="a1"]').count():
   p.locator('#F8-09 .f809-svg [data-placed-card="a1"]').focus();p.keyboard.press('Delete');p.wait_for_timeout(25);rec(f'{width}/keyboard-delete',not state()['placed'],state())
  p.get_by_role('button',name='Check table').last.click();rec(f'{width}/empty-rejected','Fill all five' in p.locator('.f809-feedback').inner_text())
  p.close()
 b.close()
obj={'component':'F8-09','passed':sum(c['pass'] for c in checks),'total':len(checks),'failed':[c for c in checks if not c['pass']],'checks':checks};(R/'tests/F8-09-stress-results.json').write_text(json.dumps(obj,indent=2));print('STRESS',obj['passed'],'/',obj['total'])
if obj['failed']:raise SystemExit(1)
