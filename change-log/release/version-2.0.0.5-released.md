# Version 2.0.0.5 Released

## Version 2.0.0.5 Released

**Date: 23rd Apr 2026**

**Feature Release: Strategy Builder, Multi-Strike OI Chart, Market-Agnostic Trading Window, Plotly Partial Bundle & Broker Fixes**

This is a feature release featuring **40 commits** (excluding auto-builds) from **3 contributors**, focused on a full-featured multi-leg Strategy Builder under /tools (payoff/Greeks/live P\&L with saved portfolios), two new chart tabs (Strategy Chart + Multi Strike OI), a market-agnostic last-N-trading-days date window used across every historical-chart tool, a 75%-smaller Plotly bundle, security hardening, and broker-specific fixes for Firstock, Zerodha, Flattrade, and Shoonya.

***

**Highlights**

* **Strategy Builder (new /tools feature)** — Build multi-leg option strategies from 40+ templates or manually, with live Greeks, payoff diagram, what-if simulators (spot %, IV %, days-elapsed), moneyness labels, live P\&L streaming via shared WebSocket, true max-profit/max-loss computation, and saved Portfolio (MyTrades + Simulation watchlists). Zerodha basket-margin fix included so the margin row populates correctly.
* **Strategy Chart & Multi Strike OI Tabs** — Two new tabs in the Strategy Builder: a historical combined-premium time series (`|Σ sign × close|` — absolute net credit/debit, qty-independent) with underlying overlay and IST-aware tooltips; and a per-leg OI overlay with distinct palette, per-series legend toggles, and live auto-refetch on leg add/remove. Both gracefully degrade when the broker doesn't serve intraday candles for index tokens (e.g., Zerodha 1m on NIFTY).
* **Market-Agnostic Last-N-Trading-Days Window** — `/strategybuilder`, `/straddle`, `/ivchart`, `/straddlepnl`, and `/oiprofile` now fetch a generous calendar window and post-filter the returned series to the **last N distinct trading dates that actually have data**. Queries at 02:16 IST (after midnight, market closed) correctly yield 3 full trading days instead of 2 days + an empty today. Same logic works for NSE/BFO/MCX/CDS/crypto without hardcoding any session-close time.
* **Plotly Partial Bundle (75% first-load reduction)** — Replaced the full `plotly.js-dist-min` with two custom builds: `plotly-2d` (scatter/bar/candlestick — 6 tools) and `plotly-3d` (surface — VolSurface only). First-time chart-tool download drops from **1.48 MB gzip → \~385 kB gzip** for 2D tools; shared `plotly.js/lib/core` is deduped into a cached vendor chunk.
* **F\&O Stock Coverage in Strategy Builder** — Index/Stock dropdown now populates every F\&O stock (RELIANCE, TCS, HDFCBANK, …) in addition to indices, sourced from the same API as the Option Chain page.
* **Zerodha History Performance** — Daily-interval history now requests in 2000-day chunks (instead of 60-day chunks used for intraday). Massively fewer API calls for multi-year backfills in Historify.
* **Firstock V1.7 Alignment** — Order/position bug fixes, basket margin via `/V1/basketMargin`, WebSocket migration to V2 with unwrapped V2 tick format, FD-leak-free lifecycle.

***

**New Features**

**Strategy Builder (/strategybuilder)**

* 40+ pre-built strategies across Bullish / Bearish / Non-Directional families — long/short call/put, spreads, butterflies, condors, straddles/strangles, iron fly/condor, ratio spreads, jade lizard, calendars, diagonals, Batman, double fly/condor, and more
* Manual leg builder with option and future segments, multi-expiry leg support (for calendars/diagonals)
* Live Greeks per leg (delta, gamma, theta, vega, IV) via batched `/multioptiongreeks`
* Payoff chart: "At Expiry" + "T+0" curves with ±σ shading, true max-profit / max-loss / breakevens
* What-if simulators: spot-shift %, IV-shift %, days-forward (capped to nearest leg's expiry)
* Per-leg moneyness labels (ATM, ITM1–ITM50, OTM1–OTM50)
* Live P\&L streaming via shared WebSocket — ticks only re-render the P\&L tab, not Greeks / payoff / positions panel
* Opstra-style per-leg active checkbox — unchecked legs excluded from payoff / Greeks / P\&L analysis
* Auto-refresh entry price on leg edits, per-leg lot ratios preserved from templates
* Broker margin integration with Zerodha basket-margin fix so the Margin row displays correctly
* Save / Update strategy to two fixed watchlists: **MyTrades** and **Simulation**, with live portfolio P\&L streaming

**Strategy Chart Tab**

* Historical combined-premium series: `net_premium(t) = Σᵢ (signᵢ × priceᵢ(t))`, plotted as `| net_premium(t) |` (always positive, qty-independent)
* Static credit/debit tag derived once from entry premia
* Underlying overlay on left axis; combined premium on right axis
* IST-aware `tickMarkFormatter` and tooltip with timestamp
* Enable/disable toggles for both Underlying and Strategy series
* Debounced auto-refetch (300 ms) on leg add/remove/toggle/side-flip — no manual refresh
* Graceful degradation when broker returns empty underlying candles (e.g., Zerodha 1m index) — chart renders with a blue banner; P\&L curves from leg history still show

**Multi Strike OI Tab**

* One OI series per active option leg on the right axis; underlying close on the left
* Stable 10-colour palette keyed by leg symbol (survives reorders)
* Human-readable legend labels: `NIFTY 28 APR 24500 CALL`
* Tooltip lists every visible series with `L` / `Cr` OI formatting
* Per-series and underlying toggles via the legend
* Warns if the broker doesn't report historical OI for the selected legs

**Other Tools**

* Tools exchange picker restricted to **NFO / BFO** (+ CRYPTO for crypto brokers) to prevent invalid combinations

***

**Performance**

* **Plotly partial bundles** — 6 tools now pull only scatter/bar/candlestick (no 3D engine); VolSurface stays in its own 3D chunk. First-visit Plotly download drops from **1,477 kB gzip to \~385 kB gzip (≈74% smaller)** for 2D tools, \~543 kB gzip for VolSurface (≈63% smaller). Shared `plotly.js/lib/core` is cached after the first Plotly-page visit.
* **Zerodha daily history chunking** — daily-interval requests now use 2000-day chunks (Kite's documented per-request limit), preserving 60-day chunks for intraday. Cuts multi-year backfill API calls by \~33×.
* **Strategy Builder UI** — split P\&L columns and stopped live-tick layout jitter; scoped live-price re-renders so unrelated tabs don't repaint on ticks.

***

**Bug Fixes**

**/strategybuilder / tools**

* Compute true max-profit / max-loss for the payoff table (not just sample maxima)
* Tighten payoff chart x-axis to ±10% around spot
* Reshape calendar-family template icons
* Remove duplicate close button in TemplateDialog
* Preserve per-leg lot ratios when applying templates
* Sequence symbol-switch fetches to avoid a stale-underlying race on the broker
* Switch to shadcn `Checkbox` so Biome a11y lint passes in CI
* Silence Biome `useSemanticElements` on StrategyPortfolio row

**Broker Fixes**

* Firstock: align with V1.7 API, fix order/position bugs, migrate WebSocket to V2 endpoint with V2 tick unwrapping, overhaul WS lifecycle to close FD leaks (#1285)
* Firstock: basket margin calculator via `/V1/basketMargin`, demote per-tick / per-chunk logs from info to debug (#1288)
* Flattrade: switch margin calculator from `SpanCalc` to `GetBasketMargin` (#1279)
* Shoonya: switch margin calculator from `SpanCalc` to `GetBasketMargin`
* Zerodha: 2000-day chunks for daily history (60 for intraday)

**Security**

* Refuse dev-server startup when `FLASK_DEBUG=true` is paired with a non-loopback bind
* Bind ZeroMQ message bus to loopback only (prevents raw tick-feed exposure on public IPs)
* Drop idle unauthenticated WebSocket clients
* Force `protocol-buffers-schema >= 3.6.1` to patch prototype-pollution vulnerability

**Auth / Login / Install**

* Rate-limited login no longer falsely shows "Login successful" and redirects to `/broker`
* Add `/socket.io/` nginx block in `install.sh` to prevent SocketIO session drops behind the reverse proxy

**Flow**

* Restore ConfigPanel scroll by adding `min-h-0` to `ScrollArea` (#1277)

**Tools Date-Window Correctness**

* `/straddle`, `/ivchart`, `/straddlepnl`, `/oiprofile` previously returned 2 trading days of data when queried at night/pre-market for `days=3`. All four now share the `_resolve_trading_window` + `_cap_last_n_trading_dates` helpers from `strategy_chart_service` so the cap counts actual returned dates rather than a hardcoded session close.
* `/straddlepnl` simulation loop now iterates only the last N distinct trading days so `pnl_series`, `trades`, and `summary` all stay consistent with the chart range.

***

**Frontend Enhancements**

* All F\&O stocks populated in the Strategy Builder Index/Stock dropdown (not just major indices)
* Save / Portfolio actions colocated above the payoff tabs — no scroll-to-top required
* Opstra-style per-leg active checkbox with unchecked-leg exclusion from analysis
* Moneyness labels (ATM/ITM/OTM with step count) on every leg row
* Live-streaming portfolio P\&L on the Strategy Portfolio page

***

**Documentation & Examples**

* cURL request examples added to every endpoint page of the API docs
* Phased implementation plan for GTT orders (`docs/plans`)
* NIFTY 50 YTD 2026 heatmap example
* NIFTY 50 YTD gainers/losers ranking example (via Historify DuckDB)

***

**Dependencies**

* Bump 17 Python packages, including `python-multipart 0.0.26` (closes GHSA-59g5-xgcq-4qw3)
* `actions/download-artifact`: 6 → 8 (#1270)
* `protocol-buffers-schema`: pinned ≥ 3.6.1 (security)
* `.gitignore`: DuckDB WAL files

***

**Contributors**

Special thanks to everyone who made this release possible:

* **@marketcalls (Rajandran)** — Strategy Builder (full feature + portfolio + live P\&L + \~18 follow-on fixes), Strategy Chart and Multi Strike OI tabs, market-agnostic trading-day window across 5 services, Plotly partial bundle (75% first-load reduction), F\&O stock dropdown, security hardening (dev-server bind guard, ZMQ loopback, WS idle drop), Zerodha daily-history chunking, install.sh SocketIO block, version management
* **@Kalaiviswa (Kalaivani)** — Firstock V1.7 API alignment + V2 WebSocket migration + FD-leak fixes, Firstock/Flattrade/Shoonya basket-margin calculators, GTT orders phased plan
* **@sivamudusu** — Flow ConfigPanel scroll restoration (#1277)

***

**Upgrade**

```bash
# Pull latest
cd /path/to/tradeboard
git pull origin main

# Sync dependencies
uv sync

# Run the app
uv run app.py

# Restart
# Docker: docker compose down && docker compose up -d
# Systemd: sudo systemctl restart tradeboard
```

No migration required. The Strategy Builder is automatically available under **Tools → Strategy Builder** after restart, and existing tools (`/straddle`, `/ivchart`, `/straddlepnl`, `/oiprofile`) will now return the correct N trading days of data without any configuration change.

***

**Links**

* **Repository**: [https://github.com/wesoftcorp/tradeboard-docs](https://github.com/wesoftcorp/tradeboard-docs)
* **Documentation**: [https://docs.algo.wesoftcorp.com](https://docs.algo.wesoftcorp.com)
* **Discord**: [https://www.tradeboard.in/discord](https://www.tradeboard.in/discord)
