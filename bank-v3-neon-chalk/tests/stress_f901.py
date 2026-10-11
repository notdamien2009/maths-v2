from pathlib import Path
from playwright.sync_api import sync_playwright
import json
html=Path('/mnt/data/f9_work/F9-01-matchstick-pattern-builder.html').read_text();res=[]
def test(name,ok,extra=None):print(('PASS ' if ok else 'FAIL ')+name,extra or '');res.append({'name':name,'ok':bool(ok),'detail':extra});
with sync_playwright() as s:
 b=s.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for width in [1280,380]:
  p=b.new_page(viewport={'width':width,'height':900},reduced_motion='reduce');p.set_default_timeout(2700);p.set_content(html);p.locator('.nova-tab[data-m="challenge"]').click();p.wait_for_timeout(80)
  def centre(q):
   bb=p.locator(q).bounding_box();return (bb['x']+bb['width']/2,bb['y']+bb['height']/2)
  def drag(a,b,release=True):
   p.evaluate("document.querySelector('#F9-01 .nova-stage').scrollIntoView({block:'start',behavior:'instant'})");p.wait_for_timeout(80)
   x,y=centre(a);tx,ty=centre(b);p.mouse.move(x,y);p.mouse.down();p.mouse.move(tx,ty,steps=16)
   if release:p.mouse.up()
  # invalid drag should spring back and no stranded
  drag('[data-tray=top]','[data-slot=right]');p.wait_for_timeout(420)
  test(f'{width} wrong target returns',p.locator('[data-tray=top]').count()==1 and p.locator('[data-placed=top]').count()==0)
  test(f'{width} wrong target clears active pointer',p.evaluate('NOVA.ui._drag===null'))
  # Escape mid drag (global core cancellation)
  drag('[data-tray=top]','[data-slot=top]',release=False);p.keyboard.press('Escape');p.mouse.up();p.wait_for_timeout(430)
  test(f'{width} Escape recovers',p.locator('[data-tray=top]').count()==1 and p.locator('[data-placed=top]').count()==0 and p.evaluate('NOVA.ui._drag===null'))
  # Place top then remove with drag
  drag('[data-tray=top]','[data-slot=top]');p.wait_for_timeout(220)
  test(f'{width} valid snap',p.locator('[data-placed=top]').count()==1)
  drag('[data-placed=top]','.f901-svg .nv-neon-box');p.wait_for_timeout(500)
  test(f'{width} red tray removes/regrabs',p.locator('[data-placed=top]').count()==0,p.locator('[data-tray=top]').count())
  test(f'{width} no stranded after removal',p.evaluate('NOVA.ui._drag===null'))
  p.close()
 b.close()
Path('/mnt/data/f9_work/F9-01-stress-results.json').write_text(json.dumps({'checks':len(res),'passes':sum(x['ok'] for x in res),'fails':[x for x in res if not x['ok']],'results':res},indent=2))
