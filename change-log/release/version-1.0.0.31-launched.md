# Version 1.0.0.31 Launched

29th August 2025

***

**Major Features**

**Version Upgrade**

* **Core Version**: Upgraded to `1.0.0.31`
* **Python Library**: Security patch updates (Tradeboard Python + Starlette)

***

### Broker Enhancements & Fixes

**Fyers**

* **WebSocket Deduplication**: Fixed duplicate streaming updates
* **Multiple Symbol Subscription**: Stability fixes for handling simultaneous symbols
* **Mixed Data Issue**: Resolved mis-matched packets during multi-symbol subscriptions
* **OI Support**: Open Interest included in Historical API
* **Unsubscription Error Fix**: Corrected edge-case disconnect issue

**Upstox**

* **Multimode Subscription**: Fixed WebSocket processing for multiple channels
* **Current Day Data**: Issue with missing daily data resolved
* **Daily Timestamp**: Corrected handling of daily timeframe historical data

**Zerodha**

* **Daily Data Format**: Fixed inconsistency in daily candle formatting

**Flattrade**

* **Tradebook Values**: Corrected tradebook price values to two decimal places

**Order Handling**

* **OrderBook**: Fixed market order price value display
* **OrderStatus**: Added average price field; removed hardcoded values

***

### Technical Improvements

**PNL Tracker & Visualization**

* **Intraday PNL Visualizer**: New module for visualizing equity curve and drawdowns
* **Screenshot & Watermark**: Added Tradeboard watermark with `html2canvas-pro` integration
* **Bug Fixes**: Handling empty tradebook; improved PNL documentation

**TradingView Enhancements**

* **Custom Tooltip**: Timestamp rendering corrected

**New APIs**

* **Ping API**: Added lightweight health-check endpoint

***

### Security & Dependencies

* **Python Library**: Updated `tradeboard-python` for security
* **Starlette**: Updated dependency for security patches
* **html2canvas-pro**: Patched version integrated for PNL screenshot feature

***

### Documentation

* **Readme & CSS**: Updated installation and styling docs
* **PNL Tracker**: Added documentation for new visualization module

***

### Breaking Changes

* **Fyers WebSocket**: Subscription/deduplication changes may affect custom wrappers
* **Order Status**: Hardcoded values removed – clients must handle API values dynamically

***

### Dependencies

* **New**: `html2canvas-pro` (patched)
* **Updated**: `tradeboard-python`, `starlette`
* Existing broker libraries and WebSocket infra maintained

***

**Upgrade Instructions**

See [UPGRADE](https://docs.algo.wesoftcorp.com/getting-started/upgrade) for detailed steps.

**Migration Notes**

* No database migration required in this release.
* WebSocket clients (Fyers, Upstox, Flattrade) should review subscription logic.

**Support**

* **Docs**: Updated at `/docs`.
* **Issues**: Report via GitHub Issues.

