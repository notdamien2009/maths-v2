import json
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];HTML=(R/'F8/F8-08-equivalence-checker.html').read_text();out=[]
with sync_playwright() as P:
 b=P.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for w in [360,380,430,760,1024,1280]:
  page=b.new_page(viewport={'width':w,'height':900},reduced_motion='reduce');errs=[];page.on('pageerror',lambda e:errs.append(str(e)));page.set_content(HTML,wait_until='load')
  for mode in ['watch','guided','explore','challenge']:
   page.locator(f'#F8-08 .nova-tab[data-m="{mode}"]').click()
   dims=page.evaluate('''()=>{let s=document.querySelector('#F8-08 .f808-svg');let b=s.getBoundingClientRect();return {overflow:document.documentElement.scrollWidth>innerWidth,valid:b.width>200&&b.left>=0&&b.right<=innerWidth+2,rows:s.querySelectorAll('[data-test-slot]').length}}''')
   for name,ok in [('no-horizontal-overflow',not dims['overflow']),('board-visible',dims['valid']),('no-js-errors',not errs)]:out.append({'test':f'{w}/{mode}/{name}','pass':bool(ok),'detail':str(dims)})
  page.close()
 b.close()
result={'component':'F8-08','passed':sum(x['pass'] for x in out),'total':len(out),'failed':[x for x in out if not x['pass']],'checks':out};(R/'tests/F8-08-width-results.json').write_text(json.dumps(result,indent=2));print('WIDTH',result['passed'],'/',result['total'])
