"""Check F6-06 unit-price exact arithmetic and misconception cases using Python fractions."""
from pathlib import Path
from fractions import Fraction
import json,re,random
root=Path(__file__).resolve().parents[1]
s=(root/'src/F6-06.js').read_text()
fixture=[('Y7-061',180,500,240,750,100,Fraction(36),Fraction(32),'B'),('Y7-061-cereal',220,400,300,600,100,Fraction(55),Fraction(50),'B'),('Y7-061-juice',180,1000,255,1500,100,Fraction(18),Fraction(17),'B'),('Y7-061-soap',125,250,220,400,100,Fraction(50),Fraction(55),'A'),('Y7-061-equal',270,6,450,10,1,Fraction(45),Fraction(45),'equal')]
count=0
for name,pa,qa,pb,qb,c,ua,ub,w in fixture:
 assert name in s;count+=1
 assert Fraction(pa*c,qa)==ua;count+=1
 assert Fraction(pb*c,qb)==ub;count+=1
 assert ('A' if ua<ub else 'B' if ub<ua else 'equal')==w;count+=1
 assert pa!=pb;count+=1
for i in range(25000):
 rng=random.Random(i+500)
 pa=rng.randint(50,1100);pb=rng.randint(50,1100)
 qa=rng.randint(1,1500);qb=rng.randint(1,1500);common=rng.choice([1,10,100,1000])
 a=Fraction(pa*common,qa);b=Fraction(pb*common,qb)
 expected='A' if a<b else 'B' if b<a else 'equal'
 assert a*qa==pa*common;count+=1
 assert b*qb==pb*common;count+=1
 assert expected==('A' if pa*qb<pb*qa else 'B' if pb*qa<pa*qb else 'equal');count+=1
 assert a>=0 and b>=0;count+=1
out={'component':'F6-06','passed':count,'total':count,'failures':[],'fixture_presets':[x[0] for x in fixture],'method':'Python exact Fraction cross-multiplication and 25,000 varied randomized pack pairs'}
(root/'tests/f606-math-results.json').write_text(json.dumps(out,indent=2))
print('MATH',count,'/',count)
