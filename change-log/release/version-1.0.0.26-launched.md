# Version 1.0.0.25 Launched

11th July 2025

#### API and SDK Updates

* Upgraded Tradeboard Python SDK version to 1.0.19 to support Expiry API.
* Added Expiry Dates API for Futures and Options Instruments.
* Updated Ticker API Documentation.
* Removed Ticker API Direct Method; now only date range restricted for large queries in Ticker API.
* Updated Historical Direct Method for Fyers.
* Implemented Historical Data Access for Amiquotes using Ticker API Direct Method.
* Updated Tradeboard SDK - Python version to support New Search API.
* Search API Implementation.
* Added OI (Open Interest) in quotes and depth REST APIs for XTS Brokers.
* Removed `include_oi` parameter and updated OI for Angel and Zerodha.
* Implemented Open Interest Dynamic Handling.
* Angel OI included in REST API quote, history, and websocket snap quote.
* Ibulls Rest API - Market Data Update.
* Ibulls Rest API - Place market order Update.
* Ibulls Rest API - Placesmartorder Fixed.
* Updated Aliceblue RestAPI - OI added in depth and quotes.

#### Broker Integrations and Fixes

* Zerodha:
  * Websocket's Index data Fetch Update.
  * Index market data Fixed.
  * Websocket integration in Tradeboard (initial commit).
  * Fix Zerodha Adapter Logger.
  * Centralized Logging Fix.
* Dhan:
  * Quote Data Fixed.
  * Websocket market Depth Update.
  * Ticker header and LTP update.
  * Websocket and Tradeboard's mode mapping fixed.
  * Websocket LTP marketdata Fixed.
  * Websocket marketfeed Update.
  * Websocket Integration Initial Commit.
  * Websocket reconnection issue fixed.
  * Websocket 20 level depth mode initial commit.
  * Websocket reconnection initial commit.
  * Sandbox Correlation ID issue fix.
  * PlaceSmartOrders Correlation ID fix.
  * Invalid Login Credentials fix.
  * Sandbox fix.
  * 20 level token mapping Update.
  * 20 level parsing Update.
  * Updated Dhan Websockets.
  * Websocket 20 level depth fixed.
* Aliceblue:
  * Authentication flow Fixed.
  * Authentication Fixed.
  * Common Index symbol Update.
  * Websocket Auth Fixed.
  * Websocket - Initial commit.
  * RestAPI - Marketdata Update.
  * RestAPI - NFO/BFO symbol token fixed.
  * Websocket- NFO/BFO Symbol lookup fixed.
  * Websocket - LTP and Depth Fixed.
  * Websocket - Quote Fixed, Partial fix of Depth and LTP.
* Flattrade:
  * Adapter registry fix & `{symbol}_{exchange}_{mode_str}` matching Tradeboard proxy and other brokers & Added more debug logs.
  * Basic Flattrade WSS (WebSocket Secure).
  * Fixing Holdings.
  * WSS completed.
  * Updated HTTP/1.1 fallback for Flattrade broker.
  * Fix: Quote and Depth Snapshot Management Implementation in Realtime Websockets.
  * Fix: Env Variable Wrong format Detection.
* Upstox:
  * Updated `Upstox Data.py` Historical Data to Returns IST timestamps → Converts to UTC (sends UTC to API).
  * Updated central log fix for `upstox data.py`.
* Shoonya:
  * Websockets Implementation.
  * Fix: Websocket for Depth and Quote Fix.
  * Fix: Updated Shoonya Adapter for incremental websocket data for quotes and depth.
* Ibulls:
  * OI added for Ibulls.
  * Added Ibulls in `.sample.env` and `install.sh`.
  * Websocket - Urls Update.
  * Websocket - Depth Update.
  * Websocket - Quote and LTP for derivatives Update.
  * Websocket - Quote Update.
  * Websocket - LTP Update.
  * Websockets - Authentication and subscription Update.
  * Websocket - Initial Commit.
* Kotak:
  * Fixing the Funds to two decimals.
  * Updated Kotak master contract with newer Instrument List Version.
* XTS Brokers:
  * Updated XTS brokers list in `install.sh`.
  * Wisdom XTS websocket integration.
  * Jainam XTS websocket Integration.
  * IIFL websocket Integration.
  * FivepaisaXTS websocket Integration.
  * XTS brokers list added.
* Compositedge:
  * Login Fixed and Websocket integrated.
  * Websocket - Initial commit.
  *

#### Security Enhancements and Fixes

* Updated Secure flag cookie.
* Updated Referrer-Policy and Permissions-Policy.
* Updating CSRF Token to View Strategy in Chartink and Strategy Management.
* Fixing CSRF issue with Analyzer Mode.
* Updated CSRF Audit Docs after fixing logout vulnerability.
* Updated CSRF fix in the `tradingview.html` and also migrating logout from get to post request for CSRF security concerns.
* CSRF Audit Report.
* Updated CSRF testing and documentation.
* Update the CSRF Config parameters to `.sample.env`.
* CSRF Implementation.
* FIX: updated CSRF Fix for Exit Position in `/positons` route.
* Fixing CSRF in Close All Open Positions.
* Updated CSRF fix for Strategy Deletion.
* Fix: Adding CSRF Exemption for Chartink and Trading Strategy Webhook.
* Security Fix: Removed rate limiting from logout endpoint.
* Fix: Adding GET Support for Logout Requests for backward compatibility.
* Fix: Duplicate Session Fix, Moving cookies to environmental file.

#### Major Enhancement: Central Logging

Central Logging has been implemented as a major enhancement in Tradeboard, significantly improving how logs are managed and providing a more robust and efficient system. This initiative involved a substantial refactoring effort, with approximately 2000+ lines of previous `print` statements now successfully migrated to the new central logging system.

* Central Logging Implemented:
  * A comprehensive effort to migrate various components and brokers to a unified, centralized logging system. This foundational change streamlines log collection and analysis.
  * Implementation of centralized logging across numerous brokers, including Zerodha, Upstox, Dhan, Kotak, 5paisa/Fivepaisaxts, Paytm, Flattrade, Shoonya, Tradejini, Aliceblue, Compositedge, Firstock, Groww, IIFL, Wisdom, Zebu, Pocketful, and Jainam, ensuring consistent logging practices across the platform.
  * Updated documentation to thoroughly reflect the new centralized logging system, aiding developers and users in understanding its functionality.
* Bug Fixes Issued to Central Logging:
  * Addressed specific issues with the Zerodha Adapter Logger and general logging imports, ensuring accurate log capture.
  * Resolved centralized logging issues for various brokers and their specific modules, including `funds.py`, `Upstox data.py`, Aliceblue, Compositedge, 5paisa, Paytm, Flattrade, Zerodha, Angel, Shoonya, Tradejini, Dhan, Kotak, Fivepaisaxts, IIFL, Wisdom, Zebu, Pocketful, and Jainam.
  * Fixed issues encountered during the migration to centralized logging in blueprints, `proxy_websockets`, services, and `restx_api` folders, ensuring a smooth transition and proper log routing.
  * Corrected instances of duplicate logging entries, reducing log clutter and improving readability.
  * Updated master contract to include central logging and resolved minor string formatting issues, ensuring data integrity within logs.

#### General Fixes and Improvements

* Websockets:
  * Websockets Dynamic broker selection Update.
  * Websocket dictionary iteration error Fixed.
  * Updated websocket examples.
  * Feature: Added Websocket Inspector in the Playground - updated Websocket Testing.
* Performance and Refactoring:
  * Refactor: Improvements http pooling and httpx migration.
  * Automatically Switch Between http2/1.
  * Reverting to http/2 module in util and changed library package to `httpx[http2]`.
  * Updated `httpx` auto fallback to HTTP/1.1.
  * Improvements: Performance Improvements.
  * Database Connecting Pool Optimization for Faster Query Performance.
* General Fixes:
  * ITP & quote fixed.
  * Updating the Master Contract Download Status.
  * Tried fixing the ZMQ issue.
  * Fixing PNL in both Dashboard and TradeBook.
  * Accessing Env variable ZMQ\_port fixed.
  * ZMQ port config in dotenv file fixed.
  * ZMQ Audit report.
  * Zerodha's Dynamic port binding Fixed.
  * Updated CSS Compilation, Tradeboard Version, and test CSRF code.
  * Updated Master Contract with BFO Symbols.
  * Fix: CSRF Token issue fix and Strategy inactivate issue fix.
  * Updated enhanced product enhancement.
  * Implementing Cancel All Orders Button in the OrderBook Page.
  * Reverting back: the Index Fix in Websockets.

#### Documentation and Project Management

* Update `README.md`.
* Docs: Enhanced Tradeboard+ Document.
* Docs: Updated Tradeboard+ Documentation.
* Docs: Query Batching Optimization.
* Docs: Updated Design Documents and Upgrading Jupyter Core, Requests and `urllib3` libraries.
* Fix: Updated Contribution Guidelines.
* Fix: Updated Contribution Documentation.
* Docs: updated Contribution Guidelines and Documentation.
* Docs: Enhanced Trade Management Module.

#### New Features

* Feat: Tradeboard playground-add interactive API and WebSocket playground.
* Feat: updated Tradeboard SDK - Python version to support New Search API.
