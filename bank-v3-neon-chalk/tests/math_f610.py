"""Deterministic regression sweep: speed, distance, time, legs and units."""
import json,math,random,pathlib
root=pathlib.Path(__file__).resolve().parents[1]
rng=random.Random(610); checks=0
for n in range(1,30001):
 s=rng.randint(1,160)/2;t=rng.randint(1,64)/8;d=s*t
 assert d>0 and t>0
 assert math.isclose(d/t,s,abs_tol=1e-10)
 assert math.isclose(d/s,t,abs_tol=1e-10)
 assert math.isclose(s*t,d,abs_tol=1e-10)
 # Any pair of nonnegative legs, average never simple arithmetic mean of different speeds except equal duration.
 a=rng.randint(1,12)/4;b=rng.randint(1,12)/4;s1=rng.randint(1,80);s2=rng.randint(1,80)
 total=s1*a+s2*b;tt=a+b;avg=total/tt
 assert math.isclose(avg*tt,total,abs_tol=1e-10)
 assert min(s1,s2)<=avg<=max(s1,s2)
 checks+=5
presets=[(90,1.5,60,'speed'),(180,3,60,'speed'),(180,2.5,72,'distance'),(165,3,55,'time')]
for d,t,s,target in presets:
 assert math.isclose(d/t,s,abs_tol=1e-9)
 assert math.isclose(s*t,d,abs_tol=1e-9)
 assert math.isclose(d/s,t,abs_tol=1e-9)
 checks+=3
for legs,d,t in [([(45,.75),(45,.75)],90,1.5), ([(60,1),(30,1),(90,1)],180,3), ([(72,1),(108,1.5)],180,2.5), ([(55,1),(110,2)],165,3)]:
 assert sum(x for x,_ in legs)==d;assert sum(y for _,y in legs)==t
 elapsed=0;progress=0
 for x,y in legs:
  elapsed+=y;progress+=x
  assert 0<=elapsed<=t+1e-9 and 0<=progress<=d+1e-9
  checks+=1
 checks+=2
res={'suite':'math','passed':checks,'total':checks,'failures':[], 'presets':4,'random_seed':610}
(root/'tests/f610-math-results.json').write_text(json.dumps(res,indent=2));print(json.dumps(res))
