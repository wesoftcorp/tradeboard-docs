# Option Chain

This page covers the standalone option chain application linked below. Tradeboard itself also ships an option chain: the `/optionchain` page in the web UI, the `/api/v1/optionchain` REST endpoint, and `client.optionchain(underlying=..., exchange=..., expiry_date=..., strike_count=...)` in the Python SDK. See the [OptionChain example](README.md#optionchain-example) for the SDK call and its response shape.

### Features

* **Real-time Data**: Live option chain updates via Server-Sent Events (SSE).
* **Market Depth**: View Bid/Ask quantities and spreads.
* **Dynamic Expiries**: Automatically fetches and caches expiry dates for NIFTY, BANKNIFTY, and SENSEX.
* **Calculated Metrics**: Real-time PCR (Put-Call Ratio) and Volume analysis.
* **Responsive UI**: Modern interface built with DaisyUI and Tailwind CSS.

<figure><img src="/assets/Tradeboard Option Chain.png" alt=""><figcaption></figcaption></figure>

#### Github Link

[https://github.com/marketcalls/option-chain](https://github.com/marketcalls/option-chain)
