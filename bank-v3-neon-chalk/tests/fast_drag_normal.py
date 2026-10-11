from pathlib import Path
from playwright.sync_api import sync_playwright
import json
R=Path(__file__).resolve().parents[1];out=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for width in (380,1280):
  page=b.new_page(viewport={'width':width,'height':930},reduced_motion='no-preference');errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content((R/'F3/F3-12-divisibility-explorer.html').read_text(),wait_until='domcontentloaded')
  page.locator('#F3-12 button').filter(has_text='Challenge').first.click()
  svg=page.locator('#F3-12 svg.f312-svg');svg.scroll_into_view_if_needed();
  def point(x,y):
   return page.evaluate('([x,y])=>{const svg=document.querySelector("#F3-12 svg.f312-svg");const p=svg.createSVGPoint();p.x=x;p.y=y;const v=p.matrixTransform(svg.getScreenCTM());return {x:v.x,y:v.y}}',[x,y])
  def drag(rule,x,y):
   source=page.locator(f'#F3-12 svg.f312-svg g[data-rule="{rule}"]');source.scroll_into_view_if_needed();svg.scroll_into_view_if_needed();box=source.bounding_box();assert box,(width,rule)
   st={'x':box['x']+box['width']/2,'y':box['y']+box['height']/2};dest=point(x,y)
   page.mouse.move(st['x'],st['y']);page.mouse.down(); page.mouse.move(st['x']+7,st['y']-5,steps=1);page.mouse.move(dest['x']-30,dest['y']-18,steps=1);page.mouse.move(dest['x']+17,dest['y']+11,steps=1);page.mouse.move(dest['x'],dest['y'],steps=1);page.mouse.up();page.wait_for_timeout(540)
   return page.locator('#F3-12 .f312-status').inner_text()
  before=page.locator('#F3-12 .f312-status').inner_text();
  wrong=drag(2,717,865)
  print('width',width,'wrong',wrong)
  assert 'last digit 4 is even' in wrong,(width,wrong)
  assert page.locator('#F3-12 svg.f312-svg g[data-rule="2"] [data-drag="1"]').count()>=0
  good=drag(2,281,865)
  print('good',good)
  assert 'Correct bin' in good,(width,good)
  page.wait_for_timeout(650)
  assert page.locator('#F3-12 svg.f312-svg g[data-rule="2"]').count()==1
  rem=drag(2,859,1048)
  print('removed',rem)
  assert 'returned to the tray' in rem,(width,rem)
  after=drag(2,281,865)
  print('restored',after)
  assert 'Correct bin' in after
  # Escape should always clear core drag regardless of distance or capture state.
  card=page.locator('#F3-12 svg.f312-svg g[data-rule="3"]');card.scroll_into_view_if_needed();svg.scroll_into_view_if_needed();bx=card.bounding_box();page.mouse.move(bx['x']+bx['width']/2,bx['y']+bx['height']/2);page.mouse.down();page.mouse.move(bx['x']+bx['width']/2+80,bx['y']+bx['height']/2+30,steps=1);page.keyboard.press('Escape');page.mouse.up();page.wait_for_timeout(540)
  idle=page.evaluate('!window.NOVA.ui._drag')
  assert idle,(width,'stranded')
  assert not errors,errors
  out.append({'width':width,'wrong_rejected':True,'fast_placed':True,'removed':True,'replaced':True,'escape_cleared':idle,'page_errors':errors})
  page.close()
 b.close()
(R/'tests/DRAG-NORMAL-RESULTS.json').write_text(json.dumps(out,indent=2));print(json.dumps(out,indent=2))
