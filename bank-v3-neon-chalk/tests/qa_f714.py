"""F7-14 browser, symbolic maths, mode, challenge and keyboard regression."""
import json,sys
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];HTML=(ROOT/'F7/F7-14-identity-visualiser.html').read_text('utf8');SHOTS=ROOT/'shots/F7-14'
checks=[]
def ck(got,name):
 ok=bool(got);checks.append({'name':name,'pass':ok});
 if not ok:print('FAIL',name,flush=True)
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [320,380,768,1280]:
  page=b.new_page(viewport={'width':width,'height':870},reduced_motion='reduce');errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)));page.set_content(HTML);page.wait_for_timeout(100)
  ck(page.locator('#F7-14 .f714-svg').count()==1,f'{width} SVG loads');ck(page.locator('#F7-14 .nv-dock').count()>=1,f'{width} F0 helper present');ck(page.evaluate('document.documentElement.scrollWidth<=innerWidth+2'),f'{width} no horizontal overflow');ck(page.locator('#F7-14 svg.f714-svg').get_attribute('aria-label') is not None,f'{width} SVG accessible');
  for mode in ['Watch','Guided','Explore','Challenge']:
   page.get_by_role('tab',name=mode,exact=True).click();page.wait_for_timeout(80)
   ck(page.locator('#F7-14 .f714-svg').count()==1,f'{width} {mode} loads');ck(not errors,f'{width} {mode} no JS errors');ck(page.locator('#F7-14 .nv-dock').count()>=1,f'{width} {mode} helper');
   if width in [380,1280]:
    page.screenshot(path=str(SHOTS/f'F7-14-{width}-{mode.lower()}.png'),full_page=True)
    page.locator('#F7-14 .nova-stage').screenshot(path=str(SHOTS/f'F7-14-{width}-{mode.lower()}-STAGE.png'))
   if mode=='Explore':
    count=int(page.locator('.f714-svg').get_attribute('data-total'));ck(count==8,f'{width} Explore eight algebra tiles')
    page.get_by_role('button',name='Build both mats').click();ck(page.locator('.f714-svg').get_attribute('data-placed')==str(count),f'{width} auto build both mats');page.get_by_role('button',name='Compare',exact=True).click();ck(page.locator('.f714-svg').get_attribute('data-revealed')=='true',f'{width} comparison reveals proof');ck('Identical for every x' in page.locator('#F7-14').inner_text(),f'{width} proof identifies identity')
    page.get_by_role('button',name='Undo').click();ck(page.locator('.f714-svg').get_attribute('data-placed')=='0',f'{width} Undo restores unplaced')
    page.locator('[data-f714-id]').first.focus();page.keyboard.press('Enter');ck(page.locator('.f714-svg').get_attribute('data-placed')=='1',f'{width} keyboard place')
    page.locator('[data-f714-id]:not([data-home="tray"])').first.focus();page.keyboard.press('Delete');ck(page.locator('.f714-svg').get_attribute('data-placed')=='0',f'{width} keyboard return')
    # False equality at x=0 must not become an identity.
    page.get_by_label('Choose identity teaching preset').select_option('Y9-006-single-value');page.get_by_role('button',name='Build both mats').click();page.get_by_role('button',name='Compare',exact=True).click();ck('Not identical for every x' in page.locator('#F7-14').inner_text(),f'{width} rejects coincidence at x=0');ck('left 6, right 4' in page.locator('#f714-status').inner_text(),f'{width} numerical counterexample x=2')
    if width==380:page.locator('#F7-14 .nova-stage').screenshot(path=str(SHOTS/'F7-14-380-not-identity-STAGE.png'))
   if mode=='Challenge':
    page.get_by_role('button',name='Identity',exact=True).click();ck('Place all tiles' in page.locator('#f714-status').inner_text(),f'{width} cannot decide without building mats')
    page.get_by_role('button',name='Build both mats').click();page.get_by_role('button',name='Not identity',exact=True).click();ck('Challenge 1 of 4' in page.locator('#F7-14').inner_text(),f'{width} wrong answer does not advance');ck('signed x², x and unit coefficients match' in page.locator('#f714-status').inner_text(),f'{width} identity misconception feedback')
    for i,ans in enumerate(['Identity','Not identity','Identity','Not identity']):
     if i:page.get_by_role('button',name='Build both mats').click()
     page.get_by_role('button',name=ans,exact=True).click();page.wait_for_timeout(90)
     if i==3:ck('Four comparisons complete' in page.locator('#F7-14').inner_text(),f'{width} challenge complete')
     else:ck(f'Challenge {i+2} of 4' in page.locator('#F7-14').inner_text(),f'{width} challenge round {i+1} advances')
  ck(not errors,f'{width} no browser exceptions');page.close()
 page=b.new_page();page.set_content(HTML)
 for name,p in page.evaluate('Object.entries(F714_CONFIG.presets)'):
  ck(page.evaluate('a=>F714_MATH.same(a)',p)==all(p['A'][k]==p['B'][k] for k in ['x2','x','one']),f'{name} symbolic coefficient equality')
  for x in [-4,-2,-1,0,1,2,5]:
   a=page.evaluate('a=>F714_MATH.evaluate(a[0],a[1])',[p['A'],x]);v=p['A']['x2']*x*x+p['A']['x']*x+p['A']['one'];ck(a==v,f'{name} left evaluates at x={x}')
   right=page.evaluate('a=>F714_MATH.evaluate(a[0],a[1])',[p['B'],x]);rv=p['B']['x2']*x*x+p['B']['x']*x+p['B']['one'];ck(right==rv,f'{name} right evaluates at x={x}')
 ck(page.evaluate("F714_MATH.same(F714_CONFIG.presets['Y9-006-single-value'])") is False,'single x=0 coincidence is not identity');ck(page.evaluate("F714_MATH.same(F714_CONFIG.presets['Y9-006-cancellation'])") is True,'difference squares signed identity');page.close();b.close()
res={'passed':sum(x['pass'] for x in checks),'total':len(checks),'checks':checks}
(ROOT/'tests/F7-14-QA-RESULTS.json').write_text(json.dumps(res,indent=2),'utf8');print('QA',res['passed'],'/',res['total'],flush=True);sys.exit(0 if res['passed']==res['total'] else 1)
