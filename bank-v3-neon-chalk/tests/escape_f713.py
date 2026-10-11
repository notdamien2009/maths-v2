"""Escape aborts a live lifted SVG strip drag in both width contexts."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,sys
root=Path(__file__).resolve().parents[1];src=(root/'F7/F7-13-difference-of-two-squares.html').read_text('utf8');out=[]
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for width in [380,1280]:
  p=b.new_page(viewport={'width':width,'height':900});p.set_content(src);p.get_by_role('tab',name='Explore').click();p.locator('svg.f713-art').scroll_into_view_if_needed();q=p.locator('[data-f713-piece]').bounding_box()
  p.mouse.move(q['x']+q['width']/2,q['y']+q['height']/2);p.mouse.down();p.mouse.move(q['x']+q['width']/2-30,q['y']+q['height']/2+45,steps=6)
  live=p.evaluate('!!NOVA.ui._drag');p.keyboard.press('Escape');p.wait_for_timeout(500);p.mouse.up()
  ok=live and not p.evaluate('!!NOVA.ui._drag') and p.locator('svg.f713-art').get_attribute('data-f713-moved')=='false'
  out.append({'viewport':width,'pass':bool(ok)});p.close()
 b.close()
result={'passed':sum(z['pass'] for z in out),'total':len(out),'cases':out}
(root/'tests/F7-13-ESCAPE-RESULTS.json').write_text(json.dumps(result,indent=2),'utf8');print('ESCAPE',result['passed'],'/',result['total']);sys.exit(0 if result['passed']==result['total'] else 1)
