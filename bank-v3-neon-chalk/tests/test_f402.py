#!/usr/bin/env python3
"""NOVA F4-02 evidence based QA: 380/1280, modes, maths, drag, keyboard and screenshot.
Requires Playwright Python and local Chromium. Does not touch core or GitHub.
"""
import json,time,sys
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
HTML=ROOT/'F4/F4-02-comparison-bar.html'
SHOTS=ROOT/'shots/F4-02';SHOTS.mkdir(parents=True,exist_ok=True)
checks=[]
def ck(label,ok,detail=None):
 checks.append({'check':label,'passed':bool(ok),'detail':detail})
 if not ok: print('FAIL',label,detail,flush=True)
def go(page,mode):page.get_by_role('tab',name=mode.capitalize()).click()
def sceneXY(page,x,y):
 return page.evaluate('''([x,y])=>{const s=document.querySelector('#F4-02 svg.f402-svg');let p=s.createSVGPoint();p.x=x;p.y=y;let q=p.matrixTransform(s.getScreenCTM());return {x:q.x,y:q.y}}''',[x,y])
def drag(page,selector,end_x,end_y,steps=15):
 src=page.locator(selector).first;src.scroll_into_view_if_needed();b=src.bounding_box();p=sceneXY(page,end_x,end_y)
 page.mouse.move(b['x']+b['width']/2,b['y']+b['height']/2);page.mouse.down();page.mouse.move(p['x'],p['y'],steps=steps);page.mouse.up();page.wait_for_timeout(260)
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [380,1280]:
  page=browser.new_page(viewport={'width':width,'height':940},reduced_motion='reduce')
  errs=[];page.on('pageerror',lambda e: errs.append(str(e)))
  page.set_content(HTML.read_text(encoding='utf-8'),wait_until='load',timeout=30000)
  for mode in ['watch','guided','explore','challenge']:
   if mode!='watch':go(page,mode)
   page.wait_for_timeout(180)
   ck(f'{width} {mode} one SVG',page.locator('#F4-02 svg.f402-svg').count()==1)
   ck(f'{width} {mode} one helper',page.locator('#F4-02 .nv-dock').count()==1)
   ck(f'{width} {mode} no overflow',page.evaluate('document.documentElement.scrollWidth<=window.innerWidth'),page.evaluate('document.documentElement.scrollWidth'))
   ck(f'{width} {mode} clean developer placeholder',page.locator('#F4-02 .nv-frac-tbd').count()==0)
   ck(f'{width} {mode} evidence cards',page.locator('#F4-02 .f402-sidev').count()==3)
   ck(f'{width} {mode} no JS errors',not errs,errs)
   try:
    page.locator('#F4-02').screenshot(path=str(SHOTS/f'F4-02-{width}-{mode}.png'),timeout=20000,animations='disabled')
    ck(f'{width} {mode} screenshot',True)
   except Exception as e:ck(f'{width} {mode} screenshot',False,str(e)[:200])
  m=page.evaluate('''()=>{const m=window.F402_MATH;return [{a:15,b:9,mode:'difference'},{a:24,b:17,mode:'difference'},{a:27,b:19,mode:'shorter',knownDiff:8},{a:8,b:17,mode:'difference'},{a:12,b:12,mode:'difference'}].map(s=>({expected:m.expected(s),valid:m.valid(s),right:m.correct(s,m.expected(s)),wrong:m.correct(s,m.expected(s)+1)}))}''')
  ck(f'{width} all comparison arithmetic', [x['expected'] for x in m]==[6,7,19,9,0] and all(x['valid'] and x['right'] and not x['wrong'] for x in m),m)
  ck(f'{width} addition trap',bool(page.evaluate('''()=>window.F402_MATH.mistake({a:15,b:9,mode:'difference'},24).includes('added')''')))
  ck(f'{width} reverse trap',bool(page.evaluate('''()=>window.F402_MATH.mistake({a:27,b:19,mode:'shorter',knownDiff:8},35).includes('Adding')''')))
  # Challenge 1 with a physically placed card, not an invented success.
  drag(page,'#F4-02 .f402-card[data-value="6"]',730,411)
  ck(f'{width} drag candidate 6', 'placed 6' in page.locator('#F4-02 .f402-status').inner_text().lower(),page.locator('#F4-02 .f402-status').inner_text())
  page.get_by_role('button',name='Check',exact=True).click()
  ck(f'{width} first challenge correct','Correct: 15 − 9 = 6' in page.locator('#F4-02 .f402-status').inner_text())
  ck(f'{width} next available',page.get_by_role('button',name='Next problem →').count()==1)
  page.get_by_role('button',name='Next problem →').click()
  page.locator('#F4-02 input[aria-label="Comparison answer"]').fill('41')
  page.get_by_role('button',name='Check',exact=True).click()
  ck(f'{width} adding mistake caught', 'added' in page.locator('#F4-02 .f402-status').inner_text().lower())
  page.locator('#F4-02 input[aria-label="Comparison answer"]').fill('7')
  page.get_by_role('button',name='Check',exact=True).click()
  ck(f'{width} second challenge correct', '24 − 17 = 7' in page.locator('#F4-02 .f402-status').inner_text())
  page.get_by_role('button',name='Next problem →').click()
  ck(f'{width} smaller amount concealed',page.locator('#F4-02 .f402-sidev').nth(1).inner_text()=='?')
  page.locator('#F4-02 input[aria-label="Comparison answer"]').fill('19')
  page.get_by_role('button',name='Check',exact=True).click()
  ck(f'{width} smaller amount correct', '27 − 8 = 19' in page.locator('#F4-02 .f402-status').inner_text())
  page.get_by_role('button',name='Next problem →').click()
  ck(f'{width} final completion',page.locator('#F4-02 .f402-finish').count()==1)
  go(page,'explore')
  page.get_by_role('button',name='A +1').click()
  ck(f'{width} button resize A',page.locator('#F4-02 svg.f402-svg').get_attribute('data-a')=='16')
  page.locator('#F4-02 .f402-handle[data-which="a"]').focus();page.keyboard.press('ArrowLeft')
  ck(f'{width} keyboard resize A',page.locator('#F4-02 svg.f402-svg').get_attribute('data-a')=='15')
  page.get_by_role('button',name='B +1').click()
  ck(f'{width} button resize B',page.locator('#F4-02 svg.f402-svg').get_attribute('data-b')=='10')
  page.locator('#F4-02 .f402-handle[data-which="b"]').focus();page.keyboard.press('ArrowRight')
  ck(f'{width} keyboard resize B',page.locator('#F4-02 svg.f402-svg').get_attribute('data-b')=='11')
  page.locator('#F4-02 .f402-brace').focus();page.keyboard.press('Enter')
  ck(f'{width} keyboard mark gap','gold segment' in page.locator('#F4-02 .f402-status').inner_text())
  src=page.locator('#F4-02 .f402-card').first;src.scroll_into_view_if_needed();b=src.bounding_box();sx=b['x']+b['width']/2;sy=b['y']+b['height']/2
  page.mouse.move(sx,sy);page.mouse.down();page.mouse.move(sx-45,sy-60,steps=5);page.keyboard.press('Escape');page.mouse.up();page.wait_for_timeout(200)
  ck(f'{width} Escape cancels drag',page.evaluate('window.NOVA.ui._drag===null'))
  ck(f'{width} zero stranded transforms',page.locator('#F4-02 .f402-card[transform]').count()==0)
  ck(f'{width} no errors after all actions',not errs,errs)
  page.close()
 browser.close()
res={'tests':len(checks),'pass':sum(c['passed'] for c in checks),'fail':sum(not c['passed'] for c in checks),'checks':checks}
(ROOT/'tests/F4-02-BROWSER-RESULTS.json').write_text(json.dumps(res,indent=2))
print('QA TOTAL',res['tests'],'PASS',res['pass'],'FAIL',res['fail'],flush=True)
sys.exit(bool(res['fail']))
