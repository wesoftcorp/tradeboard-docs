# Public Strategy Webhook

Trigger a Strategy RMS strategy from TradingView or another alert sender. This public webhook is outside `/api/v1`; its high-entropy URL token is the credential, so it does not accept `apikey`.

## Endpoint URL

```http
Local Host   :  POST http://127.0.0.1:5000/strategy/webhook/<your_webhook_token>
Ngrok Domain :  POST https://<your-ngrok-domain>.ngrok-free.app/strategy/webhook/<your_webhook_token>
Custom Domain:  POST https://<your-custom-domain>/strategy/webhook/<your_webhook_token>
```

The token is shown once when the strategy is created or rotated, and Tradeboard stores only its SHA-256 digest. Treat the whole URL as a secret.

## Sample API Request — Batch Start

```json
{
  "action": "start",
  "mode": "sandbox"
}
```

## Sample cURL Request — Batch Start

```bash
curl -X POST http://127.0.0.1:5000/strategy/webhook/<your_webhook_token> \
  -H 'Content-Type: application/json' \
  -d '{
  "action": "start",
  "mode": "sandbox"
}'
```

## Sample API Response — Batch Start

```json
{
  "status": "success",
  "result": "ok",
  "message": "Strategy start accepted",
  "strategy_id": 7,
  "run_id": 42
}
```

## Sample API Request — Signal

```json
{
  "action": "long_entry",
  "leg_id": 1
}
```

## Sample cURL Request — Signal

```bash
curl -X POST http://127.0.0.1:5000/strategy/webhook/<your_webhook_token> \
  -H 'Content-Type: application/json' \
  -d '{
  "action": "long_entry",
  "leg_id": 1
}'
```

## Sample API Response — Pending Stop

```json
{
  "status": "success",
  "result": "ok",
  "message": "Strategy stop accepted",
  "strategy_id": 7,
  "run_id": 42,
  "stop_pending": true,
  "exits": [
    {
      "leg_id": 1,
      "ok": true,
      "position_ref": "969bc536b1c14d15992f730c2c136d7a",
      "exit_owner": "live",
      "error": null
    }
  ]
}
```

## Request Body

| Parameter | Description | Mandatory/Optional | Default Value |
|---|---|---|---|
| `action` | Batch: `start`/`stop`; signal: `long_entry`, `long_exit`, `short_entry`, or `short_exit` | Mandatory | - |
| `mode` | `sandbox` or `live`, for batch `start` only | Mandatory on batch start | **No default** |
| `leg_id` | Configured signal leg id | Optional | `null` |
| `symbol` | Signal leg symbol when `leg_id` is absent | Optional | `null` |
| `exchange` | Exchange for `symbol` | Optional | `null` |

`action` and `mode` are trimmed and lower-cased before validation. The JSON body must be an object. Extra fields are ignored and redacted before audit storage when they look like credentials.

## Response Fields

| Field | Type | Description |
|---|---|---|
| `status` | string | `success` or `error` |
| `result` | string | Webhook outcome; absent only on the declared-size 413 preflight response |
| `message` | string | Human-readable outcome |
| `strategy_id` | integer, optional | Strategy the token resolved to |
| `run_id` | integer, optional | Run opened or affected by the delivery |
| `stop_pending` | boolean, optional | A stop is accepted but not yet confirmed flat |
| `exits` | array, optional | Per-owner exit outcomes for a stop |

## Result Codes

| Result | HTTP Status | Description |
|---|---:|---|
| `ok` | 200 | Delivery was accepted. A signal no-op is also accepted. |
| `rejected_token` | 404 | Token is malformed, unknown, or rotated. |
| `rejected_locked` | 403 | Strategy webhook kill switch is engaged. |
| `rejected_ip` | 403 | Sender address is outside the configured CIDR allowlist. |
| `rejected_payload` | 400 | Body is invalid, not a JSON object, or exceeds the admitted size cap. |
| `rejected_invalid_action` | 400 | Action, batch mode, direction, or leg configuration is invalid. |
| `rejected_live_disabled` | 403 | Live batch start has not been enabled by the operator. |
| `rejected_dedupe` | 200 | Identical batch delivery was already handled within 60 seconds. |
| `rejected_cooling_off` | 409 | Batch start arrived within 30 seconds of a stop. |
| `rejected_engine_error` | 500 | Engine could not accept the delivery. |
| `rate_limited` | 429 | Route rate limit refused the request. |

## Notes

- A batch strategy accepts only `start` and `stop`. A signal strategy accepts only the four signal actions. Each kind rejects the other's vocabulary.
- Batch `start` requires a `mode`; `live` is refused until the operator enables it on the strategy page. Signal strategies have no `mode` and open their session run on the first accepted signal.
- A repeated signal action that would not change a held position is a successful no-op, preventing alert retries from becoming duplicate orders.
- A signal leg names its instrument outright and it is checked against the master contract on every venue, cash included. `NIFTY` on `NFO` is a base symbol rather than a contract, and a misspelled equity such as `RELAINCE` on `NSE` is refused the same way, both `rejected_invalid_action`. If the master contract holds no rows at all for that exchange there is nothing to check against and the leg passes, so a fresh install is not blocked.
- A `short_entry` on a cash leg is refused with `rejected_invalid_action` when the strategy's product is not `MIS`. Cash cannot be carried short, so anything else would reach the venue as a naked short delivery. The refusal happens at signal time, where the side actually being opened is known rather than the sides the leg accepts.
- A batch stop with `stop_pending: true` remains managed until exact owner fills prove flat. It is not a completed closure.
- The route rate limit and a declared body over 16,384 bytes are refused before the body is read or a webhook audit row is written. Every terminal result admitted to the validation pipeline is audited.
- Keep the URL token out of sender logs, proxy access logs, screenshots, and alert bodies. Rotate it from the strategy page if exposure is suspected.

---

**Back to**: [Strategy RMS API](README.md)
