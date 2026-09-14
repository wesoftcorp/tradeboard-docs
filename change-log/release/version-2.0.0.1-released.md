# Version 2.0.0.1 Released

## Version 2.0.0.1 Released

**Date: 24th Feb 2026**

**Maintenance Release: Option Chain Analytics, Nubra Broker Integration, WebSocket Stability & Infrastructure Hardening**

This is a maintenance release featuring **314 commits** (excluding auto-builds) from **16 contributors**, focused on new analytical tools (Option Greeks, GEX Dashboard, Volatility Surface), full Nubra broker integration, comprehensive WebSocket stability fixes across all brokers, NSE/BSE index symbol normalization, Docker infrastructure improvements, and CI/CD pipeline establishment.

***

#### Highlights

* **Option Chain & Analytics Suite** - Option Chain page with PlaceOrder dialog, Option Greeks (IV/Delta/Theta/Vega/Gamma), GEX Dashboard, IV Smile, OI Profile, 3D Volatility Surface, ATM Straddle Chart, OI Tracker, Max Pain
* **Nubra Broker Integration** - Complete broker integration including orders, positions, holdings, funds, historical data, WebSocket streaming, and master contracts
* **WebSocket Stability Overhaul** - File descriptor leak fixes, health checks, reconnection logic, and resource cleanup across all broker streaming adapters
* **NSE/BSE Index Symbol Normalization** - Standardized index symbol mappings across Zerodha, Dhan, Fyers, Angel, Upstox, Shoonya, Flattrade, and Nubra
* **System Health Monitor** - Real-time health monitoring dashboard with process metrics and chart visualization
* **CI/CD Pipeline** - Comprehensive CI/CD with Ruff linting, Docker Hub builds, Dependabot, and automated frontend builds
* **Docker & Installation** - Multi-instance installer, Docker Desktop scripts (Windows/macOS/Linux), automatic migrations, SSL support
* **Sandbox Enhancements** - Realistic LIMIT/SL order fills, WebSocket auto-upgrade, P\&L calculation fixes
* **Batched Basket Orders** - Concurrent basket order execution for all brokers with eventlet compatibility

***

#### New Features

**Option Chain & Analytics Tools**

* Add Option Chain page with real-time WebSocket LTP/Bid/Ask data
* Add PlaceOrder dialog with Buy/Sell buttons directly from Option Chain
* Add Option Greeks page with IV/Delta/Theta/Vega/Gamma charts and Tools hub
* Add GEX Dashboard, IV Smile, and OI Profile analytical tools
* Add 3D Volatility Surface analytical tool
* Add Dynamic ATM Straddle Chart analytical tool
* Add OI Tracker and Max Pain analytical tools
* Add Option Chain link to main navbar
* REST API fallback for market depth in PlaceOrderDialog
* Round WebSocket LTP/Bid/Ask to tick size in Option Chain
* Display bid/ask quantities in option chain page

**System Health Monitor**

* Add system health monitoring dashboard with real-time metrics
* Add migration for health metrics process details
* Enhance HealthMonitor with dynamic chart intervals and tab visibility handling
* Display IST time in Health Monitor chart crosshair and axis

**Historify Enhancements**

* Add scheduler for automated data downloads
* Add symbol validation and bidirectional incremental download
* Add time picker with AM/PM for daily schedules
* Add bulk delete for historical data and watchlist
* Default schedule type to Daily
* Clarify incremental download behavior in scheduler UI

**Flow Editor Improvements**

* Add Order Status node configuration and executor
* Add price type field to options order node
* Fetch options lot sizes from master contract database
* Cap exponent size in flow math expressions to prevent DoS
* Fix OptionSymbol, Multiquotes, and OpenPosition issues
* Fix Smart Order now supports negative position sizes
* Fix modify order not reading price/quantity fields
* Correct weekday selection in flow editor schedule node
* Correct parameter names for get\_option\_chain in flow editor
* Resolve handle jittering and add neon glow effects
* Improve node connection UX

**WebSocket Enhancements**

* Add 50-level depth support with correct symbol format
* Add broker-dependent depth level test pages
* Add bulk subscription support for WebSocket proxy
* Add REST API fallback for shared WebSocket provider
* Add centralized useLiveQuote hook for real-time market data
* Add greeks WebSocket channel for Nubra OI data
* Shared WebSocket provider frontend update

**Sandbox Enhancements**

* Realistic LIMIT order fill pricing in sandbox execution engine
* Marketable LIMIT orders fill at LTP with retry logic
* Immediate execution for SL/SL-M orders when trigger already met
* Make sandbox engine actively subscribe to WebSocket market data (headless)
* Auto-upgrade from polling to WebSocket when proxy becomes healthy
* Add CSV export functionality to sandbox My P\&L page
* Add special session support with custom exchange timings
* Correct P\&L calculation for positions to match Zerodha

**Basket Orders**

* Batched concurrent basket order execution for all brokers with eventlet compatibility
* Batched concurrent basket order execution for Shoonya broker
* Handle Shoonya failed orders and batch execution errors

**Toast & Notification System**

* Add toast notification control system with category-based filtering
* Add Top Center and Bottom Center toast positions
* Enhance position closing notifications with toast messages

**Infrastructure & Docker**

* Add comprehensive CI/CD pipeline with Ruff linting and Docker Hub builds
* Add multi-instance custom SSL installer and documentation
* Add Docker run scripts for Windows and macOS/Linux
* Make Docker scripts standalone (download and run)
* Add installation script with broker configuration and XTS validation
* Automate frontend build within Dockerfile
* Robust Docker healthcheck using backend-only endpoint
* Add automatic migrations on container startup
* Add strategies directory mount and log directory mount for Docker Desktop
* Show documentation URL after setup
* Add thread limiting to Docker Hub runner scripts and multi-instance installer

**Other Features**

* Add FAQ page with accordion-based Q\&A sections
* Add carry-forward position PnL tracking in PnL tracker
* Smart master contract download with configurable cutoff time
* Show data subscription alert for Zerodha and Dhan on broker select page
* Enhance database path configuration for instance isolation
* Add backtesting and plotting scripts for RELIANCE 5-Minute data
* Refactor BrokerSelect component to filter and display only enabled brokers
* Accessibility: aria-label and title to icon-only buttons in admin pages
* Accessibility: aria-label to inline edit inputs

***

#### Broker-Specific Changes

**Nubra (New Broker Integration)**

* **Full broker integration** - Complete implementation from scratch
* Master Contract: Symbol format expiry fixed, common index symbol updated
* Orders: Place market order, limit order, smart order, modify order, cancel order, cancel all orders
* Position Book and Close All Position API
* Orderbook initial commit with SL and SL-M order support
* SL-M fix in orderbook
* Holdings: Average price fixed
* Tradebook and Holdings updated
* Quotes: NSE, NFO, BSE quotes and depth API updated
* Funds: Converted paise to rupees
* Margin Calculator API updated
* Multiquotes updated
* Historical API: Update, chunking method updated, F\&O data updated, removed unsupported segments
* WebSocket: Full implementation with rate limit compliance (429 handling + throttling), resource management and thread safety hardening
* Greeks WebSocket channel for OI data
* Normalized NSE and BSE index symbols
* Plugin JSON updated
* Added to all broker lists across install scripts and docs

**Zerodha**

* File descriptor leak fix in WebSocket adapter
* Comprehensive NSE and BSE index symbol mappings added
* Redundant BSE index mappings removed
* Normalize NSE\_INDEX and BSE\_INDEX symbols

**Dhan**

* File descriptor leak fix in streaming module
* Centralize teardown logic in adapter
* Normalize NSE\_INDEX and BSE\_INDEX symbols to Tradeboard standard format
* Error handling for inactive dataAPI subscription
* Show live LTP for closed positions
* Enrich positions with LTP from marketfeed API
* Use multiquotes service for position LTP enrichment
* Show symbol details in telegram alert for individual position close
* Add missing expiryCode to intraday and daily chart requests
* Correct WebSocket depth levels — only Dhan supports 20-depth
* Data subscription alert on broker select page

**Fyers**

* File descriptor leak fix in streaming adapters
* Add auto-reconnect to HSM WebSocket
* Add reconnection and health check to HSM WebSocket
* Normalize NSE\_INDEX and BSE\_INDEX symbols to Tradeboard standard format
* Remove BSE prefix fallback for unmapped BSE\_INDEX symbols
* Switch MCX and CDS master contracts from CSV to JSON format
* Fix NAN issue in Total P\&L (numeric rounding instead of string formatting)

**Angel**

* File descriptor leak fix and health check for WebSocket
* Normalize NSE\_INDEX and BSE\_INDEX symbols from name column
* Common Index (NSE & BSE) symbols update

**Flattrade**

* File descriptor leak fix in streaming adapters
* Address race conditions and thread cleanup issues in streaming
* Comprehensive NSE\_INDEX and BSE\_INDEX symbol mappings added

**Shoonya**

* Batched concurrent basket order execution
* Handle failed orders and batch execution errors
* Comprehensive NSE\_INDEX symbol mappings added

**Upstox**

* File descriptor leak prevention in streaming
* NSE\_INDEX and BSE\_INDEX symbol mappings added

**Groww**

* File descriptor leak fix in streaming module
* Optimize streaming and master contract download
* Update auth to use checksum-based flow instead of TOTP

**Kotak**

* Option chain LTP streaming fix — subscribe both depth and LTP streams

**AliceBlue**

* Prepend date to tradebook Filltime to fix Invalid Date display

**Zebu**

* Broker data issues fix (2 fixes)

***

#### Bug Fixes

**WebSocket & Streaming**

* Resolve critical file descriptor leaks in websocket\_proxy
* Improve resource cleanup and monitoring in websocket\_proxy
* Prevent event loop leak when WebSocket thread doesn't terminate
* Fix asyncio.run() error when running with eventlet in production
* Call \_resubscribe\_all() on PONG-based authentication
* Clear \_has\_index flag on index channel unsubscribe
* Prevent stale OHLCV quotes for index-only subscriptions
* Clean up quote subscription on unsubscribe and log subscription failures
* Prevent 429 rate limiting by using batch multiquotes instead of individual quote calls
* Resolve WebSocket market data not showing and reduce API polling
* Resolve stale auth cache causing 403 errors in WebSocket proxy
* Clear all caches in WebSocket proxy cache invalidation handler
* Remove noisy debug logging from WebSocket session helper
* Correct WebSocket depth levels — only Dhan supports 20-depth

**Frontend & UI**

* React #185 infinite loop fix in useOptionChainLive
* Remove usePageVisibility to prevent React error #185 infinite loop
* Option Chain table layout stability
* Option Chain performance and PlaceOrderDialog improvements
* PlaceOrderDialog: remove duplicate toast and symbol display
* PlaceOrder dialog: API endpoint, response handling, REST fallback
* Price field floating point precision issue
* Replace Radix Checkbox with custom visual to prevent infinite loop
* Update day selection UI for better accessibility and interaction
* Correct Latency Monitor link in dashboard Quick Access
* Permission status colors in analyzer mode (Profile page)
* Show real API key in TradingView and GoCharting webhook JSON
* Add error display in Search component for failed API calls
* Add toast category and HTTP status differentiation in Search error handling
* Use correct Holiday property in aria-label to fix TypeScript build
* Remove console.log from frontend
* Fix Console Error: 401 and "Invalid session" error
* Enhance P\&L calculations for live price updates in useLivePrice hook
* Preserve greeks OI across orderbook updates
* Fix F\&O filter performance by extracting underlying from Tradeboard symbol format

**Orders & Positions**

* Count only positions with non-zero quantity as "open"
* Replace ThreadPoolExecutor with sequential processing in optionsmultiorder
* Auto-detect stuck master contract downloads and enable Force Download
* Master contract status API response format for React frontend
* Use correct exchange mapping for index vs stock underlyings
* Telegram alerts on close positions
* Show symbol details in telegram alert for individual position close
* Auto-initialize analyzer funds on order placement to prevent 'Funds not initialized' error

**Backend & Server**

* Prevent database errors on fresh installation startup
* Clear all auth caches on login to prevent stale token 401 errors
* Initialize Python strategy scheduler at app startup
* Use local time (IST) instead of UTC for flow execution logs
* Increase strategy memory limit from 512MB to 1GB
* Resolve route conflict between Flask and React (health endpoint)
* Handle potential exception when retrieving swap memory metrics
* Remove excessive debug logging in expiry service
* Implement rate limiting for broker history API requests
* Add rate limiting to straddle history calls (3 req/sec)
* Fix FAQ route to serve React app instead of missing Jinja2 template
* Python strategy editor keyboard save (Ctrl+S) losing recent edits

**Docker & Installation**

* Prevent RLIMIT\_NPROC exhaustion in Docker and native installs
* Increase RLIMIT\_NPROC from 64 to 256 for multi-container deployments
* Add LLVMLITE\_TMPDIR to avoid noexec /tmp issues
* Auto-configure LLVMLITE/NUMBA paths for hardened Linux servers
* Resolve Gunicorn worker temp file error
* Add dynamic shm\_size based on system RAM (Windows and Linux)
* Add tmp directory for master contract downloads
* Increase proxy buffer size (nginx) for large auth headers
* Preserve .env during updates to prevent password invalidation
* Preserve custom CORS and CSP domains during updates and in install-docker.sh
* Use comma-separated CORS origins as expected by Flask-CORS
* Fix Windows batch script infinite loop and curl alias
* Fix REDIRECT\_URL broker placeholder replacement
* Replace fragile sed CSP\_CONNECT\_SRC logic with delete-and-append in Docker install scripts
* Add thread limiting env vars to multi-instance installer
* Add Docker support for numba/scipy dependencies in trading strategies
* Add numba/scipy support to production and remaining installation scripts
* Increase Gunicorn timeout for master contract database initialization and processing
* Increase systemd timeout and gunicorn worker timeout
* Proper TypeScript configuration for production and test environments
* Skip docker-build for fork PRs
* Use git add -f for ignored frontend/dist in CI

***

#### Security

* Upgrade Pillow to 12.1.1 (CVE security fix)
* Upgrade pip to 26.0.1 in uv.lock (CVE-2026-1703)
* Upgrade cryptography to 46.0.5 for ECDSA/ECDH subgroup validation vulnerability
* Upgrade axios to 1.13.5 (DoS via **proto**) and bump cffi to 2.0.0
* Upgrade protobuf to 6.33.5
* Override lodash-es to 4.17.23 for security patch
* Cap exponent size in flow math expressions to prevent DoS
* pyproject security fix

***

#### Performance

* Implement useMarketData options and prevent WebSocket zombie connections
* Reduce WebSocket execution engine startup log noise
* Reduce Python strategy startup log noise
* Change logging level from info to debug for various components
* Remove unnecessary logging for market holiday checks
* Increase httpx connection pool and Gunicorn workers (reverted to 1 worker for memory)
* Searchable underlying selector, filter test symbols, reduce log noise

***

#### Refactoring & Code Quality

* Remove Jinja2 frontend assets and legacy files
* Remove dead Jinja2 routes migrated to React
* Rename Flow Workflows to Flow Editor
* Apply Ruff formatting to Python codebase
* Stop tracking frontend/dist (CI/CD builds it)
* Replace logger.error with logger.exception in except blocks
* Add type hints to helper functions in restx\_api/ticker.py
* Refine type hints for validate\_and\_adjust\_date\_range
* Remove algomirror folder
* Remove .claude/settings.local.json from tracking

***

#### Documentation

* Comprehensive new broker integration guide with WebSocket proxy registration
* Comprehensive cache architecture audit (28+ caches)
* Update design docs and PRDs to reflect codebase changes since Jan 2026
* Broker API compatibility audit report
* WebSocket depth level compatibility added to broker audit
* WebSocket frontend management audit and integration guidelines
* Strategy Risk Management & Position Tracking PRD
* CI/CD and security audit report
* Docker resource configuration for Python strategies
* Docker Hub README
* Multi-instance Docker guide and update mode documentation
* Desktop Docker installation instructions
* Add Plotly as an interactive charting library for options analytics
* NSE\_INDEX and BSE\_INDEX symbol normalization test script
* Update CLAUDE.md for frontend/dist CI/CD changes
* Update install scripts with informative build messages

***

#### Dependencies

**Python**

* Bump the python-minor group with 69 updates
* pytest 8.4.2 → 9.0.2
* Pillow → 12.1.1
* cryptography → 46.0.5
* axios → 1.13.5
* cffi → 2.0.0
* protobuf → 6.33.5
* pip → 26.0.1
* lodash-es → 4.17.23 (override)
* numpy pinned to >=2.0,<2.4 (numba compatibility)
* logistro → 2.0.1
* Docker: gunicorn eventlet version update

**Frontend**

* jsdom 24.1.3 → 27.4.0
* Frontend deps group bump
* npm-root group with 3 updates

**CI/CD Actions**

* actions/checkout 4 → 6
* actions/setup-node 4 → 6
* astral-sh/setup-uv 3 → 7
* github/codeql-action 3 → 4
* actions/upload-artifact 4 → 6

***

#### Infrastructure

* Comprehensive CI/CD pipeline with Ruff linting, Docker Hub push, frontend auto-build
* Backend-lint configured to pass with pre-existing warnings
* Repair CI after Jinja2 cleanup
* Docker Hub build triggers
* Auto-build frontend dist via GitHub Actions
* Add .claude settings files to .gitignore

***

#### Contributors

Special thanks to all contributors who made this release possible:

* @Kalaiviswa (kalaivani) - WebSocket stability, Basket orders, Flow Editor, Index symbol normalization
* @rochronaldo (roch ronaldo) - Nubra broker integration
* @AravindGandavadi - Docker installation, CORS fixes, TypeScript configs
* @uttamsingh - Python strategy editor fix
* @kiranjv - Zebu broker data fixes
* @jabez4jc - Gunicorn timeout fixes
* @SubhAushSingh - Type hints improvements
* @Sadhanandhann - Expiry service and Dhan chart fixes
* @OriolMorros (Oriol Morros Vilaseca) - Accessibility and Search error handling
* @AlexZhonn - Frontend cleanup
* @slegarraga - Accessibility improvements
* @PremParkash - App.py update
* @HarshPrajapati - Logger refactoring

***

***

#### Links

* **Repository**: https://github.com/wesoftcorp/tradeboard-docs
* **Documentation**: https://docs.algo.wesoftcorp.com
* **Discord**: https://www.tradeboard.in/discord

***
