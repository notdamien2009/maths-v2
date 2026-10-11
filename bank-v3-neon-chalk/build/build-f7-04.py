from pathlib import Path
root=Path(__file__).resolve().parents[1]
css=(root/'core/nova-core.css').read_text(encoding='utf8');js=(root/'core/nova-core.js').read_text(encoding='utf8')
localcss=(root/'src/F3-02.css').read_text(encoding='utf8');localjs=(root/'src/F3-02.js').read_text(encoding='utf8')
for src,dst in [('F3-02.src.html','F3/F3-02-area-model-of-multiplication.html'),('F7-04.entry.src.html','F7/F7-04-expanding-single-brackets.html')]:
 s=(root/'build'/src).read_text(encoding='utf8')
 for key,repl in [('@@CSS@@',css),('@@JS@@',js),('@@F302CSS@@',localcss),('@@F302JS@@',localjs)]:
  assert s.count(key)==1,(src,key)
  s=s.replace(key,repl)
 target=root/dst;target.parent.mkdir(exist_ok=True,parents=True);target.write_text(s,encoding='utf8');print(dst,len(s))
