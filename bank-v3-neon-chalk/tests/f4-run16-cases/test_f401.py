#!/usr/bin/env python3
"""NOVA F4-01 Run 01 QA: browser render, maths, drag, keyboard, regression.
Run with: python tests/test_f401.py --html F4/F4-01-part-whole-bar.html
Dependencies: pip install playwright ; python -m playwright install chromium
No network and no writes to GitHub. Screenshots are intentionally not generated here; see reference captures.
"""
from pathlib import Path
import argparse, json, time
from playwright.sync_api import sync_playwright

HERE=Path(__file__).resolve().parent
ROOT=HERE.parent
parser=argparse.ArgumentParser()
parser.add_argument('--html',type=Path,default=ROOT/'F4/F4-01-part-whole-bar.html')
parser.add_argument('--shots',type=Path,default=ROOT/'shots/F4-01')
parser.add_argument('--record',type=Path,default=HERE/'BROWSER-RESULTS.json')
args=parser.parse_args()
html=args.html.read_text(encoding='utf-8');args.shots.mkdir(parents=True,exist_ok=True)
results=[]
def check(name,cond,details=None):
    outcome={'name':name,'passed':bool(cond)}
    if details is not None:outcome['details']=details
    results.append(outcome)
    if not cond:print('FAIL',name,details)

def go(page,mode):page.get_by_role('tab',name=mode.capitalize()).click()
def shift(page):page.locator('#F4-01').scroll_into_view_if_needed()
def svgpoint(page,x,y):
    return page.evaluate("""([x,y])=>{const s=document.querySelector('#F4-01 svg.f401-svg');const p=s.createSVGPoint();p.x=x;p.y=y;const q=p.matrixTransform(s.getScreenCTM());return{x:q.x,y:q.y};}""",[x,y])
def drag(page,value,svg_xy):
    src=page.locator(f'#F4-01 .f401-piece[data-value="{value}"]');src.scroll_into_view_if_needed()
    b=src.bounding_box();target=svgpoint(page,*svg_xy)
    page.mouse.move(b['x']+b['width']/2,b['y']+b['height']/2)
    page.mouse.down()
    page.mouse.move(target['x'],target['y'],steps=20)
    page.mouse.up()
    page.wait_for_timeout(130)

with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
    for width in (380,1280):
        page=browser.new_page(viewport={'width':width,'height':900},reduced_motion='reduce',device_scale_factor=1)
        errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
        page.set_content(html,wait_until='load',timeout=30000)
        for mode in ('watch','guided','explore','challenge'):
            go(page,mode) if mode!='watch' else None
            page.wait_for_timeout(160)
            check(f'{width} {mode} single SVG',page.locator('#F4-01 svg.f401-svg').count()==1)
            check(f'{width} {mode} one NOVA helper dock',page.locator('#F4-01 .nv-dock').count()==1)
            check(f'{width} {mode} no viewport overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
            check(f'{width} {mode} no developer maths placeholder',page.locator('#F4-01 .nv-frac-tbd').count()==0)
            check(f'{width} {mode} main maths labelled',page.locator('#F4-01 .f401-sidev').count()==3)
            try:page.locator('#F4-01').screenshot(path=str(args.shots/f'F4-01-{width}-{mode}.png'),timeout=10000,animations='disabled')
            except Exception as e:check(f'{width} {mode} screenshot',False,str(e)[:120])
            else:check(f'{width} {mode} screenshot',True)
        check(f'{width} no page JavaScript errors',not errors,errors)
        # All maths model checks via exported mathematical functions.
        maths=page.evaluate("""()=>{let m=window.F401_MATH;let a=[{whole:18,known:[7]},{whole:30,known:[8,5]},{whole:120,known:[48,27]}];return a.map(s=>({answer:m.missing(s),valid:m.valid(s),check:m.checkPart(s,m.missing(s)),wrong:m.checkPart(s,m.missing(s)+1)}));}""")
        check(f'{width} three challenge arithmetic proofs',all(x['valid'] and x['check'] and not x['wrong'] for x in maths) and [x['answer'] for x in maths]==[11,17,45],maths)
        # Drag correct candidate into proportional unknown, then Check/advance.
        drag(page,11,(680,405));check(f'{width} drag/drop placed 11','You placed 11' in page.locator('#F4-01 .f401-status').inner_text())
        page.get_by_role('button',name='Check',exact=True).click()
        check(f'{width} first proof correct','Correct: 7 + 11 = 18' in page.locator('#F4-01 .f401-status').inner_text())
        check(f'{width} can advance',page.get_by_role('button',name='Next problem →').count()==1)
        page.get_by_role('button',name='Next problem →').click()
        box=page.locator('#F4-01 input[aria-label="Missing part numeric answer"]')
        box.fill('12');page.get_by_role('button',name='Check',exact=True).click()
        check(f'{width} wrong result rejected','Too small' in page.locator('#F4-01 .f401-status').inner_text())
        box=page.locator('#F4-01 input[aria-label="Missing part numeric answer"]');box.fill('17')
        page.get_by_role('button',name='Check',exact=True).click()
        check(f'{width} second proof correct','8 + 5 + 17 = 30' in page.locator('#F4-01 .f401-status').inner_text())
        page.get_by_role('button',name='Next problem →').click()
        page.locator('#F4-01 input[aria-label="Missing part numeric answer"]').fill('45')
        page.get_by_role('button',name='Check',exact=True).click()
        check(f'{width} third proof correct','48 + 27 + 45 = 120' in page.locator('#F4-01 .f401-status').inner_text())
        page.get_by_role('button',name='Next problem →').click()
        check(f'{width} final completion',page.locator('#F4-01 .f401-finish').count()==1)
        go(page,'explore')
        page.get_by_role('button',name='Known +1').click()
        check(f'{width} known resize keyboard button',page.locator('#F4-01 svg.f401-svg').get_attribute('data-known')=='8')
        divider=page.locator('#F4-01 .f401-divider');divider.focus();divider.press('ArrowRight')
        check(f'{width} divider keyboard right',page.locator('#F4-01 svg.f401-svg').get_attribute('data-known')=='9')
        page.get_by_role('button',name='Clear',exact=True).click()
        check(f'{width} clear removes placed part','empty again' in page.locator('#F4-01 .f401-status').inner_text())
        # Check all uncommitted drag state recovers on Escape.
        src=page.locator('#F4-01 .f401-piece').first;src.scroll_into_view_if_needed()
        start=src.bounding_box();sx=start['x']+start['width']/2;sy=start['y']+start['height']/2
        page.mouse.move(sx,sy);page.mouse.down();page.mouse.move(sx-75,sy-90,steps=6)
        page.keyboard.press('Escape');page.mouse.up();page.wait_for_timeout(220)
        check(f'{width} escape cancels drag',page.evaluate('window.NOVA.ui._drag===null'))
        check(f'{width} no stranded transform after cancel',page.locator('#F4-01 .f401-piece[transform]').count()==0)
        check(f'{width} final no errors',not errors,errors)
        page.close()
    browser.close()
args.record.write_text(json.dumps({'generated_at':'2026-10-11','tests':len(results),'pass':sum(x['passed'] for x in results),'fail':sum(not x['passed'] for x in results),'checks':results},indent=2))
print('QA RESULTS',len(results),'PASS',sum(x['passed'] for x in results),'FAIL',sum(not x['passed'] for x in results))
if any(not x['passed'] for x in results):raise SystemExit(1)
