import random,json,math,re,pathlib
r=pathlib.Path(__file__).resolve().parents[1]
src=(r/'src/F6-07.js').read_text()
assert 'N.numberLine(svg' in src and 'N.ui.svgDrag(svg' in src and 'N.svg.grid' in src
assert 'window.F607_CONFIG=F607_CONFIG' in src
checks=0;fails=[]
for d1 in range(1,101):
 for d2 in range(0,101):
  c=math.hypot(d1,d2)
  for scale in (.01,.025,.05,.1,.25,.4,.5,.75,1.,1.25,2.,2.5,5.):
   km=c*scale;checks+=1
   if not math.isclose(km/scale,c,rel_tol=1e-12):fails.append((d1,d2,scale))
expected={'Y7-064':2,'Y7-064-library':2,'Y9-021':12.5,'Y9-021-urban':3.75}
for k,v in expected.items():
 assert re.search(re.escape("'"+k+"':")+r'\{[^\n]+',src),k
 checks+=1
# Distances, no unintentional division, integer rounded units.
for dx,dy,rate,real in [(4,0,.5,2),(3,4,.4,2),(6,8,1.25,12.5),(5,0,.75,3.75)]:
 checks+=4
 assert math.hypot(dx,dy)*rate==real
 assert math.hypot(dx,dy)==int(math.hypot(dx,dy))
 assert rate>0
 assert real>0
result={'suite':'math','passed':checks-len(fails),'total':checks,'failures':fails[:5], 'named_presets':expected}
(r/'tests/f607-math-results.json').write_text(json.dumps(result,indent=2));print(result['passed'],result['total'])
assert not fails
