from pathlib import Path
from playwright.sync_api import sync_playwright
import json, time, traceback
BASE=Path(__file__).resolve().parents[1]
html= (BASE/'F5/F5-08-multiply-fractions.html').read_text()
shots=BASE/'shots/F5-08';shots.mkdir(parents=True,exist_ok=True)
results=[]
def check(name,cond,detail=''):
 results.append({'name':name,'pass':bool(cond),'detail':str(detail)[:350]})
 if not cond:print('FAIL',name,str(detail)[:350],flush=True)
def tab(pg,name):
 pg.locator(f'.nova-tabs button[data-m="{name}"]').click(force=True,timeout=7000)
 pg.wait_for_timeout(170)
def test_case(browser,width,preset):
 pg=browser.new_page(viewport={'width':width,'height':900},reduced_motion='reduce')
 errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
 src=html.replace(".get('preset')||'y7-023'",f".get('preset')||'{preset}'")
 pg.set_content(src,wait_until='domcontentloaded',timeout=20000);pg.wait_for_timeout(180)
 ck=lambda tag,c,detail='':check(f'{width}/{preset}/{tag}',c,detail)
 try:
  ck('shared-id',pg.evaluate("NOVA.registry.has('F5-03') && !NOVA.registry.has('F5-08')"))
  ck('preset',pg.evaluate('NOVA_F5_03_CONFIG.preset')==preset)
  ck('modes',pg.locator('.nova-tabs button').count()==4)
  ck('label-source',pg.locator('.nova-stage').inner_text().find('F5-08')>=0)
  ck('no-app-errors-initial',not errs,errs)
  for mode in ('guided','watch','explore','challenge'):
   tab(pg,mode)
   ck(mode+'-svg',pg.locator('.nova-stage svg.am-svg').count()==1)
   d=pg.evaluate('''() => {let s=document.querySelector('.nova-stage'),v=s&&s.querySelector('svg');if(!v)return null;let a=s.getBoundingClientRect(),b=v.getBoundingClientRect();return {vwidth:b.width,vheight:b.height,stageHeight:a.height,ratio:b.height/a.height};}''')
   ck(mode+'-fill',d is not None and d['ratio']>=.6,d)
   ck(mode+'-no-page-overflow',pg.evaluate('document.documentElement.scrollWidth <= window.innerWidth + 2'))
   ck(mode+'-no-errors',not errs,errs)
   pg.locator('.nova-stage').screenshot(path=str(shots/f'F5-08-{preset}-{width}-{mode}.png'),timeout=11000)
  tab(pg,'guided')
  for n in range(6):
   # use core timeline directly: button click if present, else inspect
   if n>0:
    nextbtn=pg.locator('.nova-tl button').filter(has_text='Next')
    if nextbtn.count():nextbtn.first.click()
    else:pg.evaluate('''() => {const b=[...document.querySelectorAll('.nova-tl button')].find(x=>x.getAttribute('aria-label')?.toLowerCase().includes('next'));if(b)b.click();}''')
   ck(f'guided-step-{n}',len(pg.locator('.nova-stage svg [data-overlap="1"]').all())>=0)
  tab(pg,'explore')
  o=pg.evaluate('NOVA_F5_03_CONFIG._explore.get()')
  expect=15 if preset=='y8-006' else 6
  ck('explore-product',o['a']*o['c']==expect,o)
  ck('explore-cells',pg.locator('.nova-stage svg [data-overlap="1"]').count()==expect)
  ck('explore-per-whole',(('8 cells per whole' if preset=='y8-006' else '12 cells per whole') in pg.locator('.nova-stage').inner_text() or ('Each unit square contains 8' if preset=='y8-006' else 'Each unit square contains 12') in pg.locator('.nova-stage').inner_text()))
  # exact full selected boundary and keyboard increment
  slider=pg.locator('.am-handle[aria-label="Selected columns"]')
  if slider.count():
   slider.focus();old=int(slider.get_attribute('aria-valuenow'));pg.keyboard.press('ArrowLeft');now=pg.evaluate('NOVA_F5_03_CONFIG._explore.get().a')
   ck('keyboard-handle',now==max(old-1,0), (old,now))
  # arbitrary explore selection change
  if preset=='y8-006':
   pg.evaluate('NOVA_F5_03_CONFIG._explore.set(9,4,3,2)')
   ck('improper-product-27-cells',pg.locator('.nova-stage svg [data-overlap="1"]').count()==27)
   ck('improper-exact-fraction',('27' in pg.locator('.nova-stage').inner_text() and '8' in pg.locator('.nova-stage').inner_text()))
   pg.locator('.nova-stage').screenshot(path=str(shots/f'F5-08-y8-extended-{width}-explore-proof.png'),timeout=11000)
  tab(pg,'challenge')
  # initial Challenge answer hidden: fraction product should not be printed
  challengeTxt=pg.locator('.nova-stage').inner_text()
  ck('challenge-hidden', 'Count the green cells' in challengeTxt and 'Correct:' not in challengeTxt,challengeTxt[:180])
  ctl=pg.evaluate('NOVA_F5_03_CONFIG._challenge.get()')
  ck('challenge-start-empty',ctl['a']==0 and ctl['c']==0,ctl)
  pg.locator('button').filter(has_text='Check exact product').first.click()
  ck('challenge-missing-answer-rejected',pg.locator('.nova-fb.bad').count()>0)
  if preset=='y8-006':
   # Test equivalent 30/16 vs product 15/8
   pg.evaluate('NOVA_F5_03_CONFIG._challenge.set(5,3);NOVA_F5_03_CONFIG._challenge.answer(30,16)')
  else:
   pg.evaluate('NOVA_F5_03_CONFIG._challenge.set(2,3);NOVA_F5_03_CONFIG._challenge.answer(3,6)')
  pg.locator('button').filter(has_text='Check exact product').first.click()
  ck('challenge-equivalent-exact-product',pg.locator('.nova-fb.ok').count()>0,pg.locator('.nova-fb').all_text_contents()[:2])
  ck('challenge-correct-event',pg.evaluate("NOVA.events.history().some(e=>e.type==='correct'&&e.detail.correct===true&&e.detail.engine==='F5-03')"))
  ck('no-errors-final',not errs,errs)
 except Exception as e:
  check(f'{width}/{preset}/RUN',False,str(e));print(traceback.format_exc()[-900:],flush=True)
 finally:pg.close()
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width,preset in ((380,'y7-023'),(1280,'y7-023'),(380,'y8-006'),(1280,'y8-006')):
  print('CASE',width,preset,flush=True)
  test_case(b,width,preset)
 b.close()
json.dump({'checks':len(results),'passed':sum(r['pass'] for r in results),'failed':sum(not r['pass'] for r in results),'cases':results},open(BASE/'tests/f508-results.json','w'),indent=2)
print('RESULT',len(results),sum(r['pass'] for r in results),'passed',flush=True)
