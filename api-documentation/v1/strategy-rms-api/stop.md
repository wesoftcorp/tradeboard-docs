# Stop Run

Persist a stop request and submit MARKET exits for every owned position in the strategy's current run. The run finalises only after fill evidence confirms it is flat.

## Endpoint URL

```http
Local Host   :  POST http://127.0.0.1:5000/api/v1/strategy/stop
Ngrok Domain :  POST https://<your-ngrok-domain>.ngrok-free.app/api/v1/strategy/stop
Custom Domain:  POST https://<your-custom-domain>/api/v1/strategy/stop
```

## Sample API Request

```json
{
  "apikey": "<your_app_apikey>",
  "strategy_id": 7
}
```

## Sample cURL Request

```bash
curl -X POST http://127.0.0.1:5000/api/v1/strategy/stop \
  -H 'Content-Type: application/json' \
  -d '{
  "apikey": "<your_app_apikey>",
  "strategy_id": 7
}'
```

## Sample API Response

```json
{
  "status": "success",
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
| `apikey` | Your Tradeboard API key | Mandatory | - |
| `strategy_id` | Positive Strategy RMS id | Mandatory | - |

## Response Fields

| Field | Type | Description |
|---|---|---|
| `status` | string | `success` or `error` |
| `run_id` | integer | Current run receiving the stop |
| `stop_pending` | boolean | Whether exposure still needs a fill, retry, or reconciliation |
| `exits` | array | Per-owner exit outcomes |

### Exit Outcome Fields

| Field | Type | Description |
|---|---|---|
| `leg_id` | integer | Configured leg id |
| `ok` | boolean | Whether the exit was accepted |
| `position_ref` | string or null | Exact durable owner the exit targets |
| `exit_owner` | string | `live` or `superseded` for an outgoing signal-flip owner |
| `broker_order_id` | string or null | Broker reference when one is available |
| `error` | string or null | Refusal context when `ok` is false |

## Notes

- `stop_pending: true` means the run remains open, subscribed, and managed. An accepted exit is not proof that the broker is flat.
- A refused exit is reported with `ok: false` and keeps the run open and retryable. HTTP 409 can therefore still describe held exposure.
- An entry that was accepted but is not yet filled is not exited at configured quantity, because that could create a naked position if the entry later cancels.
- The caller never supplies a run id; the engine resolves the strategy's current run.
- Use `run_stopped` in [Risk Event Audit Trail](events.md) or a finalised [Run History](runs.md) row as confirmed-flat evidence.

---

**Back to**: [Strategy RMS API](README.md)
