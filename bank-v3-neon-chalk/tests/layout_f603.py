"""Regression QA for F6-03 label / apparatus separation, mobile + desktop, across all presets."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,os
ROOT=Path(__file__).resolve().parents[1]
HTML=(ROOT/'F6/F6-03-sharing-in-a-ratio.html').read_text(encoding='utf-8')
results={'component':'F6-03','revision':'Layout correction v1.1','checks':0,'failures':[],'screenshots':[],'measurements':[]}
def check(x,s):
 results['checks']+=1
 if not x: results['failures'].append(s)
with sync_playwright() as p:
 exe=os.environ.get('NOVA_CHROMIUM','/usr/bin/chromium')
 kw={'headless':True,'args':['--no-sandbox','--disable-dev-shm-usage']}
 if Path(exe).exists():kw['executable_path']=exe
 b=p.chromium.launch(**kw)
 for width in (380,1280):
  page=b.new_page(viewport={'width':width,'height':950},reduced_motion='reduce')
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(HTML,wait_until='domcontentloaded',timeout=20000)
  page.locator('#F6-03 button[role=tab]').filter(has_text='Explore').click()
  for preset in ('Y7-059','Y7-059-sweets','Y7-059-time','Y7-059-points'):
   page.evaluate('F603_CONFIG._explore.setPreset(%s)'%json.dumps(preset))
   data=page.evaluate('''() => {const svg=document.querySelector('.f603-svg');const units=[...svg.querySelectorAll('.f603-unit')];
    const texts=[...svg.querySelectorAll('text')];const boxes=units.map(u=>u.getBBox());
    const basetop=Math.min(...boxes.map(b=>b.y));const basebottom=Math.max(...boxes.map(b=>b.y+b.height));
    const partTexts=texts.filter(t=>/^\\d+ parts?$/.test(t.textContent.trim()));
    const sizes=partTexts.map(t=>({s:t.textContent,y:t.getBBox().y,h:t.getBBox().height,bot:t.getBBox().y+t.getBBox().height}));
    const barText=texts.filter(t=> /^£?\\d+$/.test(t.textContent.trim()) && t.getBBox().y>basetop && t.getBBox().y<basebottom);
    const cellWidths=barText.map(t=>({str:t.textContent,width:t.getBBox().width,bar:boxes[0].width,ok:t.getBBox().width<boxes[0].width-2}));
    const returnText=texts.find(t=>t.textContent.includes('DRAG VALUES'));
    const footer=returnText&&returnText.getBBox();
    return {stage:[svg.viewBox.baseVal.width,svg.viewBox.baseVal.height],basetop,basebottom,partTexts:sizes,cellWidths,footer:footer&&{y:footer.y,h:footer.height},count:units.length,errors:[],svgWidth:svg.getBoundingClientRect().width,scroll:document.documentElement.scrollWidth,window:innerWidth};}''')
   results['measurements'].append({'viewport':width,'preset':preset,**data})
   check(data['scroll']<=width+1,f'{width} {preset}: horizontal page overflow {data["scroll"]}')
   check(all(x['bot']+15<data['basetop'] for x in data['partTexts']),f'{width} {preset}: part text encroaches into ratio bar {data["partTexts"]} {data["basetop"]}')
   check(all(x['ok'] for x in data['cellWidths']),f'{width} {preset}: value text wider than individual cell {data["cellWidths"]}')
   check(not errors,f'{width} {preset}: runtime errors {errors}')
   if preset=='Y7-059-points':
    path=ROOT/f'shots/F6-03/F6-03-{width}-high-ratio-layout.png'
    page.locator('#F6-03').screenshot(path=str(path),animations='disabled')
    results['screenshots'].append(str(path.relative_to(ROOT)))
  page.close()
 b.close()
results['passed']=results['checks']-len(results['failures'])
results['status']='pass' if not results['failures'] else 'fail'
(ROOT/'tests/f603-layout-results.json').write_text(json.dumps(results,indent=2),encoding='utf-8')
print(json.dumps({k:results[k] for k in ('status','passed','checks','failures')},indent=2))
if results['failures']:raise SystemExit(1)
