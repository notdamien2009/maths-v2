"""Browser-mode and mathematics checks for NOVA F7-03 review build."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json, traceback
root=Path(__file__).resolve().parents[1];html=(root/'F7/F7-03-collecting-like-terms.html').read_text(encoding='utf8')
out=root/'shots/F7-03';out.mkdir(exist_ok=True,parents=True);records=[]
def test(label,ok,details=None):
    records.append({'name':label,'passed':bool(ok),'detail':details})
    if not ok:print('FAIL',label,details,flush=True)
with sync_playwright() as p:
    b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
    for width in (320,380,768,1280):
        page=b.new_page(viewport={'width':width,'height':980},reduced_motion='reduce');errors=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        try:
            page.set_content(html,wait_until='load',timeout=45000)
            test(f'{width}-component',page.locator('#F7-03').count()==1)
            test(f'{width}-math-parser',page.evaluate('''() => {const m=F703_MATH;return m.algebra({x2:2,x:-1,one:1})==='2x² − x + 1'&&m.algebra({x2:0,x:0,one:0})==='0'&&m.parseAnswer('-2x+3').values.x===-2&&m.parseAnswer('3+2x').values.one===3&&!!m.parseAnswer('x+x+1').error&&!!m.parseAnswer('x^2+x^2').error&&m.diagnose('2x+3',{x2:0,x:2,one:3})==='';}'''))
            test(f'{width}-curriculum-maths',page.evaluate('''()=>{const c=F703_CONFIG,m=F703_MATH;let checks=[['Y7-029',{x2:0,x:3,one:4}],['Y7-SIGNED',{x2:0,x:2,one:2}],['Y8-REVISIT',{x2:0,x:1,one:4}],['GCSE-X2',{x2:2,x:1,one:2}],['GCSE-SIGNS',{x2:-1,x:2,one:2}]];return checks.every(([key,goal])=>m.compare(m.coeffs(m.createTiles(c.presets[key].tokens)),goal))&&c.challenge.every(q=>m.compare(m.coeffs(m.createTiles(q.tokens)),q.answer))}'''))
            for mode in ('watch','guided','explore','challenge'):
                page.locator(f'#F7-03 button:has-text("{mode.title()}")').first.click();page.wait_for_timeout(140)
                test(f'{width}-{mode}-stage',page.locator('#F7-03 svg.f703-svg').count()==1)
                test(f'{width}-{mode}-no-overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth+2'),page.evaluate('({width:innerWidth,scrollWidth:document.documentElement.scrollWidth})'))
                test(f'{width}-{mode}-no-js-errors',not errors,list(errors))
                test(f'{width}-{mode}-all-tiles',page.locator('#F7-03 [data-f703-id]').count()==7)
                if width in (380,1280):
                    page.locator('#F7-03 .nova-stage').screenshot(path=str(out/f'F7-03-{width}-{mode}-STAGE.png'),animations='disabled')
                    page.screenshot(path=str(out/f'F7-03-{width}-{mode}.png'),full_page=False)
        except Exception as e:
            traceback.print_exc();test(f'{width}-fatal',False,str(e))
        finally:page.close()
    b.close()
(root/'tests/f703-browser-results.json').write_text(json.dumps(records,indent=2),encoding='utf8')
print('BROWSER QA:',sum(x['passed'] for x in records),'/',len(records))
raise SystemExit(1 if any(not x['passed'] for x in records) else 0)
