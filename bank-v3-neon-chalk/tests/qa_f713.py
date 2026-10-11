"""Browser, mathematical, accessibility and interaction checks for F7-13.
Run from repo root with: python tests/qa_f713.py
"""
import json,sys
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
HTML=(ROOT/'F7/F7-13-difference-of-two-squares.html').read_text('utf8')
shots=ROOT/'shots/F7-13';shots.mkdir(parents=True,exist_ok=True)
results=[]
def ck(value,label):
 results.append({'name':label,'pass':bool(value)})
 if not value:print('FAIL',label,flush=True)

def state(page):return page.locator('svg.f713-art').get_attribute('data-f713-moved')
def point(page,x,y):
 return page.evaluate('''a=>{const s=document.querySelector('svg.f713-art');let q=s.createSVGPoint();q.x=a[0];q.y=a[1];let p=q.matrixTransform(s.getScreenCTM());return{x:p.x,y:p.y}}''',[x,y])

def drag(page,coords,frompt=None):
 page.locator('svg.f713-art').scroll_into_view_if_needed()
 g=page.evaluate('F713_MATH.geom(F713_CONFIG.presets[F713_CONFIG.preset])')
 x,y=(g['strip']['x']+g['strip']['w']/2,g['strip']['y']+g['strip']['h']/2) if not state(page)=='true' else (g['target']['x']+g['target']['w']/2,g['target']['y']+g['target']['h']/2)
 a=point(page,x,y)
 t=point(page,*coords(g))
 page.mouse.move(a['x'],a['y']);page.mouse.down();page.mouse.move(t['x'],t['y'],steps=18);page.mouse.up();page.wait_for_timeout(500)

with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [320,380,768,1280]:
  page=browser.new_page(viewport={'width':width,'height':900},reduced_motion='reduce');err=[];page.on('pageerror',lambda e:err.append(str(e)))
  page.set_content(HTML,wait_until='load');page.wait_for_timeout(60)
  ck(page.locator('#F7-13 svg.f713-art').count()==1,f'{width} loads SVG')
  ck(page.locator('#F7-13 .nv-dock').count()>=1,f'{width} uses canonical mascot dock')
  ck(page.evaluate('document.documentElement.scrollWidth<=window.innerWidth+2'),f'{width} no horizontal overflow')
  ck(page.locator('#F7-13 svg.f713-art').get_attribute('aria-label') is not None,f'{width} accessible SVG')
  for m in ['Watch','Guided','Explore','Challenge']:
   page.get_by_role('tab',name=m,exact=True).click();page.wait_for_timeout(70)
   ck(page.locator('#F7-13 svg.f713-art').count()==1,f'{width} {m} renders')
   ck(not err,f'{width} {m} no JS errors')
   if width in [380,1280]:
    page.screenshot(path=str(shots/f'F7-13-{width}-{m.lower()}.png'),full_page=True)
   if m=='Explore':
    ck(state(page)=='false',f'{width} Explore starts unmoved')
    page.get_by_role('button',name='Move strip').click();page.wait_for_timeout(70)
    ck(state(page)=='true',f'{width} move strip')
    ck('x² −' in page.locator('#F7-13 .f713-equation').inner_text(),f'{width} exact area proof')
    page.get_by_role('button',name='Undo').click();page.wait_for_timeout(70)
    ck(state(page)=='false',f'{width} undo')
    page.get_by_role('button',name='Move strip').click();page.get_by_role('button',name='Return strip').click();page.wait_for_timeout(60)
    ck(state(page)=='false',f'{width} returns strip')
    page.locator('[data-f713-piece]').focus();page.keyboard.press('Enter');page.wait_for_timeout(60)
    ck(state(page)=='true',f'{width} keyboard place')
    page.locator('[data-f713-piece]').focus();page.keyboard.press('r');page.wait_for_timeout(60)
    ck(state(page)=='false',f'{width} keyboard return')
   if m=='Challenge':
    # Wrong signs produce diagnostic feedback, not assessment advancement.
    page.get_by_role('button',name='Move strip').click()
    page.locator('#f713-answer').fill('(x+2)(x+2)')
    page.get_by_role('button',name='Check my proof').click();page.wait_for_timeout(80)
    ck('signs must be different' in page.locator('.f713-status').inner_text(),f'{width} wrong signs feedback')
    ck('Challenge 1 of 4' in page.locator('#F7-13').inner_text(),f'{width} wrong answer stays in round')
    for i,b in enumerate([2,3,4,5]):
     if i: page.get_by_role('button',name='Move strip').click()
     # Deliberately alternate factor order: multiplication is commutative.
     expression=f'(x-{b})(x+{b})' if i%2 else f'(x+{b})(x-{b})'
     page.locator('#f713-answer').fill(expression)
     page.get_by_role('button',name='Check my proof').click();page.wait_for_timeout(90)
     ck(i==3 and 'Four proofs complete' in page.locator('#F7-13').inner_text() or i<3 and f'Challenge {i+2} of 4' in page.locator('#F7-13').inner_text(),f'{width} challenge round {i+1}')
  ck(not err,f'{width} no page errors at end')
  page.close()
 # All presets are exact equal areas, bad values rejected, misconception filters effective.
 page=browser.new_page();page.set_content(HTML)
 for key,p in page.evaluate('Object.entries(F713_CONFIG.presets)'):
  mm=page.evaluate('a=>F713_MATH.maths(a)',p)
  ck(mm['numericArea']==mm['numericRectangle'],f'{key} conserved area')
  ck(page.evaluate('a=>F713_MATH.feedback(a[0],a[1])', [mm['factor'],p])=='',f'{key} accepted factorisation')
  ck(bool(page.evaluate('a=>F713_MATH.feedback(a[0],a[1])',[f'(x+{p["b"]})(x+{p["b"]})',p])),f'{key} diagnostic same-sign')
 page.close();browser.close()
passed=sum(r['pass'] for r in results)
file=ROOT/'tests/F7-13-QA-RESULTS.json'
file.write_text(json.dumps({'passed':passed,'total':len(results),'results':results},indent=2),'utf8')
print('RESULT',passed,'/',len(results),flush=True)
sys.exit(0 if passed==len(results) else 1)
