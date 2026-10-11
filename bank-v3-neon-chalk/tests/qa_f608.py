from pathlib import Path
import json,sys
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1];html=(root/'F6/F6-08-direct-proportion-GALLERY-PREVIEW.html').read_text();shots=root/'shots/F6-08';shots.mkdir(parents=True,exist_ok=True)
passed=[];failed=[];errors=[]
def test(name,condition):
 try:
  if not condition:raise AssertionError(name)
  passed.append(name)
 except Exception as e:failed.append({'name':name,'error':str(e)[:240]});print('FAIL',name,e)
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu'])
 for width in [380,1280]:
  page=b.new_page(viewport={'width':width,'height':900},device_scale_factor=1)
  page.on('pageerror',lambda e:errors.append(str(e)[:450]))
  page.set_content(html,wait_until='domcontentloaded');page.wait_for_timeout(150)
  test(f'{width} four modes',page.locator('#F6-08 [data-m]').count()==4)
  for mode in ['watch','guided','explore','challenge']:
   page.locator(f'#F6-08 [data-m="{mode}"]').click();page.wait_for_timeout(100)
   test(f'{width} {mode} stage SVG',page.locator('#F6-08 svg.f608-svg').count()==1)
   test(f'{width} {mode} only NOVA core graph',page.locator('#F6-08 svg .nv-plot').count()==1)
   test(f'{width} {mode} three side cards',page.locator('#F6-08 .f608-aside .nv-ncard').count()==3)
   test(f'{width} {mode} no viewport overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth+3'))
   test(f'{width} {mode} mascot dock',page.locator('#F6-08 .nv-dock').count()==1)
   page.screenshot(path=str(shots/f'F6-08-{width}-{mode}.png'),full_page=True)
  page.locator('#F6-08 [data-m="explore"]').click();page.wait_for_timeout(90)
  test(f'{width} graph slider and 3 table drags',page.locator('#F6-08 [data-drag]').count()==4)
  test(f'{width} preset is F10-05 child',page.evaluate('NOVA_F608_PRESET.parentEngine')=='F10-05')
  test(f'{width} host adapter rejects missing host',page.evaluate('(()=>{try{NOVA_F608_PRESET.prepareForHost({id:"F6-08"});return false;}catch(e){return true}})()'))
  test(f'{width} adapter returns data to correct host',page.evaluate('NOVA_F608_PRESET.prepareForHost({id:"F10-05"}).registrationId')=='F6-08')
  test(f'{width} no separate F10 code in core',page.evaluate('NOVA.registry.has("F10-05")') is False)
  point=page.locator('#F6-08 .f608-selector');point.focus();page.keyboard.press('ArrowRight');page.wait_for_timeout(65)
  test(f'{width} keyboard arrow moves graph point',page.evaluate('F608_PREVIEW.config._explore.get().selected')==3)
  point=page.locator('#F6-08 .f608-selector');point.focus();page.keyboard.press('Home');page.wait_for_timeout(65)
  test(f'{width} Home moves to first valid point',page.evaluate('F608_PREVIEW.config._explore.get().selected')==1)
  chip=page.locator('#F6-08 [data-evidence="1"]');chip.focus();page.keyboard.press('Enter');page.wait_for_timeout(65)
  test(f'{width} keyboard table-to-graph match',page.evaluate('Boolean(F608_PREVIEW.config._explore.get().evidence[1])'))
  chip=page.locator('#F6-08 [data-evidence="1"]');chip.focus();page.keyboard.press('Delete');page.wait_for_timeout(65)
  test(f'{width} keyboard return table chip',not page.evaluate('Boolean(F608_PREVIEW.config._explore.get().evidence[1])'))
  page.evaluate('F608_PREVIEW.config._explore.hint()');test(f'{width} named hint event',len(page.evaluate('document.getElementById("log").textContent'))>0)
  page.evaluate('F608_PREVIEW.config._explore.reset()');test(f'{width} reset selected',page.evaluate('F608_PREVIEW.config._explore.get().selected')==2)
  for preset in ['Y8-035','Y8-036','Y9-020']:
   page.evaluate('(preset)=>F608_PREVIEW.config._explore.setPreset(preset)',preset);page.wait_for_timeout(40)
   test(f'{width} {preset} preset and plot',page.evaluate('F608_PREVIEW.config._explore.get().id')==preset and page.locator('#F6-08 svg .nv-plot').count()==1)
   page.screenshot(path=str(shots/f'F6-08-{width}-{preset}.png'),full_page=True)
  page.locator('#F6-08 [data-m="challenge"]').click();page.wait_for_timeout(80)
  test(f'{width} Challenge hides the multiplier','y = ?x' in page.locator('#F6-08 .f608-aside').inner_text())
  test(f'{width} Challenge hides missing y','y = ?' in page.locator('#F6-08 .f608-aside').inner_text())
  test(f'{width} Challenge starts at first preset',page.evaluate('F608_PREVIEW.config._challenge.get().index')==0)
  page.evaluate('F608_PREVIEW.config._challenge.setAnswers(2,7)');page.evaluate('F608_PREVIEW.config._challenge.check()');page.wait_for_timeout(55)
  test(f'{width} wrong challenge rejected',page.evaluate('F608_PREVIEW.config._challenge.get().ok') is False)
  vals=[(2,10),(3,12),(1.5,9),(.75,4.5)]
  for i,(k,y) in enumerate(vals):
   page.evaluate('([k,y])=>F608_PREVIEW.config._challenge.setAnswers(k,y)',[k,y]);page.evaluate('F608_PREVIEW.config._challenge.check()');page.wait_for_timeout(65)
   test(f'{width} challenge preset {i} accepted',page.evaluate('F608_PREVIEW.config._challenge.get().ok') is True)
   test(f'{width} challenge result explained', 'Correct' in page.locator('#F6-08 .f608-fb').inner_text())
   if i!=len(vals)-1:page.evaluate('F608_PREVIEW.config._challenge.next()');page.wait_for_timeout(55)
  test(f'{width} 4 challenges solved',page.evaluate('F608_PREVIEW.config._challenge.get().solved')==4)
  test(f'{width} no JS errors',not errors)
  page.close()
 b.close()
result={'suite':'browser','passed':len(passed),'total':len(passed)+len(failed),'failures':failed,'page_errors':errors,'screenshots':len(list(shots.glob('*.png'))),'viewports':[380,1280],'method':'Chromium set_content rendering and actual DOM interactions'}
(root/'tests/f608-browser-results.json').write_text(json.dumps(result,indent=2));print('BROWSER',result['passed'],'/',result['total'],'errors',len(errors));sys.exit(1 if failed or errors else 0)
