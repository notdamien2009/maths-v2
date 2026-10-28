/* Default Guided narration adapter; captions remain authoritative and voice is opt-in. */
(function(w){'use strict';if(w.NovaV2ExampleNarration)return;w.NovaV2ExampleNarration={muted:w.NovaLessonProduction?.narration?.examples!==true,play(context){if(this.muted||context.muted||!w.speechSynthesis||!w.SpeechSynthesisUtterance||!w.NovaSpeechPolicy.safe(context.text))return null;
 let finish,reject,done=false,timer=null,remaining=Math.max(8000,(context.durationMs||String(context.text).split(/\s+/).length*360)*2),started=0;
 const finished=new Promise((resolve,fail)=>{finish=resolve;reject=fail;}),u=new w.SpeechSynthesisUtterance(context.text),voices=w.speechSynthesis.getVoices(),chosen=w.document.getElementById('bobcVoice')?.value;u.voice=voices.find(v=>v.voiceURI===chosen)||voices.find(v=>/^en-GB/i.test(v.lang))||voices.find(v=>/^en/i.test(v.lang))||null;u.lang=u.voice?.lang||'en-GB';u.rate=.96;
 const cue=context.cueText==='Start'?0:Math.max(0,String(context.text).toLowerCase().indexOf(String(context.cueText||'').toLowerCase()));
 const complete=()=>{if(done)return;done=true;clearTimeout(timer);context.onCue();finish();};
 const arm=()=>{started=Date.now();timer=setTimeout(()=>{if(done)return;w.speechSynthesis.cancel();complete();},remaining);};
 u.onstart=()=>{if(!cue)context.onCue();};u.onboundary=e=>{if(e.charIndex>=cue)context.onCue();};u.onend=complete;u.onerror=e=>{if(done)return;done=true;clearTimeout(timer);reject(Error(e.error||'Speech unavailable'));};
 w.speechSynthesis.cancel();arm();w.speechSynthesis.speak(u);
 return {finished,cancel(){if(done)return;done=true;clearTimeout(timer);w.speechSynthesis.cancel();finish();},pause(){if(done)return;clearTimeout(timer);remaining=Math.max(0,remaining-(Date.now()-started));w.speechSynthesis.pause();},resume(){if(done)return;w.speechSynthesis.resume();arm();}};
}};})(window);
