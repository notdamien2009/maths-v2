import asyncio, json
from pathlib import Path
from playwright.async_api import async_playwright
R=Path('/mnt/data/NOVA-F3-04-NUMBERLINE-VALUES'); F=R/'F3/F3-04-factor-pair-rainbow.html'
async def main():
 results=[]
 async with async_playwright() as pw:
  browser=await pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-gpu'])
  for w in [380,1280]:
   p=await browser.new_page(viewport={'width':w,'height':1000},device_scale_factor=1)
   errs=[]; p.on('pageerror',lambda e:errs.append(str(e)))
   await p.set_content(F.read_text(),wait_until='domcontentloaded',timeout=90000)
   await p.wait_for_timeout(300)
   for mode in ['Watch','Guided','Explore','Challenge']:
    await p.get_by_role('tab',name=mode).click();await p.wait_for_timeout(120)
    if mode == 'Explore':
     for n in [12,13,18,21,24,36]:
      await p.locator('#F3-04 input[type=number]').fill(str(n));await p.locator('#F3-04 input[type=number]').dispatch_event('change'); await p.wait_for_timeout(50)
      vals=await p.locator('#F3-04 .nv-numberline text').all_text_contents()
      # Important: must verify each number is visible as direct core label, not an aria attr.
      expected=[str(i) for i in range(n+1)]
      valid=(vals == expected)
      rects=await p.locator('#F3-04 .nv-numberline text').evaluate_all('(els)=>els.map(e=>{const b=e.getBoundingClientRect();return {x:b.x,y:b.y,w:b.width,h:b.height}})')
      overlap=sum(rects[i]['x']+rects[i]['w']>rects[i+1]['x']+.8 and rects[i]['y']+rects[i]['h']>rects[i+1]['y']+.8 and rects[i+1]['y']+rects[i+1]['h']>rects[i]['y']+.8 for i in range(len(rects)-1))
      results.append({'width':w,'mode':mode,'n':n,'allValues':valid,'count':len(vals),'overlappingAdjacent':overlap,'errors':errs[:]})
      if n in [24,36]:await p.locator('#F3-04 .nova-stage').screenshot(path=str(R/'shots'/f'F3-04-{w}-explore-{n}.png'))
    else:
     vals=await p.locator('#F3-04 .nv-numberline text').all_text_contents()
     n=24 if mode!='Challenge' else 12
     results.append({'width':w,'mode':mode,'n':n,'allValues':vals == [str(i) for i in range(n+1)],'count':len(vals),'errors':errs[:]})
     await p.locator('#F3-04 .nova-stage').screenshot(path=str(R/'shots'/f'F3-04-{w}-{mode.lower()}.png'))
   await p.close()
  await browser.close()
 (R/'tests/line-results.json').write_text(json.dumps(results,indent=2))
 for r in results:print(r)
 assert all(r['allValues'] and not r['errors'] for r in results)
 assert all(r.get('overlappingAdjacent',0)==0 for r in results)
asyncio.run(main())
