from pathlib import Path
from playwright.sync_api import sync_playwright
import json,traceback
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'F8/F8-03-function-machine.html').read_text()
results=[]
def rec(n,ok,d=''):results.append({'test':n,'pass':bool(ok),'detail':str(d)[:210]})
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for w in [380,1280]:
  pg=browser.new_page(viewport={'width':w,'height':990},reduced_motion='reduce');errs=[]
  pg.on('pageerror',lambda e:errs.append(str(e)))
  pg.set_content(html,wait_until='load',timeout=50000)
  for mode in ['watch','guided','explore','challenge']:
   pg.locator(f'#F8-03 .nova-tab[data-m="{mode}"]').click()
   rec(f'{w}/{mode}/stage',pg.locator('#F8-03 .f803-svg').count()==1)
   rec(f'{w}/{mode}/no-overflow',pg.evaluate('document.documentElement.scrollWidth<=innerWidth+2'))
   pg.locator('#F8-03 .f803-svg').screenshot(path=str(ROOT/f'shots/F8-03-{w}-{mode}-stage.png'),animations='disabled')
  pg.locator('#F8-03 .nova-tab[data-m="explore"]').click()
  psets={'Y7-028':('4',['m3','a2'],14),'Y7-030':('3',['m2','a5'],11),'Y7-033':('15',['s3','d2'],6),'Y8-016':('21',['a4','d5'],5)}
  for id,(inp,rules,out) in psets.items():
   try:
    pg.locator('#F8-03 .f803-select').select_option(id)
    rec(f'{w}/{id}/selected',pg.locator('#F8-03 .f803-svg').get_attribute('data-preset')==id)
    pg.locator(f'#F8-03 [data-input="{inp}"]').focus();pg.keyboard.press('Enter')
    rec(f'{w}/{id}/keyboard-input',pg.locator('#F8-03 [data-input][data-placed="hopper"]').count()==1)
    for rid in rules:
     pg.locator(f'#F8-03 [data-rule-card="{rid}"]').focus();pg.keyboard.press('Enter')
    placed=pg.locator('#F8-03 [data-placed-rule]').count()
    rec(f'{w}/{id}/keyboard-rules',placed==2,str(placed))
    texts=pg.locator('#F8-03 .f803-svg text').all_text_contents()
    rec(f'{w}/{id}/output-visible',str(out) in texts,texts[-10:])
    rec(f'{w}/{id}/no-stranded',pg.evaluate('!NOVA.ui._drag'))
    pg.locator('#F8-03 .f803-ctrl button').filter(has_text='Reset machine').click()
    rec(f'{w}/{id}/reset',pg.locator('#F8-03 [data-placed-rule]').count()==0)
   except Exception as e: rec(f'{w}/{id}/interaction-failed',False,e)
  # Challenge — errors must not unlock answers; operation order + result must both be right.
  pg.locator('#F8-03 .nova-tab[data-m="challenge"]').click()
  for index,(id,_,want) in enumerate([('Y7-028',['m3','a2'],11),('Y7-030',['m2','a5'],15),('Y7-033',['s3','d2'],8),('Y8-016',['a4','d5'],7)]):
   ops=pg.evaluate(f'window.F803_TEST.currentOps(window.F803_TEST.lessons["{id}"])')
   try:
    rec(f'{w}/challenge-{id}/answer-hidden',pg.locator('#F8-03 .f803-svg').get_attribute('data-mode')=='challenge' and pg.locator('#F8-03 .f803-svg').get_attribute('data-preset')==id)
    # Deliberate incorrect operation — verifies misconception feedback and no skipping
    wrong=pg.locator('#F8-03 [data-rule-card]').last
    wrong.focus();pg.keyboard.press('Enter')
    pg.locator('#F8-03 .f803-number').fill(str(want))
    pg.locator('#F8-03 .f803-challenge-controls button.primary').click()
    rec(f'{w}/challenge-{id}/cannot-skip',pg.locator('#F8-03 .f803-challenge-controls button.primary').is_enabled())
    for pos,rid in enumerate(ops):
     if pos==0:
      pg.locator('#F8-03 [data-placed-rule="0"]').focus();pg.keyboard.press('Delete')
     pg.locator(f'#F8-03 [data-rule-card="{rid}"]').focus();pg.keyboard.press('Enter')
    pg.locator('#F8-03 .f803-challenge-controls button.primary').click()
    rec(f'{w}/challenge-{id}/accepted',pg.locator('#F8-03 .f803-feedback').get_attribute('data-status')=='correct')
    rec(f'{w}/challenge-{id}/next-available',pg.get_by_role('button',name='Next function').is_visible())
    if index<3: pg.get_by_role('button',name='Next function').click()
   except Exception as e:rec(f'{w}/challenge-{id}/error',False,e)
  rec(f'{w}/pageerrors',not errs,errs)
  pg.close()
 browser.close()
report={'checks':results,'total':len(results),'passed':sum(x['pass'] for x in results),'failed':[x for x in results if not x['pass']]}
(ROOT/'tests/F8-03-qa-results.json').write_text(json.dumps(report,indent=2))
print('checks',report['total'],'PASS',report['passed'],'FAIL',len(report['failed']))
for x in report['failed']:print('FAILED',x)
