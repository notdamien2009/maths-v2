from pathlib import Path
from playwright.sync_api import sync_playwright
import json,math,traceback
root=Path('/mnt/data/f11_05_work/bank-v3-neon-chalk')
html=(root/'F11/F11-05-parallel-lines-explorer.html').read_text()
shots=root/'shots/F11-05';shots.mkdir(parents=True,exist_ok=True)
test=[]
def check(name,val,details=''):
 test.append({'name':name,'pass':bool(val),'details':str(details)[:150]});print(('PASS' if val else 'FAIL'),name, details if not val else '')
def select_mode(page,mode):page.locator('#F11-05 .nova-tabs button').filter(has_text=mode).click();page.wait_for_timeout(120)
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [380,1280]:
  page=b.new_page(viewport={'width':width,'height':950},reduced_motion='reduce',device_scale_factor=1)
  errs=[];page.on('pageerror',lambda x:errs.append(str(x)))
  page.set_content(html,wait_until='load');page.wait_for_timeout(150)
  n=str(width)
  check(n+' shared NOVA core running',page.evaluate('typeof NOVA !== "undefined" && !!NOVA.neonPath && !!NOVA.scene.helperStrip'))
  check(n+' four learning modes',page.locator('#F11-05 .nova-tabs button').count()==4)
  check(n+' baseline stage and diagram',page.locator('#F11-05 .f115-theatre svg.f115-svg').count()==1)
  def contained():
   return page.evaluate('''() => {let a=document.querySelector('#F11-05 .f115-theatre'),b=a?.querySelector(':scope > .nv-dock');if(!a||!b)return false;let x=a.getBoundingClientRect(),y=b.getBoundingClientRect();return y.left>=x.left-1&&y.right<=x.right+1&&y.top>=x.top-1&&y.bottom<=x.bottom+1;}''')
  check(n+' mascot inside stage',contained())
  check(n+' stage background',page.evaluate("getComputedStyle(document.querySelector('#F11-05 .f115-theatre')).backgroundImage.includes('gradient')"))
  check(n+' NOVA Chalk embedded',page.evaluate("Array.from(document.styleSheets).some(s => {try{return [...s.cssRules].some(r=>r.cssText?.includes('NOVA Chalk'))}catch(e){return false}})"))
  select_mode(page,'Watch');page.wait_for_timeout(100)
  check(n+' Watch stages',page.locator('#F11-05 .f115-theatre').count()==1 and page.locator('#F11-05 .nv-dock').count()>0)
  page.screenshot(path=str(shots/f'F11-05-{n}-watch.png'),full_page=True)
  select_mode(page,'Guided');check(n+' Guided no JS errors',not errs,errs)
  page.screenshot(path=str(shots/f'F11-05-{n}-guided.png'),full_page=True)
  select_mode(page,'Explore');check(n+' explore active diagram',page.locator('#F11-05 [data-testid=f115-handle]').count()==1)
  slider=page.locator('#F11-05 [data-testid=f115-angle-range]')
  check(n+' slider initial 57',slider.input_value()=='57',slider.input_value())
  slider.fill('65');page.wait_for_timeout(80)
  check(n+' slider updates drawing',page.locator('#F11-05 [data-testid=f115-angle-display]').inner_text()=='65°')
  kind=page.locator('#F11-05 [data-testid=f115-kind]')
  for relation in ['corresponding','alternate','cointerior','vertically','bearings']:
   kind.select_option(relation);page.wait_for_timeout(100)
   check(n+' '+relation+' rendered',page.locator('#F11-05 .f115-theatre [data-testid=f115-handle]').count()==1 and not errs,errs)
   if relation in ['alternate','cointerior','bearings']:
    page.screenshot(path=str(shots/f'F11-05-{n}-{relation}-explore.png'),full_page=True)
  kind.select_option('corresponding');slider.fill('57');page.wait_for_timeout(100)
  handle=page.locator('#F11-05 [data-testid=f115-handle]');handle.scroll_into_view_if_needed();page.wait_for_timeout(80);rect=handle.bounding_box()
  check(n+' rotary drag handle visible',bool(rect),rect)
  if rect:
   at=page.evaluate('''() => {let s=document.querySelector('#F11-05 svg.f115-svg'),m=s.getScreenCTM(),p=s.createSVGPoint();p.x=393+(window.innerWidth<=760?91:145)*Math.cos(73*Math.PI/180);p.y=172-(window.innerWidth<=760?91:145)*Math.sin(73*Math.PI/180);let q=p.matrixTransform(m);return{x:q.x,y:q.y}}''')
   x,y=rect['x']+rect['width']/2,rect['y']+rect['height']/2
   page.mouse.move(x,y);page.mouse.down();page.mouse.move(at['x'],at['y'],steps=1);page.wait_for_timeout(150)
   v=slider.input_value();check(n+' fast drag live',abs(int(v)-73)<4,v)
   page.mouse.up();page.wait_for_timeout(130);check(n+' fast drag commits',abs(int(slider.input_value())-73)<4)
   check(n+' drag clears state',page.evaluate('!Boolean(NOVA.ui._drag)'))
   rect=page.locator('#F11-05 [data-testid=f115-handle]').bounding_box();x,y=rect['x']+rect['width']/2,rect['y']+rect['height']/2
   at=page.evaluate('''() => {let s=document.querySelector('#F11-05 svg.f115-svg'),m=s.getScreenCTM(),p=s.createSVGPoint();p.x=393+(window.innerWidth<=760?91:145)*Math.cos(42*Math.PI/180);p.y=172-(window.innerWidth<=760?91:145)*Math.sin(42*Math.PI/180);let q=p.matrixTransform(m);return{x:q.x,y:q.y}}''')
   saved=slider.input_value();page.mouse.move(x,y);page.mouse.down();page.mouse.move(at['x'],at['y'],steps=1);page.wait_for_timeout(80);page.keyboard.press('Escape');page.mouse.up();page.wait_for_timeout(130)
   check(n+' Escape drag cancel',slider.input_value()==saved,(saved,slider.input_value()))
   check(n+' Escape releases capture',page.evaluate('!Boolean(NOVA.ui._drag)'))
  handle=page.locator('#F11-05 [data-testid=f115-handle]');handle.focus();before=int(slider.input_value());page.keyboard.press('ArrowLeft');page.wait_for_timeout(90)
  check(n+' keyboard increment',int(slider.input_value())==before-1)
  page.screenshot(path=str(shots/f'F11-05-{n}-explore.png'),full_page=True)
  select_mode(page,'Challenge');check(n+' Challenge loaded',page.locator('#F11-05 [data-testid=f115-answer]').count()==1)
  answers=[57,63,68,74,39,52,62,58];reasons=['corresponding','alternate','cointerior','vertically','cointerior','bearings','alternate','cointerior']
  for i,(answer,reason) in enumerate(zip(answers,reasons)):
   if i==0:
    page.locator('#F11-05 [data-testid=f115-answer]').fill(str(answer))
    page.locator('#F11-05 button[data-reason=vertically]').click()
    page.locator('#F11-05 .f115-actions button').filter(has_text='Check').click();page.wait_for_timeout(70)
    check(n+' wrong reason refused',page.locator('#F11-05 .f115-actions button').filter(has_text='Check').count()==1)
   page.locator('#F11-05 [data-testid=f115-answer]').fill(str(answer))
   page.locator(f'#F11-05 button[data-reason={reason}]').click()
   page.locator('#F11-05 .f115-actions button').filter(has_text='Check').click();page.wait_for_timeout(75)
   check(n+f' challenge {i+1} angle and reason',page.locator('#F11-05 .f115-actions button').filter(has_text='Check').count()==0 and not errs,errs)
   if i==0:page.screenshot(path=str(shots/f'F11-05-{n}-challenge.png'),full_page=True)
   if i<7:page.locator('#F11-05 .f115-actions button').filter(has_text='Next challenge').click();page.wait_for_timeout(55)
  check(n+' challenge complete',page.locator('#F11-05 .f115-complete').count()==1)
  check(n+' no JS errors all modes',not errs,errs)
  check(n+' no body horizontal overflow',page.evaluate('document.documentElement.scrollWidth<=window.innerWidth+4'),page.evaluate('document.documentElement.scrollWidth-window.innerWidth'))
  page.close()
 b.close()
report={'passed':sum(x['pass'] for x in test),'total':len(test),'tests':test}
(root/'tests/F11-05-QA.json').write_text(json.dumps(report,indent=2))
print('SUMMARY',report['passed'],report['total'])
