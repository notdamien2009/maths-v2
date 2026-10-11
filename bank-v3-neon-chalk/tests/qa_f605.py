from pathlib import Path
from playwright.sync_api import sync_playwright
import json,traceback
root=Path(__file__).resolve().parents[1];html=(root/'F6/F6-05-recipe-scaler.html').read_text();shots=root/'shots/F6-05';shots.mkdir(exist_ok=True,parents=True)
res={'component':'F6-05','checks':[],'screenshots':[],'failures':[]}
def ck(name,pass_,details=''):
 res['checks'].append({'test':name,'pass':bool(pass_),'detail':str(details)[:320]})
 if not pass_:res['failures'].append(name+' '+str(details)[:300])
def open_page(browser,w):
 p=browser.new_page(viewport={'width':w,'height':980},reduced_motion='reduce');errs=[];p.on('pageerror',lambda e:errs.append(str(e)));p.set_content(html,wait_until='domcontentloaded',timeout=60000);return p,errs
def mode(p,m):p.locator('#F6-05 button[role=tab]').filter(has_text=m.title()).click();p.wait_for_timeout(180)
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in [380,1280]:
  for m in ['watch','guided','explore','challenge']:
   p,errs=open_page(browser,w)
   try:
    mode(p,m);g=p.locator('#F6-05');svg=g.locator('svg.f605-svg')
    ck(f'{w}/{m}/svg',svg.count()==1)
    ck(f'{w}/{m}/helper',g.locator('.nova-stage .nv-dock').count()==1)
    ck(f'{w}/{m}/no-jserrors',not errs,errs)
    ck(f'{w}/{m}/no-page-overflow',p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),p.evaluate('document.documentElement.scrollWidth'))
    ck(f'{w}/{m}/four-rows',svg.locator('.f605-ingredient-icon').count()==4)
    ck(f'{w}/{m}/six-steps',p.evaluate('NOVA.engines["F6-05"].def.steps.length')==6)
    if m=='challenge':
     ck(f'{w}/challenge/hidden-until-solved','? g' in svg.text_content() or '? ml' in svg.text_content() or '? eggs' in svg.text_content())
     ck(f'{w}/challenge/input-count',g.locator('.f605-answer-field input').count()==4)
    if m=='explore':
     ck(f'{w}/explore/tiles',svg.locator('[data-chip]').count()>=4)
     ck(f'{w}/explore/servings',svg.locator('[data-servings-handle]').count()==1)
    screenshot=shots/f'F6-05-{w}-{m}.png';g.screenshot(path=str(screenshot),animations='disabled',timeout=16000);res['screenshots'].append(str(screenshot.relative_to(root)))
   except Exception:ck(f'{w}/{m}/exception',False,traceback.format_exc()[-850:])
   finally:p.close()
 # functional explore
 p,errs=open_page(browser,1280)
 try:
  mode(p,'explore')
  state=lambda:p.evaluate('F605_CONFIG._explore.get()')
  ck('explore/starting-servings',state()['target']==6,state())
  p.evaluate('F605_CONFIG._explore.setTarget(8)')
  ck('explore/servings-changed',state()['target']==8,state())
  p.evaluate('F605_CONFIG._explore.place(0,400)')
  ck('explore/placed-flour',state()['placements'].get('0')==400,state())
  p.evaluate('F605_CONFIG._explore.remove(0)')
  ck('explore/removed-flour','0' not in state()['placements'],state())
  p.evaluate('F605_CONFIG._explore.setTarget(6)')
  for i,v in enumerate([300,480,6,180]):p.evaluate('(a)=>F605_CONFIG._explore.place(a[0],a[1])',[i,v])
  p.evaluate('F605_CONFIG._explore.check()')
  ck('explore/all-correct','Correct!' in state()['message'],state())
  p.evaluate('F605_CONFIG._explore.setPreset("Y7-060-half")')
  ck('explore/preset-change',state()['id']=='Y7-060-half',state())
  ck('explore/no-js-errors',not errs,errs)
 except Exception:ck('explore/exception',False,traceback.format_exc()[-1100:])
 finally:p.close()
 p,errs=open_page(browser,380)
 try:
  mode(p,'challenge')
  p.evaluate('F605_CONFIG._challenge.setAnswers([200,320,4,120])')
  p.evaluate('F605_CONFIG._challenge.check()')
  ck('challenge/unchanged-feedback','unchanged' in p.locator('.f605-feedback').inner_text().lower(),p.locator('.f605-feedback').inner_text())
  p.evaluate('F605_CONFIG._challenge.setAnswers([300,480,6,180])');p.evaluate('F605_CONFIG._challenge.check()')
  ck('challenge/correct',p.evaluate('F605_CONFIG._challenge.get().ok'))
  p.evaluate('F605_CONFIG._challenge.next()')
  ck('challenge/next',p.evaluate('F605_CONFIG._challenge.get().index')==1)
  ck('challenge/no-js-errors',not errs,errs)
 except Exception:ck('challenge/exception',False,traceback.format_exc()[-1000:])
 finally:p.close()
 browser.close()
res['passed']=sum(x['pass'] for x in res['checks']);res['total']=len(res['checks']);(root/'tests/f605-browser-results.json').write_text(json.dumps(res,indent=2));print('BROWSER',res['passed'],'/',res['total'],res['failures'])
if res['failures']:raise SystemExit(1)
