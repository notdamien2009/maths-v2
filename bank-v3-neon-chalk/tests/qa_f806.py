"""F8-06 actual Chromium: four modes, 5 presets, wrong/correct challenge steps, keyboard and screenshot evidence."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json
R=Path(__file__).resolve().parents[1];src=(R/'F8/F8-06-rearranging-formulae.html').read_text()
checks=[]
def rec(name,ok,detail=''):checks.append({'test':name,'passed':bool(ok),'detail':str(detail)[:170]})
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for width in (380,1280):
  page=browser.new_page(viewport={'width':width,'height':950},reduced_motion='reduce');page.set_default_timeout(6000);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(src,wait_until='load')
  for mode in ('watch','guided','explore','challenge'):
   try:
    page.locator(f'#F8-06 .nova-tab[data-m="{mode}"]').click();page.wait_for_timeout(45)
    rec(f'{width}/{mode}/svg',page.locator('.f806-svg').count()==1)
    rec(f'{width}/{mode}/mascot',page.locator('#F8-06 img').count()>0)
    rec(f'{width}/{mode}/no-horizontal-overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth+3'))
    rec(f'{width}/{mode}/math-correct',page.locator('.f806-svg').get_attribute('data-maths-correct')=='true')
    page.locator('.f806-svg').screenshot(path=str(R/f'shots/F8-06-{width}-{mode}-stage.png'))
   except Exception as e:rec(f'{width}/{mode}/exception',False,e)
  try:
   page.locator('#F8-06 .nova-tab[data-m="explore"]').click()
   for id in ('Y8-016-L','Y8-016-G','Y8-016-A','Y9-019-D','Y9-019-R'):
    t=page.evaluate('''id=>{let z=F806_TEST.lessons[id];return {steps:z.steps,pool:z.pool,labels:z.steps.map(x=>F806_TEST.ops[x].title),n:z.steps.length};}''',id)
    page.locator('.f806-select').select_option(id)
    rec(f'{width}/{id}/select',page.locator('.f806-svg').get_attribute('data-preset')==id)
    wrong=next(z for z in t['pool'] if z!=t['steps'][0]);name=page.evaluate('x=>F806_TEST.ops[x].title',wrong)
    page.locator('.f806-buttons button[aria-label="'+name+'"]').click()
    rec(f'{width}/{id}/reject-wrong',page.locator('.f806-svg').get_attribute('data-step-count')=='0')
    rec(f'{width}/{id}/misconception-explained',len(page.locator('.f806-feedback').inner_text())>35)
    for i,key in enumerate(t['steps']):
     name=page.evaluate('x=>F806_TEST.ops[x].title',key)
     page.locator('.f806-buttons button[aria-label="'+name+'"]').click()
     rec(f'{width}/{id}/operation-{i}',page.locator('.f806-svg').get_attribute('data-step-count')==str(i+1))
    rec(f'{width}/{id}/end',page.locator('.f806-feedback').get_attribute('data-status')=='correct')
    page.get_by_role('button',name='Undo last step').click();rec(f'{width}/{id}/undo',page.locator('.f806-svg').get_attribute('data-step-count')==str(t['n']-1))
    page.get_by_role('button',name='Reset formula').click();rec(f'{width}/{id}/reset',page.locator('.f806-svg').get_attribute('data-step-count')=='0')
   page.locator('.f806-select').select_option('Y8-016-L');page.locator('[data-op-card="sub2w"]').focus();page.keyboard.press('Enter');rec(f'{width}/svg-enter-key',page.locator('.f806-svg').get_attribute('data-step-count')=='1')
  except Exception as e:rec(f'{width}/explore-exception',False,e)
  try:
   page.locator('#F8-06 .nova-tab[data-m="challenge"]').click()
   for idx,id in enumerate(('Y8-016-L','Y8-016-G','Y8-016-A','Y9-019-D','Y9-019-R')):
    t=page.evaluate('''id=>{const z=F806_TEST.lessons[id];return {steps:z.steps,inputs:z.inputs,expected:z.targetFn(z.inputs),correct:z.choices.findIndex(c=>c.correct),wrong:z.choices.findIndex(c=>!c.correct)};}''',id)
    rec(f'{width}/challenge{idx}/preset',page.locator('.f806-svg').get_attribute('data-preset')==id)
    rec(f'{width}/challenge{idx}/gating',page.get_by_role('button',name='Check formula and value').is_disabled())
    for i,key in enumerate(t['steps']):
     name=page.evaluate('x=>F806_TEST.ops[x].title',key)
     page.locator('.f806-buttons button[aria-label="'+name+'"]').click()
     rec(f'{width}/challenge{idx}/op-{i}',page.locator('.f806-svg').get_attribute('data-step-count')==str(i+1))
    rec(f'{width}/challenge{idx}/hide-result',page.locator('.f806-svg').locator('text',has_text='?').count()>0)
    rec(f'{width}/challenge{idx}/options-open',page.locator('.f806-formula-options').is_visible())
    page.locator('.f806-choice').nth(t['wrong']).click();page.locator('.f806-answer').fill(str(t['expected']));page.get_by_role('button',name='Check formula and value').click()
    rec(f'{width}/challenge{idx}/reject-wrong-formula',page.locator('.f806-feedback').get_attribute('data-status')=='wrong')
    page.locator('.f806-choice').nth(t['correct']).click();page.locator('.f806-answer').fill('999');page.get_by_role('button',name='Check formula and value').click()
    rec(f'{width}/challenge{idx}/reject-wrong-number',page.locator('.f806-feedback').get_attribute('data-status')=='wrong')
    page.locator('.f806-answer').fill(str(t['expected']));page.get_by_role('button',name='Check formula and value').click()
    rec(f'{width}/challenge{idx}/accept-both',page.locator('.f806-feedback').get_attribute('data-status')=='correct')
    rec(f'{width}/challenge{idx}/peer',page.locator('.f806-peer img').count()==1)
    if idx<4:page.get_by_role('button',name='Next formula').click()
  except Exception as e:rec(f'{width}/challenge-exception',False,e)
  rec(f'{width}/no-pageerror',not errors,errors);page.close()
 browser.close()
report={'total':len(checks),'passed':sum(x['passed'] for x in checks),'failed':[x for x in checks if not x['passed']],'checks':checks}
(R/'tests/F8-06-browser-results.json').write_text(json.dumps(report,indent=2));print('BROWSER',report['passed'],'/',report['total'])
for x in report['failed'][:20]:print('FAIL',x)
assert not report['failed']
