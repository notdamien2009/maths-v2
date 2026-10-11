"""Physical F2-style SVG drag, invalid drops and recovery on both viewport sizes and motion settings."""
import json,sys,os
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
HTML=(ROOT/'F7/F7-14-identity-visualiser.html').read_text('utf8');out=[]
def ck(value,label):
 ok=bool(value);out.append({'name':label,'pass':ok});
 if not ok:print('FAIL',label,flush=True)
def pt(page,x,y):return page.evaluate('''([x,y])=>{const s=document.querySelector('svg.f714-svg');let p=s.createSVGPoint();p.x=x;p.y=y;let q=p.matrixTransform(s.getScreenCTM());return {x:q.x,y:q.y};}''',[x,y])
def center(page,loc):
 return loc.evaluate('''g=>{const r=g.getBBox();const s=g.ownerSVGElement;let p=s.createSVGPoint();p.x=r.x+r.width/2;p.y=r.y+r.height/2;const q=p.matrixTransform(s.getScreenCTM());return{x:q.x,y:q.y}}''')
def drag(page,t,dest,steps=17):
 el=page.locator(f'[data-f714-id="{t}"]');page.locator('svg.f714-svg').scroll_into_view_if_needed();a=center(page,el);b=pt(page,*dest)
 page.mouse.move(a['x'],a['y']);page.mouse.down();page.mouse.move(b['x'],b['y'],steps=steps);page.mouse.up();page.wait_for_timeout(520)
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in ([int(os.environ["F714_WIDTH"])] if "F714_WIDTH" in os.environ else [380,1280]):
  for motion in ([os.environ['F714_MOTION']] if 'F714_MOTION' in os.environ else ['reduce','no-preference']):
   print('START',width,motion,flush=True)
   p=b.new_page(viewport={'width':width,'height':900},reduced_motion=motion);errors=[];p.on('pageerror',lambda e:errors.append(str(e)));p.set_content(HTML);p.get_by_role('tab',name='Explore').click()
   g=p.evaluate('F714_MATH.geometry(innerWidth<=700)');left=g['left'];right=g['right'];ret=g['return'];
   l=p.locator('[data-f714-id][data-side="left"][data-home="tray"]').first.get_attribute('data-f714-id')
   r=p.locator('[data-f714-id][data-side="right"][data-home="tray"]').first.get_attribute('data-f714-id')
   ck(p.locator('[data-home="tray"]').count()==8,f'{width}/{motion} starts with eight draggable tokens')
   drag(p,l,(left['x']+left['w']*.6,left['y']+left['h']*.65))
   ck(p.locator(f'[data-f714-id="{l}"]').get_attribute('data-home')=='left',f'{width}/{motion} mouse places left tile')
   ck(p.locator('[data-home="tray"]').count()==7,f'{width}/{motion} one tile removed from tray')
   drag(p,r,(right['x']+right['w']*.58,right['y']+right['h']*.65),steps=8)
   ck(p.locator(f'[data-f714-id="{r}"]').get_attribute('data-home')=='right',f'{width}/{motion} quick drag places right tile')
   drag(p,l,(ret['x']+ret['w']/2,ret['y']+ret['h']/2))
   ck(p.locator(f'[data-f714-id="{l}"]').get_attribute('data-home')=='tray',f'{width}/{motion} Return removes placed tile')
   drag(p,l,(right['x']+right['w']*.55,right['y']+right['h']*.65))
   ck(p.locator(f'[data-f714-id="{l}"]').get_attribute('data-home')=='tray',f'{width}/{motion} wrong-side drop returns home')
   ck('belongs to the left expression' in p.locator('.f714-status').inner_text(),f'{width}/{motion} targeted wrong-side feedback')
   # Pointer cancel should not strand a tile even after moving far away.
   p.locator('svg.f714-svg').scroll_into_view_if_needed();a=center(p,p.locator(f'[data-f714-id="{l}"]'));p.mouse.move(a['x'],a['y']);p.mouse.down();p.mouse.move(a['x']+75,a['y']-55,steps=10);p.keyboard.press('Escape');p.mouse.up();p.wait_for_timeout(520)
   ck(p.locator(f'[data-f714-id="{l}"]').get_attribute('data-home')=='tray',f'{width}/{motion} Escape restores draggable tile')
   ck(p.evaluate('!NOVA.ui._drag'),f'{width}/{motion} no stranded active drag')
   ck(not errors,f'{width}/{motion} no JS exceptions')
   print('FINISH',width,motion,flush=True)
   p.close()
 b.close()
res={'passed':sum(c['pass'] for c in out),'total':len(out),'checks':out};(ROOT/('tests/F7-14-STRESS-'+os.environ.get('F714_WIDTH','all')+'-'+os.environ.get('F714_MOTION','both')+'.json')).write_text(json.dumps(res,indent=2),'utf8');print('STRESS',res['passed'],'/',res['total']);sys.exit(0 if res['passed']==res['total'] else 1)
