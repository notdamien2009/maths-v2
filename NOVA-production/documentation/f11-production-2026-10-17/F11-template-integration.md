# F11 template integration contract

Mount through the unchanged `00-master/NOVA-MATHS-LESSON-LAYOUT-TEMPLATE.html`. Lesson values go through `{nativeIndex:0, scene:{function, arguments}}` using the native draws. They are validated by `NovaF11Contracts.validate(id, record)`.

| Engine | Scene function and options for a Challenge question (answer hidden) |
|---|---|
| F11-01 | `drawing` `{o:{challenge:true, angle, base:'right'|'left', step:8}}` |
| F11-02 | `geom` `{opts:{step:9, challenge:true, angle, base, estimate, benchmark, revealed:false}}`; use `tolerance` (e.g. 10) on the record for estimates |
| F11-03 | `renderFigure` `{settings:{kind:'straight'|'point'|'vertical'|'parallel', angle, apex, step:11, show:0, challenge:true, task:{kind,a,known|givens,answer}, revealed:false}}` |
| F11-04 | `drawTriangle` `{o:{preset, task:{type:'missing', p, given:[a,b], answer}, placed:[false,false,false], phase:1, challenge:true}}` |
| F11-05 | `draw` `{o:{theta, kind:'corresponding'|'alternate'|'cointerior'|'vertically', phase:3, challenge:true, givenOnly:true}}` |
| F11-06 | `draw` `{opt:{n, phase:4, progress:0, hide:true}}` |
| F11-07 | `draw` `{opt:{n, radius:188, rotation:-90, phase:8, show:'central'|'interior'|'exterior', hide:true}}` |
| F11-08 | `draw` `{opts:{kind:'angle'|'perpendicular'|'equilateral', angle, phase:6, hide:true}}` |
| F11-09 | `draw` `{opts:{kind:'point'|'perp'|'angle', radius|distance|angle, phase:6, hide:true}}` |
| F11-10 | `draw` `{opts:{kind:'single'|'reverse', bearing, phase:6, hide:true}}` |
| F11-11 | `draw` `{opts:{kind:'line'|'opposite'|'parallel'|'polygon', angle|sides, phase:6, hide:true, proof:false}}` |

Some given values are not drawn as numbers, for example the F11-08 bisected angle and the F11-09 radius/distance. In those cases the prompt must state them, as the examples do.

**Challenge:** 6–8 records per concept, each with prompt / privateAnswer / answerType / hint / feedback. Examples are in `F11-configuration-examples.json`; there are six per engine and every answer has been checked.
