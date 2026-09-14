# Order Constants

#### Exchange

* NSE: NSE Equity
* NFO: NSE Futures & Options
* CDS: NSE Currency
* BSE: BSE Equity
* BFO: BSE Futures & Options
* BCD: BSE Currency
* MCX: MCX Commodity
* NCDEX: NCDEX Commodity
* NCO: NSE Commodities&#x20;
* NSE\_INDEX: NSE Index&#x20;
* BSE\_INDEX: BSE Index&#x20;
* MCX\_INDEX: MCX Index&#x20;
* GLOBAL\_INDEX: Global indices like US30, JAPAN225, HANGSENG&#x20;
* CRYPTO: Crypto exchanges (broker-agnostic; the broker name is carried in `brexchange`)

These fourteen values are the complete `VALID_EXCHANGES` list used by the order and market-data request schemas. Sending anything else returns HTTP 400. Broker capability metadata decides which subset is actually usable for the connected broker.

#### Product Type

* CNC: Cash & Carry for equity
* NRML: Normal for futures and options
* MIS: Intraday Square off

#### Price Type

* MARKET: Market Order
* LIMIT: Limit Order
* SL: Stop Loss Limit Order
* SL-M: Stop Loss Market Order

#### Action

* BUY: Buy
* SELL: Sell

Order schemas accept the lowercase spellings `buy` and `sell` as well.

#### Derivative Exchanges

Expiry lookup, Option Greeks, and batch Option Greeks validate `exchange` against a narrower derivatives list rather than the full exchange set:

* NFO, BFO, MCX, CDS, NCO, BCD, NCDEX, CRYPTO

GTT placement and modification accept only `CNC` or `NRML` for `product`; `MIS` is rejected because a GTT can rest for days. GTT `pricetype` is restricted to `LIMIT` or `MARKET`.
