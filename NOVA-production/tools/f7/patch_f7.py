"""Rebuild upgraded F7 engines from the supplied originals.
Phone-layout edits for individual engines live in tools/narrow/<ID>.py (EDITS = exact (old,new) replacements).
Usage: python3 patch_f7.py [WORK_DIR]  (WORK_DIR contains originals/, F7/, integration/; default: $NOVA_F7_WORK or ../work)
CORE_SOURCE: $NOVA_F3_REFERENCE = an approved F3 engine whose embedded core v1.4 JS is current (default WORK/ref/F3-01-array-builder.html)."""
import re,glob,os,sys
W=os.path.abspath(sys.argv[1] if len(sys.argv)>1 else os.environ.get('NOVA_F7_WORK',os.path.join(os.path.dirname(__file__),'..','work')))
ref=os.environ.get('NOVA_F3_REFERENCE',os.path.join(W,'ref','F3-01-array-builder.html'))
f3=open(ref,encoding='utf8').read()
S='/* === NOVA FAMILY CORE v1.4 : JS START';E='/* === NOVA FAMILY CORE v1.4 : JS END'
core=f3[f3.find(S):f3.find(E)]
I=lambda n:open(os.path.join(W,'integration',n),encoding='utf8').read()
api=I('nova-v2-lesson-api.js')
pre=''.join('<script data-nova-f7-support="%s">\n%s\n</script>\n'%(n,I(n)) for n in ['nova-explore-policy.js','nova-speech-policy.js','nova-f7-contracts.js'])
post='\n<script data-nova-f7-support="nova-f7-runtime.js">\n%s\n</script>'%I('nova-f7-runtime.js')
for f in sorted(glob.glob(os.path.join(W,'originals','F7-*.html'))):
    s=open(f,encoding='utf8').read()
    cid=os.path.basename(f)[:5]
    nf=os.path.join(os.path.dirname(os.path.abspath(__file__)),'narrow',cid+'.py')
    if os.path.exists(nf):
        ns={};exec(open(nf,encoding='utf8').read(),ns)
        for old,new in ns['EDITS']:
            assert s.count(old)==1,(cid,old[:80]);s=s.replace(old,new)
    rm=re.search(r'\nwindow\.NovaV2Integration\.register\(\w+,def,\{.*?draws:\{([^}]*)\}',s);assert rm,f
    names=re.findall(r'"(\w+)":\[',rm.group(1))
    wrap=''.join('try{%s=window.NovaF7Runtime.wrapDraw("%s",%s);}catch(e){}'%(n,n,n) for n in names)
    s=s[:rm.start()]+'\n/* F7 state-preserving layout redraw: remember the latest stage draw calls. */\n'+wrap+s[rm.start():]
    a,b=s.find(S),s.find(E);assert a>0 and b>a,f
    s=s[:a]+core+s[b:]
    m=re.search(r'<script data-nova-lesson-api="1.0.0">[\s\S]*?</script>',s);assert m,f
    s=s[:m.start()]+pre+'<script data-nova-lesson-api="1.0.0">\n'+api+'\n</script>'+post+s[m.end():]
    open(os.path.join(W,'F7',os.path.basename(f)),'w',encoding='utf8').write(s);print(os.path.basename(f))
