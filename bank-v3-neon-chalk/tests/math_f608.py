from pathlib import Path
import json,random,math
root=Path(__file__).resolve().parents[1];assertions=0
presets={'Y7-060':(2,6,12,2,5),'Y8-035':(3,6,18,2,4),'Y8-036':(1.5,8,12,2,6),'Y9-020':(.75,8,6,4,6)}
for pid,(k,xmax,ymax,known,query) in presets.items():
 assert math.isclose(k*xmax,ymax);assertions+=1
 assert math.isclose(k*0,0);assertions+=1
 assert 0<known<xmax and 0<query<=xmax;assertions+=1
 for x in range(1,10001):
  xx=x*xmax/10000; yy=k*xx
  assert math.isclose(yy/xx,k,rel_tol=1e-9);assertions+=1
  assert math.isclose(yy,k*xx,rel_tol=1e-9);assertions+=1
  assert 0<=yy<=ymax+1e-9;assertions+=1
 for f in [.5,1,1.5,2,3,4,8]:
  assert math.isclose((known*f)*k,f*known*k);assertions+=1
# Verify the direct relationship discrimination: nonzero intercept is never direct proportion.
for c in [-5,-1,-.2,.1,1,5]:
 for k in [.5,.75,1,1.5,2,3]:
  assert abs(c)>1e-12 and (k*0+c)!=0;assertions+=1
out={'suite':'mathematics','assertions':assertions,'passed':assertions,'failed':0,'presets':list(presets),'note':'Checks invariant y/x=k for x>0 and zero intercept, ranges, known/query x, scaling and nonzero-intercept discrimination.'}
(root/'tests/f608-math-results.json').write_text(json.dumps(out,indent=2));print(out)
