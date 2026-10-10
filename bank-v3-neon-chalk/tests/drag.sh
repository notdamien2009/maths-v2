# drag.sh FAM page "<js test body using helpers>"  -> prints data-test
FAM=$1;pg=$2;T=$3
python3 - "$FAM" "$pg" "$T" <<'P'
import sys;fam,pg,t=sys.argv[1:]
s=open(f"/workspace/nova-f0/bank-v3/{fam}/{pg}.html").read()
inj="""<script>
function R(v){document.documentElement.setAttribute('data-test',(document.documentElement.getAttribute('data-test')||'')+' | '+v);}
function ctr(el){var r=el.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2};}
function pe(el,type,p){el.dispatchEvent(new PointerEvent(type,{bubbles:true,clientX:p.x,clientY:p.y,pointerId:1,isPrimary:true}));}
function drag(el,to){var a=ctr(el);pe(el,'pointerdown',a);pe(el,'pointermove',{x:(a.x+to.x)/2,y:(a.y+to.y)/2});pe(el,'pointermove',to);pe(el,'pointerup',to);}
function key(el,k){el.focus();el.dispatchEvent(new KeyboardEvent('keydown',{key:k,bubbles:true}));}
function tab(n){[].slice.call(document.querySelectorAll('[role=tab]')).filter(function(b){return b.textContent.trim()==n})[0].click();}
function btn(t){return [].slice.call(document.querySelectorAll('.nova-btn')).filter(function(b){return b.textContent==t})[0];}
window.onerror=function(m,u,l){R('ERR '+m+'@'+l)};
window.addEventListener('load',function(){NOVA.setReducedMotion(false);NOVA.motion.raf=function(f){setTimeout(function(){f(performance.now());},16);};setTimeout(function(){try{%s}catch(e){R('EXC '+e.message)}},600);});
</script>"""%t
i=s.rindex('</body>');open('/tmp/f04/dt.html','w').write(s[:i]+inj+s[i:])
P
google-chrome --headless=new --no-sandbox --window-size=1280,1500 --virtual-time-budget=${VB:-30000} --dump-dom file:///tmp/f04/dt.html 2>/dev/null | grep -o 'data-test="[^"]*"'
