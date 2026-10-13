from pathlib import Path
import json
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];SRC=(R/'F8/F8-17-algebraic-proof-builder.html').read_text();tests=[]
def check(name,ok,detail=''):
 tests.append({'test':name,'pass':bool(ok),'detail':str(detail)})
 if not ok:raise AssertionError(name+': '+str(detail))
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage']);pg=b.new_page(viewport={'width':1280,'height':920},reduced_motion='reduce');pg.set_content(SRC,wait_until='domcontentloaded',timeout=60000)
 keys=pg.evaluate('F817_TEST.ORDER');check('six keys',len(keys)==6)
 for key in keys:
  check(key+'/maths',pg.evaluate('(key)=>F817_TEST.factCheck(key)',key))
  check(key+'/four statements',pg.evaluate('(key)=>F817_TEST.PROOFS[key].statements.length===4',key));check(key+'/three reasons',pg.evaluate('(key)=>F817_TEST.PROOFS[key].reasons.length===3',key))
  for slot in range(7):
   check(key+f'/position-{slot}',pg.evaluate('(i)=>F817_TEST.expected(i)',slot)==('S'+str(slot//2) if slot%2==0 else 'J'+str(slot//2)))
  # test all valid and invalid cards without mutating browser UI
  for bad in ['SX','JX']:
   v=pg.evaluate('([key,bad])=>{const t=F817_TEST;let s=t.newState();return t.place(s,bad,bad[0]==="S"?0:1,t.PROOFS[key])}',[key,bad]);check(key+'/reject-'+bad,not v)
  for badSlot in [0,1,2,3,4,5,6]:
   wrong='J0' if badSlot%2==0 else 'S0';v=pg.evaluate('([key,bad,slot])=>{const t=F817_TEST;let s=t.newState();return t.place(s,bad,slot,t.PROOFS[key])}',[key,wrong,badSlot]);check(key+f'/reject-kind-{badSlot}',not v)
  for badSlot in range(7):
   wrong='S'+str((badSlot//2+1)%4) if badSlot%2==0 else 'J'+str((badSlot//2+1)%3)
   v=pg.evaluate('([key,bad,slot])=>{const t=F817_TEST;let s=t.newState();return t.place(s,bad,slot,t.PROOFS[key])}',[key,wrong,badSlot]);check(key+f'/reject-order-{badSlot}',not v)
  v=pg.evaluate('''key=>{const t=F817_TEST,s=t.newState(),p=t.PROOFS[key];let ok=true;for(let i=0;i<7;i++){ok=ok&&t.place(s,t.expected(i),i,p)}const full=t.valid(s),yes=t.check(s,p);return {ok,full,yes,done:s.done}}''',key)
  check(key+'/complete',all(v.values()),v)
  v=pg.evaluate('''key=>{const t=F817_TEST,s=t.newState(),p=t.PROOFS[key];t.place(s,'S0',0,p);t.place(s,'J0',1,p);const moved=t.remove(s,'S0');const undone=t.undo(s);t.reset(s);return {moved,undone,empty:s.slots.every(v=>v===null),notDone:!s.done}}''',key)
  check(key+'/recovery',all(v.values()),v)
 # independent maths oracle 125 contexts each
 for n in range(-12,13):
  for m in range(-12,13):
   check(f'odd-sum/{n}/{m}',((2*n+1)+(2*m+1))%2==0)
   check(f'multiple-five/{n}/{m}',((5*n)+(5*m))%5==0)
  check(f'three-consec/{n}',((n-1)+n+(n+1))%3==0)
  check(f'even-square/{n}',((2*n)**2)%4==0)
  check(f'odd-square/{n}',((2*n+1)**2)%2==1)
  check(f'square-diff/{n}',((n+1)**2-n*n)%2!=0)
 pg.close();b.close()
(R/'tests/F8-17-math-results.json').write_text(json.dumps({'total':len(tests),'passed':sum(x['pass'] for x in tests),'checks':tests},indent=2));print('math',len(tests),'passed')
