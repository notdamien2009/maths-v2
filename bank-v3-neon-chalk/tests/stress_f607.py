import json,pathlib,sys
from playwright.sync_api import sync_playwright
r=pathlib.Path(__file__).resolve().parents[1];HTML=(r/'F6/F6-07-map-and-scale-drawing.html').read_text();checks=[];fails=[]
def check(n,ok):
 checks.append(n)
 if not ok:fails.append(n);print('FAIL',n)
def svg_pt(page,x,y):
 return page.evaluate('''([x,y])=>{const svg=document.querySelector('#F6-07 .f607-svg');const pt=svg.createSVGPoint();pt.x=x;pt.y=y;const m=pt.matrixTransform(svg.getScreenCTM());return [m.x,m.y]}''',[x,y])
def drag(page,start,end,steps=6):
 a=svg_pt(page,*start);b=svg_pt(page,*end)
 # Scroll both start and destination into the same viewport before real pointer movement.
 h=page.viewport_size['height'];desired=(a[1]+b[1])/2-h/2
 page.evaluate('(delta)=>window.scrollBy(0,delta)',desired);page.wait_for_timeout(80)
 a=svg_pt(page,*start);b=svg_pt(page,*end)
 page.mouse.move(*a);page.mouse.down();page.mouse.move(*b,steps=steps);page.mouse.up();page.wait_for_timeout(120)
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu'])
 for width in [380,1280]:
  page=browser.new_page(viewport={'width':width,'height':920});page.set_content(HTML,wait_until='domcontentloaded');page.locator('#F6-07 [data-m="explore"]').click();page.wait_for_timeout(220)
  p0={'Y7-064':(4,0),'Y7-064-library':(3,4),'Y9-021':(6,8),'Y9-021-urban':(5,0)}
  for preset,(dx,dy) in p0.items():
   page.evaluate('(v)=>F607_CONFIG._explore.setPreset(v)',preset);page.wait_for_timeout(100)
   mobile=width<=760;size=max(dx,dy);base=min(43,240/size) if mobile else min(63,390/size);pix=min(base,(220 if mobile else 250)/dy) if dy>0 else base
   ax,ay=(104,245) if mobile else (235,245);bx,by=ax+dx*pix,ay+dy*pix
   ty=1005 if mobile else 1006;home1=(105 if mobile else 246,ty);home2=(196 if mobile else 357,ty)
   # A/B and scale marker drop check.
   drag(page,home1,(ax,ay))
   check(f'{width}/{preset} A physically dragged',page.evaluate('F607_CONFIG._explore.get().placed.A')=='A')
   drag(page,home2,(bx,by))
   check(f'{width}/{preset} B physically dragged',page.evaluate('F607_CONFIG._explore.get().placed.B')=='B')
   pos=(259 if mobile else 483,ty);tx=(76+330/8 if mobile else 140+690/8);sy=816 if mobile else 819
   drag(page,pos,(tx,sy-25))
   check(f'{width}/{preset} 1cm scale physically dragged',page.evaluate('F607_CONFIG._explore.get().placed.scale')=='scale')
   check(f'{width}/{preset} no stuck pointer after scale',page.evaluate('NOVA.ui._drag===null||NOVA.ui._drag===undefined'))
   page.evaluate('F607_CONFIG._explore.check()');check(f'{width}/{preset} all placed correct', 'All three placements correct' in page.evaluate('F607_CONFIG._explore.get().message'))
   # Returning already snapped A to return tray; verifies re-grab and remove.
   rtx,rty=(366,1007) if mobile else (919,1009)
   drag(page,(ax,ay),(rtx,rty))
   page.wait_for_timeout(470)
   check(f'{width}/{preset} regrab A + red tray',page.evaluate('F607_CONFIG._explore.get().placed.A===undefined'))
   check(f'{width}/{preset} all drag states cleared',page.evaluate('!NOVA.ui._drag'))
  page.close()
 browser.close()
res={'suite':'stress','passed':len(checks)-len(fails),'total':len(checks),'failures':fails,'widths':[380,1280], 'scenarios':list(p0)}
(r/'tests/f607-stress-results.json').write_text(json.dumps(res,indent=2));print('STRESS',res['passed'],'/',res['total']);sys.exit(1 if fails else 0)
