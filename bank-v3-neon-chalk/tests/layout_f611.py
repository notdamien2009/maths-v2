"""Responsive and overlapping text checks for F6-11, widths 380,430,768,1280."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,sys
root=Path(__file__).resolve().parents[1];HTML=(root/'F6/F6-11-rates-of-change-tank.html').read_text()
ok=[];bad=[]
def must(x,msg):
 if not x:raise AssertionError(msg)
def test(name,fn):
 try:fn();ok.append(name)
 except Exception as e:bad.append({'name':name,'reason':str(e)[:170]});print('FAIL',name,str(e)[:100],flush=True)
with sync_playwright() as pl:
 b=pl.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu'])
 for w in (380,430,768,1280):
  page=b.new_page(viewport={'width':w,'height':860},reduced_motion='reduce');page.set_content(HTML,wait_until='domcontentloaded')
  for mode in ('watch','guided','explore','challenge'):
   page.locator(f'#F6-11 [data-m="{mode}"]').click()
   test(f'{w} {mode} no page horizontal overflow',lambda:must(page.evaluate('document.documentElement.scrollWidth<=innerWidth+3'),'overflow'))
   test(f'{w} {mode} no vanished drawing',lambda:must(page.locator('#F6-11 .f611-art .f611-svg').first.is_visible(),'drawing absent'))
   test(f'{w} {mode} helper present',lambda:must(page.locator('#F6-11 .nova-stage .nv-dockfig').count()>0,'mascot missing'))
   test(f'{w} {mode} major teaching labels no overlap',lambda:must(page.evaluate('''() => {
     let s=document.querySelector('#F6-11 svg.f611-svg');
     let picks=['ONE CHANGE','RATE =','GLASS','WATER DEPTH','DEPTH–TIME GRAPH'];let rects=[];
     for(let phrase of picks){let el=[...s.querySelectorAll('text')].find(x=>x.textContent.includes(phrase));if(el){let r=el.getBoundingClientRect();rects.push({phrase,l:r.left,r:r.right,t:r.top,b:r.bottom});}}
     for(let i=0;i<rects.length;i++)for(let j=i+1;j<rects.length;j++){
       let a=rects[i],b=rects[j];if(Math.min(a.r,b.r)-Math.max(a.l,b.l)>3&&Math.min(a.b,b.b)-Math.max(a.t,b.t)>3)return false;
     }return true;
    }'''),'teaching caption overlap'))
  page.locator('#F6-11 [data-m="explore"]').click()
  for id in ('Y8-042','Y9-023'):
   page.evaluate('(id)=>F611_CONFIG._explore.setPreset(id)',id)
   test(f'{w} {id} density units',lambda:must(page.locator('#F6-11 .f611-aside').inner_text().find('kg/L')!=-1,'unit missing'))
   test(f'{w} {id} graph source',lambda:must('MASS–VOLUME GRAPH' in page.locator('#F6-11 .f611-svg').first.text_content(),'mislabelled graph'))
   test(f'{w} {id} no horizontal overflow',lambda:must(page.evaluate('document.documentElement.scrollWidth<=innerWidth+3'),'overflow'))
  page.close()
 b.close()
res={'suite':'responsive-layout','passed':len(ok),'total':len(ok)+len(bad),'failures':bad,'widths':[380,430,768,1280]};(root/'tests/f611-layout-results.json').write_text(json.dumps(res,indent=2));print('LAYOUT',res['passed'],'/',res['total']);sys.exit(bool(bad))
