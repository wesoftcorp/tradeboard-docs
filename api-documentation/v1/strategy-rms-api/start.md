# Start Run

Start a batch Strategy RMS run and place its configured entry legs. Signal strategies start from their first accepted public webhook signal instead.

## Endpoint URL

```http
Local Host   :  POST http://127.0.0.1:5000/api/v1/strategy/start
Ngrok Domain :  POST https://<your-ngrok-domain>.ngrok-free.app/api/v1/strategy/start
Custom Domain:  POST https://<your-custom-domain>/api/v1/strategy/start
```

## Sample API Request

```json
{
  "apikey": "<your_app_apikey>",
  "strategy_id": 7,
  "mode": "sandbox"
}
```

## Sample cURL Request

```bash
curl -X POST http://127.0.0.1:5000/api/v1/strategy/start \
  -H 'Content-Type: application/json' \
  -d '{
  "apikey": "<your_app_apikey>",
  "strategy_id": 7,
  "mode": "sandbox"
}'
```

## Sample API Response

```json
{
  "status": "success",
  "run_id": 42,
  "mode": "sandbox",
  "legs": [
    {
      "leg_id": 1,
      "ok": true,
      "acknowledged": true,
      "symbol": "NIFTY04SEP2624500CE",
      "broker_order_id": "26083004118201",
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
| `mode` | Exact `sandbox` or `live` | Mandatory | **No default** |

## Response Fields

| Field | Type | Description |
|---|---|---|
| `status` | string | `success` or `error` |
| `run_id` | integer | Newly opened run id |
| `mode` | string | Accepted mode, echoed in the response |
| `legs` | array | Per-leg entry outcomes |

### Leg Outcome Fields

| Field | Type | Description |
|---|---|---|
| `leg_id` | integer | Configured leg id |
| `ok` | boolean | Whether the entry was accepted |
| `acknowledged` | boolean, optional | Whether the broker acknowledgement was persisted |
| `symbol` | string | Resolved Tradeboard contract symbol |
| `broker_order_id` | string or null | Live broker or sandbox order reference |
| `error` | string or null | Rejection context when `ok` is false |

## Notes

- `mode` is required and case-sensitive. Omission, `LIVE`, or `paper` returns HTTP 400 and places no order.
- `live` returns HTTP 409 until live trading has been explicitly enabled on this strategy in the browser.
- A partial entry success is HTTP 200. Inspect every `legs[].ok` result.
- `ok: true` with `acknowledged: false` is a broker-accepted order whose acknowledgement needs reconciliation; it is not a rejection or a reason to place a duplicate order.
- A second start while the strategy is running returns HTTP 409.
- This endpoint is for batch strategies and enforces it. A start against a signal strategy returns HTTP 400 with `A signal strategy has no start. Its run opens on the first long_entry or short_entry signal after the session boundary.`, and nothing is claimed or resolved.
- A run whose entries were **all** rejected is closed immediately and returns HTTP 400. The message carries the venue's own reason, for example `Every entry order was rejected: MIS orders cannot be placed after square-off time (15:15 IST). Trading resumes at 09:00 AM IST.` When legs were refused for different reasons, each is listed against the leg it belongs to.

---

**Back to**: [Strategy RMS API](README.md)
