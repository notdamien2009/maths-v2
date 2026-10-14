#!/usr/bin/env python3
"""Read-only fast mouse-drag integrity stress across F0–F18."""
import json,os,re,shutil,time,traceback
from collections import Counter,defaultdict
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"qa"/"drag-audit-2026-10-14"
OUT.mkdir(parents=True,exist_ok=True)
inv=json.loads((ROOT/"qa"/"full-audit-2026-10-14"/"inventory.json").read_text())
files=[(r["id"],ROOT/r["path"]) for r in inv if r["kind"]=="standalone"]
# Canonical F0-02 standalone is already represented in the inventory.
files.sort(key=lambda x:(int(x[0].split("-")[0][1:]),int(x[0].split("-")[1])))
assert len(files)>=254,len(files)
findings=[];runs=[];stats=Counter();byfam=defaultdict(Counter)
def flag(sev,cid,cat,msg,details=None):
  findings.append({"severity":sev,"id":cid,"category":cat,"message":msg,**({"details":details} if details else {})})
def snapshot(page):
 return page.evaluate("""() => {
    let d=window.NOVA?.ui?._drag;
    return {active:!!d,captured:d?.captured??null,moved:d?.moved??null,connected:d?.el?.isConnected??null,
    lift:document.querySelectorAll('.nv-drag-lift').length,
    svgDrags:document.querySelectorAll('svg [data-drag]').length,
    htmlDrags:document.querySelectorAll('[draggable=true], [data-draggable], [data-drag-handle], [data-drag-source]').length,
    opacityProblems:[...document.querySelectorAll('.nv-drag-lift')].filter(e=>e.getAttribute('opacity')==='0').length }
 }""")
def candidate(page):
 return page.evaluate("""() => {
   const es=[...document.querySelectorAll('svg [data-drag]')];
   let all=es.filter(e=>e.isConnected&&e.getClientRects().length);
   function visible(e){
      let r=e.getBoundingClientRect(),s=getComputedStyle(e);
      return r.width>7&&r.height>7&&s.display!=='none'&&s.visibility!=='hidden'&&r.right>10&&r.bottom>80&&r.left<innerWidth-10&&r.top<innerHeight-25;
   }
   const xs=all.filter(visible);
   for(let i=0;i<xs.length;i++){
     let e=xs[i],r=e.getBoundingClientRect(),hit=e.querySelector('.nv-hit')||e;
     let hr=hit.getBoundingClientRect();
     let x=Math.max(8,Math.min(innerWidth-8,hr.left+hr.width/2)), y=Math.max(90,Math.min(innerHeight-12,hr.top+hr.height/2));
     let under=document.elementFromPoint(x,y);
     if(!under)continue;
     if(under===e||e.contains(under)){
       let sel=Array.prototype.indexOf.call(document.querySelectorAll('svg [data-drag]'),e);
       return {index:sel,count:es.length,visible:xs.length,x:Math.round(x),y:Math.round(y),
          bounds:{x:r.x,y:r.y,width:r.width,height:r.height}};
     }
   }
   return {index:-1,count:es.length,visible:xs.length};
 }""")
with sync_playwright() as pw:
 exe=os.environ.get("CHROME_BIN") or shutil.which("google-chrome") or shutil.which("chromium") or "/usr/bin/chromium"
 browser=pw.chromium.launch(headless=True,executable_path=exe,args=["--no-sandbox","--disable-dev-shm-usage","--disable-gpu"])
 for idx,(cid,p) in enumerate(files):
  row={"id":cid,"path":str(p.relative_to(ROOT)),"modes":{},"exceptions":[]}
  page=browser.new_page(viewport={"width":1280,"height":900},reduced_motion="no-preference")
  page.on("pageerror",lambda e,row=row:row["exceptions"].append(str(e)[:350]))
  try:
   page.goto(p.resolve().as_uri(),wait_until="domcontentloaded",timeout=35000)
   page.wait_for_timeout(60)
   for mode in ["explore","guided","challenge"]:
    tab=page.locator('.nova-tab[data-m="'+mode+'"],.nova-tab[data-mode="'+mode+'"]')
    if not tab.count():
     row["modes"][mode]={"status":"no_tab"};continue
    try:tab.first.click(force=True,timeout=2500)
    except Exception as e:row["modes"][mode]={"status":"tab_failed","detail":str(e)[:220]};continue
    page.wait_for_timeout(50)
    entry={"at_start":snapshot(page)}
    el=candidate(page)
    entry["candidate"]=el
    if el["index"]<0:
      entry["status"]="no_visible_core_drag"
      # This is NOT a failure: some engines use sliders, clicks or custom pointer handlers instead.
      row["modes"][mode]=entry;continue
    entry["status"]="tested"
    stats["draggable_modes"]+=1;byfam[cid.split("-")[0]]["draggable_modes"]+=1
    x,y=el["x"],el["y"]
    # Travel across screen in a single pointermove event (replicates high-speed mouse flick).
    tx=1100 if x<640 else 160
    ty=730 if y<450 else 170
    if abs(tx-x)+abs(ty-y)<140:tx=200 if tx==1100 else 1060
    try:
      page.mouse.move(x,y,steps=2)
      page.mouse.down()
      page.wait_for_timeout(8)
      down=snapshot(page)
      entry["down"]=down
      if not down["active"]:
        entry["status"]="pointerdown_did_not_activate"
        flag("HIGH",cid,"drag-start",mode+": data-drag did not activate on pointerdown",el)
        page.mouse.up()
        row["modes"][mode]=entry;continue
      # rapid movement: one step, then immediate reverse; no built-in human drag delay
      page.mouse.move(tx,ty,steps=1)
      fast=snapshot(page)
      entry["fast_1"]=fast
      page.mouse.move(x+12,y+9,steps=1)
      fast2=snapshot(page)
      entry["fast_return"]=fast2
      # Important: premature lostpointercapture here leaves the piece floating and unresponsive.
      if not fast["active"] or not fast2["active"]:
        flag("HIGH",cid,"fast-drag",mode+": active drag cancelled DURING rapid mouse movement",{"down":down,"fast":fast,"fast2":fast2})
        entry["status"]="premature_drag_cancellation"
      # Simulate mouse leaving the original draggable and releasing over unaccepted space.
      page.mouse.move(tx,ty,steps=1)
      page.mouse.up()
      page.wait_for_timeout(650)
      after=snapshot(page)
      entry["after_release"]=after
      if after["active"]:
        flag("HIGH",cid,"release",mode+": drag stuck/floating after mouseup and return animation",after)
        entry["status"]="stuck_after_release"
      # Second fast drag tests ability to regrab after wrong-place drop.
      re=candidate(page)
      entry["regrab_candidate"]=re
      if re["index"]>=0:
        page.mouse.move(re["x"],re["y"],steps=1)
        page.mouse.down()
        page.wait_for_timeout(5)
        entry["regrab_start"]=snapshot(page)
        if not entry["regrab_start"]["active"]:
          flag("HIGH",cid,"regrab",mode+": failed to pick up same type of piece after release",entry["regrab_start"])
        else:
          page.mouse.move(tx,ty,steps=1)
          page.keyboard.press("Escape")
          page.mouse.up()
          page.wait_for_timeout(450)
          entry["escape_end"]=snapshot(page)
          if entry["escape_end"]["active"]:
            flag("HIGH",cid,"escape",mode+": Escape left lifted/stuck piece",entry["escape_end"])
      row["modes"][mode]=entry
    except Exception as e:
      flag("HIGH",cid,"execution",mode+": test exception",str(e)[:300])
      entry["status"]="test_exception"
      entry["error"]=str(e)[:350]
      row["modes"][mode]=entry
      try:page.mouse.up()
      except:pass
      try:page.keyboard.press("Escape")
      except:pass
    # ensure no drag leaks to next mode
    try:page.keyboard.press("Escape")
    except:pass
   if row["exceptions"]:flag("HIGH",cid,"runtime","Uncaught browser page error during drag stress",row["exceptions"][:3])
  except Exception as e:
    flag("HIGH",cid,"harness","Component page failed to load for drag stress",str(e)[:270]);row["fatal"]=str(e)[:400]
  runs.append(row)
  page.close()
  stats["files"]+=1
  if (idx+1)%20==0:print("DRAG_PROGRESS",idx+1,"/",len(files),"modes",stats["draggable_modes"],"findings",len(findings),flush=True)
 browser.close()
(OUT/"all-results.json").write_text(json.dumps(runs,indent=2))
(OUT/"findings.json").write_text(json.dumps(findings,indent=2))
summary={"files":len(runs),"mode_candidates_tested":stats["draggable_modes"],
 "tested_engines":sum(1 for x in runs if any(z.get("status") not in ("no_visible_core_drag","no_tab") for z in x["modes"].values())),
 "families":{k:dict(v) for k,v in byfam.items()},
 "high_findings":sum(1 for x in findings if x["severity"]=="HIGH"),
 "unique_affected":sorted(set(x["id"] for x in findings)),
 "findings":findings[:120],"limitations":[
  "Only draggable SVG elements marked data-drag in the current visible mode are exercised.",
  "A non-data-drag custom drag implementation may exist; it must be audited separately.",
  "Moving to deliberately invalid positions tests cleanup, not successful drop-target snapping.",
  "Headless timing is not representative of a student's slower PC; real device/manual check required.",
  "The browser uses desktop pointer and tests Explore, Guided and Challenge when available.",
  "No production file was edited."]}
(OUT/"summary.json").write_text(json.dumps(summary,indent=2))
print("DRAG_AUDIT_COMPLETE",json.dumps(summary)[:9000],flush=True)
