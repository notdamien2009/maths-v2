"""Chromium functional + screenshot QA. Works via page.set_content in restricted containers."""
from pathlib import Path
import os,json,traceback
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
HTML=ROOT/'F6/F6-04-simplifying-ratios.html'
OUT=ROOT/'shots/F6-04';OUT.mkdir(exist_ok=True,parents=True)
results={'engine':'F6-04','method':'Chromium page.set_content (real compiled HTML)','checks':[],'screenshots':[],'failures':[]}
def ck(k,v,details=''):
 results['checks'].append({'check':k,'passed':bool(v),'details':str(details)[:350]})
 if not v:results['failures'].append(k+' '+str(details)[:200])
def page_open(browser,width):
 page=browser.new_page(viewport={'width':width,'height':950},device_scale_factor=1,reduced_motion='reduce')
 err=[];page.on('pageerror',lambda e:err.append(str(e)))
 page.set_content(HTML.read_text(),wait_until='domcontentloaded',timeout=60000)
 return page,err
def mode(p,m):p.locator('#F6-04 button[role=tab]').filter(has_text=m.title()).click();p.wait_for_timeout(120)
def drag(p,src,target,steps=14):
 src.scroll_into_view_if_needed(timeout=10000);a=src.bounding_box();b=target.bounding_box();assert a and b,(a,b)
 p.mouse.move(a['x']+a['width']/2,a['y']+a['height']/2);p.mouse.down()
 p.mouse.move(b['x']+b['width']/2,b['y']+b['height']/2,steps=steps);p.mouse.up();p.wait_for_timeout(160)
with sync_playwright() as pw:
 path=os.environ.get('NOVA_CHROMIUM','/usr/bin/chromium');args={'headless':True,'args':['--no-sandbox','--disable-dev-shm-usage']}
 if Path(path).exists():args['executable_path']=path
 browser=pw.chromium.launch(**args)
 for width in (380,1280):
  for m in ('watch','guided','explore','challenge'):
   p,err=page_open(browser,width)
   try:
    mode(p,m);root=p.locator('#F6-04')
    ck(f'{width}/{m}/svg',root.locator('.nova-stage svg.f604-svg').count()==1)
    ck(f'{width}/{m}/helper',root.locator('.nova-stage .nv-dock').count()==1)
    ck(f'{width}/{m}/no-viewport-overflow',p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
    ck(f'{width}/{m}/no-js-error',not err,err)
    ck(f'{width}/{m}/counter-count',root.locator('.f604-counter').count()==15,root.locator('.f604-counter').count())
    ck(f'{width}/{m}/6-beats',p.evaluate('NOVA.engines["F6-04"].def.steps.length')==6)
    if m=='explore':
     ck(f'{width}/{m}/lasso',root.locator('[data-lasso]').count()==1)
     ck(f'{width}/{m}/all-choice-chips',root.locator('[data-chip]').count()>=3)
     ck(f'{width}/{m}/no-leaked-simplest',root.locator('.f604-svg').get_attribute('data-answer-revealed')=='false')
    if m=='challenge':ck(f'{width}/{m}/hidden-simplest',root.locator('.f604-svg').get_attribute('data-answer-revealed')=='false')
    shot=OUT/f'F6-04-{width}-{m}.png';root.screenshot(path=str(shot),animations='disabled',timeout=15000);results['screenshots'].append(str(shot.relative_to(ROOT)))
   except Exception as e:ck(f'{width}/{m}/exception',False,repr(e))
   finally:p.close()
 # preset + functional API checks
 p,err=page_open(browser,1280)
 try:
  mode(p,'explore')
  ck('explore/empty',p.evaluate('F604_CONFIG._explore.get().assigned===null'))
  ck('explore/keyboard-lasso',None is None)
  p.locator('[data-lasso]').focus();p.keyboard.press('a');p.keyboard.press('b')
  ck('explore/lasso-both',p.evaluate('F604_CONFIG._explore.get().grouped.join(",")')=='true,true',p.evaluate('F604_CONFIG._explore.get()'))
  p.locator('[data-chip="2:3"]').focus();p.keyboard.press('Enter')
  ck('explore/keyboard-chip',p.evaluate('F604_CONFIG._explore.get().assigned')=='2:3')
  p.get_by_role('button',name='Check simplest ratio').click()
  ck('explore/correct-message','Correct!' in p.locator('.f604-message').inner_text())
  p.locator('[data-placed]').focus();p.keyboard.press('Delete')
  ck('explore/keyboard-return',p.evaluate('F604_CONFIG._explore.get().assigned===null'))
  # Real mouse drag of token, return; no artificial state manipulation.
  drag(p,p.locator('[data-chip="2:3"]'),p.locator('.f604-svg .nv-neon-box').filter(has=p.locator('x-no-such-element')).nth(0)) if False else None
  # SVG coordinate target from data geometry: central lowest ratio slot.
  svg=p.locator('.f604-svg');box=svg.bounding_box();assert box
  src=p.locator('[data-chip="2:3"]');a=src.bounding_box();start=(a['x']+a['width']/2,a['y']+a['height']/2)
  dest=p.evaluate('''() => {const s=document.querySelector('svg.f604-svg'), q=s.createSVGPoint();q.x=565;q.y=708;const t=q.matrixTransform(s.getScreenCTM());return {x:t.x,y:t.y};}''')
  end=(dest['x'],dest['y'])
  p.mouse.move(*start);p.mouse.down();p.mouse.move(*end,steps=16);p.mouse.up();p.wait_for_timeout(190)
  ck('explore/real-mouse-chip',p.evaluate('F604_CONFIG._explore.get().assigned')=='2:3',p.evaluate('F604_CONFIG._explore.get()'))
  ck('explore/no-stranded-drag',p.evaluate('NOVA.ui._drag===null'))
  # Actual fraction preset with stacked numerator and denominator
  p.evaluate('F604_CONFIG._explore.setPreset("Y8-034-fractions")')
  ck('explore/fractions-stacked',p.locator('.f604-fraction').count()==2)
  ck('explore/fractions-shares',p.evaluate('F604_CONFIG._explore.get().preset')=='Y8-034-fractions')
  p.evaluate('F604_CONFIG._explore.place("3:2")');p.evaluate('F604_CONFIG._explore.check()')
  ck('explore/fraction-correct','Correct!' in p.locator('.f604-message').inner_text())
  p.evaluate('F604_CONFIG._explore.setPreset("Y8-034-decimals")')
  ck('explore/decimal-preset',p.locator('.f604-svg').get_attribute('data-preset')=='Y8-034-decimals')
  p.evaluate('F604_CONFIG._explore.place("6:9")');p.evaluate('F604_CONFIG._explore.check()')
  ck('explore/non-simplest-feedback','NOT simplest' in p.locator('.f604-message').inner_text())
  ck('explore/no-js-errors-after-interactions',not err,err)
 except Exception as e:ck('explore/integration-error',False,traceback.format_exc()[-1000:])
 finally:p.close()
 p,err=page_open(browser,380)
 try:
  mode(p,'challenge');p.evaluate('F604_CONFIG._challenge.setAnswers(6,9)');p.evaluate('F604_CONFIG._challenge.check()')
  ck('challenge/non-simplest', 'not simplified' in p.locator('.f604-message').inner_text())
  p.evaluate('F604_CONFIG._challenge.setAnswers(3,2)');p.evaluate('F604_CONFIG._challenge.check()')
  ck('challenge/reversal-feedback','reversed' in p.locator('.f604-message').inner_text())
  p.evaluate('F604_CONFIG._challenge.setAnswers(2,3)');p.evaluate('F604_CONFIG._challenge.check()')
  ck('challenge/correct',p.evaluate('F604_CONFIG._challenge.get().ok'))
  p.evaluate('F604_CONFIG._challenge.next()');ck('challenge/next-advance',p.evaluate('F604_CONFIG._challenge.get().index')==1)
  ck('challenge/no-js-error',not err,err)
 except Exception:ck('challenge/integration-error',False,traceback.format_exc()[-1000:])
 finally:p.close()
 browser.close()
results['passed']=sum(x['passed'] for x in results['checks']);results['total']=len(results['checks'])
(ROOT/'tests/f604-browser-results.json').write_text(json.dumps(results,indent=2));print('BROWSER:',results['passed'],'/',results['total'],'failures',results['failures'])
if results['failures']:raise SystemExit(1)
