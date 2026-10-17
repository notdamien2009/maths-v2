from pathlib import Path
from playwright.sync_api import sync_playwright
import json
base=Path(__file__).resolve().parents[1]
src=(base/'F5/F5-08-multiply-fractions.html').read_text()
rec=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for preset,bank in [('y7-023',[(2,3,6,12),(1,2,1,3),(3,2,6,15)]),('y8-006',[(5,3,30,16),(9,3,54,16),(5,3,15,12)])]:
  page=b.new_page(viewport={'width':380,'height':900},reduced_motion='reduce');errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
  page.set_content(src.replace(".get('preset')||'y7-023'",f".get('preset')||'{preset}'"),wait_until='domcontentloaded')
  page.locator('[data-m="challenge"]').click()
  for i,(a,c,num,den) in enumerate(bank):
   actual=page.evaluate('NOVA_F5_03_CONFIG._challenge.task()')
   rec.append({'preset':preset,'q':i+1,'name':'task-index','pass':actual==i,'actual':actual})
   page.evaluate('(x)=>{NOVA_F5_03_CONFIG._challenge.set(x.a,x.c);NOVA_F5_03_CONFIG._challenge.answer(x.n,x.d);}',{'a':a,'c':c,'n':num,'d':den})
   page.locator('button').filter(has_text='Check exact product').first.click()
   ok=page.locator('.nova-fb.ok').count()>0
   rec.append({'preset':preset,'q':i+1,'name':'equivalent-correct','pass':ok})
   if i<2:page.wait_for_timeout(1510)
  rec.append({'preset':preset,'name':'browser-errors','pass':not errs,'errors':errs})
  page.close()
 b.close()
json.dump({'checks':len(rec),'passed':sum(x['pass'] for x in rec),'failed':sum(not x['pass'] for x in rec),'cases':rec},open(base/'tests/f508-challenge-results.json','w'),indent=2)
print('CHALLENGE',sum(x['pass'] for x in rec),'/',len(rec),[(x['preset'],x['q'],x['name']) for x in rec if not x['pass']])
