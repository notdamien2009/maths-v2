"""Native pointer, keyboard, challenge proof and cancellation tests for F7-03."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,traceback
root=Path(__file__).resolve().parents[1];html=(root/'F7/F7-03-collecting-like-terms.html').read_text(encoding='utf8');records=[]
def check(n,ok,detail=None):
    records.append({'name':n,'passed':bool(ok),'detail':detail})
    if not ok:print('FAIL',n,detail,flush=True)
def state(page):return page.locator('svg.f703-svg').evaluate('s=>({sorted:+s.dataset.sorted,total:+s.dataset.total,value:s.dataset.value})')
def svgPoint(page,x,y):return page.locator('svg.f703-svg').evaluate('''(s,v)=>{let p=s.createSVGPoint();p.x=v[0];p.y=v[1];let r=p.matrixTransform(s.getScreenCTM());return {x:r.x,y:r.y}}''',[x,y])
def drag(page,el,to,steps=18):
    r=el.bounding_box();assert r,f'not visible {el}';page.mouse.move(r['x']+r['width']/2,r['y']+r['height']/2)
    page.mouse.down();page.mouse.move(to['x'],to['y'],steps=steps);page.mouse.up();page.wait_for_timeout(190)
with sync_playwright() as p:
    b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
    for width in (380,1280):
        page=b.new_page(viewport={'width':width,'height':1000},reduced_motion='reduce');errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        try:
            page.set_content(html,wait_until='load',timeout=45000)
            page.locator('#F7-03 button:has-text("Explore")').first.click();page.wait_for_timeout(130)
            before=state(page);check(f'{width}-explore-initial',before=={'sorted':0,'total':7,'value':'3x + 4'},before)
            el=page.locator('[data-f703-id][data-home="scatter"][data-type="x"]').first
            el.focus();page.keyboard.press('1');page.wait_for_timeout(80)
            check(f'{width}-wrong-group-refused',state(page)==before,state(page))
            check(f'{width}-wrong-group-feedback','rod' in page.locator('.f703-status').inner_text().lower())
            el=page.locator('[data-f703-id][data-home="scatter"][data-type="x"]').first;el.focus();page.keyboard.press('2');page.wait_for_timeout(120)
            check(f'{width}-keyboard-group',state(page)['sorted']==1,state(page))
            page.get_by_role('button',name='Undo').click();check(f'{width}-undo',state(page)==before,state(page))
            page.locator('svg.f703-svg').scroll_into_view_if_needed()
            el=page.locator('[data-f703-id][data-home="scatter"][data-type="x"]').first
            dest=svgPoint(page,215 if width==380 else 500,788 if width==380 else 510)
            drag(page,el,dest)
            check(f'{width}-native-drag-sort',state(page)['sorted']==1,state(page))
            moved=page.locator('[data-f703-id][data-home="x"]').first;moved.focus();page.keyboard.press('r');page.wait_for_timeout(90)
            check(f'{width}-keyboard-return',state(page)==before,state(page))
            # Native invalid drop must spring back without inventing a new group.
            page.locator('svg.f703-svg').scroll_into_view_if_needed()
            el=page.locator('[data-f703-id][data-home="scatter"][data-type="x"]').first
            wrong=svgPoint(page,211 if width==380 else 184,560 if width==380 else 500)
            drag(page,el,wrong)
            check(f'{width}-native-invalid-springs-back',state(page)==before,state(page))
            # Direct Escape during moving cancels and keeps the data intact.
            el=page.locator('[data-f703-id][data-home="scatter"][data-type="x"]').first;r=el.bounding_box()
            page.mouse.move(r['x']+r['width']/2,r['y']+r['height']/2);page.mouse.down();page.mouse.move(r['x']+70,r['y']+45,steps=5);page.keyboard.press('Escape');page.mouse.up();page.wait_for_timeout(95)
            check(f'{width}-escape-return',state(page)==before,state(page))
            check(f'{width}-drag-clean',page.evaluate('NOVA.ui._drag===null'))
            # Four authentic challenge prompts; solve by classification and written collected answer.
            page.locator('#F7-03 button:has-text("Challenge")').first.click();page.wait_for_timeout(160)
            check(f'{width}-challenge-hidden','3x + 4' not in page.locator('.f703-proof').inner_text())
            page.locator('#f703-answer').fill('3x+4');page.get_by_role('button',name='Check expression').click();page.wait_for_timeout(100)
            check(f'{width}-must-sort-first','Sort all' in page.locator('.f703-status').inner_text())
            for i,answer in enumerate(['3x+4','2x+2','-2x+3','2x²+x+1']):
                n=page.locator('[data-f703-id][data-home="scatter"]').count()
                for j in range(n):
                    el=page.locator('[data-f703-id][data-home="scatter"]').first;kind=el.get_attribute('data-type');el.focus();page.keyboard.press({'x2':'1','x':'2','one':'3'}[kind]);page.wait_for_timeout(12)
                check(f'{width}-round-{i+1}-sorted',state(page)['sorted']==state(page)['total'],state(page))
                if i==0:
                    page.locator('#f703-answer').fill('7x');page.get_by_role('button',name='Check expression').click();page.wait_for_timeout(110)
                    check(f'{width}-unlike-terms-trap','cannot turn unit' in page.locator('.f703-status').inner_text().lower())
                if i==1:
                    page.locator('#f703-answer').fill('3x-x+2');page.get_by_role('button',name='Check expression').click();page.wait_for_timeout(100)
                    check(f'{width}-must-collect-trap','Combine' in page.locator('.f703-status').inner_text())
                if i==2:
                    page.locator('#f703-answer').fill('2x+3');page.get_by_role('button',name='Check expression').click();page.wait_for_timeout(100)
                    check(f'{width}-negative-sign-trap','minus' in page.locator('.f703-status').inner_text())
                if i==3:
                    page.locator('#f703-answer').fill('3x+1');page.get_by_role('button',name='Check expression').click();page.wait_for_timeout(100)
                    check(f'{width}-quadratic-trap','x²' in page.locator('.f703-status').inner_text())
                page.locator('#f703-answer').fill(answer);page.get_by_role('button',name='Check expression').click();page.wait_for_timeout(140)
                check(f'{width}-round-{i+1}-advance',page.locator('.f703-win').count()==1 if i==3 else page.locator('.f703-hint').first.inner_text().startswith(f'Challenge {i+2}'),page.locator('.f703-hint').all_inner_texts()[:1])
            check(f'{width}-no-pageerrors',not errors,errors)
        except Exception as e:traceback.print_exc();check(f'{width}-fatal',False,str(e))
        finally:page.close()
    b.close()
(root/'tests/f703-interaction-results.json').write_text(json.dumps(records,indent=2),encoding='utf8')
print('INTERACTION:',sum(t['passed'] for t in records),'/',len(records))
raise SystemExit(1 if any(not t['passed'] for t in records) else 0)
