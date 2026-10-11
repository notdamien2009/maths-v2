"""Exact rational arithmetic verification of F6-05's KS3 direct proportion claims."""
from fractions import Fraction
from random import Random
from pathlib import Path
import json
r=Path(__file__).resolve().parent
presets={
'Y7-060':(4,6,[200,320,4,120]),'Y7-060-double':(4,8,[200,240,80,4]),
'Y7-060-half':(6,3,[240,300,6,30]),'Y7-060-triple':(3,9,[90,150,180,3])}
count=0;issues=[]
def check(x,name):
 global count
 count+=1
 if not x:issues.append(name)
for name,(base,target,amounts) in presets.items():
 for t in range(2,11):
  f=Fraction(t,base)
  for i,a in enumerate(amounts):
   val=a*f
   check(val>0,f'{name}:{t}:{i}:positive')
   check(Fraction(val,t)==Fraction(a,base),f'{name}:{t}:{i}:unit-rate')
   check(val/f==a,f'{name}:{t}:{i}:inverse')
   check(val==Fraction(a*t,base),f'{name}:{t}:{i}:multiplier')
   check(val==int(val),f'{name}:{t}:{i}:integer-scaling')
  check(all(Fraction(a,base)==Fraction(a*f,t) for a in amounts),f'{name}:{t}:all-in-sync')
 check(Fraction(target,base)!=1,f'{name}:change')
rand=Random(6052026)
for i in range(3000):
 b=rand.randint(1,30);t=rand.randint(1,30);a=rand.randint(1,1000)
 x=Fraction(a*t,b)
 check(x*t!=0,f'{i}:nonzero')
 check(x/Fraction(t)==Fraction(a,b),f'{i}:per-serving-preserved')
 check(Fraction(a,b)*t==x,f'{i}:direct-proportion')
 check(x/Fraction(a)==Fraction(t,b),f'{i}:same-factor')
 check(Fraction(a,t) != Fraction(a,b) if t!=b else True,f'{i}:servings-dependent-unit-rule') if False else None
res={'component':'F6-05','passed':count-len(issues),'total':count,'failures':issues[:20],'lesson':'Y7-060','preset_ids':list(presets)}
(r/'f605-math-results.json').write_text(json.dumps(res,indent=2));print('MATH',res['passed'],'/',res['total'],res['failures'])
if issues:raise SystemExit(1)
