# Version 1.0.0.32 Launched

19th September 2025

***

**Major Features**

**Version Upgrade**

* **Core Version**: Upgraded to `1.0.0.32`
* **Order Status**: Fixes applied for both Live Mode and Analyzer Mode
* **New Broker Integration**: **Definedge Securities** fully supported
* **New Strategy Hosting**: Introduced `/python` web page where users can directly host and run Python strategies inside Tradeboard

***

#### Broker Enhancements & Fixes

**Aliceblue**

* **WebSocket**: Frontend “subscribe all” stability fix
* **Holdings**: Issue with holdings data corrected

**Definedge (New Integration)**

* **Broker Support**: Added full integration for Definedge Securities
* **Order APIs**: Support for place, modify, cancel, cancelAll, and closeAllPositions
* **WebSocket**: Implemented, with fixes for multiple client subscription
* **Placesmart Orders**: Implemented
* **Quotes & Funds**: Data updates and holdings/funds retrieval supported
* **HTTPX Pooling**: Shared connection pooling standardized

**Dhan**

* **Historical Data API**: Fixes applied for date handling

**Dhan Sandbox**

* **Historical Data API**: Fixed date handling issue specific to sandbox environment

**Fyers**

* **PNL & LTP**: Calculation and data fixes

**Flattrade**

* **WebSocket**: Multiple client subscription bug fixed

**Firstock**

* **WebSocket**: Fixed handling for multiple clients subscribing to the same symbols

**Groww**

* **WebSocket**: Added quotes streaming
* **Depth Data**: Added for NSE, BSE, NFO, and BFO
* **BSE Data**: Dedicated update for exchange coverage
* **Index Data**: Streaming index support added
* **Instrument Type Lookup**: Implemented for indices
* **Fixes**: Inconsistent WebSocket behaviour resolved; strike and lot size columns corrected; REST API depth Nonetype bug fixed

**Kotak**

* **Tradebook**: Transaction type format fixed
* **Quotes**: Open Interest field added

**Shoonya**

* **WebSocket**: Multiple client subscription support fixed
* **Basket Orders**: Issues resolved
* **Master Contract**: MCX script handling and ZMQ WebSocket cleanup

**Zebu**

* **Migrated to HTTPX**: Now uses shared connection pooling for efficient requests
* **WebSocket Support**: Fully integrated
* **Common Index Symbols**: Implemented
* **History & PNL Tracker**: Bug fixes applied

***

#### Technical Improvements

* **Python Strategy Hosting**: New `/python` web module for hosting custom Python strategies inside Tradeboard
* **Statistics Formatting**: Enhanced formatting to preserve integer counts and properly format prices
* **Orderbook Refactor**: Orderbook, tradebook, positions, and holdings fetch moved from services layer for clarity
* **Docker**: Write permissions updated; Eventlet added in Dockerfile; Python strategy log issue fixed
* **Python SDK**: Updated to remove `pandas-ta` dependency and fix Numba “nopython” warnings
* **Installation**: Ubuntu installation scripts updated; EBS config updated

***

#### Security & Dependencies

* **Security Audit**: Hidden vulnerabilities audit completed
* **Libraries**:
  * `tradeboard-python` updated to `1.0.30`
  * `httpx` pooling standardized across brokers
  * Removed `pandas-ta` dependency

***

#### Documentation

* **Readme**: Updated with `ping` API function and general documentation refresh
* **Design Docs**: Updated to reflect new broker integrations and infrastructure changes

***

#### Breaking Changes

* **WebSocket Clients**: Multiple-subscription changes for **Groww, Definedge, Shoonya, Firstock, Flattrade, Zebu** – may require client-side adjustments
* **Python SDK**: Removal of `pandas-ta` requires strategy developers to migrate to supported indicator libraries (`pandas_ta` or `talib`)

***

#### Dependencies

* **New**: Eventlet (Docker runtime)
* **Updated**: `tradeboard-python` 1.0.30, `httpx` pooled connections
* **Removed**: `pandas-ta`

***

**Upgrade Instructions**

See [UPGRADE](https://docs.algo.wesoftcorp.com/getting-started/upgrade) for detailed steps.

**Migration Notes**

* No database migration required in this release.
* WebSocket users (Groww, Definedge, Shoonya, Firstock, Flattrade, Zebu) must test subscription logic.
* Strategy developers: Update indicators if you depended on `pandas-ta`.

**Support**

* **Issues**: Report via GitHub Issues.

