# Metatrader 5

MetaTrader 5 is widely used for charting and for running Expert Advisors, but its built-in trading functions talk to a forex or CFD broker, not to an Indian broker. The Tradeboard MQL5 library bridges that gap: your EA keeps generating signals in MetaTrader, and every order is routed over HTTP to your Tradeboard instance, which forwards it to whichever of the supported brokers you have connected.

**How it fits together**

The library is a set of MQL5 include files that you drop into `MQL5\Include\Tradeboard`. It exposes six functions (`PlaceOrder`, `PlaceSmartOrder`, `ModifyOrder`, `CancelOrder`, `ClosePosition`, `CancelAllOrders`) that POST JSON to the matching `/api/v1/` endpoints on your Tradeboard server. Nothing runs inside MetaTrader beyond the HTTP call, so the broker connection, symbol mapping, analyzer mode, logging and rate limiting all stay in Tradeboard.

Requests go out through `wininet.dll`, which means the EA needs **Allow DLL imports** enabled. It also means MQL5's `WebRequest()` URL allowlist is not used, so there is nothing to configure under Tools, Options, Expert Advisors, Allow WebRequest.

**What the library covers**

* Order placement, including smart orders that reconcile against your live position
* Order modification and cancellation
* Closing all positions or cancelling all orders for a strategy

Market data, the order book, the position book and holdings are not wrapped. Call the Tradeboard REST API directly if your EA needs them.

**Before you start**

* Tradeboard installed, running and logged in to your broker
* An Tradeboard API key from the API Key page of the dashboard
* The URL where MetaTrader can reach Tradeboard, typically `http://127.0.0.1:5000` when both run on the same Windows machine
* Symbols written in the Tradeboard format: `SBIN` for equities (no `-EQ` suffix), `NIFTY30JAN25FUT` for futures, `NIFTY30JAN2521500CE` for options

The pages that follow walk through installing the library, including the header, the functions it provides, and a complete EMA crossover Expert Advisor.
