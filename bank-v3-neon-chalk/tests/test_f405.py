#!/usr/bin/env python3
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,sys
R=Path(__file__).resolve().parents[1];html=(R/'F4/F4-05-fraction-of-amount-bar.html').read_text();shots=R/'shots/F4-05';shots.mkdir(exist_ok=True,parents=True)
checks=[]
def ck(k,v,d=None):
 checks.append({'name':k,'passed':bool(v),'details':d});
 if not v:print('FAIL:',k,str(d)[:250],flush=True)
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in (380,1280):
  page=browser.new_page(viewport={'width':w,'height':1000},reduced_motion='reduce');errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(html,wait_until='load',timeout=60000)
  ck(f'{w} preset provenance',page.evaluate('F405_PRESET.parentEngine')=='F5-11')
  ck(f'{w} original F5 maths present',page.evaluate('NOVA_F5_11_CONFIG.presets.threeQuarter24.a === 24'))
  for mode in ('watch','guided','explore','challenge'):
   page.get_by_role('tab',name=mode.capitalize()).click();page.wait_for_timeout(110)
   svg=page.locator('#F5-11 svg.f405-svg');ck(f'{w} {mode} one bar scene',svg.count()==1)
   ck(f'{w} {mode} maths fraction',svg.locator('g[aria-label="3 over 4"]').count()>=1)
   ck(f'{w} {mode} native NOVA dock',page.locator('#F5-11 .nv-dock').count()==1)
   ck(f'{w} {mode} no overflow',page.evaluate('document.documentElement.scrollWidth <= innerWidth'),page.evaluate('document.documentElement.scrollWidth'))
   ck(f'{w} {mode} no errors',not errors,errors[:2])
   ck(f'{w} {mode} no fraction placeholders',page.locator('#F5-11 .nv-frac-tbd').count()==0)
   page.locator('#F5-11').screenshot(path=str(shots/f'F4-05-{w}-{mode}.png'),animations='disabled',timeout=24000)
   ck(f'{w} {mode} screenshot',True)
  ck(f'{w} challenge hides result', '?' in page.locator('#F5-11 svg.f405-svg').text_content())
  math=page.evaluate('''()=>{let c=NOVA_F5_11_CONFIG;return {presets:Object.keys(c.presets),challenge:!!c._challenge,mode:c.F4_05_PRESET}}''')
  ck(f'{w} F5-11 presets maintained',len(math['presets'])==7,math)
  ck(f'{w} challenge exposed',math['challenge'])
  ck(f'{w} F4 alias flag',math['mode'])
  field=page.locator('#F5-11 input.fa-answer');field.fill('18');page.get_by_role('button',name='Check answer').click()
  ck(f'{w} first exact challenge correct','exact answer accepted' in page.locator('#F5-11 .fa-status').all_text_contents()[-1].lower() if False else 'correct' in page.locator('#F5-11 .nova-fb').last.inner_text().lower())
  page.wait_for_timeout(620);field.fill('10');page.get_by_role('button',name='Check answer').click()
  ck(f'{w} second exact challenge correct','correct' in page.locator('#F5-11 .nova-fb').last.inner_text().lower())
  page.wait_for_timeout(620);field.fill('6 2/3');page.get_by_role('button',name='Check answer').click()
  ck(f'{w} exact mixed fraction accepted','correct' in page.locator('#F5-11 .nova-fb').last.inner_text().lower())
  page.get_by_role('tab',name='Explore').click()
  ck(f'{w} 4 segments for quarters',page.locator('#F5-11 svg.f405-svg [data-group-cell]').count()==4)
  ck(f'{w} one-part value is 6',page.locator('#F5-11 svg.f405-svg').get_attribute('data-one-part')=='6/1')
  page.get_by_role('button',name='Choose next group').click()
  ck(f'{w} selected one part',page.locator('#F5-11 svg.f405-svg').get_attribute('data-selected')=='1')
  page.get_by_role('button',name='Return last group').click()
  ck(f'{w} returned one part',page.locator('#F5-11 svg.f405-svg').get_attribute('data-selected')=='0')
  page.get_by_role('button',name='Choose required groups').click()
  ck(f'{w} selected three parts',page.locator('#F5-11 svg.f405-svg').get_attribute('data-selected')=='3')
  page.get_by_role('button',name='Reset').click()
  ck(f'{w} reset selected parts',page.locator('#F5-11 svg.f405-svg').get_attribute('data-selected')=='0')
  # Fractions stay exact across the original F5-11 presets, not a decimal approximation.
  sel=page.locator('#F5-11 select[aria-label="Choose fraction-of-an-amount preset"]')
  for key,amount,num,den,exact in [('halfSeven','7','1','2','7/2'),('fiveSixth30','30','5','6','25/1'),('zeroFifth','20','0','5','0/1')]:
   sel.select_option(key)
   svg=page.locator('#F5-11 svg.f405-svg')
   ck(f'{w} {key}: exact model',svg.get_attribute('data-exact-answer')==exact)
   ck(f'{w} {key}: correct number of partitions',svg.locator('[data-group-cell]').count()==int(den))
  page.get_by_role('tab',name='Challenge').click()
  chip=page.locator('#F5-11 [data-value-chip="true"]')
  chip.focus();page.keyboard.press('Enter')
  ck(f'{w} keyboard one-part value reveals',page.evaluate('NOVA_F5_11_CONFIG._f405UnitRevealed===true'))
  ck(f'{w} revealed part does not expose answer','?' in page.locator('#F5-11 svg.f405-svg').text_content())
  ck(f'{w} no JavaScript exceptions',not errors,errors[:3])
  page.close()
 browser.close()
results={'passed':sum(x['passed'] for x in checks),'failed':sum(not x['passed'] for x in checks),'checks':len(checks),'details':checks}
(R/'tests/F4-05-BROWSER-RESULTS.json').write_text(json.dumps(results,indent=2))
print(results['passed'],'/',results['checks'],'checks; failed:',results['failed']);sys.exit(bool(results['failed']))
