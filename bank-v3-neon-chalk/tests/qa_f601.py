"""Manual/local-browser functional and screenshot suite. Requires playwright + Chromium.
Run: python tests/qa_f601.py (from bank root; no GitHub interaction).
Produces actual screenshots only after successful render.
"""
from pathlib import Path
import json
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parent.parent
URL=(R/'F6/F6-01-ratio-table.html').as_uri()
OUT=R/'shots/F6';OUT.mkdir(parents=True,exist_ok=True)
results=[]
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True)
    for width in [380,1280]:
        page=browser.new_page(viewport={'width':width,'height':900},reduced_motion='reduce')
        errors=[];page.on('pageerror',lambda e: errors.append(str(e)))
        page.goto(URL,wait_until='load',timeout=30000)
        for mode in ['Watch','Guided','Explore','Challenge']:
            page.locator('#F6-01 .nova-tab').filter(has_text=mode).click();page.wait_for_timeout(200)
            present=page.locator('#F6-01 .f601-svg').count()==1
            overflow=page.evaluate('document.documentElement.scrollWidth > innerWidth')
            target=OUT/f'F6-01-{width}-{mode.lower()}.png'
            page.locator('#F6-01').screenshot(path=str(target),animations='disabled')
            rec={'width':width,'mode':mode,'present':present,'overflow':overflow,'errors':list(errors),'screenshot':str(target.relative_to(R))}
            results.append(rec)
            assert present and not overflow and not errors,rec
        # Interactive state check using the public component hooks.
        page.locator('#F6-01 .nova-tab').filter(has_text='Explore').click()
        page.evaluate("F601_CONFIG._explore.setPreset('Y7-060')")
        page.evaluate("F601_CONFIG._explore.setFactor(0,3)")
        page.evaluate("F601_CONFIG._explore.setFactor(1,3)")
        page.evaluate("F601_CONFIG._explore.setValue(0,6)")
        page.evaluate("F601_CONFIG._explore.setValue(1,18)")
        page.evaluate("F601_CONFIG._explore.check()")
        got=page.evaluate('F601_CONFIG._explore.get()')
        results.append({'width':width,'mode':'ExploreCheck','pass':('Correct' in got['status']),'state':got})
        assert 'Correct' in got['status'],got
        page.locator('#F6-01 .nova-tab').filter(has_text='Challenge').click()
        page.evaluate('F601_CONFIG._challenge.answer(10)')
        page.evaluate('F601_CONFIG._challenge.check()')
        z=page.evaluate('F601_CONFIG._challenge.get()')
        results.append({'width':width,'mode':'Challenge1','pass':z['solved']==1,'state':z})
        assert z['solved']==1,z
        page.close()
    browser.close()
(R/'tests/f601-browser-results.json').write_text(json.dumps(results,indent=2))
print('Browser QA complete:',len(results),'cases; screenshots:',len([x for x in results if 'screenshot' in x]))
