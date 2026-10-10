from playwright.sync_api import sync_playwright
from pathlib import Path
import json,sys
R=Path(__file__).resolve().parents[1];HTML=(R/'F5/F5-12-hundred-square-percentage-grid.html').read_text();SHOTS=R/'shots/F5';SHOTS.mkdir(parents=True,exist_ok=True)
res=[]
def ck(w,name,ok,detail=''):
 res.append(dict(width=w,test=name,pass_=bool(ok),detail=str(detail)[:250]));print('PASS' if ok else 'FAIL',w,name,str(detail)[:60],flush=True)
def mode(p,key):p.locator('#F5-12 .nova-tab[data-m="'+key+'"]').click(timeout=10000);p.wait_for_timeout(75)
def n(p):return p.evaluate('NOVA_F5_12_CONFIG._explore.get()')
def drag(p,start,end):
 a=p.locator('#F5-12 [data-cell="'+str(start)+'"] [data-hit]');a.scroll_into_view_if_needed();b=p.locator('#F5-12 [data-cell="'+str(end)+'"] [data-hit]');r=a.bounding_box();z=b.bounding_box();p.mouse.move(r['x']+r['width']/2,r['y']+r['height']/2);p.mouse.down();p.mouse.move(z['x']+z['width']/2,z['y']+z['height']/2,steps=17);p.mouse.up();p.wait_for_timeout(180)
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in (380,1280):
  p=b.new_page(viewport={'width':width,'height':990},reduced_motion='reduce');errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
  p.set_content(HTML,wait_until='domcontentloaded',timeout=45000);p.wait_for_timeout(60)
  ck(width,'engine mounted',p.locator('#F5-12 .pct-svg').count()==1)
  for tab in ('watch','guided','explore','challenge'):
   mode(p,tab);ck(width,tab+' renders',p.locator('#F5-12 [data-cell]').count()==100)
   p.locator('#F5-12 .nova-stage').screenshot(path=str(SHOTS/f'F5-12-{width}-{tab}.png'),timeout=20000)
  mode(p,'guided')
  for step in range(6):
   p.evaluate('(i)=>NOVA.engines["F5-12"].timeline.go(i,"qa")',step)
   ck(width,'six-stage teaching '+str(step),p.locator('#F5-12 [data-cell]').count()==100)
  mode(p,'explore');ck(width,'initial thirty-seven',n(p)==37)
  ck(width,'one keyboard tab stop',p.locator('#F5-12 [data-cell][tabindex="0"]').count()==1)
  ck(width,'one-hundred cells',p.locator('#F5-12 [data-cell]').count()==100)
  ck(width,'thirty-seven shaded exactly',p.locator('#F5-12 [data-cell][aria-selected="true"]').count()==37)
  # Pointer painting & deliberate erase across adjacent cells.
  drag(p,51,56);ck(width,'pointer drag paints multiple cells',n(p)>=42,n(p))
  drag(p,51,56);ck(width,'second drag erases',n(p)==37,n(p))
  # Keyboard roving position and cell toggles.
  p.locator('#F5-12 [data-cell="43"]').focus();p.keyboard.press('ArrowRight');
  ck(width,'roving focus follows chosen cell',p.evaluate('document.activeElement.getAttribute("data-cell")')=='44')
  p.keyboard.press('Space');ck(width,'keyboard Space paints',n(p)==38,n(p))
  p.keyboard.press('Enter');ck(width,'keyboard Enter erases',n(p)==37,n(p))
  p.keyboard.press('ArrowDown');ck(width,'arrow down moves one row',p.evaluate('document.activeElement.getAttribute("data-cell")')=='54')
  ck(width,'still only one grid tab stop',p.locator('#F5-12 [data-cell][tabindex="0"]').count()==1)
  # Manipulate the real shared-core svgDrag percent handle.
  target=p.locator('#F5-12 [data-pct-handle] .nv-hit');target.scroll_into_view_if_needed();a=target.bounding_box();x=a['x']+a['width']/2;y=a['y']+a['height']/2
  p.mouse.move(x,y);p.mouse.down();p.mouse.move(x+50,y,steps=12);p.mouse.up();p.wait_for_timeout(320)
  ck(width,'percentage slider real drag snaps',n(p)>37 and n(p)<=100,n(p))
  ck(width,'no stranded core drag',p.evaluate('NOVA.ui._drag===null'))
  for value in (0,1,13,25,50,62,75,100):
   p.evaluate('(n)=>NOVA_F5_12_CONFIG._explore.set(n,false)',value)
   ck(width,f'exact {value} shaded cells',p.locator('#F5-12 [data-cell][aria-selected="true"]').count()==value)
   ck(width,f'decimal {value}/100 correct',p.locator('#F5-12 .pct-svg').text_content().find(f'{value/100:.2f}')>=0)
  ck(width,'full area covers exactly 100',p.locator('#F5-12 [data-cell][aria-selected="true"]').count()==100)
  # Clear then fill & cascade controls.
  p.get_by_role('button',name='Clear',exact=True).click();ck(width,'clear button',n(p)==0)
  p.get_by_role('button',name='Fill all',exact=True).click();p.wait_for_timeout(45);ck(width,'fill all button',n(p)==100)
  mode(p,'challenge')
  ck(width,'challenge answer hidden',p.locator('#F5-12 .pct-svg').text_content().find('37%')==-1)
  p.get_by_role('button',name='Check answer',exact=True).click();ck(width,'blank challenge rejected',p.locator('#F5-12 .nova-fb.bad').count()==1)
  p.evaluate('NOVA_F5_12_CONFIG._challenge.setAnswer("37")');p.get_by_role('button',name='Check answer',exact=True).click();p.wait_for_timeout(630)
  ck(width,'challenge one accepted and advanced',p.evaluate('NOVA_F5_12_CONFIG._challenge.task()')==1)
  p.evaluate('NOVA_F5_12_CONFIG._challenge.setPaint(62)');p.get_by_role('button',name='Check answer',exact=True).click();p.wait_for_timeout(630)
  ck(width,'challenge two painting accepted',p.evaluate('NOVA_F5_12_CONFIG._challenge.task()')==2)
  p.evaluate('NOVA_F5_12_CONFIG._challenge.setAnswer("0.25")');p.get_by_role('button',name='Check answer',exact=True).click();
  ck(width,'challenge three decimal accepted',p.locator('#F5-12 .nova-fb.ok').count()==1)
  ck(width,'no page horizontal overflow',p.evaluate('document.documentElement.scrollWidth<=innerWidth'))
  ck(width,'no JavaScript runtime errors',not errors,errors)
  p.close()
 for width in (320,768):
  for reduce in ('reduce','no-preference'):
   p=b.new_page(viewport={'width':width,'height':990},reduced_motion=reduce);errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
   p.set_content(HTML,wait_until='domcontentloaded',timeout=45000)
   mode(p,'explore');ck(width,f'{reduce}: full hundred cells',p.locator('#F5-12 [data-cell]').count()==100)
   p.evaluate('NOVA_F5_12_CONFIG._explore.set(25,false)')
   ck(width,f'{reduce}: 25% fraction exact',p.locator('#F5-12 .pct-svg').text_content().find('Decimal form')>=0 and n(p)==25)
   ck(width,f'{reduce}: no horizontal overflow',p.evaluate('document.documentElement.scrollWidth<=innerWidth'))
   ck(width,f'{reduce}: no browser errors',not errors,errors)
   p.locator('#F5-12 .nova-stage').screenshot(path=str(SHOTS/f'F5-12-{width}-{reduce}-explore.png'),timeout=20000)
   p.close()
 b.close()
(R/'tests/f512-results.json').write_text(json.dumps(res,indent=2))
print('SUMMARY',sum(x['pass_'] for x in res),'/',len(res))
sys.exit(0 if all(x['pass_'] for x in res) else 1)
