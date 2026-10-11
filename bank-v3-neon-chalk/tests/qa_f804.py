#!/usr/bin/env python3
"""Browser and UI acceptance, real Chromium 380 / 1280, all four modes and three algebra variations."""
from playwright.sync_api import sync_playwright
from pathlib import Path
import json
R=Path(__file__).resolve().parents[1];HTML=(R/'F8/F8-04-two-way-function-machine.html').read_text(encoding='utf8')
checks=[]
def rec(name,ok,details=''):checks.append({'test':name,'passed':bool(ok),'details':str(details)[:180]})
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for w in (380,1280):
  p=b.new_page(viewport={'width':w,'height':1040},reduced_motion='reduce');p.set_default_timeout(7500)
  errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
  p.set_content(HTML,wait_until='load',timeout=60000)
  rec(f'{w}/only-F8-03-registered',p.evaluate('Object.keys(NOVA.engines).filter(k=>k.startsWith("F8-")).length === 1 && !!NOVA.engines["F8-03"] && !NOVA.engines["F8-04"]'))
  rec(f'{w}/F8-04-preset-loaded',p.evaluate('!!F804_TEST && Object.keys(F804_TEST.presets).length === 3'))
  for mode in ['guided','watch','explore','challenge']:
   p.locator(f'#F8-03 .nova-tab[data-m="{mode}"]').click()
   rec(f'{w}/{mode}/svg-present',p.locator('#F8-03 .f804-svg').count()==1)
   rec(f'{w}/{mode}/mode-tied-to-render',p.locator('.f804-svg').get_attribute('data-mode')==mode)
   rec(f'{w}/{mode}/no-horizontal-page-overflow',p.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'))
   p.locator('.f804-svg').screenshot(path=str(R/f'shots/F8-04-{w}-{mode}-stage.png'),animations='disabled',timeout=15000)
  p.locator('#F8-03 .nova-tab[data-m="guided"]').click()
  for step in range(6):
   p.evaluate('(step)=>window.F803_ENGINE.timeline.go(step,"test")',step)
   rec(f'{w}/guided/step-{step}',p.locator('.f804-svg').get_attribute('data-step')==str(step))
  rec(f'{w}/guided/last-step-mathematical-answer',p.locator('.f804-svg').get_attribute('data-verified')=='true')
  p.locator('#F8-03 .nova-tab[data-m="explore"]').click()
  for key,ops,challenge_in in [('Y8-016',['m5','s4','a4','d5'],7),('Y8-016-b',['m2','a3','s3','d2'],8),('Y8-016-c',['a4','m5','d5','s4'],3)]:
   p.locator('.f804-select').select_option(key)
   rec(f'{w}/explore/{key}/new-preset',p.locator('.f804-svg').get_attribute('data-preset')==key)
   rec(f'{w}/explore/{key}/starts-empty',p.locator('[data-rule-slot]').count()==0)
   for op in ops:
    p.locator(f'[data-rule-card="{op}"]').first.focus();p.keyboard.press('Enter')
   rec(f'{w}/explore/{key}/all-four-placed',p.locator('[data-rule-slot]').count()==4)
   rec(f'{w}/explore/{key}/mathematical-composition-recovered',p.locator('.f804-svg').get_attribute('data-verified')=='true')
   rec(f'{w}/explore/{key}/feedback-explains', 'Both routes agree' in p.locator('.f804-feedback').inner_text())
   rec(f'{w}/explore/{key}/drag-clean',p.evaluate('!NOVA.ui._drag'))
   p.locator('[data-rule-slot="3"]').focus();p.keyboard.press('Delete')
   rec(f'{w}/explore/{key}/keyboard-removal',p.locator('[data-rule-slot]').count()==3)
   p.locator(f'[data-rule-card="{ops[3]}"]').focus();p.keyboard.press('4')
   rec(f'{w}/explore/{key}/keyboard-replace-specific-slot',p.locator('[data-rule-slot]').count()==4)
   p.get_by_role('button',name='Reset all four machines').click()
   rec(f'{w}/explore/{key}/reset',p.locator('[data-rule-slot]').count()==0)
  # Alternate numerical inputs prove the machine is truly parameterized rather than a fixed screenshot.
  p.locator('.f804-select').select_option('Y8-016')
  p.locator('.f804-number').fill('-3');p.locator('.f804-number').press('Tab')
  for op in ('m5','s4','a4','d5'):
   p.locator(f'[data-rule-card="{op}"]').first.focus();p.keyboard.press('Enter')
  rec(f'{w}/negative-input/-3', 'output -19, recovered input -3' in p.locator('.f804-feedback').inner_text().lower())
  p.locator('#F8-03 .nova-tab[data-m="challenge"]').click()
  for i,key in enumerate(['Y8-016','Y8-016-b','Y8-016-c']):
   cfg=p.evaluate('(k)=>F804_TEST.presets[k]',key)
   rec(f'{w}/challenge/{key}/answer-hidden',p.locator('.f804-svg').get_attribute('data-verified')=='false' and p.locator('.f804-number').first.input_value()=='')
   p.locator(f'[data-rule-card="{cfg["inverse"][0]}"]').focus();p.keyboard.press('Enter')
   for op in cfg['forward'][1:]+cfg['inverse']:
    p.locator(f'[data-rule-card="{op}"]').focus();p.keyboard.press('Enter')
   p.get_by_role('button',name='Check both routes').click()
   rec(f'{w}/challenge/{key}/wrong-order-rejected',p.locator('.f804-feedback').get_attribute('data-status')=='wrong')
   p.locator('[data-rule-slot="0"]').focus();p.keyboard.press('Delete')
   p.locator(f'[data-rule-card="{cfg["forward"][0]}"]').focus();p.keyboard.press('1')
   x=cfg['challengeInput'];out=p.evaluate('([x,k])=>F804_TEST.math.chain(x,F804_TEST.presets[k].forward)',[x,key])
   p.locator('input[aria-label="Forward output y"]').fill(str(out+1))
   p.locator('input[aria-label="Recovered input x"]').fill(str(x))
   p.get_by_role('button',name='Check both routes').click()
   rec(f'{w}/challenge/{key}/incorrect-answer-rejected',p.locator('.f804-feedback').get_attribute('data-status')=='wrong')
   p.locator('input[aria-label="Forward output y"]').fill(str(out))
   p.get_by_role('button',name='Check both routes').click()
   rec(f'{w}/challenge/{key}/correct-accepted',p.locator('.f804-feedback').get_attribute('data-status')=='correct')
   rec(f'{w}/challenge/{key}/drag-clean',p.evaluate('!NOVA.ui._drag'))
   if i<2:p.get_by_role('button',name='Next two-way function').click()
  rec(f'{w}/no-js-page-errors',not errors,errors)
  p.close()
 b.close()
summary={'total':len(checks),'passed':sum(x['passed'] for x in checks),'failed':[x for x in checks if not x['passed']],'checks':checks}
(R/'tests/F8-04-browser-results.json').write_text(json.dumps(summary,indent=2))
print('BROWSER',summary['passed'],'/',summary['total'],'failed',len(summary['failed']))
for x in summary['failed']:print('FAIL',x)
