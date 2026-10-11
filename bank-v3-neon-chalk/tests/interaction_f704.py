from pathlib import Path
from playwright.sync_api import sync_playwright
import json, traceback
r=Path(__file__).resolve().parents[1];html=(r/'F7/F7-04-expanding-single-brackets.html').read_text();records=[]
def test(n,c,d=''):
 records.append({'name':n,'passed':bool(c),'detail':str(d)})
 if not c:print('FAIL',n,d,flush=True)

def drag(page,src,target,steps=10):
 a=page.locator(src).first.bounding_box();b=page.locator(target).first.bounding_box()
 if not a or not b:raise RuntimeError(f'No rect {src} {a} / {target} {b}')
 x,y=a['x']+a['width']/2,a['y']+a['height']/2;X,Y=b['x']+b['width']/2,b['y']+b['height']/2
 page.mouse.move(x,y);page.mouse.down();page.mouse.move(X,Y,steps=steps);page.mouse.up();page.wait_for_timeout(90)

def check_placement(page,r):
 return page.locator(f'#F3-02 [data-region="{r}"]').text_content()
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width,motion in [(380,'reduce'),(1280,'reduce'),(1280,'no-preference')]:
  page=b.new_page(viewport={'width':width,'height':1100},reduced_motion=motion);page.set_default_timeout(3500);err=[];page.on('pageerror',lambda e:err.append(str(e)))
  try:
   page.set_content(html,wait_until='load');page.locator('#F3-02 button:has-text("Challenge")').first.click();page.wait_for_timeout(160);page.evaluate("() => window.scrollTo(0,document.querySelector('#F3-02 .nova-stage').getBoundingClientRect().top+scrollY-80)");page.wait_for_timeout(90)
   test(f'{width}-{motion}-start',page.locator('#F3-02 [data-card-index]').count()==3)
   # Check wrong placement reverses: number six dropped on x region
   drag(page,'#F3-02 [data-card-index="1"]','#F3-02 [data-region="0"]',12)
   test(f'{width}-{motion}-invalid-rollback',page.locator('#F3-02 [data-card-index="1"]').count()==1)
   test(f'{width}-{motion}-invalid-diagnostic','x area' in page.locator('#F3-02').inner_text(),page.locator('#F3-02').inner_text()[-350:])
   # Correct 2x to region 0 and 6 to region 1
   drag(page,'#F3-02 [data-card-index="0"]','#F3-02 [data-region="0"]')
   test(f'{width}-{motion}-first-drag',page.locator('#F3-02 [data-filled-index="0"]').count()==1,check_placement(page,0))
   drag(page,'#F3-02 [data-card-index="1"]','#F3-02 [data-region="1"]')
   test(f'{width}-{motion}-second-drag',page.locator('#F3-02 [data-filled-index="1"]').count()==1,check_placement(page,1))
   # remove by keyboard then place with keyboard
   page.locator('#F3-02 [data-filled-index="0"]').focus();page.keyboard.press('Delete');page.wait_for_timeout(75)
   test(f'{width}-{motion}-keyboard-remove',page.locator('#F3-02 [data-card-index="0"]').count()==1)
   page.locator('#F3-02 [data-card-index="0"]').focus();page.keyboard.press('Enter');page.wait_for_timeout(90)
   test(f'{width}-{motion}-region-selection',page.locator('#F3-02 [data-drop-region]').count()==2)
   page.locator('#F3-02 [data-drop-region="0"]').focus();page.keyboard.press('Enter');page.wait_for_timeout(80)
   test(f'{width}-{motion}-keyboard-place',page.locator('#F3-02 [data-filled-index="0"]').count()==1)
   page.locator('#F3-02 input[aria-label="Expanded single bracket"]').fill('2x + 6')
   page.locator('#F3-02 button:has-text("Check expansion")').click();page.wait_for_timeout(100)
   test(f'{width}-{motion}-round-1-passed','Challenge 2 of 4' in page.locator('#F3-02').inner_text())
   # complete remaining rounds via keyboard, then verify result
   answers=['3x+6','4x+20','5x+5']
   for q,answer in enumerate(answers,2):
    for card,region in [(0,0),(1,1)]:
     page.locator(f'#F3-02 [data-card-index="{card}"]').focus();page.keyboard.press('Enter');page.wait_for_timeout(60)
     page.locator(f'#F3-02 [data-drop-region="{region}"]').focus();page.keyboard.press('Enter');page.wait_for_timeout(60)
    page.locator('#F3-02 input[aria-label="Expanded single bracket"]').fill(answer)
    page.locator('#F3-02 button:has-text("Check expansion")').click();page.wait_for_timeout(80)
    test(f'{width}-{motion}-round-{q}-passed', ('Challenge '+str(q+1)+' of 4') in page.locator('#F3-02').inner_text() if q<4 else 'FOUR BRACKET EXPANSIONS COMPLETED' in page.locator('#F3-02').inner_text().upper(),page.locator('#F3-02').inner_text()[-400:])
   test(f'{width}-{motion}-no-errors',not err,err)
  except Exception as e:traceback.print_exc();test(f'{width}-{motion}-fatal',False,str(e))
  page.close()
 b.close()
(r/'tests/f704-interaction-results.json').write_text(json.dumps(records,indent=2));print('INTERACTION',sum(i['passed'] for i in records),'/',len(records))
raise SystemExit(1 if not all(x['passed'] for x in records) else 0)
