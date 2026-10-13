from pathlib import Path
import json
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];HTML=(R/'F8/F8-15-misconception-spotter.html').read_text();checks=[]
def check(n,cond,detail=''):
 checks.append({'test':n,'pass':bool(cond),'detail':str(detail)[:100]})
 if not cond:raise AssertionError(f'{n}: {detail}')
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage']);pg=b.new_page();pg.set_content(HTML,wait_until='domcontentloaded');models=pg.evaluate('F815_TEST.P');keys=pg.evaluate('F815_TEST.ORDER');
 check('six-master-presets',len(keys)==6)
 for key in keys:
  item=models[key]
  check(f'{key}/four-lines',len(item['lines'])==4)
  check(f'{key}/error-at-index-two',item['wrong']==2)
  check(f'{key}/first-error-is-different',item['lines'][2]!=item['correct'])
  check(f'{key}/three-repairs',len(item['fixes'])==3)
  check(f'{key}/only-one-valid-repair',sum(x==item['correct'] for x in item['fixes'])==1)
  check(f'{key}/teacher-stages',len(item['bob'])==6)
  # Verify pure model rejects wrong line/repair and accepts exact correct step.
  result=pg.evaluate('''(key)=>{const p=F815_TEST.P[key];let s=F815_TEST.fresh();let wrong=F815_TEST.locate(p,s,0);let correct=F815_TEST.locate(p,s,p.wrong);let bad=F815_TEST.fix(p,s,1);let good=F815_TEST.fix(p,s,0);return {wrong,correct,bad,good,solved:s.solved}}''',key)
  check(f'{key}/wrong-line-must-fail',not result['wrong'])
  check(f'{key}/correct-line-must-locate',result['correct'])
  check(f'{key}/wrong-correction-fails',not result['bad'])
  check(f'{key}/correct-correction-completes',result['good'] and result['solved'])
 # Independently computed mathematical anchors.
 check('negative-times-negative',(-3)*(-5)==15)
 check('negative-divided-by-positive',(-24)//6==-4)
 check('multiplication-before-addition',6+2*5==16)
 check('power-then-times-then-add',3+4*2**2==19)
 for x in (-8,-5,-4,-3,0,2):
  check(f'negative-coefficient-inequality/{x}',((-2*x)>8)==(x<(-4)))
 for x in (-7,-1,0,3,7,10):
  check(f'compound-inequality/{x}',((-6<=2*x-4) and (2*x-4<10))==((-1<=x) and (x<7)))
 b.close()
(R/'tests/F8-15-math-results.json').write_text(json.dumps({'passed':sum(x['pass'] for x in checks),'total':len(checks),'checks':checks},indent=2));print('math',sum(x['pass'] for x in checks),'/',len(checks))
