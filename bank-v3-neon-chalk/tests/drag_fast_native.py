import json
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];results=[]
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in [380,1280]:
  q=b.new_page(viewport={'width':width,'height':1000},reduced_motion='reduce')
  errors=[];q.on('pageerror',lambda e:errors.append(str(e)))
  q.set_content((R/'F3/F3-09-square-and-cube-builders.html').read_text());q.locator('#F3-09 button').filter(has_text='Explore').first.click()
  svg=q.locator('#F3-09 .f309-svg');svg.scroll_into_view_if_needed()
  def coord(x,y):return q.evaluate('''([x,y])=>{const s=document.querySelector('#F3-09 .f309-svg');let p=s.createSVGPoint();p.x=x;p.y=y;let v=p.matrixTransform(s.getScreenCTM());return {x:v.x,y:v.y}}''',[x,y])
  def drag(a,b,steps=1):
   a=coord(*a);b=coord(*b);q.mouse.move(a['x'],a['y']);q.mouse.down();q.mouse.move(b['x'],b['y'],steps=steps);q.mouse.up();q.wait_for_timeout(650)
  def filled():return int(svg.get_attribute('data-filled'))
  results.append({'width':width,'test':'initial','pass':filled()==0})
  drag((196,1040),(310,373),1);results.append({'width':width,'test':'fast place first square unit','pass':filled()==1,'actual':filled()})
  drag((196,1040),(500,220),1);results.append({'width':width,'test':'wrong drop springs back','pass':filled()==1 and q.evaluate('!NOVA.ui._drag')})
  # re-grab a placed tile and remove to red zone
  drag((318,372),(816,1030),1);results.append({'width':width,'test':'remove completed tile','pass':filled()==0 and q.evaluate('!NOVA.ui._drag'),'actual':filled()})
  # active drag Escape
  a=coord(196,1040);z=coord(420,450);q.mouse.move(a['x'],a['y']);q.mouse.down();q.mouse.move(z['x'],z['y'],steps=1);q.keyboard.press('Escape');q.mouse.up();q.wait_for_timeout(600)
  results.append({'width':width,'test':'escape cancel','pass':filled()==0 and q.evaluate('!NOVA.ui._drag')})
  # change to 3D and perform native source drag at the highlighted ghost
  q.locator('#F3-09 .f309-row select').first.select_option('Y8-001');svg.scroll_into_view_if_needed()
  # first cube index 0 r=0,c=0,z=0 => x500 y590, target around y575
  drag((196,1040),(500,560),2);results.append({'width':width,'test':'3d unit placement','pass':filled()==1 and q.evaluate('!NOVA.ui._drag'),'actual':filled()})
  results.append({'width':width,'test':'console errors','pass':not errors,'errors':errors})
  q.close()
 b.close()
(R/'tests/DRAG-RESULTS.json').write_text(json.dumps(results,indent=2));print(json.dumps(results,indent=2))
assert all(x['pass'] for x in results)
