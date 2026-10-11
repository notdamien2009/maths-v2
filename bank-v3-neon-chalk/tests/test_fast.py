import sys,json
from pathlib import Path
from playwright.sync_api import sync_playwright
r=Path(__file__).resolve().parents[1];src=(r/'bank-v3-neon-chalk/F5/F5-17-recurring-decimal-explorer.html').read_text();w=int(sys.argv[1]);motion='reduce' if w in (380,1280) else 'no-preference';good=0;failed=[]
def ok(x,label):
 global good
 if x:good+=1
 else:failed.append(label);print('FAIL',w,label,flush=True)
with sync_playwright() as pl:
 b=pl.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage']);page=b.new_page(viewport={'width':w,'height':960},reduced_motion=motion)
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(src,wait_until='domcontentloaded');page.wait_for_timeout(40)
 ok(page.locator('#F5-17 svg.loop-svg').count()==1,'mount')
 for mode in ['watch','guided','explore','challenge']:
  page.locator(f'#F5-17 .nova-tab[data-m="{mode}"]').click();page.wait_for_timeout(30)
  ok(page.locator('#F5-17 svg.loop-svg').count()==1,mode+' SVG')
  ok(page.evaluate('document.documentElement.scrollWidth<=innerWidth'),mode+' overflow')
  if w in [380,1280]:page.locator('#F5-17 .nova-stage').screenshot(path=str(r/'shots'/f'F5-17-{w}-{mode}.png'),animations='disabled')
 page.locator('#F5-17 .nova-tab[data-m="explore"]').click();page.wait_for_timeout(35)
 js='NOVA_F5_17_CONFIG._explore'
 cases=[(1,7,'0.(142857)',6,0),(1,3,'0.(3)',1,0),(1,6,'0.1(6)',2,1),(1,8,'0.125',3,-1),(1,28,'0.03(571428)',8,2),(2,11,'0.(18)',2,0),(3,3,'1',0,-1),(3,5,'0.6',1,-1),(1,29,None,28,0),(0,7,'0',0,-1)]
 for n,d,expected,length,idx in cases:
  page.evaluate(f'([n,d])=>{js}.set(n,d)',[n,d]);val=page.evaluate(js+'.get()');ok(expected is None or val['text']==expected,f'exact {n}/{d}');ok(len(val['steps'])==length,f'steps {n}/{d}');ok(val['repeatAt']==idx,f'period start {n}/{d}')
  if w in (380,1280) and (n,d) in [(1,7),(1,6),(1,28),(1,29)]:
   page.evaluate(f'n=>{js}.step(n)',length);page.locator('#F5-17 .nova-stage').screenshot(path=str(r/'shots'/f'F5-17-{w}-{n}-{d}-complete.png'),animations='disabled')
 val=page.evaluate(js+'.get()');page.evaluate(f'()=>{js}.set(1,0)');ok(page.evaluate(js+'.get().d')==val['d'],'invalid denominator leaves state')
 page.evaluate(f'()=>{js}.set(1,7)');page.evaluate(f'()=>{js}.step(2)');page.wait_for_timeout(40)
 ring=page.locator('#F5-17 [data-digit-handle]');ring.focus();ring.press('ArrowRight');page.wait_for_timeout(45);ok(page.evaluate(js+'.get().shown')==3,'arrow key')
 ring=page.locator('#F5-17 [data-digit-handle]');ring.press('Home');page.wait_for_timeout(45);ok(page.evaluate(js+'.get().shown')==0,'home key')
 ring=page.locator('#F5-17 [data-digit-handle]');ring.press('End');page.wait_for_timeout(45);ok(page.evaluate(js+'.get().shown')==6,'end key')
 page.locator('#F5-17 .nova-tab[data-m="challenge"]').click();page.wait_for_timeout(45);ok('0.(142857)' not in page.locator('#F5-17 svg.loop-svg').text_content(),'hide Challenge solution')
 for i,ans in enumerate(['terminating','6','6']):
  page.locator('#F5-17 .loop-controls input').fill(ans);page.locator('#F5-17 .loop-controls button').first.click();page.wait_for_timeout(180)
  ok(page.evaluate('NOVA_F5_17_CONFIG._challenge.task()')==min(i+1,2),f'Challenge {i+1}')
 ok(not errors,'no errors')
 print('RESULT',w,good,'fail',len(failed),failed,'errors',errors,flush=True)
 (r/f'qa-{w}.json').write_text(json.dumps({'width':w,'passed':good,'failed':failed,'errors':errors},indent=2))
 b.close()
