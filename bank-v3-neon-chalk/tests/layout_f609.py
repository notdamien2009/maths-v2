import json,pathlib,sys
from playwright.sync_api import sync_playwright
r=pathlib.Path(__file__).resolve().parents[1];html=(r/'F6/F6-09-inverse-proportion-rectangle.html').read_text();good=[];bad=[]
def test(name,fn):
 try:fn();good.append(name)
 except Exception as e:bad.append({'name':name,'error':str(e)[:350]});print('FAIL',name,str(e)[:110])
def must(v,msg):
 if not v:raise AssertionError(msg)
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu'])
 for width in [380,430,768,1280]:
  page=b.new_page(viewport={'width':width,'height':950});page.set_content(html,wait_until='domcontentloaded');page.locator('#F6-09 [data-m="explore"]').click()
  test(f'{width} body no overflow',lambda:must(page.evaluate('document.documentElement.scrollWidth<=innerWidth+3'),'horizontal body overflow'))
  test(f'{width} 4 maths cards present',lambda:must(page.locator('#F6-09 .f609-aside .nv-ncard').count()==4,'missing'))
  for key in ['Y8-037','Y9-013','Y9-019','Y9-020']:
   page.evaluate('(v)=>F609_CONFIG._explore.setPreset(v)',key)
   choices=page.evaluate('(k)=>F609_CONFIG.presets[k].xs',key)
   for pos in [choices[0],choices[-1]]:
    page.evaluate('(v)=>F609_CONFIG._explore.setWidth(v)',pos)
    test(f'{width} {key} width {pos} no overflow',lambda:must(page.evaluate('document.documentElement.scrollWidth<=innerWidth+3'),'overflow'))
    test(f'{width} {key} width {pos} invariant',lambda:must(page.evaluate('(v)=>Math.abs(F609_CONFIG._explore.get().x*F609_CONFIG._explore.get().y-F609_CONFIG.presets[v].k)<1e-9',key),'area changed'))
    test(f'{width} {key} width {pos} height label clear of area proof',lambda:must(page.evaluate('''()=>{let texts=[...document.querySelectorAll('#F6-09 svg text')];let a=texts.find(x=>x.textContent.startsWith('AREA =')),y=texts.find(x=>x.textContent.startsWith('y = '));if(!a||!y)return false;let A=a.getBoundingClientRect(),Y=y.getBoundingClientRect();return A.right<Y.left-3||Y.right<A.left-3||A.bottom<Y.top-3||Y.bottom<A.top-3;}'''),'area/height text collision'))
    test(f'{width} {key} width {pos} no stage clipped',lambda:must(page.locator('#F6-09 svg.f609-svg').evaluate('(el)=>el.getBoundingClientRect().width>200'),'stage too small'))
  page.close()
 b.close()
res={'suite':'layout','passed':len(good),'total':len(good)+len(bad),'failures':bad,'tested_widths':[380,430,768,1280],'preset_extremes':True};(r/'tests/f609-layout-results.json').write_text(json.dumps(res,indent=2));print('LAYOUT',res['passed'],'/',res['total']);sys.exit(bool(bad))
