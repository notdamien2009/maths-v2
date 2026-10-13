from pathlib import Path
from playwright.sync_api import sync_playwright
import json,traceback
root=Path('/mnt/data/f7run06-work/bank-v3-neon-chalk');html=(root/'F7/F7-06-factorising-with-tiles.html').read_text();records=[]
def ck(n,v):
 records.append({'name':n,'pass':bool(v)});print(('PASS ' if v else 'FAIL ')+n,flush=True)
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in (380,1280):
  page=b.new_page(viewport={'width':w,'height':1024},reduced_motion='reduce');err=[];page.on('pageerror',lambda e:err.append(str(e)))
  try:
   page.set_content(html,wait_until='load',timeout=30000)
   page.locator('#F7-06 button:has-text("Challenge")').first.click()
   for i,formula in enumerate(['3(x+2)','4(x+2)','3(2x+3)','2(3x+4)']):
    n=page.locator('svg.f706-svg').get_attribute('data-total');
    # Dispatch a literal focus-keyboard event directly into the actual SVG source control.
    for j in range(int(n)):
     ok=page.evaluate('''()=>{const e=document.querySelector('#F7-06 [data-f706-slot="tray"]');if(!e)return false;e.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}));return true}''');
     if not ok:break
    ck(f'{w}-round-{i+1}-filled',page.locator('svg.f706-svg').get_attribute('data-placed')==n)
    inp=page.locator('#f706-answer');inp.fill(formula);page.get_by_role('button',name='Check factors').click()
    ck(f'{w}-round-{i+1}-advance',page.locator('.f706-win').count()==1 if i==3 else f'Challenge {i+2}' in page.locator('.f706-instruction').first.inner_text())
   ck(f'{w}-no-errors',not err)
   page.locator('#F7-06 button:has-text("Watch")').first.click()
   for action in ('Watch','Guided'):
    if action=='Guided':page.locator('#F7-06 button:has-text("Guided")').first.click()
    ck(f'{w}-{action}-svg',page.locator('svg.f706-svg').count()==1)
   # All mathematical rectangle invariants: n*x rods + m unit squares, gcd equal rows.
   invariants=page.evaluate('''()=>Object.values(F706_CONFIG.presets).every(p=>{let x=F706_MATH.math(p),t=F706_MATH.plan(p);return x.gcd===p.k&&t.tiles.length===p.k*(p.a+p.b)&&t.slots.length===t.tiles.length&&x.x===p.k*p.a&&x.units===p.k*p.b})''')
   ck(f'{w}-rectangle-and-gcd-invariants',invariants)
  except Exception as e:traceback.print_exc();ck(f'{w}-fatal',False)
  finally:page.close()
 b.close()
(root/'tests/f706-final-results.json').write_text(json.dumps(records,indent=2),'utf8')
print('RESULT',sum(t['pass'] for t in records),'/',len(records),flush=True)
raise SystemExit(1 if any(not t['pass'] for t in records) else 0)
