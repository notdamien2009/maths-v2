"""Capture real visual exchange phases by advancing the actual pause/step controls."""
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright
ROOT=Path(__file__).resolve().parents[1];HTML=(ROOT/'bank-v3-neon-chalk/F2/F2-05-abacus-gattegno-chart.html').read_text();QA=ROOT/'QA'
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
  page=await browser.new_page(viewport={'width':1280,'height':960},device_scale_factor=1,reduced_motion='no-preference')
  await page.set_content(HTML,wait_until='load');await page.get_by_role('tab',name='Explore').click()
  await page.evaluate('NOVA.setReducedMotion(false)')
  await page.get_by_label('Automatically exchange ten beads').uncheck()
  await page.get_by_label('Starting example').select_option('n9')
  await page.get_by_label('Choose rod').select_option('0')
  await page.get_by_role('button',name='+ bead').click()
  # Pause before the command. The animation starts, but cannot move until we step it.
  await page.get_by_role('button',name='Pause motion').click()
  await page.get_by_role('button',name='Exchange 10 → 1').click()
  for name in ['count-ten','equivalence-held','bead-transfer','completed']:
   print(name,await page.evaluate('({phase:NOVA_F2_05_CONFIG._explore.phase(),busy:NOVA_F2_05_CONFIG._explore.w().busy(),paused:NOVA_F2_05_CONFIG._explore.motion().paused,reduce:NOVA.reducedMotion()})'),flush=True)
   await page.screenshot(path=str(QA/f'F2-05-exchange-{name}.png'),full_page=True)
   if name!='completed':await page.get_by_role('button',name='Step phase').click()
  await browser.close()
asyncio.run(main())
