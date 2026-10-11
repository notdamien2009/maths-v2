import json,sys
from pathlib import Path
from playwright.sync_api import sync_playwright
r=Path(__file__).resolve().parents[1];html=(r/'F6/F6-08-direct-proportion-GALLERY-PREVIEW.html').read_text();good=[];bad=[]
def t(name,ok):
 (good if ok else bad).append(name)
 if not ok:print('FAIL',name)
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu'])
 for width in [380,1280]:
  page=b.new_page(viewport={'width':width,'height':900});page.set_content(html);page.wait_for_timeout(140)
  for mode in ['watch','guided','explore','challenge']:
   page.locator(f'#F6-08 [data-m="{mode}"]').click();page.wait_for_timeout(55)
   res=page.evaluate(r'''()=>{
    const svg=document.querySelector('#F6-08 svg.f608-svg'),plot=svg.querySelector('.nv-plot'),eq=svg.querySelector('[data-layout=equation]'),co=svg.querySelector('[data-layout=coordinate]'),head=svg.querySelector('[data-layout=table-heading]');
    if(!svg||!plot||!eq||!head)return {missing:true};
    const e=eq.getBBox(),h=head.getBBox(),c=co?.getBBox(),ys=[...plot.querySelectorAll('text')].map(x=>x.getBBox().y+x.getBBox().height);
    const plotBottom=Math.max(...ys);const st=svg.getAttribute('viewBox').split(/\s+/).map(Number);
    const stage=svg.getBoundingClientRect();
    return {missing:false,eqCoordClear:!c||c.y>=e.y+e.height+7||c.x>=e.x+e.width+8||c.x+c.width<=e.x-8,tableClear:st[2]<600?h.y>=plotBottom+15:h.x>=plot.getBBox().x+plot.getBBox().width+8,tableInStage:h.y+h.height<st[3]-90,widthClear:stage.width<=innerWidth+1,headingInStage:h.x>=0&&h.x+h.width<st[2],stageHeight:stage.height,box:st};
    }''')
   t(f'{width} {mode} geometry found',not res.get('missing'))
   for key in ['eqCoordClear','tableClear','tableInStage','widthClear','headingInStage']:
    t(f'{width} {mode} {key}',bool(res.get(key)))
   # All 4 modes must support reduced motion without infinite animations.
   t(f'{width} {mode} reduced motion declared','@media(prefers-reduced-motion:reduce)' in (r/'src/F6-08.css').read_text())
  if width==380:
   page.locator('#F6-08 [data-m="explore"]').click();page.wait_for_timeout(65)
   for name in ['Y8-035','Y8-036','Y9-020']:
    page.evaluate('(name)=>F608_PREVIEW.config._explore.setPreset(name)',name)
    dim=page.evaluate(r'''()=>{const s=document.querySelector('#F6-08 svg.f608-svg'),p=s.querySelector('.nv-plot'),h=s.querySelector('[data-layout=table-heading]').getBBox();return {tableY:h.y,axisBottom:Math.max(...[...p.querySelectorAll('text')].map(e=>{const b=e.getBBox();return b.y+b.height;}))}}''')
    t('380 '+name+' table below plotted axis',dim['tableY']>dim['axisBottom']+15)
  page.close()
 b.close()
out={'suite':'layout','passed':len(good),'total':len(good)+len(bad),'failures':bad,'widths':[380,1280],'measure':'SVG text bounding boxes, table/axis separation, equation/coordinate separation, mobile overflow'}
(r/'tests/f608-layout-results.json').write_text(json.dumps(out,indent=2));print('LAYOUT',out['passed'],'/',out['total']);sys.exit(1 if bad else 0)
