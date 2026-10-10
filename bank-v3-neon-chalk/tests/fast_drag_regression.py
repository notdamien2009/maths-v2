from pathlib import Path
import json,sys
from playwright.sync_api import sync_playwright
BASE=Path(__file__).resolve().parents[1]
RESULTS=[]
def report(page,engine,width,label,expected):
 active=page.evaluate('Boolean(NOVA.ui._drag)')
 errors=page.evaluate('window.__errors||[]')
 success=expected and not active and not errors
 RESULTS.append({'engine':engine,'width':width,'test':label,'passed':bool(success),'active':active,'errors':errors})
 if not success:print('FAIL',RESULTS[-1])

def cord(page, engine,x,y):
 return page.evaluate('''({id,x,y})=>{let s=document.querySelector('#'+id+' svg.f'+id.replace('F3-','').replace('-','')+'-svg');let p=s.createSVGPoint();p.x=x;p.y=y;const t=p.matrixTransform(s.getScreenCTM());return {x:t.x,y:t.y}}''',{'id':engine,'x':x,'y':y})

def pt(page,engine,x,y):
 cls='f305-svg' if engine=='F3-05' else 'f306-svg'
 return page.evaluate('''({id,cls,x,y})=>{const s=document.querySelector('#'+id+' svg.'+cls);const p=s.createSVGPoint();p.x=x;p.y=y;const t=p.matrixTransform(s.getScreenCTM());return [t.x,t.y]}''',{'id':engine,'cls':cls,'x':x,'y':y})
def movefast(page,engine,src,target,jumpy=True):
 svg=page.locator('#'+engine+' svg.'+('f305-svg' if engine=='F3-05' else 'f306-svg'));svg.scroll_into_view_if_needed();page.wait_for_timeout(50)
 start=pt(page,engine,*src);goal=pt(page,engine,*target)
 page.mouse.move(*start);page.mouse.down()
 if jumpy:
  page.mouse.move(goal[0]+12,goal[1]+20,steps=1)
  page.wait_for_timeout(25)
  page.mouse.move(goal[0]-20,goal[1]-12,steps=1)
  page.wait_for_timeout(25)
 page.mouse.move(*goal,steps=1)
 page.wait_for_timeout(90)
 actual=page.evaluate('''({id})=>{const el=document.querySelector('#'+id+' [data-drag="1"]:is([data-prime-card="2"],[data-factor-card="6"])');return {trans:el?.getAttribute('transform'),moving:!!NOVA.ui._drag}}''',{'id':engine})
 page.mouse.up();page.wait_for_timeout(800)
 return actual

with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for engine,folder,file in [('F3-06','.','F3-06-prime-factor-ladder.html')]:
  src=(BASE/folder/'F3'/file).read_text()
  for width in (380,1280):
   page=browser.new_page(viewport={'width':width,'height':1360},reduced_motion='no-preference')
   page.set_content(src,wait_until='domcontentloaded')
   page.evaluate('window.__errors=[];window.addEventListener("error",e=>window.__errors.push(e.message))')
   page.locator('#'+engine+' button').filter(has_text='Explore').first.click();page.wait_for_timeout(80)
   if engine=='F3-05':
    a=movefast(page,engine,(334,878),(450,400));v=page.locator('#F3-05 [data-value="4"]').first.get_attribute('aria-label')
    report(page,engine,width,'fast back-and-forth sieve prime 2',a['moving'] and bool(a['trans']) and 'crossed composite' in v)
    # change to 60 tree with a fast 1-frame gesture
    page.get_by_label('Curriculum preset').select_option('Y7-015-tree60');page.wait_for_timeout(120)
    a=movefast(page,engine,(98+5*111+37,890),(470,155),True) # d=7? choices 2,3,4,5,6,7,10 -> index 4 for 6
    # above used index5 = 7 so SHOULD reject and spring home
    report(page,engine,width,'wrong fast tree factor returns',a['moving'] and page.locator('#F3-05 [data-node]').count()==1)
    a=movefast(page,engine,(98+4*111+37,890),(470,155),True)
    report(page,engine,width,'fast tree factor 6 placement',a['moving'] and page.locator('#F3-05 [data-node]').count()==3)
   else:
    a=movefast(page,engine,(85,899),(234,230),True)
    report(page,engine,width,'fast factor 2 ladder placement',a['moving'] and page.locator('#F3-06 [data-rung]').count()==1)
    # Run one more escape after quick off-card jump, check cancelled with no stranded card
    start=pt(page,engine,85,899)
    page.mouse.move(*start);page.mouse.down();page.mouse.move(start[0]+100,start[1]-90,steps=1);page.keyboard.press('Escape');page.mouse.up();page.wait_for_timeout(500)
    report(page,engine,width,'fast Escape cancellation',page.locator('#F3-06 [data-rung]').count()==1)
   page.close()
 browser.close()
print(json.dumps(RESULTS,indent=2))
(BASE/'tests/FAST-DRAG-RESULTS.json').write_text(json.dumps(RESULTS,indent=2))
assert all(x['passed'] for x in RESULTS),'Fast drag regression failed'
