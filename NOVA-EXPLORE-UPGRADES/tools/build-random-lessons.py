from pathlib import Path
import json,re,random,copy,sys
r=Path(__file__).resolve().parents[1];o=r
reg=json.loads((r/'integration/component-adapters.json').read_text());template=(r/'00-master/NOVA-MATHS-LESSON-LAYOUT-TEMPLATE.html').read_text(encoding='utf8')
def read(s,k):return json.loads(re.search('<script[^>]*id="'+k+'"[^>]*>([\\s\\S]*?)</script>',s).group(1))
def put(s,k,v):return re.sub('(<script[^>]*id="'+k+'"[^>]*>)[\\s\\S]*?(</script>)',lambda m:m[1]+json.dumps(v,ensure_ascii=True).replace('<','\\u003c')+m[2],s)
(o/'test-lessons').mkdir(exist_ok=True)
for seed in ([int(x) for x in sys.argv[1:]] or [16317,72841,90523]):
 rng=random.Random(seed);D=read(template,'novaLessonData');P=read(template,'novaProductionData');sources={};keys=[]
 D['meta'].update(year='7',lesson=f'MIX-{seed}',title='Numbers, groups and multiplication',objective='Connect number-line distances, multiplication grids and arrays.',websiteRef=f'MIX-{seed}',templateMode=False,curriculumMode='LESSON',curriculumCode=f'MIX-{seed}')
 D['start'].update(bigIdeaTitle='The same numbers, different models',bigIdeaIntro='Read distances on a number line, multiply using a grid, and count equal groups using an array.',goalBullets=['Read a number-line distance.','Multiply two numbers using partitioning.','Connect rows and columns to a product.'],conceptCards=[{'title':'Connect representations','text':'Check which numbers each model represents before calculating.'}],handoverText='Let Bob introduce each model, then try the controls yourself.')
 D['learn']=[];D['examples']=[];D['bob']={'heroIntro':'Connect distances, products and equal groups.','why':'Different models help you explain your calculations.','concepts':[]};P['concepts']=[];P['sourceIds']={};P['sourceKinds']={};P['componentConfigs']={};P['exploreBindings']={};P['assessmentVisuals']=[];P['manifest']={'watch':[],'challenge':[],'explorePresets':[[],[],[]]}
 specs=[('F1-01','Number-line distances'),('F2-07','Multiply with a grid'),('F3-01','Equal groups and arrays')]
 for ci,(ident,title) in enumerate(specs):
  src=f'SRC{ci+1}';row=next(x for x in reg if x['id']==ident);sources[src]=(r/row['path']).read_text(encoding='utf8');P['sourceIds'][src]=ident;P['sourceKinds'][src]='';concept={'id':f'C{ci+1}','source':src,'title':title,'explain':['A distance is the difference between two positions.','Split a number into parts, then add the partial products.','Multiply rows by columns to count all cells.'][ci],'carry':'Use the given values to explain your calculation.','keywords':'distance, factor, product, rows, columns','exploreInstructions':'Change the numbers. Explain what changes in the drawing.','challengeGame':{'lives':3,'base':10,'streakBonus':5,'hintCost':5,'stars':[50,70,90]}}
  D['learn'].append(copy.deepcopy(concept));P['concepts'].append(concept);P['componentConfigs'][concept['id']]={};qs=[]
  for j in range(6):
   if ci==0:
    a=rng.randint(-8,8);b=a+rng.randint(2,12);answer=b-a;prompt=f'Find the distance between {a} and {b}.';rec={'data':{'chips':[]},'scene':{'function':'draw','arguments':{'st':{'kind':'line','min':-10,'max':30,'step':1,'labelStep':5,'value':a},'o':{'pts':[{'v':a,'label':str(a)},{'v':b,'label':str(b)}]}}}}
   elif ci==1:
    a=rng.randint(12,39);b=rng.randint(11,19);answer=a*b;prompt=f'Calculate {a} × {b} using the grid.';rec={'data':{'lesson':{'kind':'grid','a':str(a),'b':str(b),'upto':0}}}
   else:
    a=rng.randint(2,10);b=rng.randint(2,10);answer=a*b;prompt=f'How many cells are in {a} rows of {b}?';rec={'data':{'lesson':{'state':{'rows':a,'cols':b},'phase':0}}}
   rec.update(nativeIndex=0,source=src,id=f'C{ci+1}.Q{j+1}',prompt=prompt,privateAnswer=answer,answerType='numeric',hint='Use the given values and the model.',wrongFeedback='Check the numbers in the question and try again.',correctFeedback='Correct.');qs.append(rec);keys.append({'id':rec['id'],'component':ident,'question':prompt,'answer':answer})
  P['manifest']['challenge']+=qs;watch=[]
  for j,q in enumerate(qs[:4]):
   w=copy.deepcopy(q);w.update(id=f'L{ci+1}.W{j+1}',teaching=q['prompt']+f' The answer is {q["privateAnswer"]}.',storedDur=5500,animated=False)
   if ci==1:w['data']['lesson']['upto']=4
   if ci==2:w['data']['lesson']['phase']=4
   watch.append(w)
  P['manifest']['watch']+=watch
  D['examples'].append({'id':f'E{ci+1}','title':title,'component':src,'question':qs[0]['prompt'],'teaching':concept['explain'],'predict':'Predict the answer before revealing each worked example.','steps':[{**w,'title':f'Worked example {j+1}','explain':w['teaching'],'why':concept['explain'],'written':f'{w["prompt"]} Answer: {w["privateAnswer"]}.'} for j,w in enumerate(watch)]})
  D['bob']['concepts'].append({**concept,'beats':[{**w,'title':f'Example {j+1}','speech':w['teaching'],'written':f'Answer: {w["privateAnswer"]}.','note':concept['explain'],'cue':'Read the given numbers.'} for j,w in enumerate(watch)]})
 def question(k,record):return {'id':k,'type':'short','tier':'core','role':'application','checking':'live','question':record['question'],'answer':str(record['answer']),'rubric':f'The correct numeric answer is {record["answer"]}.','hint':'Use subtraction for a distance, or multiplication for equal groups.','wrongFeedback':'Check your calculation.','correctFeedback':'Correct.'}
 original=read(template,'novaLessonData')
 def populate(slots,offset):
  out=[]
  for i,slot in enumerate(slots):
   q=copy.deepcopy(slot);rec=keys[(offset+i)%len(keys)];q.update(question=rec['question'],answer=str(rec['answer']),rubric=f"Correct answer: {rec['answer']}. Accept a correct calculation or explanation.",hint='Read the given values, then calculate.',wrongFeedback='Check the given values and calculation.',correctFeedback='Correct.')
   if 'options' in q:q['options']=[str(rec['answer']+1),str(rec['answer']),str(rec['answer']+2)]
   if 'visualHtml' in q:q['visualHtml']='<figure class="v2-static-aid"><div class="template-static-visual">'+rec['question']+'</div><figcaption>Use the given mathematical values.</figcaption></figure>'
   out.append(q)
  return out
 D['start']['diagnostic']=populate(original['start']['diagnostic'],0);D['practice']=populate(original['practice'],2);D['exit']=populate(original['exit'],8)
 D.update(learnHeading='Investigate all three models',learnIntro='Watch each model, explore its numbers and complete each challenge.',learnGuidance='Each model has separate controls and a separate six-question challenge.')
 html=template
 for k,v in [('novaLessonData',D),('novaProductionData',P),('novaV2Sources',sources)]:html=put(html,k,v)
 html=html.replace('<title>NOVA Maths · Lesson 2 exact-layout insertion template</title>','<title>NOVA · Numbers, groups and multiplication</title>')
 (o/'test-lessons'/f'Random-lesson-{seed}.html').write_text(html,encoding='utf8');(o/'test-lessons'/f'Answer-key-{seed}.json').write_text(json.dumps(keys,indent=2),encoding='utf8')
