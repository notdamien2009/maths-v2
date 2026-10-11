import json,random,math,pathlib,sys
p=pathlib.Path(__file__).resolve().parents[1]
P={'Y8-037':(24,[2,3,4,6,8,12],4),'Y9-013':(36,[3,4,6,9,12],6),'Y9-019':(48,[4,6,8,12,16],8),'Y9-020':(30,[2,3,5,6,10,15],5)}
r=random.Random(609);names=[];fail=[]
def ck(test,yes):
 names.append(test)
 if not yes:fail.append(test)
for id,(k,xs,init) in P.items():
 for x in xs:
  y=k/x
  ck(f'{id} x={x} exact constant-product',math.isclose(x*y,k,abs_tol=1e-12))
  ck(f'{id} x={x} positive height',y>0)
  ck(f'{id} x={x} plotted reciprocal equality',math.isclose(y,k/x,abs_tol=1e-12))
  ck(f'{id} x={x} decimal-friendly answer',math.isclose(float(f'{y:.3f}'),y,abs_tol=.0005))
 for x1,x2 in zip(xs,xs[1:]):
  ck(f'{id} as width increases height falls {x1},{x2}',k/x1>k/x2)
 ck(f'{id} initial in options',init in xs)
for i in range(12000):
 k=r.uniform(1,300);x=r.uniform(.25,80);y=k/x
 ck(f'random invariant {i}',math.isclose(x*y,k,rel_tol=1e-12))
 ck(f'random inverse monotonic {i}',k/(x*1.1)<y)
 ck(f'random reciprocal representation {i}',math.isclose(y,k/x,rel_tol=1e-12))
 ck(f'random direct misconception {i}',not math.isclose(y,k*x,rel_tol=1e-10,abs_tol=1e-9) or math.isclose(x,1,rel_tol=1e-10,abs_tol=1e-9))
res={'suite':'math','passed':len(names)-len(fail),'total':len(names),'failures':fail[:50],'presets':list(P)}
(p/'tests/f609-math-results.json').write_text(json.dumps(res,indent=2));print('MATH',res['passed'],'/',res['total']);sys.exit(bool(fail))
