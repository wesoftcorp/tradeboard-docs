# Data API

Market-data, symbol, and options endpoints normalize broker responses behind a shared API contract. Availability and depth can still vary by broker.

| Endpoint | Purpose |
|---|---|
| [Quotes](quotes.md) | Read one normalized quote |
| [Multiple quotes](multiquotes.md) | Read normalized quotes in a batch |
| [Depth](depth.md) | Read the order book and market depth |
| [History](history.md) | Read broker or Historify candles |
| [Intervals](intervals.md) | List supported candle intervals |
| [Ticker](ticker.md) | Read TradingView-compatible history |
| [Symbol](symbol.md) | Resolve symbol metadata |
| [Search](search.md) | Search the instrument master |
| [Expiry](expiry.md) | List derivatives expiries |
| [Instruments](instruments.md) | Download the instrument master |
| [Option symbol](optionsymbol.md) | Resolve an option contract |
| [Option chain](option-chain.md) | Read an option chain |
| [Synthetic future](syntheticfuture.md) | Calculate a synthetic-future price |
| [Option Greeks](optiongreeks.md) | Calculate Greeks for one option |
| [Multiple option Greeks](multioptiongreeks.md) | Calculate Greeks in a batch |
