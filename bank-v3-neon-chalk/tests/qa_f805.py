#!/usr/bin/env python3
"""F8-05 actual Chromium modes, variation, challenge gating and accessibility checks."""
from playwright.sync_api import sync_playwright
from pathlib import Path
import json
R=Path(__file__).resolve().parents[1];html=(R/'F8/F8-05-both-sides-equation-solver.html').read_text();checks=[]
def rec(test,passed,detail=''):checks.append({'test':test,'passed':bool(passed),'detail':str(detail)[:190]})
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for width in (380,1280):
  p=b.new_page(viewport={'width':width,'height':970},reduced_motion='reduce');p.set_default_timeout(6500);err=[];p.on('pageerror',lambda e:err.append(str(e)));p.set_content(html,wait_until='load')
  ids=['Y7-033','Y7-035','Y8-013','Y8-014','Y8-015']
  for mode in ('watch','guided','explore','challenge'):
   try:
    p.locator(f'#F8-05 .nova-tab[data-m="{mode}"]').click();p.wait_for_timeout(55)
    rec(f'{width}/{mode}/svg',p.locator('.f805-svg').count()==1)
    rec(f'{width}/{mode}/mascot',p.locator('#F8-05 img').count()>0)
    rec(f'{width}/{mode}/no-scroll-x',p.evaluate('document.documentElement.scrollWidth<=innerWidth+3'))
    rec(f'{width}/{mode}/math-track',p.locator('.f805-svg').get_attribute('data-maths-correct')=='true')
    p.locator('.f805-svg').screenshot(path=str(R/f'shots/F8-05-{width}-{mode}-stage.png'))
   except Exception as e:rec(f'{width}/{mode}/exception',False,e)
  try:
   p.locator('#F8-05 .nova-tab[data-m="explore"]').click()
   for id in ids:
    z=p.evaluate('''id=>{const t=F805_TEST,z=t.lessons[id];return {steps:z.steps,keys:z.steps.map(x=>t.operations[x].title),pool:z.pool,solution:z.solution}}''',id)
    p.locator('.f805-select').select_option(id)
    rec(f'{width}/{id}/selected',p.locator('.f805-svg').get_attribute('data-preset')==id)
    if id=='Y8-015':rec(f'{width}/{id}/stacked-svg-fractions',p.locator('.f805-svg').locator('text',has_text='x').count()>0)
    wrong=[k for k in z['pool'] if k!=z['steps'][0]][0]
    p.locator(f'.f805-choices button[aria-label="{p.evaluate("key=>F805_TEST.operations[key].title",wrong)}"]').click()
    rec(f'{width}/{id}/wrong-operation-rejected',p.locator('.f805-svg').get_attribute('data-step-count')=='0')
    rec(f'{width}/{id}/misconception-feedback',len(p.locator('.f805-feedback').inner_text())>40)
    for i,(key,name) in enumerate(zip(z['steps'],z['keys'])):
     btn=p.locator('.f805-choices button').filter(has=p.locator('text='+name)) if False else p.locator('.f805-choices button[aria-label="'+name+'"]')
     btn.click();rec(f'{width}/{id}/applied-{i}',p.locator('.f805-svg').get_attribute('data-step-count')==str(i+1))
    rec(f'{width}/{id}/complete',p.locator('.f805-feedback').get_attribute('data-status')=='correct')
    p.get_by_role('button',name='Undo last operation').click()
    rec(f'{width}/{id}/undo',p.locator('.f805-svg').get_attribute('data-step-count')==str(len(z['steps'])-1))
    p.get_by_role('button',name='Reset equation').click();rec(f'{width}/{id}/reset',p.locator('.f805-svg').get_attribute('data-step-count')=='0')
   # Keyboard accessible SVG operation activation, independent of pointer.
   p.locator('.f805-select').select_option('Y7-033');p.locator('[data-op-card="sub5"]').focus();p.keyboard.press('Enter')
   rec(f'{width}/keyboard-svg',p.locator('.f805-svg').get_attribute('data-step-count')=='1')
  except Exception as e:rec(f'{width}/explore-exception',False,e)
  try:
   p.locator('#F8-05 .nova-tab[data-m="challenge"]').click()
   for task,id in enumerate(ids):
    q=p.evaluate('''id=>{const z=F805_TEST.lessons[id].challenge;return {ops:z.steps.map(x=>F805_TEST.operations[x].title),solution:z.solution,pool:z.pool}}''',id)
    rec(f'{width}/challenge{task}/prompt',id.split('-')[0] in p.locator('.f805-svg').get_attribute('data-preset'))
    rec(f'{width}/challenge{task}/answer-gated',p.get_by_role('button',name='Check solution').is_disabled())
    wrong=next(k for k in q['pool'] if p.evaluate('''([id,k])=>F805_TEST.lessons[id].challenge.steps[0]!==k''',[id,k]))
    name=p.evaluate('key=>F805_TEST.operations[key].title',wrong);p.locator('.f805-choices button[aria-label="'+name+'"]').click()
    rec(f'{width}/challenge{task}/wrong-rejected',p.locator('.f805-svg').get_attribute('data-step-count')=='0')
    for i,name in enumerate(q['ops']):
     p.locator('.f805-choices button[aria-label="'+name+'"]').click()
     rec(f'{width}/challenge{task}/step{i}',p.locator('.f805-svg').get_attribute('data-step-count')==str(i+1))
    rec(f'{width}/challenge{task}/value-hidden',p.locator('.f805-svg').locator('text',has_text='?').count()>0)
    p.locator('.f805-answer').fill('999');p.get_by_role('button',name='Check solution').click()
    rec(f'{width}/challenge{task}/wrong-answer-rejected',p.locator('.f805-feedback').get_attribute('data-status')=='wrong')
    p.locator('.f805-answer').fill(str(q['solution']));p.get_by_role('button',name='Check solution').click()
    rec(f'{width}/challenge{task}/correct-answer',p.locator('.f805-feedback').get_attribute('data-status')=='correct')
    rec(f'{width}/challenge{task}/next-enabled',p.get_by_role('button',name='Next equation').is_visible() or task==4)
    if task<4:p.get_by_role('button',name='Next equation').click()
  except Exception as e:rec(f'{width}/challenge-exception',False,e)
  rec(f'{width}/no-page-errors',not err,err)
  p.close()
 b.close()
report={'total':len(checks),'passed':sum(c['passed'] for c in checks),'failed':[c for c in checks if not c['passed']],'checks':checks};(R/'tests/F8-05-browser-results.json').write_text(json.dumps(report,indent=2));print('BROWSER',report['passed'],'/',report['total'],'FAIL',len(report['failed']))
for x in report['failed'][:20]:print('FAIL',x)
assert not report['failed']
