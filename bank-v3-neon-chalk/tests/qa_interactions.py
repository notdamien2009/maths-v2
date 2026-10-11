from playwright.sync_api import sync_playwright
from pathlib import Path
import os,sys,json,math
ROOT=Path(__file__).parent
PAGE=ROOT/'F10-03-midpoint-and-distance.html';PAGE=PAGE if PAGE.exists() else ROOT.parent/'F10/F10-03-midpoint-and-distance.html'
SOURCE=PAGE.read_text()
results=[]
def test(name,ok,detail=''):
 row={'test':name,'passed':bool(ok),'detail':str(detail)[:280]};results.append(row)
 print(('PASS ' if ok else 'FAIL ')+name+' '+('' if ok else str(detail)[:100]),flush=True)
def label(el):return el.get_attribute('aria-label') if el.count() else ''
with sync_playwright() as pl:
 browser=pl.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 widths=[int(x) for x in os.getenv('WIDTHS','380,1280').split(',')]
 motions=os.getenv('MOTIONS','regular,reduced').split(',')
 for w in widths:
  for motion in motions:
   page=browser.new_page(viewport={'width':w,'height':900},reduced_motion='reduce' if motion=='reduced' else 'no-preference')
   errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   prefix=f'{w}-{motion}'
   try:
    page.set_content(SOURCE,wait_until='domcontentloaded');page.wait_for_timeout(170)
    for mode in ['watch','guided','explore','challenge']:
     page.locator(f'#F10-03 .nova-tab[data-m="{mode}"]').click(timeout=3000);page.wait_for_timeout(95)
     d=page.evaluate('''()=>{let e=document.querySelector('#F10-03 .f103-theatre'),s=document.querySelector('#F10-03 .f103-svg');return {stage:!!e,svg:!!s,bg:e?getComputedStyle(e).backgroundImage:'none',border:e?getComputedStyle(e).borderTopWidth:'none',overflow:document.documentElement.scrollWidth>innerWidth+1,axis:s?!!s.querySelector('.f103-grid'):false,card:document.querySelectorAll('#F10-03 .f103-info .nv-ncard').length}}''')
     test(prefix+'-'+mode+'-prem-stage',d['stage'] and d['svg'] and d['bg']!='none' and d['border'] not in ['0px','none'] and d['axis'] and d['card']==3 and not d['overflow'],d)
    page.locator('#F10-03 .nova-tab[data-m="explore"]').click();page.wait_for_timeout(120)
    a=page.locator('#F10-03 [data-testid="f103-A"]');before=label(a);a.focus();page.keyboard.press('ArrowUp');page.wait_for_timeout(120)
    after=label(page.locator('#F10-03 [data-testid="f103-A"]'))
    test(prefix+'-A-keyboard',before!=after and after.endswith('(−3, −1)'),(before,after))
    b=page.locator('#F10-03 [data-testid="f103-B"]');b.focus();page.keyboard.press('ArrowLeft');page.wait_for_timeout(130)
    after=label(page.locator('#F10-03 [data-testid="f103-B"]'))
    test(prefix+'-B-keyboard',after.endswith('(0, 1)'),after)
    options=page.locator('#F10-03 select').first.locator('option').all_text_contents()
    test(prefix+'-five-presets',len(options)==5,options)
    page.locator('#F10-03 select').first.select_option('F15-03');page.wait_for_timeout(130)
    l1=label(page.locator('#F10-03 [data-testid="f103-A"]'));l2=label(page.locator('#F10-03 [data-testid="f103-B"]'))
    test(prefix+'-F15-03-preset',l1.endswith('(−2, −3)') and l2.endswith('(2, 0)'),(l1,l2))
    page.locator('#F10-03 select').first.select_option('Y9-040');page.wait_for_timeout(130)
    mtext=page.locator('#F10-03 .f103-info').inner_text()
    test(prefix+'-Y9-040-preset','(−3, 3)' in mtext and '(3, −1)' in mtext,mtext[:200])
    page.locator('#F10-03 select').first.select_option('Y8-045');page.wait_for_timeout(130)
    board=page.locator('#F10-03 .f103-svg');board.scroll_into_view_if_needed()
    def at(x,y):return board.evaluate('''(el,p)=>{const pt=el.createSVGPoint();pt.x=p[0];pt.y=p[1];const out=pt.matrixTransform(el.getScreenCTM());return {x:out.x,y:out.y};}''',[90+(x+5)*44.6,52+(5-y)*44.6])
    a=at(-3,-2);dest=at(-2,-1)
    page.mouse.move(a['x'],a['y']);page.mouse.down();page.mouse.move(dest['x'],dest['y'],steps=16);page.wait_for_timeout(130);page.mouse.up();page.wait_for_timeout(400)
    l1=label(page.locator('#F10-03 [data-testid="f103-A"]'))
    test(prefix+'-native-drag-snap',l1.endswith('(−2, −1)'),l1)
    board.scroll_into_view_if_needed();a=at(-2,-1);dest=at(-1,0)
    page.mouse.move(a['x'],a['y']);page.mouse.down();page.mouse.move(dest['x'],dest['y'],steps=8);page.keyboard.press('Escape');page.mouse.up();page.wait_for_timeout(400)
    state=page.evaluate('!!window.NOVA.ui._drag');l1=label(page.locator('#F10-03 [data-testid="f103-A"]'))
    test(prefix+'-drag-cancel-recovery',l1.endswith('(−2, −1)') and not state,(l1,state))
    # midpoint and distance mathematical evidence not spoiled
    page.locator('#F10-03 .nova-tab[data-m="challenge"]').click();page.wait_for_timeout(130)
    textp=page.locator('#F10-03 .f103-info').inner_text()
    test(prefix+'-challenge-no-answer-leak','M = ( ? , ? )' in textp and 'M = (−1, 0)' not in textp,textp[-230:])
    test(prefix+'-Izaac-present',page.locator('#F10-03 .f103-peer img[alt]').count()==1)
    page.locator('#F10-03 .nova-btn',has_text='Hint').last.click();page.wait_for_timeout(90)
    hist=page.evaluate("NOVA.events.history().some(e=>e.type==='hintUsed'&&e.detail.engine==='F10-03')")
    test(prefix+'-hint-event',hist)
    page.locator('#F10-03 .nova-btn',has_text='Check').last.click();page.wait_for_timeout(90)
    test(prefix+'-wrong-feedback',page.locator('#F10-03 .nova-fb.bad').count()>0)
    marker=page.locator('#F10-03 [data-testid="f103-M"]');marker.focus();page.keyboard.press('ArrowLeft');page.keyboard.press('ArrowLeft');page.wait_for_timeout(90)
    l1=label(page.locator('#F10-03 [data-testid="f103-M"]'))
    test(prefix+'-midpoint-half-grid',l1.endswith('(−1, 0)'),l1)
    page.locator('#F10-03 .nova-btn',has_text='Check').last.click();page.wait_for_timeout(120)
    test(prefix+'-midpoint-graded',page.locator('#F10-03 .nova-fb.ok').count()>0)
    page.wait_for_timeout(930)
    inp=page.locator('#F10-03 input[aria-label="Distance answer"]')
    test(prefix+'-distance-form',inp.count()==1)
    inp.fill('5');page.locator('#F10-03 .nova-btn',has_text='Check').last.click();page.wait_for_timeout(130)
    test(prefix+'-integer-distance-graded',page.locator('#F10-03 .nova-fb.ok').count()>0)
    page.wait_for_timeout(930)
    inp=page.locator('#F10-03 input[aria-label="Distance answer"]');inp.fill('2√13')
    page.locator('#F10-03 .nova-btn',has_text='Check').last.click();page.wait_for_timeout(110)
    test(prefix+'-exact-surd-distance-graded',page.locator('#F10-03 .nova-fb.ok').count()>0)
    test(prefix+'-no-js-errors',not errors,errors[:3])
   except Exception as e:
    test(prefix+'-script-completes',False,str(e)[:400])
   finally:page.close()
 browser.close()
out={'total':len(results),'passed':sum(e['passed'] for e in results),'failed':[e for e in results if not e['passed']],'results':results}
(ROOT/'QA-INTERACTIONS-ALL.json').write_text(json.dumps(out,indent=2))
print('SUMMARY',out['passed'],'/',out['total'],'failed',len(out['failed']),flush=True)
