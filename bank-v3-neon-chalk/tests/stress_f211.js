tab('Explore');setTimeout(function(){var X=NOVA_F2_11_CONFIG._explore,sel=document.querySelector('.nova-engine select');function pre(k){sel.value=k;sel.dispatchEvent(new Event('change'));}
function opn(op){var r=null;(function f(n){if(n.op){f(n.l);if(n.op===op&&!r)r=n;f(n.r);}})(X.st().root);return r;}function ring(op){var n=opn(op);return n&&q('[data-node="'+n.id+'"]');}
window.GET=function(){return X.st().steps;};
step('p3 tap + (not ready / wrong order)',function(){pre('p3');ring('+').dispatchEvent(new MouseEvent('click',{bubbles:true}));},0);
step('tap − (ready? no)',function(){ring('\u2212').dispatchEvent(new MouseEvent('click',{bubbles:true}));},0);
step('tap ÷ (correct)',function(){ring('\u00F7').dispatchEvent(new MouseEvent('click',{bubbles:true}));window.SKIP=1;},null);
step('tap during collapse ignored',function(){},1);
step('double tap −',function(){var r=ring('\u2212');r.dispatchEvent(new MouseEvent('click',{bubbles:true}));r.dispatchEvent(new MouseEvent('click',{bubbles:true}));window.SKIP=1;},null);
step('one collapse only',function(){},2);
step('keyboard Enter +',function(){key(ring('+'),'Enter');window.SKIP=1;},null);
step('settle',function(){},3);step('done value 18',function(){if(X.st().root.v!==18)throw 0;},3);
step('pointer drag on ring does nothing',function(){pre('p1');var r=ring('\u00D7'),c=ctr(r);P(r,'pointerdown',c,1);P(r,'pointermove',{x:c.x+80,y:c.y+60},1);P(r,'pointerup',{x:c.x+80,y:c.y+60},1);if(r.getAttribute('transform'))throw 0;},0);
step('free mode collapse any ready',function(){btn('Strict order: on').click();},0);
step('p5 free tap × (not ready)',function(){pre('p5');ring('\u00D7').dispatchEvent(new MouseEvent('click',{bubbles:true}));},0);
step('Auto mid Reset safe',function(){btn('Auto').click();btn('Reset').click();window.SKIP=1;},null);
step('after reset clean',function(){},0);
run();},500);
