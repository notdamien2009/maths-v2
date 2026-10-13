import json,random
from pathlib import Path
out=[]
for kind in ['multiply','divide','power']:
 for m in range(1,7):
  for n in range(1,7):
   if kind=='multiply' and m+n>8:continue
   if kind=='divide' and m<n:continue
   if kind=='power' and m*n>8:continue
   e={'multiply':m+n,'divide':m-n,'power':m*n}[kind]
   for x in [-3,-2,-1,1,2,3]:
    lhs= x**m * x**n if kind=='multiply' else x**m/x**n if kind=='divide' else (x**m)**n
    rhs=x**e
    ok=abs(lhs-rhs)<1e-8
    out.append({'kind':kind,'m':m,'n':n,'x':x,'pass':ok,'expectedIndex':e})
print('maths',sum(k['pass'] for k in out),'/',len(out));assert all(x['pass'] for x in out)
Path(__file__).with_name('F8-13-maths-results.json').write_text(json.dumps({'checks':len(out),'passed':sum(x['pass'] for x in out),'results':out},indent=2))
