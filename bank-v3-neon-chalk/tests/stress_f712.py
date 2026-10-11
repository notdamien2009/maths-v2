from playwright.sync_api import sync_playwright
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1];html=(root/'F7/F7-12-substitution-machine.html').read_text();checks=[];fails=[]
def ok(label,yes):
 checks.append({'test':label,'pass':bool(yes)})
 if not yes:fails.append(label)
def center(r):return (r['x']+r['width']/2,r['y']+r['height']/2)
def drag(pg,origin,dest,steps=9):
 pg.mouse.move(*origin);pg.mouse.down();pg.mouse.move(*dest,steps=steps);pg.mouse.up()
def target(pg,which):return pg.locator('#F8-03 [data-f803-target="'+which+'"]')
def loaded(pg):return pg.locator('#F8-03 .f803-svg').get_attribute('data-loaded')=='true'
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in (380,1280):
  for motion in ('reduce','no-preference'):
   pg=b.new_page(viewport={'width':width,'height':920},reduced_motion=motion);errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
   pg.set_content(html,wait_until='domcontentloaded',timeout=30000)
   pg.locator('#F8-03 button').filter(has_text='Explore').first.click(force=True)
   src=pg.locator('#F8-03 [data-f803-source="input"]');src.scroll_into_view_if_needed();aa=center(src.bounding_box());hh=center(target(pg,'hopper').bounding_box())
   drag(pg,aa,hh,steps=2)
   ok(f'{width}/{motion}: fast physical drag loads hopper',loaded(pg))
   ok(f'{width}/{motion}: one source removed',pg.locator('#F8-03 [data-f803-source="input"]').count()==0)
   l=pg.locator('#F8-03 [data-f803-source="loaded"]');l.scroll_into_view_if_needed();bb=center(l.bounding_box());rr=center(target(pg,'return').bounding_box())
   drag(pg,bb,rr,steps=8);pg.wait_for_timeout(520)
   ok(f'{width}/{motion}: physical return removes input',not loaded(pg))
   pg.wait_for_selector('#F8-03 [data-f803-source="input"]',state='attached');pg.wait_for_timeout(130);src=pg.locator('#F8-03 [data-f803-source="input"]');aa=center(src.bounding_box());invalid=(aa[0]+35, max(115,aa[1]-120))
   drag(pg,aa,invalid,steps=5)
   ok(f'{width}/{motion}: invalid release springs home',not loaded(pg) and pg.locator('#F8-03 [data-f803-source="input"]').count()==1)
   pg.wait_for_timeout(160);src=pg.locator('#F8-03 [data-f803-source="input"]');aa=center(src.bounding_box());pg.mouse.move(*aa);pg.mouse.down();pg.mouse.move(aa[0]+12,aa[1]-22,steps=3);pg.keyboard.press('Escape');pg.mouse.up();pg.wait_for_timeout(100)
   ok(f'{width}/{motion}: Escape returns safely',not loaded(pg))
   ok(f'{width}/{motion}: no stranded drag active',not bool(pg.evaluate('window.NOVA?.ui?._drag?.el')))
   ok(f'{width}/{motion}: no browser errors',not errs)
   pg.close()
 b.close()
r={'passed':sum(c['pass'] for c in checks),'total':len(checks),'failures':fails,'checks':checks}
(root/'tests/F7-12-STRESS-RESULTS.json').write_text(json.dumps(r,indent=2));print('RESULT',r['passed'],r['total'],'FAIL',fails,flush=True)
