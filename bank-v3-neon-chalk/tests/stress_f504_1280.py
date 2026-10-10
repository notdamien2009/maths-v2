import json,random
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1];src=(root/'F5/F5-04-fractions-number-line-preset.html').read_text();results=[]
def check(label,ok,more=''):
 results.append({'check':label,'pass':bool(ok),'detail':str(more)[:180]});print(('PASS' if ok else 'FAIL'),label,str(more)[:90],flush=True)
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in [1280]:
  pg=b.new_page(viewport={'width':width,'height':850},reduced_motion='no-preference');err=[];pg.on('pageerror',lambda e:err.append(str(e)));pg.set_content(src,wait_until='domcontentloaded');pg.wait_for_timeout(75)
  pg.locator('#F5-04 .nova-tab[data-m="explore"]').click();pg.wait_for_timeout(50)
  for n,d,lo,hi,fac in [(3,4,0,2,2),(5,3,0,2,3),(-2,3,-1,1,2),(7,3,0,3,3),(7,8,0,2,2),(1,2,0,2,2)]:
   pg.evaluate('v=>NOVA_F5_04_CONFIG._explore.set(...v)',[n,d,lo,hi,fac]);pg.wait_for_timeout(20)
   data=pg.evaluate('''()=>{let a=document.querySelector('#F5-04 .fnl-svg'),p=a.querySelector('[data-marker="top"] circle'), rings=[...a.querySelectorAll('.nv-numberline')];let lines=rings.map(g=>g.getBoundingClientRect());return {has:!!a, axis:rings.length, label:a.getAttribute('aria-label'), marker:p?+p.getAttribute('cx'):null, invalid:a.innerHTML.includes('NaN')}}''')
   check(str(width)+' exact positions '+str(n)+'/'+str(d),data['has'] and data['axis']==2 and not data['invalid'],data)
  pg.evaluate('NOVA_F5_04_CONFIG._explore.set(3,4,0,2,2)')
  drag=pg.locator('#F5-04 .fnl-handle .nv-hit');drag.scroll_into_view_if_needed();
  for rep,target in enumerate([2,4,7,0,6,3]):
   bb=drag.bounding_box();pos=pg.evaluate('''(num)=>{let svg=document.querySelector('#F5-04 .fnl-svg'),small=innerWidth<=670,x=(small?58:180)+(small?308:748)*num/8,y=small?257:234,p=svg.createSVGPoint();p.x=x;p.y=y;let q=p.matrixTransform(svg.getScreenCTM());return {x:q.x,y:q.y}}''',target)
   pg.mouse.move(bb['x']+bb['width']/2,bb['y']+bb['height']/2);pg.mouse.down();pg.mouse.move(pos['x'],pos['y'],steps=9);pg.mouse.up();pg.wait_for_timeout(280)
   q=pg.evaluate('''()=>({n:NOVA_F5_04_CONFIG._explore.get().n,stuck:!!NOVA.ui._drag,offs:document.querySelectorAll('.nv-drag-lift').length})''')
   check(str(width)+' repeated drag '+str(rep+1),q['n']==target and not q['stuck'] and not q['offs'],q)
  check(str(width)+' overflow',pg.evaluate('document.documentElement.scrollWidth<=innerWidth'))
  check(str(width)+' no errors',len(err)==0,err)
  if width in (320,768):pg.locator('#F5-04 .nova-stage').screenshot(path=str(root/f'shots/F5/F5-04-{width}-explore.png'))
  pg.close()
 b.close()
(root/'tests/stress-f504-1280-final-results.json').write_text(json.dumps(results,indent=2));print('TOTAL',sum(x['pass'] for x in results),'/',len(results),flush=True)
