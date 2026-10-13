from playwright.sync_api import sync_playwright
from pathlib import Path
root=Path(__file__).resolve().parents[1]; tests=[]
def ok(t,cond,info=''):
 tests.append(bool(cond));print(('PASS' if cond else 'FAIL'),t,info)
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for id,file,pre,svgtest in [('F11-01','F11-01-protractor.html','f111','f111-protractor'),('F11-02','F11-02-angle-estimator.html','f112','f112-angle-svg')]:
  for w in [380,1280]:
   p=b.new_page(viewport={'width':w,'height':860},reduced_motion='reduce');err=[];p.on('pageerror',lambda e:err.append(str(e)))
   p.set_content((root/'F11'/file).read_text(),wait_until='load'); p.locator(f'#{id} .nova-tabs button').filter(has_text='Challenge').click();p.wait_for_timeout(50)
   if id=='F11-01':
    # Move to the construction challenge (fifth item): answer first four using deliberate correct responses
    for i,(angle,reason) in enumerate([(58,'right'),(125,'obtuse'),(135,'left'),(72,'whole')]):
     inp=p.locator('#F11-01 [data-testid=f111-answer]');inp.fill(str(angle));p.locator('#F11-01 [data-testid=f111-reason]').select_option(reason)
     p.locator('#F11-01 button').filter(has_text='Check angle + reason').click();p.wait_for_timeout(30)
     next=p.locator('#F11-01 button').filter(has_text='Continue to task');next.click();p.wait_for_timeout(40)
    h=p.locator('#F11-01 [data-testid=f111-arm-handle]')
    ok(f'{id}-{w} movable construction handle present',h.count()==1)
    h.scroll_into_view_if_needed();hb=h.bounding_box(); tar=p.evaluate('''(w)=>{let svg=document.querySelector('[data-testid="f111-protractor"]');let p=svg.createSVGPoint(),a=110*Math.PI/180;p.x=380+270*Math.cos(a);p.y=445-270*Math.sin(a);let q=p.matrixTransform(svg.getScreenCTM());return {x:q.x,y:q.y}}''',w)
    p.mouse.move(hb['x']+hb['width']/2,hb['y']+hb['height']/2);p.mouse.down();p.mouse.move(tar['x'],tar['y'],steps=1);p.mouse.up();p.wait_for_timeout(60)
    val=int(p.locator('#F11-01 [data-testid=f111-challenge-slider]').input_value());ok(f'{id}-{w} challenge drag updates slider & label',val==110,val)
    p.locator('#F11-01 [data-testid=f111-reason]').select_option('construct');p.locator('#F11-01 button').filter(has_text='Check angle + reason').click();p.wait_for_timeout(80)
    ok(f'{id}-{w} construction marked correct after drag', p.locator('#F11-01 .nova-fb').count()>0 and p.locator('#F11-01 .nova-fb.ok').count()==1,p.locator('#F11-01 .nova-fb').first.inner_text()[:80] if p.locator('#F11-01 .nova-fb').count() else 'none')
   else:
    h=p.locator('#F11-02 [data-testid=f112-estimate-handle]');h.scroll_into_view_if_needed();hb=h.bounding_box()
    tar=p.evaluate('''()=>{let svg=document.querySelector('[data-testid="f112-angle-svg"]'),p=svg.createSVGPoint(),a=63*Math.PI/180;p.x=380+232*Math.cos(a);p.y=297-232*Math.sin(a);let q=p.matrixTransform(svg.getScreenCTM());return{x:q.x,y:q.y}}''')
    p.mouse.move(hb['x']+hb['width']/2,hb['y']+hb['height']/2);p.mouse.down();p.mouse.move(tar['x'],tar['y'],steps=1);p.mouse.up();p.wait_for_timeout(80)
    val=p.locator('#F11-02 [data-testid=f112-answer]').input_value();ok(f'{id}-{w} challenge estimate drag syncs input', val=='63',val)
    p.locator('#F11-02 [data-testid=f112-reason]').select_option('acute');p.locator('#F11-02 button').filter(has_text='Check estimate + reason').click();p.wait_for_timeout(60)
    ok(f'{id}-{w} estimate marked correct after drag', p.locator('#F11-02 .nova-fb.ok').count()==1,p.locator('#F11-02 .nova-fb').first.inner_text()[:90])
   ok(f'{id}-{w} no runtime errors',not err,err)
   p.close()
 b.close()
print('EXTRA RESULT',sum(tests),'/',len(tests))
