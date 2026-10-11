from pathlib import Path
import json,traceback
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1];html=(root/'F7/F7-05-expanding-double-brackets.html').read_text();f704=Path('/mnt/data/nova-f7-run05/f704-regression.html').read_text();f3=(root/'F3/F3-02-area-model-of-multiplication.html').read_text();out=[];screens=root/'shots/F7-05';screens.mkdir(parents=True,exist_ok=True)
def ck(name,result,detail=''):
 ok=bool(result);out.append({'name':name,'passed':ok,'detail':str(detail)[:200]});print(('PASS ' if ok else 'FAIL ')+name,flush=True)
def drag(page,src,dst,steps=15):
 a=page.locator(src).first.bounding_box();b=page.locator(dst).first.bounding_box();assert a and b,(a,b)
 x=a['x']+a['width']/2;y=a['y']+a['height']/2;X=b['x']+b['width']/2;Y=b['y']+b['height']/2
 page.mouse.move(x,y);page.mouse.down();page.mouse.move(X,Y,steps=steps);page.mouse.up();page.wait_for_timeout(80)
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in [320,380,768,1280]:
  pg=browser.new_page(viewport={'width':w,'height':900},reduced_motion='reduce');err=[];pg.on('pageerror',lambda e:err.append(str(e)))
  pg.set_content(html,wait_until='load');pg.wait_for_timeout(60)
  ck(f'{w}-no-render-error',not err,err);ck(f'{w}-preset-selected',pg.evaluate("F302_CONFIG.preset==='F7-05-expanding-double-brackets'"))
  for mode in ('Watch','Guided','Explore','Challenge'):
   pg.locator(f'#F3-02 button:has-text("{mode}")').first.click();pg.wait_for_timeout(60)
   ck(f'{w}-{mode}-drawn',pg.locator('#F3-02 svg.f302-art').count()==1)
   ck(f'{w}-{mode}-no-side-scroll',pg.evaluate('document.documentElement.scrollWidth <= window.innerWidth+2'))
   if w in [380,1280]:pg.locator('#F3-02 .nova-stage').screenshot(path=str(screens/f'F7-05-{w}-{mode.lower()}-stage.png'),animations='disabled')
   if mode=='Challenge':ck(f'{w}-Challenge-hidden',pg.locator('#F3-02 .f302-aside .nv-ntile').first.inner_text().strip()=='?')
  ck(f'{w}-no-js-errors-after-modes',not err,err);pg.close()
 # maths exhaustive bounds and signed cases
 pg=browser.new_page(viewport={'width':1280,'height':950},reduced_motion='reduce');pg.set_content(html,wait_until='load')
 results=pg.evaluate("""() => {let errs=[];for(let a=-9;a<=9;a++)for(let b=-9;b<=9;b++){if(!a||!b)continue;let x=F705_PRESET_MATH.double(a,b);let poly=F705_PRESET_MATH.parse(x.expanded);if(!poly||poly.x2!==1||poly.x!==a+b||poly.c!==a*b)errs.push([a,b,x,poly]);if(!F705_PRESET_MATH.validate(a,b,x.expanded))errs.push(['reject',a,b]);}return errs;}""")
 ck('maths-324-signed-pairs',not results,results[:2]);ck('reject-incorrect-x',not pg.evaluate("F705_PRESET_MATH.validate(3,2,'x²+6x+6')"));ck('reject-incorrect-constant',not pg.evaluate("F705_PRESET_MATH.validate(-3,2,'x²-x+6')"));ck('alternate-x-squared-syntax',pg.evaluate("F705_PRESET_MATH.validate(3,2,'x^2+5x+6')"))
 pg.locator('#F3-02 button:has-text("Explore")').first.click();pg.locator('#F3-02 select[aria-label="Area model preset"]').select_option('F7-05-Y9-006');pg.wait_for_timeout(120)
 ck('explore-negative-a-renders','-3x' in pg.locator('#F3-02 svg.f302-art').text_content() or '− 3x' in pg.locator('#F3-02 svg.f302-art').text_content());ck('explore-negative-pattern',pg.locator('#F3-02 .f302-negative-tile').count()==2)
 pg.locator('#F3-02 .nova-stage').screenshot(path=str(screens/'F7-05-1280-explore-signed-stage.png'),animations='disabled');pg.close()
 # physical interaction full sequence
 for w,motion in [(380,'reduce'),(1280,'reduce')]:
  pg=browser.new_page(viewport={'width':w,'height':1130},reduced_motion=motion);err=[];pg.on('pageerror',lambda e:err.append(str(e)));pg.set_content(html,wait_until='load');pg.locator('#F3-02 button:has-text("Challenge")').first.click();pg.wait_for_timeout(130)
  pg.evaluate("() => scrollTo(0,document.querySelector('#F3-02 .nova-stage').getBoundingClientRect().top+scrollY-70)");pg.wait_for_timeout(80)
  try:
   ck(f'{w}-{motion}-five-cards',pg.locator('#F3-02 [data-card-index]').count()==5)
   drag(pg,'#F3-02 [data-card-index="4"]','#F3-02 [data-region="0"]')
   ck(f'{w}-{motion}-incorrect-drop-returns',pg.locator('#F3-02 [data-card-index="4"]').count()==1)
   ck(f'{w}-{motion}-incorrect-diagnostic','x by x' in pg.locator('#F3-02').inner_text())
   drag(pg,'#F3-02 [data-card-index="0"]','#F3-02 [data-region="0"]')
   ck(f'{w}-{motion}-native-valid-drag',pg.locator('#F3-02 [data-filled-index="0"]').count()==1)
   pg.locator('#F3-02 [data-filled-index="0"]').focus();pg.keyboard.press('Delete');pg.wait_for_timeout(70)
   ck(f'{w}-{motion}-keyboard-remove',pg.locator('#F3-02 [data-card-index="0"]').count()==1)
   answers=['x²+5x+6','x²+5x+4','x²-x-6','x²-6x+8']
   for task,answer in enumerate(answers):
    for i in range(4):
     pg.locator(f'#F3-02 [data-card-index="{i}"]').focus();pg.keyboard.press('Enter');pg.wait_for_timeout(35)
     pg.locator(f'#F3-02 [data-drop-region="{i}"]').focus();pg.keyboard.press('Enter');pg.wait_for_timeout(35)
    ck(f'{w}-{motion}-round{task+1}-four-placed',pg.locator('#F3-02 [data-filled-index]').count()==4)
    pg.locator('#F3-02 input[aria-label="Expanded double bracket"]').fill(answer)
    pg.locator('#F3-02 button:has-text("Check quadratic")').click();pg.wait_for_timeout(100)
    ck(f'{w}-{motion}-round{task+1}-complete',('Challenge '+str(task+2)+' of 4') in pg.locator('#F3-02').inner_text() if task<3 else 'four double-bracket expansions completed' in pg.locator('#F3-02').inner_text().lower())
   ck(f'{w}-{motion}-no-script-errors',not err,err)
  except Exception as e:traceback.print_exc();ck(f'{w}-{motion}-fatal',False,str(e))
  pg.close()
 # regression old F7-04 and default F3-02 (same patched core)
 for tag,h in [('F7-04',f704),('F3-02',f3)]:
  pg=browser.new_page(viewport={'width':1280,'height':900},reduced_motion='reduce');e=[];pg.on('pageerror',lambda er:e.append(str(er)));pg.set_content(h,wait_until='load')
  ck(tag+'-still-original-mode',pg.evaluate('F302_CONFIG.preset')==('F7-04-expanding-single-brackets' if tag=='F7-04' else 'Y7-009-whole-decimal-multiplication'))
  for mode in ('Watch','Explore','Challenge'):
   pg.locator(f'#F3-02 button:has-text("{mode}")').first.click();pg.wait_for_timeout(70);ck(tag+'-'+mode+'-regression',pg.locator('#F3-02 svg.f302-art').count()==1)
  ck(tag+'-no-js-errors',not e,e);pg.close()
 browser.close()
(root/'tests/f705-qa-results.json').write_text(json.dumps(out,indent=2));print('QA TOTAL',sum(x['passed'] for x in out),'/',len(out),flush=True)
raise SystemExit(0 if all(x['passed'] for x in out) else 1)
