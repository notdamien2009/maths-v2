from pathlib import Path
import json
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=b.new_page(viewport={'width':380,'height':900})
 page.set_content((R/'F3/F3-07-hcf-and-lcm-venn.html').read_text(),wait_until='domcontentloaded')
 page.add_script_tag(content=(R/'tests/stress_f307.js').read_text())
 r=page.evaluate('F307_STRESS()')
 b.close()
(R/'tests/JS-STRESS-RESULTS.json').write_text(json.dumps(r,indent=2))
print(r);assert r['failed']==0
