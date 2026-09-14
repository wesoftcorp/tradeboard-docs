# Risk Event Audit Trail

Read append-only Strategy RMS lifecycle and risk events for an owned strategy, newest first.

## Endpoint URL

```http
Local Host   :  POST http://127.0.0.1:5000/api/v1/strategy/events
Ngrok Domain :  POST https://<your-ngrok-domain>.ngrok-free.app/api/v1/strategy/events
Custom Domain:  POST https://<your-custom-domain>/api/v1/strategy/events
```

## Sample API Request

```json
{
  "apikey": "<your_app_apikey>",
  "strategy_id": 7,
  "run_id": 42,
  "severity": "critical",
  "limit": 100
}
```

## Sample cURL Request

```bash
curl -X POST http://127.0.0.1:5000/api/v1/strategy/events \
  -H 'Content-Type: application/json' \
  -d '{
  "apikey": "<your_app_apikey>",
  "strategy_id": 7,
  "run_id": 42,
  "severity": "critical",
  "limit": 100
}'
```

## Sample API Response

```json
{
  "status": "success",
  "data": [
    {
      "id": 2041,
      "run_id": 42,
      "strategy_id": 7,
      "ts": "2026-08-30T06:21:40.104112+00:00",
      "kind": "run_stop_failed",
      "severity": "critical",
      "leg_id": null,
      "message": "Stop requested but an owned position remains managed",
      "payload": null
    }
  ]
}
```

## Request Body

| Parameter | Description | Mandatory/Optional | Default Value |
|---|---|---|---|
| `apikey` | Your Tradeboard API key | Mandatory | - |
| `strategy_id` | Positive Strategy RMS id | Mandatory | - |
| `run_id` | Positive run id filter | Optional | `null` |
| `kind` | Exact Strategy RMS event kind | Optional | `null` |
| `severity` | `info`, `warn`, or `critical` | Optional | `null` |
| `limit` | Number of events, from 1 to 1000 | Optional | `500` |

## Response Fields

| Field | Type | Description |
|---|---|---|
| `status` | string | `success` or `error` |
| `data` | array | Events, newest first by timestamp |

### Event Object Fields

| Field | Type | Description |
|---|---|---|
| `id` | integer | Event record id |
| `run_id` | integer or null | Run involved; configuration events have `null` |
| `strategy_id` | integer | Owning strategy |
| `ts` | string | ISO 8601 UTC timestamp |
| `kind` | string | Lifecycle or risk transition |
| `severity` | string | `info`, `warn`, or `critical` |
| `leg_id` | integer or null | Related leg when applicable |
| `message` | string | Human-readable event summary |
| `payload` | object or null | Kind-specific structured detail |

## Notes

- `run_stop_requested` records durable stop intent; `run_stopped` is the later confirmed-flat transition.
- `run_stop_failed`, `order_ack_unrecorded`, and `flip_outgoing_exit_rejected` are critical operator-action events.
- `leg_expiry_fallback` is a warning that a nearer expiry was used because the requested expiry rank was unavailable.
- Event payloads have no universal shape. A run filter excludes configuration events with `run_id: null`.
- Unsupported `kind`/`severity` values or an out-of-range limit return HTTP 400.

---

**Back to**: [Strategy RMS API](README.md)
