import json
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];F=(R/'F3/F3-10-index-law-animator.html').read_text();out=[]
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in (380,1280):
  page=b.new_page(viewport={'width':width,'height':1100},reduced_motion='reduce');errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(F);page.wait_for_timeout(170)
  # maths independent arithmetic assertions
  maths=page.evaluate('''() => {let o=[],f=F310_MATH;for(const base of [2,3,4,5])for(let m=2;m<=5;m++)for(let n=1;n<=4;n++){
    for(const kind of ['multiply','divide','power']){if((kind==='multiply'&&m+n>8)||(kind==='divide'&&n>=m)||(kind==='power'&&m*n>8))continue;
    let s={kind,base,m,n},a=f.maths(s);let e=kind==='multiply'?m+n:kind==='divide'?m-n:m*n;o.push({kind,base,m,n,ok:a.exp===e&&f.trap(s,e)==='' });}
  }for(let base of [8,27,64,125]){let s={kind:'fraction',base,m:2,n:3},a=f.maths(s);o.push({kind:'fraction',base,ok:a.val===Math.round(base**(1/3))**2&&f.trap(s,a.val)===''});}return o}''')
  assert all(x['ok'] for x in maths),f'bad maths {width}'
  page.locator('#F3-10 button').filter(has_text='Challenge').first.click();page.wait_for_timeout(90)
  for i,(act_count,answer) in enumerate([(1,5),(2,3),(3,6),(2,9)]):
   for k in range(act_count):
    btn=page.locator('#F3-10 .nova-panel button').filter(has_text=['Join strips','Cancel pair','Add group','Next operation'][i]);assert btn.count(),f'No button {width} round {i} {page.locator("#F3-10").inner_text()[-2000:]}';btn.last.click(timeout=4000);page.wait_for_timeout(70)
   inp=page.locator('#F3-10 input[aria-label="Resulting index or numerical value"]');inp.fill(str(answer));page.locator('#F3-10 button').filter(has_text='Check proof').last.click(timeout=4000);page.wait_for_timeout(150)
   out.append({'width':width,'round':i+1,'answer':answer,'errors':errors.copy(),'text':page.locator('#F3-10').inner_text()[-240:]})
  assert 'Four index laws proved' in page.locator('#F3-10').inner_text(),f'challenge incomplete at {width}'
  # check Explore modes use configured presets, a different type of apparatus per mode
  page.locator('#F3-10 button').filter(has_text='Explore').first.click();page.wait_for_timeout(70)
  sel=page.locator('#F3-10 select[aria-label="Index law preset"]')
  for key,kind in [('Y8-002-MULTIPLY','multiply'),('Y8-002-DIVIDE','divide'),('F8-13','power'),('Y9-003','fraction')]:
   sel.select_option(key);page.wait_for_timeout(100)
   actual=page.locator('#F3-10 .f310-svg').get_attribute('data-law');assert actual==kind,(key,actual)
   page.locator('#F3-10 .f310-svg').screenshot(path=str(R/'shots'/f'F3-10-{width}-{kind}-stage.png'))
  out.append({'width':width,'maths_assertions':len(maths),'errors':errors.copy()});assert not errors,errors
  page.close()
 b.close()
(R/'tests/STRESS-RESULTS.json').write_text(json.dumps(out,indent=2))
print(json.dumps(out,indent=2))
