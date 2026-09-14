# Market Data and Timeframes

## Live quotes

`getQuote` returns a single symbol's snapshot:

```json
{ "id": "q", "type": "getQuote", "position": { "x": 0, "y": 100 },
  "data": { "symbol": "RELIANCE", "exchange": "NSE", "outputVariable": "q" } }
```

Available fields: `&#123;&#123;q.data.ltp&#125;&#125;`, `.open`, `.high`, `.low`, `.prev_close`,
`.volume`, `.oi`, `.bid`, `.ask`.

`.high` and `.low` are **today's running session high and low**, useful for
stateless "did price come back to this level today?" logic without needing
cross-run memory. [Tutorial 5](tutorials.md#5-previous-day-breakout-with-a-gap-filter)
uses exactly this.

Use `multiQuotes` for several symbols in one call, and `getDepth` for the
order book.

Note that data nodes do **not** upper-case `symbol`, while order nodes do. A
lowercase symbol from an external alert places an order fine and fails the
quote lookup in the same workflow. See
[Limitations](limitations.md#symbol-is-upper-cased-on-order-nodes-not-on-data-nodes).

## Historical bars

Three nodes read history, each answering a different question.

| Node | Question it answers |
| --- | --- |
| `history` | "Give me the raw OHLCV array for a date range." |
| `barOffset` | "What was the close N bars back?" |
| `priorPeriodOhlc` | "What was the previous day/hour/week/month's OHLC?" |

`indicator` reads history too, but returns computed values rather than bars;
it has its own section below.

### history: the raw OHLCV array

```json
{ "id": "h", "type": "history", "position": { "x": 0, "y": 100 },
  "data": { "symbol": "RELIANCE", "exchange": "NSE",
            "interval": "5m", "days": 30, "outputVariable": "h" } }
```

`&#123;&#123;h.data&#125;&#125;` is an array of OHLCV records. The primary range control is
`days` (default 30, editor maximum 365). `startDate` and `endDate` are also
accepted and take precedence when both are set.

Unlike the other three history-reading nodes, `history` picks its interval
from a fixed dropdown, not a free-text box: `1m`, `5m`, `15m`, `1h`, `1d`.
It also has **no `source` field**, so it always calls the active broker. When
you need a broker-independent or resampled interval, read it through
`indicator`, `barOffset`, or `priorPeriodOhlc`, which do accept `source`.

### barOffset: N bars back

```json
{ "id": "b5", "type": "barOffset", "position": { "x": 0, "y": 100 },
  "data": { "symbol": "NIFTY", "exchange": "NSE_INDEX", "interval": "D",
            "source": "api", "offsetBars": 5, "outputVariable": "bar5" } }
```

Exposes `&#123;&#123;bar5.open&#125;&#125;`, `.high`, `.low`, `.close`, `.volume`, `.timestamp`.

**Offsets count bars, not calendar days.** `offsetBars: 0` is the most recent
*closed* bar, today's still-forming candle is excluded. On a Wednesday,
`offsetBars: 5` on a daily chart lands on the previous Tuesday: five trading
bars back, which spans seven calendar days across the weekend.

Because it counts bars, the same node covers "5 hours back" (`interval: "1h"`)
or "30 minutes back" (`interval: "1m", offsetBars: 30`).

`barOffset` is the only node that discards a forming bar deterministically,
and the only one that hands back a `timestamp`. When it matters *which* bar you
read, read it here.

### priorPeriodOhlc: previous period levels

```json
{ "id": "pd", "type": "priorPeriodOhlc", "position": { "x": 0, "y": 100 },
  "data": { "symbol": "NIFTY", "exchange": "NSE_INDEX",
            "period": "previous_day", "source": "api", "outputVariable": "pd" } }
```

`period` accepts `previous_hour`, `previous_day`, `previous_week`,
`previous_month`. Weekly and monthly are aggregated from daily bars, high is
the max, low the min, open the first, close the last of the completed period.

This node has no `interval` field. The period picks it: `previous_hour` reads
`1h` bars, everything else reads `D`.

Convenience aliases are provided alongside the raw fields:

| Alias | Same as |
| --- | --- |
| `&#123;&#123;pd.pdh&#125;&#125;` | `&#123;&#123;pd.high&#125;&#125;` |
| `&#123;&#123;pd.pdl&#125;&#125;` | `&#123;&#123;pd.low&#125;&#125;` |
| `&#123;&#123;pd.pdc&#125;&#125;` | `&#123;&#123;pd.close&#125;&#125;` |

The node never returns a still-forming candle. If history is too short to
contain a completed prior period, it raises rather than silently handing back
today's partial bar.

## Indicators: which bar you are reading

An `indicator` node returns several views of the same computed series:

| Reference | Bar it holds |
| --- | --- |
| `&#123;&#123;ind.latest.*&#125;&#125;` | the most recent bar the history fetch returned |
| `&#123;&#123;ind.previous.*&#125;&#125;` | the bar before that |
| `&#123;&#123;ind.at_offset.*&#125;&#125;` | `offsetBars` bars back from `latest` |
| `&#123;&#123;ind.series[N]&#125;&#125;` | a fixed-length tail, `tailBars` long (default 5) |

The field after the dot is `value` for a single-output indicator and `out0`,
`out1`, … for a tuple one. `&#123;&#123;ind.outputs&#125;&#125;` lists the names the run actually
produced, and `&#123;&#123;ind.bars_used&#125;&#125;` says how many bars went into it.

`offsetBars` exists so a strategy can name a bar directly. Reverse-indexing
`series` also works, but `series[0]`'s meaning shifts whenever you change
`tailBars`, so an unrelated edit silently moves which bar you read.

**`latest` is not guaranteed to be a closed bar.** The indicator node computes
over exactly what the fetch returned and does not drop a forming bar, so
`latest` is the forming bar when the feed has opened one and the last closed
bar when it has not. `previous` shifts with it. The output carries no
timestamp, so nothing in the run tells you which case you are in. That is the
single most common source of a Flow strategy that works most days.

Two ways to be sure:

* Fire the workflow on a **clock-aligned interval schedule**, which puts the
  run just inside the new bar (see below). Measured on a live instance, at
  `:02` past the minute the feed's last bar is the just-closed one, so
  `latest` is the candle a close-based strategy wants.
* Read the bar with **`barOffset`** instead, which drops the forming bar
  explicitly and returns a `timestamp` you can log.

`supertrend` deserves its own warning: it is a tuple indicator, so its outputs
are `out0` (the line) and `out1` (direction), and the direction is inverted
from the usual convention. **`-1` is the uptrend**, `+1` the downtrend. See
[Limitations](limitations.md#supertrends-direction-output-is-inverted).

## Timeframes

On `indicator` and `barOffset`, `interval` is a **free-text field, not a
dropdown**, because broker support varies. Common values: `1m`, `3m`, `5m`,
`15m`, `30m`, `1h`, `D`. `priorPeriodOhlc` derives its interval from `period`,
and `history` offers only the five fixed choices listed earlier.

Use the `intervals` node to list what your connected broker actually
supports:

```json
{ "id": "iv", "type": "intervals", "position": { "x": 0, "y": 100 },
  "data": { "outputVariable": "ivs" } }
```

If you request an interval the broker does not offer, `indicator`,
`barOffset`, and `priorPeriodOhlc` report the broker's own message and point
you at the alternative rather than failing with a misleading "no data". The
`history` node still returns the raw broker payload, so read its output when
a `history` fetch comes back empty.

## `source` and `sourceField` are different things

These two are easy to confuse, and confusing them produces an error that names
neither.

**`source` selects where the bars come from.** It exists on `indicator`,
`barOffset` and `priorPeriodOhlc`, and takes exactly two values:

| Value | Reads from |
| --- | --- |
| `api` (default) | the connected broker |
| `db` | Tradeboard's local Historify store |

Anything else is refused with `Source must be either 'api' or 'db'`, wrapped
in a history-fetch error. So `"source": "close"` looks like a data outage
rather than a typo.

**`sourceField` selects which field to read from each incoming row.** It
exists only on `indicator`, and only in nested mode, where `sourceSeries`
points at another node's array:

```json
{ "id": "rsi_sma", "type": "indicator", "position": { "x": 0, "y": 100 },
  "data": { "indicatorName": "sma", "params": "{\"period\": 9}",
            "sourceSeries": "{{h.data}}", "sourceField": "high",
            "outputVariable": "rsi_sma" } }
```

Left blank it auto-detects, trying `value`, then `out0`, then `close`. Set it
to read something else from each row: `high`, `low`, or `out1` from a tuple
indicator upstream. With no `sourceSeries` it is ignored entirely.

Neither field is the price field for a normal (non-nested) indicator. That is
chosen by the indicator itself: `rsi` takes close, `atr` takes high/low/close,
and `&#123;&#123;ind.inputs&#125;&#125;` reports which columns the run used.

### Resampling with the Historify DB

Set `source: "db"` on an `indicator`, `barOffset`, or `priorPeriodOhlc` node
to read from Tradeboard's local Historify store instead of the broker.
Historify stores `1m` and `D` and **computes everything else on demand with
SQL**:

| From stored | You can request |
| --- | --- |
| `1m` | any minute or hour interval, `2m`, `3m`, `4m`, `25m`, `2h`, … |
| `D` | `W`, `M`, `Q`, `Y` |

This is the answer to "my broker does not support 3-minute candles". Download
1-minute data once into Historify, then every node can request `3m`
regardless of broker capability.

The symbol must already be in Historify, download it from the Historify page
first.

## The 200-bar ceiling

**Every history fetch is capped at the most recent 200 bars.**

This is deliberate. Ten years of daily data is ~2,500 rows, but ten years of
1-minute data is ~900,000 rows, a download that takes minutes, exhausts the
broker's rate budget, and then sits in workflow memory. No indicator here
needs that depth; a 200-period moving average is the deepest common window.

The cap is applied when **sizing the request**, not merely when trimming the
response, so the oversized fetch never leaves Tradeboard:

| Interval | Calendar window actually requested |
| --- | --- |
| `1m` | ~5 days |
| `5m` | ~9 days |
| `15m` | ~17 days |
| `1h` | ~50 days |
| `D` | ~325 days |
| `W` | ~4.4 years |
| `M` / `Q` / `Y` | capped at ~11 years |

A second ceiling bounds the calendar span, because 200 quarterly bars would
otherwise span 54 years and 200 yearly bars 219 years, ranges no broker
serves sensibly.

The `history` node's explicit `startDate`/`endDate` is narrowed the same way.
Requesting `2016-01-01` to `2026-07-29` on a daily chart becomes roughly the
last 200 daily bars. The narrowing is written to the Tradeboard server log, not
to the per-node execution log shown in the editor, so check `log/` if a run
returned fewer bars than you asked for.

Both limits are tunable if a strategy genuinely needs more depth. Neither
appears in `.sample.env`, so add them to `.env` yourself:

```
FLOW_MAX_HISTORY_BARS=200
FLOW_MAX_HISTORY_CALENDAR_DAYS=4000
```

## Rate limits and caching

Broker data APIs are throttled far more tightly than a node graph suggests:

| Broker | Limit |
| --- | --- |
| Dhan | 5 req/s history, **1 req/s quotes** (error 805 on breach) |
| Flattrade | 10 req/s |
| Zerodha | 1 req/s on some paths |

On top of that, Tradeboard serializes every broker history call behind a
process-wide 350 ms gate, about 3 per second.

A strategy asking for RSI + SMA + ATR + previous-day levels on one symbol
would issue four *identical* history requests per run. To prevent that, all
history-reading nodes share a short-TTL cache keyed by the exact request
(account, symbol, exchange, interval, dates, source). Four nodes wanting the
same series produce **one** broker call.

Concurrent misses for the same key are collapsed into a single in-flight
request, so a burst of workflows starting together still makes one call.
Errors and empty responses are never cached, so a transient failure stays
retryable.

### The TTL is a data-freshness setting, not just a performance one

```
FLOW_HISTORY_CACHE_TTL=30        # seconds; 0 disables
FLOW_HISTORY_CACHE_MAXSIZE=256
FLOW_HISTORY_FLIGHT_TIMEOUT=60   # seconds a collapsed request may wait
```

Only `FLOW_HISTORY_CACHE_TTL` ships in `.sample.env`; add the other two to
`.env` yourself if you need them.

The **30 second default suits 5-minute bars and above**. On a 1-minute
strategy it is half a candle: a run at 09:31:02 can be served the fetch made
at 09:30:34, so the newest bar in the response is one candle stale. Nothing
errors, the workflow simply acts on the wrong candle. Set the TTL to 2 or 3
seconds for 1-minute work.

Practical guidance: prefer one `indicator` node per distinct
symbol/interval/indicator, and reuse its `outputVariable` downstream rather
than adding duplicate nodes.

## Clock-aligned schedules

An interval schedule on the `start` node fires on **clock boundaries**, not on
the offset from whenever you activated the workflow. A 5-minute job lands on
:00, :05, :10, and reactivating or restarting the server does not change its
phase. Sub-minute intervals (`seconds`) are left unaligned, because there is no
meaningful boundary to align a 10-second job to.

Runs land a small offset past the boundary:

```
FLOW_INTERVAL_ALIGN_OFFSET=2     # seconds past the boundary; default 2
```

It is not zero on purpose. Firing exactly on the minute races the bar that is
closing: the feed may or may not have opened the next one, and those two
answers differ by a whole candle. Two seconds is late enough to have settled
and early enough that a 1-minute strategy still acts on the candle that just
closed.

**The measured behaviour that makes this useful:** at `:02` past the minute the
feed's last bar is the just-closed one, not a freshly opened partial. That puts
the closed candle at `&#123;&#123;ind.latest.*&#125;&#125;`, which is what a candle-close strategy
wants to read. If your broker's feed settles more slowly, raise the offset
rather than restructuring the workflow.

The key ships in `.sample.env`, so it is already present in a `.env` copied
from it.

Two things this does not do:

* It does not open the market. `marketHoursOnly` gates the run against
  `marketHoursStart` / `marketHoursEnd` (09:15 to 15:15 by default) on the
  calendar named by `marketHoursExchange` (default NSE). Those two times set
  the clock, so they can narrow the exchange's own session or extend past it,
  but nothing reopens a holiday or a weekend. The exchange matters because MCX
  runs to 23:55 and CRYPTO never closes. A `start` node created in the editor
  has the switch on; an imported JSON that omits `marketHoursOnly` is treated
  as off and runs around the clock, so set it explicitly.
* It does not queue. A run still in progress when the next boundary arrives
  returns `already_running` and is dropped. Keep the interval comfortably
  longer than the run takes.

## Index symbols

Index underlyings use the index exchanges, not the equity ones:

| Symbol | Exchange |
| --- | --- |
| `NIFTY`, `BANKNIFTY`, `FINNIFTY`, `MIDCPNIFTY` | `NSE_INDEX` |
| `SENSEX`, `BANKEX`, `SENSEX50` | `BSE_INDEX` |
| `RELIANCE`, `SBIN`, … | `NSE` / `BSE` |

Their options trade on `NFO` (NSE) and `BFO` (BSE). Using `NSE` for `NIFTY`
returns no data.
