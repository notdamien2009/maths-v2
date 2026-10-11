# F5-19 Engine API

ID: `F5-19` — NOVA `N.bankMount` component.

Config: `window.NOVA_F5_19_CONFIG`, containing `startMode`, `preset`, `presets`, `events`.

Presets:
- `pizzaEight` (8 slices, expected 3 in guided context)
- `pizzaSix` (6 slices)
- `pizzaFour` (4 slices)
- `chocolateTwelve` (12 squares)
- `chocolateEight` (8 squares)
- `chocolateSix` (6 squares)

Events: `context`, `piece`, `serve`, `return`, `preset`, `reset`, `mode`, `step`, `correct`, `hint`, `keyboard`. Value events use stable `{engine, key, value}` shape.

Explore review/debug API: `_explore.get()`, `.preset(key)`, `.serve(zeroBasedIndex)`, `.remove(zeroBasedIndex)`, `.reset()`. Selected indices are the physical equal pieces transferred from the original model to the matched serving whole. `get().fraction` returns the exact reduced numerator/denominator pair.

Challenge review/debug API: `_challenge.get()`, `.serve(index)`, `.remove(index)`, `.check()`, `.hint()`. Challenge inputs remain invisible as mathematical answers until checked.

The SVG `data-f519-piece` attribute names visible individual draggable pieces: `source-0`, `served-0`, etc. Off/empty cells do not receive this interactive attribute.
