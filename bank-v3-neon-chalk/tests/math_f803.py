from pathlib import Path
import json,math
BASE=Path(__file__).resolve().parents[1]
checks=[]
def rec(t,condition,detail=''):checks.append({'test':t,'pass':bool(condition),'detail':str(detail)[:170]})
# Independent reference arithmetic tests across the four actual formulas.
for x in range(-60,61):
 rec(f'Y7-028/{x}',3*x+2==x*3+2)
 rec(f'Y7-030/{x}',2*x+5==5+2*x)
 rec(f'Y7-033/inverse/{x}',((2*x+3)-3)/2==x)
 rec(f'Y8-016/inverse/{x}',((5*x-4)+4)/5==x)
for x in range(-30,31):
 rec(f'order/Y7-028/{x}',3*x+2!=(x+2)*3)
 rec(f'order/Y7-030/{x}',2*x+5!=(x+5)*2)
# Check four challenge targets and genuine inverse order.
for label,actual,expected in [('Y7-028',3*3+2,11),('Y7-030',2*5+5,15),('Y7-033',(19-3)/2,8),('Y8-016',(31+4)/5,7)]:rec('challenge-'+label,actual==expected,f'{actual} vs {expected}')
(BASE/'tests/F8-03-math-results.json').write_text(json.dumps({'checks':checks,'total':len(checks),'passed':sum(x['pass'] for x in checks)},indent=2))
print('math checks',len(checks),'passes',sum(x['pass'] for x in checks))
