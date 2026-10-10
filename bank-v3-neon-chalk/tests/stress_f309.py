import json
from playwright.sync_api import sync_playwright
from pathlib import Path
R=Path(__file__).resolve().parents[1];logs=[]
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in [380,1280]:
  q=b.new_page(viewport={'width':width,'height':1000},reduced_motion='reduce')
  errors=[];q.on('pageerror',lambda e:errors.append(str(e)))
  q.set_content((R/'F3/F3-09-square-and-cube-builders.html').read_text())
  maths=q.evaluate('''() => {let m=F309_MATH,res=[];
    for(let p of [2,3])for(let n=2;n<=(p===2?5:4);n++){
     let total=m.total(n,p),a=new Set();res.push(total===(p===2?n*n:n*n*n));
     for(let i=0;i<total;i++){res.push(m.nextIndex(a,n,p)===i);a.add(i)}
     res.push(m.allBuilt(a,n,p));a.delete(total-1);res.push(!m.allBuilt(a,n,p));
     res.push(m.misconception(n,p,total)==='');res.push(!!m.misconception(n,p,total+1));
    }return {assertions:res.length,fail:res.filter(x=>!x).length}}''')
  assert maths['fail']==0,maths
  q.locator('#F3-09 button').filter(has_text='Challenge').first.click()
  results=[]
  for goal in [4,8,27]:
   for k in range(goal):
    q.locator('#F3-09 button').filter(has_text='Add unit').last.click()
   assert int(q.locator('#F3-09 .f309-svg').get_attribute('data-filled'))==goal
   q.locator('#F3-09 input[aria-label="Number of unit tiles or cubes in the complete shape"]').fill(str(goal))
   q.locator('#F3-09 button').filter(has_text='Check proof').last.click()
   results.append(goal)
  assert q.locator('#F3-09 .f309-win').count()==1
  q.locator('#F3-09 .nova-stage').screenshot(path=str(R/'shots'/f'F3-09-{width}-challenge-complete-stage.png'))
  logs.append(dict(width=width,maths=maths,challenge=results,won=True,errors=errors))
  q.close()
 b.close()
print(logs)
(R/'tests/STRESS-RESULTS.json').write_text(json.dumps(logs,indent=2))
assert all(not x['errors'] for x in logs)
