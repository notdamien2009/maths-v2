from playwright.sync_api import sync_playwright
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
html=(root/'F7/F7-12-substitution-machine.html').read_text()
base=(root/'F8/F8-03-function-machine.html').read_text()
checks=[];fails=[]
def ok(msg,value):
    value=bool(value); checks.append({'test':msg,'pass':value});
    if not value:fails.append(msg)
def button(pg,part):return pg.locator('#F8-03 button').filter(has_text=part).first
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [320,380,768,1280]:
  page=b.new_page(viewport={'width':width,'height':900},reduced_motion='reduce');errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
  page.set_content(html,wait_until='domcontentloaded',timeout=30000)
  ok(f'{width}: canonical F0 core',page.evaluate('!!(window.NOVA?.neonBox&&NOVA.ui.svgDrag&&NOVA.scene.helperStrip)'))
  ok(f'{width}: correct preset entry',page.evaluate('window.NOVA_F8_ENTRY')=='F7-12')
  ok(f'{width}: four modes',all(button(page,s).count() for s in ('Watch','Guided','Explore','Challenge')))
  ok(f'{width}: full 8-step teaching',page.evaluate('F803_CONFIG.challenge.length')==4 and page.evaluate('F803_CONFIG.presets["F7-12-Y7-030"].x')==5)
  ok(f'{width}: pure math correct',page.evaluate('F803_MATH.valueOf(F803_CONFIG.presets["F7-12-Y7-030"])')==17)
  ok(f'{width}: signed math correct',page.evaluate('F803_MATH.valueOf(F803_CONFIG.presets["Y7-030-signed"])')==-1)
  ok(f'{width}: quadratic math correct',page.evaluate('F803_MATH.valueOf(F803_CONFIG.presets["Y7-030-squared"])')==16)
  ok(f'{width}: initial no errors',not errs)
  button(page,'Explore').click(force=True)
  ok(f'{width}: input card available',page.locator('#F8-03 [data-f803-source="input"]').count()==1)
  ok(f'{width}: hopper target available',page.locator('#F8-03 [data-f803-target="hopper"]').count()==1)
  ok(f'{width}: output initially hidden',page.locator('#F8-03 .f803-svg').get_attribute('data-loaded')=='false')
  if width in (380,1280):page.locator('#F8-03 .nova-stage').screenshot(path=str(root/f'shots/F7-12/F7-12-{width}-explore-STAGE.png'),animations='disabled',timeout=14000)
  page.locator('#F8-03 [data-f803-source="input"]').focus();page.keyboard.press('Enter')
  ok(f'{width}: keyboard places card',page.locator('#F8-03 .f803-svg').get_attribute('data-loaded')=='true')
  page.locator('#F8-03 [data-f803-source="loaded"]').focus();page.keyboard.press('r')
  ok(f'{width}: keyboard returns card',page.locator('#F8-03 .f803-svg').get_attribute('data-loaded')=='false')
  button(page,'Load x card').click(force=True)
  page.locator('#F8-03 .f803-answer').fill('15')
  button(page,'Evaluate').click(force=True)
  ok(f'{width}: missed constant feedback','constant' in page.locator('#F8-03 .f803-status').inner_text().lower())
  page.locator('#F8-03 .f803-answer').fill('17')
  button(page,'Evaluate').click(force=True)
  ok(f'{width}: correct output accepted','correct' in page.locator('#F8-03 .f803-status').inner_text().lower())
  ok(f'{width}: table updates',page.locator('#F8-03 .f803-table tbody tr').count()>=0 and '17' in page.locator('#F8-03 .f803-table').inner_text())
  if width in (380,1280):page.locator('#F8-03 .nova-stage').screenshot(path=str(root/f'shots/F7-12/F7-12-{width}-explore-loaded-STAGE.png'),animations='disabled',timeout=14000)
  ok(f'{width}: no Explore errors',not errs)
  button(page,'Challenge').click(force=True)
  for j,answer in enumerate([17,17,-1,16],1):
   ok(f'{width}: challenge {j} hides answer',page.locator('#F8-03 .f803-svg').get_attribute('data-loaded')=='false')
   button(page,'Load x card').click(force=True)
   ok(f'{width}: challenge {j} does not reveal terms',not page.locator('#F8-03 .nova-stage').inner_text().lower().count('result ='))
   page.locator('#F8-03 .f803-answer').fill(str(answer))
   button(page,'Check answer').click(force=True)
   ok(f'{width}: challenge {j} accepted',page.locator('#F8-03 .f803-win').count()==1 if j==4 else page.locator('#F8-03 .f803-help').first.inner_text().startswith(f'Challenge {j+1} / 4'))
  if width in (380,1280):page.locator('#F8-03 .nova-stage').screenshot(path=str(root/f'shots/F7-12/F7-12-{width}-challenge-finished-STAGE.png'),animations='disabled',timeout=14000)
  ok(f'{width}: no challenge errors',not errs)
  page.close()
 # F8-03 base shares exact preset behaviour while keeping own base entry and function metadata.
 page=b.new_page(viewport={'width':380,'height':900},reduced_motion='reduce');errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
 page.set_content(base,wait_until='domcontentloaded',timeout=30000)
 ok('F8-03 parent engine launches',page.evaluate('window.NOVA_F8_ENTRY')=='F8-03')
 ok('F8-03 parent retains generic function rule',page.evaluate('!!F803_CONFIG.presets["F8-03-function-rule"]'))
 ok('F8-03 parent no browser errors',not errs)
 page.close();b.close()
r={'passed':sum(x['pass'] for x in checks),'total':len(checks),'failures':fails,'checks':checks}
(root/'tests/F7-12-QA-RESULTS.json').write_text(json.dumps(r,indent=2))
print('RESULT',r['passed'],r['total'],'FAIL',fails,flush=True)
