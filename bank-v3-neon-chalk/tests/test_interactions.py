import asyncio,json,traceback
from pathlib import Path
from playwright.async_api import async_playwright
R=Path(__file__).resolve().parent.parent
async def main():
 out={'runs':{},'errors':[],'assertions':0,'failed':0}
 async with async_playwright() as p:
  b=await p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
  for width in (380,1280):
   page=await b.new_page(viewport={'width':width,'height':1100},reduced_motion='reduce')
   page.on('pageerror',lambda e:out['errors'].append(str(e)))
   await page.set_content((R/'F3/F3-04-factor-pair-rainbow.html').read_text(),wait_until='domcontentloaded',timeout=90000)
   async def check(cond,label):
    out['assertions']+=1
    if not cond:out['failed']+=1;out['runs'].setdefault(str(width),[]).append('FAIL: '+label)
    else:out['runs'].setdefault(str(width),[]).append('OK: '+label)
   # Complete 3 challenge proofs using user-visible controls.
   await page.locator('#F3-04 .nova-tab').filter(has_text='Challenge').click()
   tasks=[(12,[(1,12),(2,6),(3,4)]),(18,[(1,18),(2,9),(3,6),(4,None)]),(13,[(1,13),(2,None),(3,None)])]
   # erroneous classification must not advance
   await page.get_by_role('button',name='No exact partner').click()
   await check('Candidate 1' in (await page.locator('#F3-04 .f304-intro').inner_text()),'incorrect No partner rejected')
   await page.locator('#F3-04 select[aria-label="Choose matching factor"]').select_option('7')
   await page.get_by_role('button',name='Join endpoints').click()
   await check('Candidate 1' in (await page.locator('#F3-04 .f304-intro').inner_text()),'incorrect factor rejected')
   for task_idx,(n,items) in enumerate(tasks):
    for a,bv in items:
     intro=await page.locator('#F3-04 .f304-intro').inner_text()
     await check(f'Candidate {a} ' in intro,f'challenge {n} candidate {a} matches')
     if bv is None:await page.get_by_role('button',name='No exact partner').click()
     else:
      await page.locator('#F3-04 select[aria-label="Choose matching factor"]').select_option(str(bv))
      await page.get_by_role('button',name='Join endpoints').click()
   await check(await page.locator('#F3-04 .f304-complete').count()==1,'all three challenge proofs complete')
   # Explore primes and square preset; mathematical arcs.
   await page.locator('#F3-04 .nova-tab').filter(has_text='Explore').click()
   await page.locator('#F3-04 select[aria-label="Factor-pair preset"]').select_option('Y7-014-prime')
   await check((await page.locator('#F3-04 .f304-arch').count())==1,'prime shows exactly one pair initially')
   await page.get_by_role('button',name='Show complete factor proof').click()
   await check((await page.locator('#F3-04 .f304-arch').count())==1,'prime proof retains one pair')
   await page.locator('#F3-04 select[aria-label="Factor-pair preset"]').select_option('Y7-013-square')
   await page.get_by_role('button',name='Show complete factor proof').click()
   await check(await page.locator('#F3-04 .f304-arch').count()==4,'square 36 four regular arches and one central square pair')
   await check(await page.locator('#F3-04 .nv-numberline').count()==1,'only core numberline rendered')
   await check(await page.evaluate('NOVA.ui._drag===null'),'no active drag after keyboard interactions')
   await page.close()
  await b.close()
 (R/'TEST-INTERACTIONS.json').write_text(json.dumps(out,indent=2))
 print('assertions',out['assertions'],'failed',out['failed'],'errors',out['errors'])
 print(json.dumps(out,indent=2)[-2500:])
asyncio.run(main())
