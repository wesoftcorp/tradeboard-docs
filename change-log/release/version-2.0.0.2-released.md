# Version 2.0.0.2 Released

### Version 2.0.0.2 Released

**Date: 29th Mar 2026**

**Feature Release: Crypto Trading (Delta Exchange), RMoney Broker, Broker-Exchange Separation, Security Hardening & Performance**

This is a feature release featuring **158 commits** (excluding auto-builds) from **17 contributors**, focused on full crypto trading support via Delta Exchange (24/7 markets, fractional quantities, leverage), RMoney broker integration, dynamic broker-exchange separation across all 31 brokers, comprehensive WebSocket FD audit (Phase 2) across 8 more streaming adapters, a 5x startup performance improvement, AliceBlue V3 and Flattrade V2 API upgrades, Zebu OAuth 2.0 migration, event bus architecture, and deep security hardening.

***

**Highlights**

* **Crypto Trading (Delta Exchange)** - Full cryptocurrency trading support with 24/7 market calendar, fractional quantities, leverage configuration, perpetual/options contracts, and crypto-aware UI across TradingView, GoCharting, Token Search, and Playground pages
* **RMoney Broker Integration** - Complete new broker integration including orders, WebSocket streaming, master contracts, funds, margins, multiquotes, and index symbol normalization
* **Broker-Exchange Separation** - Dynamic exchange capabilities per broker via `plugin.json` metadata for all 31 brokers, with frontend auto-adapting UI elements (product types, holdings, leverage) for stock vs crypto brokers
* **Security Dashboard** - New security dashboard with auto-ban toggle, table sorting, and IP management hardening
* **Straddle PnL Simulator** - New options analytical tool for simulating straddle profit/loss scenarios
* **WebSocket FD Audit (Phase 2)** - File descriptor leak fixes across 8 additional broker streaming adapters (Wisdom, iBulls, JainamXTS, IIFL, Compositedge, FivePaisaXTS, Mstock, Motilal)
* **5x Startup Speedup** - Reduced application startup time from 7–9s to \~1.6s via lazy imports, saving \~180MB RAM
* **AliceBlue V3 & Flattrade V2** - Major broker API version upgrades
* **Zebu OAuth 2.0 Migration** - Migrated Zebu from TOTP login to OAuth 2.0 authentication
* **Event Bus Architecture** - Decoupled order side-effects via new event bus system with eventlet compatibility
* **Deep Security Audits** - 3 high-severity and 5 medium-severity findings patched, plus 6 CVE fixes

***

**New Features**

**Crypto Trading Support (Delta Exchange)**

* Full cryptocurrency trading with fractional spot quantities on Delta Exchange
* 24/7 market calendar system for crypto exchanges (no auto-logout)
* Leverage configuration page for crypto brokers with validation
* Broker capabilities API endpoint and frontend Zustand store
* Dynamic exchange support via `supported_exchanges` in `plugin.json` for all 31 brokers
* Wire `useSupportedExchanges` hook into all tools and WebSocket pages
* Hide Holdings page and Product column for crypto brokers
* Dynamic exchanges and product hiding for crypto on TradingView, GoCharting, and Token Search
* Dynamic WebSocket presets for crypto in Playground
* Crypto Bruno collection and broker-aware Playground loading
* Subscribe to BTCUSDFUT for crypto option chain live underlying price
* Conditionally show Leverage page for crypto brokers only
* Add migration for `contract_value` column in symtoken table
* Add CRYPTO to schema validations
* Show combined spot+FNO wallet balance in INR for Delta Exchange

**RMoney Broker Integration (New)**

* Complete broker integration from scratch — auth, order APIs, WebSocket streaming
* Master contract download and data REST APIs
* Funds API, Margin API, Multiquotes
* Common NSE/BSE index symbol normalization
* Added to all broker lists across install scripts and documentation

**Straddle PnL Simulator**

* New Straddle PnL Simulator page (`/straddlepnl`) for options strategy analysis

**Security Dashboard**

* Security dashboard with auto-ban toggle, table sorting, and hardening

**Event Bus Architecture**

* Event bus for decoupled order side-effects (Telegram notifications, logging)
* Resolve greenlet crash in event bus subscribers under eventlet

**Infrastructure & Deployment**

* Domain change script for existing server deployments
* Update scripts for Linux and Windows
* Add Delta Exchange broker to install scripts and documentation
* Logout confirmation dialog warning about automated orders

**Frontend Enhancements**

* Toast notifications for CSV export across all trading pages
* CSV export respects active filters in OrderBook and TradeBook
* Add MCX/CDS default underlyings to `useSupportedExchanges`
* Dynamic webhook URL based on TradingView alert mode

***

**Broker-Specific Changes**

**Delta Exchange (New Crypto Broker)**

* Full crypto trading support with fractional quantities for spot and derivatives
* 24/7 market calendar and auto-logout disabled
* Leverage configuration with fractional rejection and retry on fetch error
* Crypto perpetual symbol lookup and expiry support
* Correct crypto exchange mapping, depth validation, and broker quotes
* Source session P\&L from positions endpoint
* Fix fractional spot quantity truncation in margin calculation
* Safe-parse tradedQuantity and tradedPrice in tradebook transform
* Filter orders and trades by current day
* Cancel all orders includes GTC orders from prior days
* Retry-on-transient-error for data API with read timeout support
* Format Delta Exchange symbols to Tradeboard convention
* Resolve correct perpetual underlying for crypto options

**RMoney (New Broker Integration)**

* Complete implementation: auth, orders, WebSocket, funds, margins, multiquotes
* Master contract download and data REST APIs
* Common NSE/BSE index symbol normalization
* Fix file descriptor leaks in XTS WebSocket streaming

**Zebu**

* Migrate from TOTP login to OAuth 2.0 authentication
* Fix MARKET order price handling and WebSocket disconnect deadlock
* Fix order status, positions, MPP tick\_size, and WebSocket stability
* Resolve file descriptor leaks in WebSocket adapter

**AliceBlue**

* Upgraded to V3 API
* Fix WebSocket resource leaks, index historical data, and Funds realised PNL

**Flattrade**

* Update to V2 API endpoints and WebSocket payload
* Fix WebSocket auth ack type

**Fyers**

* Fix rate limiting for Funds API
* Correct `reformat_symbol_detail` day/year swap (DDMMMYY → correct format)
* Add order, trade, and position data mapping and transformation utilities

**Angel**

* Update base URL, add rate limit retry, and fix limit order price

**Dhan**

* Sandbox API updated and added mocked WebSockets
* Lazy-connect 20-depth WebSocket to preserve connection limit

**Shoonya**

* Harden WebSocket streaming adapter (13-round FD audit)

**Kotak**

* Harden WebSocket streaming adapter (9-round FD audit)

**Groww**

* Make bulk insert atomic to prevent partial data on failure
* Optimize master contract download and normalize streaming logs
* Add common NSE/BSE index symbol mappings

**Motilal**

* Add comprehensive NSE/BSE index symbol mappings
* Fix WebSocket file descriptor leaks

**Mstock**

* Fix WebSocket file descriptor leaks
* Add common index symbol normalization

**Compositedge**

* Common index symbol normalization
* FD audit for streaming — prevent socket/thread leaks

**XTS Brokers (FivePaisaXTS, iBulls, IIFL, JainamXTS, Wisdom)**

* Add index symbol normalization for all XTS brokers
* FD audit for streaming adapters — prevent socket/thread leaks across all 5 brokers

**Upstox**

* Handle position fetch failure in margin calculation

**Multiple Brokers**

* Normalize tick\_size from paise to rupees for Dhan, Firstock, Kotak, Nubra, Shoonya
* Coerce order quantity to int for non-crypto brokers

***

**Bug Fixes**

**WebSocket & Streaming**

* FD audit for 6 XTS broker streaming adapters (Wisdom, iBulls, JainamXTS, IIFL, Compositedge, FivePaisaXTS)
* Harden Shoonya WebSocket streaming adapter (13-round FD audit)
* Harden Kotak WebSocket streaming adapter (9-round FD audit)
* Fix WebSocket file descriptor leaks for Mstock and Motilal
* Fix WebSocket disconnect deadlock in Zebu adapter
* Snapshot `self.ws` before `on_open` callback in `_handle_auth_response`

**Frontend & UI**

* GoCharting page not showing API key on load
* Handle invalid date in orderbook and tradebook for all brokers
* Prevent strategy name overflow from hiding dropdown menu on Python Strategy page
* Add optional chaining for holiday data in `useMarketStatus`
* Stale data warning banner never auto-dismisses (closes #1095)
* Preserve user exchange selection during async capability sync
* Fallback exchanges, leverage route guard, and async state sync
* Clear stale capabilities on no-broker session
* Use `makeFormatCurrency` in WebSocketTest instead of hardcoded broker check
* Ensure CSV export respects active filters in OrderBook and TradeBook

**Orders & Positions**

* Use futures symbol for MCX/CDS LTP in optionsmultiorder
* Prioritize explicit `expiry_date` and use futures symbol for MCX/CDS LTP
* Optimize multi option Greeks to batch API calls (84 → 2)
* Inject symbol/exchange keys into failed Greeks responses
* `get_first_available_api_key()` returns orphaned/revoked user keys
* Coerce order quantity to int for non-crypto brokers

**Backend & Server**

* Pin gunicorn to 25.x and disable control socket
* Replace bare except and silent exception handlers
* Resolve greenlet crash in event bus subscribers under eventlet
* Revert marshmallow to 3.x (4.x breaks schemas)
* Revert llvmlite and pydantic-core to compatible versions
* Make `/api/v1/telegram/notify` non-blocking by default
* Prevent test-message endpoint from returning 500 on timeout
* Fallback to plain text when Telegram Markdown parsing fails
* Clean up `logs_session` in SecurityMiddleware for banned IP requests
* Add graceful shutdown for strategy order processor queue
* Guard ZMQ cleanup in `stop()` to prevent "not a socket" error on Ctrl+C
* Force master contract re-download on broker change
* Dynamic webhook URL based on TradingView alert mode
* Correct 2026 market holiday calendar per official NSE/MCX circulars
* Normalize tick\_size from paise to rupees for 5 brokers
* Remove duplicate code block causing IndentationError in brlogin.py

***

**Security**

* Patch 3 high-severity security findings from deep audit
* Patch 5 medium-severity security findings from deep security audit
* Patch 3 security vulnerabilities (CVE Dependabot #105, #106, #107)
* Upgrade PyJWT to 2.12.0 (security fix)
* Update requests 2.32.5 → 2.33.0 (security patch)
* Patch npm vulnerabilities (socket.io-parser, picomatch)
* Bump svgo 4.0.0 → 4.0.1 (CVE-2026-29074)
* Bump tornado 6.5.4 → 6.5.5 (CVE-2025-47287)
* Replace bare except and silent exception handlers across codebase
* Security dashboard with auto-ban toggle and IP management

***

**Performance**

* Reduce startup time from 7–9s to \~1.6s (5x speedup)
* Lazy-load heavy imports to reduce startup RAM by \~180MB
* Lazy-load python-telegram-bot library to reduce startup RAM
* Move startup logs to debug level to reduce log noise
* Optimize multi option Greeks to batch API calls (84 → 2 requests)

***

**Refactoring & Code Quality**

* Refactor code structure for improved readability and maintainability
* Move Bruno collections to `IN_stock` subfolder
* Add Google-style docstrings to utils module
* Add type hints and docstrings to `security_middleware.py`
* Correct `check_tmp_noexec` return type annotation
* Move `test_orphaned_apikey.py` to `test/` directory
* Add missing file header comments to broker `funds.py` files
* Add aria-label attributes to icon-only buttons for screen reader accessibility
* Remove `frontend/dist` from version control (CI/CD builds it)

***

**Documentation**

* Rewrite CONTRIBUTING.md for React 19 + uv stack
* Add incremental contribution policy to CONTRIBUTING.md
* Allow new broker integrations as single PR in contribution policy
* Update README to enhance description of Tradeboard and supported brokers
* Update README YouTube video tutorial link
* Broker-exchange separation audit for stock vs crypto UI
* Crypto PR audit report for Delta Exchange integration

***

**Dependencies**

**Python**

* Bump the python-minor group with 22 updates + 13 additional updates
* requests 2.32.5 → 2.33.0
* PyJWT → 2.12.0
* pytz 2025.2 → 2026.1.post1
* bcrypt 4.1.3 → 5.0.0
* cachetools 5.3.3 → 7.0.4
* markdown-it-py 3.0.0 → 4.0.0
* limits 3.13.0 → 5.8.0
* flask-limiter 3.7.0 → 4.1.1
* pyarrow 22.0.0 → 23.0.1
* tornado 6.5.4 → 6.5.5
* tradeboard 1.0.45 → 1.0.46
* gunicorn pinned to 25.x
* marshmallow 4.2.2 reverted to 3.x (compatibility)

**Frontend**

* svgo 4.0.0 → 4.0.1
* socket.io-parser security patch
* picomatch security patch

***

**Contributors**

Special thanks to all contributors who made this release possible:

* @Kalaiviswa (kalaivani) — Crypto broker support, broker-exchange separation, WebSocket FD audits (Phase 2), security dashboard, leverage page, event bus
* @rochronaldo (roch ronaldo) — RMoney broker integration
* @BashabBhattacharjee (Bashab Bhattacharjee) — Delta Exchange crypto support, fractional quantities, Zebu OAuth 2.0 migration
* @Sadhanandhann — Dhan sandbox API and mocked WebSockets
* @GahanShetty (Gahan Shetty) — AliceBlue V3 upgrade
* @sugatmankar — Groww index symbol mappings
* @shubhamlodha21 — Flattrade WebSocket auth fix
* @preet225 — Angel rate limiting and base URL fixes
* @crypt0inf0 — Delta Exchange fixes
* @Profesooor — Fyers symbol detail fix
* @PratimaPrit — Accessibility improvements
* @LuckyAnsari22 — Motilal index symbol mappings
* @JaredW — Security middleware docstrings
* @jagatsingh (Jagat Singh) — Dhan lazy WebSocket connect
* @HirenThakore (Hiren Thakore) — RMoney XTS WebSocket FD fix
* @DeepanshuGoyal (Deepanshu Goyal) — Aliceblue V3 Integration

***

***

**Links**

* **Repository**: [https://github.com/wesoftcorp/tradeboard-docs](https://github.com/wesoftcorp/tradeboard-docs)
* **Documentation**: [https://docs.algo.wesoftcorp.com](https://docs.algo.wesoftcorp.com)
* **Discord**: [https://www.tradeboard.in/discord](https://www.tradeboard.in/discord)

***
