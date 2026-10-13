from playwright.sync_api import sync_playwright
from pathlib import Path
import json
s=Path('/mnt/data/NOVA-F10-20-Tangent-and-Area-under-Curve-Estimator-PREMIUM-REVIEW.html').read_text(); checks=[]
def ck(k,v,d=''):
 checks.append({'name':k,'pass':bool(v),'detail':str(d)});print(('PASS' if v else 'FAIL'),k,str(d)[:90] if not v else '',flush=True)
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox']);p=b.new_page(viewport={'width':1280,'height':900});p.set_content(s);p.get_by_role('tab',name='Explore',exact=True).click()
 def center():
  h=p.locator('[data-testid="f120-handle"]');rect=h.bounding_box();return rect['x']+rect['width']/2,rect['y']+rect['height']/2
 x,y=center();p.mouse.move(x,y);p.mouse.down();p.mouse.move(x+35,y-8,steps=7);p.keyboard.press('Escape');p.wait_for_timeout(440)
 ck('escape-release',not p.evaluate('!!NOVA.ui._drag') and float(p.locator('[data-testid="f120-x"]').input_value())==3)
 x,y=center();p.mouse.move(x,y);p.mouse.down();p.mouse.move(x+15,y+250,steps=7);p.mouse.up();p.wait_for_timeout(470)
 ck('invalid-zone-springs-back',not p.evaluate('!!NOVA.ui._drag') and float(p.locator('[data-testid="f120-x"]').input_value())==3)
 for i in range(3):
  x,y=center();p.mouse.move(x,y);p.mouse.down();p.mouse.move(x+30,y-5,steps=10);p.mouse.up();p.wait_for_timeout(120)
  v=float(p.locator('[data-testid="f120-x"]').input_value());ck(f'regrab-{i+1}',v>3+i*.1 and not p.evaluate('!!NOVA.ui._drag'),v)
 p.emulate_media(reduced_motion='reduce');p.locator('[data-testid="f120-n"]').fill('12');p.wait_for_timeout(75)
 ck('reduced-motion-full-area',p.locator('.f120-glass').count()==12 and not p.evaluate('!!NOVA.ui._drag'))
 b.close()
Path('/mnt/data/f10_20_dev/QA-drag-results.json').write_text(json.dumps({'passed':sum(x['pass'] for x in checks),'total':len(checks),'checks':checks},indent=2))
print('FINAL',sum(x['pass'] for x in checks),'/',len(checks))
