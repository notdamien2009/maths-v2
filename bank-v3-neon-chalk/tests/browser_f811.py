from pathlib import Path
from playwright.sync_api import sync_playwright
import json
R=Path(__file__).resolve().parents[1];out=[];errors=[]
def ok(v,s):out.append({'case':s,'pass':bool(v)});print('FAIL',s,flush=True) if not v else None
with sync_playwright() as P:
 b=P.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [380,1280]:
  page=b.new_page(viewport={'width':width,'height':980},reduced_motion='reduce');page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content((R/'F8/F8-11-inequality-solver.html').read_text(),wait_until='commit')
  for mode in ['watch','guided','explore','challenge']:
   page.locator(f'#F8-11 [data-m="{mode}"]').click()
   ok(page.locator('.f811-svg').count()==1,f'{width}/{mode}/svg');ok(page.locator('.f811-svg').get_attribute('data-mode')==mode,f'{width}/{mode}/mode');ok(not page.evaluate('document.documentElement.scrollWidth>innerWidth+1'),f'{width}/{mode}/no-overflow')
  for idx,key in enumerate(page.evaluate('F811_TEST.order')):
   q=page.evaluate('(k)=>F811_TEST.solve(F811_TEST.presets[k])',key)
   stage=page.locator('.f811-svg')
   ok(stage.get_attribute('data-preset')==key,f'{width}/{key}/preset')
   ok('Correct! Your endpoints' not in page.locator('.f811-feedback').inner_text(),f'{width}/{key}/answer-hidden')
   for end,v in [('A',q['bound'] if q['kind']=='single' else q['low'])]+([('B',q['high'])] if q['kind']=='compound' else []):
    el=page.locator(f'[data-boundary="{end}"]')
    if v==0:el.press('Enter')
    else:
     for _ in range(int(abs(v)*2)):
      el=page.locator(f'[data-boundary="{end}"]');el.press('ArrowRight' if v>0 else 'ArrowLeft')
    ok(not page.evaluate('!!NOVA.ui._drag'),f'{width}/{key}/marker-{end}-clean')
    inc=q['closed'] if q['kind']=='single' else (q['lowClosed'] if end=='A' else q['highClosed'])
    page.locator(f'[data-closed="{end}{str(inc).lower()}"]').click()
   if q['kind']=='single':
    page.locator(f'[data-ray="{q["dir"]}"]').press('Enter')
   page.locator('[aria-label="First boundary value"]').fill(str(q['bound'] if q['kind']=='single' else q['low']))
   if q['kind']=='compound':page.locator('[aria-label="Second boundary value"]').fill(str(q['high']))
   page.get_by_role('button',name='Check answer').click()
   fb=page.locator('.f811-feedback').inner_text();ok(fb.startswith('Correct!'),f'{width}/{key}/correct-accepted-'+fb[:100]);ok(not errors,f'{width}/{key}/no-errors')
   if fb.startswith('Correct!'):
    page.locator('.f811-svg').screenshot(path=str(R/f'shots/F8-11-{width}-{key}-completed.png'))
   if idx<5:page.get_by_role('button',name='Next inequality').click()
  page.close()
 b.close()
rep={'total':len(out),'passed':sum(z['pass'] for z in out),'failed':[z for z in out if not z['pass']],'errors':errors,'checks':out};(R/'tests/F8-11-browser-results.json').write_text(json.dumps(rep,indent=2));print('BROWSER',rep['passed'],'/',rep['total'],'failed',rep['failed'][:5],'errors',errors[:3]);assert not rep['failed']
