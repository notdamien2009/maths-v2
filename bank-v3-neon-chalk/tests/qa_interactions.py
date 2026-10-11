from pathlib import Path
from playwright.sync_api import sync_playwright
import os,json,time
ROOT=Path(__file__).resolve().parent
SOURCE=(ROOT/'F10-02-shape-on-grid.html').read_text()
results=[]
def test(name,condition,detail=''):
 ok=bool(condition); results.append({'name':name,'passed':ok,'detail':str(detail)[:240]});print('PASS' if ok else 'FAIL',name,' ' if ok else str(detail)[:180],flush=True)

def coords(el):
 return el.get_attribute('aria-label')
with sync_playwright() as playwright:
 b=playwright.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in [int(x) for x in os.getenv('WIDTHS','380,1280').split(',')]:
  for motion in os.getenv('MOTIONS','regular,reduced').split(','):
   page=b.new_page(viewport={'width':width,'height':900},reduced_motion='reduce' if motion=='reduced' else 'no-preference')
   errs=[];page.on('pageerror',lambda err:errs.append(str(err)))
   page.set_content(SOURCE,wait_until='domcontentloaded');page.wait_for_timeout(200)
   prefix=f'{width}-{motion}'
   for mode in ('watch','guided','explore','challenge'):
    page.locator(f'#F10-02 .nova-tab[data-m="{mode}"]').click();page.wait_for_timeout(100)
    score=page.evaluate('''()=>{
      const svg=document.querySelector('#F10-02 .f102-svg'); const stage=document.querySelector('#F10-02 .f102-theatre');
      if(!svg||!stage)return {svg:false};const sr=svg.getBoundingClientRect(),r=stage.getBoundingClientRect();
      return {svg:true,bg:getComputedStyle(stage).backgroundImage, border:getComputedStyle(stage).borderTopWidth,grid:!!svg.querySelector('.f102-grid'), rings:svg.querySelectorAll('.nv-ring').length, width:sr.width, overflow:document.documentElement.scrollWidth>innerWidth+1, stageWidth:r.width}; }''')
    test(prefix+'-'+mode+'-stage',score.get('svg') and score.get('bg')!='none' and score.get('border')!='0px' and score.get('grid') and not score.get('overflow'),score)
    if mode=='explore':test(prefix+'-explore-triangle-points',page.locator('#F10-02 [data-testid^="source-"]').count()==3)
    if mode=='challenge':test(prefix+'-challenge-image-handles',page.locator('#F10-02 [data-testid^="image-"]').count()==3)
   # Explore keyboard and presets
   page.locator('#F10-02 .nova-tab[data-m="explore"]').click();page.wait_for_timeout(120)
   aa=page.locator('#F10-02 [data-testid="source-A"]');before=coords(aa);aa.focus();page.keyboard.press('ArrowUp');page.wait_for_timeout(120)
   after=coords(page.locator('#F10-02 [data-testid="source-A"]'))
   test(prefix+'-keyboard-move-source',before!=after and after.endswith('(−2, 2)'),(before,after))
   page.locator('#F10-02 select').first.select_option('Y7-053');page.wait_for_timeout(110)
   label=page.locator('#F10-02 .f102-stage-pills').text_content()
   test(prefix+'-rotation-preset','Rotate 90° anticlockwise' in label,label)
   page.locator('#F10-02 select').first.select_option('Y7-054');page.wait_for_timeout(100)
   label=page.locator('#F10-02 .f102-stage-pills').text_content()
   test(prefix+'-enlargement-preset','Enlarge ×2' in label,label)
   page.locator('#F10-02 select').first.select_option('Y7-052');page.wait_for_timeout(100)
   board=page.locator('#F10-02 .f102-svg');board.scroll_into_view_if_needed()
   def abspt(x,y):
    return board.evaluate('''(el,p)=>{const pt=el.createSVGPoint();pt.x=p[0];pt.y=p[1];const xy=pt.matrixTransform(el.getScreenCTM());return {x:xy.x,y:xy.y};}''',[88+(x+5)*43.6,46+(5-y)*43.6])
   a=abspt(-2,1);dest=abspt(-1,2)
   page.mouse.move(a['x'],a['y']);page.mouse.down();page.mouse.move(dest['x'],dest['y'],steps=14);page.wait_for_timeout(150);page.mouse.up();page.wait_for_timeout(550)
   lbl=coords(page.locator('#F10-02 [data-testid="source-A"]'))
   test(prefix+'-drag-snap-source',lbl.endswith('(−1, 2)'),lbl)
   page.locator('#F10-02 .f102-svg').scroll_into_view_if_needed();a=abspt(-1,2);dest=abspt(-2,1)
   page.mouse.move(a['x'],a['y']);page.mouse.down();page.mouse.move(dest['x'],dest['y'],steps=6);page.keyboard.press('Escape');page.mouse.up();page.wait_for_timeout(570)
   val=coords(page.locator('#F10-02 [data-testid="source-A"]'))
   test(prefix+'-drag-escape-recovery',val.endswith('(−1, 2)') and not page.evaluate('!!NOVA.ui._drag'),(val,page.evaluate('!!NOVA.ui._drag')))
   # Challenge: verify no answer leakage, hint and wrong marking, then solve all three through keyboard.
   page.locator('#F10-02 .nova-tab[data-m="challenge"]').click();page.wait_for_timeout(120)
   evidence=page.locator('#F10-02 .f102-info').text_content()
   test(prefix+'-challenge-no-solution-leak','your current image positions' in evidence.lower() and 'image coordinate evidence' not in evidence.lower(),evidence[:200])
   test(prefix+'-Izaac-present',page.locator('#F10-02 .f102-peer img').count()==1)
   page.locator('#F10-02 .nova-btn',has_text='Hint').last.click();page.wait_for_timeout(80)
   test(prefix+'-hint-event',page.evaluate("NOVA.events.history().some(e=>e.type==='hintUsed'&&e.detail.engine==='F10-02')"))
   page.locator('#F10-02 .nova-btn',has_text='Check').last.click();page.wait_for_timeout(80)
   test(prefix+'-incorrect-feedback',page.locator('#F10-02 .nova-fb.bad').count()>0)
   # Transformations expected from source BASE [(-2,1),(0,3),(2,1)]
   originals=[(-2,1),(-1,2),(1,1)]
   targets=[[(2,1),(1,2),(-1,1)],[(0,-2),(1,-1),(3,-2)],[(-1,-2),(-2,-1),(-1,1)]]
   for i,tar in enumerate(targets):
    for v,(src,tgt) in enumerate(zip(originals,tar)):
     name='ABC'[v];elm=page.locator(f'#F10-02 [data-testid="image-{name}"]');elm.focus()
     for key,count in [('ArrowLeft',max(0,src[0]-tgt[0])),('ArrowRight',max(0,tgt[0]-src[0])),('ArrowDown',max(0,src[1]-tgt[1])),('ArrowUp',max(0,tgt[1]-src[1]))]:
      for _ in range(count):page.keyboard.press(key)
     observed=coords(page.locator(f'#F10-02 [data-testid="image-{name}"]'))
     test(prefix+f'-task{i+1}-{name}',observed.endswith('('+ ('−'+str(-tgt[0]) if tgt[0]<0 else str(tgt[0]))+', '+('−'+str(-tgt[1]) if tgt[1]<0 else str(tgt[1]))+')'),observed)
    page.locator('#F10-02 .nova-btn',has_text='Check').last.click();page.wait_for_timeout(110)
    verdict=page.locator('#F10-02 .nova-fb.ok').count()>0
    test(prefix+f'-challenge-{i+1}-correct',verdict,page.locator('#F10-02 .nova-fb').all_inner_texts())
    if i<2:page.wait_for_timeout(875)
   test(prefix+'-no-browser-errors',len(errs)==0,errs[:4])
   page.close()
 b.close()
output={'total':len(results),'passed':sum(c['passed'] for c in results),'failed':[c for c in results if not c['passed']],'results':results}
(ROOT/'QA-INTERACTIONS.json').write_text(json.dumps(output,indent=2));print('QA SUMMARY',output['passed'],'/',output['total'],'failures:',len(output['failed']))
