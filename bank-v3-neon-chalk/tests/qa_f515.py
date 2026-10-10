from playwright.sync_api import sync_playwright
from pathlib import Path
import math,json,os
p=(Path(__file__).resolve().parents[1]/'F5/F5-15-percentage-change-and-multipliers.html'); shots=(Path(__file__).resolve().parents[1]/'shots/F5')
rows=[]
def check(ok,name,width,motion):
 rows.append(dict(ok=bool(ok),name=name,width=width,motion=motion))
 if not ok:print('FAIL',width,motion,name,flush=True)
with sync_playwright() as w:
 b=w.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width,motion in [(380,'reduce'),(1280,'reduce'),(320,'no-preference'),(768,'no-preference')]:
  pg=b.new_page(viewport={'width':width,'height':1000},reduced_motion=motion);pg.set_default_timeout(12000)
  errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
  pg.set_content(p.read_text(),wait_until='domcontentloaded',timeout=45000);pg.wait_for_timeout(110)
  check(not errs,'initial no errors',width,motion)
  check(pg.locator('#F5-15 svg.pc-svg').count()==1,'svg mounted',width,motion)
  check(pg.evaluate('document.documentElement.scrollWidth<=innerWidth'),'no overflow',width,motion)
  for mode in ['watch','guided','explore','challenge']:
   pg.locator(f'#F5-15 .nova-tab[data-m="{mode}"]').click();pg.wait_for_timeout(65)
   check(pg.locator('#F5-15 svg.pc-svg').count()==1,f'{mode} SVG',width,motion)
   if width in (380,1280):pg.locator('#F5-15 .nova-stage').screenshot(path=str(shots/f'F5-15-{width}-{mode}.png'),animations='disabled')
  pg.locator('#F5-15 .nova-tab[data-m="guided"]').click();pg.wait_for_timeout(40)
  for i in range(6):
   pg.evaluate('i=>{const b=document.querySelector("#F5-15 .nova-tl [data-step=\""+i+"\"]");if(b)b.click();}',i) if False else None
  pg.locator('#F5-15 .nova-tab[data-m="explore"]').click();pg.wait_for_timeout(80)
  base='NOVA_F5_15_CONFIG._explore'
  cases=[(80,20,96,1.2),(120,-25,90,.75),(60,150,150,2.5),(75,-100,0,0),(90,0,90,1),(64,12.5,72,1.125),(180,-50,90,.5),(100,200,300,3),(0,125,0,2.25),(39,-37.5,24.375,.625),(250,60,400,1.6)]
  for a,c,res,mult in cases:
   pg.evaluate('([a,c])=>'+base+'.set(a,c)',[a,c]);pg.wait_for_timeout(18)
   z=pg.evaluate(base+'.get()')
   check(math.isclose(z['after'],res,abs_tol=1e-8),f'after: {a} with {c}',width,motion)
   check(math.isclose(z['multiplier'],mult,abs_tol=1e-8),f'multiplier {c}',width,motion)
   check(pg.evaluate('document.documentElement.scrollWidth<=innerWidth'),f'overflow {c}',width,motion)
   check(pg.locator('#F5-15 [data-change-handle]').get_attribute('aria-valuenow')==str(int(c) if float(c).is_integer() else c),f'handle aria {c}',width,motion)
  if width in (380,1280):
   for name,c in [('decrease',-25),('increase150',150),('zero',-100),('nochange',0)]:
    pg.evaluate('c=>'+base+'.set(80,c)',c);pg.wait_for_timeout(50)
    pg.locator('#F5-15 .nova-stage').screenshot(path=str(shots/f'F5-15-{width}-{name}.png'),animations='disabled')
  pg.evaluate('()=>'+base+'.set(80,20)');pg.wait_for_timeout(80)
  handle=pg.locator('#F5-15 [data-change-handle]');handle.focus();handle.press('ArrowLeft');pg.wait_for_timeout(45)
  check(pg.evaluate(base+'.get().p')==15,'arrow left -5%',width,motion)
  handle=pg.locator('#F5-15 [data-change-handle]');handle.press('Shift+ArrowRight');pg.wait_for_timeout(45)
  check(pg.evaluate(base+'.get().p')==15.5,'shift half percent',width,motion)
  handle=pg.locator('#F5-15 [data-change-handle]');handle.press('Home');pg.wait_for_timeout(45)
  check(pg.evaluate(base+'.get().p')==-100,'home -100%',width,motion)
  handle=pg.locator('#F5-15 [data-change-handle]');handle.press('End');pg.wait_for_timeout(45)
  check(pg.evaluate(base+'.get().p')==200,'end +200%',width,motion)
  if width in (380,1280):
   # Move real pointer from 200% handle to +50% position along 300%-span scale.
   h=pg.locator('#F5-15 [data-change-handle]');h.scroll_into_view_if_needed();pg.wait_for_timeout(70)
   pts=pg.evaluate('''()=>{let s=document.querySelector('#F5-15 svg.pc-svg'), g=s.querySelector('[data-change-handle]');let bbox=g.getBoundingClientRect(),cx=bbox.left+bbox.width/2,cy=bbox.top+bbox.height/2;let val=x=>{let p=s.createSVGPoint();p.x=x;p.y=0;let a=s.getScreenCTM();return p.matrixTransform(a);}; let target=val(s.viewBox.baseVal.width===420?49+322*.5:138+838*.5);return {sx:cx,sy:cy,tx:target.x,ty:cy};}''')
   pg.mouse.move(pts['sx'],pts['sy']);pg.mouse.down();pg.mouse.move(pts['tx'],pts['ty'],steps=10);pg.mouse.up();pg.wait_for_timeout(200)
   check(abs(pg.evaluate(base+'.get().p')-50)<=1,'real drag snaps to +50%',width,motion)
   check(pg.evaluate('NOVA.ui._drag===null'),'drag not stranded',width,motion)
   # All 3 challenges; final answer must not be printed before submission.
   pg.locator('#F5-15 .nova-tab[data-m="challenge"]').click();pg.wait_for_timeout(70)
   contents=pg.locator('#F5-15 svg.pc-svg').evaluate('(s)=>s.textContent')
   check('96 units' not in contents and '× 1.2' not in contents,'Challenge hides result/multiplier',width,motion)
   for i,ans in enumerate([96,90,150]):
    pg.locator('#F5-15 .pc-controls input[type=number]').fill(str(ans))
    pg.locator('#F5-15 .pc-controls button').first.click();pg.wait_for_timeout(70)
    check(pg.evaluate('NOVA_F5_15_CONFIG._challenge.task()')==min(i+1,2),f'Challenge {i+1}',width,motion)
  check(not errs,'zero uncaught browser errors',width,motion)
  pg.close()
 b.close()
report={'total':len(rows),'passed':sum(r['ok'] for r in rows),'failed':[r for r in rows if not r['ok']]}
(Path(__file__).resolve().parent/'qa-results.json').write_text(json.dumps({'summary':report,'checks':rows},indent=2))
print('RESULT',json.dumps(report),flush=True)
