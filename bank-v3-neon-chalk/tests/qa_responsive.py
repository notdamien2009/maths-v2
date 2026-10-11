from playwright.sync_api import sync_playwright
from pathlib import Path
import json
ROOT=Path('/mnt/data/f10run03');page=ROOT/'F10-03-midpoint-and-distance.html';page=page if page.exists() else ROOT.parent/'F10/F10-03-midpoint-and-distance.html';source=page.read_text()
rows=[]
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for w in (320,768):
  page=b.new_page(viewport={'width':w,'height':800},reduced_motion='reduce')
  errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
  page.set_content(source,wait_until='domcontentloaded');page.wait_for_timeout(200)
  for mode in ('watch','guided','explore','challenge'):
   page.locator(f'#F10-03 .nova-tab[data-m="{mode}"]').click();page.wait_for_timeout(100)
   status=page.evaluate('''()=>{const e=document.querySelector('#F10-03 .f103-theatre'),s=document.querySelector('#F10-03 .f103-svg'),r=s.getBoundingClientRect();return {overflow:document.documentElement.scrollWidth>innerWidth,background:getComputedStyle(e).backgroundImage,width:Math.round(r.width),img:[...document.querySelectorAll('#F10-03 img')].every(x=>x.hasAttribute('alt')&&x.alt.trim()),svg:!!s}}''')
   passed=status['svg'] and not status['overflow'] and status['background']!='none' and status['width']>230 and status['img'] and not errs
   rows.append({'name':f'{w}-{mode}-responsive','passed':bool(passed),'details':status})
   if w==320:page.screenshot(path=str(ROOT/f'{mode}-320.png'),full_page=True)
  page.close()
 b.close()
(ROOT/'QA-RESPONSIVE.json').write_text(json.dumps(rows,indent=2))
print('responsive',sum(x['passed'] for x in rows),'/',len(rows))
for x in rows:print(('PASS' if x['passed'] else 'FAIL'),x['name'],x['details'])
