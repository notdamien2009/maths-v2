from pathlib import Path
from playwright.sync_api import sync_playwright
html=(Path(__file__).resolve().parents[1]/'F5/F5-05-equivalent-fraction-multiplier.html').read_text()
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in [320,768]:
  pg=b.new_page(viewport={'width':width,'height':800},reduced_motion='no-preference');err=[];pg.on('pageerror',lambda ex:err.append(str(ex)))
  pg.set_content(html,wait_until='domcontentloaded');pg.locator('#F5-05 .nova-tab[data-m="explore"]').click();pg.evaluate('NOVA_F5_05_CONFIG._explore.set(2,3,2)')
  for target in [4,3,2,4]:
   grip=pg.locator('#F5-05 [data-factor-handle] .nv-hit');grip.scroll_into_view_if_needed();box=grip.bounding_box()
   pt=pg.evaluate('''k=>{let svg=document.querySelector('#F5-05 .eq-svg'),m=innerWidth<=670,x=(m?60:276)+35+(k-2)*((m?300:480)-70)/2,y=(m?797:529)+24,z=svg.createSVGPoint();z.x=x;z.y=y;let a=z.matrixTransform(svg.getScreenCTM());return {x:a.x,y:a.y}}''',target)
   pg.mouse.move(box['x']+box['width']/2,box['y']+box['height']/2);pg.mouse.down();pg.mouse.move(pt['x'],pt['y'],steps=15);pg.mouse.up();pg.wait_for_timeout(190)
   val=pg.evaluate('NOVA_F5_05_CONFIG._explore.get().k');assert val==target,(width,target,val)
   assert pg.evaluate('!NOVA.ui._drag && !document.querySelector(".nv-drag-lift")'),width
   print('PASS',width,'real pointer snap to ×'+str(target),flush=True)
  assert not err,err
  pg.close()
 b.close()
