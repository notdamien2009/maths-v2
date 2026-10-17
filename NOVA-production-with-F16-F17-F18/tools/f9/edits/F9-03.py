# F9-03 Explore redraws through a local draw(); wrap it so a layout redraw can replay the pupil's slider state.
EDITS=[("""   window.NovaLessonComponent?.applyExploreModels();for(const item of [a,b,n])item.addEventListener('input',draw);""",
"""   draw=window.NovaF9Runtime?window.NovaF9Runtime.wrapDraw('exploreDraw',draw):draw;window.NovaLessonComponent?.applyExploreModels();for(const item of [a,b,n])item.addEventListener('input',draw);""")]
