import json
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1]
out=[];assertions=0
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for width in [380,1280]:
  page=browser.new_page(viewport={'width':width,'height':1040},reduced_motion='reduce')
  err=[];page.on('pageerror',lambda x:err.append(str(x)))
  page.set_content((R/'F3/F3-08-multiples-overlap-tracks.html').read_text(),wait_until='domcontentloaded')
  page.locator('#F3-08 button').filter(has_text='Challenge').first.click()
  q=page.evaluate('''()=>{let checks=0,fail=[];for(let a=2;a<=12;a++)for(let b=2;b<=12;b++){let m=F308_MATH,L=m.lcm(a,b),max=m.limit(a,b);let cm=m.common(a,b,max);if(cm[0]!==L)fail.push('First common '+a+','+b);checks++;if(L>max)fail.push('Clipped LCM '+a+','+b);checks++;if(m.reason(a,b,L)!=='')fail.push('Correct rejected '+a+','+b);checks++;if(m.valid(a,b,L*2))fail.push('Later accepted '+a+','+b);checks++;if(m.valid(a,b,0))fail.push('Zero accepted');checks++;}return {checks,fail}}''')
  assert not q['fail'],q
  assertions+=q['checks']
  for task,(a,b,L) in enumerate([(3,4,12),(4,6,12),(6,8,24)]):
   assert page.locator('#F3-08 .f308-svg').get_attribute('data-lcm')==str(L)
   assert page.locator('#F3-08 .nv-numberline').count()==2
   assert not page.locator('#F3-08 .f308-svg').text_content().__contains__(f'LCM({a}, {b}) = {L}'), 'LCM prematurely revealed'
   # wrong ring first: one-track-only multiple (a when a!=b)
   wrong=a if a%b else b
   page.locator('#F3-08 input[aria-label="Landing to mark"]').fill(str(wrong))
   page.locator('#F3-08 button').filter(has_text='Place ring').click()
   assert 'only' in page.locator('#F3-08 .f308-status').inner_text() or 'FIRST' in page.locator('#F3-08 .f308-status').inner_text()
   assertions+=1
   page.locator('#F3-08 input[aria-label="Landing to mark"]').fill(str(L))
   page.locator('#F3-08 button').filter(has_text='Place ring').click()
   assert page.locator('#F3-08 .f308-svg [data-marker="1"]').count()==1
   assert not page.locator('#F3-08 .f308-svg').text_content().__contains__(f'LCM({a}, {b}) = {L}'), 'LCM prematurely revealed after placing marker'
   assertions+=2
   page.locator('#F3-08 input[aria-label="Lowest common multiple answer"]').fill(str(L*2))
   page.locator('#F3-08 button').filter(has_text='Check proof').click()
   assert 'FIRST' in page.locator('#F3-08 .f308-status').inner_text()
   assertions+=1
   page.locator('#F3-08 input[aria-label="Lowest common multiple answer"]').fill(str(L))
   page.locator('#F3-08 button').filter(has_text='Check proof').click()
   assertions+=1
  assert 'All three' in page.locator('#F3-08 .f308-win').inner_text()
  assert page.locator('#F3-08 .nv-dock').count()==1
  assert not err,err
  assertions+=3
  page.screenshot(path=str(R/'shots'/f'F3-08-{width}-challenge-complete.png'),full_page=False)
  out.append({'width':width,'mathChecks':q['checks'],'failedMathChecks':0,'challengeProofs':3,'browserErrors':err,'result':'passed'})
  page.close()
 browser.close()
(R/'tests/STRESS-RESULTS.json').write_text(json.dumps({'assertions':assertions,'failures':0,'details':out},indent=2))
print(json.dumps({'assertions':assertions,'failures':0,'details':out},indent=2))
