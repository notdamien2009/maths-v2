from pathlib import Path
from playwright.sync_api import sync_playwright
import json
r=Path(__file__).resolve().parents[1];entry=(r/'F7/F7-04-expanding-single-brackets.html').read_text();base=(r/'F3/F3-02-area-model-of-multiplication.html').read_text();res=[]
def check(label,v):
 res.append((label,bool(v)));print(label,'PASS' if v else 'FAIL',flush=True)
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in (380,1280):
  page=b.new_page(viewport={'width':w,'height':1000},reduced_motion='reduce');err=[];page.on('pageerror',lambda e:err.append(str(e)));page.set_content(entry,wait_until='load');page.wait_for_timeout(80)
  check(f'{w}-F3-engine-identity',page.locator('#F3-02').count()==1 and page.locator('#F7-04').count()==0)
  check(f'{w}-preset-variant',page.evaluate("F704_PRESET_MATH.validate(3,2,'3x + 6') && F302_CONFIG.preset==='F7-04-expanding-single-brackets'"))
  for mode in ['Guided','Watch','Explore','Challenge']:
   page.locator('#F3-02 button:has-text("'+mode+'")').first.click();page.wait_for_timeout(60)
   check(f'{w}-{mode}-render',page.locator('#F3-02 svg.f302-art').count()==1)
   check(f'{w}-{mode}-no-horizontal-scroll',page.evaluate('document.documentElement.scrollWidth<=innerWidth+2'))
   page.locator('#F3-02 .nova-stage').screenshot(path=str(r/'shots/F7-04'/f'F7-04-{w}-{mode.lower()}-stage.png'),animations='disabled')
   if mode=='Challenge':
    check(f'{w}-challenge-answer-hidden',page.locator('#F3-02 .f302-aside .nv-ntile').first.inner_text().strip()=='?')
  check(f'{w}-no-javascript-errors',not err)
  page.close()
 page=b.new_page(viewport={'width':1280,'height':950},reduced_motion='reduce');page.set_content(base,wait_until='load');check('F3-regression-numeric-default',page.evaluate("F302_CONFIG.preset==='Y7-009-whole-decimal-multiplication' && F3_02.timeline != null"));page.close();b.close()
(r/'tests/f704-final-smoke.json').write_text(json.dumps([{'name':k,'pass':v} for k,v in res],indent=2));print('FINAL',sum(v for _,v in res),'/',len(res))
raise SystemExit(0 if all(v for _,v in res) else 1)
