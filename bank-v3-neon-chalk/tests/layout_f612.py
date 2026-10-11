"""Detect real SVG chalk-text overlap and clipping across 4 viewports and all F6-12 presets."""
from playwright.sync_api import sync_playwright
from pathlib import Path
import json,sys
root=Path(__file__).resolve().parents[1];html=(root/'F6/F6-12-currency-unit-bridges-GALLERY-PREVIEW.html').read_text()
out={'suite':'layout_f612','checks':0,'passed':0,'failed':0,'failures':[],'widths':[380,430,768,1280]}
def verify(ok,msg):
 out['checks']+=1
 if ok:out['passed']+=1
 else:out['failures'].append(msg)
js='''() => {const s=document.querySelector('#F6-12 .f612-art svg.f612-svg'),v=s.viewBox.baseVal;const texts=[...s.querySelectorAll('text')].map((e,i)=>{const b=e.getBBox();return {text:e.textContent, x:b.x,y:b.y,w:b.width,h:b.height};}); const errors=[];texts.forEach((t,i)=>{if(t.x < -3||t.y < -3 ||t.x+t.w>v.width+3||t.y+t.h>v.height+3)errors.push('clipped:'+t.text+':'+JSON.stringify(t)); for(let j=i+1;j<texts.length;j++){const u=texts[j],ox=Math.max(0,Math.min(t.x+t.w,u.x+u.w)-Math.max(t.x,u.x)),oy=Math.max(0,Math.min(t.y+t.h,u.y+u.h)-Math.max(t.y,u.y));if(ox>5&&oy>5)errors.push('overlap '+t.text+' / '+u.text+' '+Math.round(ox)+'x'+Math.round(oy));}});return {errors,textCount:texts.length,svgWidth:v.width,svgHeight:v.height};}'''
with sync_playwright() as pl:
 for width in out['widths']:
  print('layout width',width,flush=True)
  b=pl.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
  pg=b.new_page(viewport={'width':width,'height':800},reduced_motion='reduce');pg.set_content(html,wait_until='domcontentloaded')
  pg.evaluate("()=>[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Explore').click()")
  for key in ('Y8-039','Y8-043','Y9-024'):
   pg.evaluate('key=>F612_CONFIG._explore.setPreset(key)',key)
   r=pg.evaluate(js)
   verify(len(r['errors'])==0,f'{width}/{key} SVG text collisions: '+', '.join(r['errors'][:8]))
   verify(r['textCount']>=8,f'{width}/{key} missing labels')
   verify(pg.evaluate('()=>document.querySelector("#F6-12 .f612-art").scrollWidth<=document.querySelector("#F6-12 .f612-art").clientWidth+3'),f'{width}/{key} horizontal overflow')
  pg.close();b.close()
out['failed']=len(out['failures']);(root/'tests/f612-layout-results.json').write_text(json.dumps(out,indent=2));print(json.dumps(out));sys.exit(bool(out['failed']))
