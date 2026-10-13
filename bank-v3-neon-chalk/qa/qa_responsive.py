from playwright.sync_api import sync_playwright
from pathlib import Path
import json
P=Path(__file__).parent;HTML=(P/'F10-08-graph-intersections.html').read_text();records=[]
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in [320,380,768,1280]:
  pg=b.new_page(viewport={'width':w,'height':920});err=[];pg.on('pageerror',lambda e:err.append(str(e)));pg.set_content(HTML,wait_until='domcontentloaded');pg.wait_for_timeout(50)
  for mode in ['watch','guided','explore','challenge']:
   pg.locator(f'#F10-08 .nova-tab[data-m="{mode}"]').click();pg.wait_for_timeout(65)
   d=pg.evaluate('''()=>{const t=document.querySelector('#F10-08 .f108-theatre'),s=document.querySelector('#F10-08 .f108-svg');return {theatre:!!t,svg:!!s,overflow:document.documentElement.scrollWidth-innerWidth,gridWidth:s?.getBoundingClientRect().width||0,bg:t&&getComputedStyle(t).backgroundImage,visible:t&&t.getBoundingClientRect().width}}''')
   ok=d['theatre'] and d['svg'] and d['overflow']<=1 and d['gridWidth']>max(130,w*.50) and d['bg']!='none' and not err
   records.append({'width':w,'mode':mode,'passed':ok,'diagnostics':d,'errors':err});print(w,mode,ok,d['overflow'],round(d['gridWidth']),flush=True)
   if w in (320,380,1280):pg.locator('#F10-08 .f108-theatre').screenshot(path=str(P/f'{mode}-{w}.png'))
  pg.close()
 b.close()
(P/'QA-RESPONSIVE.json').write_text(json.dumps(records,indent=2));print('RESPONSIVE FINAL',sum(r['passed'] for r in records),'/',len(records),flush=True)
