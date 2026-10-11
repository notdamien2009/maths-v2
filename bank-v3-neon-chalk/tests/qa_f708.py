"""F7-08 core maths, responsive four-mode smoke and physical drag & keyboard regression."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,traceback,sys
root=Path(__file__).resolve().parents[1]
html=(root/'F7/F7-08-balance-scales.html').read_text('utf8')
out=[]
def ck(name,condition,detail=''):
 d={'test':name,'pass':bool(condition),'detail':str(detail)[:300]};out.append(d);print(('PASS ' if condition else 'FAIL ')+name+(' '+d['detail'] if not condition else ''),flush=True)
def select_mode(page,name):page.locator(f'#F7-08 button:has-text("{name}")').first.click(timeout=8000)
def svgpoint(page,xy):return page.evaluate('''p=>{const s=document.querySelector('#F7-08 .f708-svg'),a=s.createSVGPoint();a.x=p.x;a.y=p.y;const b=a.matrixTransform(s.getScreenCTM());return{x:b.x,y:b.y}}''',xy)
def drag(page,source,xy):
 o=page.locator(source).first;o.scroll_into_view_if_needed(timeout=6500);b=o.bounding_box();assert b,source;t=svgpoint(page,xy)
 page.mouse.move(b['x']+b['width']/2,b['y']+b['height']/2);page.mouse.down();page.mouse.move(t['x'],t['y'],steps=14);page.mouse.up();page.wait_for_timeout(680)
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [320,380,768,1280]:
  page=b.new_page(viewport={'width':width,'height':960},reduced_motion='reduce');errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  try:
   page.set_content(html,wait_until='load',timeout=40000)
   for mode in ['Watch','Guided','Explore','Challenge']:
    select_mode(page,mode)
    s=page.locator('#F7-08 svg.f708-svg');rect=s.bounding_box()
    ck(f'{width}-{mode}-svg',s.count()==1)
    ck(f'{width}-{mode}-fits',rect is not None and rect['width']>=width*.57 and rect['x']>=-2 and rect['x']+rect['width']<=width+2,rect)
    if width in (380,1280):
     page.locator('#F7-08 .nova-stage').screenshot(path=str(root/f'shots/F7-08/F7-08-{width}-{mode.lower()}.png'))
   ck(f'{width}-presets-valid',page.evaluate('''()=>Object.values(F708_CONFIG.presets).every(p=>{const s=F708_MATH.solution(p);return Number.isInteger(s)&&p.a*s+p.b===p.c*s+p.d})'''))
   ck(f'{width}-challenge-valid',page.evaluate('''()=>F708_CONFIG.challenge.every(p=>p.a*F708_MATH.solution(p)+p.b===p.c*F708_MATH.solution(p)+p.d)'''))
   ck(f'{width}-signed-equation',page.evaluate('''()=>F708_MATH.equation(F708_CONFIG.presets['F7-09-negatives']).includes('− 3')'''))
   ck(f'{width}-math-op-invariant',page.evaluate('''()=>Object.values(F708_CONFIG.presets).every(p=>[-2,-1,1,2].every(k=>{const m=F708_MATH.mathOp(p,'unit',k);return F708_MATH.solution(m)===F708_MATH.solution(p)})&&[-1,1].every(k=>{const m=F708_MATH.mathOp(p,'x',k);return F708_MATH.solution(m)===F708_MATH.solution(p)}))'''))
   ck(f'{width}-no-errors',not errors,errors)
   if width in (380,1280):
    select_mode(page,'Challenge')
    # Check one misconception response before full sequence.
    page.locator('#f708-answer').fill('7');page.locator('#F7-08 button:has-text("Check x")').click()
    ck(f'{width}-wrong-answer',page.locator('#F7-08 .f708-status.bad').count()==1)
    for i,answer in enumerate(['4','3','5','5']):
     page.locator('#f708-answer').fill(answer);page.locator('#F7-08 button:has-text("Check x")').click()
     ck(f'{width}-challenge-{i+1}',page.locator('.f708-win').count()==1 if i==3 else f'Challenge {i+2}' in page.locator('#F7-08 .f708-direction').first.inner_text())
    select_mode(page,'Explore');page.locator('#F7-08 .f708-tools select').first.select_option('Y8-014-both-sides')
    ck(f'{width}-both-sides-loaded',page.locator('svg.f708-svg').get_attribute('data-equation')=='2x + 3 = x + 8')
    page.locator('#F7-08 button:has-text("−x each side")').click()
    ck(f'{width}-cancel-unknown-both-sides',page.locator('svg.f708-svg').get_attribute('data-equation')=='x + 3 = 8')
    page.locator('#F7-08 button:has-text("Undo")').first.click()
    ck(f'{width}-undo-matched',page.locator('svg.f708-svg').get_attribute('data-equation')=='2x + 3 = x + 8')
    page.locator('#F7-08 .f708-tools select').first.select_option('Y7-033-one-step')
    page.evaluate('''()=>document.querySelector('#F7-08 [data-f708-token][data-side="left"][data-type="unit"]').dispatchEvent(new KeyboardEvent('keydown',{key:'Delete',bubbles:true,cancelable:true}))''')
    ck(f'{width}-single-side-tilts',float(page.locator('svg.f708-svg').get_attribute('data-tilt'))!=0)
    ck(f'{width}-pending-tile',page.locator('svg.f708-svg').get_attribute('data-pending').startswith('remove-left-unit'))
    page.evaluate('''()=>document.querySelector('#F7-08 [data-f708-token][data-side="right"][data-type="unit"]').dispatchEvent(new KeyboardEvent('keydown',{key:'r',bubbles:true,cancelable:true}))''')
    ck(f'{width}-paired-removal-balanced',page.locator('svg.f708-svg').get_attribute('data-equation')=='x + 2 = 6')
    ck(f'{width}-beam-level',float(page.locator('svg.f708-svg').get_attribute('data-tilt'))==0)
    page.evaluate('''()=>document.querySelector('#F7-08 [data-f708-source="unit-1"]').dispatchEvent(new KeyboardEvent('keydown',{key:'l',bubbles:true,cancelable:true}))''')
    ck(f'{width}-pending-add',page.locator('svg.f708-svg').get_attribute('data-pending')=='add-left-unit-1')
    page.evaluate('''()=>document.querySelector('#F7-08 [data-f708-source="unit-1"]').dispatchEvent(new KeyboardEvent('keydown',{key:'r',bubbles:true,cancelable:true}))''')
    ck(f'{width}-paired-add',page.locator('svg.f708-svg').get_attribute('data-equation')=='x + 3 = 7')
    page.locator('#F7-08 .f708-tools select').first.select_option('F7-09-negatives')
    ck(f'{width}-negative-balloons',page.locator('[data-f708-token][data-sign="-1"]').count()==3)
    page.locator('#F7-08 .f708-tools select').first.select_option('F7-10-cups')
    ck(f'{width}-cups-preset',page.locator('svg.f708-svg').get_attribute('data-equation')=='x + 2 = 6')
  except Exception as e:
   traceback.print_exc();ck(f'{width}-fatal',False,e)
  page.close()
 # Physical pointer motions, cancellation, stranded pointer states. Red Return zone, not a simulated keyboard action.
 for width in [380,1280]:
  for motion in ['reduce','no-preference']:
   pg=b.new_page(viewport={'width':width,'height':1120},reduced_motion=motion);errors=[];pg.on('pageerror',lambda e:errors.append(str(e)))
   try:
    pg.set_content(html,wait_until='load',timeout=40000);select_mode(pg,'Explore')
    F=pg.evaluate('''()=>F708_MATH.geometry()''');target={'x':F['cx'],'y':F['trayY']+57}
    drag(pg,'#F7-08 [data-f708-token][data-side="left"][data-type="unit"]',target)
    ck(f'{width}-{motion}-native-removal-pending',pg.locator('svg.f708-svg').get_attribute('data-pending').startswith('remove-left-unit'))
    ck(f'{width}-{motion}-no-stranded-removal',pg.evaluate('''()=>!NOVA.ui._drag'''))
    drag(pg,'#F7-08 [data-f708-token][data-side="right"][data-type="unit"]',target)
    ck(f'{width}-{motion}-native-pair-balanced',pg.locator('svg.f708-svg').get_attribute('data-equation')=='x + 2 = 6')
    ck(f'{width}-{motion}-no-stranded-pair',pg.evaluate('''()=>!NOVA.ui._drag'''))
    # Invalid drop: outside zones, original unchanged.
    t=pg.locator('#F7-08 [data-f708-token][data-side="left"][data-type="unit"]').first;t.scroll_into_view_if_needed();bbox=t.bounding_box()
    pg.mouse.move(bbox['x']+bbox['width']/2,bbox['y']+bbox['height']/2);pg.mouse.down();pg.mouse.move(bbox['x']+10,bbox['y']-55,steps=10);pg.mouse.up();pg.wait_for_timeout(500)
    ck(f'{width}-{motion}-invalid-drop-home',pg.locator('svg.f708-svg').get_attribute('data-equation')=='x + 2 = 6')
    ck(f'{width}-{motion}-invalid-not-stranded',pg.evaluate('''()=>!NOVA.ui._drag'''))
    t=pg.locator('#F7-08 [data-f708-token][data-side="left"][data-type="unit"]').first;t.scroll_into_view_if_needed();bbox=t.bounding_box()
    pg.mouse.move(bbox['x']+bbox['width']/2,bbox['y']+bbox['height']/2);pg.mouse.down();pg.mouse.move(bbox['x']+22,bbox['y']+12,steps=5);pg.keyboard.press('Escape');pg.mouse.up();pg.wait_for_timeout(480)
    ck(f'{width}-{motion}-escape-returns',pg.evaluate('''()=>!NOVA.ui._drag'''))
    ck(f'{width}-{motion}-escape-preserves-value',pg.locator('svg.f708-svg').get_attribute('data-equation')=='x + 2 = 6')
    ck(f'{width}-{motion}-no-errors',not errors,errors)
   except Exception as e:traceback.print_exc();ck(f'{width}-{motion}-fatal',False,e)
   pg.close()
 b.close()
(root/'tests/f708-qa-results.json').write_text(json.dumps(out,indent=2),'utf8')
print('RESULT',sum(z['pass'] for z in out),'/',len(out),flush=True)
sys.exit(1 if any(not z['pass'] for z in out) else 0)
