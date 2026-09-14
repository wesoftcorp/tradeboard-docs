# Strategy RMS API

The Strategy RMS API is the lifecycle and audit surface for strategies that already exist in the browser at `/strategy`. It is registered under `/api/v1/strategy` and uses an Tradeboard API key in every JSON request body.

It can list strategies, inspect configuration and current runs, start a batch run, request exits, and query durable history. It deliberately cannot create or edit strategies, enable live mode, rotate a webhook token, or delete a strategy. Those privileged configuration actions stay in the browser's session-authenticated surface.

## Base URL And Authentication

```text
http://127.0.0.1:5000/api/v1/strategy
```

Every endpoint below is a `POST` and includes `apikey`. `strategy_id` is a positive integer in the JSON body, not a URL path parameter.

```json
{
  "apikey": "<your_app_apikey>",
  "strategy_id": 7
}
```

An invalid API key returns 403. A strategy that is missing or belongs to another user returns the same 404 response, `Strategy not found`; ownership cannot be probed through this API.

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| POST | `/list` | [List strategies](list.md) |
| POST | `/status` | [Strategy configuration and current run](status.md) |
| POST | `/start` | [Start a batch run](start.md) |
| POST | `/stop` | [Request a durable stop for the current run](stop.md) |
| POST | `/close_all` | [Record and request an operator close-all](close-all.md) |
| POST | `/close_leg` | [Close one current-run leg](close-leg.md) |
| POST | `/runs` | [Read run history](runs.md) |
| POST | `/orders` | [Read strategy order history](orders.md) |
| POST | `/events` | [Read the risk-event audit trail](events.md) |

## Lifecycle Rule: Accepted Does Not Mean Flat

`/stop` and `/close_all` can return HTTP 200 with `stop_pending: true`. That means the stop intent is durable and an exit was accepted, but the run remains open, subscribed, and managed until its exact owners are proven flat by fill evidence. A 409 can also describe a refused exit while a run remains open. Always inspect `stop_pending` and each exit's `ok` field; do not infer flatness from the status code or success envelope.

`/close_leg` reports `run_stopped: true` only when this call could already prove the last owned position is flat. A normally asynchronous broker acknowledgement is not that proof.

## Request Validation, Limits, And Times

Request schemas reject fields that the endpoint does not declare. An unknown field, missing required field, invalid enum, or out-of-range limit returns 400.

All routes use the deployment's `API_RATE_LIMIT` configuration. This module's in-code fallback is `10 per second`; deployments may set a different value.

Times are ISO 8601 UTC strings with an explicit `+00:00` offset. Strategy `entry_time` and `exit_time` configuration values are wall-clock IST `HH:MM` strings. Money values are JSON numbers.

## Public Alert Webhook

Alert senders should use [Public Strategy Webhook](webhook.md), not this API. It is `POST /strategy/webhook/<token>`, outside `/api/v1`, and authenticates with its high-entropy URL token rather than `apikey`.

---

**Back to**: [V1 API documentation](../README.md)
