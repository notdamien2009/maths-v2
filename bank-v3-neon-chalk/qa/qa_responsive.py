from playwright.sync_api import sync_playwright
from pathlib import Path
import json,os
P=Path(__file__).parent;html=(P/'F10-05-y-mx-plus-c-explorer.html').read_text();results=[]
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in [int(v) for v in os.getenv("WIDTHS","320,380,768,1280").split(",")]:
  page=b.new_page(viewport={'width':w,'height':950});errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.set_content(html,wait_until='domcontentloaded');page.wait_for_timeout(130)
  for mode in ['watch','guided','explore','challenge']:
   page.locator(f'#F10-05 .nova-tab[data-m="{mode}"]').click();page.wait_for_timeout(110)
   frame=page.locator('#F10-05 .f105-theatre');sv=page.locator('#F10-05 .f105-svg')
   v=page.evaluate('''()=>{const a=document.querySelector('#F10-05 .f105-theatre'),p=document.querySelector('#F10-05 .f105-svg'),info=document.querySelector('#F10-05 .f105-info');const f=a.getBoundingClientRect(),g=p.getBoundingClientRect(),h=document.querySelector('#F10-05 .f105-plane').getBoundingClientRect();return {surface:!!a&&getComputedStyle(a).backgroundImage!=='none',graphHeight:Math.round(g.height),graphPlaneHeight:Math.round(h.height),frameHeight:Math.round(f.height),widthOK:document.documentElement.scrollWidth<=innerWidth+1,axes:!!p.querySelector('.f105-grid'),informative:info&&info.children.length>=2,helper:!!document.querySelector('#F10-05 .nv-dockfig'),dotSize:getComputedStyle(a).borderTopWidth}}''')
   ok=v['surface'] and v['axes'] and v['informative'] and v['widthOK'] and v['helper'] and v['graphHeight']>=int(v['graphPlaneHeight']*.60) and not errors
   results.append({'viewport':w,'mode':mode,'passed':bool(ok),'metrics':v,'browser_errors':errors[:]})
   print(('PASS' if ok else 'FAIL'),w,mode,v,flush=True)
   if mode in ['explore','challenge'] or w in [380,1280]:
    frame.screenshot(path=str(P/f'{mode}-stage-{w}.png'),timeout=15000)
  page.close()
 b.close()
(P/'QA-RESPONSIVE.json').write_text(json.dumps({'total':len(results),'passed':sum(r['passed'] for r in results),'results':results},indent=2))
print('FINAL',sum(r['passed'] for r in results),'/',len(results))
