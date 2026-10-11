"""F6-01 deterministic maths correctness and rounding/relationship sweep."""
import json,random,math
from pathlib import Path
R=Path(__file__).resolve().parent.parent
P={
 'Y7-058':(3,5,2,'direct'), 'Y7-060':(2,6,3,'direct'),
 'Y7-061':(4,12,.25,'direct'), 'Y8-034':(.5,1.5,4,'direct'),
 'Y8-035':(2,7.5,3,'direct'), 'Y8-036':(1,3,5,'direct'),
 'Y8-037':(2,12,3,'inverse')
}
checks=[]
def check(label,cond):
 checks.append((label,bool(cond)))
 if not cond: raise AssertionError(label)
def pair(a,b,k,type_):return a*k,b/k if type_=='inverse' else b*k
for key,(a,b,k,t) in P.items():
 x,y=pair(a,b,k,t)
 check(key+' scale A',abs(x-a*k)<1e-8)
 check(key+' scale B',abs(y-(b/k if t=='inverse' else b*k))<1e-8)
 check(key+' relation',abs((x*y if t=='inverse' else y/x)-(a*b if t=='inverse' else b/a))<1e-8)
 check(key+' reversible',abs(x/k-a)<1e-8)
 if t=='inverse':check(key+' opposite operation',abs(y*k-b)<1e-8)
 else:check(key+' same operation',abs(y/k-b)<1e-8)
for name,a,b,k,t,expect in [
 ('Challenge 1',3,5,2,'direct',10),('Challenge 2',4,12,.25,'direct',3),
 ('Challenge 3',2,12,3,'inverse',4),('Challenge 4',.5,1.5,4,'direct',6)]:
 check(name+' answer',abs(pair(a,b,k,t)[1]-expect)<1e-9)
rng=random.Random(601)
for i in range(500):
 a=rng.randint(1,30)/rng.choice([1,2,4,10]);b=rng.randint(1,40)/rng.choice([1,2,4,10]);k=rng.choice([.25,.5,1,1.5,2,3,4,5,6]);t=rng.choice(['direct','inverse']);x,y=pair(a,b,k,t)
 check('random relationship %03d'%i,abs((x*y if t=='inverse' else y/x)-(a*b if t=='inverse' else b/a))<1e-8)
 check('random reverse %03d'%i,abs(x/k-a)<1e-9 and abs((y*k if t=='inverse' else y/k)-b)<1e-9)
report={'tests':len(checks),'passed':sum(v for _,v in checks),'failed':[label for label,ok in checks if not ok],'verified_presets':list(P),'scope':'maths only — not browser visuals/drag'}
(R/'tests/f601-math-results.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
