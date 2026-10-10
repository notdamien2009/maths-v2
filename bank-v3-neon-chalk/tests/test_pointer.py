import asyncio,json
from pathlib import Path
from playwright.async_api import async_playwright
R=Path(__file__).resolve().parent.parent
async def run():
 out={'viewports':{},'assertions':0,'fails':0,'gestures':0,'errors':[]}
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
  for width in [380,1280]:
   page=await b.new_page(viewport={'width':width,'height':950},reduced_motion='reduce')
   page.on('pageerror',lambda e:out['errors'].append(str(e)))
   await page.set_content((R/'F3/F3-04-factor-pair-rainbow.html').read_text(),wait_until='domcontentloaded')
   await page.locator('#F3-04 .nova-tab').filter(has_text='Challenge').click()
   res=[];out['viewports'][str(width)]=res
   async def ck(val,s):
    out['assertions']+=1
    if not val:out['fails']+=1;res.append('FAIL '+s)
    else:res.append('OK '+s)
   async def xy(x,y):
    return await page.locator('#F3-04 .f304-svg').evaluate('''(svg,pos)=>{let p=svg.createSVGPoint();p.x=pos[0];p.y=pos[1];let q=p.matrixTransform(svg.getScreenCTM());return {x:q.x,y:q.y}}''',[x,y])
   async def gesture(p1,p2):
    out['gestures']+=1
    await page.locator('#F3-04 .f304-svg').scroll_into_view_if_needed()
    st=await xy(*p1);en=await xy(*p2)
    await page.mouse.move(st['x'],st['y']);await page.mouse.down();
    await page.mouse.move(en['x'],en['y'],steps=12);await page.mouse.up();await page.wait_for_timeout(110)
   x12=744
   # 4 wrong drags: must reject and recover
   for k in range(4):
    await gesture((620,302),(94+8/12*650,450))
    await ck('Candidate 1' in await page.locator('#F3-04 .f304-intro').inner_text(),f'wrong drop {k+1} rejected')
    await ck(await page.evaluate('NOVA.ui._drag===null'),f'wrong drop {k+1} has no stranded drag')
   # two outside-viewport drops
   for k in range(2):
    await gesture((620,302),(410,335))
    await ck(await page.evaluate('NOVA.ui._drag===null'),f'outside drop {k+1} cancels')
   # moving then Escape
   for k in range(2):
    out['gestures']+=1
    await page.locator('#F3-04 .f304-svg').scroll_into_view_if_needed()
    st=await xy(620,302);en=await xy(540,340)
    await page.mouse.move(st['x'],st['y']);await page.mouse.down();await page.mouse.move(en['x'],en['y'],steps=6)
    await page.keyboard.press('Escape');await page.mouse.up();await page.wait_for_timeout(120)
    await ck(await page.evaluate('NOVA.ui._drag===null'),f'Escape {k+1} clears drag')
   # valid drop to 12
   await gesture((620,302),(x12,450))
   await ck('Candidate 2' in await page.locator('#F3-04 .f304-intro').inner_text(),'correct drop advances to candidate two')
   await ck(await page.locator('#F3-04 [data-locked-end="1"]').count()==1,'valid arc has removable endpoint')
   await ck(await page.evaluate('NOVA.ui._drag===null'),'accepted drag is cleared')
   # drag locked endpoint to red remove zone: must reset candidate one
   await gesture((x12,442),(465,640))
   await ck('Candidate 1' in await page.locator('#F3-04 .f304-intro').inner_text(),'placed endpoint removes via red tray')
   await ck(await page.locator('#F3-04 [data-locked-end="1"]').count()==0,'removed endpoint no longer on stage')
   await ck(await page.evaluate('NOVA.ui._drag===null'),'remove clears drag')
   # regrab and accept a second time
   await gesture((620,302),(x12,450))
   await ck('Candidate 2' in await page.locator('#F3-04 .f304-intro').inner_text(),'previously removed pair can be placed again')
   await ck(await page.evaluate('NOVA.ui._drag===null'),'regrab drag clears')
   await page.close()
  await b.close()
 (R/'POINTER-RESULTS.json').write_text(json.dumps(out,indent=2))
 print('assertions',out['assertions'],'fails',out['fails'],'gestures',out['gestures'],'errors',out['errors'])
 for w,r in out['viewports'].items():print(w,*r,sep='\n  ')
asyncio.run(run())
