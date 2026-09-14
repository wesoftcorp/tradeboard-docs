# Strategy RMS Engine

The Strategy RMS Engine runs configured multi-leg option strategies and signal-driven strategies with durable order intent, per-leg protection, and run-level risk controls. It preserves the operational distinction that matters: an exit request is not a flat position until broker fills confirm it.

## What It Supports

### Batch strategies

Batch strategies resolve and enter their configured legs together. They are controlled with `start` and `stop`, and can use per-leg stop loss, target, and trailing rules; overall MTM stop loss and target; lock-profit and trail-to-entry controls; scheduled starts and square-off; and daily loss limits.

### Signal strategies

Signal strategies act on one configured leg at a time. Alert actions are `long_entry`, `long_exit`, `short_entry`, and `short_exit`. The first accepted signal for the platform session opens the run; there is no separate `start` action or `mode` field for this strategy kind.

The engine treats a repeated entry or an exit for a position that is not held as a successful no-op. That prevents an alert sender retry from becoming a second position. A direction or leg mismatch is rejected so it can be corrected in the sender or strategy configuration.

## How A Run Is Managed

1. The engine records a durable pending order intent before it calls a broker.
2. It records the broker acknowledgement against that exact intent, then consumes broker order updates and fills.
3. A stop or close request records its intent, submits MARKET exits for the exact held contracts, and remains managed while any fill, retry, or reconciliation is pending.
4. Only confirmed-flat ownership and fill evidence finalises the run and writes its realised P&L.

An `overall_target` or `overall_sl` stop reason records the risk rule that initiated the exit, not a promise that the eventual realised P&L equals the threshold. Prices can move while individual MARKET exits are filled.

## Modes And Safety Gates

- New strategies are sandbox-only. Live trading must be enabled explicitly on the strategy page before any `live` start is accepted.
- Batch starts require an explicit `mode` of `sandbox` or `live`; there is no default that could accidentally place live orders.
- A leg whose entry has been accepted but is not yet filled is never exited at its configured quantity. Doing so could create a naked position if the entry later cancels. The run remains managed and reports the refusal.
- A refused exit remains retryable. It does not falsely mark the leg flat or finalise the run.
- Risk rules use the basket's latest known LTP marks. If the WebSocket source becomes stale, the engine uses its polling fallback while it can; stale data is recorded in the event trail.

## Monitoring And Audit

The strategy detail page shows the active run and broker-backed orderbook, tradebook, and positions where the broker supports them. A broker response is preferred for broker truth; local strategy rows are retained as a labelled fallback when that source is unavailable.

Use the strategy's **Events** and **History** views, or the RESTX API, to investigate a run. In particular, treat these events as operator-action items:

| Event | Meaning |
|---|---|
| `run_stop_failed` | A stop could not flatten all owned exposure. The run remains open and managed. |
| `order_ack_unrecorded` | The broker accepted an order but its acknowledgement was not persisted after retry; it needs reconciliation. |
| `leg_expiry_fallback` | The configured expiry rank was unavailable and a nearer expiry was traded. |
| `flip_outgoing_exit_rejected` | The old side of a signal flip is still held and remains separately managed. |

The run history records finalised P&L. While a run is still open, live P&L is a mark, not final settlement; a stopped run has zero unrealised P&L.

## Alerts And API Automation

Use the **Public Strategy Webhook** for alert senders such as TradingView. Its URL includes a high-entropy token, which is the credential. Do not put an API key inside the alert body; protect the token in sender configuration and every proxy/access-log layer, and rotate it if exposure is suspected.

Use the authenticated **Strategy RMS RESTX API** for lifecycle actions and audits from a script, integration, or dashboard. It can list, inspect, start, stop, close, and query history, but cannot create or edit a strategy, enable live trading, rotate the webhook token, or delete a strategy.

- [Strategy RMS RESTX API](../api-documentation/v1/strategy-rms-api/README.md)
- [Public Strategy Webhook](../api-documentation/v1/strategy-rms-api/webhook.md)
- [Developer architecture](../developers/design-documentation/39-strategy-module.md)

## Operational Boundaries

Strategy RMS validates strategy configuration and manages the orders it owns; it is not a substitute for broker RMS or account-level margin controls. Before using live mode, validate each strategy in sandbox, understand the broker's product and market-data support, and retain an operational path to inspect or close broker positions during an incident.

## Existing Installations: Required Migration

An existing Tradeboard installation must run the standard migration runner before starting this version. Take a consistent database backup first (or stop the application before making a filesystem copy), then run:

```bash
cd upgrade
uv run migrate_all.py
```

The Strategy RMS migration is idempotent. It creates the six `sm_` strategy tables on installations that do not have them and, for earlier Strategy RMS installations, adds nullable durable-order and pending-stop columns plus the ownership index. Existing strategy/order rows are preserved; values that were never recorded on an older row remain `null` rather than being guessed.

This migration is required: if it fails, `migrate_all.py` exits non-zero. Do not start the updated application until it succeeds. See [Upgrade Tradeboard](../getting-started/upgrade.md) for backup and post-upgrade checks.
