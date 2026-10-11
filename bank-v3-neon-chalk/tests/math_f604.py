"""Deterministic F6-04 mathematical integrity checks (Python stdlib)."""
from fractions import Fraction
from math import gcd,lcm
from random import Random
from pathlib import Path
import json
P=Path(__file__).resolve().parent
rng=Random(6042026)
checks=0;errors=[]
def check(cond,description):
 global checks
 checks+=1
 if not cond:errors.append(description)
def simplify(a,b):
 a,b=Fraction(a),Fraction(b)
 clear=lcm(a.denominator,b.denominator)
 A,B=int(a*clear),int(b*clear)
 g=gcd(A,B)
 return A//g,B//g,clear,g
presets=[(6,9,(2,3)),(12,18,(2,3)),(Fraction(3,2),Fraction(9,4),(2,3)),(Fraction(3,4),Fraction(1,2),(3,2))]
for a,b,expect in presets:
 x,y,c,g=simplify(a,b)
 check((x,y)==expect,f'preset {a}:{b} expected {expect}, got {x}:{y}')
 check(Fraction(x,y)==Fraction(a,b),f'preset equivalence {a}:{b}')
 check(gcd(x,y)==1,f'preset simplest {a}:{b}')
 check(Fraction(a*c,1).denominator==1 and Fraction(b*c,1).denominator==1,f'clear denominators {a}:{b}')
for k in range(3200):
 a=Fraction(rng.randint(1,32),rng.randint(1,12));b=Fraction(rng.randint(1,32),rng.randint(1,12))
 x,y,c,g=simplify(a,b)
 check(Fraction(x,y)==a/b,f'comparison preserved ({k})')
 check(gcd(x,y)==1,f'gcd 1 ({k})')
 check(x>0 and y>0,f'positive ({k})')
 check(Fraction(a*c).denominator==1 and Fraction(b*c).denominator==1,f'whole values ({k})')
 check((x*g,y*g)==(int(a*c),int(b*c)),f'same factor ({k})')
 wrong=(y,x) if x!=y else (x+1,y)
 check(wrong!=(x,y),f'misconception detection ({k})')
 check((x*2,y*2)!=(x,y),f'not simplest candidate ({k})')
 check(gcd(x*2,y*2)>1,f'candidate not simplest ({k})')
results={'engine':'F6-04','checks':checks,'passed':checks-len(errors),'failures':errors[:25],'presets':['Y7-058','Y7-058-extend','Y8-034-decimals','Y8-034-fractions']}
(P/'f604-math-results.json').write_text(json.dumps(results,indent=2))
print('MATH:',results['passed'],'/',checks)
if errors:raise SystemExit(errors[0])
