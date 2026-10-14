#!/usr/bin/env python3
"""Targeted follow-up to the complete F0-F18 fast drag audit."""
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True)
 page=browser.new_page(viewport={"width":1280,"height":900})
 issues=[]
 for relative in ["F14/F14-01-reflection-PREMIUM.html","F3/F3-03-partitioned-grid-method.html"]:
  url=(root/relative).resolve().as_uri()
  page.goto(url,wait_until="domcontentloaded")
  page.wait_for_timeout(150)
  if "F14/" in relative:
   assert page.locator("body").count(), "F14-01 failed to load"
   print("F14-01 canonical file loaded")
   continue
  page.locator('.nova-tab[data-m="challenge"]').click()
  page.wait_for_timeout(150)
  pieces=page.locator('svg [data-drag]')
  count=pieces.count()
  active=False
  for i in range(count):
   e=pieces.nth(i)
   r=e.bounding_box()
   if not r or r['width']<8 or r['height']<8: continue
   x=r['x']+r['width']/2
   y=r['y']+r['height']/2
   if x<0 or y<0 or x>1280 or y>900: continue
   try:
    page.mouse.move(x,y)
    page.mouse.down()
    page.wait_for_timeout(15)
    activated=page.evaluate("!!window.NOVA?.ui?._drag")
    if activated:
     active=True
     page.mouse.move(1100,150,steps=1)
     assert page.evaluate("!!window.NOVA?.ui?._drag"), "drag lost during fast pointer jump"
     page.mouse.up()
     page.wait_for_timeout(650)
     assert not page.evaluate("!!window.NOVA?.ui?._drag"), "drag remained active after release"
     assert not page.locator('.nv-drag-lift').count(), "lift state remained"
     print("F3-03 valid draggable passed high-speed release test",i)
     break
    page.mouse.up()
   except Exception as ex:
    page.mouse.up()
    issues.append(str(ex))
  assert active, "F3-03 Challenge had no activatable movable pieces among "+str(count)
 assert not issues,issues
 browser.close()
print("NOVA_FOLLOWUP_PASS")
