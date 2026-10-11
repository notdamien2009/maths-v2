#!/usr/bin/env python3
import json,sys
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];file=R/'F4/F4-11-word-problem-highlighter.html';RESULT=R/'tests/F4-11-DRAG-RESULTS.json';checks=[]
def check(n,v,d=''):
 checks.append({'name':n,'passed':bool(v),'detail':str(d)[:100]});
 if not v:print('FAIL',n,d,flush=True)
def drag(page,fx,fy,tx,ty):
 box=page.locator('#F4-11 svg.f411-svg').bounding_box();s=box['width']/1000
 def pos(x,y):return (box['x']+x*s,box['y']+y*s)
 a=pos(fx,fy);b=pos(tx,ty);page.mouse.move(*a);page.mouse.down();page.mouse.move(*b,steps=8);page.mouse.up();page.wait_for_timeout(680)
def highlight(page,r):page.locator(f'#F4-11 .f411-tool[data-role="{r}"]').click();page.locator(f'#F4-11 .f411-phrase[data-phrase="{r}"]').click()
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [380,1280]:
  for reduced in ['reduce','no-preference']:
   page=b.new_page(viewport={'width':width,'height':1350},reduced_motion=reduced);page.set_default_timeout(7000);errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.set_content(file.read_text(),wait_until='domcontentloaded');page.get_by_role('tab',name='Explore').click()
   for i,r in enumerate(['whole','part','difference']):
    highlight(page,r);page.locator('#F4-11 svg.f411-svg').scroll_into_view_if_needed()
    targets={'whole':(500,203),'part':(375,431),'difference':(760,431)}
    drag(page,100+i*290+125,723+40,*targets[r]);state=page.locator(f'#F4-11 .f411-chip[data-phrase="{r}"]').get_attribute('data-placed');check(f'{width} {reduced} drop {r}',state=='true',state)
   # physical return should remove the whole from the model, then re-place with keyboard
   drag(page,500,203,815,870)
   check(f'{width} {reduced} returned whole',page.locator('#F4-11 .f411-chip[data-phrase="whole"]').get_attribute('data-placed')=='false')
   page.locator('#F4-11 .f411-chip[data-phrase="whole"]').focus();page.keyboard.press('Enter')
   check(f'{width} {reduced} keyboard reinstates',page.locator('#F4-11 .f411-chip[data-phrase="whole"]').get_attribute('data-placed')=='true')
   # invalid drop on a misplaced role must leave the chip in tray and produce explanation
   page.locator('#F4-11 .f411-phrase[data-phrase="part"]').click() # clear current 'difference'? change selected tool explicitly
   page.locator('#F4-11 .f411-tool[data-role="whole"]').click()
   page.locator('#F4-11 .f411-phrase[data-phrase="part"]').click()
   check(f'{width} {reduced} mismarked role',page.locator('#F4-11 .f411-chip[data-phrase="part"]').get_attribute('data-mark')=='whole')
   page.locator('#F4-11 .f411-chip[data-phrase="part"]').focus();page.keyboard.press('Enter')
   check(f'{width} {reduced} mismatch refused',page.locator('#F4-11 .f411-chip[data-phrase="part"]').get_attribute('data-placed')=='false')
   check(f'{width} {reduced} no errors',not errors,errors)
   page.close()
 b.close()
result={'passed':sum(c['passed'] for c in checks),'failed':sum(not c['passed'] for c in checks),'checks':checks};RESULT.write_text(json.dumps(result,indent=2));print('DRAG',result['passed'],'/',len(checks));sys.exit(bool(result['failed']))
