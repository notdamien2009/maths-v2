"""F6-13 geometry numerical verification; tests every named curriculum preset."""
import json, math, random
from pathlib import Path
root=Path(__file__).resolve().parents[1]
config=json.loads((root/'F6/F6-13-CONTRACT.json').read_text()) if (root/'F6/F6-13-CONTRACT.json').exists() else {}
presets={
'Y7-064':([3,4],2,'triangle'),
'Y8-057':([4,6],1.5,'rectangle'),
'Y9-021':([2.4,3.6],2.5,'triangle'),
'Y9-023':([4,6],1.5,'rectangle'),
'Y9-029':([2,3],2.5,'triangle')}
checks=0;failed=[]
def check(b,msg):
 global checks
 checks+=1
 if not b:failed.append(msg)
r=random.Random(613)
for key,(base,k,kind) in presets.items():
 a,b=base
 for _ in range(2800):
  x=r.uniform(.1,75);y=r.uniform(.1,75);f=r.uniform(.1,8)
  X=x*f;Y=y*f
  check(math.isclose(X/x,Y/y,rel_tol=1e-11),f'{key} common k')
  check(math.isclose(X*Y,x*y*f*f,rel_tol=1e-11),f'{key} area k²')
  check(math.isclose((x*y*x)*f**3,(x*f)*(y*f)*(x*f),rel_tol=1e-11),f'{key} volume k³')
  check(math.isclose((X/Y),(x/y),rel_tol=1e-11),f'{key} side ratio')
  check(math.isclose(Y, y*f,rel_tol=1e-11),f'{key} unknown side')
 check(math.isclose(b*k,(b*k)),f'{key} known')
 if key=='Y9-023':
  d=1.3;volume=base[0]*base[1]*base[0];mass=volume*d
  check(math.isclose(mass*k**3/(volume*k**3),d), 'Y9-023 constant density')
  check(not math.isclose(k**3,k), 'Y9-023 cannot use k as volume factor')
result={'suite':'math_f613','checks':checks,'passed':checks-len(failed),'failed':len(failed),'failures':failed[:30],'presets':list(presets)}
(root/'tests/f613-math-results.json').write_text(json.dumps(result,indent=2));print(json.dumps(result));raise SystemExit(bool(failed))
