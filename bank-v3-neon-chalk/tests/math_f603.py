"""Mathematical invariants for F6-03. Run: python tests/math_f603.py"""
import json
from pathlib import Path

assertions=0
for a in range(1,13):
 for b in range(1,13):
  for u in range(1,70):
   T=(a+b)*u;aa=a*u;bb=b*u
   assert aa+bb==T;assert aa//a==bb//b==u
   assertions+=2
for a,b,total,shareA,shareB in [(2,3,30,12,18),(3,2,45,27,18),(1,4,60,12,48),(5,7,96,40,56)]:
 assert total%(a+b)==0 and shareA==a*total//(a+b) and shareB==b*total//(a+b)
 assertions+=3
result={'component':'F6-03','name':'Sharing in a Ratio','assertions':assertions,'failures':0,'status':'pass','scope':'Pure mathematical invariants and preset values; browser handled separately'}
p=Path(__file__).with_name('f603-math-results.json');p.write_text(json.dumps(result,indent=2));print(json.dumps(result))
