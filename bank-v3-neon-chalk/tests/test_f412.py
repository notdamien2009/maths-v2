#!/usr/bin/env python3
import json,sys
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];OUT=R/'tests/F4-12-BROWSER-RESULTS.json';data=[]
def ck(name,condition,detail=''):
 data.append({'test':name,'passed':bool(condition),'detail':str(detail)[:300]})
 if not condition:print('FAIL',name,detail,flush=True)
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [380,1280]:
  page=browser.new_page(viewport={'width':width,'height':1050},reduced_motion='reduce');errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_default_timeout(10000);page.set_content((R/'F4/F4-12-rates-tape-diagram.html').read_text(),wait_until='load',timeout=60000);page.wait_for_timeout(300)
  ck(f'{width}: registry',page.locator('#F4-12').count()==1)
  ck(f'{width}: apparatus',page.locator('#F4-12 svg.f412-svg').count()==1)
  ck(f'{width}: no JS errors',not errors,errors)
  ck(f'{width}: no horizontal overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth+2'),page.evaluate('[document.documentElement.scrollWidth,innerWidth]'))
  ck(f'{width}: exact model',page.evaluate('F412_MATH.math(F412_CONFIG.presets["Y8-041"]).answer')==50)
  ck(f'{width}: data validation rejects wrong',page.evaluate('!F412_MATH.validate(F412_CONFIG.presets["Y8-041"],150,true,3).ok'))
  for mode in ['watch','guided','explore','challenge']:
   tab=page.locator(f'#F4-12 [data-m="{mode}"]');ck(f'{width}: {mode} tab exists',tab.count()>0)
   if tab.count():
    tab.first.click();page.wait_for_timeout(180)
    ck(f'{width}: {mode} SVG',page.locator('#F4-12 svg.f412-svg').count()==1)
    ck(f'{width}: {mode} error-free',not errors,errors)
  page.locator('#F4-12 [data-m="explore"]').click();page.wait_for_timeout(100)
  inp=page.locator('#F4-12 input[aria-label*="Unknown"]');ck(f'{width}: rate input',inp.count()==1)
  inp.fill('50');inp.press('Tab');page.wait_for_timeout(150)
  rate=page.locator('#F4-12 .f412-drag[data-item="rate"]');ck(f'{width}: rate chip from value',rate.count()==1)
  rate.focus();page.keyboard.press('Enter');page.wait_for_timeout(220)
  ck(f'{width}: rate chip snaps',page.locator('#F4-12 .f412-drag[data-item="rate"][data-placed="true"]').count()==1)
  page.get_by_role('button',name='Check my tape').click();page.wait_for_timeout(150)
  ck(f'{width}: rate challenge proved',page.locator('#F4-12 .f412-done').count()==1)
  page.locator('#F4-12 [data-m="challenge"]').click();page.wait_for_timeout(150)
  ck(f'{width}: unknown rate masked',page.locator('#F4-12 .f412-side .f412-value').nth(1).inner_text().strip()=='?')
  ck(f'{width}: all JS good',not errors,errors)
  page.close()
 browser.close()
OUT.write_text(json.dumps({'passed':sum(x['passed'] for x in data),'failed':sum(not x['passed'] for x in data),'results':data},indent=2))
print('RESULT',sum(x['passed'] for x in data),'pass',sum(not x['passed'] for x in data),'fail',flush=True)
if any(not x['passed'] for x in data):sys.exit(1)
