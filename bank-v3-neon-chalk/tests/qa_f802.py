#!/usr/bin/env python3
"""F8-02 integration QA: live Chromium at mobile and desktop in all four NOVA modes."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json
ROOT=Path(__file__).resolve().parents[1];HTML=(ROOT/'F8/F8-02-inverse-operations-flowchart.html').read_text()
checks=[]
def rec(name,ok,detail=''):
 checks.append(dict(test=name,passed=bool(ok),detail=str(detail)[:200]))
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for w in (380,1280):
  pg=browser.new_page(viewport={'width':w,'height':1040},reduced_motion='reduce');err=[];pg.on('pageerror',lambda e:err.append(str(e)));pg.set_default_timeout(6000)
  pg.set_content(HTML,wait_until='load')
  rec(f'{w}/one shared engine',pg.locator('#F8-03').count()==1 and pg.evaluate('Object.keys(NOVA.engines).filter(x=>x.startsWith("F8-")).length')==1)
  rec(f'{w}/preset not standalone engine',pg.evaluate('!NOVA.engines["F8-02"] && !!NOVA.engines["F8-03"] && !!window.F802_TEST'))
  for mode in ('guided','watch','explore','challenge'):
   pg.locator(f'#F8-03 .nova-tab[data-m="{mode}"]').click()
   rec(f'{w}/{mode}/renderer',pg.locator('#F8-03 .f802-svg').count()==1)
   rec(f'{w}/{mode}/no horizontal overflow',pg.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
   pg.locator('#F8-03 .f802-svg').screenshot(path=str(ROOT/f'shots/F8-02-{w}-{mode}-stage.png'),animations='disabled')
  # Teaching state changes driven by original F8-03 timeline, with preset renderer.
  pg.locator('#F8-03 .nova-tab[data-m="guided"]').click()
  for i,expected in ((0,'?'),(2,'12'),(3,'6'),(4,'6')):
   pg.evaluate('(i)=>window.F803_ENGINE.timeline.go(i,"test")',i)
   t=pg.locator('#F8-03 .f802-svg text').all_text_contents()
   rec(f'{w}/guided/step-{i}',pg.locator('.f802-svg').get_attribute('data-step')==str(i) and expected in t)
  # Explore each preset with actual operation cards and keyboard equivalents.
  pg.locator('#F8-03 .nova-tab[data-m="explore"]').click()
  for ident,op1,op2,out,x in [('Y7-033','s3','d2',15,6),('Y8-016','a4','d5',21,5)]:
   pg.locator('#F8-03 .f802-select').select_option(ident)
   rec(f'{w}/explore/{ident}/preset',pg.locator('.f802-svg').get_attribute('data-preset')==ident)
   rec(f'{w}/explore/{ident}/input hidden initially',pg.locator('#F8-03 .f802-svg [data-placed="slot"]').count()==0 and 'Recovered input:' not in pg.locator('.f802-feedback').inner_text())
   for op in (op1,op2):
    pg.locator(f'#F8-03 [data-inverse-card="{op}"]').focus();pg.keyboard.press('Enter')
   rec(f'{w}/explore/{ident}/2 placed',pg.locator('#F8-03 [data-inverse-slot]').count()==2)
   rec(f'{w}/explore/{ident}/recovered',f'Recovered input: {x}' in pg.locator('.f802-feedback').inner_text())
   rec(f'{w}/explore/{ident}/drag clean',pg.evaluate('!NOVA.ui._drag'))
   pg.locator('#F8-03 [data-inverse-slot="1"]').focus();pg.keyboard.press('Delete')
   rec(f'{w}/explore/{ident}/keyboard delete',pg.locator('#F8-03 [data-inverse-slot]').count()==1)
   pg.locator(f'#F8-03 [data-inverse-card="{op2}"]').focus();pg.keyboard.press('Enter')
   rec(f'{w}/explore/{ident}/re-place',pg.locator('#F8-03 [data-inverse-slot]').count()==2)
   pg.locator('#F8-03 .f802-number').fill(str(out+4));pg.locator('#F8-03 .f802-number').press('Tab')
   rec(f'{w}/explore/{ident}/known-output-edit',f'Recovered input: ' in pg.locator('.f802-feedback').inner_text())
   pg.get_by_role('button',name='Reset inverse route').click()
   rec(f'{w}/explore/{ident}/reset',pg.locator('#F8-03 [data-inverse-slot]').count()==0)
  # Challenge: wrong operation and wrong number must be rejected independently.
  pg.locator('#F8-03 .nova-tab[data-m="challenge"]').click()
  for index,ident in enumerate(('Y7-033','Y8-016')):
   cfg=pg.evaluate('(id)=>window.F802_TEST.presets[id]',ident)
   rec(f'{w}/challenge/{ident}/answer hidden',pg.locator('#F8-03 [data-inverse-slot]').count()==0 and pg.locator('#F8-03 .f802-number').input_value()=='')
   pg.locator(f'#F8-03 [data-inverse-card="{cfg["forward"][1]}"]').focus();pg.keyboard.press('Enter')
   pg.locator('#F8-03 .f802-number').fill(str(cfg['challengeX']))
   pg.get_by_role('button',name='Check inverse steps').click()
   rec(f'{w}/challenge/{ident}/wrong operation blocked',pg.get_by_role('button',name='Check inverse steps').is_enabled())
   pg.locator('#F8-03 [data-inverse-slot="0"]').focus();pg.keyboard.press('Delete')
   for op in cfg['inverse']:
    pg.locator(f'#F8-03 [data-inverse-card="{op}"]').focus();pg.keyboard.press('Enter')
   pg.locator('#F8-03 .f802-number').fill(str(cfg['challengeX']+1))
   pg.get_by_role('button',name='Check inverse steps').click()
   rec(f'{w}/challenge/{ident}/wrong number blocked',pg.get_by_role('button',name='Check inverse steps').is_enabled())
   pg.locator('#F8-03 .f802-number').fill(str(cfg['challengeX']))
   pg.get_by_role('button',name='Check inverse steps').click()
   rec(f'{w}/challenge/{ident}/accepted',pg.locator('#F8-03 .f802-feedback').get_attribute('data-status')=='correct')
   rec(f'{w}/challenge/{ident}/no stranded drag',pg.evaluate('!NOVA.ui._drag'))
   if index==0: pg.get_by_role('button',name='Next reverse challenge').click()
  rec(f'{w}/no page errors',not err,err)
  pg.close()
 browser.close()
result={'total':len(checks),'passed':sum(x['passed'] for x in checks),'failed':[x for x in checks if not x['passed']],'checks':checks}
(ROOT/'tests/F8-02-browser-results.json').write_text(json.dumps(result,indent=2));print('BROWSER',result['passed'],'/',result['total'],'failed',len(result['failed']))
for x in result['failed']:print('FAIL',x)
