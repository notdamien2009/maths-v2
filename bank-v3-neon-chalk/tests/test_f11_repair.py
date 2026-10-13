from playwright.sync_api import sync_playwright
from pathlib import Path
import json, math, traceback, time
root=Path(__file__).resolve().parents[1]; results=[]
def record(tag,ok,detail=''):
 results.append({'name':tag,'pass':bool(ok),'detail':str(detail)[:350]});print(('PASS' if ok else 'FAIL'),tag,detail)
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for id,file,code in [('F11-01','F11-01-protractor.html','f111'),('F11-02','F11-02-angle-estimator.html','f112')]:
  for w in [380,1280]:
   page=browser.new_page(viewport={'width':w,'height':900},device_scale_factor=1,reduced_motion='reduce')
   errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   html=(root/'F11'/file).read_text();page.set_content(html,wait_until='load');page.wait_for_timeout(250)
   nav=page.locator(f'#{id} .nova-tabs button')
   name=f'{id}-{w}'
   record(name+' no errors on load',not errors,errors)
   assert nav.count()==4,(name,nav.count())
   stage=page.locator(f'#{id} .{code}-theatre'); dock=stage.locator('> .nv-dock')
   record(name+' dock is in frame Watch',dock.count()==1)
   def inframe():
    return page.evaluate('''({id,code})=>{let frame=document.querySelector('#'+id+' .'+code+'-theatre');let dock=frame?.querySelector(':scope > .nv-dock');let f=frame?.getBoundingClientRect(),d=dock?.getBoundingClientRect();return {ok:!!(f&&d&&d.left>=f.left-2&&d.right<=f.right+2&&d.top>=f.top-2&&d.bottom<=f.bottom+2), frame: f?{x:f.x,y:f.y,width:f.width,height:f.height}:null,dock:d?{x:d.x,y:d.y,width:d.width,height:d.height}:null}}''',{'id':id,'code':code})
   b=inframe();record(name+' mascot and bubble within frame Watch',b['ok'],b)
   shotdir=root/'shots'/id;shotdir.mkdir(exist_ok=True,parents=True)
   page.screenshot(path=str(shotdir/(name+'-watch-fixed.png')),full_page=True)
   for mode in ['Guided','Explore','Challenge']:
    nav.filter(has_text=mode).click();page.wait_for_timeout(110)
    b=inframe();record(name+f' dock in frame {mode}',b['ok'],b if not b['ok'] else '')
    record(name+f' no errors {mode}',not errors,errors)
    if mode in ['Explore','Challenge']:
     page.screenshot(path=str(shotdir/(name+'-'+mode.lower()+'-fixed.png')),full_page=True)
   nav.filter(has_text='Explore').click();page.wait_for_timeout(130)
   handles= ['f111-arm-handle'] if id=='F11-01' else ['f112-arm-handle','f112-estimate-handle']
   for handleid in handles:
    selector=f'#{id} [data-testid="{handleid}"]'
    handle=page.locator(selector);record(name+' handle exists '+handleid,handle.count()==1)
    if handle.count()!=1:continue
    sl=f'#{id} [data-testid="'+('f111-angle-slider' if id=='F11-01' else ('f112-actual-slider' if 'arm-' in handleid else 'f112-estimate-slider'))+'"]'
    old=int(page.locator(sl).input_value())
    size=220 if 'estimate-' in handleid else 120
    target=170 if old<120 else 35
    pt=page.evaluate('''({id,code,deg,r})=>{let s=document.querySelector('#'+id+' .'+code+'-svg'),m=s.getScreenCTM(),p=s.createSVGPoint(); let b=document.querySelector('#'+id+' [data-testid$="preset"]')?.value || ''; let base=b==='left' ? 'left' : 'right';let x= id==='F11-01'?380:380,y=id==='F11-01'?445:297;let angle=(base==='left'?180-deg:deg)*Math.PI/180;p.x=x+Math.cos(angle)*r;p.y=y-Math.sin(angle)*r;let q=p.matrixTransform(m);return{x:q.x,y:q.y}}''',{'id':id,'code':code,'deg':target,'r':251 if id=='F11-01' else (232 if 'estimate-' in handleid else 151)})
    rect=handle.bounding_box();record(name+' handle visible '+handleid,bool(rect),rect)
    if not rect: continue
    sx=rect['x']+rect['width']/2;sy=rect['y']+rect['height']/2
    page.mouse.move(sx,sy);page.mouse.down();page.mouse.move(pt['x'],pt['y'],steps=1);page.wait_for_timeout(80)
    live=page.evaluate('''({id,code,kind})=>{let s=document.querySelector('#'+id+' .'+code+'-theatre');let c=s.querySelector(kind==='estimate'?'[data-live-estimate]':'[data-live-ray]');return c?.getAttribute('transform')||''}''',{'id':id,'code':code,'kind':'estimate' if 'estimate-' in handleid else 'actual'})
    record(name+' LIVE angle follows fast pointer '+handleid,'rotate(' in live and abs(float(live.split('rotate(')[1].split(' ')[0]))>3,live)
    page.mouse.up();page.wait_for_timeout(140)
    new=int(page.locator(sl).input_value());record(name+' FAST drag committed '+handleid,new!=old and abs(new-target)<14,f'old {old}, new {new}, expected {target}')
    record(name+' no drag stranded '+handleid,page.evaluate('!Boolean(NOVA.ui._drag)'))
    # cancel test: drag quickly to another angle then Escape before release
    handle=page.locator(selector); rect=handle.bounding_box(); sx=rect['x']+rect['width']/2;sy=rect['y']+rect['height']/2
    revert=150 if new < 90 else 20
    newpt=page.evaluate('''({id,code,deg,r})=>{let s=document.querySelector('#'+id+' .'+code+'-svg'),m=s.getScreenCTM(),p=s.createSVGPoint();let x=380,y=id==='F11-01'?445:297,angle=deg*Math.PI/180;p.x=x+Math.cos(angle)*r;p.y=y-Math.sin(angle)*r;let q=p.matrixTransform(m);return{x:q.x,y:q.y}}''',{'id':id,'code':code,'deg':revert,'r':251 if id=='F11-01' else(232 if 'estimate-' in handleid else 151)})
    page.mouse.move(sx,sy);page.mouse.down();page.mouse.move(newpt['x'],newpt['y'],steps=1);page.wait_for_timeout(50);page.keyboard.press('Escape');page.wait_for_timeout(420);page.mouse.up()
    cur=int(page.locator(sl).input_value());record(name+' Escape restores '+handleid,cur==new,f'expected {new}, got {cur}')
    record(name+' Escape clears capture '+handleid,page.evaluate('!Boolean(NOVA.ui._drag)'))
   record(name+' final no page errors',not errors,errors)
   page.close()
 browser.close()
report={'passed':sum(x['pass'] for x in results),'total':len(results),'checks':results}
(root/'tests').mkdir(exist_ok=True,parents=True)
(root/'tests/F11-01-F11-02-REPAIR-QA.json').write_text(json.dumps(report,indent=2))
print('RESULT',report['passed'],'/',report['total'])
