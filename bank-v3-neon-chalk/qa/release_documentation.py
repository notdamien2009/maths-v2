#!/usr/bin/env python3
"""Production documentation release: remove obsolete approval holds from active specs.
Preserve historical QA results and all executable component/lesson safeguards.
"""
from pathlib import Path
import re, json
root=Path(__file__).resolve().parents[1]
release="00-master/PRODUCTION-RELEASE-F0-F18-2026-10-14.md"
banner=("> **CURRENT F0–F18 STATUS (2026-10-14): APPROVED FOR LESSON PRODUCTION.** "
"Any older component-library sign-off, blocker, release gate or pending-approval statement below is "
"historical and superseded by ["+release+"]("+"/".join(["..",release])+"). "
"All functional QA and mathematical correctness requirements still apply.\n\n")
patterns=[
  (re.compile(r'fraction design TBD',re.I),'approved NOVA Chalk stacked fraction notation'),
  (re.compile(r'Fraction \\(TBD placeholder\\)',re.I),'Fraction (approved NOVA Chalk stacked notation)'),
  (re.compile(r'visual design not decided yet',re.I),'visual design approved as vertically stacked NOVA Chalk fractions'),
]
review=re.compile(r'(?i)\\b(blocked|blocking|approval gate|release gate|production gate|pending approval|awaiting approval|manual sign.off|hold for approval|not approved|TBD)\\b')
updated=[];flagged=[];fractions=[]
for folder in ('docs','prompts','source','build','tests'):
 d=root/folder
 if not d.exists():continue
 for p in sorted(d.rglob('*')):
  if not p.is_file() or p.suffix.lower() not in ('.md','.txt'):continue
  if '.bak' in p.name:continue
  try:original=p.read_text()
  except UnicodeDecodeError:continue
  text=original
  for pattern,replacement in patterns:text=pattern.sub(replacement,text)
  hits=review.findall(text)
  if hits and not text.startswith('> **CURRENT F0–F18 STATUS'):
   text=banner+text
  if text!=original:
   p.write_text(text)
   updated.append(str(p.relative_to(root)))
  if hits:flagged.append({'file':str(p.relative_to(root)),'historical_gate_terms':len(hits)})
  if re.search(r'fraction.{0,35}TBD|TBD.{0,35}fraction',text,re.I):
   fractions.append(str(p.relative_to(root)))
# Historical archives, JSON manifests and audit snapshots are never rewritten.
report={'release':'F0–F18 APPROVED','updated_active_documents':len(updated),'files_updated':updated,
        'historical_language_with_precedence_notice':flagged,
        'remaining_fraction_tbd_in_active_text':fractions,
        'note':'The banner supersedes prior approval gates; functional QA retained. Historical JSON/archives preserved.'}
out=root/'docs'/'PRODUCTION-DOCUMENTATION-RELEASE-AUDIT-2026-10-14.json'
out.parent.mkdir(exist_ok=True)
out.write_text(json.dumps(report,indent=2)+'\n')
print('DOCUMENT_RELEASE_AUDIT',json.dumps({'updated':len(updated),'historical_docs':len(flagged),'fraction_tbd':fractions}))
if fractions:raise SystemExit('Unresolved fraction TBD in active text')
