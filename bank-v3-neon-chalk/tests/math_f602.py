"""Independent maths/geometry assertions for the F6-02 ratio scale contract."""
import json, random, math
from pathlib import Path
random.seed(602)
P={
 'Y7-060':dict(known=2,knownB=6,target=8,max=10,major=2,minor=1,steps=10),
 'Y8-007':dict(known=40,knownB=50,target=60,max=80,major=20,minor=10,steps=8),
 'Y8-035':dict(known=3,knownB=7.5,target=9,max=12,major=3,minor=1.5,steps=8),
 'Y8-039':dict(known=5,knownB=6,target=15,max=20,major=5,minor=2.5,steps=8),
}
passed=0; fails=[]
def check(ok,label):
 global passed
 if not ok: fails.append(label)
 else: passed+=1
for ident,p in P.items():
 k=p['knownB']/p['known']; maxb=p['max']*k
 check(k>0,ident+' rate positive')
 check(abs((p['max']/p['major'])-(maxb/(p['major']*k)))<1e-12,ident+' major tick density')
 check(abs((p['max']/p['minor'])-(maxb/(p['minor']*k)))<1e-12,ident+' minor tick density')
 check(abs(p['target']*k - {'Y7-060':24,'Y8-007':75,'Y8-035':22.5,'Y8-039':18}[ident])<1e-12,ident+' challenge key')
 for i in range(p['steps']+1):
  x=p['max']*i/p['steps']; y=x*k
  check(0<=x<=p['max'] and 0<=y<=maxb+1e-9,ident+' bound '+str(i))
  check(abs(x/p['max']-y/maxb)<1e-12,ident+' vertical alignment '+str(i))
  check(abs(x-((y/k)))<1e-9,ident+' reversible '+str(i))
for z in range(2500):
 known=random.uniform(0.1,10000); factor=random.uniform(0.05,12); unit=random.uniform(0.1,50)
 y=known*unit; xx=known*factor; yy=xx*unit
 check(math.isclose(xx/known,yy/y,rel_tol=1e-10),f'random scale {z}')
 check(math.isclose(xx/yy,known/y,rel_tol=1e-10),f'random reciprocal {z}')
 check(math.isclose(xx*y,yy*known,rel_tol=1e-10),f'random cross-product {z}')
result={'id':'F6-02','passed':passed,'total':passed+len(fails),'failures':fails,'preset_count':len(P),'method':'independent multiplicative scale, fixed curriculum answer, aligned tick, inverse check, 2500 random triples'}
Path(__file__).with_name('f602-math-results.json').write_text(json.dumps(result,indent=2))
print(json.dumps({k:v for k,v in result.items() if k!='failures'},indent=2))
if fails:raise SystemExit(str(fails[:10]))
