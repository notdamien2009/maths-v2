#!/usr/bin/env python3
"""Insert a PUBLIC validated pupil paper into a COPY of the v1.0 HTML shell.
Usage: python embed_paper.py STUDENT-TEMPLATE.html PAPER.json OUTPUT.html
Important: does not embed PRIVATE mark schemes. Validate schema separately first.
"""
import json,re,sys,hashlib
from pathlib import Path
if len(sys.argv)!=4:sys.exit(__doc__)
base,public,out=map(Path,sys.argv[1:])
raw=base.read_text(encoding='utf8')
paper=json.loads(public.read_text(encoding='utf8'))
from validate_assessment_pack import validate
try:
    validate(paper)
except (ValueError,KeyError,TypeError) as e:
    sys.exit(f'Invalid public paper or private-data leak: {e}')
serialized=json.dumps(paper,ensure_ascii=False,indent=2).replace('<','\\u003c').replace('>','\\u003e')
pat=re.compile(r'(<script\b(?=[^>]*\bid=["\']novaAssessmentPaper["\'])(?=[^>]*\btype=["\']application/json["\'])[^>]*>)(.*?)(</script>)',re.S|re.I)
updated,count=pat.subn(lambda m:m.group(1)+'\n'+serialized+'\n'+m.group(3),raw)
if count!=1:sys.exit(f'Expected exactly one paper script, found {count}')
if out.resolve()==base.resolve():sys.exit('Refusing to overwrite master assessment engine')
out.write_text(updated,encoding='utf8')
print('EMBEDDED',paper.get('assessmentId'),out)
print('BASE-SHA256',hashlib.sha256(base.read_bytes()).hexdigest())
print('OUTPUT-SHA256',hashlib.sha256(out.read_bytes()).hexdigest())
