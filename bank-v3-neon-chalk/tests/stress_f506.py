import json,sys
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
HTML=(ROOT/'F5/F5-06-fraction-simplifier.html').read_text()
results=[]
def ck(w,m,label,v):
 results.append({'width':w,'motion':m,'check':label,'ok':bool(v)});print(('PASS' if v else 'FAIL'),w,m,label,flush=True)
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for w in [320,768]:
  for mode in ['reduce','no-preference']:
   p=browser.new_page(viewport={'width':w,'height':960},reduced_motion=mode);errs=[];p.on('pageerror',lambda e:errs.append(str(e)))
   p.set_content(HTML,wait_until='domcontentloaded');p.wait_for_timeout(80)
   p.locator('#F5-06 .nova-tab[data-m="explore"]').click();p.wait_for_timeout(110)
   ck(w,mode,'Explore scene exists',p.locator('#F5-06 .sf-svg').count()==1)
   for n,d,g in [(6,8,2),(12,18,6),(5,7,1)]:
    p.evaluate('(v)=>NOVA_F5_06_CONFIG._explore.set(...v)',[n,d,g]);p.wait_for_timeout(60)
    st=p.evaluate('NOVA_F5_06_CONFIG._explore.get()');ck(w,mode,'Math '+str((n,d,g)),st['n']==n and st['d']==d and st['g']==g)
   p.evaluate('NOVA_F5_06_CONFIG._explore.set(6,8,2)');p.wait_for_timeout(60)
   el=p.locator('#F5-06 [data-factor-handle]');el.focus();p.keyboard.press('Home');p.wait_for_timeout(45)
   ck(w,mode,'Home factor 1',p.evaluate('NOVA_F5_06_CONFIG._explore.get().g')==1)
   el=p.locator('#F5-06 [data-factor-handle]');el.focus();p.keyboard.press('ArrowRight');p.wait_for_timeout(50)
   ck(w,mode,'Arrow factor 2',p.evaluate('NOVA_F5_06_CONFIG._explore.get().g')==2)
   p.locator('#F5-06 .nova-stage').screenshot(path=str(ROOT/f'shots/F5/F5-06-{w}-{mode}-explore.png'))
   ck(w,mode,'No overflowing page',p.evaluate('document.documentElement.scrollWidth<=innerWidth'))
   ck(w,mode,'No JS errors',not errs)
   p.close()
 browser.close()
(ROOT/'tests/stress-f506-results.json').write_text(json.dumps(results,indent=2))
print('TOTAL',sum(v['ok'] for v in results),'/',len(results))
sys.exit(not all(v['ok'] for v in results))
