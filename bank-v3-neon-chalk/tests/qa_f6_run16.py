from pathlib import Path
from playwright.sync_api import sync_playwright
import json, traceback, time, os
BASE=Path(__file__).resolve().parent.parent; OUT=BASE/'shots/F6-qa-closure';OUT.mkdir(parents=True,exist_ok=True)
results=[]
def rec(id,w,label,ok,detail=''):
 results.append({'engine':id,'width':w,'test':label,'passed':bool(ok),'detail':str(detail)[:300]});print(id,w,label,'PASS' if ok else 'FAIL',str(detail)[:160],flush=True)
def loc(page,svg_sel,x,y):
 return page.evaluate('''({sel,x,y})=>{const s=document.querySelector(sel), p=s.createSVGPoint();p.x=x;p.y=y; const q=p.matrixTransform(s.getScreenCTM());return {x:q.x,y:q.y};}''',{'sel':svg_sel,'x':x,'y':y})
def drag(page,id,src,dst,steps=8):
 sel=f'#{id} svg.'+('f601-svg' if id=='F6-01' else 'f602-svg')
 a=loc(page,sel,*src);b=loc(page,sel,*dst)
 if min(a['y'],b['y'])<18 or max(a['y'],b['y'])>page.viewport_size['height']-22:
  page.evaluate('(y)=>window.scrollBy(0,y)',(a['y']+b['y'])/2-page.viewport_size['height']/2)
  a=loc(page,sel,*src);b=loc(page,sel,*dst)
 page.mouse.move(a['x'],a['y']);page.mouse.down();page.mouse.move(b['x'],b['y'],steps=steps);page.mouse.up();page.wait_for_timeout(180)
 return {'source':a,'destination':b}
import shutil
with sync_playwright() as pw:
 launch={'headless':True,'args':['--no-sandbox','--disable-dev-shm-usage']}
 if shutil.which('chromium'):launch['executable_path']=shutil.which('chromium')
 b=pw.chromium.launch(**launch)
 for id,file in [('F6-01','ratio-table'),('F6-02','double-number-line')]:
  html=(BASE/f'F6/{id}-{file}.html').read_text()
  for w in [380,430,768,1280]:
   page=b.new_page(viewport={'width':w,'height':980},reduced_motion='reduce');errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
   try:
    page.set_content(html,wait_until='load',timeout=16000)
    rec(id,w,'no JS errors at load',not errs,errs)
    for mode in ['Watch','Guided','Explore','Challenge']:
     page.get_by_role('tab',name=mode,exact=True).first.click(timeout=7000);page.wait_for_timeout(35)
     rec(id,w,mode+' visible SVG',page.locator(f'#{id} svg.'+('f601-svg' if id=='F6-01' else 'f602-svg')).count()==1)
     rec(id,w,mode+' no horizontal page overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth+2'))
     if id=='F6-02':rec(id,w,mode+' both F0 numberlines',page.locator(f'#{id} svg g.nv-numberline').count()==2,page.locator(f'#{id} svg g.nv-numberline').count())
     if os.getenv('NOVA_CAPTURE_SCREENSHOTS') == '1' and mode in ['Explore','Challenge']:
      page.locator(f'#{id}').screenshot(path=str(OUT/f'{id}-{w}-{mode.lower()}.png'),animations='disabled',timeout=12000)
    page.get_by_role('tab',name='Explore',exact=True).first.click()
    if id=='F6-01':
     C='F601_CONFIG'
     page.evaluate("F601_CONFIG._explore.setPreset('Y7-060')")
     p=page.evaluate('F601_CONFIG._explore.get()');rec(id,w,'initial entries blank',p['entries']==[None,None],p)
     # Drag multiplier x3 to lane A, then B. In mobile tile x132-> lane ~115, desktop tile x263-> lane ~242
     mob=(w<690);y=808 if mob else 758;xx=132 if mob else 263;laneA=(115 if mob else 242,395);laneB=(305 if mob else 568,395)
     drag(page,id,(xx+32,y+29),laneA,steps=10)
     p=page.evaluate('F601_CONFIG._explore.get()');rec(id,w,'physical multiplier drag to A',p['factors'][0]==3,p)
     drag(page,id,(xx+32,y+29),laneB,steps=10)
     p=page.evaluate('F601_CONFIG._explore.get()');rec(id,w,'physical multiplier drag to B',p['factors'][1]==3,p)
     # Value tiles into result cells. Drag from tray; re-evaluate coords after rerender
     yl=901 if mob else 850
     for col,srcx,targetx in [(0,61 if mob else 208,115 if mob else 242),(1,239 if mob else 514,305 if mob else 568)]:
      drag(page,id,(srcx+48,yl+30),(targetx,580 if mob else 564),steps=10)
      v=page.evaluate('F601_CONFIG._explore.get()');rec(id,w,'physical value drag '+str(col),v['entries'][col] is not None,v)
     page.evaluate('F601_CONFIG._explore.check()');v=page.evaluate('F601_CONFIG._explore.get()');rec(id,w,'explore check correct','Correct' in v['status'],v)
     # re-grab remove entry using ring to red return
     a=(35+160-21 if mob else 98+289-26,528+23 if mob else 512+23); ret=(211 if mob else 930,1038 if mob else 790)
     drag(page,id,a,ret,steps=8);v=page.evaluate('F601_CONFIG._explore.get()');rec(id,w,'remove entered A via drag',v['entries'][0] is None,v)
     rec(id,w,'drag session cleared',page.evaluate('NOVA.ui._drag===null'),page.evaluate('NOVA.ui._drag===null'))
     page.get_by_role('tab',name='Challenge',exact=True).first.click()
     page.evaluate('(v)=>F601_CONFIG._challenge.answer(v)',999);page.evaluate('F601_CONFIG._challenge.check()')
     rec(id,w,'incorrect answer rejected',page.evaluate('F601_CONFIG._challenge.get().solved')==0)
     for idx,ans in enumerate([10,3,4,6]):
      page.evaluate('(v)=>F601_CONFIG._challenge.answer(v)',ans);page.evaluate('F601_CONFIG._challenge.check()')
      v=page.evaluate('F601_CONFIG._challenge.get()');rec(id,w,'challenge right '+str(idx+1),v['solved']==idx+1,v)
      if idx<3:page.evaluate('F601_CONFIG._challenge.next()')
    else:
     page.evaluate("F602_CONFIG._explore.setPreset('Y7-060')")
     page.get_by_role('button',name='One mark →').click();v=page.evaluate('F602_CONFIG._explore.get()');rec(id,w,'button marker increments',v['a']==3 and v['b']==9,v)
     page.get_by_role('button',name='Reset',exact=True).click()
     mob=w<=680;Gx=56 if mob else 87;Gw=328 if mob else 682;Gtop=277 if mob else 271;Gmax=10
     def pos(x):return (Gx+Gw*x/Gmax,Gtop)
     drag(page,id,pos(2),pos(8),steps=16);v=page.evaluate('F602_CONFIG._explore.get()');rec(id,w,'physical linked marker drag to 8',v['a']==8 and v['b']==24,v)
     drag(page,id,pos(8),pos(3),steps=3);v=page.evaluate('F602_CONFIG._explore.get()');rec(id,w,'fast regrab drag to 3',v['a']==3 and v['b']==9,v)
     page.locator('#F6-02 .f602-pair').focus();page.keyboard.press('ArrowRight');v=page.evaluate('F602_CONFIG._explore.get()');rec(id,w,'keyboard linked marker to 4',v['a']==4 and v['b']==12,v)
     page.keyboard.press('Delete');v=page.evaluate('F602_CONFIG._explore.get()');rec(id,w,'keyboard remove marker',v['visible']==False,v)
     page.get_by_role('button',name='Restore marker').click();v=page.evaluate('F602_CONFIG._explore.get()');rec(id,w,'restore marker',v['visible']==True,v)
     rec(id,w,'drag session cleared',page.evaluate('NOVA.ui._drag===null'))
     page.get_by_role('tab',name='Challenge',exact=True).first.click()
     page.evaluate('(v)=>F602_CONFIG._challenge.setAnswer(v)',999);page.evaluate('F602_CONFIG._challenge.check()')
     rec(id,w,'incorrect answer rejected',page.evaluate('F602_CONFIG._challenge.get().solved')==0)
     for idx,ans in enumerate([24,75,22.5,18]):
      page.evaluate('(v)=>F602_CONFIG._challenge.setAnswer(v)',ans);page.evaluate('F602_CONFIG._challenge.check()')
      v=page.evaluate('F602_CONFIG._challenge.get()');rec(id,w,'challenge right '+str(idx+1),v['solved']==idx+1,v)
      if idx<3:page.evaluate('F602_CONFIG._challenge.next()')
    rec(id,w,'no JS errors final',not errs,errs)
   except Exception as e:
    rec(id,w,'SUITE ERROR',False,str(e)[:800]);traceback.print_exc(limit=2)
   page.close()
 b.close()
(OUT/'run16-results.json').write_text(json.dumps({'tests':results,'total':len(results),'passed':sum(x['passed'] for x in results)},indent=2))
print('ALL',sum(x['passed'] for x in results),'/',len(results),flush=True)
