from pathlib import Path
from playwright.sync_api import sync_playwright
import json
BASE=Path(__file__).resolve().parents[1]
html=(BASE/'F8/F8-01-step-by-step-working-animator.html').read_text()
results=[]
def rec(name, passed, detail=''):
 results.append({'name':name,'pass':bool(passed),'detail':str(detail)[:180]})
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for width in (380,1280):
  page=browser.new_page(viewport={'width':width,'height':960},reduced_motion='reduce')
  errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(html,wait_until='load')
  page.locator('#F8-01 .nova-tab[data-m="explore"]').click()
  page.wait_for_timeout(100)
  opts=['Y7-018','Y8-011','Y8-012','Y8-015']
  for id in opts:
   page.locator('#F8-01 .f801-select').select_option(id)
   rec(f'{width}/{id}/preset-visible',page.locator('#F8-01 .f801-svg').get_attribute('data-preset')==id)
   try:
    pill=page.locator('#F8-01 .f801-pill[role="button"]').first
    pill.focus();page.keyboard.press('Enter')
    rec(f'{width}/{id}/keyboard-operates',page.locator('#F8-01 .f801-interact-feedback').get_attribute('data-status')=='correct')
    undo=page.get_by_role('button',name='Undo previous step')
    undo.click()
    rec(f'{width}/{id}/undo',page.locator('#F8-01 .f801-interact-feedback').get_attribute('data-status')!='wrong' and not undo.is_enabled())
   except Exception as e:rec(f'{width}/{id}/keyboard',False,e)
  page.locator('#F8-01 .f801-select').select_option('Y7-018')
  # real pointer movement and regrab; the component uses the F0 SVG drag engine
  try:
   first=page.locator('#F8-01 .f801-pill[role="button"]').first
   page.evaluate("""()=>{const el=document.querySelector('#F8-01 .nova-stage');window.scrollTo(0,el.getBoundingClientRect().top+window.scrollY-72)}""")
   fb=first.bounding_box()
   slot=page.locator('#F8-01 .nv-neon-box').filter(has=page.locator('text')).count() # non-operative tally
   svg=page.locator('#F8-01 .f801-svg')
   point=page.evaluate("""()=>{const s=document.querySelector('#F8-01 .f801-svg');const v=s.viewBox.baseVal;const rect=s.getBoundingClientRect();const mobile=innerWidth<=760; const x=mobile?285:825,y=mobile?178+58:174+58;return {x:rect.x+x/v.width*rect.width,y:rect.y+y/v.height*rect.height};}""")
   page.mouse.move(fb['x']+fb['width']/2,fb['y']+fb['height']/2)
   page.mouse.down()
   page.mouse.move(point['x'],point['y'],steps=12)
   page.mouse.up()
   page.wait_for_timeout(150)
   rec(f'{width}/real-drag-drop',page.locator('#F8-01 .f801-interact-feedback').get_attribute('data-status')=='correct')
   rec(f'{width}/no-stranded-drag',page.evaluate('!window.NOVA.ui._drag'))
  except Exception as e:rec(f'{width}/drag',False,e)
  page.locator('#F8-01 .nova-tab[data-m="challenge"]').click()
  goodOptions=[['18 − 3 × 6','18 − 18','0'],['x² + 2x + 3x + 6','x² + (2 + 3)x + 6','x² + 5x + 6'],['6 × 2x + 6 × 3','6(2x + 3)','12x + 18 ≡ 6(2x + 3)'],['x ÷ 3 = 5','x = 15','15 ÷ 3 + 2 = 7']]
  for j,ans in enumerate(goodOptions):
   for k,target in enumerate(ans):
    try:
     first=page.locator('#F8-01 .f801-pill[role="button"]').first
     first.focus();page.keyboard.press('Enter')
     page.locator('#F8-01 .f801-answer').filter(has_text=target).first.click()
     page.locator('#F8-01 .f801-challenge-actions .primary').click()
     page.wait_for_timeout(430)
     text=page.locator('#F8-01 .f801-interact-feedback').inner_text()
     stageText=page.locator('#F8-01 .f801-challenge-header').inner_text()
     rec(f'{width}/challenge-{j}-{k}', (f'Step {k+2} of 3' in stageText if k<2 else ('All three steps verified' in text)),str(stageText)+' '+text)
    except Exception as e:rec(f'{width}/challenge-{j}-{k}',False,e)
   if j < len(goodOptions)-1:
    try:page.locator('#F8-01 .f801-challenge-actions button').filter(has_text='Next problem').click()
    except Exception as e:rec(f'{width}/challenge-next-{j}',False,e)
  rec(f'{width}/no-console-errors',not errors,errors)
  rec(f'{width}/no-overflow',page.evaluate('document.documentElement.scrollWidth<=window.innerWidth+2'))
  page.close()
 browser.close()
(BASE/'tests/stress-results.json').write_text(json.dumps(results,indent=2))
print('Checks:',len(results),'PASS',sum(r['pass'] for r in results),'FAIL',sum(not r['pass'] for r in results))
for r in results:
 if not r['pass']:print('FAIL',r)
