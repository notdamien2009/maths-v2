#!/usr/bin/env python3
"""Apply the NOVA v3 fast-pointer repair to canonical and *embedded* core copies.
Preserves engine maths, DOM/layout, rendering and all other scripts exactly.
Run from the repository; idempotent and fails on unknown core layouts.
"""
from pathlib import Path
import json,re
root=Path(__file__).resolve().parents[1]
needles={
 "capture": "    try{el.setPointerCapture(e.pointerId);st.captured=el.hasPointerCapture?el.hasPointerCapture(e.pointerId):true;}catch(_){st.captured=false;}\n    var home=el.parentNode,next=el.nextSibling;svg.appendChild(el);el.classList.add('nv-drag-lift');el.style.cursor='grabbing';var rm=NOVA.reducedMotion();",
 "finish": "      el.removeEventListener('pointermove',st.move);el.removeEventListener('pointerup',st.up);el.removeEventListener('pointercancel',st.cancel);el.removeEventListener('lostpointercapture',st.lost);window.removeEventListener('pointermove',st.move);",
 "lost": "    st.lost=function(){if(!st.done)setTimeout(function(){if(!st.done&&st.captured)back();},0);};",
 "listeners": "    el.addEventListener('pointermove',st.move);el.addEventListener('pointerup',st.up);el.addEventListener('pointercancel',st.cancel);el.addEventListener('lostpointercapture',st.lost);\n    if(!st.captured)window.addEventListener('pointermove',st.move);",
 "lag": "var k=rm?1:.38;",
}
replacements={
 "capture": "    var home=el.parentNode,next=el.nextSibling;svg.appendChild(el);el.classList.add('nv-drag-lift');el.style.cursor='grabbing';var rm=NOVA.reducedMotion();\n    /* Fast drag: capture AFTER reparenting (moving a captured SVG element releases capture). */\n    try{el.setPointerCapture(e.pointerId);st.captured=el.hasPointerCapture?el.hasPointerCapture(e.pointerId):true;}catch(_){st.captured=false;}",
 "finish": "      el.removeEventListener('pointermove',st.move);el.removeEventListener('pointerup',st.up);el.removeEventListener('pointercancel',st.cancel);el.removeEventListener('lostpointercapture',st.lost);window.removeEventListener('pointermove',st.move);window.removeEventListener('pointerup',st.up);window.removeEventListener('pointercancel',st.cancelPointer);",
 "lost": "    st.lost=function(){st.captured=false;if(!st.done&&!el.isConnected)st.cancel();};\n    st.cancelPointer=function(ev){if(ev.pointerId===st.id)st.cancel();};",
 "listeners": "    /* Window listeners guarantee fast flicks still move and release outside the SVG piece. */\n    el.addEventListener('lostpointercapture',st.lost);\n    window.addEventListener('pointermove',st.move);window.addEventListener('pointerup',st.up);window.addEventListener('pointercancel',st.cancelPointer);",
 "lag": "var k=rm?1:.82;",
}
# Only production artefacts and their rebuild sources, never docs/QA/tests/archive images.
paths=[]
paths += list((root/"core").glob("*.js"))
for f in range(19):
 paths += list((root/f"F{f}").glob("*.html"))
paths += list((root/"build").glob("*.src.html"))
paths += list((root/"src").rglob("*.js"))
paths += list((root/"source").glob("*.js"))
changes=[];unmatched=[]
for path in sorted(set(paths)):
    try:source=path.read_text(encoding="utf-8")
    except UnicodeError:continue
    if "NOVA.ui.svgDrag=function(svg,el,o)" not in source:continue
    after=source
    # v1 repair was run twice on the isolated branch. Deduplicate any identical
    # pointerup/pointercancel cleanup and make every future run idempotent.
    pair="window.removeEventListener('pointerup',st.up);window.removeEventListener('pointercancel',st.cancelPointer);"
    while pair+pair in after:after=after.replace(pair+pair,pair)
    result={}
    for key,old in needles.items():
        # FINISH old string is a prefix of the patched string: never append twice.
        if replacements[key] in after:
            result[key]=0
            continue
        count=after.count(old)
        if count>0:after=after.replace(old,replacements[key])
        else:unmatched.append({"file":str(path.relative_to(root)),"part":key})
        result[key]=count
    if after!=source:
        path.write_text(after,encoding="utf-8")
        changes.append({"file":str(path.relative_to(root)),"parts":result,"bytes_before":len(source),"bytes_after":len(after)})
# Two already-customised families have their own v3.6.2 pointer fallback.
# F17 captured twice (once before and again after reparent); F5/F4 installed duplicate
# window listeners. Normalize BOTH to the same shared implementation, no duplicate callbacks.
for path in sorted(set(paths)):
    try:src=path.read_text(encoding="utf-8")
    except UnicodeError:continue
    if "NOVA.ui.svgDrag=function(svg,el,o)" not in src:continue
    dst=src
    if path.parent.name=="F17" and "capture AFTER reparenting" not in dst:
        k=dst.index("NOVA.ui.svgDrag=function(svg,el,o)")
        start=dst.find("    try{el.setPointerCapture(e.pointerId);",k)
        end=dst.find("    function frame()",start)
        if start>=0 and end>start and end-start<1500:
            old=dst[start:end]
            if "svg.appendChild(el);" in old and "Re-capture on the connected" in old:
                dst=dst[:start]+replacements["capture"]+"\n"+dst[end:]
    if path.parent.name in ("F5","F4") and "/* v3.6.2-F5 QA fix:" in dst:
        a=dst.index("    el.addEventListener('pointermove',st.move);",dst.index("NOVA.ui.svgDrag=function"))
        b=dst.index("    NOVA.ui._drag={cancel:st.cancel",a)
        dst=dst[:a]+replacements["listeners"]+"\n"+dst[b:]
        # Original F5 had two fallback removers; avoid duplicating cleanup.
        dst=dst.replace("window.removeEventListener('pointercancel',st.cancelPointer);window.removeEventListener('pointerup',st.up);window.removeEventListener('pointercancel',st.cancel);","window.removeEventListener('pointercancel',st.cancelPointer);")
    if dst!=src:
        path.write_text(dst,encoding="utf-8")
        changes.append({"file":str(path.relative_to(root)),"parts":{"family_variant":1},"bytes_before":len(src),"bytes_after":len(dst)})
# Re-examine AFTER variants instead of emitting false mismatch notices from the first pass.
unmatched=[]
for path in sorted(set(paths)):
    try:src=path.read_text(encoding="utf-8")
    except UnicodeError:continue
    if "NOVA.ui.svgDrag=function(svg,el,o)" not in src:continue
    for key,value in replacements.items():
        if value not in src:
            unmatched.append({"file":str(path.relative_to(root)),"part":key})

# Abort if any source with svgDrag has a different, unknown implementation, to avoid silent partial repair.
out=root/"qa"/"drag-repair-2026-10-14"
prior=json.loads((out/"patch-inventory.json").read_text()) if (out/"patch-inventory.json").exists() else {"files":[]}
by_file={x["file"]:x for x in prior.get("files",[])}
for entry in changes:by_file[entry["file"]]=entry
report={"changed":len(by_file),"files":list(by_file.values()),"unmatched":unmatched,"total_patched":sum(sum(x["parts"].values()) for x in by_file.values())}
out=root/"qa"/"drag-repair-2026-10-14"
out.mkdir(exist_ok=True)
(out/"patch-inventory.json").write_text(json.dumps(report,indent=2))
print("PATCH_COUNT",len(changes),"TOTAL_REPLACEMENTS",report["total_patched"],"UNMATCHED",len(unmatched),flush=True)
print("UNMATCHED_EXAMPLES",unmatched[:25],flush=True)
if unmatched:
 raise SystemExit("Refusing to approve incomplete drag repair; inspect unmatched sources")
