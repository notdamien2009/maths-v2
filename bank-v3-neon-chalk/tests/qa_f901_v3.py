from pathlib import Path
from playwright.sync_api import sync_playwright
import json
p=Path('/mnt/data/f9_work');s=(p/'F9-01-matchstick-pattern-builder.html').read_text(); records=[]
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in (380,1280):
  page=browser.new_page(viewport={'width':width,'height':900},reduced_motion='reduce')
  errors=[]; page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(s,wait_until='domcontentloaded');page.wait_for_timeout(180)
  for mode in ('watch','guided','explore','challenge'):
   page.locator(f'#F9-01 .nova-tab[data-m="{mode}"]').click();page.wait_for_timeout(120)
   check=page.evaluate('''() => {
    const e=document.querySelector('#F9-01 .nova-stage'),cs=getComputedStyle(e),b=getComputedStyle(e,'::before'),bdy=document.body;
    const badge=document.querySelector('#F9-01 .nv-cap');
    return {topic:bdy.dataset.topic, background:cs.backgroundImage, border:cs.borderTopWidth,shadow:cs.boxShadow,motif:b.backgroundImage,motifOpacity:b.opacity,
      dock:e.querySelectorAll('.nv-dock').length, figures:e.querySelectorAll('svg.nv-dockfig').length, duplicates:e.querySelectorAll('.f901-nova-line img,.f901-side img').length,
      overflow:document.documentElement.scrollWidth>innerWidth, numFonts:getComputedStyle(e.querySelector('.f901-maths') || e.querySelector('svg text')).fontFamily,
      stageWidth:Math.round(e.getBoundingClientRect().width), viewport:innerWidth};
   }''')
   check['pass']=(check['topic']=='algebra' and 'linear-gradient' in check['background'] and check['border']!='0px' and check['shadow']!='none' and 'data:image/svg' in check['motif'] and float(check['motifOpacity'])>.01 and check['dock']==1 and check['figures']==1 and check['duplicates']==0 and not check['overflow'])
   records.append({'viewport':width,'mode':mode,**check})
   if mode=='watch':
    page.evaluate("NOVA.engines['F9-01'].timeline.pause(); NOVA.engines['F9-01'].timeline.go(5,'v3-QA')")
    page.wait_for_timeout(130)
   page.locator('#F9-01 .nova-stage').screenshot(path=str(p/'shots'/f'F9-01-v3-{width}-{mode}-STAGE.png'))
   if mode=='watch': page.screenshot(path=str(p/'shots'/f'F9-01-v3-{width}-PAGE.png'),full_page=False)
  records.append({'viewport':width,'mode':'browser errors','pass':not errors,'errors':errors})
  page.close()
 browser.close()
out={'passed':sum(x['pass'] for x in records),'total':len(records),'checks':records}
(p/'F9-01-v3-visual-qa.json').write_text(json.dumps(out,indent=2))
print('PASS',out['passed'],'/',out['total'])
for r in records: print(r['viewport'],r['mode'],r['pass'],r.get('topic'),(r.get('motif') or '')[:70],r.get('dock'))
if out['passed']!=out['total']:raise SystemExit('Visual regression failed')
