# Version 1.0.0.30 Launched

19th August 2025

***

**Major Features**

**Version Upgrade**

* **Core Version**: Upgraded to `1.0.0.30`
* **Python Library**: Upgraded to `1.0.28`

***

## Broker Enhancements & Fixes

**Fyers**

* **WebSocket Depth Update**: Fixed handling of depth updates
* **Quotes Update**: Improved WebSocket streaming for quotes
* **Binary Protocol Update**: Enhanced HSM Binary protocol for LTP
* **Frontend WebSocket Fix**: Fixed frontend WebSocket issues

**Zerodha**

* **Avg Price Fix**: Resolved issue with incorrect average price in orders

***

## Technical Improvements

**Docker & WebSocket Fixes**

* **Ubuntu Fix**: Resolved WebSocket stability issues on Ubuntu servers
* **Server-Side Fixes**: Improved WebSocket handling across backend services
* **Frontend Fix**: Updated fix for `wss` frontend compatibility

**Caching Enhancements**

* **Restructure & Better Caching**: Improved internal caching mechanism for performance

**Historical Data**

* **Upstox**: Fixed timestamp handling for daily timeframe
* **Upstox**: Improved chunking for historical data retrieval
* **Firstock**: Updated 1-minute historical data handling

***

## Security & Profile Enhancements

* **UI Fixes**: Reset password mail icon corrected
* **Profile Page**: Default content tab issue fixed

***

## WebSocket & Connectivity

**Dhan**

* **New Implementation**: Integrated new Dhan WebSocket handling
* **20-level ZMQ Cleanup**: Resolved cleanup and dynamic symbol support
* **Cross-device Fix**: Fixed connectivity across devices

**Wisdom / XTS Brokers**

* **ZMQ Port Release Fix**: Resolved port release issues for stability

***

## Documentation

* **MCP Integration**: Updated documentation for local MCP setup
* **Installation**: Revised installation instructions pointing to official docs
* **Readme Updates**: Multiple updates for clarity and consistency

***

## Breaking Changes

* **Cross-device WebSocket Handling**: Significant update in Fyers, Flattrade, Shoonya and Dhan WebSocket systems may affect custom setups.
* **Zerodha Subscribe All**: Behavior updated for stability

***

## Dependencies

* **No new external dependencies**.
* Improvements in WebSocket stability and caching rely on existing libraries.

***

#### Upgrade Instructions

See [UPGRADE](https://docs.algo.wesoftcorp.com/getting-started/upgrade) for detailed steps.

#### Migration Notes

* No database migration required in this release.
* WebSocket configuration updates recommended for brokers (Fyers, Dhan, Zerodha.Flattrade,Shoonya).

#### Support

* **Docs**: Updated at `/docs`.
* **Issues**: Report via GitHub Issues.

