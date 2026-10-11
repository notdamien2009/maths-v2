import json,pathlib,sys
from playwright.sync_api import sync_playwright
R=pathlib.Path(__file__).resolve().parents[1];html=(R/'F6/F6-09-inverse-proportion-rectangle.html').read_text();good=[];bad=[]
def ck(n,f):
 try:f();good.append(n)
 except Exception as e:bad.append({'name':n,'error':str(e)[:350]});print('FAIL',n,str(e)[:130])
def must(v,m):
 if not v:raise AssertionError(m)
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu'])
 for width in [380,1280]:
  page=b.new_page(viewport={'width':width,'height':900});page.set_content(html,wait_until='domcontentloaded');page.locator('#F6-09 [data-m="explore"]').click();page.wait_for_timeout(130)
  def svgxy(x,y):
   return page.evaluate('([x,y])=>{const s=document.querySelector("#F6-09 svg.f609-svg"),p=s.createSVGPoint();p.x=x;p.y=y;const q=p.matrixTransform(s.getScreenCTM());return {x:q.x,y:q.y}}',[x,y])
  def home():
   return page.locator('#F6-09 [data-corner]').bounding_box()
  def drag(dest):
   page.locator('#F6-09 [data-corner]').scroll_into_view_if_needed();el=home();must(el is not None,'no drag handle');src={'x':el['x']+el['width']/2,'y':el['y']+el['height']/2};page.mouse.move(src['x'],src['y']);page.mouse.down();page.mouse.move(dest['x'],dest['y'],steps=6);page.mouse.up();page.wait_for_timeout(530)
  for idx,x in enumerate([2,3,4,6,8,12,8,4,6,2]):
   # from dimensions, slot centres 75+27+i*55 mobile, 95+27+i*64 desktop
   vals=[2,3,4,6,8,12];j=vals.index(x)
   page.locator('#F6-09 [data-corner]').scroll_into_view_if_needed();target=svgxy((75 if width==380 else 95)+27+j*(55 if width==380 else 64),(728 if width==380 else 815)-3)
   ck(f'{width} real drag width {x} iteration {idx}',lambda t=target,v=x:(drag(t),must(page.evaluate('F609_CONFIG._explore.get().x')==v,'width failed after drag')))
   ck(f'{width} no stranded pointer iteration {idx}',lambda:must(page.evaluate('!NOVA.ui._drag'),'pointer state stranded'))
  page.locator('#F6-09 [data-corner]').scroll_into_view_if_needed();target=svgxy(242 if width==380 else 540,826 if width==380 else 814)
  ck(f'{width} red tray resets corner',lambda:(drag(target),must(page.evaluate('F609_CONFIG._explore.get().x')==4,'return failed')))
  ck(f'{width} release outside stage without stale drag',lambda:(drag({'x':page.viewport_size['width']-3,'y':40}),must(page.evaluate('!NOVA.ui._drag'),'pointer captured after release')))
  page.close()
 b.close()
res={'suite':'stress','passed':len(good),'total':len(good)+len(bad),'failures':bad,'types':['real mouse move','snap','regrab','return tray','outside SVG pointer release'],'widths':[380,1280]};(R/'tests/f609-stress-results.json').write_text(json.dumps(res,indent=2));print('STRESS',res['passed'],'/',res['total']);sys.exit(bool(bad))
