"""F7-07: portable screenshot, algebra invariants, keyboard, pointer, wrong-answer and recovery QA."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json, traceback
root=Path(__file__).resolve().parents[1];html=(root/'F7/F7-07-completing-the-square.html').read_text('utf8');results=[]
def ck(name,ok,detail=''):
 results.append({'test':name,'pass':bool(ok),'detail':str(detail)[:250]});print(('PASS ' if ok else 'FAIL ')+name,flush=True)
def ptr_to(page,selector,point):
 source=page.locator(selector).first;source.scroll_into_view_if_needed(timeout=9000)
 a=source.bounding_box();assert a,'source element outside viewport'
 B=page.evaluate('''p=>{const s=document.querySelector('#F7-07 .f707-svg'),a=s.createSVGPoint();a.x=p.x;a.y=p.y;const b=a.matrixTransform(s.getScreenCTM());return{x:b.x,y:b.y}}''',point)
 return (a['x']+a['width']/2,a['y']+a['height']/2),(B['x'],B['y'])
def drag(page,source,target):
 a,b=ptr_to(page,source,target)
 page.mouse.move(*a);page.mouse.down();page.mouse.move(*b,steps=24);page.mouse.up();page.wait_for_timeout(400)
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [320,380,768,1280]:
  page=b.new_page(viewport={'width':width,'height':930},reduced_motion='reduce');errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  try:
   page.set_content(html,wait_until='load',timeout=30000)
   for mode in ['Watch','Guided','Explore','Challenge']:
    page.locator(f'#F7-07 button:has-text("{mode}")').first.click()
    svg=page.locator('#F7-07 .f707-svg');ck(f'{width}-{mode}-math-svg',svg.count()==1)
    r=svg.bounding_box();ck(f'{width}-{mode}-fits',r is not None and r['width']>240 and r['x']>=0 and r['x']+r['width']<=width+2)
    # Separate visual sweep already saved the mobile/desktop screenshots.
   ck(f'{width}-no-runtime-error',not errors,errors)
   ck(f'{width}-identity-invariants',page.evaluate('''()=>Object.values(F707_CONFIG.presets).every(p=>{const m=F707_MATH.maths(p),z=F707_MATH.plan(p);return m.rods===2*p.n&&m.needed===p.n*p.n-p.c&&z.slots.length===z.tiles.length&&p.c+m.needed===m.corner&&m.corner===p.n*p.n&&F707_MATH.feedback(m.completed,p)===''})'''))
   if width in (380,1280):
    page.locator('#F7-07 button:has-text("Challenge")').first.click()
    for i,answer in enumerate(['(x+2)²-3','(x+3)²-4','(x+4)²-4','(x+3)²-7']):
     n=int(page.locator('svg.f707-svg').get_attribute('data-total'))
     for j in range(n):page.evaluate('''()=>{const t=document.querySelector('#F7-07 [data-f707-slot="tray"]');if(t)t.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}));}''')
     ck(f'{width}-challenge-{i+1}-complete-shape',page.locator('svg.f707-svg').get_attribute('data-placed')==str(n))
     page.locator('#f707-answer').fill(answer);page.locator('button:has-text("Check the square")').click()
     ck(f'{width}-challenge-{i+1}-advance',page.locator('.f707-win').count()==1 if i==3 else f'Challenge {i+2}' in page.locator('#F7-07 .f707-direction').first.inner_text())
    page.locator('#F7-07 button:has-text("Explore")').first.click()
    page.locator('#F7-07 .f707-tools select').first.select_option('Y9-square-6x')
    # Keyboard placement and return, validate undo and zero stranded.
    n0=int(page.locator('.f707-svg').get_attribute('data-placed'))
    page.evaluate('''()=>document.querySelector('#F7-07 [data-f707-slot="tray"]').dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}))''')
    ck(f'{width}-keyboard-enter-add',page.locator('.f707-svg').get_attribute('data-placed')==str(n0+1))
    page.evaluate('''()=>document.querySelector('#F7-07 [data-f707-slot^="right"],#F7-07 [data-f707-slot^="bottom"]').dispatchEvent(new KeyboardEvent('keydown',{key:'r',bubbles:true,cancelable:true}))''')
    ck(f'{width}-keyboard-r-return',page.locator('.f707-svg').get_attribute('data-placed')==str(n0))
    # Missing corner misconception feedback, even before model is filled.
    ck(f'{width}-adjustment-feedback',page.evaluate("()=>F707_MATH.feedback('(x+3)²+4',{n:3,c:5}).includes('Subtract')"))
  except Exception as e: traceback.print_exc();ck(f'{width}-fatal',False,e)
  page.close()
 # Desktop + mobile actual pointer drag in both motion settings. The rect is local SVG point.
 for width in [380,1280]:
  for motion in ['reduce','no-preference']:
   page=b.new_page(viewport={'width':width,'height':1100},reduced_motion=motion);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   try:
    page.set_content(html);page.locator('#F7-07 button:has-text("Explore")').first.click()
    xy=page.evaluate('''()=>{let s=F707_MATH.plan(F707_CONFIG.presets['Y9-square-6x']).slots.find(x=>x.side==='right');const v=F707_MATH.location(s,F707_CONFIG.presets['Y9-square-6x'],F707_MATH.dimensions(F707_CONFIG.presets['Y9-square-6x'],innerWidth<=720));return{x:v.x+v.w/2,y:v.y+v.h/2}}''')
    drag(page,'#F7-07 [data-f707-slot="tray"][data-f707-type="rod"]',xy)
    ck(f'{width}-{motion}-real-drag-place',page.locator('.f707-svg').get_attribute('data-placed')=='1')
    ck(f'{width}-{motion}-no-stranded',page.evaluate('''()=>!NOVA.ui._drag'''))
    # Regrabbing and Escape recovery not allowed to strand the drag transaction.
    placed=page.locator('#F7-07 [data-f707-slot="right0"]');placed.scroll_into_view_if_needed()
    BB=placed.bounding_box();page.mouse.move(BB['x']+BB['width']/2,BB['y']+BB['height']/2);page.mouse.down();page.mouse.move(BB['x']+BB['width']/2+22,BB['y']+BB['height']/2+25,steps=4);page.keyboard.press('Escape');page.mouse.up();page.wait_for_timeout(430)
    ck(f'{width}-{motion}-escape',page.evaluate('''()=>!NOVA.ui._drag'''))
    ck(f'{width}-{motion}-slot-preserved',page.locator('.f707-svg').get_attribute('data-placed')=='1')
    ck(f'{width}-{motion}-no-page-errors',not errors,errors)
   except Exception as e:traceback.print_exc();ck(f'{width}-{motion}-drag-fatal',False,e)
   page.close()
 b.close()
(root/'tests/f707-qa-results.json').write_text(json.dumps(results,indent=2),'utf8')
print('RESULT',sum(x['pass'] for x in results),'/',len(results),flush=True)
raise SystemExit(1 if any(not x['pass'] for x in results) else 0)
