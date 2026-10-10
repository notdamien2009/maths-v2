function SV(){return document.querySelector('.nova-engine .nova-stage svg.nv-svg');}
function S2C(x,y){var s=SV(),p=s.createSVGPoint();p.x=x;p.y=y;var q=p.matrixTransform(s.getScreenCTM());return {x:q.x,y:q.y};}
function P(el,type,p,id,pt){(el||document).dispatchEvent(new PointerEvent(type,{bubbles:true,cancelable:true,clientX:p.x,clientY:p.y,pointerId:id||1,isPrimary:true,pointerType:pt||'mouse',button:0}));}
function dd(el,to,o){o=o||{};var a=ctr(el),id=o.id||1;P(el,'pointerdown',a,id,o.pt);if(!o.flick){P(el,'pointermove',{x:(a.x+to.x)/2,y:(a.y+to.y)/2},id,o.pt);}P(el,'pointermove',to,id,o.pt);if(o.before)o.before(el);if(!o.noup)P(el,'pointerup',to,id,o.pt);}
function stranded(){var bad=[];[].slice.call(document.querySelectorAll('.nova-engine [data-drag]')).forEach(function(e){if(e.getAttribute('transform')||e.classList.contains('nv-drag-lift')||e.style.opacity==='0')bad.push(e.getAttribute('data-counter')||e.getAttribute('data-tray')||e.getAttribute('data-tile')||e.getAttribute('data-block')||'?');});if(document.querySelector('.nv-drop-hl'))bad.push('hl');if(NOVA.ui._drag)bad.push('activeDrag');return bad;}
var Q=[],FAIL=0;function step(name,fn,expect){Q.push(function(n){try{fn();}catch(e){R('EXC '+name+' '+e.message);}setTimeout(function(){var v=GET(),b=stranded();if(window.SKIP){b=[];window.SKIP=0;}var ok=(expect==null||Math.abs(v-expect)<1e-9)&&!b.length;if(!ok)FAIL++;R((ok?'OK ':'FAIL ')+name+' v='+v+(b.length?' stranded='+b:''));n();},900);});}
function run(){var i=0;(function n(){if(i<Q.length)Q[i++](n);else R('DONE fails='+FAIL);})();}
function q(s){return document.querySelector('.nova-engine '+s);}
function qa(s){return document.querySelectorAll('.nova-engine '+s);}
