# Amibroker

AmiBroker is a popular software among traders for its advanced technical analysis and algorithmic trading capabilities. It suits algorithmic trading well due to several key features:

1. **Advanced Charting and Analysis Tools**: AmiBroker offers a wide range of charting options and technical indicators, allowing traders to conduct thorough market analysis and develop strategies based on historical and real-time data.
2. **AFL (AmiBroker Formula Language)**: One of the core strengths of AmiBroker is its powerful and efficient programming language, AFL. It enables traders to write custom trading rules, indicators, and algorithms. AFL is designed to be easy to learn and fast to execute, making it ideal for developing complex trading strategies without requiring extensive programming knowledge.
3. **Backtesting Capability**: AmiBroker provides robust backtesting tools that allow traders to test their trading strategies on historical data before applying them in live markets. This feature is crucial for algorithmic trading, as it helps identify and refine effective strategies while minimizing risk.
4. **Optimization**: Along with backtesting, AmiBroker offers optimization features that enable traders to fine-tune their strategies by testing various parameters. This process helps in identifying the most effective settings for maximum profitability or efficiency.
5. **Automation and Execution**: AmiBroker can be integrated with trading platforms for automated trading. It can send orders directly to the market based on the rules defined in the AFL scripts, enabling fully automated, hands-off trading.
6. **Scalability and Speed**: The software is designed for efficiency, able to handle large volumes of data and execute trading strategies with minimal delay. This is crucial for high-frequency trading strategies that rely on speed and efficiency.

## How Tradeboard connects to AmiBroker

There are two independent connections, and most setups use both.

**Market data** reaches AmiBroker in one of two ways. Pick one:

* The [Tradeboard AmiBroker Plugin](amibroker-plugin.md), a data plugin DLL. It pulls history from `POST /api/v1/history` and streams live ticks from the Tradeboard WebSocket proxy on port 8765. Use this when you want realtime charts and a live Quote Window.
* [AmiQuote](amiquotes.md) with the `Tradeboard.ads` data source. AmiQuote polls the `GET /api/v1/ticker/...` endpoint on a timer and imports plain-text bars. Use this when a once-a-minute snapshot import is enough.

**Order execution** never uses the data connection. Every execution module on the pages below builds a JSON body inside the AFL and posts it to the Tradeboard REST API on the HTTP port (default `http://127.0.0.1:5000`), using either AmiBroker's built-in `InternetPostRequest` functions (modern method) or an embedded VBScript `Msxml2.XMLHTTP` object (legacy method). The endpoints involved are `placeorder`, `placesmartorder`, `splitorder`, `optionsorder`, `optionsmultiorder`, `modifyorder`, `cancelorder`, `orderstatus`, `closeposition` and `quotes`, all under `/api/v1/`.

Every request carries your Tradeboard API key in the JSON body as `apikey`. The default rate limits are 10 requests per second for `placeorder`, `placesmartorder`, `modifyorder`, `cancelorder`, `optionsorder` and `optionsmultiorder`, and 50 per second for everything else including `quotes`, `splitorder` and `closeposition`. An exploration that fires one order per symbol across a large watchlist needs to stay inside those budgets.
