from pathlib import Path
from playwright.sync_api import sync_playwright
import json
R=Path(__file__).resolve().parents[1];html=(R/'F3/F3-14-multiplication-table-explorer.html').read_text();res=[]
def mid(box):return box['x']+box['width']/2,box['y']+box['height']/2
def drag(page,src,dst):
 src.scroll_into_view_if_needed();dst.scroll_into_view_if_needed()
 u=src.bounding_box();v=dst.bounding_box();max_bottom=max(u['y']+u['height'],v['y']+v['height']);min_top=min(u['y'],v['y']);height=page.viewport_size['height']
 if max_bottom>height-45:page.evaluate('(dy)=>window.scrollBy(0,dy)',max_bottom-(height-45))
 elif min_top<35:page.evaluate('(dy)=>window.scrollBy(0,dy)',min_top-35)
 a=mid(src.bounding_box());b=mid(dst.bounding_box());page.mouse.move(*a);page.mouse.down();page.mouse.move(a[0]+115,a[1]-55,steps=1);page.mouse.move(*b,steps=1);page.mouse.up();page.wait_for_timeout(490)
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in [380,1280]:
  page=b.new_page(viewport={'width':width,'height':900},reduced_motion='reduce');page.set_content(html)
  page.locator('#F3-14 .nova-tab').filter(has_text='Challenge').first.click()
  s=page.locator('#F3-14 svg.f314-svg');drag(page,s.locator('[data-product-card="-12"]'),s.locator('[data-cell="3,4"]'))
  assert s.locator('[data-placed-card="-12"]').count()==1,('place',width)
  s.screenshot(path=str(R/f'shots/F3-14-{width}-placed-stage.png'))
  drag(page,s.locator('[data-placed-card="-12"]'),s.locator('g.nv-neon-box').last) if False else None
  # red Remove zone coordinates are SVG x=837..1047 y=1102..1187
  c=s.locator('[data-placed-card="-12"]');c.scroll_into_view_if_needed()
  xy=page.evaluate('''() => {const s=document.querySelector('#F3-14 svg.f314-svg'),p=s.createSVGPoint();p.x=940;p.y=1144;const q=p.matrixTransform(s.getScreenCTM());return{x:q.x,y:q.y}}''')
  a=mid(c.bounding_box());if_need=xy['y']>page.viewport_size['height']-40
  if if_need:page.evaluate('(dy)=>window.scrollBy(0,dy)',xy['y']-(page.viewport_size['height']-45))
  xy=page.evaluate('''() => {const s=document.querySelector('#F3-14 svg.f314-svg'),p=s.createSVGPoint();p.x=940;p.y=1144;const q=p.matrixTransform(s.getScreenCTM());return{x:q.x,y:q.y}}''');a=mid(c.bounding_box());page.mouse.move(*a);page.mouse.down();page.mouse.move(a[0]+110,a[1]-35,steps=1);page.mouse.move(xy['x'],xy['y'],steps=1);page.mouse.up();page.wait_for_timeout(550)
  assert s.locator('[data-placed-card="-12"]').count()==0,('remove',width)
  assert s.locator('[data-product-card="-12"]').count()==1
  assert not page.evaluate('!!NOVA.ui._drag')
  res.append({'width':width,'place':True,'remove':True,'stranded':0})
  page.close()
 b.close()
(R/'tests/REMOVE-RESULTS.json').write_text(json.dumps(res,indent=2));print('REMOVE PASS',len(res))
