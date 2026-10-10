tab('Explore');setTimeout(function(){var X=NOVA_F2_06_CONFIG._explore;btn('Your turn').click();function mv(){return X.sheet().mineValue();}window.GET=function(){return 0;};
function stepS(name,fn,exp){step(name,function(){fn();},null);Q.push(function(n){var v=mv();if(v!==exp){FAIL++;R('FAIL '+name+' mine='+v+' want '+exp);}else R('OK '+name+' '+v);n();});}
function cell(p){var c=q('[data-cell="'+p+'"]');return ctr(c);}
stepS('tile->empty',function(){dd(q('[data-tile="4"]'),S2C(590,10));},'___');
stepS('tile->off',function(){dd(q('[data-tile="4"]'),{x:1,y:1});},'___');
stepS('tile 4->ones',function(){dd(q('[data-tile="4"]'),cell(0));},'__4');
stepS('tile 9->ones replaces',function(){dd(q('[data-tile="9"]'),cell(0));},'__9');
stepS('placed not draggable',function(){var c=q('[data-cell="0"]');R('cell drag '+c.hasAttribute('data-drag'));dd(c,cell(1));},'__9');
stepS('double drag',function(){var a=q('[data-tile="3"]'),b=q('[data-tile="7"]');P(a,'pointerdown',ctr(a),1);P(b,'pointerdown',ctr(b),2);P(b,'pointermove',cell(2),2);P(b,'pointerup',cell(2),2);P(a,'pointermove',cell(1),1);P(a,'pointerup',cell(1),1);},'_39');
stepS('flick 7->H',function(){dd(q('[data-tile="7"]'),cell(2),{flick:true});},'739');
stepS('outside window',function(){dd(q('[data-tile="1"]'),{x:-40,y:-40});},'739');
stepS('cancel',function(){var e=q('[data-tile="1"]');dd(e,cell(0),{noup:true});P(e,'pointercancel',{x:0,y:0});},'739');
stepS('touch 4->ones',function(){dd(q('[data-tile="4"]'),cell(0),{pt:'touch',id:3});},'734');
stepS('keyboard',function(){key(q('[data-cell="1"]'),'3');},'734');
step('check',function(){btn('Check my answer').click();R('marks '+JSON.stringify(X.sheet().state.mark));},null);
run();},500);
