# F6-12 — Currency and Unit Bridges · spec card

**Type:** named preset for F18-02 Unit-conversion bridges. The current gallery is a tested standalone **preview**, not a replacement F18-02 engine.

**Mathematical purpose:** apply directed multiplicative conversions to currency and compound units, preserving unit labels. In a compound rate, change the numerator and the denominator separately.

**Year groups:** Year 8 currency/compound units and Year 9 multi-stage rates; GCSE extension available.

**Parameters:** starting amount, query amount, given factor(s), displayed operation(s), input/output/intermediate units, precision, context and scenario.

**Presets:**

| Lesson | Conversion | Example | Challenge |
|---|---|---|---|
| Y8-039 | GBP → EUR; illustrative £1 = €1.18 | £25 → €29.50 | £40 → €47.20 |
| Y8-043 | km/h → m/h → m/s via ×1000 then ÷3600 | 72 km/h → 20 m/s | 54 km/h → 15 m/s |
| Y9-024 | L/min → mL/min → mL/s via ×1000 then ÷60 | 1.8 L/min → 30 mL/s | 2.4 L/min → 40 mL/s |

**Teaching sequence:** (1) start unit; (2) select factor; (3) cross first bridge; (4) cross next bridge if required; (5) final quantity and unit; (6) reverse check. Sir Bob narration provided per step in the F0 learning shell.

**Interactions:** draggable factor pills with green destinations and a red removal area; keyboard 1/2/Enter for slot placement, Delete/Backspace to return; wrong factors update visible intermediate values in Explore. Challenge validates factors, converted number and unit.

**Common misconception traps:** reversing a currency rate; multiplying instead of dividing when changing time units; using only numerator conversion; selecting the wrong final unit; treating a given rate as a live market exchange rate.

**Design:** use actual F0 `NOVA.neonBox`, `NOVA.neonRing`, `NOVA.svg.arrow`, `NOVA.svg.arc`, `NOVA.chalkText`, `NOVA.ui.svgDrag` and existing F0 stage/mascot/animation wrapper. No modification to the F0 core.

**Restrictions:** do not register a second F18-02 engine; host integration and real lesson tests pending. No game logic.
