# Close All Legs

Record an operator close-all request, persist a whole-run stop, and submit MARKET exits for every owned position in the current run.

## Endpoint URL

```http
Local Host   :  POST http://127.0.0.1:5000/api/v1/strategy/close_all
Ngrok Domain :  POST https://<your-ngrok-domain>.ngrok-free.app/api/v1/strategy/close_all
Custom Domain:  POST https://<your-custom-domain>/api/v1/strategy/close_all
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
curl -X POST http://127.0.0.1:5000/api/v1/strategy/close_all \
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
| `run_id` | integer | Current run receiving the close-all request |
| `stop_pending` | boolean | Whether owned exposure still needs fill, retry, or reconciliation |
| `exits` | array | Per-owner exit outcomes; see [Stop Run](stop.md) for their fields |

## Notes

- The stop mechanics are the same as [Stop Run](stop.md), including pending-stop recovery and exact-owner exits.
- This endpoint is separate so the audit trail records `close_all_manual`: `Operator requested closure of all held legs`.
- That event records operator intent, not completion. Read `stop_pending`, each `exits[].ok`, and the later `run_stopped` event before treating the run as flat.
- A run that is not current, or an exit the engine cannot safely place, returns HTTP 409.

---

**Back to**: [Strategy RMS API](README.md)
