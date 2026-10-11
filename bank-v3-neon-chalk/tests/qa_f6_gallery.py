"""NOVA F6 Run 15: standalone gallery smoke QA.
From within extracted bank-v3-neon-chalk folder: python tests/qa_f6_gallery.py
Requires python package playwright and Chromium installed. This test does not
claim interactive target iframes navigated when local browser policy blocks them.
"""
from pathlib import Path
import os
import json
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parent.parent
GALLERY=ROOT/'F6'/'F6-FAMILY-GALLERY.html'
MANIFEST=json.loads((ROOT/'F6'/'F6-FAMILY-MANIFEST.json').read_text(encoding='utf8'))
assert len(MANIFEST['components'])==14
for item in MANIFEST['components']:
    assert (ROOT/'F6'/item['engine_file']).exists(), f"Missing {item['id']} HTML: extract the consolidated component ZIP first"

out=[]
with sync_playwright() as playwright:
    browser=playwright.chromium.launch(headless=True, executable_path=(os.environ.get("CHROMIUM_PATH") or ("/usr/bin/chromium" if Path("/usr/bin/chromium").exists() else None)), args=["--no-sandbox","--disable-dev-shm-usage"])
    for width in (380,768,1280):
        page=browser.new_page(viewport={'width':width,'height':860},reduced_motion='reduce')
        errors=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.set_content(GALLERY.read_text(encoding='utf8'),wait_until='domcontentloaded',timeout=20000)
        assert page.locator('.card').count()==14
        page.evaluate("[...document.querySelectorAll('.card img')].forEach(x=>x.loading='eager')")
        page.wait_for_function("[...document.querySelectorAll('.card img')].every(x=>x.complete && x.naturalWidth>0)",timeout=15000)
        assert page.evaluate('document.documentElement.scrollWidth<=window.innerWidth+1')
        page.get_by_role('button',name='3 presets').click()
        assert page.locator('.card').count()==3
        page.get_by_role('button',name='11 engines').click()
        assert page.locator('.card').count()==11
        page.get_by_role('button',name='All 14').click()
        page.locator('#search').fill('ratio')
        assert 1<=page.locator('.card').count()<14
        page.locator('#search').fill('')
        page.locator('.card [data-open="F6-14"]').click()
        assert page.locator('#modal').is_visible()
        assert page.locator('#viewer').get_attribute('src')=='F6-14-ratio-fraction-translator.html'
        assert page.locator('#newTab').get_attribute('href')=='F6-14-ratio-fraction-translator.html'
        page.keyboard.press('Escape')
        assert page.locator('#modal').is_hidden()
        assert not errors, errors
        out.append({'width':width,'component_cards':14,'presets':3,'filters':'pass','search':'pass','image_load':'pass','responsive':'pass','modal_and_paths':'pass','iframe_file_navigation':'not tested'})
        page.close()
    browser.close()
print(json.dumps({'status':'PASS','results':out},indent=2))
