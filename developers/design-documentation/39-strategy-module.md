# 39 - Strategy RMS Engine

## Purpose

The Strategy RMS Engine is Tradeboard's durable strategy execution subsystem. It owns multi-leg batch strategies and signal-driven strategies, their broker orders, risk state, recovery data, and operator audit trail. It is separate from Chartink, Flow, Python-hosted strategies, and ordinary REST order placement, even though all eventually use the broker integration layer.

## Entry Surfaces

| Surface | Authentication | Responsibility |
|---|---|---|
| Browser `/strategy` | User session and CSRF controls | Create/edit configuration, enable live, rotate a webhook token, operator controls, detail views |
| RESTX `/api/v1/strategy/*` | Tradeboard API key | Lifecycle actions and read-only strategy/run/order/event access |
| Public `POST /strategy/webhook/<token>` | High-entropy URL token | External batch and signal alerts |

RESTX cannot create a strategy, enable live mode, rotate a token, or delete a strategy. The webhook takes no API key. Its token is stored only as a SHA-256 digest and shown to the operator only at creation or rotation.

## Model And Lifecycle

Strategies have a `batch` or `signal` kind. A batch run resolves all configured legs and enters them together, then responds to `start`/`stop`. A signal run accepts exactly one leg transition at a time: `long_entry`, `long_exit`, `short_entry`, or `short_exit`.

The engine keeps durable strategy, leg, run, order, checkpoint, and event records. A position owner is identified by an exact `position_ref`; a signal flip may additionally retain one outgoing `superseded` owner until it is confirmed flat. The engine never treats a leg id or broker symbol alone as enough identity to close exposure.

### Order invariant

1. Write a pending strategy-order intent before broker dispatch.
2. Dispatch the order.
3. Persist the acknowledgement against that exact pending row.
4. Apply broker updates and terminal fills idempotently to that owner.

If a broker fills synchronously before the acknowledgement is recorded, the engine holds an unmatched update briefly and replays it as soon as the durable row is linked. If acknowledgement persistence remains unavailable, the intent row and a critical `order_ack_unrecorded` event remain for reconciliation; the engine does not place a duplicate order to repair it.

### Exit invariant

An accepted broker exit is not terminal. The engine records a pending stop, submits MARKET exits for exact filled owners, and retains the run's subscription and risk management until fills prove every owner flat. An unfilled entry is not exited at configured quantity because the opposite order could create naked exposure if the entry later cancels. A rejected or cancelled exit becomes retryable; it must not strand a claim or finalise a run.

Confirmed-flat finalisation atomically writes the run stop fields, releases the strategy's current run, and calculates final realised P&L from durable fill and ownership evidence. An overall target/stop is the trigger reason; the eventual realised P&L can differ because exits fill at market.

## Risk And Price Inputs

The run state evaluates per-leg SL, target, trailing, overall MTM SL/target, lock profit, trail-to-entry, scheduler square-off, expiry, and daily-loss limits. It consumes one latest-known LTP mark per symbol. WebSocket marks are preferred while current; polling is used as a fallback when the WebSocket input is stale. A stale mark never silently wins over a live recovered source.

RMS work uses run-scoped state locks for in-memory transitions only. Database and broker I/O happen outside those locks so an eventlet worker cannot block other strategy state transitions on a slow broker or SQLite operation.

## Recovery And Reconciliation

On startup the recovery path rebuilds open-run owners from durable strategy orders, then validates checkpoints only when their owner shape and quantities match the rebuild. Order/fill evidence has authority over a stale checkpoint. Ambiguous or unpriced exposure stays open and reserved for manual reconciliation rather than being guessed flat or valued as zero.

The browser detail page uses broker orderbook, tradebook, and positions when available, narrowed to the contracts this strategy traded. It labels local records as a fallback when broker data cannot be obtained. A broker position row can be shared with a manual order or another source, so its quantity and unrealised P&L must not be attributed exclusively to this strategy.

## Webhook Security

The public webhook performs route rate limiting and declared-size rejection before the validation pipeline. Admitted requests are checked in this order: token, kill switch, client IP allowlist, JSON body, strategy-kind action, batch mode/live gates, dedupe/cooling-off where applicable, then engine dispatch. Each admitted terminal result is audited; rate-limit and pre-body 413 refusals are not.

The real client IP is extracted through the deployment proxy rules before it is compared to a configured CIDR allowlist. Rate-limit token keys use the token digest, not the raw credential. Tokens and token-shaped URL fragments are redacted from application logs, traffic records, and shipped proxy access-log configuration. External senders and custom proxies still need their own credential protection.

## Key Modules

| Module | Responsibility |
|---|---|
| `blueprints/strategy_module.py` | Session-authenticated strategy configuration and browser data endpoints |
| `restx_api/strategy.py` | API-key lifecycle and audit namespace |
| `restx_api/strategy_schema.py` | Strict RESTX request schemas and page limits |
| `services/strategy_module/engine.py` | Run lifecycle, entry/exit orchestration, RMS decisions |
| `services/strategy_module/state.py` | In-memory run state, ownership claims, and checkpoints |
| `services/strategy_module/webhook.py` | Public webhook validation, dedupe, audit, and dispatch |
| `services/strategy_module/recovery.py` | Restart recovery and durable evidence reconciliation |
| `database/strategy_module_db.py` | Strategy RMS persistence and scoped queries |

## API Contract

The external contract and field examples live in the [Strategy RMS RESTX API](../../api-documentation/v1/strategy-rms-api/README.md). The public alert format lives in [Public Strategy Webhook](../../api-documentation/v1/strategy-rms-api/webhook.md). Those pages are the user-facing source; this document records the architecture and invariants that implementation changes must preserve.
