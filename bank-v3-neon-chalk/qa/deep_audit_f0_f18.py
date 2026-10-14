#!/usr/bin/env python3
"""NOVA follow-up: UI control smoke, canonical F0-02, maths sampling, defect diagnostics, screenshots."""
from __future__ import annotations
import json, os, re, shutil, time
from collections import Counter
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"qa"/"deep-audit-2026-10-14"
SHOT=OUT/"screenshots"
OUT.mkdir(parents=True,exist_ok=True)
SHOT.mkdir(exist_ok=True)
inv=json.loads((ROOT/"qa"/"full-audit-2026-10-14"/"inventory.json").read_text())
# The regular F0-02 is canonical. PREMIUM is an opt-in trial explicitly produced by build.py.
files=[(r["id"],ROOT/r["path"]) for r in inv if r["kind"]=="standalone"]
assert not [r for r in inv if r["kind"]=="MISSING"]
files.append(("F0-02",ROOT/"F0"/"F0-02-svg-primitives.html"))
files=sorted(files,key=lambda pair:(int(pair[0].split("-")[0][1:]),int(pair[0].split("-")[1])))
assert len(files)==255, len(files)
RECORDS=[]; ISSUES=[]; SAMPLES=[]
def flag(severity,component,msg,detail=None):ISSUES.append({"severity":severity,"id":component,"message":msg,**({"detail":detail} if detail else {})})
with sync_playwright() as pw:
    path=os.environ.get("CHROME_BIN")
    if not path or not Path(path).exists():path=shutil.which("google-chrome") or shutil.which("chromium") or "/usr/bin/chromium"
    b=pw.chromium.launch(headless=True,executable_path=path,args=["--no-sandbox","--disable-dev-shm-usage","--disable-gpu"])
    for idx,(cid,p) in enumerate(files):
        page=b.new_page(viewport={"width":380,"height":900},reduced_motion="reduce")
        row={"id":cid,"path":str(p.relative_to(ROOT)),"mode_controls":{},"page_errors":[]}
        page.on("pageerror",lambda e,row=row:row["page_errors"].append(str(e)[:400]))
        try:
            page.goto(p.resolve().as_uri(),wait_until="domcontentloaded",timeout=28000)
            page.wait_for_timeout(60)
            row["core"]=bool(page.evaluate("!!window.NOVA"))
            for mode in ["watch","guided","explore","challenge"]:
                tabs=page.locator(f'.nova-tab[data-m="{mode}"], .nova-tab[data-mode="{mode}"]')
                z={"tab_found":tabs.count()>0}
                if not z["tab_found"]:
                    flag("HIGH",cid,"Mode tab absent: "+mode)
                    row["mode_controls"][mode]=z;continue
                try:
                    tabs.first.click(force=True,timeout=2800)
                    page.wait_for_timeout(80)
                    z.update(page.evaluate("""mode=>{
                     let t=document.querySelector('.nova-tab[data-m="'+mode+'"], .nova-tab[data-mode="'+mode+'"]');
                     let root=document.querySelector('.nova-stage') || document.querySelector('#gallery') || document.body;
                     let rect=root.getBoundingClientRect();
                     return {active:t?.classList.contains('active')||t?.getAttribute('aria-selected')==='true',
                         svgCount:root.querySelectorAll('svg').length,
                         stageHeight:Math.round(rect.height),
                         inputs:root.querySelectorAll('input,select,textarea').length,
                         buttons:root.querySelectorAll('button').length,
                         textLength:(root.innerText||'').length,
                         debugCode:(root.innerText||'').includes('@@CSS@@')||(root.innerText||'').includes('@@JS@@')}
                     """,mode))
                    if not z["active"]:flag("HIGH",cid,"Tab did not become active: "+mode)
                    if z["stageHeight"]<20:flag("HIGH",cid,"Stage collapsed in mode: "+mode)
                    if mode=="guided":
                        z["controls_sampled"]=[]
                        for pat in [r"^(next|step forward|forward|continue|next step)(?:\s|$|→)",r"^(reset|restart|replay)(?:\s|$)",r"^(play|pause)(?:\s|$)"]:
                            # Main stage controls only; deliberately avoid unsafe Challenge submit.
                            buttons=page.locator(".nova-stage button, .nova-controls button, .step-controls button")
                            match=None
                            for k in range(min(buttons.count(),40)):
                                bt=buttons.nth(k)
                                if not bt.is_visible():continue
                                label=(bt.inner_text(timeout=400) or "").strip()
                                if re.search(pat,label,re.I):
                                    match=bt;break
                            if match is None:
                                z["controls_sampled"].append({"action":pat,"result":"not_available"})
                                continue
                            label=match.inner_text().strip()
                            try:
                                match.click(force=True,timeout=1800)
                                page.wait_for_timeout(40)
                                z["controls_sampled"].append({"action":label,"result":"clicked"})
                            except Exception as e:
                                z["controls_sampled"].append({"action":label,"result":"error","detail":str(e)[:180]})
                                flag("MEDIUM",cid,"Guided step control failed: "+label,str(e)[:180])
                except Exception as e:
                    z["mode_error"]=str(e)[:260];flag("HIGH",cid,mode+" mode interactive inspection error",str(e)[:260])
                row["mode_controls"][mode]=z
            if row["page_errors"]:flag("HIGH",cid,"Uncaught error after 4-mode interaction",str(row["page_errors"][:4]))
            fam=cid.split("-")[0]
            if cid==next(x[0] for x in files if x[0].startswith(fam+"-")):
                for mode in ["watch","challenge"]:
                    page.locator(f'.nova-tab[data-m="{mode}"],.nova-tab[data-mode="{mode}"]').first.click(force=True,timeout=1500)
                    page.wait_for_timeout(40)
                    page.screenshot(path=str(SHOT/(fam+"-"+mode+"-380.png")),full_page=False,animations="disabled",timeout=10000)
                page.set_viewport_size({"width":1280,"height":900})
                page.locator('.nova-tab[data-m="watch"],.nova-tab[data-mode="watch"]').first.click(force=True,timeout=1500)
                page.wait_for_timeout(50)
                page.screenshot(path=str(SHOT/(fam+"-watch-1280.png")),full_page=False,animations="disabled",timeout=10000)
            if cid=="F15-10":
                got=page.evaluate("""() => {const m=window.NOVA_F15_10_MATH;return m?{a30:m.ratios({angle:30,family:'3060',scale:1}),a45:m.ratios({angle:45,family:'4545',scale:1}),a60:m.ratios({angle:60,family:'3060',scale:1}),len3060:m.lengths({angle:30,family:'3060',scale:1}),len4545:m.lengths({angle:45,family:'4545',scale:1})}:null}""")
                row["math_probe"]=got
                if not got:flag("HIGH",cid,"Missing exposed mathematical API")
                else:
                    checks=[
                     ("sin(30)=0.5",abs(got["a30"]["sin"][2]-0.5)<1e-10),
                     ("cos(30)=sqrt(3)/2",abs(got["a30"]["cos"][2]-3**0.5/2)<1e-10),
                     ("tan(30)=sqrt(3)/3",abs(got["a30"]["tan"][2]-3**0.5/3)<1e-10),
                     ("sin(45)=sqrt(2)/2",abs(got["a45"]["sin"][2]-2**0.5/2)<1e-10),
                     ("cos(45)=sqrt(2)/2",abs(got["a45"]["cos"][2]-2**0.5/2)<1e-10),
                     ("tan(45)=1",abs(got["a45"]["tan"][2]-1)<1e-10),
                     ("sin(60)=sqrt(3)/2",abs(got["a60"]["sin"][2]-3**0.5/2)<1e-10),
                     ("cos(60)=0.5",abs(got["a60"]["cos"][2]-0.5)<1e-10),
                     ("tan(60)=sqrt(3)",abs(got["a60"]["tan"][2]-3**0.5)<1e-10),
                     ("30/60/90 Pythagorean",abs(got["len3060"]["base"]**2+got["len3060"]["height"]**2-got["len3060"]["hyp"]**2)<1e-10),
                     ("45/45/90 Pythagorean",abs(got["len4545"]["base"]**2+got["len4545"]["height"]**2-got["len4545"]["hyp"]**2)<1e-10)
                    ]
                    row["math_tests"]={k:v for k,v in checks}
                    for k,v in checks:
                        if not v:flag("CRITICAL",cid,"Math value failed: "+k)
            if cid=="F16-14":
                page.set_viewport_size({"width":380,"height":900})
                page.wait_for_timeout(70)
                row["overflow_diagnostic"]=page.evaluate("""() => ({
                    scrollWidth:document.documentElement.scrollWidth,
                    innerWidth:innerWidth,
                    nodes:[...document.querySelectorAll('*')].filter(e=>{
                        let r=e.getBoundingClientRect();let s=getComputedStyle(e);
                        return s.display!=='none' && s.visibility!=='hidden' && (r.right>innerWidth+2||r.left< -2) &&r.width>0;
                    }).slice(0,18).map(e=>({tag:e.tagName,cls:String(e.className).slice(0,100),id:e.id,
                         right:Math.round(e.getBoundingClientRect().right),width:Math.round(e.getBoundingClientRect().width),
                         outer:e.outerHTML.slice(0,190)}))
                 })""")
            if cid=="F16-15":
                row["negative_rects"]=page.evaluate("""() => [...document.querySelectorAll('rect')].filter(r=>Number(r.getAttribute('width'))<0).slice(0,12).map(r=>({outer:r.outerHTML.slice(0,360),parent:r.parentElement?.outerHTML.slice(0,400)}))""")
        except Exception as e:
            row["fatal"]=str(e)[:500];flag("HIGH",cid,"Interactive probe fatal",str(e)[:280])
        RECORDS.append(row)
        page.close()
        if (idx+1)%25==0:print("DEEP_PROGRESS",idx+1,"/",len(files),"findings",len(ISSUES),flush=True)
    b.close()
(OUT/"interactive-results.json").write_text(json.dumps(RECORDS,indent=2))
(OUT/"deep-findings.json").write_text(json.dumps(ISSUES,indent=2))
modeCounts={m:Counter(r["mode_controls"].get(m,{}).get("active") for r in RECORDS) for m in ["watch","guided","explore","challenge"]}
stepClicks=sum(sum(1 for c in r["mode_controls"].get("guided",{}).get("controls_sampled",[]) if c.get("result")=="clicked") for r in RECORDS)
summary={"expected":255,"actually_inspected":len(RECORDS),"all_mode_active_counts":{x:{str(k):v for k,v in c.items()} for x,c in modeCounts.items()},"step_buttons_clicked":stepClicks,
    "issue_count":len(ISSUES),"severities":dict(Counter(x["severity"] for x in ISSUES)),"issues":ISSUES,"screenshots":len(list(SHOT.glob("*.png")))}
(OUT/"deep-summary.json").write_text(json.dumps(summary,indent=2))
print("DEEP_AUDIT_COMPLETE",json.dumps(summary)[:6000],flush=True)
