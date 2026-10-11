"""Real Chromium desktop/mobile visual and functional suite, F0 core embedded."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,traceback
root=Path(__file__).resolve().parents[1];html=(root/'F6/F6-06-best-buy-comparer.html').read_text();shots=root/'shots/F6-06';shots.mkdir(exist_ok=True,parents=True)
res={'component':'F6-06','checks':[],'screenshots':[],'failures':[]}
def ck(name,good,detail=''):
 good=bool(good);res['checks'].append({'test':name,'pass':good,'detail':str(detail)[:290]});
 if not good:res['failures'].append(f'{name}: {str(detail)[:290]}')
def page(b,w):
 p=b.new_page(viewport={'width':w,'height':940},reduced_motion='reduce');errs=[];p.on('pageerror',lambda e:errs.append(str(e)));p.set_content(html,wait_until='domcontentloaded',timeout=60000);return p,errs
def mode(p,m):p.locator('#F6-06 button[role=tab]').filter(has_text=m.title()).click();p.wait_for_timeout(120)
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in [380,1280]:
  for m in ['watch','guided','explore','challenge']:
   p,errs=page(b,w)
   try:
    mode(p,m);g=p.locator('#F6-06');svg=g.locator('svg.f606-svg')
    ck(f'{w}/{m}/svg',svg.count()==1)
    ck(f'{w}/{m}/helper',g.locator('.nova-stage .nv-dock').count()==1)
    ck(f'{w}/{m}/four-cards',g.locator('.f606-cards .nv-ncard').count()==4)
    ck(f'{w}/{m}/two-products',svg.locator('.f606-product-icon').count()==2)
    ck(f'{w}/{m}/no-script-errors',not errs,errs)
    ck(f'{w}/{m}/no-horizontal-overflow',p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),p.evaluate('document.documentElement.scrollWidth'))
    ck(f'{w}/{m}/six-steps',p.evaluate('NOVA.engines["F6-06"].def.steps.length')==6)
    ck(f'{w}/{m}/five-presets',p.evaluate('Object.keys(F606_CONFIG.presets).length')==5)
    if m=='challenge':
     ck(f'{w}/challenge/hidden-price-bars',svg.locator('[data-price-bar]').count()==0)
     ck(f'{w}/challenge/hidden-aside',g.locator('.f606-cards').inner_text().count('? p')>=2)
     ck(f'{w}/challenge/three-inputs',g.locator('.f606-fields input').count()==2 and g.locator('.f606-fields select').count()==1)
     ck(f'{w}/challenge/no-answer-placeholder',all(x=='Enter pence' for x in g.locator('.f606-fields input').evaluate_all('(els)=>els.map(x=>x.placeholder)')))
    if m=='explore':
     ck(f'{w}/explore/price-bars',svg.locator('[data-price-bar]').count()==2)
     ck(f'{w}/explore/draggable-ring',svg.locator('[data-best-buy-ring]').count()==1)
     ck(f'{w}/explore/return-zone',svg.locator('text').filter(has_text='RETURN').count()==1)
    screenshot=shots/f'F6-06-{w}-{m}.png';g.screenshot(path=str(screenshot),animations='disabled',timeout=20000);res['screenshots'].append(str(screenshot.relative_to(root)))
   except Exception:ck(f'{w}/{m}/exception',False,traceback.format_exc()[-1000:])
   finally:p.close()
 # Test all five explore presets and their visible unit prices.
 expected={'Y7-061':['36.00','32.00'],'Y7-061-cereal':['55.00','50.00'],'Y7-061-juice':['18.00','17.00'],'Y7-061-soap':['50.00','55.00'],'Y7-061-equal':['45.00','45.00']}
 p,errs=page(b,380)
 try:
  mode(p,'explore')
  for key,units in expected.items():
   p.evaluate('(k)=>F606_CONFIG._explore.setPreset(k)',key)
   bars=p.locator('#F6-06 [data-price-bar]').evaluate_all('(els)=>els.map(x=>x.getAttribute("data-unit-pence"))')
   ck(f'preset/{key}/correct-bar-values',bars==units,bars)
   ck(f'preset/{key}/no-page-overflow',p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
   if key in ['Y7-061-soap','Y7-061-equal']:
    screenshot=shots/f'F6-06-380-{key}.png';p.locator('#F6-06').screenshot(path=str(screenshot),animations='disabled');res['screenshots'].append(str(screenshot.relative_to(root)))
  state=lambda:p.evaluate('F606_CONFIG._explore.get()')
  p.evaluate('F606_CONFIG._explore.choose("equal")');p.evaluate('F606_CONFIG._explore.check()');ck('explore/equal-value-correct', 'Correct!' in state()['message'],state())
  p.evaluate('F606_CONFIG._explore.setPreset("Y7-061-soap")');p.evaluate('F606_CONFIG._explore.choose("B")');p.evaluate('F606_CONFIG._explore.check()');ck('explore/wrong-noticed','Not' in state()['message'] or 'may' in state()['message'],state())
  p.evaluate('F606_CONFIG._explore.choose("A")');p.evaluate('F606_CONFIG._explore.check()');ck('explore/soap-A-best','Correct!' in state()['message'],state())
  p.evaluate('F606_CONFIG._explore.remove()');ck('explore/remove-clears',state()['chosen'] is None,state())
  ck('explore/no-script-errors',not errs,errs)
 except Exception:ck('explore/presets-exception',False,traceback.format_exc()[-1000:])
 finally:p.close()
 # Challenge must not reveal until correct, correctly distinguish shelf price and best buy.
 p,errs=page(b,1280)
 try:
  mode(p,'challenge');get=lambda:p.evaluate('F606_CONFIG._challenge.get()')
  p.evaluate('F606_CONFIG._challenge.setAnswers(180,240,"A")');p.evaluate('F606_CONFIG._challenge.check()')
  ck('challenge/shelf-price-misconception','whole shelf price' in get()['feedback'].lower(),get())
  ck('challenge/unsolved-hidden',p.locator('#F6-06 [data-price-bar]').count()==0)
  p.evaluate('F606_CONFIG._challenge.setAnswers(36,32,"A")');p.evaluate('F606_CONFIG._challenge.check()');ck('challenge/decision-misconception','decision is not' in get()['feedback'],get())
  p.evaluate('F606_CONFIG._challenge.setAnswers(36,32,"B")');p.evaluate('F606_CONFIG._challenge.check()');ck('challenge/pasta-solved',get()['ok'],get())
  ck('challenge/answer-now-shows',p.locator('#F6-06 [data-price-bar]').count()==2)
  p.evaluate('F606_CONFIG._challenge.next()');ck('challenge/next',get()['index']==1,get())
  ck('challenge/no-script-errors',not errs,errs)
 except Exception:ck('challenge/exception',False,traceback.format_exc()[-1000:])
 finally:p.close()
 b.close()
res['passed']=sum(x['pass'] for x in res['checks']);res['total']=len(res['checks']);(root/'tests/f606-browser-results.json').write_text(json.dumps(res,indent=2));print('BROWSER',res['passed'],'/',res['total'],'screens',len(res['screenshots']),'failures',res['failures'][:15])
if res['failures']:raise SystemExit(1)
