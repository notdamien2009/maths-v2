from playwright.sync_api import sync_playwright
from pathlib import Path
import json,math
src=Path('/mnt/data/NOVA-F10-20-Tangent-and-Area-under-Curve-Estimator-PREMIUM-REVIEW.html').read_text(); results=[]
def ck(name,ok,detail=''):
 ok=bool(ok); results.append({'name':name,'pass':ok,'detail':str(detail)[:260]});print(('PASS' if ok else 'FAIL'),name,str(detail)[:90] if not ok else '',flush=True)
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage']);p=b.new_page(viewport={'width':1280,'height':900});errors=[];console=[];p.on('pageerror',lambda e:errors.append(str(e)));p.on('console',lambda e:console.append(e.text) if e.type=='error' else None)
 p.set_content(src,wait_until='load');p.wait_for_timeout(100)
 ck('mount',p.locator('#F10-20').count()==1);ck('seven-presets',p.evaluate('Object.keys(F120_CONFIG.presets).length')==7)
 for width in [320,380,768,1280]:
  p.set_viewport_size({'width':width,'height':900});p.wait_for_timeout(30)
  for mode in ['Watch','Guided','Explore','Challenge']:
   p.get_by_role('tab',name=mode,exact=True).click();p.wait_for_timeout(45)
   r=p.evaluate('''()=>{const s=document.querySelector('#F10-20 .nova-stage'),t=s?.querySelector('.f120-theatre'),d=s?.querySelector(':scope > .nv-dock'),svg=s?.querySelector('.f120-svg');const a=s?.getBoundingClientRect(),b=d?.getBoundingClientRect();return {board:!!s,visual:!!svg,children:[...s.children].map(e=>e.classList[0]),inner:getComputedStyle(t).borderTopWidth,background:getComputedStyle(s).backgroundImage,frame:!!b&&b.bottom<=a.bottom+1&&b.left>=a.left-1&&b.right<=a.right+1,overflow:document.documentElement.scrollWidth-innerWidth,labels:[...svg.querySelectorAll('text')].length};}''')
   root=f'{width}px-{mode}';ck(root+'-single-board',r['children']==['f120-theatre','nv-dock'] and r['inner']=='0px',r)
   ck(root+'-mascot-contained',r['frame'],r)
   ck(root+'-background-and-axes',r['visual'] and 'linear-gradient' in r['background'] and r['labels']>=10,r)
   ck(root+'-no-horizontal-overflow',r['overflow']<=1,r)
 p.set_viewport_size({'width':1280,'height':900});p.get_by_role('tab',name='Explore',exact=True).click()
 for name in p.evaluate('Object.keys(F120_CONFIG.presets)'):
  p.locator('[data-testid="f120-preset"]').select_option(name);p.wait_for_timeout(60)
  config=p.evaluate('''()=>{let ss=document.querySelector('.f120-svg');return{traps:ss.querySelectorAll('.f120-strip').length,shades:ss.querySelectorAll('.f120-glass').length,curve:!!ss.querySelector('.f120-curve'),stat:document.querySelector('.f120-info').innerText,labels:!!document.querySelector('.f120-title')}}''')
  expected=p.evaluate(f'F120_CONFIG.presets["{name}"].n')
  ck('preset-'+name+'-all-shaded-trapezia',config['traps']==expected and config['shades']==expected,config)
  ck('preset-'+name+'-maths-evidence',config['curve'] and 'TANGENT' in config['stat'] and 'ESTIMATE' in config['stat'],config)
 # Exact mathematical validations from known source function and geometry
 p.locator('[data-testid="f120-preset"]').select_option('GCSE-TRAPEZIA-2');
 ck('quadratic-n2-area10','10 square units' in p.locator('.f120-info').inner_text(),p.locator('.f120-info').inner_text())
 p.locator('[data-testid="f120-preset"]').select_option('GCSE-QUADRATIC');
 ck('quadratic-n4-area9.5','9.5 square units' in p.locator('.f120-info').inner_text())
 p.locator('[data-testid="f120-preset"]').select_option('GCSE-TRAPEZIA-8');
 ck('quadratic-n8-area9.375','9.375 square units' in p.locator('.f120-info').inner_text())
 p.locator('[data-testid="f120-preset"]').select_option('GCSE-LINEAR');
 ck('linear-exact12','12 square units' in p.locator('.f120-info').inner_text())
 p.locator('[data-testid="f120-preset"]').select_option('GCSE-CONCAVE');
 ck('concave-underestimate','straight tops lie below' in p.locator('.f120-info').inner_text())
 p.locator('[data-testid="f120-preset"]').select_option('GCSE-QUADRATIC');
 p.locator('[data-testid="f120-x"]').fill('4');ck('gradient-slider-slope2','2 gradient' in p.locator('.f120-info').inner_text());
 p.locator('[data-testid="f120-n"]').fill('8');ck('eight-strips-control',p.locator('.f120-strip').count()==8)
 p.locator('[data-testid="f120-reset"]').click();ck('preset-reset',p.locator('[data-testid="f120-n"]').input_value()=='4' and p.locator('[data-testid="f120-x"]').input_value()=='3')
 h=p.locator('[data-testid="f120-handle"]');h.focus();p.keyboard.press('ArrowRight');ck('keyboard-tangent-increment',p.locator('[data-testid="f120-x"]').input_value()=='3.25')
 h=p.locator('[data-testid="f120-handle"]');box=h.bounding_box();cx=box['x']+box['width']/2;cy=box['y']+box['height']/2
 p.mouse.move(cx,cy);p.mouse.down();p.mouse.move(cx+50,cy-5,steps=12);p.mouse.up();p.wait_for_timeout(100)
 moved=float(p.locator('[data-testid="f120-x"]').input_value());ck('drag-tangent-snaps',moved>=3.5 and moved<=4.5,moved)
 p.get_by_role('tab',name='Challenge',exact=True).click();ck('challenge-has-answer',p.locator('[data-testid="f120-answer"]').count()==1)
 p.locator('[data-testid="f120-answer"]').fill('99');p.get_by_role('button',name='Check',exact=True).click();ck('specific-wrong-feedback','not the curve height' in p.locator('#F10-20').inner_text())
 p.locator('[data-testid="f120-answer"]').fill('1.5');p.get_by_role('button',name='Check',exact=True).click();ck('correct-feedback','Correct.' in p.locator('#F10-20').inner_text())
 ck('no-JS-errors',len(errors)==0,errors);ck('no-console-errors',len(console)==0,console[:8]);b.close()
summary={'passed':sum(r['pass'] for r in results),'total':len(results),'checks':results,'errors':errors,'console_errors':console}
Path('/mnt/data/f10_20_dev/QA-results.json').write_text(json.dumps(summary,indent=2))
print('FINAL',summary['passed'],'/',summary['total'],'FAILED',[r['name'] for r in results if not r['pass']])
