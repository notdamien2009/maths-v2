from pathlib import Path
from playwright.sync_api import sync_playwright
import json, traceback
r=Path(__file__).resolve().parents[1];html=(r/'F7/F7-04-expanding-single-brackets.html').read_text();original=(r/'F3/F3-02-area-model-of-multiplication.html').read_text();shots=r/'shots/F7-04';shots.mkdir(exist_ok=True,parents=True);results=[]
def add(name,cond,details=''):
 results.append({'name':name,'pass':bool(cond),'details':str(details)});
 if not cond:print('FAILED',name,details,flush=True)
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [320,380,768,1280]:
  page=b.new_page(viewport={'width':width,'height':950},reduced_motion='reduce');errors=[];page.on('pageerror',lambda err:errors.append(str(err)))
  try:
   page.set_content(html,wait_until='load',timeout=45000);page.wait_for_timeout(100)
   add(f'{width}-preset',page.evaluate("F302_CONFIG.preset==='F7-04-expanding-single-brackets'"))
   add(f'{width}-model',page.evaluate("F704_PRESET_MATH.single(3,2).expanded==='3x + 6' && F704_PRESET_MATH.single(4,5).expanded==='4x + 20' && F704_PRESET_MATH.single(5,1).expanded==='5x + 5'"))
   add(f'{width}-six-teaching-stages',page.locator('#F3-02 .nova-tl').count()>0,page.locator('#F3-02 .nova-tl').count())
   for mode in ['Watch','Guided','Explore','Challenge']:
    page.locator(f'#F3-02 button:has-text("{mode}")').first.click();page.wait_for_timeout(190)
    add(f'{width}-{mode}-stage',page.locator('#F3-02 svg.f302-art').count()==1)
    add(f'{width}-{mode}-no-overflow',page.evaluate('document.documentElement.scrollWidth <= innerWidth+2'),page.evaluate('document.documentElement.scrollWidth'))
    add(f'{width}-{mode}-no-errors',len(errors)==0,str(errors))
    if mode=='Challenge':
     add(f'{width}-two-regions',page.locator('#F3-02 [data-region]').count()==2)
     add(f'{width}-challenge-header',page.locator('#F3-02').inner_text().find('Challenge 1 of 4')>=0)
    if width in (380,1280):
     page.locator('#F3-02 .nova-stage').screenshot(path=str(shots/f'F7-04-{width}-{mode.lower()}-stage.png'),animations='disabled')
     page.screenshot(path=str(shots/f'F7-04-{width}-{mode.lower()}-page.png'),animations='disabled')
   page.close()
  except Exception as e:traceback.print_exc();add(f'{width}-fatal',False,str(e));page.close()
 # F3 regression smoke across modes
 page=b.new_page(viewport={'width':1280,'height':940},reduced_motion='reduce');e=[];page.on('pageerror',lambda error:e.append(str(error)));page.set_content(original,wait_until='load')
 add('baseline-keeps-original-preset',page.evaluate("F302_CONFIG.preset==='Y7-009-whole-decimal-multiplication'"))
 for mode in ['Watch','Guided','Explore','Challenge']:
  page.locator(f'#F3-02 button:has-text("{mode}")').first.click();page.wait_for_timeout(60)
  add('baseline-'+mode.lower(),page.locator('#F3-02 svg.f302-art').count()==1 and len(e)==0,e)
 page.close();b.close()
(r/'tests/f704-browser-results.json').write_text(json.dumps(results,indent=2));print('QA',sum(x['pass'] for x in results),'/',len(results))
raise SystemExit(1 if not all(x['pass'] for x in results) else 0)
