from pathlib import Path
from playwright.sync_api import sync_playwright
import json
R=Path(__file__).resolve().parents[1];H=(R/'F8/F8-17-algebraic-proof-builder.html').read_text();a=[]
def ck(n,v):
 a.append({'test':n,'pass':bool(v)});assert v,n
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 pg=b.new_page(viewport={'width':1280,'height':2000},reduced_motion='reduce');errors=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.set_content(H,wait_until='domcontentloaded',timeout=60000)
 ck('desktop/mount',pg.locator('#F8-17').count()==1)
 for mode in ['Watch','Guided','Explore','Challenge']:
  pg.locator('button').filter(has_text=mode).first.click(no_wait_after=True,timeout=10000)
  ck(f'desktop/{mode}/svg',pg.locator('.f817-svg').count()==1);ck(f'desktop/{mode}/slots',pg.locator('.f817-drop').count()==7);ck(f'desktop/{mode}/no-overflow',pg.evaluate('document.documentElement.scrollWidth')<=1280)
  pg.locator('.f817-svg').screenshot(path=str(R/'shots'/f'F8-17-1280-{mode.lower()}-board.png'),timeout=25000)
 pg.locator('button').filter(has_text='Explore').first.click(no_wait_after=True,timeout=10000)
 for j in range(7):
  token='S'+str(j//2) if j%2==0 else 'J'+str(j//2)
  pg.locator(f'.f817-token[data-card="{token}"]').evaluate('e=>e.click()')
  pg.locator(f'.f817-drop[data-slot="{j}"]').evaluate("e=>e.dispatchEvent(new MouseEvent('click',{bubbles:true}))")
 ck('desktop/arranged',pg.evaluate('JSON.parse(document.querySelector(".f817-svg").dataset.slots).every((v,i)=>v===F817_TEST.expected(i))'))
 pg.locator('.f817-actions button').first.click(no_wait_after=True,timeout=10000)
 ck('desktop/solved',pg.locator('.f817-svg').get_attribute('data-complete')=='true');ck('desktop/no-errors',not errors)
 pg.locator('.f817-svg').screenshot(path=str(R/'shots'/'F8-17-1280-explore-complete.png'),timeout=25000)
 b.close()
(R/'tests/F8-17-desktop-results.json').write_text(json.dumps({'total':len(a),'passed':len(a),'checks':a},indent=2));print('desktop',len(a),'passed')
