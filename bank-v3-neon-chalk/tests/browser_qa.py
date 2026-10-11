import json,threading,functools,http.server
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parent.parent
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(R/'F3')))
threading.Thread(target=server.serve_forever,daemon=True).start()
url=f'http://127.0.0.1:{server.server_port}/F3-15-surd-and-exact-value-builder.html'
results=[]
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for width in [380,1280]:
  page=browser.new_page(viewport={'width':width,'height':900},reduced_motion='reduce')
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  try:
   page.set_content((R/'F3/F3-15-surd-and-exact-value-builder.html').read_text(),wait_until='domcontentloaded',timeout=30000);page.wait_for_timeout(1000)
   print('body',width,page.locator('body').inner_text()[-850:])
   print('Modes',page.get_by_role('button').all_text_contents()[:35]);print('img',page.locator('img').count())
   for mode in ['Watch','Guided','Explore','Challenge']:
    loc=page.get_by_role('tab',name=mode,exact=True)
    if loc.count():loc.first.click();page.wait_for_timeout(350)
    stage=page.locator('.nova-stage');svg=page.locator('.f315-svg');
    results.append({'width':width,'mode':mode,'stage':stage.count(),'svg':svg.count(),'errors':list(errors),'horizontalOverflow':page.evaluate('document.documentElement.scrollWidth>innerWidth')})
    if stage.count():
     stage.screenshot(path=str(R/'shots'/f'F3-15-{width}-{mode.lower()}-stage.png'));page.screenshot(path=str(R/'shots'/f'F3-15-{width}-{mode.lower()}.png'))
  except Exception as e:print('ERR',width,str(e))
  page.close()
 browser.close()
(R/'tests/BROWSER-RESULTS.json').write_text(json.dumps(results,indent=2))
print(json.dumps(results,indent=2))
server.shutdown()
