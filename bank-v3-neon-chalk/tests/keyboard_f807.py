from pathlib import Path
from playwright.sync_api import sync_playwright
import json
R=Path(__file__).resolve().parents[1];html=(R/'F8/F8-07-expression-builder.html').read_text();a=[]
def rec(n,ok,detail=''):a.append({'test':n,'passed':bool(ok),'detail':str(detail)[:160]})
with sync_playwright() as P:
 b=P.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for w in (380,1280):
  p=b.new_page(viewport={'width':w,'height':960},reduced_motion='reduce');errors=[];p.on('pageerror',lambda e:errors.append(str(e)));p.set_content(html);p.locator('#F8-07 .nova-tab[data-m="explore"]').click()
  sel=p.locator('#F8-07 .f807-select');sel.select_option('Y9-007-G');rec(f'{w}/preset-eight-slots',p.locator('[data-rail-slot]').count()==8)
  t=p.locator('#F8-07 .f807-svg [data-tile-id="0"]');t.focus();p.keyboard.press('Enter');p.wait_for_timeout(60)
  rec(f'{w}/keyboard-add',p.locator('[data-rail-slot="0"]').get_attribute('aria-label').endswith('filled'))
  g=p.locator('#F8-07 .f807-svg [data-tile-id="0"]');g.focus();p.keyboard.press('ArrowRight');p.wait_for_timeout(60)
  rec(f'{w}/keyboard-reorder',p.locator('[data-rail-slot="1"]').get_attribute('aria-label').endswith('filled') and p.locator('[data-rail-slot="0"]').get_attribute('aria-label').endswith('empty'))
  g=p.locator('#F8-07 .f807-svg [data-tile-id="0"]');g.focus();p.keyboard.press('Delete');p.wait_for_timeout(60)
  rec(f'{w}/keyboard-remove',p.locator('[data-rail-slot="1"]').get_attribute('aria-label').endswith('empty'))
  rec(f'{w}/keyboard-no-errors',not errors,errors)
  p.close()
 b.close()
res={'component':'F8-07','passed':sum(x['passed'] for x in a),'total':len(a),'failed':[x for x in a if not x['passed']],'checks':a};(R/'tests/F8-07-keyboard-results.json').write_text(json.dumps(res,indent=2));print('Keyboard:',res['passed'],'/',res['total'],res['failed'][:3])
