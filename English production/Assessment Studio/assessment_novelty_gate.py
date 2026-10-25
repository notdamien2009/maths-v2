#!/usr/bin/env python3
"""NOVA English assessment similarity flagger (NOT a semantic originality certificate).

Usage:
  python assessment_novelty_gate.py PAPER.json --prior Y7-001.html --prior Y7-002.html \
    --prior PAPER-OLD.json --prior PAPER-Y7-015-DEMONSTRATION.json --out FLAGS.json

Reads lesson JSON data scripts where available and pupil paper JSON. Detects
exact and high lexical-overlap questions and source passages, not plot/semantic
imitation. Review *all* high-risk flags and do a separate human semantic audit.
"""
import argparse, difflib, html, json, re, sys
from pathlib import Path
from html.parser import HTMLParser

class JSONScripts(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.script = None
        self.buf = []
        self.data = {}
    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if tag.lower() == 'script' and d.get('id') in ('novaLessonData','novaAssessmentPaper') and d.get('type') == 'application/json':
            self.script = d['id']
            self.buf = []
    def handle_data(self, data):
        if self.script is not None: self.buf.append(data)
    def handle_endtag(self, tag):
        if tag.lower() == 'script' and self.script is not None:
            try: self.data[self.script] = json.loads(''.join(self.buf))
            except json.JSONDecodeError: pass
            self.script = None
            self.buf = []

def load(path):
    text = Path(path).read_text(encoding='utf-8')
    if path.lower().endswith('.html'):
        p = JSONScripts(); p.feed(text)
        if not p.data: raise ValueError(f'No parseable lesson/assessment JSON script in {path}')
        return next(iter(p.data.values()))
    return json.loads(text)

def clean(s):
    s = re.sub(r'<[^>]+>', ' ', str(s))
    return re.sub(r'\s+', ' ', html.unescape(s)).strip()

def source_blocks(obj, name):
    result = []
    if isinstance(obj, dict):
        for key,value in obj.items():
            if key in ('sources', 'readingSources', 'practiceSources', 'exitSources') and isinstance(value,list):
                for i, rec in enumerate(value):
                    if isinstance(rec,dict):
                        material = rec.get('lines') or rec.get('text') or rec.get('sourceText') or rec.get('passage') or ''
                        if isinstance(material,list):
                            material = ' '.join(x.get('text','') if isinstance(x,dict) else str(x) for x in material)
                        material = clean(material)
                        if len(material)>=70: result.append({'origin':f'{name}/{key}[{i}]','type':'source','text':material})
            if key in ('source',) and isinstance(value,dict):
                material=value.get('lines') or value.get('text') or value.get('sourceText') or ''
                if isinstance(material,list):material=' '.join(x.get('text','') if isinstance(x,dict) else str(x) for x in material)
                material=clean(material)
                if len(material)>=70:result.append({'origin':name+'/source','type':'source','text':material})
            if isinstance(value,(dict,list)):
                result.extend(source_blocks(value,f'{name}/{key}'))
    elif isinstance(obj,list):
        for i,x in enumerate(obj):result.extend(source_blocks(x, f'{name}[{i}]'))
    return result

def question_blocks(obj, name):
    result=[]
    if isinstance(obj, dict):
        # Source and UI meta text should not be treated as question wording.
        for k,v in obj.items():
            if k in ('question','prompt','stem','task','instruction','taskPrompt') and isinstance(v,str):
                text=clean(v)
                if len(text)>=28:
                    result.append({'origin':name+'/'+k,'type':'question','text':text})
            if isinstance(v,(dict,list)):
                result.extend(question_blocks(v, name+'/'+k))
    elif isinstance(obj,list):
        for i,v in enumerate(obj):result.extend(question_blocks(v, f'{name}[{i}]'))
    return result

def norm(t):
    return ' '.join(re.findall(r"[a-z0-9]+(?:'[a-z]+)?",t.casefold()))

def trigrams(t):
    x=norm(t).split()
    return set(tuple(x[i:i+3]) for i in range(len(x)-2))

def compare(a,b):
    na,nb=norm(a),norm(b)
    if not na or not nb:return None
    if na==nb:return ('HIGH','exact',1.0)
    length=min(len(na),len(nb))
    # Short common prompts are low-information, so ignore unless near-identical.
    if length<45:return None
    seq=difflib.SequenceMatcher(None,na,nb,autojunk=False).ratio()
    aa,bb=trigrams(a),trigrams(b)
    overlap= len(aa & bb)/min(len(aa),len(bb)) if aa and bb else 0
    if seq>=0.88 and overlap>=0.62: return ('HIGH','near-verbatim',round(max(seq,overlap),3))
    if seq>=0.75 and overlap>=0.50: return ('REVIEW','substantial-similarity',round(max(seq,overlap),3))
    if overlap>=0.82 and length>=90:return ('REVIEW','3gram-overlap',round(overlap,3))
    return None

def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('paper', help='New pupil paper JSON')
    ap.add_argument('--prior',action='append',default=[],help='One real prior lesson HTML/JSON or prior paper/demo JSON (repeat)')
    ap.add_argument('--prior-dir',action='append',default=[],help='Folder with prior .json and .html files')
    ap.add_argument('--out', default=None,help='Optional JSON report path')
    ap.add_argument('--unit-expected',type=int,default=None,help='Expected number of unit lesson files; reported but not falsely inferred from filenames')
    a=ap.parse_args()
    paths=list(map(Path,a.prior))
    for d in a.prior_dir:
        paths.extend(sorted(p for p in Path(d).rglob('*') if p.is_file() and p.suffix.lower() in ('.json','.html')))
    paths=list(dict.fromkeys(p.resolve() for p in paths if str(p)))
    if not paths:print('ERROR: no prior files supplied; no meaningful originality comparison possible',file=sys.stderr);return 3
    pub=load(str(a.paper))
    candidate=question_blocks(pub,'candidate') + source_blocks(pub,'candidate')
    prior=[];read=[];errors=[]
    for p in paths:
        try:
            o=load(str(p))
            vals=question_blocks(o,p.name)+source_blocks(o,p.name)
            prior.extend(vals);read.append({'path':str(p),'questionBlocks':sum(r['type']=='question' for r in vals),'sourceBlocks':sum(r['type']=='source' for r in vals)})
        except (OSError,ValueError,TypeError) as e:
            errors.append({'path':str(p),'error':str(e)})
    flags=[]
    for cand in candidate:
        matches=[]
        for other in prior:
            if cand['type']!=other['type']:continue
            match=compare(cand['text'],other['text'])
            if match:
                status,reason,similarity=match
                matches.append({'severity':status,'reason':reason,'similarity':similarity,'priorOrigin':other['origin'],'candidateText':cand['text'][:250],'priorText':other['text'][:250]})
        matches.sort(key=lambda x: (x['severity']=='HIGH', x['similarity']), reverse=True)
        if matches:flags.append({'candidateOrigin':cand['origin'],'topMatches':matches[:4]})
    high=sum(any(m['severity']=='HIGH' for m in x['topMatches']) for x in flags)
    report={
        'status':'HIGH_SIMILARITY_BLOCKED' if high else 'REVIEW_REQUIRED',
        'warning':'Automated lexical comparisons do NOT certify unseen originality; human semantic audit required.',
        'candidate':str(Path(a.paper).resolve()),'candidateQuestions':sum(i['type']=='question' for i in candidate),
        'candidateSources':sum(i['type']=='source' for i in candidate),
        'priorFilesRead':read,'priorReadErrors':errors,
        'unitLessonFileCountExpected':a.unit_expected,'unitLessonFileCountReportedByUser':None,
        'coverageNote':'Expected count alone cannot prove correct set of lesson IDs or approved versions. Check manifest manually.',
        'highRiskItemCount':high,'flaggedItemCount':len(flags),'flags':flags}
    if a.out:Path(a.out).write_text(json.dumps(report,indent=2,ensure_ascii=False)+'\n',encoding='utf8')
    print(f"{report['status']}: {len(read)} files, {len(prior)} prior blocks; {len(flags)} new items flagged, {high} HIGH. {len(errors)} errors")
    if errors: print('WARNING: some prior sources not read; check report.')
    if a.unit_expected is not None and len(read)<a.unit_expected:print('WARNING: fewer files read than required lesson count, assessment originality NOT verified.')
    if not prior:print('ERROR: no question/source blocks extracted; inspect prior files and extraction coverage',file=sys.stderr);return 3
    return 2 if high else 1 if errors else 0
if __name__=='__main__': sys.exit(main())
