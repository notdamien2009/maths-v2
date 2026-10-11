from pathlib import Path
from playwright.sync_api import sync_playwright
import json
r=Path(__file__).resolve().parents[1]; source=(r/'F5/F5-18-terminating-recurring-sorter.html').read_text();shots=r/'shots';shots.mkdir(exist_ok=True)
checks=[]
def ok(value,name,w):
 checks.append(dict(ok=bool(value),name=name,width=w));
 if not value:print('FAIL:',w,name,flush=True)
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width,motion in [(380,'reduce'),(1280,'reduce')]:
  page=browser.new_page(viewport={'width':width,'height':960},reduced_motion=motion);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(source,wait_until='domcontentloaded');page.wait_for_timeout(55)
  root='#F5-18';cfg='NOVA_F5_18_CONFIG'
  ok(page.locator(root+' svg.sort-svg').count()==1,'mounted scene',width)
  ok(page.evaluate('document.documentElement.scrollWidth<=innerWidth'),'no initial horizontal overflow',width)
  for mode in ['watch','guided','explore','challenge']:
   page.locator(root+f' .nova-tab[data-m="{mode}"]').click();page.wait_for_timeout(65)
   ok(page.locator(root+' svg.sort-svg').count()==1,mode+' scene',width)
   ok(page.evaluate('document.documentElement.scrollWidth<=innerWidth'),mode+' no overflow',width)
   # mode screenshots already captured in quick browser check
  page.locator(root+' .nova-tab[data-m="guided"]').click();page.wait_for_timeout(60)
  for n in range(6):
   text=page.locator(root+' .nova-stepname').inner_text()
   ok(f'Step {n+1} of 6' in text,'guided step '+str(n+1),width)
   if n<5:page.locator(root+' .nova-tl button[aria-label="Step forward"]').click();page.wait_for_timeout(48)
  page.locator(root+' .nova-tab[data-m="explore"]').click();page.wait_for_timeout(60)
  api=cfg+'._explore'
  expected={'deckA':{'3/12':'terminating','1/6':'recurring','6/15':'terminating','2/11':'recurring'},'deckB':{'5/30':'recurring','7/40':'terminating','14/35':'terminating','3/14':'recurring'},'deckC':{'11/64':'terminating','7/30':'recurring','2/125':'terminating','21/77':'recurring'}}
  for deck,items in expected.items():
   page.evaluate(f'd=>{api}.setDeck(d)',deck);v=page.evaluate(api+'.get()')
   ok(len(v['items'])==4,deck+' four cards',width)
   for item in v['items']:
    ok(item['kind']==items[item['key']],deck+' correct type '+item['key'],width)
    ok(item['d']*item['k']==item['b'] and item['n']*item['k']==item['a'],deck+' reduced fraction exactly '+item['key'],width)
    ok((item['other']==1)==(item['kind']=='terminating'),deck+' reduced denominator criterion '+item['key'],width)
   wrong='recurring' if items[next(iter(items))]=='terminating' else 'terminating';key=next(iter(items))
   rejected=page.evaluate(f'([k,b])=>{api}.sort(k,b)',[key,wrong]);ok(rejected is False,deck+' wrong placement refused',width)
   ok(len(page.evaluate(api+'.get().placed'))==0,deck+' no wrong placement stored',width)
   for key,kind in items.items():ok(page.evaluate(f'([k,b])=>{api}.sort(k,b)',[key,kind]) is True,deck+' valid '+key,width)
   ok(len(page.evaluate(api+'.get().placed'))==4,deck+' all placed',width)
   ok(page.evaluate(f'k=>{api}.remove(k)',next(iter(items))) is True,deck+' return card',width)
  page.evaluate(f'()=>{api}.setDeck("deckA")');page.evaluate(f'()=>{api}.inspect("3/12")');page.evaluate(f'()=>{api}.advance()');page.evaluate(f'()=>{api}.advance()');v=page.evaluate(api+'.get()');ok(v['proofStep']==2,'factor-proof advances',width)
  ok(v['items'][0]['n']==1 and v['items'][0]['d']==4,'3/12 reduces to 1/4',width)
  page.evaluate(f'()=>{api}.reset()');loc=page.locator(root+' [data-sort-card="6/15"]');loc.focus();loc.press('ArrowLeft');page.wait_for_timeout(60)
  ok(page.evaluate(api+'.get().placed["6/15"]')=='terminating','keyboard sorting',width)
  if width in [380,1280]:
   page.evaluate(f'()=>{api}.reset()');loc=page.locator(root+' [data-sort-card="3/12"]');loc.scroll_into_view_if_needed();bb=loc.bounding_box()
   target=page.evaluate('''()=>{let s=document.querySelector('#F5-18 svg.sort-svg'),m=s.viewBox.baseVal.width===420,p=s.createSVGPoint();p.x=m?117:696;p.y=m?541:270;let c=p.matrixTransform(s.getScreenCTM());return {x:c.x,y:c.y};}''')
   page.mouse.move(bb['x']+bb['width']/2,bb['y']+bb['height']/2);page.mouse.down();page.mouse.move(target['x'],target['y'],steps=10);page.mouse.up();page.wait_for_timeout(65)
   ok(page.evaluate(api+'.get().placed["3/12"]')=='terminating','real pointer valid placement',width)
   ok(page.evaluate('NOVA.ui._drag===null'),'drag clears after valid placement',width)
   loc=page.locator(root+' [data-sort-card="3/12"]');loc.scroll_into_view_if_needed();bb=loc.bounding_box()
   tray=page.evaluate('''()=>{let s=document.querySelector('#F5-18 svg.sort-svg'),m=s.viewBox.baseVal.width===420,p=s.createSVGPoint();p.x=m?190:287;p.y=m?213:290;let c=p.matrixTransform(s.getScreenCTM());return {x:c.x,y:c.y};}''')
   page.mouse.move(bb['x']+bb['width']/2,bb['y']+bb['height']/2);page.mouse.down();page.mouse.move(tray['x'],tray['y'],steps=10);page.mouse.up();page.wait_for_timeout(310)
   ok(page.evaluate(api+'.get().placed["3/12"]') is None,'real return to removal tray',width)
   loc=page.locator(root+' [data-sort-card="1/6"]');loc.scroll_into_view_if_needed();bb=loc.bounding_box()
   page.mouse.move(bb['x']+bb['width']/2,bb['y']+bb['height']/2);page.mouse.down();page.mouse.move(target['x'],target['y'],steps=10);page.mouse.up();page.wait_for_timeout(310)
   ok(page.evaluate(api+'.get().placed["1/6"]') is None,'wrong bin drag returns',width)
   ok(page.evaluate('NOVA.ui._drag===null'),'wrong drag clears',width)
   loc=page.locator(root+' [data-sort-card="1/6"]');loc.scroll_into_view_if_needed();bb=loc.bounding_box();page.mouse.move(bb['x']+bb['width']/2,bb['y']+bb['height']/2);page.mouse.down();page.keyboard.press('Escape');page.mouse.up();page.wait_for_timeout(200)
   ok(page.evaluate('NOVA.ui._drag===null'),'Escape cancellation',width)
   ok(page.evaluate(api+'.get().placed["1/6"]') is None,'Escape leaves card unplaced',width)
  page.locator(root+' .nova-tab[data-m="challenge"]').click();page.wait_for_timeout(65)
  ok('Only 2s and 5s → terminates' not in page.locator(root+' svg.sort-svg').text_content(),'Challenge no proof answer',width)
  ok(page.evaluate(cfg+'._challenge.index()')==0,'Challenge starts 1',width)
  ok(page.evaluate(cfg+'._challenge.answer("recurring")') is False,'Challenge wrong rejected',width)
  for index,answer in enumerate(['terminating','recurring','terminating']):
   ok(page.evaluate(f'v=>{cfg}._challenge.answer(v)',answer) is True,'Challenge correct '+str(index+1),width)
   page.wait_for_timeout(195)
   ok(page.evaluate(cfg+'._challenge.index()')==min(index+1,2),'Challenge progresses '+str(index+1),width)
  ok(len(errors)==0,'no JavaScript errors',width)
  ok(page.evaluate('document.documentElement.scrollWidth<=innerWidth'),'final no overflow',width)
  page.close();print('completed',width,motion,'checks',len([x for x in checks if x['width']==width]),flush=True)
 browser.close()
report={'summary':{'total':len(checks),'passed':sum(x['ok'] for x in checks),'failed':len([x for x in checks if not x['ok']])},'checks':checks}
(r/'QA-RESULTS.json').write_text(json.dumps(report,indent=2));print('RESULT',report['summary'])
