from pathlib import Path
from playwright.sync_api import sync_playwright
import json
root=Path(__file__).resolve().parents[1];html=(root/'F7/F7-05-expanding-double-brackets.html').read_text();checks=[]
def ck(name,valid):checks.append({'name':name,'passed':bool(valid)});print(name, 'PASS' if valid else 'FAIL',flush=True)
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in [380,1280]:
  pg=b.new_page(viewport={'width':w,'height':1100},reduced_motion='no-preference');errors=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.set_content(html,wait_until='load');pg.locator('#F3-02 button:has-text("Challenge")').first.click();pg.wait_for_timeout(140)
  pg.evaluate("() => scrollTo(0,document.querySelector('#F3-02 .nova-stage').getBoundingClientRect().top+scrollY-65)")
  def drag(src,dst):
   a=pg.locator(src).first.bounding_box();q=pg.locator(dst).first.bounding_box();assert a and q
   x=a['x']+a['width']/2;y=a['y']+a['height']/2;X=q['x']+q['width']/2;Y=q['y']+q['height']/2
   pg.mouse.move(x,y);pg.mouse.down();pg.mouse.move(X,Y,steps=12);pg.mouse.up();pg.wait_for_timeout(90)
  drag('#F3-02 [data-card-index="4"]','#F3-02 [data-region="0"]');ck(f'{w}-normal-invalid-springs-back',pg.locator('#F3-02 [data-card-index="4"]').count()==1)
  drag('#F3-02 [data-card-index="0"]','#F3-02 [data-region="0"]');ck(f'{w}-normal-valid-snaps',pg.locator('#F3-02 [data-filled-index="0"]').count()==1)
  pg.locator('#F3-02 [data-filled-index="0"]').focus();pg.keyboard.press('Delete');pg.wait_for_timeout(100);ck(f'{w}-normal-keyboard-recovery',pg.locator('#F3-02 [data-card-index="0"]').count()==1)
  ck(f'{w}-normal-no-errors',not errors);pg.close()
 b.close()
(root/'tests/f705-normal-stress.json').write_text(json.dumps(checks,indent=2));print('STRESS TOTAL',sum(x['passed'] for x in checks),'/',len(checks))
raise SystemExit(0 if all(x['passed'] for x in checks) else 1)
