import json,math
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1]
logs=[]
def ck(cond,label):
 logs.append({'test':label,'ok':bool(cond)})
 if not cond:raise AssertionError(label)
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in (380,1280):
  page=b.new_page(viewport={'width':width,'height':900},reduced_motion='reduce')
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content((R/'F3/F3-07-hcf-and-lcm-venn.html').read_text(),wait_until='domcontentloaded');page.wait_for_timeout(240)
  m=page.evaluate('''() => {const pairs=[[12,18],[20,30],[24,36],[18,30],[36,60],[60,84],[36,36],[2,3],[420,420]];
 return pairs.map(([a,b])=>{const t=F307_MATH.tokens(a,b),map=F307_MATH.correctMap(a,b),r=F307_MATH.results(a,b);return {a,b,r,expected:a*b/F307_MATH.gcd(a,b),ok:F307_MATH.checkMap(a,b,map),len:t.length,primeLists:[F307_MATH.factors(a),F307_MATH.factors(b)]}})}''')
  for x in m:
   ck(x['r']['hcf']==math.gcd(x['a'],x['b']),f'{width} HCF {x["a"]},{x["b"]}')
   ck(x['r']['lcm']==x['expected'],f'{width} LCM {x["a"]},{x["b"]}')
   ck(x['ok'],f'{width} venn map {x["a"]},{x["b"]}')
  # mobile stage ratio and readable SVG
  page.locator('#F3-07 button').filter(has_text='Explore').first.click();page.wait_for_timeout(200)
  svg=page.locator('#F3-07 .f307-svg')
  ck(svg.count()==1,f'{width} explore stage')
  ck(page.locator('#F3-07 .nv-dock').count()==1,f'{width} canonical F0 dock')
  ck(not page.evaluate('document.documentElement.scrollWidth>innerWidth'),f'{width} no horizontal overflow')
  bounds=page.locator('#F3-07 .nova-stage').bounding_box(); sb=svg.bounding_box()
  print(width,'drawing fraction stage',round(sb['height']/bounds['height'],3))
  ck(sb['height']/bounds['height']>=.55,f'{width} drawing usable-height ratio')
  svg.screenshot(path=str(R/'shots'/f'F3-07-{width}-explore-stage.png'))
  # Explore keyboard placement + remove
  t=page.evaluate('F307_MATH.tokens(12,18)')
  x=t[0]
  page.locator('#F3-07 select[aria-label="Choose a prime factor card"]').select_option(x['id'])
  page.locator('#F3-07 select[aria-label="Choose destination region"]').select_option(x['region'])
  page.get_by_role('button',name='Place card').click()
  ck(page.locator('#F3-07 .f307-svg [data-prime-id="'+x['id']+'"]').count()==1,f'{width} placed card shown')
  page.get_by_role('button',name='Undo last').click();ck(page.locator('#F3-07 .f307-svg [data-prime-id="'+x['id']+'"]').count()==1,f'{width} undo card back')
  # challenge -- all 3 rounds
  page.locator('#F3-07 button').filter(has_text='Challenge').first.click();page.wait_for_timeout(200)
  for task,(a,bv) in enumerate([(12,18),(24,36),(18,30)]):
   tt=page.evaluate('(p)=>F307_MATH.tokens(...p)',[a,bv]); rr=page.evaluate('(p)=>F307_MATH.results(...p)',[a,bv]);
   for t in tt:
    page.locator('#F3-07 select[aria-label="Prime factor card"]').select_option(t['id'])
    page.locator('#F3-07 select[aria-label="Target Venn region"]').select_option(t['region'])
    page.get_by_role('button',name='Place card').click()
   ck(page.locator('#F3-07 .f307-svg [data-prime-id]').count()==len(tt),f'{width} challenge {task} all tokens placed')
   page.locator('#F3-07 input[aria-label="HCF answer"]').fill(str(rr['hcf']))
   page.locator('#F3-07 input[aria-label="LCM answer"]').fill(str(rr['lcm']))
   page.get_by_role('button',name='Check both products').click();page.wait_for_timeout(100)
  ck(page.locator('#F3-07 .f307-win').count()==1,f'{width} won 3 challenges')
  page.locator('#F3-07 .f307-svg').screenshot(path=str(R/'shots'/f'F3-07-{width}-challenge-complete-stage.png'))
  ck(not errors,f'{width} zero runtime errors')
  page.close()
 b.close()
(R/'tests'/'STRESS-RESULTS.json').write_text(json.dumps({'assertions':len(logs),'failed':sum(not x['ok'] for x in logs),'details':logs},indent=2))
print('Assertions',len(logs),'failures',sum(not x['ok'] for x in logs))
