from pathlib import Path
import json,re
r=Path('.');a=r/'audit/f16-f18-production-2026-10-17';p=a/'native-edits.json';ed=json.loads(p.read_text(encoding='utf8'));extra={}
def add(cid,old,new):
 s=next((a/'native-source'/cid.split('-')[0]).glob(cid+'-*.js')).read_text(encoding='utf8');assert old in s,(cid,old[:90]);ed.setdefault(cid,[]).append([old,new])
def binding(name,expr):return f'window.NovaLessonComponent.exploreInit("{name}",()=>({expr}))'
starts={1:('exploreState=emptyState();','exploreState='+binding('state','emptyState()')+';'),2:('ex=state();','ex='+binding('state','state()')+';'),3:('exploreState=pointState();','exploreState='+binding('state','pointState()')+';'),4:('exploration=stateFrom();','exploration='+binding('state','stateFrom()')+';'),5:('exploreState=fresh(d);','exploreState='+binding('state','fresh(d)')+';'),6:('ex=fresh();','ex='+binding('state','fresh()')+';'),7:('ex=fresh();','ex='+binding('state','fresh()')+';'),8:('let data=fresh();','let data='+binding('state','fresh()')+';'),9:('let st=fresh(),pr=p();','let st='+binding('state','fresh()')+',pr=p();'),10:('let st=fresh();','let st='+binding('state','fresh()')+';'),11:('let st=fresh();','let st='+binding('state','fresh()')+';'),12:('let st=fresh();','let st='+binding('state','fresh()')+';'),13:('let state=fresh(),lesson=','let state='+binding('state','fresh()')+',lesson=')}
# Restrict replacements to the initial native Explore entry; never alter its internal Reset or preset handlers.
for n,(old,new) in starts.items():
 cid=f'F16-{n:02}';src=next((a/'native-source/F16').glob(cid+'-*.js')).read_text(encoding='utf8');m=re.search(r'(?:function explore\([^)]*\)|explore:function\([^)]*\))\{',src);assert m,cid;pos=src.index(old,m.end());prefix=src[m.start():pos+len(old)];assert src.count(prefix)==1;ed.setdefault(cid,[]).append([prefix,prefix[:-len(old)]+new]);extra[cid]=['state']
add('F16-15',"let picked=[],method='manual',seed=", "let init="+binding('state',"{selected:[],method:'manual'}")+",picked=init.selected,method=init.method,seed=");extra['F16-15']=['state']
add('F16-16',"let records=Array(p().data.length).fill(false),question=0,audience=0;", "let init="+binding('state',"{records:Array(p().data.length).fill(false),question:0,audience:0}")+",records=init.records,question=init.question,audience=init.audience;");extra['F16-16']=['state']
add('F16-16',"lesson.value=CFG.preset;", "lesson.value=CFG.preset;questionSel.value=String(question);audienceSel.value=String(audience);")
add('F17-01',"let p=params(),val=.5,showComplement=false;", "let p="+binding('p','params()')+",val="+binding('value','.5')+",showComplement="+binding('showComplement','false')+";");extra['F17-01']=['p','value','showComplement']
add('F17-02',"explore:(panel,stage,api)=>buildControls(panel,stage,api,preset(),model)", "explore:(panel,stage,api)=>{model="+binding('m','makeState(preset())')+";return buildControls(panel,stage,api,preset(),model)}");extra['F17-02']=['m']
add('F17-04',"let p=preset(),m=createModel(p),animation=null;", "let p="+binding('p','preset()')+",m="+binding('m','createModel(p)')+",animation=null;");extra['F17-04']=['p','m']
add('F17-05',"let p=preset(),m=newModel();", "let p="+binding('p','preset()')+",m="+binding('m','newModel()')+";");extra['F17-05']=['p','m']
for n,old,new in [(8,'m=empty(),status=','m='+binding('m','empty()')+',status='),(9,'m=newState(),status=','m='+binding('m','newState()')+',status='),(10,'m=newState(p);','m='+binding('m','newState(p)')+';'),(11,'m=newModel(p),busy=false;','m='+binding('m','newModel(p)')+',busy=false;')]:add(f'F17-{n:02}',old,new);extra[f'F17-{n:02}']=['m']
add('F17-12',"const choose=(options,label)=>", "if(!choicesA.some(f=>f[0]*m.a[1]===m.a[0]*f[1]))choicesA.unshift(m.a.slice());if(!choicesB.some(f=>f[0]*m.b[1]===m.b[0]*f[1]))choicesB.unshift(m.b.slice());const choose=(options,label)=>")
add('F17-13',"prize.value='3';", "if(![...prize.options].some(o=>+o.value===m.prize))prize.append(h('option',{value:String(m.prize),text:'£'+m.prize+' gross prize'}));prize.value=String(m.prize);")
# Keep native source mathematical font and conceal computed pie percentages/angles, not category givens.
add('F17-04','const graph=NOVA.plot.frame(svg,','const graph=NOVA.neonPlot(svg,')
add('F16-04',"txt=(!showCount?'collecting...':`${s.counts[i]}  ·  ${percent(s.counts[i],t).toFixed(0)}%  ·  ${ang(s.counts[i],t).toFixed(0)}°`)","txt=(!showCount?'collecting...':window.NovaLessonComponent?.active?.concealAnswers?`${s.counts[i]}  ·  ?%  ·  ?°`:`${s.counts[i]}  ·  ${percent(s.counts[i],t).toFixed(0)}%  ·  ${ang(s.counts[i],t).toFixed(0)}°`)")
add('F16-04',"Math.round(percent(s.counts[i],t))+'%'", "window.NovaLessonComponent?.active?.concealAnswers?'?':Math.round(percent(s.counts[i],t))+'%'")
p.write_text(json.dumps(ed,indent=2,ensure_ascii=False),encoding='utf8');(a/'native-field-additions.json').write_text(json.dumps(extra,indent=2),encoding='utf8')
for fam in ['16','17','18']:
 p=r/f'integration/nova-f{fam}-runtime.js';s=p.read_text(encoding='utf8');needle="I.register=function(id,def,scope){scope=scope||{};";fields={cid:{key:{'kind':'value','factory':None,'argCount':None} for key in keys} for cid,keys in extra.items() if cid.startswith('F'+fam+'-')};assert needle in s;s=s.replace(needle,needle+'scope.exploreFields={...(scope.exploreFields||{}),...('+json.dumps(fields,separators=(',',':'))+')[id]};');p.write_text(s,encoding='utf8')
print('Native Explore state exposure and question-only concealment patches prepared.')
