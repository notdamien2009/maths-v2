from pathlib import Path
from playwright.sync_api import sync_playwright
import json
R=Path(__file__).resolve().parents[1];rows=[]
with sync_playwright() as P:
 b=P.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [380,1280]:
  p=b.new_page(viewport={'width':width,'height':900},reduced_motion='reduce')
  p.set_content((R/'F8/F8-11-inequality-solver.html').read_text(),wait_until='commit')
  p.locator('[data-m="challenge"]').click()
  def ck(ok,name):rows.append({'case':f'{width}/{name}','pass':bool(ok)})
  def fb():return p.locator('.f811-feedback').inner_text()
  p.get_by_role('button',name='Check answer').click();ck('Place the first boundary' in fb(),'missing-boundary')
  for i in range(4):p.locator('[data-boundary="A"]').press('ArrowRight')
  p.get_by_role('button',name='Check answer').click();ck('wrong place' in fb(),'wrong-boundary')
  for i in range(4):p.locator('[data-boundary="A"]').press('ArrowRight')
  p.locator('[data-closed="Atrue"]').click();p.get_by_role('button',name='Check answer').click();ck('strict sign' in fb(),'wrong-closed-boundary')
  p.locator('[data-closed="Afalse"]').click();p.locator('[data-ray="right"]').press('Enter');p.get_by_role('button',name='Check answer').click();ck('wrong way' in fb(),'wrong-shade-direction')
  p.locator('[data-ray="left"]').press('Enter');p.locator('[aria-label="First boundary value"]').fill('5');p.get_by_role('button',name='Check answer').click();ck('typed bound' in fb(),'wrong-typed-answer')
  p.locator('[aria-label="First boundary value"]').fill('4');p.get_by_role('button',name='Check answer').click();ck('Correct!' in fb(),'fully-correct')
  p.get_by_role('button',name='Next inequality').click();ck('Y8 · Divide by a negative' in p.locator('.f811-task').inner_text(),'advance-on-success')
  p.close()
 b.close()
rep={'total':len(rows),'passed':sum(z['pass'] for z in rows),'failed':[z for z in rows if not z['pass']],'checks':rows};(R/'tests/F8-11-trap-results.json').write_text(json.dumps(rep,indent=2));print('TRAPS',rep['passed'],'/',rep['total'],'failed',rep['failed'][:4]);assert not rep['failed']
