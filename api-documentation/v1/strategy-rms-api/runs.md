# Run History

Read every activation of an owned Strategy RMS strategy, newest first.

## Endpoint URL

```http
Local Host   :  POST http://127.0.0.1:5000/api/v1/strategy/runs
Ngrok Domain :  POST https://<your-ngrok-domain>.ngrok-free.app/api/v1/strategy/runs
Custom Domain:  POST https://<your-custom-domain>/api/v1/strategy/runs
```

## Sample API Request

```json
{
  "apikey": "<your_app_apikey>",
  "strategy_id": 7,
  "limit": 10
}
```

## Sample cURL Request

```bash
curl -X POST http://127.0.0.1:5000/api/v1/strategy/runs \
  -H 'Content-Type: application/json' \
  -d '{
  "apikey": "<your_app_apikey>",
  "strategy_id": 7,
  "limit": 10
}'
```

## Sample API Response

```json
{
  "status": "success",
  "data": [
    {
      "id": 42,
      "strategy_id": 7,
      "mode": "sandbox",
      "broker": "sandbox",
      "started_at": "2026-08-30T03:50:11.402118+00:00",
      "stopped_at": "2026-08-30T09:40:02.771905+00:00",
      "stop_reason": "overall_target",
      "stop_requested_at": null,
      "stop_requested_reason": null,
      "pnl_realized": 3140.5,
      "pnl_peak": 4880.0,
      "pnl_trough": -1220.25,
      "trigger_source": "manual",
      "resolved_expiries": {"1": "04-SEP-26"}
    }
  ]
}
```

## Request Body

| Parameter | Description | Mandatory/Optional | Default Value |
|---|---|---|---|
| `apikey` | Your Tradeboard API key | Mandatory | - |
| `strategy_id` | Positive Strategy RMS id | Mandatory | - |
| `limit` | Number of runs, from 1 to 500 | Optional | `100` |

The limit is rejected outside its range instead of silently clamped.

## Response Fields

| Field | Type | Description |
|---|---|---|
| `status` | string | `success` or `error` |
| `data` | array | Runs ordered newest first by start time |

### Run Object Fields

| Field | Type | Description |
|---|---|---|
| `id` | integer | Run id; use it to filter [Order History](orders.md) or [Risk Event Audit Trail](events.md) |
| `strategy_id` | integer | Owning strategy |
| `mode` | string | `live` or `sandbox` |
| `broker` | string | Broker captured at start |
| `started_at`, `stopped_at` | string or null | ISO 8601 UTC timestamps |
| `stop_reason` | string or null | Terminal stop reason |
| `stop_requested_at`, `stop_requested_reason` | string or null | Durable pending-stop state |
| `pnl_realized` | number | Final realised P&L from durable owner/fill evidence |
| `pnl_peak`, `pnl_trough` | number | Highest and lowest P&L for the run |
| `trigger_source` | string | `manual`, `webhook`, or `scheduler` |
| `webhook_event_id` | integer or null | Inbound webhook event that opened the run |
| `resolved_expiries` | object or null | Resolved expiry by string leg id |

## Notes

- `stopped_at: null` marks an open run. Pair it with [Strategy Status](status.md) when checking the current run.
- A populated pending-stop field means recovery will resume the stop; it is not an ordinary closed run.
- Overall thresholds trigger MARKET exits from rolling latest-known marks. A run can end with `overall_target` or `overall_sl` and a different final realised P&L.
- Peak and trough are authoritative only after the run stops. Final P&L is reconciled from exact fill evidence rather than a stale checkpoint.

---

**Back to**: [Strategy RMS API](README.md)
