import re,json,glob,os,sys
B=os.path.dirname(os.path.abspath(__file__));R=os.environ.get('NOVA_F8_WORK','.')+'/root';SRC=os.environ.get('NOVA_F8_WORK','.')+'/src'
exec(open(B+'/hooks8.py').read())
for f in ['nova-f8-contracts.js','nova-f8-runtime.js']:open(R+'/integration/'+f,'w').write(open(B+'/'+f).read())
I=lambda f:open(R+'/integration/'+f).read().strip()
pairs=json.load(open(os.environ['NOVA_F3_CORE_HUNKS']))[8:18]
support=''.join('<script data-nova-f8-support="%s">\n%s\n</script>\n'%(f,I(f)) for f in ['nova-explore-policy.js','nova-speech-policy.js','nova-f8-runtime.js','nova-f8-contracts.js','nova-f4-runtime.js'])
api='<script data-nova-lesson-api="1.0.0">\n'+I('nova-v2-lesson-api.js')+'\n</script>'
hook=open(B+'/hook.js').read();report={}
only=sys.argv[1:] 
for path in sorted(glob.glob(SRC+'/F8-[01]*.html')):
    name=os.path.basename(path);cur=name[:5]
    if only and cur not in only:continue
    rep=report.setdefault(cur,[]);c=H[cur]
    s=open(path,newline='').read().replace('\r\n','\n')
    s,n=re.subn(r'<script data-nova-lesson-api="1\.0\.0">.*?</script>',lambda m:support+api,s,count=1,flags=re.S);assert n==1,cur;rep.append('canonical lesson API + F8 support scripts')
    for m,p in pairs:
        a='\n'.join(m);b='\n'.join(p)
        if s.count(a)==1:s=s.replace(a,b);rep.append('core: '+a.strip()[:40])
        else:rep.append('core NOT APPLIED: '+a.strip()[:40])
    m=re.search(r'(const \w+=\s*(?:/\*[^*]*\*/\s*)?)?window\.NovaV2Integration\.register\(ID,DEF,\{',s);assert m,cur
    hk=hook.replace('__TAB__',c['tab']).replace('__ACT__',c['act']).replace('__X__',c['X']).replace('__HID__',c['hid'])
    if c['mode']:hk=hk.replace('__MODESAVE__','const keepMode='+c['mode']).replace('__MODEGUIDED__',c['mode']+"='guided'").replace('__MODERESTORE__',c['mode']+'=keepMode')
    else:hk=hk.replace('__MODESAVE__;','').replace('__MODEGUIDED__;','').replace(';__MODERESTORE__','')
    s=s[:m.start()]+hk+(m.group(1) or '')+"window.NovaV2Integration.register(ID,DEF,{validate:r=>window.NovaF8Contracts.validate('%s',r,f8Ctx()),"%cur+s[m.end():]
    m=re.search(r'window\.NovaV2Integration\.register\(ID,DEF,\{validate.*?\}\);\n',s,re.S);assert m,cur
    s=s[:m.end()]+"window.NovaF4Runtime.bind(window.NovaLessonComponent);window.NovaF8Runtime.bind(window.NovaLessonComponent);\n"+s[m.end():]
    bps=sorted({int(n)-(1 if op=='<' else 0) for op,n in re.findall(r'innerWidth\s*(<=|<)\s*(\d+)',s)}) or [760]
    cnt=0
    if c['rec']=='args':
        s,cnt=re.subn(r'(function (\w+)\(stage,[^)]*\)\{\s*if\(window\.NovaLessonComponent\?\.active\)\{\[[^\]]*\]=window\.NovaLessonComponent\.args\("\w+",arguments\);\})',lambda m:m.group(1)+'window.NovaF8Runtime?.record?.('+m.group(2)+',this,arguments);',s)
    else:
        for fn in c['rec']:
            s,k=re.subn(r'(function '+fn+r'\(\w+(=\{\})?\)\{)',lambda m:m.group(1)+'window.NovaF8Runtime?.record?.('+fn+',this,arguments);',s,count=1);cnt+=k
    assert cnt,cur
    k=s.rfind('</body>');s=s[:k]+'<script>window.NovaF8Runtime?.breakpoints?.('+json.dumps(bps)+');</script>\n'+s[k:]
    rep.append('relayout: %d draw(s) recorded, breakpoints %s'%(cnt,bps));rep.append('F8 data.lesson hook (concealed view: native Challenge view) + contracts + runtime bind')
    open(R+'/F8/'+name,'w',newline='').write(s)
old=json.load(open(B+'/build-report.json')) if os.path.exists(B+'/build-report.json') else {}
old.update(report);json.dump(old,open(B+'/build-report.json','w'),indent=1)
for k,v in report.items():print(k,len(v),[x for x in v if 'NOT' in x or 'relayout' in x])
