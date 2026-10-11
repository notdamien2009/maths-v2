from playwright.sync_api import sync_playwright
from pathlib import Path
import json
R=Path(__file__).resolve().parent.parent
rows=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for w in [380,1280]:
  page=b.new_page(viewport={'width':w,'height':1240},reduced_motion='reduce')
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content((R/'F3/F3-15-surd-and-exact-value-builder.html').read_text())
  page.locator('#F3-15 [data-m="challenge"]').click()
  for i,n in enumerate([72,50,108,45]):
   s=page.evaluate('(n)=>F315_MATH.surd(n)',n)
   panel=page.locator('#F3-15 .nova-panel')
   bad= next((v for v in [1,4,9,16,25,36] if v!=s['square'] and v in ([36,9,4] if n==72 else [25,4,1] if n==50 else [36,9,4] if n==108 else [9,1,4])), None)
   if bad is not None:
    panel.get_by_role('button',name=f'Square factor {bad}').click()
    assert 'largest' in panel.inner_text().lower() or 'does not' in panel.inner_text().lower(),f'No factor feedback for {n}'
   panel.get_by_role('button',name=f"Square factor {s['square']}").click()
   cards=page.locator('#F3-15 .nova-panel button:has(.mt)')
   assert cards.count()==3,(n,cards.count())
   # The correct simplest answer is the first exact card; try the equivalent/wrong second card first.
   cards.nth(1).click()
   assert 'exact' in panel.inner_text().lower() or 'simpl' in panel.inner_text().lower(),n
   cards=page.locator('#F3-15 .nova-panel button:has(.mt)')
   cards.first.click()
   assert page.locator('#F3-15 [data-placed-answer]').count()==1,n
   if i==0:page.locator('#F3-15 .nova-stage').screenshot(path=str(R/'shots'/f'F3-15-{w}-challenge-placed-stage.png'))
   panel.get_by_role('button',name='Check proof').click()
   rows.append({'width':w,'n':n,'a':s['a'],'b':s['b'],'correctFactor':s['square'],'pass':True})
   page.wait_for_timeout(1150)
  assert 'Four exact surd proofs complete' in panel.inner_text(),panel.inner_text()
  page.locator('#F3-15 .nova-stage').screenshot(path=str(R/'shots'/f'F3-15-{w}-challenge-complete-stage.png'))
  assert not errors,errors
  page.close()
 b.close()
(R/'tests/CHALLENGE-RESULTS.json').write_text(json.dumps({'completions':len(rows),'results':rows},indent=2))
print(json.dumps({'completions':len(rows),'results':rows},indent=2))
