# Version 2.0.1.2 Released

**Date: 28th May 2026**

**Maintenance + Performance Release: Option Greeks Rust Core (`opengreeks`, \~13× Faster Chain Refresh with Bit-for-Bit Parity), WebSocket Self-Healing + Subprocess Isolation Under Gunicorn-Eventlet, an Accessibility Sweep, Broker Data-Quality Fixes (Dhan Holdings, Definedge, Kotak Indices), and a Security/Dependency Sweep (ws CVE-2026-45736, SDK 1.0.51 Connection Pooling, idna)**

This release spans 20+ commits since v2.0.1.1. It is a stabilisation and performance pass on top of the WhatsApp release. The headline change is the **option Greeks engine swap** — `py_vollib` is replaced by `opengreeks`, a Rust + PyO3 Black-76 core with byte-identical function signatures, bit-for-bit numerical parity, and a \~13× speedup on a full option-chain refresh. Alongside it, the **WebSocket layer self-heals** on stale broker auth tokens (no more container restart after a new-trading-day re-login) and now runs as an **isolated subprocess under gunicorn-eventlet** to escape the greenlet/real-thread lock-switching hazard. The frontend gets an **accessibility sweep** (aria-labels on 63 icon-only buttons, color-contrast fixes). Three broker data-quality bugs are fixed (Dhan `/holdings`, Definedge master contract, Kotak index quotes). On security, the `ws` npm transitive dependency is patched (CVE-2026-45736), the bundled **tradeboard SDK pin moves to 1.0.51** (a connection-pooling fix that prevents socket exhaustion in long-running strategies), and `idna` is bumped.

***

**Highlights**

* **Option Greeks Rust core — `opengreeks` replaces `py_vollib`** — The Black-76 backend for option Greeks and implied volatility is now a Rust + PyO3 core (`opengreeks==0.1.0`, NumPy-only runtime dep). Function signatures are byte-identical, so call sites change only their import path. Numerical parity is bit-for-bit on delta/gamma/theta/vega, float-64-last-bit on rho (7.9e-16), \~13 significant digits on IV. Pure-math speedups: implied volatility 46×, theta 28×, rho 19×, delta/vega/gamma 7–8×; a 40-option chain refresh (IV + 5 Greeks) drops **1.485 ms → 0.116 ms (\~12.8×)**. Every downstream consumer (IV Smile, Vol Surface, GEX, IV Chart, Straddle Chart, Flow, `/api/v1/optiongreeks`, `/api/v1/multioptiongreeks`, MCP) routes through `option_greeks_service.calculate_greeks()` and inherits the speedup with no further changes.
* **WebSocket self-heals on stale auth tokens (#1419)** — When a broker adapter returns or raises an auth error (401/403/token expired) on connect or subscribe, the `ConnectionPool` now clears cached tokens, calls `initialize(force=True)` to re-read from `auth_db`, and retries once. Removes the container-restart requirement after a new-trading-day re-login.
* **WebSocket proxy runs as a subprocess under gunicorn-eventlet (#1421, #1438)** — In-process WS + Flask under eventlet shares one process with the eventlet hub, so monkey-patched stdlib locks touched from both the hub and the WS asyncio thread trigger `greenlet.error: Cannot switch to a different thread` and silently corrupt WS state. The app now detects eventlet at runtime (`is_monkey_patched("socket")`) and spawns `python -m websocket_proxy.server` as a child process with no monkey-patching, so all locks are real OS primitives. Atexit handler SIGTERMs with a SIGKILL fallback; the child stays in the gunicorn cgroup so systemd reaps it on hard crash. The dev-server path (no eventlet) is unchanged.
* **Accessibility sweep** — `aria-label` added to 63 icon-only buttons across the app, and 9 color-contrast violations resolved on the home page.
* **Broker data-quality fixes** — **Dhan `/holdings`** now enriches each row with the real exchange (NSE/BSE, resolved via `securityId` probe) and LTP (batch `get_multiquotes`) instead of passing through the demat-wide `"ALL"` placeholder with blank price/P\&L (#1446). **Definedge** master contract had swapped `LotSize`/`TickSize` columns in `allmaster.csv` — now corrected (#1450, #1457). **Kotak** index quotes resolve for `MIDCPNIFTY` and other indices (#1436).
* **Security + dependency sweep** — `ws` npm transitive dependency patched for CVE-2026-45736 (uninitialized memory disclosure) via an `overrides` pin to `>=8.20.1` (resolves to 8.21.0); bundled `tradeboard` SDK pin `1.0.50` → `1.0.51` (connection-pooling fix); `idna` `3.11` → `3.15`; unused `scipy` pin dropped; `py_vollib==1.0.1` + `py_lets_be_rational==1.0.1` removed (superseded by `opengreeks`).
* **Platform version bump** — `2.0.1.1` → `2.0.1.2`. SDK pin (`tradeboard`) `1.0.50` → `1.0.51`.

***

**Option Greeks — Rust core deep dive**

`perf(greeks): replace py_vollib with opengreeks Rust core` — `8d973504`.

The Greeks/IV math previously ran on `py_vollib==1.0.1` (pure Python, backed by `py_lets_be_rational`). This release swaps it for `opengreeks==0.1.0`, a Rust + PyO3 implementation with a NumPy-only runtime footprint.

**Why it's a drop-in:** function signatures are byte-identical, so the migration touches only import paths in `services/option_greeks_service.py` (and `services/iv_chart_service.py`, `broker/dhan_sandbox/api/data.py`). Nothing about the public API or response shape changes.

**Numerical parity** (40-sample replay, NIFTY 26-MAY-2026 chain):

| Quantity                     | Abs error vs py\_vollib           |
| ---------------------------- | --------------------------------- |
| delta / gamma / theta / vega | 0.0e+00 (bit-for-bit identical)   |
| rho                          | 7.9e-16 (float-64 last bit)       |
| implied\_volatility          | 4.1e-13 (\~13 significant digits) |

**Pure-math speedup** (5000-rep median, ATM call):

| Function                                    | Before       | After        | Speedup   |
| ------------------------------------------- | ------------ | ------------ | --------- |
| implied\_volatility                         | 17.29 µs     | 0.38 µs      | 46.1×     |
| theta                                       | 5.79 µs      | 0.21 µs      | 27.7×     |
| rho                                         | 3.96 µs      | 0.21 µs      | 18.9×     |
| delta / vega / gamma                        | \~1.5 µs     | 0.21 µs      | 7–8×      |
| **40-option chain refresh (IV + 5 Greeks)** | **1.485 ms** | **0.116 ms** | **12.8×** |

**Migration evidence** is captured in `docs/benchmarks/` (baseline JSON + MD, post-migration JSON, parity + speedup report) and is reproducible via the new `scripts/bench_greeks_*.py` / `scripts/bench_parity_opengreeks.py` suite.

***

**WebSocket reliability**

`d077559f` bundles two fixes from @Kalaiviswa:

* **`fix(websocket): self-heal pool on stale auth-token failure (#1419)`** — `ConnectionPool` detects auth errors on connect/subscribe, clears cached tokens, re-initializes from `auth_db` with `force=True`, and retries once. The common symptom this kills: WS data silently stops after the \~3:00 AM IST broker token rollover until the operator restarts the container.
* **`fix(websocket): spawn WS proxy as subprocess under gunicorn+eventlet (#1421) (#1438)`** — Under eventlet, the WS asyncio thread and the eventlet hub share monkey-patched stdlib locks (logging `RLock`, socket.io lock, broker adapter `threading.Lock`), which can throw `greenlet.error: Cannot switch to a different thread` and corrupt WS state. The proxy now runs as a separate, un-monkey-patched child process when eventlet is active; the dev server (standard threading) is unchanged.

***

**Frontend + accessibility**

* `ce597e52` — `fix(a11y): add aria-label to 63 icon-only buttons`
* `7b2ab7c5` — `fix(a11y): resolve 9 color-contrast violations on home page`
* `bb147762` — `fix(frontend): silence vite build warnings`
* `da6a6826` — `fix(frontend): use automatic JSX runtime in vitest`
* `f0246d00` — `style(frontend): apply biome safe-fix cleanup`
* A `vite 7 → 8` / `@vitejs/plugin-react 5 → 6` bump (`0804b6ee`) was attempted and then **reverted** (`d4e881f0`); the toolchain remains on `vite ^7.3.2`.

***

**Broker fixes**

* `c3bb4436` — `fix(dhan): enrich /holdings with real exchange + LTP (#1446)` — Dhan's `/v2/holdings` returns `exchange="ALL"` for every row and omits LTP (only `avgCostPrice`). `map_portfolio_data` now resolves the real NSE/BSE exchange via a `securityId` probe and batch-fetches LTP via `get_multiquotes`, restoring the exchange badge, Avg Price/LTP, P\&L, and the real-time WebSocket subscription on the Investor Summary UI.
* `abbcd2ec` — `fix(definedge): correct swapped LotSize/TickSize columns in allmaster.csv (#1450) (#1457)`
* `3099a4e4` — `fix(kotak): resolve index quotes for MIDCPNIFTY and other indices (#1436)`
* `b4134b41` — `fix(whatsapp): make normalize_phone tolerate int phones, reject float/bool`

***

**Admin + infrastructure**

* `d5ee335f` — `fix(admin): handle Docker bind-mounted .env on MCP settings save (#1337)`
* `7e48b2e8` — `feat(scripts): add broker token extraction utility for self-hosted owners` (`scripts/extract_broker_token.py`)
* `a226839c` — `feat(examples): add PyPI download-stats comparator for Indian broker SDKs` (`examples/python/broker_sdk_downloads.py`)

***

**Tradeboard Python SDK 1.0.51 — connection pooling fix**

Released to PyPI alongside this version and pinned by the platform (`tradeboard==1.0.50` → `1.0.51`).

* **The problem:** every REST call (orders, quotes, funds, history, …) opened a brand-new TCP connection and discarded it. Over a full trading day that left thousands of sockets in `TIME_WAIT`, eventually exhausting the OS's ephemeral ports — often misread as a memory/RAM crash when the real cause was socket exhaustion.
* **The fix:** the SDK now reuses a single shared, connection-pooled HTTP client (keep-alive) across all REST calls instead of opening a fresh connection each time. The Strategy webhook sender got the same treatment.
* **What you get:** flat socket count all day (no port/socket exhaustion in long sessions), lower per-call latency (no repeated TCP/TLS handshake), lower CPU and kernel overhead, and clean shutdown via `client.close()` / context-manager support.
* **Note:** the reuse benefit is fully realized in production behind gunicorn (keep-alive). The local dev server closes connections per request, so the effect is less visible there.
* Available at [https://pypi.org/project/tradeboard/1.0.51/](https://pypi.org/project/tradeboard/1.0.51/).

***

**Security — `ws` CVE-2026-45736**

A moderate-severity Dependabot alert (GHSA-58qx-3vcg-4xpx, CVE-2026-45736 — uninitialized memory disclosure in `ws`) flagged a transitive npm dependency reachable through `socket.io-client → engine.io-client`, which pinned `ws: ~8.18.3` and so locked the resolution to the vulnerable 8.18.x line.

* Fix: added `"ws": ">=8.20.1"` to the existing `overrides` block in `frontend/package.json`; the lockfile now resolves `ws` to **8.21.0**. `npm install` reports **0 vulnerabilities**.
* No browser-bundle impact: `socket.io-client` uses the browser's native `WebSocket` in the React build, not the Node `ws` package — the override only affects the Node-side dependency graph and the lockfile that Dependabot scans.

***

**Dependencies**

* `opengreeks>=0.1.0` added — Rust + PyO3 Black-76 Greeks/IV core; NumPy-only runtime footprint. Replaces `py_vollib`.
* `py_vollib==1.0.1` and `py_lets_be_rational==1.0.1` **removed** (superseded by `opengreeks`).
* `tradeboard` SDK pin: `1.0.50` → `1.0.51` (PyPI: [https://pypi.org/project/tradeboard/1.0.51/](https://pypi.org/project/tradeboard/1.0.51/)) — connection-pooling fix.
* `idna` `3.11` → `3.15`.
* `scipy` — unused pin dropped (`a1eca63b`).
* `ws` (npm, transitive) → `>=8.20.1` override, resolves to 8.21.0 (clears Dependabot alert 180 / CVE-2026-45736).

***

**Configuration changes**

`pyproject.toml`:

* `version = "2.0.1.2"`
* `opengreeks>=0.1.0` added; `py_vollib==1.0.1` + `py_lets_be_rational==1.0.1` removed
* `tradeboard==1.0.50` → `tradeboard==1.0.51`
* `idna==3.11` → `idna==3.15`
* unused `scipy` pin removed

`utils/version.py`:

* `VERSION = "2.0.1.2"`

`requirements.txt` + `requirements-nginx.txt`:

* `opengreeks==0.1.0` added; `py_vollib` / `py_lets_be_rational` removed
* `tradeboard==1.0.50` → `tradeboard==1.0.51`
* `idna==3.11` → `idna==3.15`

`frontend/package.json`:

* `overrides` gains `"ws": ">=8.20.1"`

***

**Upgrade procedure**

**For existing installs (Native Ubuntu):**

```bash
cd /var/python/tradeboard-flask/<deploy-name>/tradeboard
sudo ./install/update.sh
# update.sh runs migrate_all.py. No schema migration is required for this
# release; uv sync pulls opengreeks and drops py_vollib automatically.
```

**For existing installs (Docker):**

```bash
cd /opt/tradeboard/<domain>
sudo docker compose pull
sudo docker compose up -d
```

**For local developers (uv):**

```bash
git pull origin main
uv sync
# Frontend: a plain pull already ships the CI-built dist. Only rebuild if
# you are editing React code:
cd frontend && npm install && npm run build
uv run app.py
```

There are no new environment variables and no database schema changes in this release.

***

**Contributors**

* **@marketcalls (Rajandran)** — release management; option Greeks Rust-core migration (`py_vollib` → `opengreeks`) with parity + speedup benchmark suite; Dhan `/holdings` exchange + LTP enrichment (#1446); Kotak index-quote resolution (#1436); accessibility sweep (63 aria-labels + color-contrast fixes); frontend build-warning cleanup and biome safe-fixes; Docker bind-mounted `.env` handling on MCP settings save (#1337); broker token extraction utility and PyPI download-stats example; dependency + security sweep (ws CVE-2026-45736 override, SDK 1.0.51 connection-pooling pin, idna bump, scipy drop); tradeboard Python SDK 1.0.51 release.
* **@Kalaiviswa** — WebSocket self-heal on stale auth-token failure (#1419) and WS-proxy subprocess isolation under gunicorn-eventlet (#1421, #1438).
* **Community** — Definedge `allmaster.csv` LotSize/TickSize fix (#1450, #1457).

***

**Links**

* **Repository**: [https://github.com/wesoftcorp/tradeboard-docs](https://github.com/wesoftcorp/tradeboard-docs)
* **Documentation**: [https://docs.algo.wesoftcorp.com](https://docs.algo.wesoftcorp.com)
* **Python SDK on PyPI**: [https://pypi.org/project/tradeboard/1.0.51/](https://pypi.org/project/tradeboard/1.0.51/)
* **Discord**: [https://www.tradeboard.in/discord](https://www.tradeboard.in/discord)
* **Issue tracker**: [https://github.com/wesoftcorp/tradeboard-docs/issues](https://github.com/wesoftcorp/tradeboard-docs/issues)
