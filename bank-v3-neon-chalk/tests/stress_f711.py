from pathlib import Path
from playwright.sync_api import sync_playwright
import json
r=Path(__file__).resolve().parents[1];html=(r/'F7/F7-11-bar-model-equation.html').read_text();results=[]
def check(n,ok):results.append({'name':n,'pass':bool(ok)});print(n,ok,flush=True)
def btn(p,t):return p.locator('#F4-08 button').filter(has_text=t).first
def drag(p,loc,tx,ty):
 loc.scroll_into_view_if_needed(timeout=10000)
 box=loc.bounding_box(); assert box, 'no box'
 x0=box['x']+box['width']/2;y0=box['y']+box['height']/2
 x,y=p.evaluate('v=>{let svg=document.querySelector("#F4-08 .f408-svg"),z=svg.createSVGPoint();z.x=v[0];z.y=v[1];let a=z.matrixTransform(svg.getScreenCTM());return [a.x,a.y]}',[tx,ty]);
 p.mouse.move(x0,y0);p.mouse.down();p.mouse.move(x,y,steps=15);p.mouse.up();p.wait_for_timeout(90)
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in (380,1280):
  p=b.new_page(viewport={'width':width,'height':850},reduced_motion='reduce');errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
  p.set_content(html,wait_until='domcontentloaded');btn(p,'Explore').click(force=True)
  svg=p.locator('#F4-08 .f408-svg');
  # Source area first x-section
  def screen(x,y):return p.evaluate('p=>{let svg=document.querySelector("#F4-08 .f408-svg"), z=svg.createSVGPoint();z.x=p[0];z.y=p[1];let a=z.matrixTransform(svg.getScreenCTM());return [a.x,a.y]}',[x,y]);
  drag(p,p.locator('#F4-08 [data-supply="x"]'),200,395)
  check(f'{width}: native x drag adds bar piece',svg.get_attribute('data-count')=='1')
  # Wrong-location drop should recover without piece change.
  drag(p,p.locator('#F4-08 [data-supply="x"]'),480,80)
  check(f'{width}: invalid native drop springs back',svg.get_attribute('data-count')=='1')
  # Keyboard finish, then physical value drag.
  for _ in range(2):btn(p,'+ x part').click(force=True)
  btn(p,'+ known 5').click(force=True)
  btn(p,'Subtract knowns').click(force=True)
  inp=p.locator('#F4-08 input[aria-label="Remainder"]');inp.fill('21');inp.blur()
  btn(p,'Divide into').click(force=True)
  chip=p.locator('#F4-08 [data-answer="7"]')
  drag(p,chip,800,815)
  check(f'{width}: physical x answer drag sets correct value',p.locator('#F4-08 input[aria-label="Value of x"]').input_value()=='7')
  # Escape recovery check: drag counter then escape without release
  chip=p.locator('#F4-08 [data-answer="7"]')
  chip.scroll_into_view_if_needed();bb=chip.bounding_box();p.mouse.move(bb['x']+bb['width']/2,bb['y']+bb['height']/2);p.mouse.down();p.mouse.move(bb['x']+45,bb['y']-60,steps=4);p.keyboard.press('Escape');p.mouse.up()
  check(f'{width}: escape never strands active drag',p.evaluate('!NOVA.ui._drag'))
  check(f'{width}: drag produced no page errors',not errors)
  p.close()
 b.close()
obj={'passed':sum(x['pass'] for x in results),'total':len(results),'checks':results};(r/'tests/F7-11-POINTER-RESULTS.json').write_text(json.dumps(obj,indent=2));print('TOTAL',obj['passed'],obj['total'])
