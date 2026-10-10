import asyncio,json,os
from pathlib import Path
from playwright.async_api import async_playwright
R=Path('/mnt/data/NOVA-F3-F0-CANONICAL-CORRECTION')
F=['array-builder','area-model-of-multiplication','partitioned-grid-method','factor-pair-rainbow']
async def main():
 allr=[];imgs=R/'screenshots';imgs.mkdir(exist_ok=True)
 async with async_playwright() as pw:
  browser=await pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-gpu'])
  for i,slug in enumerate(F,1):
   ident=f'F3-0{i}'
   for width in (380,1280):
    page=await browser.new_page(viewport={'width':width,'height':940},device_scale_factor=1)
    errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    url=f'http://127.0.0.1:18734/{ident}/F3/{ident}-{slug}.html'
    await page.set_content((R/ident/'F3'/f'{ident}-{slug}.html').read_text(),wait_until='domcontentloaded',timeout=90000);await page.wait_for_timeout(250)
    for mode in ('Watch','Guided','Explore','Challenge'):
     await page.get_by_role('tab',name=mode).click()
     await page.wait_for_timeout(180)
     state=await page.evaluate('''(id)=>{let c=document.getElementById(id),s=c?.querySelector('.nova-stage'),d=s?.querySelector('.nv-dock'),fig=d?.querySelector('.nv-dockfig'),bo=c?.querySelector('.nova-bob');return {stage:!!s,dock:!!d,fig:!!fig,helperVisible:!!fig&&fig.getBoundingClientRect().height>20,sirBob:!!bo,side:!!bo?.querySelector('img.nova-side'),speech:d?.querySelector('.nv-dockbub')?.textContent?.length||0,legacyDock:!!s?.querySelector('[class^="f301-dock"],[class^="f302-dock"],[class^="f303-dock"],[class^="f304-dock"]'),coreHash:window.NOVA?.version,stageH:Math.round(s?.getBoundingClientRect().height||0),svgNumbers:s?.querySelectorAll('.nv-numberline text')?.length||0,selHelper:NOVA.helperSkin}}''',ident)
     if ident=='F3-04':
      # inspect factor number line for exact min/max, uniform 1-unit tick positions and a sparse label set
      state['lineLabels']=await page.locator(f'#{ident} .nv-numberline text').all_text_contents()
     allr.append({'engine':ident,'width':width,'mode':mode,**state,'errors':list(errors)})
     if mode in ('Watch','Explore'):
      await page.locator(f'#{ident} .nova-stage').screenshot(path=str(imgs/f'{ident}-{width}-{mode.lower()}.png'))
    # switch helper to Maths Pip via global F0 helperbar and ensure dock changes when core updates
    beforeDock=await page.locator(f'#{ident} .nv-dockfig image').get_attribute('href')
    await page.get_by_role('button',name='Maths Pip').first.click()
    await page.wait_for_timeout(100)
    switched=await page.evaluate(f"()=>({{skin:NOVA.helperSkin,side:document.querySelector('#{ident} .nova-side')?.getAttribute('data-skin'),dockPose:document.querySelector('#{ident} .nv-dockfig image')?.getAttribute('href')?.slice(0,30)}})")
    afterDock=await page.locator(f'#{ident} .nv-dockfig image').get_attribute('href')
    assert beforeDock!=afterDock,(ident,'stage helper failed to change skin')
    assert switched['skin']=='pip' and switched['side']=='pip',(ident,switched)
    # during pose change the foot anchors must remain stable per core's own automated check
    await page.evaluate("NOVA.setHelperSkin('nova')")
    anchor=await page.evaluate("()=>NOVA.anchorCheck('nova').ok")
    assert anchor,ident+' anchor failure'
    await page.close()
  await browser.close()
 (R/'REGRESSION-RESULTS.json').write_text(json.dumps(allr,indent=2))
 for v in allr:
  print(v['engine'],v['width'],v['mode'], 'DOCK',v['dock'],'FIG',v['fig'],'BOB',v['sirBob'],'LEGACY',v['legacyDock'],'ERRORS',len(v['errors']), 'LABELS', v.get('lineLabels'))
 problems=[x for x in allr if x['errors'] or not all(x[k] for k in ['stage','dock','fig','helperVisible','sirBob','side','speech']) or x['legacyDock']]
 print('FAILURES',len(problems));(R/'REGRESSION-FAILURES.json').write_text(json.dumps(problems,indent=2))
 if problems: raise SystemExit(2)
asyncio.run(main())
