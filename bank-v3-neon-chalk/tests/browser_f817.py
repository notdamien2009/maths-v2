from pathlib import Path
from playwright.sync_api import sync_playwright
import json
R=Path(__file__).resolve().parents[1];H=(R/'F8/F8-17-algebraic-proof-builder.html').read_text();checks=[]
def ck(n,v):
 checks.append({'test':n,'pass':bool(v)});assert v,n
def press(page,selector):
 page.locator(selector).first.evaluate("e=>e.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}))")
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [380]:
  pg=b.new_page(viewport={'width':width,'height':920},reduced_motion='reduce');errors=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.set_content(H,wait_until='domcontentloaded',timeout=60000)
  ck(f'{width}/mount',pg.locator('#F8-17').count()==1)
  for mode in ['watch','guided','explore','challenge']:
   press(pg,f'.nova-tab[data-m="{mode}"]');ck(f'{width}/{mode}/svg',pg.locator('.f817-svg').count()==1);ck(f'{width}/{mode}/slots',pg.locator('.f817-drop').count()==7);ck(f'{width}/{mode}/overflow',pg.evaluate('document.documentElement.scrollWidth')<=width);ck(f'{width}/{mode}/errors',not errors)
   pg.locator('.f817-svg').screenshot(path=str(R/'shots'/f'F8-17-{width}-{mode}-board.png'),timeout=15000)
  press(pg,'.nova-tab[data-m="explore"]')
  for k in ['ODD-SUM','ODD-SQUARE']:
   pg.locator('.f817-select').select_option(k);press(pg,'.f817-token[data-card="SX"]');press(pg,'.f817-drop[data-slot="0"]');ck(f'{width}/{k}/wrong-statement-rejected',pg.locator('.f817-msg').get_attribute('data-status')=='bad')
   for i in range(7):
    t='S'+str(i//2) if i%2==0 else 'J'+str(i//2);press(pg,f'.f817-token[data-card="{t}"]');press(pg,f'.f817-drop[data-slot="{i}"]')
   ck(f'{width}/{k}/valid-ordered',pg.evaluate('JSON.parse(document.querySelector(".f817-svg").dataset.slots).every((v,i)=>v===F817_TEST.expected(i))'))
   press(pg,'.f817-actions button:first-child');ck(f'{width}/{k}/complete',pg.locator('.f817-svg').get_attribute('data-complete')=='true')
  pg.locator('.f817-svg').screenshot(path=str(R/'shots'/f'F8-17-{width}-explore-complete.png'),timeout=15000)
  pg.close();print(width,'browser checks',len(checks),flush=True)
 b.close()
(R/'tests/F8-17-browser-results.json').write_text(json.dumps({'total':len(checks),'passed':sum(x['pass'] for x in checks),'checks':checks},indent=2));print('browser PASS',len(checks))
