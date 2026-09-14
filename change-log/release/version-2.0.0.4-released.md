# Version 2.0.0.4 Released

**Date: 16th Apr 2026**

**Feature Release: Exchange-Aware /python Strategies, Event-Driven Dashboard, Compound Rate Limits, Structured Error Logging & Broker Fixes**

This is a feature release featuring **41 commits** (excluding auto-builds) from **6 contributors**, focused on making /python strategy hosting exchange-aware with per-strategy holiday calendars, replacing polling with event-driven SocketIO refresh across trading pages, adding structured JSON error logging, sandbox performance optimization, compound rate limit support, and broker-specific fixes for Motilal, Groww, Zebu, Flattrade, and Definedge.

***

**Highlights**

* **Exchange-Aware /python Strategies** — Each strategy now carries its own exchange (NSE/BSE/NFO/BFO/MCX/BCD/CDS/CRYPTO). The host gates start/stop using that exchange's holiday calendar — MCX strategies keep running on NSE/BSE holidays during the MCX evening session, CRYPTO strategies ignore all holidays, and SPECIAL\_SESSION entries (Muhurat, DR-drill) override weekend rejects. No migration needed for existing strategies.
* **Event-Driven Dashboard & Trading Pages** — Dashboard, OrderBook, TradeBook, Positions, and Holdings now refresh instantly via SocketIO events instead of polling every 30 seconds. Faster updates, less server load.
* **Compound Rate Limits** — Rate limit settings now support Flask-Limiter's compound syntax (e.g., `"10 per second;40 per minute"`), matching broker-specific API limits like Flattrade's order rate.
* **Structured JSON Error Log** — New `log/errors.jsonl` with timestamped JSON entries containing full traceback, logger name, source file:line, and Flask request context for every ERROR+ event.
* **Sandbox Performance Optimization** — Basket orders, split orders, and options multi-orders now pre-fetch quotes in bulk via multiquotes — fewer API calls, faster paper trading execution.
* **Motilal Broker Fixes** — MARKET/SL-M order handling, get\_holdings, tick\_size, WebSocket FD/thread leak fixes, and shared NSE\_INDEX/BSE\_INDEX symbol normalization.
* **Eventlet asyncio Guard** — Real OS threads for asyncio event loops under eventlet, plus runtime event loop guards for Zebu, Flattrade, and Definedge to prevent `asyncio.run()` crashes in Docker.

***

**New Features**

**Exchange-Aware /python Strategy Hosting**

* Each strategy picks its own exchange via a new UI dropdown (NSE/BSE/NFO/BFO/MCX/BCD/CDS/CRYPTO)
* Host gates start/stop using the strategy's exchange holiday calendar, not a hardcoded NSE check
* MCX strategies run on NSE/BSE holidays during MCX's per-date session window (e.g., 17:00-23:55 on 14-Apr-2026)
* CRYPTO strategies run 24/7, skip all holiday checks
* SPECIAL\_SESSION rows (Sunday Muhurat, Saturday DR-drill) override weekend rejects per-exchange
* `is_within_schedule_time` intersects user's schedule with the exchange's effective session window
* New `TRADEBOARD_STRATEGY_EXCHANGE` env var injected into every strategy subprocess
* Legacy strategies auto-backfilled to `exchange=NSE` on first load — zero migration required
* Exchange badge displayed on the strategy card in the /python dashboard
* Smart defaults on upload: CRYPTO pre-fills 24/7 + all 7 days, MCX pre-fills 09:00-23:55
* Resource limits guide (`strategies/RESOURCE_LIMITS.md`) documenting per-strategy memory, FD, CPU, and log caps

**Event-Driven Dashboard Refresh**

* Replace 30-second polling with SocketIO event-driven refresh on Dashboard
* Replace polling with event-driven refresh on OrderBook, TradeBook, Positions, Holdings, and Funds pages
* Type `ORDER_BOOK_EVENTS` as `OrderEventType[]` and wire into `useOrderEventRefresh`

**Structured Error Logging**

* New `log/errors.jsonl` — structured JSON Lines, ERROR+ only, with timestamp, module, source file:line, traceback, and Flask request context
* Replace all manual `traceback.print_exc()` with `logger.exception()` across REST API, brokers, and websocket\_proxy
* Add missing error logging to silent exception handlers

**Compound Rate Limits**

* Support semicolon-delimited compound rate limits in `.env` validation (e.g., `ORDER_RATE_LIMIT="10 per second;40 per minute"`)
* Updated `.sample.env` and rate-limiting documentation with compound syntax examples

**Sandbox Performance**

* Pre-fetch quotes via multiquotes for sandbox basket orders
* Pre-fetch quote once for sandbox split orders
* Pre-fetch quotes via multiquotes for sandbox options multiorder

***

**Bug Fixes**

* Fix: correct `get_open_position` exchange match in Groww smart orders (#1255)
* Fix: clean up `logs_session` for non-banned IPs in SecurityMiddleware (#1256)
* Fix: platform-aware health monitor FD thresholds + null-safe UI
* Fix: move startup banner to print when server is actually ready
* Fix: set HOME in systemd service so Telegram `/chart` works on Linux
* Fix: revert StaticPool to NullPool and fix missing datetime import (SQLite connection handling)
* Fix: duplicate rows on sort in TradeBook; use ArrowUp/ArrowDown for sort indicators
* Fix: add missing `HEALTH_DATABASE_URL` to `.sample.env` and `install-multi.sh`

**Broker Fixes**

* Motilal: MARKET/SL-M order handling, get\_holdings, tick\_size, plug FD/thread leaks in WebSocket adapter, shared NSE\_INDEX/BSE\_INDEX symbol normalization (#1259)
* Zebu/Flattrade/Definedge: auto-detect eventlet to prevent `asyncio.run()` crash in Docker
* Runtime event loop guard for async batch quotes across brokers
* Real OS threads for asyncio event loops under eventlet (websocket proxy + client)

**/python Strategy Fixes**

* Inject documented env vars (`TRADEBOARD_API_KEY`, `STRATEGY_ID`, `STRATEGY_NAME`) into strategy subprocess (#1247)
* Improve reliability and FD hygiene for long-running strategies (#1258)
* Document `.env` inheritance for strategies and fix `TRADEBOARD_API_KEY` references
* Rewrite `/python/guide` with exchange-aware scheduling, env vars, and updated sample strategy

***

**Frontend Enhancements**

* Client-side sorting for TradeBook and OrderBook (#1240)
* Exchange dropdown and badge in /python strategy pages
* CRYPTO smart-defaults (24/7 + all 7 days) on strategy upload

***

**Documentation**

* Resource limits guide (`strategies/RESOURCE_LIMITS.md`) — per-strategy memory, FD, CPU, process, and log limits with realistic usage numbers and server sizing table
* Updated `strategies/README.md` — exchange-aware gating, env var precedence (`HOST_SERVER` vs `TRADEBOARD_HOST`), worked examples (14-Apr-2026, Sunday Muhurat), troubleshooting, and migration notes
* Enhanced `CLAUDE.md` with architectural context for Claude Code
* Updated rate-limiting docs with compound syntax

***

**Security**

* Update pillow, pytest, follow-redirects for dependabot alerts
* Compound rate limit support prevents misconfigured single-limit workarounds

***

**Contributors**

Special thanks to all contributors who made this release possible:

* @marketcalls (Rajandran) — Exchange-aware /python strategies, event-driven dashboard, sandbox optimization, structured error logging, compound rate limits, version management
* @Kalaiviswa (Kalaivani) — Eventlet asyncio guards, Zebu/Flattrade/Definedge fixes, /python guide rewrite, real OS thread migration
* @iAbhi001 — Client-side sorting for TradeBook and OrderBook
* @Sadhanandhann — StaticPool investigation for traffic logs DB
* @mvanhorn (Mallikharjuna) — Replace traceback.print\_exc() with logger.exception() across brokers

***

**Upgrade**

```bash
# Pull latest
cd /path/to/tradeboard
git pull origin main

# Sync dependencies
uv sync

# Rebuild frontend (if running locally)
cd frontend && npm install && npm run build && cd ..

# Restart
# Docker: docker compose down && docker compose up -d
# Systemd: sudo systemctl restart tradeboard
```

For existing /python strategies trading MCX or CRYPTO: open each strategy → Schedule → pick the correct exchange from the new dropdown → Save. NSE strategies need no changes.

***

**Links**

* **Repository**: [https://github.com/wesoftcorp/tradeboard-docs](https://github.com/wesoftcorp/tradeboard-docs)
* **Documentation**: [https://docs.algo.wesoftcorp.com](https://docs.algo.wesoftcorp.com)
* **Discord**: [https://www.tradeboard.in/discord](https://www.tradeboard.in/discord)

***
