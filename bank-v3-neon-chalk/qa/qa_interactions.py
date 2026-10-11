from playwright.sync_api import sync_playwright
from pathlib import Path
import os,json,math
P=Path(__file__).parent;HTML=(P/'F10-05-y-mx-plus-c-explorer.html').read_text();checks=[]
def check(key,v,detail=''):
    r={'test':key,'passed':bool(v),'detail':str(detail)[:180]};checks.append(r);print(('PASS' if v else 'FAIL'),key,(str(detail)[:200] if not v else ''),flush=True)
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [int(x) for x in os.getenv('WIDTHS','380,1280').split(',')]:
  for motion in os.getenv('MOTIONS','regular,reduced').split(','):
   page=b.new_page(viewport={'width':width,'height':900},reduced_motion='reduce' if motion=='reduced' else 'no-preference');errors=[];page.on('pageerror',lambda ex:errors.append(str(ex)));key=f'{width}-{motion}'
   try:
    page.set_content(HTML,wait_until='domcontentloaded');page.wait_for_timeout(125)
    for mode in ('watch','guided','explore','challenge'):
     page.locator(f'#F10-05 .nova-tab[data-m="{mode}"]').click(timeout=5000);page.wait_for_timeout(75)
     r=page.evaluate('''()=>{let e=document.querySelector('#F10-05 .f105-theatre'),s=document.querySelector('#F10-05 .f105-svg');return {frame:!!e,svg:!!s,bg:e&&getComputedStyle(e).backgroundImage,border:e&&getComputedStyle(e).borderTopWidth,overflow:document.documentElement.scrollWidth>innerWidth+1,mascot:!!document.querySelector('#F10-05 .nv-dockfig')}}''')
     check(key+'-'+mode+'-premium-bg',r['frame'] and r['svg'] and r['bg']!='none' and r['border'] not in ['0px','none'] and not r['overflow'],r)
    page.locator('#F10-05 .nova-tab[data-m="explore"]').click();page.wait_for_timeout(80)
    sel=page.locator('#F10-05 select[aria-label="Lesson preset"]');opts=sel.locator('option').all_text_contents();check(key+'-eleven-presets',len(opts)==11,len(opts))
    for name,m,c in [('Y7-039',1,2),('Y7-060',2,0),('Y8-022',2,1),('Y8-023',-1,3),('Y8-024',1.5,-1),('Y8-025',2,-2),('Y8-029',-1,3),('Y8-032',.5,1),('Y8-035',3,0),('Y8-036',1.5,0),('Y9-020',.75,0)]:
     sel.select_option(name);page.wait_for_timeout(60)
     o=page.evaluate('''()=>{let p=window.F105_CONFIG.presets[document.querySelector('#F10-05 select[aria-label="Lesson preset"]').value];let m=document.querySelector('#F10-05 [data-testid="f105-gradient-value"]'),c=document.querySelector('#F10-05 [data-testid="f105-intercept-value"]');return [p.m,p.c,m?.textContent,c?.textContent]}''')
     check(key+'-preset-'+name,o[0]==m and o[1]==c and float(o[2].replace('−','-'))==m and float(o[3].replace('−','-'))==c,o)
    # c lock and positive scale in direct proportion
    sel.select_option('Y8-036');page.wait_for_timeout(90)
    lock=page.locator('#F10-05 input[aria-label="Y-intercept c"]').count()==0
    graph=page.evaluate('''()=>{let r=window.F105_CONFIG.presets['Y8-036'];return {c:r.c,scale:r.yMax,stepr:r.stepY,proportion:r.proportion}}''')
    check(key+'-direct-proportion-lock',lock and graph['c']==0 and graph['scale']==12 and graph['stepr']==1.5 and graph['proportion'],graph)
    page.locator('#F10-05 input[aria-label="Gradient m"]').fill('2');page.wait_for_timeout(100)
    check(key+'-proportion-slider-c-zero',page.locator('#F10-05 [data-testid="f105-intercept-value"]').inner_text()=='0')
    sel.select_option('Y8-023');page.wait_for_timeout(90)
    # both handles keyboard and slider sync
    grad=page.locator('#F10-05 [data-testid="f105-gradient-handle"]');grad.focus();page.keyboard.press('ArrowUp');page.wait_for_timeout(115)
    rv=page.locator('#F10-05 [data-testid="f105-gradient-value"]').inner_text();check(key+'-gradient-keyboard',rv=='−0.5',rv)
    intercept=page.locator('#F10-05 [data-testid="f105-intercept-handle"]');intercept.focus();page.keyboard.press('ArrowDown');page.wait_for_timeout(115)
    cv=page.locator('#F10-05 [data-testid="f105-intercept-value"]').inner_text();check(key+'-intercept-keyboard',cv=='2.5',cv)
    page.locator('#F10-05 .nova-btn',has_text='Restore lesson rule').click();page.wait_for_timeout(85)
    check(key+'-restore-rule',page.locator('#F10-05 [data-testid="f105-gradient-value"]').inner_text()=='−1' and page.locator('#F10-05 [data-testid="f105-intercept-value"]').inner_text()=='3')
    # Verify native drag by dragging intercept from (0,3) to (0,2.5) in SVG coordinates
    svg=page.locator('#F10-05 .f105-svg');svg.scroll_into_view_if_needed()
    coords=page.evaluate('''()=>{let s=document.querySelector('#F10-05 .f105-svg');let f=(x,y)=>{let q=s.createSVGPoint();q.x=x;q.y=y;let r=q.matrixTransform(s.getScreenCTM());return [r.x,r.y]};return [f(90+226.5,52+(8-3)/16*435),f(90+226.5,52+(8-2.5)/16*435)]}''')
    (x,y),(x2,y2)=coords;page.mouse.move(x,y);page.mouse.down();page.mouse.move(x2,y2,steps=8);page.mouse.up();page.wait_for_timeout(150)
    v=page.locator('#F10-05 [data-testid="f105-intercept-value"]').inner_text();check(key+'-native-intercept-drag',v=='2.5',v)
    # Escape cancels without altering last completed value; leave handler safe to re-grab
    svg.scroll_into_view_if_needed()
    coords=page.evaluate('''()=>{let s=document.querySelector('#F10-05 .f105-svg');let f=(x,y)=>{let q=s.createSVGPoint();q.x=x;q.y=y;let r=q.matrixTransform(s.getScreenCTM());return [r.x,r.y]};return [f(90+226.5,52+(8-2.5)/16*435),f(90+226.5,52+(8-1.5)/16*435)]}''')
    (x,y),(x2,y2)=coords;page.mouse.move(x,y);page.mouse.down();page.mouse.move(x2,y2,steps=6);page.keyboard.press('Escape');page.mouse.up();page.wait_for_timeout(90)
    v=page.locator('#F10-05 [data-testid="f105-intercept-value"]').inner_text();active=page.evaluate('!!window.NOVA.ui._drag');check(key+'-cancel-no-strand',v=='2.5' and not active,(v,active))
    # challenge 1: unsolved answer must not be revealed in text content outside axis ticks
    page.locator('#F10-05 .nova-tab[data-m="challenge"]').click();page.wait_for_timeout(100)
    leak=page.locator('#F10-05 .f105-formula').inner_text();l2=page.locator('#F10-05 .f105-svg').text_content()
    check(key+'-challenge-1-no-coordinate-spoiler','(0, 3)' not in l2 and 'c' in leak,(leak,l2[-100:]))
    ans=page.locator('#F10-05 input[aria-label="Enter the mathematical answer"]');ans.fill('0');page.locator('#F10-05 .nova-btn',has_text='Check').last.click();page.wait_for_timeout(80)
    check(key+'-challenge-1-misconception-feedback',page.locator('#F10-05 .nova-fb.bad').count()>0)
    ans.fill('3');page.locator('#F10-05 .nova-btn',has_text='Check').last.click();page.wait_for_timeout(85)
    check(key+'-challenge-1-correct',page.locator('#F10-05 .nova-fb.ok').count()>0)
    page.wait_for_timeout(1070)
    handle=page.locator('#F10-05 [data-testid="f105-gradient-handle"]');check(key+'-challenge-2-handle',handle.count()==1)
    if handle.count():
      handle.focus()
      for _ in range(6):page.keyboard.press('ArrowDown')
      page.wait_for_timeout(90)
      m=handle.get_attribute('aria-valuenow') if handle.count() else ''
      check(key+'-challenge-2-keyboard-gradient',m=='-1',m)
      page.locator('#F10-05 .nova-btn',has_text='Check').last.click();page.wait_for_timeout(95)
      check(key+'-challenge-2-correct',page.locator('#F10-05 .nova-fb.ok').count()>0)
    page.wait_for_timeout(1070)
    inp=page.locator('#F10-05 input[aria-label="Enter the mathematical answer"]');check(key+'-challenge-3-available',inp.count()==1)
    if inp.count():inp.fill('10');page.locator('#F10-05 .nova-btn',has_text='Check').last.click();page.wait_for_timeout(85);check(key+'-challenge-3-correct',page.locator('#F10-05 .nova-fb.ok').count()>0)
    check(key+'-zero-browser-errors',not errors,errors)
   except Exception as e:check(key+'-suite-completes',False,repr(e))
   finally:page.close()
 b.close()
out={'total':len(checks),'passed':sum(c['passed'] for c in checks),'failed':[c for c in checks if not c['passed']],'checks':checks}
name='QA-INTERACTIONS-'+os.getenv('WIDTHS','380,1280').replace(',','-')+'-'+os.getenv('MOTIONS','regular,reduced').replace(',','-')+'.json'
(P/name).write_text(json.dumps(out,indent=2));print('RESULT',out['passed'],'/',out['total'],'FAIL',len(out['failed']),flush=True)
