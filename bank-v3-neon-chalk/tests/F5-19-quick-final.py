from pathlib import Path
from playwright.sync_api import sync_playwright
import json
ROOT=Path(__file__).resolve().parents[1];SRC=(ROOT/'F5/F5-19-pizza-and-chocolate-fraction-contexts.html').read_text()
result=[]
def ck(condition,name,width,motion):
 result.append({'ok':bool(condition),'check':name,'width':width,'motion':motion})
 if not condition:print('FAIL',width,motion,name,flush=True)
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width,motion in [(768,'reduce'),(768,'no-preference'),(320,'no-preference'),(380,'no-preference'),(1280,'no-preference')]:
  page=browser.new_page(viewport={'width':width,'height':960},reduced_motion=motion)
  errors=[];page.on('pageerror',lambda err:errors.append(str(err)))
  page.set_content(SRC,wait_until='domcontentloaded');page.wait_for_timeout(80)
  ck(page.locator('#F5-19 svg.context-svg').count()==1,'SVG mounts',width,motion)
  page.locator('#F5-19 .nova-tab[data-m="explore"]').click();page.wait_for_timeout(70)
  api='NOVA_F5_19_CONFIG._explore'
  ck(page.evaluate(f'v=>{api}.preset(v)','chocolateTwelve') is True,'chocolate 12 selected',width,motion)
  for i in range(9): page.evaluate(f'i=>{api}.serve(i)',i)
  v=page.evaluate(api+'.get()')
  ck(v['count']==9 and v['fraction']==[3,4],'9/12 equals 3/4',width,motion)
  ck(page.locator('#F5-19 [data-f519-piece^="served-"]').count()==9,'9 actual served squares',width,motion)
  ck(page.evaluate('document.documentElement.scrollWidth<=innerWidth'),'no overflow',width,motion)
  if width in [380,1280,768]:page.locator('#F5-19 .nova-stage').screenshot(path=str(ROOT/f'F5-19-{width}-chocolate-served.png'),animations='disabled')
  page.evaluate(f'i=>{api}.remove(i)',0)
  ck(page.evaluate(api+'.get().count')==8,'chocolate piece returned',width,motion)
  page.locator('#F5-19 .nova-tab[data-m="challenge"]').click();page.wait_for_timeout(50)
  ch='NOVA_F5_19_CONFIG._challenge'
  for need in [4,4,9]:
   for i in range(need):page.evaluate(f'i=>{ch}.serve(i)',i)
   ck(page.evaluate(ch+'.check()') is True,f'Challenge {need} piece answer accepted',width,motion)
  ck(not errors,'No JavaScript page errors',width,motion)
  page.close();print('completed',width,motion,flush=True)
 browser.close()
report={'summary':{'total':len(result),'passed':sum(q['ok'] for q in result),'failed':sum(not q['ok'] for q in result)},'checks':result}
(ROOT/'QUICK-FINAL-QA.json').write_text(json.dumps(report,indent=2));print('QA',report['summary'],flush=True)
