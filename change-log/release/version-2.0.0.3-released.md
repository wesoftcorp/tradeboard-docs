# Version 2.0.0.3 Released

#### Version 2.0.0.3 Released

**Date: 13th Apr 2026**

**Feature Release: Async-to-Sync WebSocket Migration, Market Price Protection (MPP), Samco 2FA, Shoonya OAuth, Multi-Device Session Tracking & Security Hardening**

This is a feature release featuring **59 commits** (excluding auto-builds) from **7 contributors**, focused on migrating broker WebSocket adapters from asyncio to sync for Docker/eventlet compatibility, Market Price Protection (MPP) for Zerodha/Kotak/Samco/Tradejini, Samco 2FA authentication, Shoonya OAuth migration, multi-device session tracking, Telegram bot enhancements, and security hardening.

***

**Highlights**

* **Async-to-Sync WebSocket Migration** — Converted Zerodha, Upstox, and mstock streaming adapters from asyncio `websockets` to sync `websocket-client`, eliminating greenlet conflicts in Docker (Gunicorn + eventlet) deployments
* **Market Price Protection (MPP)** — Added automatic MARKET/SL-M to LIMIT/SL conversion with MPP for Zerodha, Kotak, Samco, and Tradejini, protecting traders from extreme price slippage
* **Samco 2FA Authentication** — Complete Samco 2FA implementation with OTP, secret key, IP management, and order status normalization
* **Shoonya OAuth Migration** — Migrated Shoonya from TOTP login to OAuth (GenAcsTok) authentication with WebSocket and SL-M MPP fixes
* **Multi-Device Session Tracking** — Session resume support across devices with active session monitoring and login activity tracking
* **Telegram Bot Commands** — New `/closeall` and `/mode` Telegram commands for remote position management and mode switching
* **Dynamic Browser Tab Titles** — All 80+ pages now show descriptive titles in browser tabs (e.g., "OI Tracker | Tradeboard")
* **Synthetic Future API Optimization** — Reduced broker API calls from 4+ to 2 using multiquotes batching, cutting Dhan response time from \~8s to \~2s
* **Multi-Arch Docker Images** — CI/CD now builds both amd64 and arm64 Docker images on native runners
* **Security Patches** — Updated cryptography, axios, vite, Pygments, and lodash-es for CVE fixes

***

**New Features**

**Async-to-Sync WebSocket Migration**

* Convert Zerodha streaming from async websockets to sync websocket-client
* Convert Upstox streaming from async websockets to sync websocket-client
* Convert mstock streaming from async websockets to sync websocket-client
* Reset Upstox and mstock reconnect counters on successful connection

**Market Price Protection (MPP)**

* Enable market protection for Zerodha market orders with decimal strike preservation
* Add MPP for Kotak market orders (MARKET → LIMIT, SL-M → SL with tick-based price protection)
* Convert MARKET/SL-M orders to LIMIT/SL with MPP for Samco
* Add MPP and fix orderbook status mapping for Tradejini
* Guard `trigger_price` float conversion in SL-M MPP handler

**Samco 2FA Authentication**

* Implement Samco 2FA authentication with OTP, secret key, and IP management
* Refactor Samco 2FA to auth table with `aux_param` columns
* Fix order status normalization for Cancel/Modify buttons in orderbook
* Resolve FD leaks and resource issues in Samco WebSocket streaming
* Use equity segment only for Samco funds to avoid double-counting

**Shoonya OAuth Migration**

* Migrate Shoonya from TOTP login to OAuth (GenAcsTok) authentication
* Fix Shoonya WebSocket, SL-M MPP conversion, and circular import
* Fix review issues: input validation, null safety, log redaction

**Multi-Device Session & Login Activity**

* Multi-device session resume and active session tracking
* Login activity tracking and security dashboard tabs
* Resolve file descriptor and memory leak from uncleaned database sessions

**Telegram Bot Enhancements**

* Add `/closeall` and `/mode` Telegram bot commands for remote trading control
* Fix `/chart` rendering in Docker and eventlet environments

**Frontend Enhancements**

* Dynamic browser tab titles for all 80+ pages (#881)
* Copy and download buttons for Python strategy logs (#1233)
* Add aria-labels to TradeBook buttons for accessibility (#1189)

**Tradejini Broker Improvements**

* Add index symbol normalization and fix WebSocket exchange mapping
* Prevent WebSocket FD leaks in quotes, depth, and streaming
* Add MPP and fix orderbook status mapping

**Smart Order Optimization**

* Remove 500ms smart order delay, add position cache + per-symbol lock for faster execution

**Infrastructure**

* Build multi-arch Docker images (amd64 + arm64) on native runners
* Replace `traceback.print_exc()` with `logger.exception()` across all REST API endpoints (#1012)

***

**Bug Fixes**

* Fix: prevent duplicate order execution race condition in sandbox mode
* Fix: optimize synthetic future API — reduce broker API calls from 4+ to 2 using multiquotes (#855)
* Fix: return mock response object instead of None for MPP ValueError
* Fix: address cubic-dev P1 issues in order\_api and auth\_api
* Fix: IIFL Capital index symbol normalization and quotes update
* Fix: add IIFL Capital to install script files
* Fix: add missing security headers to Flask responses (#1014)
* Fix: standardize error logging with `logger.exception()` (#1017)
* Fix: adjust font sizes and cell heights in seasonality heatmap
* Fix: refine monthly data fetching and processing in seasonality
* Fix: update tradeboard SDK to 1.0.47, remove numba/llvmlite dependencies

***

**Security**

* Bump cryptography to 46.0.7 (security patch)
* Bump vite to 7.3.2 (security patch)
* Bump axios to 1.15.0 (security patches)
* Upgrade cryptography, Pygments, and lodash-es for security

***

**Contributors**

Special thanks to all contributors who made this release possible:

* @Kalaiviswa (kalaivani) — Async-to-sync WebSocket migration (Zerodha, Upstox, mstock), Tradejini MPP/FD fixes, Shoonya OAuth migration, Samco 2FA, multi-device session tracking
* @marketcalls — Synthetic future optimization, browser tab titles, strategy log buttons, Telegram commands, smart order optimization, seasonality fixes
* @Na1neeth (Navaneeth) — Samco 2FA authentication and WebSocket FD fixes
* @Chessing234 (Taksh) — Security headers and error logging standardization
* @LuckyAnsari22 — Database docstrings, TradeBook accessibility
* @mvanhorn — Replace traceback.print\_exc() with logger.exception()

***

**Links**

* **Repository**: [https://github.com/wesoftcorp/tradeboard-docs](https://github.com/wesoftcorp/tradeboard-docs)
* **Documentation**: [https://docs.algo.wesoftcorp.com](https://docs.algo.wesoftcorp.com)
* **Discord**: [https://www.tradeboard.in/discord](https://www.tradeboard.in/discord)

***
