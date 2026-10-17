# Production integration — Bob glossary & audio v35.1



V35.1 LOCKED POLISH — BOB KEYWORDS + LEARN/EXAMPLE TTS (MANDATORY)
• Bob Board's existing Key words card MUST display individual neon-cyan rounded clickable PILL buttons, not a semicolon string or italic paragraph. No sidebar redesign; preserve portrait, dark/neon/chalk identity and Carry forward order. Include a discreet visible “Click here ↓” tag at the Key words heading plus a brief “Click a word to see what it means” cue. Each pill reveals a short accurate KS3 definition in the SAME card only when clicked; clicking a second time closes it. Term/definition pairs MUST be authored for every displayed term (per concept), not auto-generated generic definitions or missing keys. Support keyboard Enter/Space, focus-visible, button aria-expanded, a labelled definition region and live announcement. It must not pause/restart Bob's presentation. Responsive pill wraps at 390px; no overflow/clipping.
• Existing Learn Watch Play starts Watch narration automatically, using the SAME shared speech/TTS and timing system as Bob. Existing Examples Guided Play starts example explanation narration automatically. DO NOT add a play/sound button, create a competing voice player or require a separate TTS activation click; user-initiated Play is the speech trigger subject to browser autoplay policies. Wait for BOTH native action and speech end before proceeding. Respect pause/resume, speed, reset, step/mode/tab changes, sound-unavailable captions and TTS decimal safety. Do not cut off a spoken explanation with a short timer. A mock callback is NOT audible-voice certification.
• Bob Board runs ALL concepts in one continuous automatic presentation; auto-advance between beats AND concept boundaries without stopping. Selecting Next slide/Next concept during active autoplay must keep the presentation playing at the selected place (without stale voice/action). Paused/manual selection must remain paused. Preserve original player controls and correct cancellation/restart lifecycle. Finish only after the final beat of the final concept or pupil Stop.
• The original immutable F0–F3 and source template must remain intact. Add these tiny reusable shell/controller hooks to the explicitly versioned DERIVED INTEGRATED TEMPLATE; no per-lesson duplicate patch. Use the validated v35.1 derived template delivered with these prompts; put vocabulary terms/definitions in lesson JSON for each concept. Full browser proof required; a static plan alone is not implementation.

## Required lesson data field
Each entry in `novaLessonData.bob.concepts` has `keywords` (semicolon-separated or array) and `keywordDefinitions` mapping EXACT displayed words to definitions. The button label is the word; button expands in-card description. No hidden tooltips or external request. The definition remains expanded as the slide changes, and resets on different-concept selection unless that concept has a previous selection.

## Playback authority
Continue using original existing controls. Watch and Examples Play already have their own buttons inside native frames. The pupil's direct Play action triggers narrated sequence. Bob Board uses one continuous five-concept timeline. Patch only the versioned derived integration shell so new lessons inherit the behaviour.

## Runtime link
Reusable implementation embedded in accompanying derived HTML: `nova-bob-keyword-pills-v1`, `nova-bob-keyword-glossary-v1`, `nova-watch-narration-v1`, `nova-guided-narration-adapter`, `bob-four-concepts-production`. Every lesson must contain the data fields.

## Release tests
1. Each pill opens accurate definition, second click hides it; no definition automatically revealed on load.
2. Keyboard access, screen reader cues, and 390px/768px/1024px/1440px layouts.
3. Existing Watch and Guided Play start speech; wait speech + visual; pause/resume/reset and cancellation work.
4. Bob crosses concept boundaries and skips forward without stopping active autoplay; never speaks in background after navigation.
5. Simulated `speechSynthesis` tests are labelled as simulated, actual Windows voice verification remains user/browser acceptance.
