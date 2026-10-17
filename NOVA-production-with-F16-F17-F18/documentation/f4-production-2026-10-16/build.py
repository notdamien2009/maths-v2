import re,json,glob,os,hashlib,sys
sys.path.insert(0,os.path.dirname(__file__))
from hooks import H
SRC='/workspace/codex-f4/src';OUT='/workspace/codex-f4/out';B=os.path.dirname(os.path.abspath(__file__))
I=lambda f:open(OUT+'/integration/'+f).read().strip()
for f in ['nova-f4-contracts.js','nova-f4-runtime.js']:open(OUT+'/integration/'+f,'w').write(open(B+'/'+f).read())
pairs=json.load(open('/workspace/codex-f4/work/f3pairs.json'))[8:18]
support=''.join('<script data-nova-f4-support="%s">\n%s\n</script>\n'%(f,I(f)) for f in ['nova-explore-policy.js','nova-speech-policy.js','nova-f4-contracts.js','nova-f4-runtime.js'])
api='<script data-nova-lesson-api="1.0.0">\n'+I('nova-v2-lesson-api.js')+'\n</script>'
report={}
def rep(s,a,b,tag,need=True):
    n=s.count(a)
    if need and n!=1: raise SystemExit(tag+': expected 1 match, got %d'%n)
    report.setdefault(cur,[]).append(tag);return s.replace(a,b)
for path in sorted(glob.glob(SRC+'/F4/F4-[01]*.html')):
    name=os.path.basename(path);cur=name[:5];s=open(path,newline='').read().replace('\r\n','\n')
    s=re.sub(r'<script data-nova-lesson-api="1\.0\.0">.*?</script>',lambda m:support+api,s,count=1,flags=re.S);report.setdefault(cur,[]).append('canonical lesson API + F4 support scripts')
    for m,p in pairs:
        a='\n'.join(m);b='\n'.join(p)
        if s.count(a)==1:s=s.replace(a,b);report[cur].append('core: '+a.strip()[:40])
        else: report[cur].append('core NOT APPLIED: '+a.strip()[:40])
    regpat=re.compile(r'window\.NovaV2Integration\.register\((ID),(def|DEF),\{')
    m=regpat.search(s);assert m,cur
    hook=H[cur]
    if cur=='F4-08':hook+='for(const step of F711_STEPS)step.lesson=null;\n'
    s=s[:m.start()]+hook+s[m.start():]
    s=regpat.sub(lambda m:'window.NovaV2Integration.register(%s,%s,{validate:r=>window.NovaF4Contracts.validate(%s,r,C),'%(m.group(1),m.group(2),"'F4-05'" if cur=='F4-05' else 'ID'),s,count=1)
    # bind after register statement
    m=re.search(r'window\.NovaV2Integration\.register\((ID),(def|DEF),\{validate.*?\}\);\n',s,re.S)
    s=s[:m.end()]+"window.NovaF4Runtime.bind(window.NovaLessonComponent);\n"+s[m.end():]
    if cur=='F4-03':
        s=rep(s,"fraction.append(N.mt.render('\\\\frac{2}{6}=\\\\frac{1}{3}'))","const r0=s.b[0]?.n||0,A=total(s.a),g=(x,y)=>y?g(y,x%y):x,k=g(r0,A)||1;fraction.append(N.mt.render(r0&&A?'\\\\frac{'+r0+'}{'+A+'}=\\\\frac{'+(r0/k)+'}{'+(A/k)+'}':''))",'step-6 fraction computed from the trains (was hard-coded 2/6 = 1/3)')
    if cur=='F4-08':
        s=rep(s,"chalk(svg,500,125,v.task?","chalk(svg,500,125,v.maskTerms?'MATCH EACH PART OF THE BAR TO A TERM':v.task?",'translator heading masked until equation assembled')
        s=rep(s,"chalk(svg,500,partY+160,((v.won||","chalk(svg,500,partY+160,v.maskTerms?'x-PARTS · KNOWN PART · WHOLE':((v.won||",'translator term line masked')
        s=rep(s,"chalk(svg,ex+w/2,ey+53,t||['x-TERM','+ KNOWN','= WHOLE'][i],t?50:40,t?'result':'unknown');\n  }",
          "chalk(svg,ex+w/2,ey+53,t||['x-TERM','+ KNOWN','= WHOLE'][i],t?50:40,t?'result':'unknown');\n  }\n  if(v.connect){/* F4-10 equation overlay: glowing connectors from each bar part to its equation term. */const src=[[x+o.n*xW/2,partY+g.barH],[kx+kw/2,partY+g.barH],[x+g.width,g.wholeY+52]];for(let i=0;i<Math.min(3,v.connect);i++){const [sx,sy]=src[i],tx=109+i*264+123,ty=eqY;N.neonPath(svg,i<2?`M${sx},${sy+6} C${sx},${sy+90} ${tx},${ty-90} ${tx},${ty-6}`:`M${sx+6},${sy} C${sx+110},${sy} ${g.W-20},${ty-140} ${tx+60},${ty-6}`,{role:['unknown','given','result'][i],width:3});N.neonRing(svg,tx,ty-6,{role:['unknown','given','result'][i],r:7});}}",'F4-10 equation-overlay connectors (NOVA.neonPath/neonRing)')
    if cur=='F4-06':
        s=rep(s,"show=(!opt.interactive||opt.won)","show=(!opt.interactive||opt.won)&&!opt.maskAmount",'lesson phases before the amount step keep MATCHING AMOUNT concealed')
        s=rep(s,"label:v=>!knownWhole?(Math.abs(v)<.001?'0':'?')","label:v=>p.maskScale&&knownWhole?(Math.abs(v)<.001?'0':Math.abs(v-base)<.001?money(v):'?'):!knownWhole?(Math.abs(v)<.001?'0':'?')",'Challenge mask: interior amount-scale labels shown as ? so the double line cannot be read off')
        s=rep(s,"editPct:opt.editPct,","editPct:opt.editPct,maskScale:!!opt.maskScale,",'present forwards maskScale')
    os.makedirs(OUT+'/F4',exist_ok=True);open(OUT+'/F4/'+name,'w',newline='').write(s)
json.dump(report,open('/workspace/codex-f4/work/build-report.json','w'),indent=1)
for k,v in report.items():print(k,len(v),[x for x in v if 'NOT' in x])
