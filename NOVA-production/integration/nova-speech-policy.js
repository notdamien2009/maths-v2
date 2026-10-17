/* Keep the existing decimal-digit-4 speech restriction; captions remain visible. */
(function(w){'use strict';w.NovaSpeechPolicy={version:'1.0.0',safe(text){return !(String(text).match(/[+\-\u2212]?(?:\d+\.\d+|\.\d+)/g)||[]).some(value=>value.includes('4'));},restriction:'Decimal numerals containing digit 4 require verified pronunciation before spoken playback.'};})(window);
