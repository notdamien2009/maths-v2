from pathlib import Path
from playwright.sync_api import sync_playwright
import json
R=Path(__file__).resolve().parents[1];h=(R/'F8/F8-04-two-way-function-machine.html').read_text(encoding='utf8');results=[]
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for w in (430,760,1920):
  p=b.new_page(viewport={'width':w,'height':1000},reduced_motion='reduce');errors=[];p.on('pageerror',lambda e:errors.append(str(e)));p.set_content(h)
  for mode in ('guided','explore','challenge'):
   p.locator(f'#F8-03 .nova-tab[data-m="{mode}"]').click()
   e=p.evaluate('''() => {const s=document.querySelector('.f804-svg'),r=s.getBoundingClientRect();return {overflow:document.documentElement.scrollWidth>innerWidth+1,rectLeft:r.left,rectRight:r.right,rectWidth:r.width,screen:innerWidth,svg:!!s}}''')
   ok=e['svg'] and not e['overflow'] and e['rectLeft']>=-2 and e['rectRight']<=w+2 and not errors
   results.append({'test':f'{w}/{mode}/canvas-contained', 'passed':ok,'detail':e})
  p.close()
 b.close()
report={'total':len(results),'passed':sum(r['passed'] for r in results),'failed':[r for r in results if not r['passed']],'checks':results};(R/'tests/F8-04-width-results.json').write_text(json.dumps(report,indent=2));print('WIDTH',report['passed'],'/',report['total'])
