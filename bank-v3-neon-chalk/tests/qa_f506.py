import json,sys
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
HTML=(ROOT/'F5/F5-06-fraction-simplifier.html').read_text()
SHOTS=ROOT/'shots/F5';SHOTS.mkdir(parents=True,exist_ok=True)
checks=[]
def ck(w,desc,v,extra=''):
    ok=bool(v);checks.append({'width':w,'name':desc,'ok':ok,'detail':str(extra)[:180]});print(('PASS' if ok else 'FAIL'),w,desc,str(extra)[:80],flush=True)
def get(pg):return pg.evaluate('NOVA_F5_06_CONFIG._explore.get()')
def setv(pg,n,d,g):pg.evaluate('(x)=>NOVA_F5_06_CONFIG._explore.set(...x)',[n,d,g]);pg.wait_for_timeout(40)
def tab(pg,m):pg.locator(f'#F5-06 .nova-tab[data-m="{m}"]').click();pg.wait_for_timeout(65)
def target(pg,x,y):return pg.evaluate('''v=>{const s=document.querySelector('#F5-06 .sf-svg'),p=s.createSVGPoint();p.x=v.x;p.y=v.y;const a=p.matrixTransform(s.getScreenCTM());return {x:a.x,y:a.y}}''',{'x':x,'y':y})
def dragFactor(pg,f):
    o=get(pg);ds=[i for i in range(1,o['d']+1) if o['d']%i==0];mobile=pg.viewport_size['width']<=670;x=65 if mobile else 776;y=934 if mobile else 483;ww=290 if mobile else 277
    center=x+21+ds.index(f)*(ww-42)/(len(ds)-1)
    el=pg.locator('#F5-06 [data-factor-handle] .nv-hit');el.scroll_into_view_if_needed();bb=el.bounding_box();end=target(pg,center,y+28)
    pg.mouse.move(bb['x']+bb['width']/2,bb['y']+bb['height']/2);pg.mouse.down();pg.mouse.move(end['x'],end['y'],steps=12);pg.mouse.up();pg.wait_for_timeout(95)
def dragProbe(pg,index):
    o=get(pg);mobile=pg.viewport_size['width']<=670;x=46 if mobile else 128;y=234 if mobile else 187;ww=328 if mobile else 585
    part=ww/o['d'];center=x+(index+.5)*o['g']*part
    el=pg.locator('#F5-06 [data-group-probe] .nv-hit');el.scroll_into_view_if_needed();bb=el.bounding_box();p=target(pg,center,y+30)
    pg.mouse.move(bb['x']+bb['width']/2,bb['y']+bb['height']/2);pg.mouse.down();pg.mouse.move(p['x'],p['y'],steps=13);pg.mouse.up();pg.wait_for_timeout(100)
with sync_playwright() as pw:
    browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    for w in [380,1280]:
        page=browser.new_page(viewport={'width':w,'height':920},reduced_motion='reduce');errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        page.set_content(HTML,wait_until='domcontentloaded',timeout=45000)
        ck(w,'engine mounted',page.locator('#F5-06').count()==1)
        for mode in ['watch','guided','explore','challenge']:
            tab(page,mode)
            ck(w,mode+' diagram',page.locator('#F5-06 .sf-svg').count()==1)
            page.locator('#F5-06 .nova-stage').screenshot(path=str(SHOTS/f'F5-06-{w}-{mode}.png'))
        tab(page,'guided')
        for i in range(6):
            page.evaluate('(i)=>NOVA.engines["F5-06"].timeline.go(i,"qa")',i);page.wait_for_timeout(35)
            ck(w,'guided beat '+str(i+1),page.locator('#F5-06 .sf-svg').count()==1)
        tab(page,'explore');setv(page,6,8,2)
        ck(w,'six eighths group-by-two maths',get(page)['n']==6 and get(page)['d']==8 and get(page)['g']==2)
        ck(w,'8 original and 4 regrouped cells',page.locator('#F5-06 .sf-svg [data-part]').count()==12,page.locator('#F5-06 .sf-svg [data-part]').count())
        page.locator('#F5-06 [data-factor-handle]').focus();page.keyboard.press('ArrowRight');page.wait_for_timeout(65)
        ck(w,'reject non-common factor 4',get(page)['g']==2,get(page))
        ck(w,'factor rejection explains why','Not a common factor' in page.locator('#F5-06 .sf-msg').all_inner_texts()[-2])
        ck(w,'invalid keyboard retains focus',page.evaluate('document.activeElement?.getAttribute("data-factor-handle")')=='yes')
        page.keyboard.press('Home');page.wait_for_timeout(50)
        ck(w,'Home groups by 1',get(page)['g']==1,get(page))
        dragFactor(page,2)
        ck(w,'real factor drag snaps to 2',get(page)['g']==2,get(page))
        ck(w,'no stranded factor',page.evaluate('!NOVA.ui._drag && !document.querySelector(".nv-drag-lift")'))
        dragProbe(page,2)
        ck(w,'group probe drag moves',get(page)['position']==2,get(page))
        page.locator('#F5-06 [data-group-probe]').focus();page.keyboard.press('ArrowLeft');page.wait_for_timeout(50)
        ck(w,'group probe arrow moves left',get(page)['position']==1,get(page))
        ck(w,'group probe focus retained',page.evaluate('document.activeElement?.getAttribute("data-group-probe")')=='yes')
        page.keyboard.press('End');page.wait_for_timeout(45)
        ck(w,'group probe End to last group',get(page)['position']==3,get(page))
        # Escape must cancel real active drag.
        handle=page.locator('#F5-06 [data-factor-handle] .nv-hit');handle.scroll_into_view_if_needed();bb=handle.bounding_box()
        page.mouse.move(bb['x']+bb['width']/2,bb['y']+bb['height']/2);page.mouse.down();page.mouse.move(bb['x']+63,bb['y']-40,steps=7);page.keyboard.press('Escape');page.mouse.up();page.wait_for_timeout(100)
        ck(w,'Escape safely cancels factor drag',get(page)['g']==2 and page.evaluate('!NOVA.ui._drag && !document.querySelector(".nv-drag-lift")'))
        for n,d,g in [(6,12,6),(12,18,6),(18,24,6),(9,12,3),(5,7,1),(0,10,10),(8,8,8)]:
            setv(page,n,d,g);st=get(page);cells=page.locator('#F5-06 .sf-svg [data-part]').count()
            ck(w,f'maths case {n}/{d} ÷{g}', st['g']==g and cells==d+d//g and abs(n/d-(n//g)/(d//g))<1e-12,(st,cells))
        tab(page,'challenge')
        ck(w,'challenge answer hidden','?' in page.locator('#F5-06 .nova-stage').inner_text())
        page.get_by_role('button',name='Check answer').click();page.wait_for_timeout(40)
        ck(w,'wrong answer rejected',page.locator('#F5-06 .nova-fb.bad').count()>0)
        for i,(g,n,d) in enumerate([(2,3,4),(6,2,3),(3,3,4)]):
            page.evaluate('(x)=>NOVA_F5_06_CONFIG._challenge.set(...x)',[g,n,d])
            page.get_by_role('button',name='Check answer').click();page.wait_for_timeout(770 if i<2 else 60)
            ck(w,'challenge '+str(i+1),page.evaluate('NOVA_F5_06_CONFIG._challenge.task()')==i+1 if i<2 else page.locator('#F5-06 .nova-fb.ok').count()>0)
        ck(w,'no horizontal overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
        ck(w,'no JS errors',len(errors)==0,errors)
        page.close()
    browser.close()
(ROOT/'tests/f506-results.json').write_text(json.dumps(checks,indent=2))
print('TOTAL',sum(t['ok'] for t in checks),'/',len(checks))
sys.exit(0 if all(t['ok'] for t in checks) else 1)
