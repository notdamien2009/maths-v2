"""SVG geometry and typography intersection QA for F6-04 at 380/1280."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json
ROOT=Path(__file__).resolve().parents[1]
HTML=(ROOT/'F6/F6-04-simplifying-ratios.html').read_text()
checks=[]
def ck(name, condition,details=''):
 checks.append({'name':name,'passed':bool(condition),'details':str(details)[:240]})
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for w in (380,1280):
  p=browser.new_page(viewport={'width':w,'height':2000})
  p.set_content(HTML,wait_until='domcontentloaded')
  p.locator('#F6-04 button[role=tab]').filter(has_text='Explore').click()
  for preset in ('Y7-058','Y8-034-fractions'):
   p.evaluate('(x)=>F604_CONFIG._explore.setPreset(x)',preset)
   geometry=p.evaluate('''()=>{const s=document.querySelector('svg.f604-svg');const txt=[...s.querySelectorAll('text')];function bb(e){const q=e.getBBox();return{x:q.x,y:q.y,w:q.width,h:q.height,right:q.x+q.width,bottom:q.y+q.height};}const title=txt.find(x=>x.textContent.includes('SAME COMPARISON')),ratio=[...s.querySelectorAll('.f604-fraction')],subtitle=txt.find(x=>x.textContent.includes('MULTIPLY BOTH')),chip=[...s.querySelectorAll('[data-chip]')].map(x=>bb(x)),lasso=txt.find(x=>x.textContent==='LASSO'),desc=txt.find(x=>x.textContent.startsWith('GROUP BOTH SIDES · DROP'));return {title:bb(title),ratio:ratio.map(bb),subtitle:subtitle?bb(subtitle):null,chip,lasso:bb(lasso),desc:bb(desc),vb:[s.viewBox.baseVal.width,s.viewBox.baseVal.height]};}''')
   if preset=='Y8-034-fractions':
    ck(f'{w}/fractions/proper-two-stack',len(geometry['ratio'])==2)
    ck(f'{w}/fractions/below-heading',geometry['ratio'][0]['y']-geometry['title']['bottom']>=8,geometry)
    ck(f'{w}/fractions/above-explanation',geometry['subtitle']['y']-geometry['ratio'][0]['bottom']>=7,geometry)
   else:ck(f'{w}/counters/no-fraction-groups',len(geometry['ratio'])==0)
   def overlap(a,b):return min(a['right'],b['right'])>max(a['x'],b['x']) and min(a['bottom'],b['bottom'])>max(a['y'],b['y'])
   for i,c in enumerate(geometry['chip']):
    ck(f'{w}/{preset}/chip{i}-lasso-separate',not overlap(c,geometry['lasso']))
    ck(f'{w}/{preset}/chip{i}-instruction-separate',not overlap(c,geometry['desc']))
   ck(f'{w}/{preset}/lasso-within-svg',geometry['lasso']['bottom']<geometry['vb'][1])
   ck(f'{w}/{preset}/no-viewport-overflow',p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
  p.evaluate('F604_CONFIG._explore.setPreset("Y7-058")')
  p.evaluate('F604_CONFIG._explore.group(0);F604_CONFIG._explore.group(1)')
  g=p.evaluate('''()=>{const s=document.querySelector('svg.f604-svg');let captions=[...s.querySelectorAll('text')].filter(t=>t.textContent.includes('BUNDLES OF')),mobile=innerWidth<=760,cy=[222,455],h=[177,177];if(!mobile){cy=[257,257];h=[251,251]}return captions.map((t,i)=>({captionTop:t.getBBox().y,bundleBottom:cy[i]+(mobile?30:43)+(mobile?70:119),panelBottom:cy[i]-31+h[i]}));}''')
  ck(f'{w}/bundle-captions-count',len(g)==2,g)
  for i,v in enumerate(g):ck(f'{w}/bundle-caption{i}-not-overlap',v['captionTop']-v['bundleBottom']>=5,v)
  p.close()
 browser.close()
res={'engine':'F6-04','checks':checks,'passed':sum(x['passed'] for x in checks),'total':len(checks),'failures':[x for x in checks if not x['passed']]}
(ROOT/'tests/f604-layout-results.json').write_text(json.dumps(res,indent=2))
print('LAYOUT:',res['passed'],'/',res['total'],'FAIL:',res['failures'][:2])
if res['failures']:raise SystemExit(1)
