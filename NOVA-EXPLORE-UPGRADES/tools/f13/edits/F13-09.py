# F13-09: every live refresh appended another copy of the target clipPath to <defs> (an unbounded leak, and the 1440 drawing after a
# resize round trip differed from the one before it). Replace the previous copy instead of stacking a new one.
EDITS=[("var clipId='f13f-target-clip';var d=g.ownerSVGElement.querySelector('defs');var cp=e(d,'clipPath',{id:clipId});","var clipId='f13f-target-clip';var d=g.ownerSVGElement.querySelector('defs');var old=d.querySelector('#'+clipId);if(old)old.remove();var cp=e(d,'clipPath',{id:clipId});")]
