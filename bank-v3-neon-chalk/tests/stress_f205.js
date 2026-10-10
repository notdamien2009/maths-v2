tab('Explore');setTimeout(function(){var X=NOVA_F2_05_CONFIG._explore;window.GET=X.get;function top(p){var a=qa('[data-rod="'+p+'"] [data-drag]');return a[a.length-1];}
step('tray->empty stage',function(){dd(q('[data-tray]'),S2C(580,340));},243);
step('tray->off stage',function(){dd(q('[data-tray]'),{x:2,y:2});},243);
step('tray->ones rod',function(){dd(q('[data-tray]'),S2C(rx0(0),150));},244);
step('top bead T->tray remove',function(){dd(top(1),S2C(300,321));},234);
step('top bead O->tenths',function(){dd(top(0),S2C(rx0(-1),150));},233.1);
step('top bead own rod',function(){dd(top(2),S2C(rx0(2),100));},233.1);
step('lower bead not draggable',function(){var b=qa('[data-rod="2"] [data-bead]')[0];R('lower drag attr '+b.hasAttribute('data-drag'));dd(b,S2C(300,321));},233.1);
step('double drag',function(){var a=top(2),b=q('[data-tray]'),t=S2C(rx0(1),150);P(a,'pointerdown',ctr(a),1);P(b,'pointerdown',ctr(b),2);P(b,'pointermove',t,2);P(b,'pointerup',t,2);P(a,'pointermove',S2C(300,321),1);P(a,'pointerup',S2C(300,321),1);},133.1);
step('flick',function(){dd(q('[data-tray]'),S2C(rx0(2),150),{flick:true});},233.1);
step('release outside window',function(){dd(top(2),{x:-60,y:-60});},233.1);
step('cancel',function(){var e=top(2);dd(e,S2C(300,321),{noup:true});P(e,'pointercancel',{x:0,y:0});},233.1);
step('blur',function(){var e=top(2);dd(e,S2C(300,321),{noup:true});window.dispatchEvent(new Event('blur'));},233.1);
step('touch',function(){dd(q('[data-tray]'),S2C(rx0(-2),150),{pt:'touch',id:4});},233.11);
step('auto-exchange: preset 199 + bead',function(){var s=document.querySelector('.nova-engine select');s.value='n9';s.dispatchEvent(new Event('change'));dd(q('[data-tray]'),S2C(rx0(0),150));dd(top(1),S2C(300,321));window.SKIP=1;},null);
step('w1',function(){window.SKIP=1;},null);step('w2',function(){window.SKIP=1;},null);step('w3',function(){window.SKIP=1;},null);
step('after cascade',function(){R(JSON.stringify(X.state().c));},190);
step('gattegno tap 300',function(){btn('Gattegno').click();q('[data-t="2_3"]').dispatchEvent(new MouseEvent('click',{bubbles:true}));},300);
step('drag 40 into bar',function(){dd(q('[data-t="1_4"]'),S2C(300,290));},340);
step('drag 0.5 to empty stage',function(){dd(q('[data-t="-1_5"]'),S2C(590,5));},340);
step('keyboard pick',function(){var g=q('[data-gat]');key(g,'ArrowDown');g=q('[data-gat]');key(g,'Enter');},340.1);
step('tap again removes',function(){q('[data-t="2_3"]').dispatchEvent(new MouseEvent('click',{bubbles:true}));},40.1);
step('x10 glide',function(){btn('\u00D7 10').click();window.SKIP=1;},null);
step('after x10',function(){},401);
run();},500);
function rx0(p){return 40+(2-p)*104+52;}
