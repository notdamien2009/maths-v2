import re,glob,os
W='/workspace/codex-f5/work'
f3=open('/workspace/codex-f5/ref/F3/F3-01-array-builder.html').read()
S='/* === NOVA FAMILY CORE v1.4 : JS START';Eend='/* === NOVA FAMILY CORE v1.4 : JS END'
core=f3[f3.find(S):f3.find(Eend)]
I=lambda n:open(W+'/integration/'+n).read()
api=I('nova-v2-lesson-api.js');pre=''.join('<script data-nova-f5-support="%s">\n%s\n</script>\n'%(n,I(n)) for n in ['nova-explore-policy.js','nova-speech-policy.js','nova-f5-contracts.js'])
post='\n<script data-nova-f5-support="nova-f5-runtime.js">\n%s\n</script>'%I('nova-f5-runtime.js')
GV={
 'F5-11':("model(24,3,4,sel)","model(t.a,t.n,t.d,i>=3?Array.from({length:t.n},function(_,k){return k;}):[])","{a:24,n:3,d:4}","var t=steps[i],sel=i>=3?[0,1,2]:[];"),
 'F5-13':("var t=steps[i],v=rat(1,3);","var t=steps[i],v=parse(t.input);","{input:'1/3'}",None),
 'F5-14':("[80,25]):(model(80,25)))","[t.amount,t.percent]):(model(t.amount,t.percent)))","{amount:80,percent:25}",None),
 'F5-15':("stageDraw(stage,model(80,20),","stageDraw(stage,model(t.original,t.change),","{original:80,change:20}",None),
 'F5-16':("stageDraw(stage,model(96,120),","stageDraw(stage,model(z.known,z.pct),","{known:96,pct:120}",None),
 'F5-17':("draw(stage,compute(1,7),{shown:st.shown","draw(stage,compute(st.n,st.d),{shown:st.shown","{n:1,d:7}",None)}
def guided_values(id,s):
    if id not in GV:return s
    old,new,defaults,_=GV[id];g=s.find('function guided(');assert g>0
    k=s.find(old,g);assert k>0 and k-g<1500,(id,'guided pattern')
    s=s[:k]+new+s[k+len(old):]
    s=s[:g]+"/* F5 audit extension: Guided/Watch read lesson-owned values from each native step (defaults = original demo). */(function(){var D=%s;steps.forEach(function(st){for(var key in D)if(st[key]===undefined)st[key]=D[key];});})();\n"%defaults+s[g:]
    return s
for f in sorted(glob.glob(W+'/originals/*.html')):
    s=open(f).read()
    a,b=s.find(S),s.find(Eend);assert a>0 and b>a
    s=s[:a]+core+s[b:]
    m=re.search(r'<script data-nova-lesson-api="1.0.0">[\s\S]*?</script>',s)
    s=s[:m.start()]+pre+'<script data-nova-lesson-api="1.0.0">\n'+api+'\n</script>'+post+s[m.end():]
    if os.path.basename(f)[:5] in ('F5-07','F5-09'):
        k=s.find('var DEF={id:ID');assert k>0
        s=s[:k]+"/* F5 audit fix: timeline labels read step.name; mirror the native title (was 'undefined'). */steps.forEach(function(s){if(!s.name)s.name=s.title;});\n"+s[k:]
    s=guided_values(os.path.basename(f)[:5],s)
    open(W+'/F5/'+os.path.basename(f),'w').write(s)
    print(os.path.basename(f),len(s))
