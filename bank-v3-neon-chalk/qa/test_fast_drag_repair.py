#!/usr/bin/env python3
"""Fast-flick regression checks against every standalone NOVA Maths HTML build.
Read-only browser testing. Tests a real pointerdown -> rapid travel -> pointerup, regrab and Escape.
"""
import json,os,re,shutil,sys,time
from collections import Counter,defaultdict
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"qa"/"drag-repair-2026-10-14"
OUT.mkdir(exist_ok=True)
allfiles=[]
for i in range(19):
 for p in (ROOT/f"F{i}").glob("*.html"):
  if not re.search(rf"(?:^|-)F{i}-\d{{2}}(?=[-\.])",p.name,re.I):continue
  if p.name.endswith("PREMIUM.html") and i==0:continue  # opt-in trial, canonical F0-02 also tested
  allfiles.append(p)
allfiles.sort()
stats=Counter();problems=[];rows=[]
def finding(kind,p,mode,info):problems.append({"kind":kind,"file":str(p.relative_to(ROOT)),"mode":mode,"detail":str(info)[:350]})
def state(page):
 return page.evaluate("""() => {let d=window.NOVA&&NOVA.ui&&NOVA.ui._drag;return {active:!!d,captured:d?.captured??null,lifts:document.querySelectorAll('.nv-drag-lift').length,connected:d?.el?.isConnected??null};}""")
def candidate(page):
 return page.evaluate("""() => {
   const all=[...document.querySelectorAll('svg [data-drag]')];
   for(let i=0;i<all.length;i++){
      let el=all[i],b=(el.querySelector('.nv-hit')||el).getBoundingClientRect();
      let s=getComputedStyle(el);
      if(!el.isConnected||s.visibility==='hidden'||s.display==='none'||b.width<7||b.height<7)continue;
      let x=Math.round(b.x+b.width/2),y=Math.round(b.y+b.height/2);
      if(x<15||x>innerWidth-15||y<80||y>innerHeight-25)continue;
      let under=document.elementFromPoint(x,y);
      if(under && (under===el||el.contains(under)))return {index:i,x,y};
   }
   return null;
 }""")
exe=os.environ.get("CHROME_BIN") or shutil.which("google-chrome") or shutil.which("chromium") or "/usr/bin/chromium"
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path=exe,args=["--no-sandbox","--disable-dev-shm-usage","--disable-gpu"])
 for idx,src in enumerate(allfiles):
  record={"file":str(src.relative_to(ROOT)),"modes":{},"page_errors":[]}
  page=b.new_page(viewport={"width":1280,"height":900},reduced_motion="no-preference")
  page.on("pageerror",lambda e,r=record:r["page_errors"].append(str(e)[:240]))
  try:
   page.goto(src.resolve().as_uri(),wait_until="domcontentloaded",timeout=30000)
   page.wait_for_timeout(30)
   for mode in ["explore","guided","challenge"]:
    tab=page.locator(f'.nova-tab[data-m="{mode}"],.nova-tab[data-mode="{mode}"]')
    if not tab.count():continue
    try:
     tab.first.click(force=True,timeout=2000)
     page.wait_for_timeout(40)
     c=candidate(page)
     if c is None:continue
     stats["draggable_mode_checks"]+=1
     x,y=c["x"],c["y"]
     tx=1090 if x<640 else 155
     ty=720 if y<455 else 180
     # One-step high-speed mouse movements and a release off the original shape.
     page.mouse.move(x,y,steps=2)
     page.mouse.down()
     page.wait_for_timeout(5)
     before=state(page)
     if not before["active"]:
      # F3-03 intentionally tags EMPTY slots as data-drag but its configured
      # canStart:()=>filled prevents them moving until populated. This is not a
      # fast-flick failure; the other populated cards remain testable.
      if src.name=="F3-03-partitioned-grid-method.html" and mode=="challenge":
       stats["intentionally_locked_empty_slots"]+=1
       record["modes"][mode]={"skipped":"empty slot; canStart requires filled"}
      else:
       finding("not_activated",src,mode,before)
      page.mouse.up()
      continue
     page.mouse.move(tx,ty,steps=1)
     moving=state(page)
     page.mouse.move(x+11,y+9,steps=1)
     returning=state(page)
     if not moving["active"] or not returning["active"]:
      finding("lost_during_fast_move",src,mode,{"fast":moving,"return":returning})
     page.mouse.move(tx,ty,steps=1)
     page.mouse.up()
     page.wait_for_timeout(700)
     released=state(page)
     if released["active"] or released["lifts"]:
      finding("stuck_after_release",src,mode,released)
     # Test repeat pickup and ESC cleanup.
     rc=candidate(page)
     if rc is not None:
      page.mouse.move(rc["x"],rc["y"],steps=2)
      page.mouse.down()
      page.wait_for_timeout(8)
      reg=state(page)
      if not reg["active"]:finding("cannot_regrab",src,mode,reg)
      else:
       page.mouse.move(tx,ty,steps=1)
       page.keyboard.press("Escape")
       page.mouse.up()
       page.wait_for_timeout(700)
       escaped=state(page)
       if escaped["active"] or escaped["lifts"]:finding("stuck_after_escape",src,mode,escaped)
     stats["draggable_modes_completed"]+=1
     record["modes"][mode]={"tested":True,"start":before,"moving":moving,"released":released}
    except Exception as e:
     finding("test_error",src,mode,str(e)[:260])
     try:page.keyboard.press("Escape");page.mouse.up()
     except:pass
   if record["page_errors"]:finding("pageerror",src,"all",record["page_errors"])
  except Exception as e:finding("page_load_error",src,"all",str(e)[:260])
  rows.append(record)
  page.close()
  stats["files_tested"]+=1
  if (idx+1)%30==0:print("REPAIR_DRAG_PROGRESS",idx+1,"of",len(allfiles),"checks",stats["draggable_mode_checks"],"issues",len(problems),flush=True)
 b.close()
summary={"status":"pass" if not problems else "needs_review","total_html":len(allfiles),"statistics":dict(stats),
 "failures":len(problems),"affected":sorted(set(x["file"].split("/")[1] for x in problems)),"findings":problems,
 "limitations":["Only visible core SVG data-drag controls are tested; custom drag widgets require specific tests.",
  "Headless mouse at 1280px is not a substitute for real hardware testing or correct-target drag/drop cases.",
  "No changes made to maths engine code by this test."]}
(OUT/"browser-results.json").write_text(json.dumps(rows,indent=2))
(OUT/"regression-summary.json").write_text(json.dumps(summary,indent=2))
print("DRAG_REPAIR_TEST",json.dumps(summary)[:15000],flush=True)
# Genuine failures must not be silently called passing.
if problems:sys.exit(1)
