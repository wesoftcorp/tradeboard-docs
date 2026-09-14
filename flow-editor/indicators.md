# Indicators

The `indicator` node runs any of **116 technical indicators** from the
`tradeboard.ta` library over a symbol's history, server-side.

## Basic use

```json
{ "id": "r", "type": "indicator", "position": { "x": 0, "y": 100 },
  "data": {
    "symbol": "RELIANCE", "exchange": "NSE",
    "interval": "D", "source": "api",
    "indicatorName": "rsi",
    "params": "{\"period\": 14}",
    "lookbackBars": 100,
    "tailBars": 5,
    "offsetBars": 0,
    "outputVariable": "rsi"
  } }
```

| Field | Meaning |
| --- | --- |
| `symbol`, `exchange` | What to compute over. Not needed in nested mode. |
| `interval` | Timeframe, free text (`1m`, `5m`, `15m`, `1h`, `D`, …). Use the `intervals` node to list what your broker supports. |
| `source` | **The data source**, `api` (broker) or `db` (Historify, resampled locally). Not a price field. |
| `indicatorName` | Function name, lowercase (`rsi`, `sma`, `supertrend`, `macd`, …) |
| `params` | JSON object of the indicator's own arguments, as a string |
| `lookbackBars` | How much history to compute over (capped at 200) |
| `tailBars` | Length of the returned `series` array (also capped at 200) |
| `offsetBars` | Which bar `at_offset` should read (0 = same bar as `latest`, max 199) |
| `sourceSeries` | Optional: compute over another series instead of fetching |
| `sourceField` | Optional: **which field of a row** to read from each `sourceSeries` row, the price field (`close`, `high`, `low`) or a specific `out1` |

The node fetches `lookbackBars` plus a fixed 50-bar warm-up so the indicator
has settled by the time the requested window starts, and the sum is still
capped at 200. That is why `&#123;&#123;rsi.bars_used&#125;&#125;` can be larger than the
`lookbackBars` you asked for.

### `source` is not `sourceField`

They are two different things and the names invite the mix-up:

* `source` selects **where the OHLCV comes from**: `api` calls the broker,
  `db` reads Historify and resamples locally (2m/3m/25m/2h out of stored 1m,
  W/M/Q/Y out of D). Nothing else is valid.
* `sourceField` selects **which field of a row** to read, and only applies in
  nested mode, where each `sourceSeries` row is a dict. Blank means auto:
  `value`, then `out0`, then `close`.

Putting `close` in `source` does not compute the indicator on closes. It
sends `close` to the history fetch, which fails with a history error that
names neither field.

## Reading the result

```
{{rsi.latest.value}}      value on the last bar the feed returned
{{rsi.previous.value}}    value one bar earlier
{{rsi.at_offset.value}}   value offsetBars back
{{rsi.series}}            array of the last tailBars values
{{rsi.series[0].value}}   oldest value in that array
{{rsi.outputs}}           list of output names
{{rsi.bars_used}}         how many bars were actually computed over
```

### Which bar is `latest`

`latest` is the **last bar in the fetched history**, and that is not always a
closed one. Unlike `barOffset` and `priorPeriodOhlc`, the `indicator` node
does not drop a still-forming bar:

* If the feed has already opened the current bar, `latest` is that forming
  bar and it **repaints** for the rest of the period. `previous` is then the
  bar that just closed.
* If the feed has not opened it yet, `latest` **is** the bar that just closed
  and `previous` is the one before it.

Which of the two you get is decided by *when in the period the run happens*.
An interval schedule fires on the clock boundary plus
`FLOW_INTERVAL_ALIGN_OFFSET` (default 2 seconds). Measured on a live
instance at `:02` past the minute, the feed had not yet opened the new
minute's bar, so `&#123;&#123;ind.latest.*&#125;&#125;` was the candle that had just closed.
That is what makes a schedule-driven, non-repainting strategy possible, and
it is what [Tutorial 12](tutorials.md#12-non-repainting-1-minute-supertrend-long-and-short) relies on.

If a repainting `latest` is not acceptable and you would rather not depend on
the timing, read `previous` instead and accept a one-bar lag.

`FLOW_HISTORY_CACHE_TTL` (default 30 seconds) is how long the indicator and
history nodes reuse a fetch. That is half a 1-minute candle, so lower it to
2 or 3 for a 1-minute strategy or two runs a minute apart can see the same
bars.

### Single-output and tuple indicators

**Single-output** indicators (`rsi`, `sma`, `ema`, `atr`, …) expose `value`.

**Tuple** indicators, the ones whose library function returns several series,
expose `out0`, `out1`, `out2`, … in the library's own order. They have **no
`value` key at all**, so `&#123;&#123;st.latest.value&#125;&#125;` resolves to nothing: a
`varCondition` reading it takes neither branch, an order field reading it
fails the node, and a `log` message prints the braces back at you.

| Indicator | `out0` | `out1` | `out2` |
| --- | --- | --- | --- |
| `macd` | MACD line | signal | histogram |
| `bbands` | upper | middle | lower |
| `supertrend` | level | direction (see below) | none |
| `stochastic` | %K | %D | none |
| `adx` | +DI | -DI | ADX |
| `donchian` | upper | middle | lower |

So a supertrend level is `&#123;&#123;st.latest.out0&#125;&#125;` and its direction is
`&#123;&#123;st.latest.out1&#125;&#125;`. `&#123;&#123;st.outputs&#125;&#125;` lists the names a given indicator
actually produced, which is the quickest way to check one you have not used
before.

### Supertrend's direction is inverted

`out1` does not follow the usual convention:

| `out1` | Meaning |
| --- | --- |
| `-1` | **Uptrend**, price is above the supertrend line |
| `+1` | **Downtrend**, price is below the supertrend line |

So "is it in an uptrend" is `&#123;&#123;st.latest.out1&#125;&#125; < 0`, not `> 0`. A strategy
written on the usual assumption trades backwards: it buys every downtrend
and sells every uptrend, and nothing in the run log looks wrong.

Verified two ways: against 497 real 1-minute bars, and by checking the
library directly, where every bar with `out1 == -1` has its close above
`out0` and every bar with `out1 == +1` has its close below it.

## Historical indicator values

Use `offsetBars` to read a specific bar:

```json
{ "data": { "indicatorName": "supertrend",
            "params": "{\"period\": 10, \"multiplier\": 3}",
            "offsetBars": 5, "outputVariable": "st" } }
```

`&#123;&#123;st.at_offset.out0&#125;&#125;` is the supertrend level five bars back from `latest`.
`offsetBars: 0` puts `at_offset` on the same bar as `latest`, and
`offsetBars: 1` on the same bar as `previous`, so the three readers overlap
by design: `latest` and `previous` are the fixed pair, `at_offset` is the one
you move.

You *can* reverse-index `series` instead, but prefer `at_offset`:
`series[0]`'s meaning depends on `tailBars`, so raising `tailBars` from 6 to
10 silently changes which bar `series[0]` refers to. `at_offset` is
unambiguous.

## Nesting indicators

Set `sourceSeries` to another indicator's series to compute an indicator *of*
an indicator, for example a 9-period SMA of RSI:

```json
{ "id": "smoothed", "type": "indicator", "position": { "x": 300, "y": 100 },
  "data": { "indicatorName": "sma", "params": "{\"period\": 9}",
            "sourceSeries": "{{rsi.series}}", "tailBars": 5,
            "outputVariable": "rsiSma" } }
```

Give the upstream node a large enough `tailBars` to feed the nested window.
A 9-period SMA needs at least 9 upstream values.

Only **single-series** indicators can be nested (`sma`, `ema`, `rsi`, `wma`,
`stdev`, `highest`, `lowest`, …). Anything needing independent high/low/close
inputs (`atr`, `supertrend`, `adx`, …) cannot be reconstructed from one
collapsed output series and returns a clear error.

`sourceSeries` also accepts a raw `history` array, `&#123;&#123;h.data&#125;&#125;` uses each
row's `close`. Override with `sourceField` to use `high`, `low`, or a
specific `out1`.

## Crossovers

`crossover`, `crossunder`, and `cross` are **not** available as an
`indicator` node: they need two independent series, and this node reads one
symbol. Build a crossover from two indicator nodes plus an `andGate`, see
[Tutorial 3](tutorials.md#3-crossovers).

`correlation` and `beta` are excluded for the same reason (they compare two
symbols).

## The complete exclusion list

`tradeboard.ta` ships 127 public functions, more than the `indicator` node
exposes. Eight need a second series and three cannot be computed by the
installed build, leaving the **116** you can use:

| Excluded | Why | What to do instead |
| --- | --- | --- |
| `crossover`, `crossunder`, `cross` | Compare two series | Two `indicator` nodes plus an `andGate`, [Tutorial 3](tutorials.md#3-crossovers) |
| `correlation`, `beta` | Compare two symbols | Not available in Flow; use the Python Strategy Host |
| `exrem`, `flip`, `valuewhen` | Need a second boolean series, and carry state across bars | Restructure as a stateless condition, or use the Python Strategy Host |
| `median_bands`, `ulcerindex`, `vi` | The installed `tradeboard` build returns no usable values for these | Not available; selecting one fails the run with an explicit message |

Everything else in the library works as an `indicator` node.

## Available indicators

| Category | Functions |
| --- | --- |
| **Trend** | sma, ema, wma, dema, tema, hma, vwma, alma, kama, zlema, t3, frama, trima, mcginley, vidya, alligator, ma_envelopes, supertrend, ichimoku, ckstop |
| **Momentum** | rsi, macd, stochastic, stochf, stochrsi, cci, williams_r, bop, elderray, fisher, crsi, cmo, trix, mom, apo, ppo, po, dpo |
| **Volatility** | atr, natr, true_range, bbands, bbpercent, bbwidth, keltner, donchian, chaikin, rvi, ultimate_oscillator, uo_oscillator, massindex, chandelier_exit, hv, starc |
| **Volume** | obv, obv_smoothed, vwap, mfi, adl, cmf, emv, force_index, nvi, nvi_with_ema, pvi, pvi_with_signal, volosc, vroc, kvo, pvt, rvol |
| **Oscillators** | roc, rocp, rocr, rocr100, awesome_oscillator, accelerator_oscillator, aroon_oscillator, cho, chop, kst, tsi, stc, gator_oscillator, coppock |
| **Statistical** | linreg, linregangle, linregintercept, lrslope, variance, tsf, median, mode |
| **Hybrid** | adx, adxr, dx, dmi, minus_dm, plus_dm, aroon, pivot_points, psar, fractals, rwi |
| **Price transform** | avgprice, medprice, midprice, midpoint, typprice, wclprice |
| **Utility** | highest, lowest, change, stdev, rising, falling |

Parameter names follow the `tradeboard.ta` signatures, `{"period": 14}` for
most, `{"fast_period": 12, "slow_period": 26, "signal_period": 9}` for MACD,
`{"period": 10, "multiplier": 3}` for Supertrend. Required parameters get
sensible defaults if you omit them.
