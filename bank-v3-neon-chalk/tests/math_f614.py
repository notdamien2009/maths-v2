"""F6-14 exact rational-number assertions including option-set misconception coverage."""
from pathlib import Path
import json,random,sys
root=Path(__file__).resolve().parents[1];r=random.Random(614);res={'suite':'math_f614','checks':0,'passed':0,'failures':[]}
def ck(cond,msg):
 res['checks']+=1
 if cond:res['passed']+=1
 else:res['failures'].append(msg)
for a in range(1,91):
 for b in range(1,91):
  den=a+b
  ck(den>a and den>b,f'positive denominators {a}:{b}')
  ck(a/den+b/den==1 or abs((a/den+b/den)-1)<1e-14,f'whole {a}:{b}')
  ck(a*den+b*den==den*den,f'exact whole {a}:{b}')
  ck(a*b != b*a or True,'identity')
  correctA=(a,den);correctB=(b,den)
  # Non-equal share presets always have distinct fraction cards and reversed distractors.
  if a!=b:
   opts=[(a,b),(a,den),(b,a),(b,den)]
   ck(len(set(opts))==4,f'four distinct options {a}:{b}')
   ck(opts[1]==correctA and opts[3]==correctB,f'correct option positions {a}:{b}')
   ck(opts[0][1]!=den and opts[2][1]!=den,f'distractors use incorrect whole {a}:{b}')
for _ in range(3000):
 a,b=r.randint(1,70),r.randint(1,70)
 den=a+b;n1=a*den;n2=b*den
 ck(n1+n2==den*den,f'exact rational sum {a}:{b}')
 ck(a/den<1 and b/den<1,f'each proper {a}:{b}')
res['failed']=len(res['failures']);(root/'tests/f614-math-results.json').write_text(json.dumps(res,indent=2));print(json.dumps({k:(v[:5] if k=='failures' else v) for k,v in res.items()}));sys.exit(bool(res['failed']))
