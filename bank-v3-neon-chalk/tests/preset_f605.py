from pathlib import Path
from playwright.sync_api import sync_playwright
import json
root=Path(__file__).resolve().parents[1];html=(root/'F6/F6-05-recipe-scaler.html').read_text();shots=root/'shots/F6-05'
r={'component':'F6-05','checks':[],'screenshots':[],'failures':[]}
def ck(n,v,d=''):
 r['checks'].append({'name':n,'pass':bool(v)})
 if not v:r['failures'].append(n+' '+str(d))
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in [380,1280]:
  for id in ['Y7-060-double','Y7-060-half','Y7-060-triple']:
   p=b.new_page(viewport={'width':w,'height':950},reduced_motion='reduce');errs=[];p.on('pageerror',lambda e:errs.append(str(e)));p.set_content(html);p.locator('#F6-05 button[role=tab]').filter(has_text='Explore').click();p.evaluate('(id)=>F605_CONFIG._explore.setPreset(id)',id);p.wait_for_timeout(130)
   st=p.evaluate('F605_CONFIG._explore.get()')
   ck(f'{w}/{id}/preset-change',st['id']==id,st)
   ck(f'{w}/{id}/no-errors',not errs,errs)
   ck(f'{w}/{id}/row4',p.locator('.f605-ingredient-icon').count()==4)
   ck(f'{w}/{id}/no-viewport-overflow',p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
   filename=f'F6-05-{w}-explore-{id}.png';p.locator('#F6-05').screenshot(path=str(shots/filename),animations='disabled',timeout=12000);r['screenshots'].append('shots/F6-05/'+filename)
   p.close()
 b.close()
r['passed']=sum(x['pass'] for x in r['checks']);r['total']=len(r['checks']);(root/'tests/f605-presets-results.json').write_text(json.dumps(r,indent=2));print('PRESET',r['passed'],'/',r['total'],r['failures'])
if r['failures']:raise SystemExit(1)
