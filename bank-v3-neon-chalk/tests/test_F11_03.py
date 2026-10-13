from playwright.sync_api import sync_playwright
from pathlib import Path
import json,math,traceback
root=Path(__file__).resolve().parents[1]
html=(root/'F11/F11-03-angle-facts.html').read_text()
results=[]
def check(n,cond,details=''):
 results.append({'check':n,'passed':bool(cond),'detail':str(details)[:250]});print(('PASS' if cond else 'FAIL'),n,details if not cond else '')
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in [380,1280]:
  page=browser.new_page(viewport={'width':w,'height':900},device_scale_factor=1,reduced_motion='reduce')
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(html,wait_until='load');page.wait_for_timeout(180)
  name=f'F11-03-{w}';rootp=f'#{"F11-03"}'
  nav=page.locator(rootp+' .nova-tabs button')
  check(name+' four canonical modes',nav.all_text_contents()==['Watch','Guided','Explore','Challenge'])
  def containment():
   return page.evaluate('''()=>{let f=document.querySelector('#F11-03 .f113-theatre'),d=f?.querySelector(':scope>.nv-dock'),v=d?.querySelector('svg.nv-dockfig');if(!f||!d||!v)return null;let a=f.getBoundingClientRect(),b=d.getBoundingClientRect(),c=v.getBoundingClientRect();return {inFrame:b.left>=a.left-2&&b.right<=a.right+2&&b.top>=a.top-2&&b.bottom<=a.bottom+2&&c.left>=a.left-2&&c.right<=a.right+2&&c.bottom<=a.bottom+2,w:c.width,h:c.height,bubble:d.querySelector('.nv-dockbub')?.getBoundingClientRect().width}}''')
  c=containment();check(name+' mascot entirely inside theatre Watch',bool(c and c['inFrame']),c)
  check(name+' larger F9-inspired mascot minimum',bool(c and c['h']>= (96 if w==380 else 135)),c)
  check(name+' F0 Chalk embedded',page.evaluate('''() => [...document.styleSheets].some(s=>{try{return [...s.cssRules].some(r=>r.cssText.includes('NOVA Chalk'))}catch(e){return false}})'''))
  check(name+' backdrop present',page.locator('.f113-theatre').evaluate("e=>getComputedStyle(e).backgroundImage.includes('gradient')"))
  (root/'shots/F11-03').mkdir(parents=True,exist_ok=True)
  page.screenshot(path=str(root/f'shots/F11-03/{name}-watch.png'),full_page=True)
  nav.filter(has_text='Guided').click();page.wait_for_timeout(120)
  check(name+' Guided maths stage',page.locator('.f113-theatre').count()==1)
  check(name+' no JS errors Guided',not errors,errors)
  c=containment();check(name+' mascot inside Guided',c['inFrame'] if c else False,c)
  page.screenshot(path=str(root/f'shots/F11-03/{name}-guided.png'),full_page=True)
  nav.filter(has_text='Explore').click();page.wait_for_timeout(150)
  check(name+' controls and first drag handle',page.locator('[data-testid=f113-angle-handle]').count()==1)
  check(name+' mascot inside Explore',containment()['inFrame'])
  check(name+' stage readable and no horizontal overflow',page.evaluate('document.documentElement.scrollWidth<=window.innerWidth+2'),page.evaluate('document.documentElement.scrollWidth'))
  # 7 presets smoke and responsive; image evidence for each.
  for kind in ['straight','point','vertical','parallel','triangle','bearing','proof']:
   page.locator('[data-testid=f113-preset]').select_option(kind);page.wait_for_timeout(110)
   check(name+f' Explore preset {kind} drawn',page.locator('.f113-theatre').get_attribute('data-kind')==('vertical' if kind=='proof' else kind))
   check(name+f' Explore preset {kind} no browser exception',not errors,errors[-2:])
   check(name+f' Explore preset {kind} mascot in stage',containment()['inFrame'])
   if kind in ['straight','parallel','triangle','bearing']:
    page.screenshot(path=str(root/f'shots/F11-03/{name}-{kind}-explore.png'),full_page=True)
  # Reset first preset, stress with one rapid mouse motion and verify live ray and slider value.
  page.locator('[data-testid=f113-preset]').select_option('straight');page.wait_for_timeout(100)
  handle=page.locator('[data-testid=f113-angle-handle]');rect=handle.bounding_box()
  pxy=page.evaluate('''()=>{let s=document.querySelector('#F11-03 [data-testid=f113-svg]'),m=s.getScreenCTM(),p=s.createSVGPoint();p.x=360+Math.cos(80*Math.PI/180)*245;p.y=327-Math.sin(80*Math.PI/180)*245;let x=p.matrixTransform(m);return {x:x.x,y:x.y}}''')
  if rect:
   old=int(page.locator('[data-testid=f113-angle-slider]').input_value())
   page.mouse.move(rect['x']+rect['width']/2,rect['y']+rect['height']/2);page.mouse.down();page.mouse.move(pxy['x'],pxy['y'],steps=1);page.wait_for_timeout(70)
   tr=page.locator('[data-live-ray]').first.get_attribute('transform')
   check(name+' live ray tracks rapid motion',bool(tr and 'rotate(' in tr and abs(float(tr.split('rotate(')[1].split(' ')[0]))>2),tr)
   page.mouse.up();page.wait_for_timeout(150)
   new=int(page.locator('[data-testid=f113-angle-slider]').input_value())
   check(name+' fast drag committed',abs(new-80)<=8,(old,new))
   check(name+' drag capture released',page.evaluate('!Boolean(NOVA.ui._drag)'))
   handle=page.locator('[data-testid=f113-angle-handle]');r=handle.bounding_box()
   if r:
    page.mouse.move(r['x']+r['width']/2,r['y']+r['height']/2);page.mouse.down();page.mouse.move(pxy['x']+10,pxy['y']-40,steps=1);page.keyboard.press('Escape');page.wait_for_timeout(40);page.mouse.up()
    check(name+' Escape cancellation restores value',int(page.locator('[data-testid=f113-angle-slider]').input_value())==new)
    check(name+' cancelled drag not stranded',page.evaluate('!Boolean(NOVA.ui._drag)'))
  # Challenge cases include exact numerical result + selected reason
  nav.filter(has_text='Challenge').click();page.wait_for_timeout(140)
  check(name+' Challenge mascot in stage',containment()['inFrame'])
  tasks=[(57,'straight'),(60,'point'),(68,'vertical'),(112,'vertical'),(74,'parallel'),(65,'triangle'),(305,'bearing'),(67,'vertical')]
  for i,(answer,reason) in enumerate(tasks):
   ans=page.locator('[data-testid=f113-answer]');ans.fill(str(answer));page.locator(f'[data-reason="{reason}"]').click();page.locator('.f113-actions .nova-btn').first.click();page.wait_for_timeout(90)
   visible=page.locator('.f113-theatre .f113-card').first.inner_text()
   check(name+f' Challenge {i+1} correct angle and reason',str(answer) in visible or page.locator('.f113-complete').count()>0,(visible[:100],errors[-2:]))
   if i==0:page.screenshot(path=str(root/f'shots/F11-03/{name}-challenge.png'),full_page=True)
   if i<7:
    next=page.locator('.f113-actions button').filter(has_text='Next angle fact')
    if next.count():next.click();page.wait_for_timeout(75)
    else:check(name+f' Challenge {i+1} next button',False)
  check(name+' 8/8 completion visible',page.locator('.f113-complete').count()==1)
  check(name+' no runtime exceptions',not errors,errors)
  page.close()
 browser.close()
report={'passed':sum(x['passed'] for x in results),'total':len(results),'checks':results}
(root/'tests/F11-03-QA.json').write_text(json.dumps(report,indent=2))
print('RESULT:',report['passed'],'/',report['total'])
