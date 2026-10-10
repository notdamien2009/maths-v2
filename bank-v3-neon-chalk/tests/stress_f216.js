tab('Explore');setTimeout(function(){var X=NOVA_F2_16_CONFIG._explore,sel=document.querySelector('.nova-engine select');function pre(k){sel.value=k;sel.dispatchEvent(new Event('change'));}
window.GET=function(){var p=X.st().placed;return p.N.length*1000+p.Z.length*100+p.Q.length*10+p.I.length;};var N=S2C(130,200),Zz=S2C(260,200),Q=S2C(360,200),I=S2C(490,200),TR=S2C(300,363),RONLY=S2C(560,24);
function cd(c){return q('[data-card="'+c+'"]');}
step('7 -> N',function(){dd(cd('7'),N);},1000);
step('−3 -> N wrong springs back',function(){dd(cd('\u22123'),N);},1000);
step('−3 -> Z',function(){dd(cd('\u22123'),Zz);},1100);
step('√2 -> Q wrong',function(){dd(cd('\u221A2'),Q);},1100);
step('√2 -> I',function(){dd(cd('\u221A2'),I);},1101);
step('0.75 -> R only area (no zone)',function(){dd(cd('0.75'),RONLY);},1101);
step('0.75 -> empty stage',function(){dd(cd('0.75'),S2C(595,402));},1101);
step('0.75 -> off',function(){dd(cd('0.75'),{x:-30,y:-30});},1101);
step('0.75 flick -> Q',function(){dd(cd('0.75'),Q,{flick:true});},1111);
step('π touch -> I',function(){dd(cd('\u03C0'),I,{pt:'touch',id:5});},1112);
step('placed 7 -> tray',function(){dd(q('[data-placed="7"]'),TR);window.SKIP=1;},null);step('removed',function(){},112);
step('placed −3 -> another set springs back',function(){dd(q('[data-placed="\u22123"]'),N);},112);
step('double',function(){var a=cd('0'),b=q('[data-placed="\u22123"]');P(a,'pointerdown',ctr(a),1);P(b,'pointerdown',ctr(b),2);P(b,'pointermove',TR,2);P(b,'pointerup',TR,2);P(a,'pointermove',Zz,1);P(a,'pointerup',Zz,1);},212);
step('cancel',function(){var e=cd('7');dd(e,N,{noup:true});P(e,'pointercancel',{x:0,y:0});},212);
step('blur',function(){var e=cd('7');dd(e,N,{noup:true});window.dispatchEvent(new Event('blur'));},212);
step('keyboard N on 7',function(){key(cd('7'),'n');},1212);
step('keyboard wrong I on √9',function(){key(cd('\u221A9'),'i');},1212);
step('keyboard N on √9',function(){key(cd('\u221A9'),'N');},2212);
step('roots preset reset',function(){pre('roots');},0);
step('√0.25 -> Q',function(){dd(cd('\u221A0.25'),Q);},10);
run();},500);
