from playwright.sync_api import sync_playwright
from pathlib import Path
import json
R=Path(__file__).resolve().parents[1];out=[]
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for w in [380,1280]:
  q=b.new_page(viewport={'width':w,'height':1000},reduced_motion='reduce');errs=[];q.on('pageerror',lambda e:errs.append(str(e)))
  q.set_content((R/'F3/F3-09-square-and-cube-builders.html').read_text());q.locator('#F3-09 button').filter(has_text='Explore').first.click();q.locator('#F3-09 .f309-svg').scroll_into_view_if_needed()
  def xy(x,y):return q.evaluate('''([x,y])=>{let s=document.querySelector('#F3-09 .f309-svg'),p=s.createSVGPoint();p.x=x;p.y=y;let c=p.matrixTransform(s.getScreenCTM());return [c.x,c.y]}''',[x,y])
  start=xy(196,1040);middle=xy(300,620);end=xy(425,745)
  q.mouse.move(*start);q.mouse.down();q.mouse.move(*middle,steps=1);q.mouse.move(*end,steps=1);q.mouse.move(*middle,steps=1)
  active=q.evaluate('!!NOVA.ui._drag')
  q.evaluate('window.dispatchEvent(new Event("blur"))');q.mouse.up();q.wait_for_timeout(480)
  clean=q.evaluate('!NOVA.ui._drag&&document.querySelector("#F3-09 .f309-svg").dataset.filled==="0"')
  out.append(dict(width=w,fastReversalActive=active,blurClean=clean,errors=errs));q.close()
 b.close()
(R/'tests/CANCEL-RESULTS.json').write_text(json.dumps(out,indent=2));print(out)
assert all(r['fastReversalActive'] and r['blurClean'] and not r['errors'] for r in out)
