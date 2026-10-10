tab('Explore');setTimeout(function(){var X=NOVA_F2_09_CONFIG._explore;window.GET=function(){return X.st().n;};function lx(n){return S2C(60+(n+6)/12*480,236);}
function kd(to,o){o=o||{};var k=q('[data-knob]');P(k,'pointerdown',ctr(k),o.id||1,o.pt);P(k,'pointermove',to,o.id||1,o.pt);if(!o.noup)P(k,'pointerup',to,o.id||1,o.pt);return k;}
step('drag to 6',function(){kd(lx(6));window.SKIP=1;},null);step('settle 6',function(){},6);
step('drag to 1.4 snaps 1',function(){kd(lx(1.4));window.SKIP=1;},null);step('settle 1',function(){},1);
step('drag off stage left clamps',function(){kd({x:-30,y:300});window.SKIP=1;},null);step('settle clamp',function(){},-4);
step('drag to empty area above',function(){kd(S2C(300,20));window.SKIP=1;},null);step('settle',function(){window.SKIP=1;},null);
step('blur mid-drag',function(){var k=kd(lx(3),{noup:true});window.dispatchEvent(new Event('blur'));window.SKIP=1;},null);step('settle blur',function(){},3);
step('cancel mid-drag',function(){var k=kd(lx(-2),{noup:true});P(k,'pointercancel',lx(-2));window.SKIP=1;},null);step('settle cancel',function(){},-2);
step('touch drag to 2',function(){kd(lx(2),{pt:'touch',id:8});window.SKIP=1;},null);step('settle touch',function(){},2);
step('double pointer',function(){var k=q('[data-knob]');P(k,'pointerdown',ctr(k),1);P(k,'pointerdown',ctr(k),2);P(k,'pointermove',lx(-1),2);P(k,'pointerup',lx(-1),2);P(k,'pointermove',lx(4),1);P(k,'pointerup',lx(4),1);window.SKIP=1;},null);step('settle double',function(){},4);
step('mid-glide drag blocked',function(){btn('\u00D7 10').click();kd(lx(-3));window.SKIP=1;},null);step('settle glide',function(){},5);
step('keyboard right',function(){key(q('[data-knob]'),'ArrowRight');window.SKIP=1;},null);step('settle key',function(){},6);
step('refuse beyond 6',function(){key(q('[data-knob]'),'ArrowRight');window.SKIP=1;},null);step('still 6',function(){},6);
run();},500);
