"""Independent Python maths oracle: bisection/rounding, including adversarial choices."""
from pathlib import Path
import json, math,random
D=[('SQUARE-TWO',lambda x:x*x-2,1.,2.,3,2**.5),('SQUARE-FIVE',lambda x:x*x-5,2.,3.,2,5**.5),('CUBE-FIVE',lambda x:x**3-5,1.,2.,3,5**(1/3)),('CUBIC-X',lambda x:x**3-x-2,1.,2.,2,None),('DOUBLE-SQUARE',lambda x:2*x*x-7,1.,2.,3,(7/2)**.5),('CUBIC-SUM',lambda x:x**3+x-4,1.,2.,2,None)]
counts=0;results=[]
for key,f,low,high,dp,root in D:
 lo,hi=low,high;trail=[]
 for step in range(24):
  guess=(lo+hi)/2
  sg=f(guess)
  if sg<0:lo=guess
  elif sg>0:hi=guess
  else:lo=hi=guess
  assert f(lo)<=1e-12 and f(hi)>=-1e-12
  assert lo<=hi and low<=lo<=hi<=high
  counts+=5;trail.append([guess,sg,lo,hi])
  if step>=2 and round(lo,dp)==round(hi,dp): break
 else:raise AssertionError(f'{key} failed to converge')
 if root is None:
  a,b=low,high
  for j in range(80):
   mid=(a+b)/2
   if f(mid)<0:a=mid
   else:b=mid
  root=(a+b)/2
 assert abs(round(lo,dp)-round(root,dp))<10**(-dp)/100
 counts+=1
 # Perturbation tests against false bracket: sampled values preserve sign requirements.
 r=random.Random(key)
 for _ in range(400):
  u=r.uniform(low,high);v=f(u)
  if v<0:assert u<root
  elif v>0:assert u>root
  counts+=1
 results.append({'preset':key,'steps':len(trail),'rounded':f'{round(lo,dp):.{dp}f}','root':root,'interval':[lo,hi]})
out={'status':'pass','checks':counts,'cases':results}
path=Path('/mnt/data/f8_run18/tests/F8-18-math-results.json');path.write_text(json.dumps(out,indent=2));print(json.dumps(out,indent=2))
