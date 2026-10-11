from pathlib import Path
from playwright.sync_api import sync_playwright
import json,traceback
html=Path('/mnt/data/f9_work/F9-01-matchstick-pattern-builder.html').read_text()
root=Path('/mnt/data/f9_work');shots=root/'shots';shots.mkdir(exist_ok=True)
results=[]
def report(name,ok,detail=''):
 print(('PASS ' if ok else 'FAIL ')+name+' '+str(detail)[:250]);results.append(dict(name=name,ok=bool(ok),detail=str(detail)[:900]));
def mode(p,k):p.locator(f'#F9-01 .nova-tab[data-m="{k}"]').click();p.wait_for_timeout(60)
def find(p,selector):return p.locator(selector)
with sync_playwright() as sp:
 b=sp.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox']);
 for width in [1280,380]:
  p=b.new_page(viewport=dict(width=width,height=900),reduced_motion='reduce');errors=[]
  p.on('pageerror',lambda e: errors.append(str(e)))
  p.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
  p.set_default_timeout(3500);p.set_content(html,wait_until='domcontentloaded',timeout=18000);p.wait_for_timeout(100)
  rootE=find(p,'#F9-01');report(f'{width} mounted',rootE.count()==1)
  report(f'{width} NOVA chalk', 'NOVA Chalk' in p.evaluate("getComputedStyle(document.querySelector('#F9-01 .f901-maths')).fontFamily"))
  report(f'{width} 4 modes',len(find(p,'#F9-01 .nova-tab').all())==4)
  report(f'{width} no page horizontal overflow',p.evaluate('document.documentElement.scrollWidth<=innerWidth'),p.evaluate('({pageWidth:document.documentElement.scrollWidth,viewport:innerWidth})'))
  report(f'{width} image alternatives',p.evaluate("[...document.querySelectorAll('#F9-01 img')].every(x=>!!x.alt.trim())"))
  for i in range(6):
   p.evaluate(f"NOVA.engines['F9-01'].timeline.pause();NOVA.engines['F9-01'].timeline.go({i},'QA');")
   p.wait_for_timeout(80)
   p.locator('#F9-01 .nova-stage').screenshot(path=str(shots/f'F9-01-{width}-watch-step{i+1}.png'))
   st=p.locator('#F9-01 .nova-stage')
   t=st.locator('.f901-card').first.inner_text()
   report(f'{width} watch step {i+1}',str(3*([1,2,3,3,4,4][i])+1) in t,t)
  for k in ['guided','explore','challenge']:
   mode(p,k);p.locator('#F9-01 .nova-stage').screenshot(path=str(shots/f'F9-01-{width}-{k}.png'))
   report(f'{width} {k} stage present',find(p,'#F9-01 .f901-stage .f901-svg').count()==1)
  mode(p,'explore');slider=find(p,'#F9-01 .nova-panel input[type=range]');slider.fill('7');report(f'{width} explore 7 -> 22', '22' in find(p,'#F9-01 .nova-panel output').inner_text(),find(p,'#F9-01 .nova-panel output').inner_text());slider.fill('1');report(f'{width} explore 1 -> 4','4 sticks' in find(p,'#F9-01 .nova-panel output').inner_text())
  mode(p,'challenge')
  try:
   p.get_by_role('button',name='Check pattern').click()
   report(f'{width} wrong empty construction rejected','missing sticks' in find(p,'#F9-01 .nova-fb.bad').last.inner_text().lower())
  except Exception as e:report(f'{width} wrong construction check',False,e)
  try:
   # Drag top tray stick onto its target: should register one added stick.
   src=find(p,'#F9-01 [data-tray="top"]');dst=find(p,'#F9-01 [data-slot="top"]')
   p.evaluate("document.querySelector('#F9-01 .nova-stage').scrollIntoView({block:'start',behavior:'instant'})");p.wait_for_timeout(100);bb=src.bounding_box();tt=dst.bounding_box(); sx=bb['x']+bb['width']/2;sy=bb['y']+bb['height']/2;tx=tt['x']+tt['width']/2;ty=tt['y']+tt['height']/2
   print('DRAGCOORD',width,round(sx),round(sy),round(tx),round(ty),'scroll',p.evaluate('scrollY'));p.mouse.move(sx,sy);p.mouse.down();p.mouse.move(tx,ty,steps=12);p.mouse.up();p.wait_for_timeout(600)
   report(f'{width} drag top stick valid',find(p,'#F9-01 [data-placed="top"]').count()==1,find(p,'#F9-01 .f901-card').nth(1).inner_text())
  except Exception as e:report(f'{width} drag top stick valid',False,traceback.format_exc()[-1000:])
  try:
   # keyboard direct dashed-gap handler
   dst=find(p,'#F9-01 [data-slot="right"]');dst.focus();p.keyboard.press('Enter');p.wait_for_timeout(100)
   report(f'{width} keyboard place right',find(p,'#F9-01 [data-placed="right"]').count()==1)
  except Exception as e:report(f'{width} keyboard place right',False,e)
  try:
   p.get_by_role('button',name='Place bottom').click();p.wait_for_timeout(100)
   report(f'{width} add bottom',find(p,'#F9-01 [data-placed="bottom"]').count()==1)
   p.get_by_role('button',name='Check pattern').click();p.wait_for_timeout(100)
   report(f'{width} first task accepted',find(p,'#F9-01 .nova-fb.ok').count()>0)
   p.get_by_role('button',name='Continue to challenge 2').click();p.get_by_role('spinbutton',name='Number of sticks in stage 5').fill('20');p.get_by_role('button',name='Check answer').click();report(f'{width} reject +4 misconception', 'shares' in find(p,'#F9-01 .nova-fb.bad').last.inner_text().lower())
   p.get_by_role('spinbutton',name='Number of sticks in stage 5').fill('16');p.get_by_role('button',name='Check answer').click();p.get_by_role('button',name='Continue to challenge 3').click()
   p.get_by_role('spinbutton',name='Number of sticks in stage 7').fill('21');p.get_by_role('button',name='Check answer').click();report(f'{width} reject missing +1', 'starting side' in find(p,'#F9-01 .nova-fb.bad').last.inner_text().lower())
   p.get_by_role('spinbutton',name='Number of sticks in stage 7').fill('22');p.get_by_role('button',name='Check answer').click();report(f'{width} 3/3 achieved','3 / 3' in find(p,'#F9-01 .nova-panel').inner_text())
  except Exception as e:report(f'{width} challenge progression',False,traceback.format_exc()[-1250:])
  report(f'{width} browser errors',not errors,errors[:8])
  p.close()
 b.close()
(root/'F9-01-qa-results.json').write_text(json.dumps({'checks':len(results),'passes':sum(x['ok'] for x in results),'fails':[x for x in results if not x['ok']],'results':results},indent=2))
print('RESULT',len(results),'checks',sum(x['ok'] for x in results),'passes',sum(not x['ok'] for x in results),'fails')
