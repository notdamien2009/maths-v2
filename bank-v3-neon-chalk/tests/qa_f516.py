from playwright.sync_api import sync_playwright
from pathlib import Path
import json,math
p=Path(__file__).resolve().parents[1]/'F5/F5-16-reverse-percentage-preset.html';res=[]
def ck(name,value,w):
 res.append(dict(name=name,width=w,pass_=bool(value)))
 if not value: print('FAIL',w,name,flush=True)
with sync_playwright() as w:
 b=w.chromium.launch(args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in (380,1280,320,768):
  pg=b.new_page(viewport={'width':width,'height':1000},reduced_motion='reduce' if width in (380,1280) else 'no-preference');pg.set_default_timeout(8000);errors=[];pg.on('pageerror',lambda e:errors.append(str(e)))
  pg.set_content(p.read_text(),wait_until='domcontentloaded',timeout=45000)
  for mode in ('watch','guided','explore','challenge'):
   pg.locator(f'#F5-16 .nova-tab[data-m="{mode}"]').click();pg.wait_for_timeout(35)
   ck(mode+' mounts',pg.locator('#F5-16 svg.rp-svg').count()==1,width)
   ck(mode+' overflow',pg.evaluate('document.documentElement.scrollWidth<=innerWidth'),width)
  pg.locator('#F5-16 .nova-tab[data-m="explore"]').click();pg.wait_for_timeout(50)
  for known,pct,expected in [(96,120,80),(96,75,128),(150,125,120),(70,87.5,80),(250,250,100),(12,10,120),(0,125,0)]:
   pg.evaluate('([k,p])=>NOVA_F5_16_CONFIG._explore.set(k,p)',[known,pct]);pg.wait_for_timeout(12)
   z=pg.evaluate('NOVA_F5_16_CONFIG._explore.get()')
   ck(f'{known}/{pct} original',math.isclose(z['original'],expected,abs_tol=1e-6),width)
   ck(f'{known}/{pct} exact forward check',math.isclose(z['original']*z['multiplier'],known,abs_tol=1e-6),width)
  pg.evaluate('()=>NOVA_F5_16_CONFIG._explore.set(96,120)');pg.wait_for_timeout(45)
  grip=pg.locator('#F5-16 [data-known-percent-handle]');grip.focus();grip.press('ArrowLeft');pg.wait_for_timeout(30)
  ck('keyboard decrement',pg.evaluate('NOVA_F5_16_CONFIG._explore.get().pct')==115,width)
  grip=pg.locator('#F5-16 [data-known-percent-handle]');grip.press('Shift+ArrowRight');pg.wait_for_timeout(30)
  ck('keyboard 0.5 percent',pg.evaluate('NOVA_F5_16_CONFIG._explore.get().pct')==115.5,width)
  if width in (380,1280):
   pg.evaluate('()=>NOVA_F5_16_CONFIG._explore.set(96,120)');pg.wait_for_timeout(45)
   grip=pg.locator('#F5-16 [data-known-percent-handle]');grip.scroll_into_view_if_needed();pg.wait_for_timeout(65)
   v=pg.evaluate('''()=>{let s=document.querySelector('#F5-16 svg.rp-svg'),r=s.querySelector('[data-known-percent-handle]').getBoundingClientRect(),p=s.createSVGPoint(),mob=s.viewBox.baseVal.width===420;p.x=(mob?48:137)+(mob?324:844)*(80-10)/240;p.y=0;let z=p.matrixTransform(s.getScreenCTM());return {sx:(r.left+r.right)/2,sy:(r.top+r.bottom)/2,tx:z.x}}''')
   pg.mouse.move(v['sx'],v['sy']);pg.mouse.down();pg.mouse.move(v['tx'],v['sy'],steps=8);pg.mouse.up();pg.wait_for_timeout(95)
   ck('real drag to 80%',abs(pg.evaluate('NOVA_F5_16_CONFIG._explore.get().pct')-80)<1,width)
   ck('no drag stranded',pg.evaluate('NOVA.ui._drag===null'),width)
  pg.locator('#F5-16 .nova-tab[data-m="challenge"]').click();pg.wait_for_timeout(50)
  drawing=pg.locator('#F5-16 svg.rp-svg').evaluate('(s)=>s.textContent')
  ck('Challenge hides original 80',('£80' not in drawing),width)
  for i,answer in enumerate([80,120,120]):
   pg.locator('#F5-16 .rp-controls input[type=number]').fill(str(answer));pg.locator('#F5-16 .rp-controls button').first.click();pg.wait_for_timeout(120)
   ck('Challenge '+str(i+1),pg.evaluate('NOVA_F5_16_CONFIG._challenge.task()')==min(i+1,2),width)
  ck('zero page errors',not errors,width);pg.close()
 b.close()
report={'total':len(res),'passed':sum(z['pass_'] for z in res),'failed':[z for z in res if not z['pass_']]};(Path(__file__).resolve().parent/'qa-local-results.json').write_text(json.dumps({'summary':report,'checks':res},indent=2));print('FINAL',json.dumps(report),flush=True)
