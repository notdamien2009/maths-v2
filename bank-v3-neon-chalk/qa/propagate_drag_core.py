#!/usr/bin/env python3
"""Apply ONLY the reviewed shared NOVA drag-engine delta to embedded standalone HTML.
Never rebuild from potentially stale component sources. Fail closed on ambiguity.
"""
from pathlib import Path
import subprocess
import sys

root = Path(__file__).resolve().parents[1]
rel = "bank-v3-neon-chalk/core/nova-core.js"
old = subprocess.check_output(["git", "show", "d972b94634a9603c551b7a7978bf64494b144465:" + rel], text=True)
new = (root / "core/nova-core.js").read_text()
start = "/* ===== v3.6.2 SVG DRAG RULES"
end = "  return el;};"
def section(txt):
    a = txt.index(start)
    b = txt.index(end, a) + len(end)
    return txt[a:b]
a, b = section(old), section(new)
assert a != b and len(a) > 4000 and len(b) > 4000
# Target the separately installed window-level release listener as well.
old_listener = "window.addEventListener('pointerup',function(e){if(NOVA.ui._drag&&!NOVA.ui._drag.captured)NOVA.ui._drag.up(e);});"
new_listener = "window.addEventListener('pointerup',function(e){if(NOVA.ui._drag)NOVA.ui._drag.up(e);},true);"
# The window handler is inside the replaced section, not a second replacement.
assert old_listener in a and new_listener in b
files = sorted(p for family in root.glob("F[0-9]*") if family.is_dir() for p in family.glob("*.html"))
changed = []
already = []
skipped = []
for path in files:
    data = path.read_text()
    if data.count(a) == 1:
        modified = data.replace(a, b)
        assert modified.count(b) == 1
        path.write_text(modified)
        changed.append(str(path.relative_to(root)))
    elif data.count(b) == 1:
        already.append(str(path.relative_to(root)))
    else:
        skipped.append(str(path.relative_to(root)))
print("NOVA_DRAG_EMBEDDED_REPAIR", "updated",len(changed),"already",len(already),"no_canonical_core",len(skipped),"files_scanned",len(files))
print("UPDATED_FILES", *changed, sep="\n")
print("SKIPPED_FILES", *skipped, sep="\n")
if not changed and not already:
    sys.exit("ERROR: no embedded core found; no safe mass repair possible")
