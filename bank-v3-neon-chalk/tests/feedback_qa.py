import json
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];F=(R/'F3/F3-10-index-law-animator.html').read_text();out=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for width in [380,1280]:
  pg=b.new_page(viewport={'width':width,'height':1200},reduced_motion='reduce');errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.set_content(F)
  pg.locator('#F3-10 button').filter(has_text='Challenge').first.click();pg.wait_for_timeout(90)
  # No output power/exponent shown in initial Challenge stage
  s=pg.locator('#F3-10 .f310-svg').text_content();no_spoiler='to the power of 5' not in s
  ip=pg.locator('#F3-10 input[aria-label="Resulting index or numerical value"]');ip.fill('5');pg.locator('#F3-10 button').filter(has_text='Check proof').last.click();pg.wait_for_timeout(80)
  requires_structure='Finish the factor structure first' in pg.locator('#F3-10').inner_text()
  pg.locator('#F3-10 button').filter(has_text='Join strips').last.click();pg.wait_for_timeout(60)
  pg.locator('#F3-10 input[aria-label="Resulting index or numerical value"]').fill('6')
  pg.locator('#F3-10 button').filter(has_text='Check proof').last.click();pg.wait_for_timeout(60)
  explains_error='count the factors' in pg.locator('#F3-10').inner_text().lower()
  has_stayed='Proof 1 of 4' in pg.locator('#F3-10').inner_text()
  ratio=pg.evaluate('''()=>{let s=document.querySelector('#F3-10 .f310-svg').getBoundingClientRect(),p=document.querySelector('#F3-10 .nova-stage').getBoundingClientRect();return s.height/p.height}''')
  out.append(dict(width=width,no_spoiler=no_spoiler,requires_structure=requires_structure,explains_error=explains_error,has_stayed=has_stayed,svg_to_stage_ratio=ratio,errors=errs))
  pg.close()
 b.close()
(R/'tests/FEEDBACK-RESULTS.json').write_text(json.dumps(out,indent=2));print(json.dumps(out,indent=2))
assert all(r['no_spoiler'] and r['requires_structure'] and r['explains_error'] and r['has_stayed'] and not r['errors'] for r in out)
