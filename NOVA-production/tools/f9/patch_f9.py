"""Rebuild upgraded F9 engines from the supplied originals.
Usage: python3 patch_f9.py [WORK_DIR]  (WORK_DIR contains originals/, F9/, integration/; default: $NOVA_F9_WORK or ../work)
CORE_SOURCE: $NOVA_F3_REFERENCE = an approved F3 engine whose embedded core v1.4 JS is current (default WORK/ref/F3-01-array-builder.html).
Per engine: tools/lesson/<ID>.js adds the value-driven lessonScene draw; tools/edits/<ID>.py holds exact (old,new) replacements
(phone layout and state hooks); ROOTS lists the state-rebuilding draw functions replayed on a layout redraw."""
import re,glob,os,sys
H=os.path.dirname(os.path.abspath(__file__))
W=os.path.abspath(sys.argv[1] if len(sys.argv)>1 else os.environ.get('NOVA_F9_WORK',os.path.join(H,'..','work')))
ref=os.environ.get('NOVA_F3_REFERENCE',os.path.join(W,'ref','F3-01-array-builder.html'))
f3=open(ref,encoding='utf8').read()
S='/* === NOVA FAMILY CORE v1.4 : JS START';E='/* === NOVA FAMILY CORE v1.4 : JS END'
core=f3[f3.find(S):f3.find(E)]
I=lambda n:open(os.path.join(W,'integration',n),encoding='utf8').read()
api=I('nova-v2-lesson-api.js')
pre=''.join('<script data-nova-f9-support="%s">\n%s\n</script>\n'%(n,I(n)) for n in ['nova-explore-policy.js','nova-speech-policy.js','nova-f9-contracts.js'])
post='\n<script data-nova-f9-support="nova-f9-runtime.js">\n%s\n</script>'%I('nova-f9-runtime.js')
# Phone typography: at the ≤760px phone layout (430-unit viewBox drawn ~258px wide in a 390 frame) the engine's own chalk/box
# text helpers get a 19-unit floor (≈11.4 CSS px), so labels meet the 390 readability bar without changing desktop drawings.
FLOOR=19
TEXT={'F9-01':('isSmall',[('txt','size'),('box','size')]),'F9-02':('isSmall',[('txt','size'),('box','size')]),'F9-03':('small',[('txt','size'),('nbox','font')]),
 'F9-04':('small',[('mathText','size'),('nbox','size')]),'F9-05':('sm',[('txt','size'),('neonBox','size')]),'F9-06':('small',[('text','size'),('box','size')]),
 'F9-07':('small',[('text','size'),('box','size')]),'F9-08':('small',[('txt','size'),('box','size')]),'F9-09':('small',[('txt','size'),('box','size'),('chalkCell','size')]),
 'F9-10':('small',[('txt','size'),('box','size')]),'F9-11':('small',[('txt','size'),('box','size')]),'F9-12':('sm',[('txt','size'),('box','size')]),'F9-13':('mobile',[('txt','z'),('tile','sz')])}
ROOTS={'F9-01':['renderLearning','renderChallenge'],'F9-02':['renderExplore','drawChallenge'],'F9-03':['drawChallenge'],'F9-04':['renderExplore','drawChallenge'],
 'F9-05':['exploreDraw','renderChallenge'],'F9-06':['explore','drawChallenge'],'F9-07':['explore','drawChallenge'],'F9-08':['renderExplore','drawChallenge'],
 'F9-09':['renderExplore','drawChallenge'],'F9-10':['renderExplore','drawChallenge'],'F9-11':['exploreDraw','challengeDraw'],'F9-12':['exploreDraw','drawChallenge'],'F9-13':['sceneDraw','drawChallenge']}
for f in sorted(glob.glob(os.path.join(W,'originals','F9-*.html'))):
    s=open(f,encoding='utf8').read();cid=os.path.basename(f)[:5]
    a,b=s.find(S),s.find(E);assert a>0 and b>a,f
    s=s[:a]+core+s[b:]
    m=re.search(r'<script data-nova-lesson-api="1.0.0">[\s\S]*?</script>',s);assert m,f
    s=s[:m.start()]+pre+'<script data-nova-lesson-api="1.0.0">\n'+api+'\n</script>'+post+s[m.end():]
    ef=os.path.join(H,'edits',cid+'.py')
    if os.path.exists(ef):
        ns={};exec(open(ef,encoding='utf8').read(),ns)
        for old,new in ns['EDITS']:
            assert s.count(old)==1,(cid,old[:90]);s=s.replace(old,new)
    fn,helpers=TEXT[cid]
    for name,param in helpers:
        hm=list(re.finditer(r'\n[ \t]*function '+name+r'\(([^)]*)\)\{',s));assert len(hm)==1,(cid,name,len(hm));assert re.search(r'\b'+param+r'\b',hm[0].group(1)),(cid,name,param)
        s=s[:hm[0].end()]+'if(%s()&&%s<%d)%s=%d;'%(fn,param,FLOOR,param,FLOOR)+s[hm[0].end():]
    # lessonScene: inserted before the def object; the native render routes a lessonScene record to it.
    lesson=open(os.path.join(H,'lesson',cid+'.js'),encoding='utf8').read()
    dm=list(re.finditer(r'\n[ \t]*const def=\{',s));assert len(dm)==1,(cid,'def');s=s[:dm[0].start()]+'\n'+lesson+s[dm[0].start():]
    rr=list(re.finditer(r'\n([ \t]*)render\((\w+),stage\)\{',s));assert len(rr)==1,(cid,'render')
    s=s[:rr[0].end()]+"if(window.NovaLessonComponent?.active?.scene?.function==='lessonScene')return lessonScene(stage,{});"+s[rr[0].end():]
    rm=re.search(r'\nwindow\.NovaV2Integration\.register\(\w+,def,\{.*?draws:\{([^}]*)\}',s);assert rm,f
    s=s[:rm.start(1)]+rm.group(1)+',"lessonScene":["stage","p"]'+s[rm.end(1):]
    rm=re.search(r'\nwindow\.NovaV2Integration\.register\(\w+,def,\{.*?draws:\{([^}]*)\}',s)
    names=list(dict.fromkeys(re.findall(r'"(\w+)":\[',rm.group(1))+ROOTS[cid]))
    for n in ROOTS[cid]:assert re.search(r'\n[ \t]*function '+n+r'\(',s),(cid,n)
    wrap=''.join('try{%s=window.NovaF9Runtime.wrapDraw("%s",%s);}catch(e){}'%(n,n,n) for n in names)
    s=s[:rm.start()]+'\n/* F9 state-preserving layout redraw: remember the latest stage draw calls. */\n'+wrap+s[rm.start():]
    open(os.path.join(W,'F9',os.path.basename(f)),'w',encoding='utf8').write(s);print(os.path.basename(f))
