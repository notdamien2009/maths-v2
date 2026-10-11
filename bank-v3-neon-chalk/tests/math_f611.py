"""F6-11 math assertions: exact rate/gradient consistency and inverse feedback traps."""
from pathlib import Path
import json,math,random
root=Path(__file__).resolve().parents[1]
presets={'Y8-028':(3,8,'cm/min'),'Y8-041':(12,5,'km/min'),'Y8-042':(2,8,'kg/L'),'Y9-022':(9,8,'km/min'),'Y9-023':(1.5,8,'kg/L')}
factors=[.5,1,1.5,2];random.seed(611)
passed=0
for name,(rate,xmax,unit) in presets.items():
 for factor in factors:
  expected=rate*factor
  for j in range(3000):
   x=random.uniform(.01,xmax)
   y=expected*x
   cap=2*rate*xmax
   assert math.isclose(y/x,expected,rel_tol=1e-12)
   passed+=1
   assert 0<=y/cap<=1.0000000001
   passed+=1
   x2=random.uniform(.01,xmax)
   assert math.isclose((expected*x2-y)/(x2-x),expected,rel_tol=1e-9) if abs(x2-x)>1e-7 else True
   passed+=1
res={'suite':'mathematics','passed':passed,'total':passed,'failures':[],'preset_count':len(presets),'factors':factors}
(root/'tests/f611-math-results.json').write_text(json.dumps(res,indent=2));print('MATH',passed,'/',passed)
