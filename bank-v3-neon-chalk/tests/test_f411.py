#!/usr/bin/env python3
import json,os,sys,time
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1]
URL=(R/'F4/F4-11-word-problem-highlighter.html').as_uri()
OUT=R/'tests/F4-11-BROWSER-RESULTS.json'
logs=[]
def test(label,pred,detail=''):
    logs.append({'test':label,'passed':bool(pred),'detail':str(detail)[:200]});
    if not pred:print('FAIL',label,detail)
with sync_playwright() as p:
  browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--disable-dev-shm-usage','--no-sandbox','--allow-file-access-from-files'])
  for width in [380,1280]:
    page=browser.new_page(viewport={'width':width,'height':1000},reduced_motion='reduce')
    errs=[];page.on('pageerror',lambda err:errs.append(str(err)))
    page.set_content((R/'F4/F4-11-word-problem-highlighter.html').read_text(),wait_until='load',timeout=60000);page.wait_for_timeout(900)
    test(f'{width} registry',page.locator('#F4-11').count()==1)
    test(f'{width} svg',page.locator('#F4-11 svg.f411-svg').count()==1)
    test(f'{width} screen no horizontal overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth+3'),page.evaluate('[document.documentElement.scrollWidth,innerWidth]'))
    test(f'{width} no js errors',not errs,errs)
    for mode in ['guided','explore','challenge','watch']:
      loc=page.locator(f'#F4-11 [data-m="{mode}"]')
      test(f'{width} tab {mode} exists',loc.count()>0)
      if loc.count():
        loc.first.click();page.wait_for_timeout(220)
        test(f'{width} {mode} apparatus',page.locator('#F4-11 svg.f411-svg').count()==1)
        test(f'{width} {mode} text',page.locator('#F4-11 .f411-phrase').count()==3)
        test(f'{width} {mode} no errors',not errs,errs)
    page.locator('#F4-11 [data-m="explore"]').click();page.wait_for_timeout(250)
    for r in ['whole','part','difference']:
      page.locator(f'#F4-11 .f411-tool[data-role="{r}"]').click()
      page.locator(f'#F4-11 .f411-phrase[data-phrase="{r}"]').click()
      page.locator(f'#F4-11 .f411-chip[data-phrase="{r}"]').focus();page.keyboard.press('Enter');page.wait_for_timeout(180)
      test(f'{width} placed {r}',page.locator(f'#F4-11 .f411-chip[data-phrase="{r}"][data-placed="true"]').count()==1)
    page.locator('#F4-11 .f411-field input').fill('3x+4');page.locator('#F4-11 .f411-actions button').filter(has_text='Check my model').click();page.wait_for_timeout(250)
    test(f'{width} proven expression',page.locator('#F4-11 .f411-done').count()==1)
    page.locator('#F4-11 [data-m="challenge"]').click();page.wait_for_timeout(300)
    test(f'{width} challenge hidden answer',page.locator('#F4-11 svg.f411-svg').get_attribute('data-won')=='false')
    test(f'{width} challenge stage',page.locator('#F4-11 .f411-phrase').count()==3)
    page.close()
  browser.close()
OUT.write_text(json.dumps({'passed':sum(x['passed'] for x in logs),'failed':sum(not x['passed'] for x in logs),'results':logs},indent=2))
print('RESULT',sum(x['passed'] for x in logs),'pass',sum(not x['passed'] for x in logs),'fail')
if any(not x['passed'] for x in logs):sys.exit(1)
