> **CURRENT F0–F18 STATUS (2026-10-14): APPROVED FOR LESSON PRODUCTION.** Any older component-library sign-off, blocker, release gate or pending-approval statement below is historical and superseded by [00-master/PRODUCTION-RELEASE-F0-F18-2026-10-14.md](../00-master/PRODUCTION-RELEASE-F0-F18-2026-10-14.md). All functional QA and mathematical correctness requirements still apply.

# F8-14 · Algebraic Fraction Simplifier — production spec

**Source:** `00-master/NOVA-MASTER-FOR-OTHER-AI.md`, F8-14 exact prompt. **Owner fraction override:** F5 owner-approved `F5-FRACTION-NOTATION-LOCK.md` (stacked numerator/bar/denominator; old TBD is invalid).

**Purpose:** Explain *why* only common whole factors, not additive terms, cancel. Preserve the excluded values of the **original** denominator.

**Scope:** One reusable KS3 bridge / GCSE extension visual engine, built against the NOVA F0 core. The master F8-14 prompt does not enumerate specific lesson IDs; this pack does not invent official curriculum mappings.

**Visual:** Original expression as stacked fraction; separate numerator and denominator glass factor cards with NOVA chalk text; cancel paired identical factors; proof result and unchanged excluded-value domain. Mobile: one vertical workshop; desktop: compact left evidence rail plus larger factor workshop. All colours and glows originate in `NOVA.neonBox`, `NOVA.neonLine`, `NOVA.chalkText`, `NOVA.scene.helperStrip`.

**Presets:** Six bounded examples: `6x/9x → 2/3 (x≠0)`; `4xy/6x → 2y/3 (x≠0)`; `(x²+3x)/x → x+3 (x≠0)`; `(x²−9)/(x−3) → x+3 (x≠3)`; `(x²+5x+6)/(x+2) → x+3 (x≠−2)`; `(x²−4x)/(2x) → (x−4)/2 (x≠0)`.

**Named animation beats:** Meet original → factorise → highlight identical factors → cancel pairs → simplify → retain restriction. The F0 stepper supplies Watch/Guided playback, scrub, step, narration slot and reduced-motion support.

**Interactions:** Factorise action; drag the *numerator factor* to the equal denominator target; green valid zone; cancelled lower card may be dragged to red return tray for undo; one-step Undo; Reset; keyboard Enter/Space for cancellation, Enter/Delete on the cancelled factor for restoration. Challenge requires completion of every cancellation pair, an accepted fully simplified mathematical form, and the correct value excluded by the original denominator. A wrong answer never overwrites progress.

**Misconception tests:** Cancellation of terms in sums; changing numerator/denominator only on one side; losing uncancelled coefficients; assuming a cancelled original denominator has no restrictions; forgetting brackets.

**Reuse/dependencies:** F0 Neon Tube/Chalk, NOVA maths `NOVA.svg`, `NOVA.ui.svgDrag`, `NOVA.motion`, `NOVA.neonBox`, `NOVA.neonLine`, `NOVA.chalkText`, existing NOVA mascot skins, F5 stacked fraction lock. Links to F7-04 factorising and F8-05 algebra operations. No custom independent core, no edits to GitHub.

**GCSE extension:** Difference of squares, quadratic factorisation, rational expression domains. These are review presets; the owner decides later curriculum mapping.
