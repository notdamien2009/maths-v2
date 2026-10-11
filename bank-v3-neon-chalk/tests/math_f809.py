"""F8-09 mathematical and state contract checks on actual browser JS kernel."""
import json
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1]; HTML=(R/'F8/F8-09-substitution-table.html').read_text()
checks=[]
def rec(name,ok,detail=None):
 checks.append({'test':name,'pass':bool(ok),'detail':str(detail)[:180]})
 if not ok:print('FAIL',name,detail)
with sync_playwright() as P:
 b=P.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox']);p=b.new_page();p.set_content(HTML)
 result=p.evaluate('''()=>{
  let T=F809_TEST,res=[];for(const id of T.order){let q=T.presets[id];for(let x=-50;x<=50;x++){
   const v=T.value(q,x),m=q.kind==='quadratic'?q.a*x*x+q.b*x+q.c:q.a*x+q.b;
   res.push({name:id+'/eval/'+x,correct:v===m});}
   let xs=T.xs(q),expected=T.expected(q),cards=T.uniqueCards(q),s=T.makeState();
   res.push({name:id+'/input-count',correct:xs.length===5});
   res.push({name:id+'/challenge-has-all-answer-cards',correct:expected.every((z,i)=>cards.some(c=>c.id==='a'+i&&c.value===z))});
   res.push({name:id+'/empty-rejected',correct:T.check(q,s)===false&&s.solved===false});
   for(let i=0;i<5;i++)T.insert(q,s,'a'+i,i);
   res.push({name:id+'/all-values-correct',correct:T.analyse(q,s).every(x=>x.correct)});
   res.push({name:id+'/solved',correct:T.check(q,s)&&s.solved});
   let s2=T.makeState();T.insert(q,s2,'a1',0);
   res.push({name:id+'/wrong-column-rejected',correct:!T.check(q,s2)});
   let s3=T.makeState();T.insert(q,s3,'a0',0);T.remove(q,s3,0);
   res.push({name:id+'/remove',correct:s3.slots[0]===null});
   T.undo(s3);res.push({name:id+'/undo',correct:s3.slots[0]==='a0'});
   res.push({name:id+'/negative-notation',correct:T.working(q,-2).includes('(')||q.kind==='linear'});
  }return res}''')
 for x in result:rec(x['name'],x['correct'])
 b.close()
obj={'component':'F8-09','passed':sum(c['pass'] for c in checks),'total':len(checks),'failed':[c for c in checks if not c['pass']],'checks':checks};(R/'tests/F8-09-math-results.json').write_text(json.dumps(obj,indent=2));print('MATH',obj['passed'],'/',obj['total'])
if obj['failed']:raise SystemExit(1)
