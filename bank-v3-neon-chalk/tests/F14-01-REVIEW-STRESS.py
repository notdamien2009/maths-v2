"""F14-01 browser acceptance checks. Requires Python Playwright and Chromium.
Run: python test_F14-01.py
"""
from pathlib import Path
import json
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).parent
html=(ROOT/'F14-01-reflection.html').read_text()
report={'engine':'F14-01','tests':[],'errors':[]}

def assert_test(name,ok,details=''):
    report['tests'].append({'test':name,'pass':bool(ok),'detail':details})
    if not ok:
        print('FAIL',name,details)
    else:
        print('PASS',name)

with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    for width,height in [(380,820),(1280,900)]:
        ctx=browser.new_context(viewport={'width':width,'height':height},device_scale_factor=1)
        page=ctx.new_page()
        errs=[]
        page.on('pageerror',lambda e:errs.append(str(e)))
        page.on('console',lambda m:errs.append('console: '+m.text) if m.type=='error' else None)
        page.set_content(html,wait_until='load')
        for mode in ('Watch','Guided','Explore','Challenge'):
            page.get_by_role('tab',name=mode).click()
            page.screenshot(path=str(ROOT/f'F14-01-{width}-{mode.lower()}.png'),full_page=True,animations='disabled')
            assert_test(f'{width} {mode} visible',page.locator('.stage').is_visible() and page.locator('#pip').count()==1)
            assert_test(f'{width} {mode} no horizontal overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
            assert_test(f'{width} {mode} dock inside stage',page.evaluate('''()=>{let a=document.querySelector('#pip').getBoundingClientRect(),b=document.querySelector('#stage').getBoundingClientRect();return a.x>=b.x&&a.right<=b.right&&a.y>=b.y&&a.bottom<=b.bottom}'''))
        assert_test(f'{width} mode consoles clear',len(errs)==0,str(errs))
        page.get_by_role('tab',name='Watch').click()
        page.locator('#next').click()
        page.locator('#scrub').fill('5')
        assert_test(f'{width} step scrub',page.locator('#capTag').inner_text().endswith('6 OF 6'))
        page.get_by_role('tab',name='Explore').click()
        page.locator('#preset').select_option('x-one')
        assert_test(f'{width} x=1 exact coordinates',page.locator('#metricTo').inner_text()=='A′ (6, 1)')
        page.locator('#preset').select_option('diagonal')
        assert_test(f'{width} y=x exact coordinates',page.locator('#metricTo').inner_text()=='A′ (1, −4)')
        page.locator('#preset').select_option('y-axis')
        # Re-grab + cancel, keyboard, and snap stress using local state from metrics/rendered polygon.
        poly=page.locator('[data-drag=image]')
        poly.focus()
        for k in ('ArrowLeft','ArrowUp','ArrowRight','ArrowDown'):
            page.keyboard.press(k);page.wait_for_timeout(35)
        assert_test(f'{width} repeated keyboard re-grab',page.locator('[data-drag=image]').is_visible())
        page.locator('#recenter').click()
        # Start a drag then cancel with Escape; original image must remain re-grabbable.
        poly=page.locator('[data-drag=image]')
        bb=poly.bounding_box();originX=bb['x']+bb['width']/2;originY=bb['y']+bb['height']/2
        page.mouse.move(originX,originY);page.mouse.down()
        page.mouse.move(originX+12,originY,steps=2)
        page.keyboard.press('Escape')
        page.mouse.up()
        page.wait_for_timeout(45)
        assert_test(f'{width} Escape cancels drag and re-grab remains',page.locator('[data-drag=image]').is_visible() and not page.locator('#board').get_attribute('class')=='board dragging')
        page.get_by_role('tab',name='Challenge').click()
        page.locator('#chHint').click()
        assert_test(f'{width} first hint', 'y-coordinates stay unchanged' in page.locator('#chFeedback').inner_text())
        # Fast pointer drag: image moves by +3 grid units.
        svg=page.locator('#gridSvg');a=page.locator('[data-drag=image]').bounding_box();box=svg.bounding_box()
        px=a['x']+a['width']/2;py=a['y']+a['height']/2
        unit_px=box['width']/(435 if width<=740 else 650)*30
        page.mouse.move(px,py);page.mouse.down();page.mouse.move(px+3*unit_px,py,steps=4);page.mouse.up()
        page.locator('#check').click()
        assert_test(f'{width} fast drag correct',page.locator('#chFeedback').inner_text().startswith('Correct:'))
        page.locator('#chNext').click()
        assert_test(f'{width} challenge 2 diagram matches question',page.locator('#metricFrom').inner_text()=='A (−3, 2)' and page.locator('#metricTo').inner_text()=='A′ (5, 2)')
        page.locator('#ansX').fill('5');page.locator('#ansY').fill('2');page.locator('#check').click()
        assert_test(f'{width} challenge 2 check',page.locator('#chFeedback').inner_text().startswith('Correct:'))
        page.locator('#chNext').click()
        assert_test(f'{width} challenge 3 diagram matches question',page.locator('#metricTo').inner_text()=='A′ (3, −2)')
        page.locator('#ansX').fill('3');page.locator('#ansY').fill('-2');page.locator('#check').click()
        assert_test(f'{width} challenge 3 check',page.locator('#chFeedback').inner_text().startswith('Correct:'))
        # Repeated mode cycling may not add a second mascot.
        for i in range(8):
            page.get_by_role('tab',name='Explore').click()
            page.get_by_role('tab',name='Challenge').click()
        assert_test(f'{width} repeat modes no extra mascots',page.locator('#pip').count()==1)
        assert_test(f'{width} no console after stress',len(errs)==0,str(errs))
        ctx.close()
    ctx=browser.new_context(viewport={'width':380,'height':820},reduced_motion='reduce')
    page=ctx.new_page();page.set_content(html)
    page.locator('#play').click()
    assert_test('reduced motion instant completion',page.locator('#capTag').inner_text().endswith('6 OF 6'))
    ctx.close()
    browser.close()
report['passed']=sum(x['pass'] for x in report['tests'])
report['failed']=sum(not x['pass'] for x in report['tests'])
(ROOT/'QA-RESULTS.json').write_text(json.dumps(report,indent=2))
print('TOTAL',report['passed'],'PASSED',report['failed'],'FAILED')
raise SystemExit(1 if report['failed'] else 0)
