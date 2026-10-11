"""Real pointer interaction on F6-12 F0 SVG drag controls. Chromium desktop + 380px viewport."""
from playwright.sync_api import sync_playwright
from pathlib import Path
import json,sys
root=Path(__file__).resolve().parents[1];html=(root/'F6/F6-12-currency-unit-bridges-GALLERY-PREVIEW.html').read_text()
out={'suite':'stress_f612','passed':0,'failures':[],'widths':[380,1280]}
def check(value,description):
 if value:out['passed']+=1
 else:out['failures'].append(description)
with sync_playwright() as pl:
 browser=pl.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in [1280,380]:
  page=browser.new_page(viewport={'width':w,'height':900},reduced_motion='reduce')
  errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
  page.set_content(html,wait_until='domcontentloaded',timeout=30000)
  page.evaluate("() => Array.from(document.querySelectorAll('button')).find(b=>b.textContent.trim()==='Explore').click()")
  page.evaluate("() => F612_CONFIG._explore.setPreset('Y8-043')")
  deck=page.locator('#F6-12 .f612-dock');deck.scroll_into_view_if_needed(timeout=5000)
  box=deck.bounding_box();dimensions=deck.evaluate('(e)=>[e.viewBox.baseVal.width,e.viewBox.baseVal.height]')
  dw,dh=dimensions
  def point(x,y):return (box['x']+box['width']*x/dw,box['y']+box['height']*y/dh)
  def drag(start,end):
   sx,sy=point(*start);ex,ey=point(*end)
   page.mouse.move(sx,sy);page.mouse.down();page.mouse.move(ex,ey,steps=14);page.mouse.up();page.wait_for_timeout(390)
  print(w,'box',box,'size',dimensions,flush=True)
  chips=page.locator('#F6-12 .f612-pill').count();check(chips==4,f'{w}: missing four pills')
  if w==1280: sources=[(175,260),(415,260),(655,260),(895,260)];slot0=(350,127);slot1=(735,127);red=(935,125)
  else: sources=[(130,358),(390,358),(130,452),(390,452)];slot0=(137,130);slot1=(382,130);red=(260,249)
  drag(sources[0],slot0)
  check(page.evaluate('() => F612_CONFIG._explore.get().placed[0]')==0,f'{w}: drag slot0 failed')
  # A freshly rendered deck has stable anchors but scroll position can change with its height.
  deck=page.locator('#F6-12 .f612-dock');deck.scroll_into_view_if_needed(timeout=5000);box=deck.bounding_box()
  drag(sources[1],slot1)
  check(page.evaluate('() => F612_CONFIG._explore.get().placed[1]')==1,f'{w}: drag slot1 failed')
  deck.scroll_into_view_if_needed();box=deck.bounding_box();drag(sources[0],red)
  check(page.evaluate('() => F612_CONFIG._explore.get().placed[0]') is None,f'{w}: red return failed')
  # Keyboard alternative selects and returns a card.
  deck=page.locator('#F6-12 .f612-dock');deck.scroll_into_view_if_needed();
  chip=deck.locator('[data-chip="0"]');chip.focus();chip.press('1');
  check(page.evaluate('() => F612_CONFIG._explore.get().placed[0]')==0,f'{w}: keyboard assign failed')
  deck.locator('[data-chip="0"]').focus();deck.locator('[data-chip="0"]').press('Delete')
  check(page.evaluate('() => F612_CONFIG._explore.get().placed[0]') is None,f'{w}: keyboard return failed')
  check(not errs,f'{w}: JS errors '+str(errs))
  page.close()
 browser.close()
out['failed']=len(out['failures']);(root/'tests/f612-stress-results.json').write_text(json.dumps(out,indent=2));print(json.dumps(out));sys.exit(bool(out['failed']))
