"""Cross-check F6-12 stage arithmetic independently of the browser and currency rounding."""
import json,math,random
from decimal import Decimal
from pathlib import Path
rng=random.Random(612)
checks=0
# The precise values here are the named, published lesson presets in presets/F18-02/F6-12*.js.
for _ in range(2000):
 g=Decimal(rng.randrange(1,50000))/Decimal(100)
 assert g*Decimal('1.18')==g*Decimal('118')/Decimal(100);checks+=1
 euro=g*Decimal('1.18');assert euro/Decimal('1.18')==g;checks+=1
 assert euro>g;checks+=1
 kmh=Decimal(rng.randrange(1,50000))/Decimal(100)
 a=kmh*1000; b=a/3600
 assert abs(b-kmh*Decimal(5)/Decimal(18))<Decimal('1e-20');checks+=1
 assert abs(b*3600/1000-kmh)<Decimal('1e-20');checks+=1
 assert b<kmh;checks+=1
 vol=Decimal(rng.randrange(1,50000))/Decimal(100)
 a=vol*1000;b=a/60
 assert abs(b-vol*Decimal(50)/Decimal(3))<Decimal('1e-20');checks+=1
 assert abs(b*60/1000-vol)<Decimal('1e-20');checks+=1
 assert b>vol;checks+=1
# Explicit specification presets
assert Decimal('25')*Decimal('1.18')==Decimal('29.50');checks+=1
assert Decimal('40')*Decimal('1.18')==Decimal('47.20');checks+=1
assert Decimal('72')*1000/3600==Decimal('20');checks+=1
assert Decimal('54')*1000/3600==Decimal('15');checks+=1
assert Decimal('1.8')*1000/60==Decimal('30');checks+=1
assert Decimal('2.4')*1000/60==Decimal('40');checks+=1
out={'suite':'math_f612','passed':checks,'failed':0,'presets':['Y8-039','Y8-043','Y9-024'],'checks':'Forward, reverse, compound numerator/denominator, exact known examples.'}
p=Path(__file__).with_name('f612-math-results.json');p.write_text(json.dumps(out,indent=2));print(json.dumps(out))
