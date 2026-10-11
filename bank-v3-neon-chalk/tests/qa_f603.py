"""True Chromium source-content QA (works when local file: navigation is forbidden).
In the extracted NOVA bank: python tests/qa_f603.py
Requires playwright and system Chromium or bundled browser.
"""
from pathlib import Path
import json,os
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
HTML=ROOT/'F6/F6-03-sharing-in-a-ratio.html'
OUT=ROOT/'shots/F6-03';OUT.mkdir(parents=True,exist_ok=True)
results={'component':'F6-03','method':'playwright Chromium page.set_content (actual compiled HTML)','checks':[],'failures':[],'screenshots':[]}

def ck(k,ok,notes=''):
 results['checks'].append({'name':k,'pass':bool(ok),'details':str(notes)[:260]})
 if not ok:results['failures'].append(k+': '+str(notes)[:250])

def open_page(browser,width,html):
 page=browser.new_page(viewport={'width':width,'height':950},device_scale_factor=1,reduced_motion='reduce')
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(html,wait_until='domcontentloaded',timeout=20000)
 return page,errors

def mode(page,m):page.locator('#F6-03 button[role=tab]').filter(has_text=m.title()).click()

def drag(page,src,dst):
 src.scroll_into_view_if_needed(timeout=6000)
 aa=src.bounding_box();bb=dst.bounding_box()
 assert aa and bb,(aa,bb)
 page.mouse.move(aa['x']+aa['width']/2,aa['y']+aa['height']/2)
 page.mouse.down()
 page.mouse.move(bb['x']+bb['width']/2,bb['y']+bb['height']/2,steps=14)
 page.mouse.up();page.wait_for_timeout(350)

with sync_playwright() as p:
 browser_path=os.environ.get('NOVA_CHROMIUM','/usr/bin/chromium')
 kw={'headless':True,'args':['--no-sandbox','--disable-dev-shm-usage']}
 if Path(browser_path).exists():kw['executable_path']=browser_path
 browser=p.chromium.launch(**kw)
 html=HTML.read_text(encoding='utf-8')
 for width in (380,1280):
  for m in ('watch','guided','explore','challenge'):
   page,errors=open_page(browser,width,html)
   try:
    mode(page,m);page.wait_for_timeout(80)
    root=page.locator('#F6-03')
    ck(f'{width}/{m}/stage',root.locator('.nova-stage svg.f603-svg').count()==1)
    ck(f'{width}/{m}/helper',root.locator('.nova-stage .nv-dock').count()==1)
    ck(f'{width}/{m}/overflow',page.evaluate('document.documentElement.scrollWidth<=window.innerWidth+1'))
    ck(f'{width}/{m}/no-runtime-exceptions',not errors,errors)
    if m=='watch':
     ck(f'{width}/{m}/parts',root.locator('.f603-svg').get_attribute('data-parts')=='5')
     ck(f'{width}/{m}/seven-beats',page.evaluate('NOVA.engines["F6-03"].def.steps.length')==7)
    if m=='explore':
     ck(f'{width}/{m}/no-pre-revealed-shares',page.evaluate('F603_CONFIG._explore.get().assigned.join(",")')==',')
     ck(f'{width}/{m}/draggable',root.locator('[data-chip]').count()>=3)
     ck(f'{width}/{m}/return',root.locator('.f603-svg .nv-neon-box').count()>=8)
    if m=='challenge':
     ck(f'{width}/{m}/hidden-share-values',root.locator('.f603-svg').get_attribute('data-share-a')=='' and root.locator('.f603-svg').get_attribute('data-share-b')=='')
    screenshot=OUT/f'F6-03-{width}-{m}.png'
    root.screenshot(path=str(screenshot),animations='disabled',timeout=12000)
    results['screenshots'].append(str(screenshot.relative_to(ROOT)))
   except Exception as exc:ck(f'{width}/{m}/exception',False,repr(exc))
   finally:page.close()
 # Functional check and dragging.
 for width in (1280,380):
  page,errors=open_page(browser,width,html)
  try:
   mode(page,'explore')
   drag(page,page.locator('[data-chip="12"]'),page.locator('[data-slot="0"]'))
   ck(f'{width}/drag-A',page.evaluate('F603_CONFIG._explore.get().assigned[0]')==12)
   drag(page,page.locator('[data-chip="18"]'),page.locator('[data-slot="1"]'))
   ck(f'{width}/drag-B',page.evaluate('F603_CONFIG._explore.get().assigned[1]')==18)
   page.locator('button:has-text("Check shares")').click()
   ck(f'{width}/check-correct','Correct!' in page.locator('.f603-message').last.inner_text())
   page.locator('[data-assigned="0"]').focus();page.keyboard.press('Delete')
   ck(f'{width}/keyboard-remove',page.evaluate('F603_CONFIG._explore.get().assigned[0]') is None)
   page.locator('[data-chip="12"]').focus();page.keyboard.press('a')
   ck(f'{width}/keyboard-add',page.evaluate('F603_CONFIG._explore.get().assigned[0]')==12)
   page.evaluate('F603_CONFIG._explore.reset()')
   ck(f'{width}/reset-clears',page.evaluate('F603_CONFIG._explore.get().assigned.every(x=>x===null)'))
   page.evaluate('F603_CONFIG._explore.setPreset("Y7-059-points")')
   ck(f'{width}/high-ratio-preset',page.evaluate('F603_CONFIG._explore.get().preset')=='Y7-059-points')
   mode(page,'challenge')
   page.evaluate('F603_CONFIG._challenge.setAnswers(15,15);F603_CONFIG._challenge.check()')
   ck(f'{width}/wrong-feedback',not page.evaluate('F603_CONFIG._challenge.get().passed'))
   page.evaluate('F603_CONFIG._challenge.setAnswers(12,18);F603_CONFIG._challenge.check()')
   ck(f'{width}/correct-feedback',page.evaluate('F603_CONFIG._challenge.get().passed'))
   ck(f'{width}/answer-reveal',page.locator('.f603-svg').get_attribute('data-share-a')=='12')
   page.evaluate('F603_CONFIG._challenge.next()')
   ck(f'{width}/next-task',page.evaluate('F603_CONFIG._challenge.get().i')==1)
   ck(f'{width}/no-runtime-exceptions',not errors,errors)
  except Exception as exc:ck(f'{width}/interaction-exception',False,repr(exc))
  finally:page.close()
 browser.close()
results['passed']=sum(x['pass'] for x in results['checks']);results['total']=len(results['checks']);results['status']='pass' if not results['failures'] else 'fail'
(ROOT/'tests/f603-browser-results.json').write_text(json.dumps(results,indent=2),encoding='utf-8')
print(json.dumps({'status':results['status'],'passed':results['passed'],'total':results['total'],'failures':results['failures'],'screenshots':len(results['screenshots'])},indent=2))
if results['failures']:raise SystemExit(1)
