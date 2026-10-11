from pathlib import Path
from playwright.sync_api import sync_playwright
import json
R=Path(__file__).resolve().parents[1];html=(R/'F3/F3-14-multiplication-table-explorer.html').read_text();res=[]
answers=[-12,30,-56,54]
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in [380,1280]:
  page=b.new_page(viewport={'width':width,'height':900},reduced_motion='reduce');errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)));page.set_content(html);page.locator('#F3-14 .nova-tab').filter(has_text='Challenge').first.click()
  for i,answer in enumerate(answers):
   cards=page.locator('#F3-14 svg.f314-svg [data-product-card]')
   assert cards.count()==3
   incorrect=next(x for x in [-99,12,-12,30,-30,56,-56,54,-54] if x != answer and cards.filter(has=page.locator('text')).count()) if False else None
   # First deliberately place an incorrect option and verify no advancement.
   bad=next(int(cards.nth(k).get_attribute('data-product-card')) for k in range(3) if int(cards.nth(k).get_attribute('data-product-card'))!=answer)
   page.locator('#F3-14 button').filter(has_text=f'Place {bad}').first.click();page.wait_for_timeout(100)
   assert f'Proof {i+1} of 4' in page.locator('#F3-14 .nova-panel').inner_text()
   page.locator('#F3-14 button').filter(has_text=f'Place {answer}').first.click();page.wait_for_timeout(90)
   assert page.locator('#F3-14 svg.f314-svg [data-placed-card]').count()==1
   page.locator('#F3-14 button').filter(has_text='Check proof').first.click();page.wait_for_timeout(1100)
   res.append({'viewport':width,'round':i+1,'answer':answer,'errors':list(errors),'passed':not errors})
  assert 'Four proofs complete' in page.locator('#F3-14').inner_text()
  page.close()
 b.close()
(R/'tests/CHALLENGE-RESULTS.json').write_text(json.dumps(res,indent=2));print('CHALLENGE PASS',len(res))
