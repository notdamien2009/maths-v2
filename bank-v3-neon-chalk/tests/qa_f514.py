from pathlib import Path
from playwright.sync_api import sync_playwright
import json,math
p=Path(__file__).resolve().parents[1]/'F5/F5-14-percentage-of-an-amount.html'
shots=Path(__file__).resolve().parents[1]/'shots/F5';shots.mkdir(parents=True,exist_ok=True)
rows=[]
def test(ok,label,width):
 rows.append(dict(test=label,width=width,passed=bool(ok)))
 if not ok:print('FAIL',width,label,flush=True)
with sync_playwright() as w:
 b=w.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in (380,1280,320,768):
  for motion in (['reduce','no-preference'] if width in (320,768) else ['reduce']):
   page=b.new_page(viewport={'width':width,'height':940},reduced_motion=motion)
   errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.set_content(p.read_text(),wait_until='domcontentloaded',timeout=45000)
   page.wait_for_timeout(100)
   test(not errors,'initial javascript',width)
   test(page.locator('#F5-14 .pa-svg').count()==1,'initial SVG',width)
   test(page.evaluate('document.documentElement.scrollWidth<=innerWidth'),'no horizontal overflow',width)
   for mode in ('watch','guided','explore','challenge'):
    tab=page.locator('#F5-14 .nova-tab[data-m="'+mode+'"]');tab.click();page.wait_for_timeout(70)
    test(page.locator('#F5-14 .pa-svg').count()==1,f'{mode} renders',width)
    if width in (380,1280):
     page.locator('#F5-14 .nova-stage').screenshot(path=str(shots/f'F5-14-{width}-{mode}.png'),animations='disabled')
   page.locator('#F5-14 .nova-tab[data-m="explore"]').click();page.wait_for_timeout(80)
   conf='NOVA_F5_14_CONFIG._explore'
   for a,pc,expected in [(80,25,20),(64,12.5,8),(240,35,84),(60,150,90),(180,0,0),(75,200,150),(39,0.5,.195),(0,200,0),(73,37.5,27.375)]:
    page.evaluate('([a,p])=>'+conf+'.set(a,p)',[a,pc]);page.wait_for_timeout(22)
    got=page.evaluate(conf+'.get()')
    test(math.isclose(got['result'],expected,abs_tol=1e-9),f'arithmetic {a} at {pc}%',width)
    test(not page.evaluate('document.documentElement.scrollWidth>innerWidth'),f'no overflow {pc}%',width)
    test(page.locator('#F5-14 [data-percent-handle]').get_attribute('aria-valuenow')==str(pc if not float(pc).is_integer() else int(pc)),f'handle {pc}%',width)
   page.evaluate(conf+'.set(60,150)');page.wait_for_timeout(65)
   if width in (380,1280):page.locator('#F5-14 .nova-stage').screenshot(path=str(shots/f'F5-14-{width}-over-100.png'),animations='disabled')
   h=page.locator('#F5-14 [data-percent-handle]');h.focus();h.press('ArrowLeft');page.wait_for_timeout(45)
   got=page.evaluate(conf+'.get()');test(got['percent']==145,'arrow left 5%',width)
   h=page.locator('#F5-14 [data-percent-handle]');h.press('Shift+ArrowRight');page.wait_for_timeout(45)
   got=page.evaluate(conf+'.get()');test(got['percent']==145.5,'shift arrow half percent',width)
   h=page.locator('#F5-14 [data-percent-handle]');h.press('Home');page.wait_for_timeout(45)
   test(page.evaluate(conf+'.get().percent')==0,'home 0%',width)
   h=page.locator('#F5-14 [data-percent-handle]');h.press('End');page.wait_for_timeout(45)
   test(page.evaluate(conf+'.get().percent')==200,'end 200%',width)
   if width in (380,1280):
    # True pointer movement from marker to 50% of the full 0-200 scale.
    h=page.locator('#F5-14 [data-percent-handle]');h.scroll_into_view_if_needed();page.wait_for_timeout(55)
    xy=page.evaluate('''()=>{let s=document.querySelector('#F5-14 .pa-svg');let h=s.querySelector('[data-percent-handle]');let cx=h.querySelector('circle').getAttribute('cx');let cy=h.querySelector('circle').getAttribute('cy');let A=s.createSVGPoint();A.x=+cx;A.y=+cy;let q=A.matrixTransform(s.getScreenCTM());let B=s.createSVGPoint();B.x=(innerWidth<=670?56:130)+(innerWidth<=670?308:860)*.25;B.y=innerWidth<=670?635:650;let t=B.matrixTransform(s.getScreenCTM());return {from:{x:q.x,y:q.y},to:{x:t.x,y:t.y}}}''')
    page.mouse.move(xy['from']['x'],xy['from']['y']);page.mouse.down();page.mouse.move(xy['to']['x'],xy['to']['y'],steps=7);page.mouse.up();page.wait_for_timeout(140)
    got=page.evaluate(conf+'.get()')
    test(abs(got['percent']-50)<=1,'real drag snap to 50 percent',width)
    test(page.evaluate('NOVA.ui._drag===null'),'no stranded drag',width)
    # Challenge all three answers
    page.locator('#F5-14 .nova-tab[data-m="challenge"]').click();page.wait_for_timeout(65)
    test(page.locator('#F5-14 .pa-svg').count()==1,'challenge svg',width)
    txt=page.locator('#F5-14 .pa-svg').evaluate('(s)=>s.textContent')
    test('20 units' not in txt,'challenge hides correct answer',width)
    for i,ans in enumerate([20,8,90]):
     page.locator('#F5-14 .pa-controls input[type=number]').fill(str(ans))
     page.locator('#F5-14 .pa-controls button').first.click();page.wait_for_timeout(560 if i<2 else 90)
     test(page.evaluate('NOVA_F5_14_CONFIG._challenge.task()')==min(i+1,2),f'challenge answer {i+1}',width)
   test(not errors,'no javascript errors final',width)
   page.close()
 b.close()
report={'passed':sum(r['passed'] for r in rows),'count':len(rows),'failures':[r for r in rows if not r['passed']]}
Path(__file__).with_name('qa-results.json').write_text(json.dumps({'summary':report,'tests':rows},indent=2))
print('SUMMARY',json.dumps(report),flush=True)
