from playwright.sync_api import sync_playwright
from pathlib import Path
import json
R=Path(__file__).resolve().parents[1];s=(R/'F5/F5-19-pizza-and-chocolate-fraction-contexts.html').read_text();res=[]
def check(ok,label,width):
 res.append(dict(ok=bool(ok),label=label,width=width));print(('PASS' if ok else 'FAIL'),width,label,flush=True)
def svgpt(page,x,y):return page.evaluate('''([x,y])=>{const svg=document.querySelector('#F5-19 svg.context-svg');const p=svg.createSVGPoint();p.x=x;p.y=y;const out=p.matrixTransform(svg.getScreenCTM());return {x:out.x,y:out.y};}''',[x,y])
def drag(p,a,b):
 p.mouse.move(a['x'],a['y']);p.mouse.down();p.mouse.move(b['x'],b['y'],steps=14);p.mouse.up();p.wait_for_timeout(370)
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in (380,1280):
  page=browser.new_page(viewport={'width':width,'height':950},reduced_motion='reduce');page.set_content(s,wait_until='domcontentloaded')
  page.locator('#F5-19 .nova-tab[data-m="explore"]').click();page.evaluate('NOVA_F5_19_CONFIG._explore.preset("chocolateTwelve")');api='NOVA_F5_19_CONFIG._explore';page.wait_for_timeout(60)
  page.locator('#F5-19 [data-f519-piece="source-0"]').scroll_into_view_if_needed()
  source=(97,259) if width==380 else (152,327)
  target=(210,822) if width==380 else (831,417)
  drag(page,svgpt(page,*source),svgpt(page,*target))
  check(page.evaluate(api+'.get().count')==1,'chocolate square drag accepted',width)
  check(page.evaluate('NOVA.ui._drag===null'),'no stranded drag on accept',width)
  page.locator('#F5-19 [data-f519-piece="served-0"]').scroll_into_view_if_needed()
  from_served=(97,746) if width==380 else (696,327)
  to_source=(210,334) if width==380 else (287,417)
  drag(page,svgpt(page,*from_served),svgpt(page,*to_source))
  check(page.evaluate(api+'.get().count')==0,'chocolate square returned',width)
  check(page.evaluate('NOVA.ui._drag===null'),'no stranded drag after return',width)
  page.close()
 browser.close()
(R/'CHOCOLATE-DRAG-RESULTS.json').write_text(json.dumps(res,indent=2))
