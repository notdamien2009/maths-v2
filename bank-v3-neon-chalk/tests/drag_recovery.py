import json
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];F=(R/'F3/F3-10-index-law-animator.html').read_text();results=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for width in (380,1280):
  for reduce in ('reduce','no-preference'):
   pg=b.new_page(viewport={'width':width,'height':1200},reduced_motion=reduce);errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.set_content(F)
   pg.locator('#F3-10 button').filter(has_text='Explore').first.click();pg.wait_for_timeout(160)
   svg=pg.locator('#F3-10 .f310-svg');svg.scroll_into_view_if_needed();pg.wait_for_timeout(90)
   def coord(x,y):return pg.evaluate('''([x,y])=>{let s=document.querySelector('#F3-10 .f310-svg'),p=s.createSVGPoint();p.x=x;p.y=y;let q=p.matrixTransform(s.getScreenCTM());return [q.x,q.y]}''',[x,y])
   def drag(a,b,steps=1):
    x,y=coord(*a);u,v=coord(*b);pg.mouse.move(x,y);pg.mouse.down();pg.mouse.move(u,v,steps=steps);pg.mouse.up();pg.wait_for_timeout(430 if reduce=='no-preference' else 130)
   def progress():return int(svg.get_attribute('data-progress'))
   # wrong drop: move source group outside valid join zone
   drag((500,476),(500,550));wrong=progress()==0
   # rapid successful drop
   drag((500,476),(500,680));ok=progress()==1
   # remove regrab: last tile position is 728,682 for five-factor strip
   drag((728,682),(805,865));removed=progress()==0
   # place again
   drag((500,476),(500,680));regrab=progress()==1
   # escape while moving from completed tile toward Remove; piece returns without stranded active pointer
   x,y=coord(728,682);u,v=coord(750,850);pg.mouse.move(x,y);pg.mouse.down();pg.mouse.move(u,v,steps=1);pg.keyboard.press('Escape');pg.mouse.up();pg.wait_for_timeout(460)
   cancelled=pg.evaluate('NOVA.ui._drag === null');still=progress()==1
   results.append(dict(width=width,motion=reduce,wrong=wrong,correct=ok,remove=removed,regrab=regrab,escape=cancelled,preserved=still,errors=errs.copy()))
   print(results[-1]);pg.close()
 b.close()
(R/'tests/RECOVERY-RESULTS.json').write_text(json.dumps(results,indent=2))
assert all(all(d[k] for k in ('wrong','correct','remove','regrab','escape','preserved')) and not d['errors'] for d in results)
