from pathlib import Path
from playwright.sync_api import sync_playwright
import json
R=Path(__file__).resolve().parents[1];html=(R/'F3/F3-14-multiplication-table-explorer.html').read_text();results=[]
def mid(box):return box['x']+box['width']/2,box['y']+box['height']/2
def drag(page,src,dst,fast=False):
 src.scroll_into_view_if_needed();dst.scroll_into_view_if_needed()
 a=mid(src.bounding_box());b=mid(dst.bounding_box())
 page.mouse.move(*a);page.mouse.down()
 if fast:page.mouse.move(a[0]+115,a[1]-55,steps=1);page.mouse.move(*b,steps=1)
 else:page.mouse.move(*b,steps=8)
 page.mouse.up();page.wait_for_timeout(430)
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in [380,1280]:
  for motion in ['reduce','no-preference']:
   page=b.new_page(viewport={'width':width,'height':900},reduced_motion=motion)
   errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.set_content(html)
   page.locator('#F3-14 .nova-tab').filter(has_text='Explore').first.click();page.wait_for_timeout(60)
   stage=page.locator('#F3-14 svg.f314-svg');handle=stage.locator('[data-handle="crosshair"]');dst=stage.locator('[data-cell="5,6"]');
   drag(page,handle,dst,True)
   sel=page.locator('#F3-14 svg.f314-svg').get_attribute('data-selected')
   assert sel=='5,6',(width,motion,'crosshair drag',sel)
   results.append({'width':width,'motion':motion,'action':'crosshair fast place','result':sel})
   # Selected cell roving tabindex and focus arrows
   focused=page.locator('#F3-14 svg.f314-svg [tabindex="0"]');focused.focus();page.keyboard.press('ArrowDown');sel=page.locator('#F3-14 svg.f314-svg').get_attribute('data-selected');assert sel=='6,6',sel
   results.append({'width':width,'motion':motion,'action':'keyboard arrow','result':sel})
   # Escape from active drag must always settle and release.
   handle=page.locator('#F3-14 svg.f314-svg [data-handle="crosshair"]');handle.scroll_into_view_if_needed();a=mid(handle.bounding_box());page.mouse.move(*a);page.mouse.down();page.mouse.move(a[0]+80,a[1]+10,steps=1);page.keyboard.press('Escape');page.mouse.up();page.wait_for_timeout(440)
   assert not page.evaluate('!!NOVA.ui._drag')
   results.append({'width':width,'motion':motion,'action':'Escape cancellation','result':'cleared'})
   # Challenge product cards: incorrect drop returns, correct fast drop completes proof.
   page.locator('#F3-14 .nova-tab').filter(has_text='Challenge').first.click();page.wait_for_timeout(80)
   stage=page.locator('#F3-14 svg.f314-svg');dst=stage.locator('[data-cell="3,4"]');wrong=stage.locator('[data-product-card="12"]');drag(page,wrong,dst,True)
   assert stage.locator('[data-product-card="12"]').count()==1
   assert not page.evaluate('!!NOVA.ui._drag')
   results.append({'width':width,'motion':motion,'action':'wrong card returns','result':'not accepted'})
   right=stage.locator('[data-product-card="-12"]');drag(page,right,dst,True)
   page.wait_for_timeout(90)
   assert stage.locator('[data-placed-card="-12"]').count()==1
   page.locator('#F3-14 button').filter(has_text='Check proof').first.click();page.wait_for_timeout(1100)
   assert 'Proof 2 of 4' in page.locator('#F3-14 .nova-panel').inner_text(),(width,motion,'correct drag not accepted',page.locator('#F3-14 .nova-panel').inner_text()[-400:])
   assert not errors,errors
   assert not page.evaluate('!!NOVA.ui._drag')
   results.append({'width':width,'motion':motion,'action':'correct fast card','result':'proof 2'})
   page.close()
 b.close()
(R/'tests/DRAG-RESULTS.json').write_text(json.dumps(results,indent=2));print('DRAG PASS',len(results))
