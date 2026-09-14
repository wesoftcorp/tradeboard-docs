# Include the Header File

Sample code to Include the header file and creating input controls in your strategy

```cpp
#include <Tradeboard/TradeboardApi.mqh>

input string ApiUrl = "http://127.0.0.1:5000";
input string ApiKey = "your_app_apikey";
input string Strategy = "Metatrader 5 Strategy";
input string TradingSymbol = "SAIL";
input int Quantity = 1;

// Enums as input parameters
input Exchanges Exchange = NSE; // Default value set to NSE Equity
input ProductTypes Product = MIS; // Default value set to MIS for Intraday Square off
input PriceTypes PriceType = MARKET; // Default value set to Market Order

input int FastEMAPeriod = 5;
input int SlowEMAPeriod = 10;
```

`TradeboardApi.mqh` pulls in `CommonDefs.mqh`, `UrlParser.mqh` and `WinINet.mqh` for you, so this single include is all you need.

**Symbol format**

`TradingSymbol` must be the Tradeboard symbol, not the broker's or MetaTrader's symbol. NSE and BSE equities carry no suffix, so it is `SAIL`, `SBIN`, `RELIANCE`, never `SAIL-EQ`. Futures are `[Symbol][DD][MMM][YY]FUT`, for example `NIFTY30JAN25FUT`. Options are `[Symbol][DD][MMM][YY][Strike][CE/PE]`, for example `NIFTY30JAN2521500CE`.

Avoid naming the input `Symbol`. MQL5 already defines a built-in `Symbol()` function and `_Symbol` predefined variable, so a variable called `Symbol` shadows them and makes the rest of the EA harder to read.

**Enum values**

The enums come from `CommonDefs.mqh`.

| Enum | Values |
| ---- | ------ |
| `Exchanges` | NSE, NFO, CDS, BSE, BFO, BCD, MCX, NCDEX |
| `ProductTypes` | CNC, NRML, MIS |
| `PriceTypes` | MARKET, LIMIT, SL, SLM |

`SLM` is sent to Tradeboard as `SL-M`. The other values are sent through unchanged.

**Enable DLL imports**

The library sends its HTTP requests through `wininet.dll` rather than MQL5's own `WebRequest()`. That means two things:

* You must tick **Allow DLL imports** in the EA's Common tab (or globally in Tools, Options, Expert Advisors) before the EA will place any order.
* You do NOT need to add your Tradeboard URL to the **Allow WebRequest for listed URL** list, because `WebRequest()` is never called.

`ApiUrl` accepts both `http://` and `https://`, with or without an explicit port. An `https://` URL with no port defaults to 443, an `http://` URL with no port defaults to 80.
