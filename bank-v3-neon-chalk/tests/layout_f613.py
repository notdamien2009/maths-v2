"""Responsive stage and text-collision checks; standard widths and lesson contexts."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,sys
root=Path(__file__).resolve().parents[1];html=(root/'F6/F6-13-proportion-in-geometry-GALLERY-PREVIEW.html').read_text()
r={'suite':'layout_f613','checks':0,'passed':0,'failures':[],'widths':[380,430,768,1280]}
def ck(ok,msg):
 r['checks']+=1
 if ok:r['passed']+=1
 else:r['failures'].append(msg)
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in r['widths']:
  pg=b.new_page(viewport={'width':w,'height':900},reduced_motion='reduce');pg.set_content(html,wait_until='domcontentloaded')
  pg.evaluate('()=>Array.from(document.querySelectorAll("button")).find(b=>b.textContent.trim()==="Explore").click()')
  for id in ['Y7-064','Y8-057','Y9-021','Y9-023','Y9-029']:
   pg.evaluate('x=>F613_CONFIG._explore.setPreset(x)',id)
   info=pg.evaluate('''() => {
     const art=document.querySelector('#F6-13 .f613-art'),sv=art.querySelector('svg'),stage=document.querySelector('#F6-13 .nova-stage'),aside=document.querySelector('#F6-13 .f613-aside'),dock=document.querySelector('#F6-13 .f613-dock');
     const A=art.getBoundingClientRect(),S=sv.getBoundingClientRect(),G=stage.getBoundingClientRect(),D=dock.getBoundingClientRect();
     const labels=[...sv.querySelectorAll('text')].map(e=>({text:e.textContent||'',bbox:e.getBoundingClientRect().toJSON()}));
     return {width:innerWidth,artW:A.width,svgW:S.width,stageW:G.width,stageScroll:stage.scrollWidth,stageClient:stage.clientWidth,dock:D.toJSON(),labels,sidebarCards:aside.querySelectorAll('.nv-ncard').length};}''')
   ck(info['stageScroll']<=info['stageClient']+10,f'{w} {id} no horizontal stage overflow')
   ck(info['svgW']>min(280,w*.65),f'{w} {id} stage artwork visible')
   ck(info['sidebarCards']>=3,f'{w} {id} evidence cards')
   # Detect text rectangles colliding with the major captions inside the SAME SVG, excluding close side-value annotations.
   candidates=[e for e in info['labels'] if e['text'].startswith(('SAME SHAPE','CORRESPONDING SIDES','A · ORIGINAL','B · ENLARGED','SCALE ×','ALL SIDES'))]
   collided=False
   for i,a in enumerate(candidates):
    x=a['bbox'];
    for z in candidates[i+1:]:
     y=z['bbox'];ix=min(x['right'],y['right'])-max(x['left'],y['left']);iy=min(x['bottom'],y['bottom'])-max(x['top'],y['top']);
     if ix>2 and iy>2:collided=True
   ck(not collided,f'{w} {id} main math headline overlap')
   dockchip=pg.locator('#F6-13 .f613-dock [data-choice="3"]').bounding_box()
   db=info['dock'];ck(dockchip is not None and dockchip['y']+dockchip['height']<db['y']+db['height']+3,f'{w} {id} chips not clipped')
  pg.close()
 b.close()
r['failed']=len(r['failures']);(root/'tests/f613-layout-results.json').write_text(json.dumps(r,indent=2));print(json.dumps(r));sys.exit(bool(r['failed']))
