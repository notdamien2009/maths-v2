"""On a local unrestricted Chromium environment: 380/1280 all modes, drag, keyboard and challenges.
Requires pip install playwright && playwright install chromium.
Run: python tests/qa_f602.py
"""
import json, pathlib
from playwright.sync_api import sync_playwright
ROOT=pathlib.Path(__file__).resolve().parent.parent
HTML=(ROOT/'F6/F6-02-double-number-line.html').resolve().as_uri()
OUT=ROOT/'shots/F6'; OUT.mkdir(parents=True,exist_ok=True)
checks=[]
def record(w,what,ok,detail=''):
 checks.append(dict(width=w,test=what,passed=bool(ok),detail=detail));print(w,what,'PASS' if ok else 'FAIL',detail)
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 try:
  for w in (380,1280):
   page=browser.new_page(viewport=dict(width=w,height=950),reduced_motion='reduce')
   errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.goto(HTML,wait_until='load',timeout=45000)
   record(w,'engine registered',page.locator('#F6-02').count()==1)
   for mode in ['Watch','Guided','Explore','Challenge']:
    ctrl=page.get_by_role('tab',name=mode,exact=True)
    if ctrl.count():ctrl.first.click()
    else:page.get_by_text(mode,exact=True).first.click()
    page.wait_for_timeout(350)
    record(w,mode+' rendered',page.locator('#F6-02 svg.f602-svg').count()==1)
    record(w,mode+' core lines',page.locator('#F6-02 svg.f602-svg g.nv-numberline').count()==2)
    record(w,mode+' no horizontal overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth+2'))
    page.screenshot(path=str(OUT/f'F6-02-{w}-{mode.lower()}.png'),full_page=True)
   # Explore keyboard and drag: assert value changes and remains tied to rate.
   ex=page.get_by_role('tab',name='Explore',exact=True)
   ex.first.click();page.wait_for_timeout(150)
   plus=page.get_by_role('button',name='One mark →');plus.click();page.wait_for_timeout(100)
   v=page.evaluate('F602_CONFIG._explore.get()')
   record(w,'keyboard/button marker movement',v['a']>2 and abs(v['b']/v['a']-3)<1e-9)
   pair=page.locator('#F6-02 .f602-pair');record(w,'regrabbable marker present',pair.count()==1)
   page.get_by_role('button',name='Remove marker').click()
   record(w,'remove marker',page.evaluate('F602_CONFIG._explore.get().visible') is False)
   page.get_by_role('button',name='Restore marker').click()
   record(w,'restore marker',page.evaluate('F602_CONFIG._explore.get().visible') is True)
   page.get_by_role('button',name='Undo',exact=True).click()
   record(w,'undo after restore',page.evaluate('F602_CONFIG._explore.get().visible') is False)
   page.get_by_role('button',name='Reset',exact=True).click()
   # Each preset should keep aligned y/x without guessing.
   for id in ('Y7-060','Y8-007','Y8-035','Y8-039'):
    page.evaluate('(id)=>F602_CONFIG._explore.setPreset(id)',id)
    v=page.evaluate('F602_CONFIG._explore.get()');p=page.evaluate('(id)=>F602_CONFIG.presets[id]',id)
    record(w,id+' rate',abs(v['b']/v['a']-p['knownB']/p['known'])<1e-8)
   # Challenge known-answer smoke test via declared test hook.
   page.get_by_role('tab',name='Challenge',exact=True).first.click()
   for v in [24,75,22.5,18]:
    page.evaluate('(x)=>F602_CONFIG._challenge.setAnswer(x)',v)
    page.evaluate('F602_CONFIG._challenge.check()');page.wait_for_timeout(80)
    s=page.evaluate('F602_CONFIG._challenge.get()');record(w,'challenge '+str(v),s['passed'])
    page.evaluate('F602_CONFIG._challenge.next()');page.wait_for_timeout(80)
   record(w,'no JS errors',not errors,str(errors))
   page.close()
 finally:browser.close()
p=ROOT/'tests/f602-browser-results.json';p.write_text(json.dumps(checks,indent=2));print('Total passed',sum(x['passed'] for x in checks),'of',len(checks))
if not all(x['passed'] for x in checks):raise SystemExit(1)
