"""Visual layout geometry / clipping checks of actual F6-05 in Chromium."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json
root=Path(__file__).resolve().parents[1];html=(root/'F6/F6-05-recipe-scaler.html').read_text()
r={'component':'F6-05','tests':[],'failures':[]}
def ck(n,v,details=''):
 r['tests'].append({'name':n,'pass':bool(v),'details':str(details)[:300]})
 if not v:r['failures'].append(n+': '+str(details)[:280])
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in [380,1280]:
  for m in ['watch','guided','explore','challenge']:
   p=b.new_page(viewport={'width':w,'height':1000},reduced_motion='reduce');p.set_content(html);p.locator('#F6-05 button[role=tab]').filter(has_text=m.title()).click();p.wait_for_timeout(100)
   res=p.evaluate('''()=>{const s=document.querySelector('.f605-svg');const w=s.viewBox.baseVal.width,h=s.viewBox.baseVal.height;
    const texts=[...s.querySelectorAll('text')].map(t=>{const b=t.getBBox();return {text:t.textContent,x:b.x,y:b.y,r:b.x+b.width,b:b.y+b.height}});
    const outside=texts.filter(t=>t.x< -6||t.r>w+6||t.y< -6||t.b>h+6);
    const masks=[...s.querySelectorAll('text')].filter(t=>t.textContent.includes('DRAG AMOUNTS'));
    const controls=[...document.querySelectorAll('#F6-05 .f605-svg [data-chip]')].map(x=>x.getBoundingClientRect());
    const overflow=document.documentElement.scrollWidth>innerWidth+1;
    return{outside,viewBox:[w,h],overflow,tileCount:controls.length,textCount:texts.length};}''')
   ck(f'{w}/{m}/no-clipped-chalk',not res['outside'],res['outside'])
   ck(f'{w}/{m}/no-viewport-overflow',not res['overflow'])
   ck(f'{w}/{m}/label-count',res['textCount']>=15,res['textCount'])
   if m=='explore':ck(f'{w}/{m}/four-drag-values',res['tileCount']>=4,res['tileCount'])
   p.close()
 b.close()
r['passed']=sum(x['pass'] for x in r['tests']);r['total']=len(r['tests']);(root/'tests/f605-layout-results.json').write_text(json.dumps(r,indent=2));print('LAYOUT',r['passed'],'/',r['total'],r['failures'])
if r['failures']:raise SystemExit(1)
