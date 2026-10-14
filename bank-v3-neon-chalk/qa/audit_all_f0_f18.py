#!/usr/bin/env python3
"""Read-only comprehensive static + Chromium audit of NOVA maths F0–F18."""
import hashlib, json, os, re, shutil, subprocess, sys, time, traceback
from collections import Counter, defaultdict
from html.parser import HTMLParser
from pathlib import Path
from tempfile import TemporaryDirectory
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/"qa"/"full-audit-2026-10-14"
OUT.mkdir(parents=True,exist_ok=True)
NUM=[17,12,16,15,12,19,14,14,18,13,20,13,15,14,13,14,16,14,12]
ALIASES={
"F1-04":"F1-01","F1-12":"F1-01","F2-04":"F2-03",
"F4-05":"F5-11","F4-10":"F4-08",
"F5-03":"SHARED ENGINE WITH F5-08","F5-04":"F1-01","F5-16":"F5-15",
"F6-08":"F10-05","F6-12":"F18-02","F6-13":"F14-11",
"F7-04":"F7-01","F7-05":"F7-01","F7-09":"F7-01","F7-10":"F7-01","F7-11":"F4-08","F7-12":"F8-03",
"F8-02":"F8-01","F8-04":"F8-03","F8-13":"F3-10",
"F11-12":"F18-03","F11-13":"F11-11",
"F15-03":"F10-03","F15-04":"F15-02","F15-05":"F14-11",
"F18-09":"F18-02"}
# F5-03 is an actual standalone AND shared source for F5-08; do NOT exempt it.
ALIASES.pop("F5-03",None)
ALIASES["F5-08"]="F5-03"
counts,components,inventory,findings={},[],[],[]
def finding(sev,category,cid,message,detail=None):
    findings.append({"severity":sev,"category":category,"id":cid,"message":message,**({"detail":str(detail)[:800]} if detail else {})})
for fam,n in enumerate(NUM):
    family="F"+str(fam); folder=ROOT/family
    htmls=list(folder.glob("*.html"))
    for idx in range(1,n+1):
        cid=f"{family}-{idx:02d}"
        hit=[p for p in htmls if re.search(rf"(?<![A-Za-z0-9]){re.escape(cid)}(?![0-9])",p.stem,re.I)]
        if cid in ALIASES:
            inventory.append({"id":cid,"kind":"shared/preset","represented_by":ALIASES[cid],"extra_html":[x.name for x in hit]})
            if not hit and ALIASES[cid].startswith("F") and not (ROOT/ALIASES[cid].split("-")[0]).exists():finding("HIGH","inventory",cid,"Mapped canonical folder missing")
        elif len(hit)==1:
            components.append((cid,hit[0]))
            inventory.append({"id":cid,"kind":"standalone","path":str(hit[0].relative_to(ROOT))})
        elif not hit:
            inventory.append({"id":cid,"kind":"MISSING"})
            finding("CRITICAL","inventory",cid,"Required standalone HTML not present")
        else:
            inventory.append({"id":cid,"kind":"duplicate","paths":[str(z.relative_to(ROOT)) for z in hit]})
            finding("HIGH","inventory",cid,"Multiple HTML candidates; ambiguous canonical",",".join(x.name for x in hit))
    counts[family]={"planned":n,"html_count":len(htmls),"needed":n-sum(1 for x in ALIASES if x.startswith(family+"-")),"found":sum(1 for x in components if x[0].startswith(family+"-"))}
# detect source vs built divergence: run build in fresh temporary copy? NEVER modify canonical source.
class Checker(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.tags=Counter();self.ids=[];self.scripts=[];self.in_script=False;self.scripttxt="";self.external=[];self.img_missing_alt=0;self.inline_styles=0
    def handle_starttag(self,tag,attrs):
        d=dict(attrs); self.tags[tag]+=1
        if "id" in d:self.ids.append(d["id"])
        if tag=="script":
            self.in_script=True;self.scripttxt=""
            if "src" in d:self.external.append(d["src"])
        if tag=="img" and not d.get("alt"):self.img_missing_alt+=1
        if tag=="link" and d.get("rel")=="stylesheet":self.external.append(d.get("href",""))
    def handle_data(self,data):
        if self.in_script:self.scripttxt+=data
    def handle_endtag(self,tag):
        if tag=="script":
            self.scripts.append(self.scripttxt);self.in_script=False;self.scripttxt=""
strec=[]
js_dir=OUT/"_syntax_cache";js_dir.mkdir(exist_ok=True)
for ix,(cid,p) in enumerate(components):
    try:
        txt=p.read_text(encoding="utf-8",errors="replace")
        parser=Checker();parser.feed(txt)
        info={"id":cid,"path":str(p.relative_to(ROOT)),"bytes":p.stat().st_size,"sha256":hashlib.sha256(p.read_bytes()).hexdigest(),
            "html_tags":sum(parser.tags.values()),"scripts":len(parser.scripts),"svg_tags":parser.tags["svg"],
            "image_tags":parser.tags["img"],"buttons":parser.tags["button"],"external_resources":parser.external,
            "duplicate_ids":list(k for k,v in Counter(parser.ids).items() if v>1)[:15],
            "unresolved_build_tokens": bool(re.search(r"@@(?:CSS|JS)@@",txt)),
            "node_syntax_errors":[],"maths_font":bool(re.search(r"NOVA Chalk|nova-font-chalk",txt,re.I)),
            "includes_core":("NOVA" in txt and ("numberLine" in txt or cid.startswith("F0-"))),
            "reduced_motion":bool(re.search(r"prefers-reduced-motion|reducedMotion|reduced_motion",txt,re.I)),
            "modes_mentioned":{mode:bool(re.search(mode,txt,re.I)) for mode in ["watch","guided","explore","challenge"]},
            "viewport_meta":bool(re.search(r'<meta[^>]+name=["\']viewport',txt,re.I)) }
        if info["unresolved_build_tokens"]:finding("CRITICAL","build",cid,"Unexpanded build placeholders in shipped HTML")
        if parser.img_missing_alt:finding("MEDIUM","accessibility",cid,f"{parser.img_missing_alt} image elements missing alt attribute")
        if info["duplicate_ids"]:finding("HIGH","html",cid,"Duplicate DOM element IDs",str(info["duplicate_ids"]))
        if not info["maths_font"]:finding("MEDIUM","house_style",cid,"NOVA Chalk font not identifiable")
        if not info["viewport_meta"]:finding("HIGH","responsive",cid,"Missing viewport meta")
        if parser.external:finding("MEDIUM","portability",cid,"External linked script/style",str(parser.external[:5]))
        if not parser.scripts:finding("HIGH","functional",cid,"No inline script in standalone HTML")
        for si,sc in enumerate(parser.scripts):
            if not sc.strip():continue
            tmp=js_dir/(cid+"-"+str(si)+".js");tmp.write_text(sc,encoding="utf-8")
            try:
                ret=subprocess.run(["node","--check",str(tmp)],text=True,capture_output=True,timeout=20)
                if ret.returncode:
                    info["node_syntax_errors"].append(ret.stderr[-1000:].strip())
                    finding("CRITICAL","javascript",cid,"JS syntax check failed",ret.stderr[-800:])
            except Exception as e:finding("HIGH","harness",cid,"Could not perform node syntax check",str(e))
            tmp.unlink(missing_ok=True)
        strec.append(info)
    except Exception as e:
        finding("CRITICAL","html",cid,"Parser unable to inspect production file",str(e))
        strec.append({"id":cid,"path":str(p.relative_to(ROOT)),"fatal":str(e)})
shutil.rmtree(js_dir,ignore_errors=True)
(OUT/"inventory.json").write_text(json.dumps(inventory,indent=2))
(OUT/"static-results.json").write_text(json.dumps(strec,indent=2))
print("STATIC_COMPLETE",len(components),"missing",sum(x["kind"]=="MISSING" for x in inventory),"findings",len(findings),flush=True)
# Browser smoke checks: EVERY standalone at 380 and 1280, plus four mode switches at 380.
from playwright.sync_api import sync_playwright
smoke=[]
try:
 with sync_playwright() as pw:
    chrom=os.environ.get("CHROME_BIN","/usr/bin/google-chrome")
    if not Path(chrom).exists():chrom=shutil.which("google-chrome") or shutil.which("chromium") or "/usr/bin/chromium"
    browser=pw.chromium.launch(headless=True,executable_path=chrom,args=["--no-sandbox","--disable-dev-shm-usage","--disable-gpu"])
    for ix,(cid,p) in enumerate(components):
        row={"id":cid,"path":str(p.relative_to(ROOT)),"widths":{},"pageerrors":[],"console_errors":[]}
        for width in [380,1280]:
            page=None
            try:
                page=browser.new_page(viewport={"width":width,"height":900},reduced_motion="reduce")
                page.on("pageerror",lambda e,r=row:r["pageerrors"].append(str(e)[:350]))
                page.on("console",lambda m,r=row:r["console_errors"].append(m.text[:250]) if m.type=="error" and len(r["console_errors"])<8 else None)
                start=time.monotonic()
                page.goto(p.resolve().as_uri(),wait_until="domcontentloaded",timeout=30000)
                page.wait_for_timeout(70)
                base=page.evaluate("""() => ({body:!!document.body, scroll:document.documentElement.scrollWidth,
                  inner:window.innerWidth, hasSVG:!!document.querySelector('svg'), hasNOVA:!!window.NOVA,
                  tabs:document.querySelectorAll('.nova-tab').length,
                  visibleBtns:[...document.querySelectorAll('button')].filter(e=>e.getBoundingClientRect().width>0&&e.getBoundingClientRect().height>0).length,
                  title:document.title, unhiddenStage:[...document.querySelectorAll('.nova-stage')].filter(e=>getComputedStyle(e).display!=='none').length
                })""")
                base["elapsed_ms"]=round((time.monotonic()-start)*1000)
                row["widths"][str(width)]=base
                if base["scroll"]>width+3:
                    finding("HIGH","responsive",cid,f"Horizontal document overflow at {width}px",f"scrollWidth={base['scroll']}")
                if not base["hasSVG"]:
                    finding("HIGH","render",cid,f"No SVG element after mount at {width}px")
                if not base["visibleBtns"]:
                    finding("HIGH","render",cid,f"No visible buttons after mount at {width}px")
                if not base["hasNOVA"]:
                    finding("HIGH","runtime",cid,f"Shared NOVA core absent after mount at {width}px")
                if width==380:
                    row["modes"]={}
                    for mode in ["watch","guided","explore","challenge"]:
                        found=False
                        for selector in [f'.nova-tab[data-m="{mode}"]',f'.nova-tab[data-mode="{mode}"]',f'[role="tab"][data-mode="{mode}"]']:
                            obj=page.locator(selector)
                            if obj.count():
                                found=True
                                try:
                                    obj.first.click(timeout=2300,force=True)
                                    page.wait_for_timeout(25)
                                    row["modes"][mode]={"status":"clicked","svg":page.locator("svg").count()}
                                except Exception as e:row["modes"][mode]={"status":"error","detail":str(e)[:240]};finding("MEDIUM","interaction",cid,mode+" tab click failed",str(e)[:240])
                                break
                        if not found:
                            row["modes"][mode]={"status":"selector_not_found"}
                    # The exact markup may use a different mode API: record, not condemn it.
                page.close()
            except Exception as e:
                row["widths"][str(width)]={"fatal":str(e)[:500]}
                finding("HIGH","browser",cid,f"Browser check failed at {width}px",str(e)[:350])
                if page:
                    try:page.close()
                    except:pass
        if row["pageerrors"]:finding("HIGH","runtime",cid,"Uncaught JavaScript errors during smoke test",str(row["pageerrors"][:4]))
        if row["console_errors"]:finding("MEDIUM","console",cid,"Browser console errors during smoke test",str(row["console_errors"][:4]))
        smoke.append(row)
        if (ix+1)%20==0:print("BROWSER_PROGRESS",ix+1,"of",len(components),"findings",len(findings),flush=True)
    browser.close()
except Exception as e:
 finding("CRITICAL","harness","ALL","Browser harness failed; coverage incomplete",str(e)+" "+traceback.format_exc()[-1000:])
(OUT/"browser-results.json").write_text(json.dumps(smoke,indent=2))
(OUT/"findings.json").write_text(json.dumps(findings,indent=2))
severity=Counter(f["severity"] for f in findings);cat=Counter(f["category"] for f in findings)
byfam={f"F{n}":{"total":sum(1 for r in components if r[0].startswith(f"F{n}-")),"issues":sum(1 for f in findings if re.match(rf"F{n}-",f["id"]))} for n in range(19)}
summary={"base_commit":os.environ.get("AUDIT_BASE_SHA","unknown"),"audit_branch":os.environ.get("GITHUB_REF_NAME","unknown"),"planned_master_items":sum(NUM),"shared_mapping_items":len(ALIASES),"required_standalone":sum(NUM)-len(ALIASES),"production_html_found":len(components),"browsed_files":len(smoke),"browsed_width_tests":sum(len(x["widths"]) for x in smoke),"severity":severity,"category":cat,"families":byfam,"findings_count":len(findings),"missing_ids":[x["id"] for x in inventory if x["kind"]=="MISSING"]}
(OUT/"summary.json").write_text(json.dumps(summary,indent=2))
lines=["# NOVA Maths V2 F0–F18 automated audit | 14 October 2026","",
 f"Source commit: {summary['base_commit']} (main snapshot); audit ran in isolated branch.",
 "","## Coverage",
 f"- Master entries: {summary['planned_master_items']}",
 f"- Preset/shared entries: {summary['shared_mapping_items']}",
 f"- Expected standalone HTML: {summary['required_standalone']}",
 f"- Standalone inspected statically: {len(components)}",
 f"- Browser pages inspected: {len(smoke)} (2 widths each; 4 mode-tab attempts at 380px)",
 f"- Findings: {len(findings)}. Breakdown: {dict(severity)}.",
 "","## Family overview","",
 "| Family | Production HTML | Findings |","|---|---:|---:|"]
for f,d in byfam.items():lines.append(f"| {f} | {d['total']} | {d['issues']} |")
lines+=["","## Findings grouped by severity",""]
for sev in ["CRITICAL","HIGH","MEDIUM","LOW"]:
 fl=[f for f in findings if f["severity"]==sev]
 lines.append("### "+sev+" ("+str(len(fl))+")")
 if len(fl)>130:lines.append("*Full set in findings.json; first 130 shown.*")
 for f in fl[:130]:lines.append(f"- **{f['id']}** [{f['category']}] {f['message']}"+(f": {f['detail'][:180]}" if f.get("detail") else ""))
lines+=["","## Limits of evidence",
 "- Browser smoke tests do NOT validate every answer, mathematical proof, state transition, drag stress, print page, narration or all responsive layouts.",
 "- DOM-based checks can raise false positives; reproduce each finding manually before a production edit.",
 "- Screenshots and screenshot-based visual comparisons were NOT performed by this automated pass.",
 "- Existing legacy QA evidence is not treated as current proof of acceptance.",
 "- No production code was modified by this audit."]
(OUT/"AUDIT-REPORT.md").write_text("\n".join(lines))
print("AUDIT_DONE",json.dumps(summary),flush=True)
