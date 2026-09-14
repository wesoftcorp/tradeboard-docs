# Close One Leg

Submit a MARKET exit for one filled owner in the current run. All other legs continue running.

## Endpoint URL

```http
Local Host   :  POST http://127.0.0.1:5000/api/v1/strategy/close_leg
Ngrok Domain :  POST https://<your-ngrok-domain>.ngrok-free.app/api/v1/strategy/close_leg
Custom Domain:  POST https://<your-custom-domain>/api/v1/strategy/close_leg
```

## Sample API Request

```json
{
  "apikey": "<your_app_apikey>",
  "strategy_id": 7,
  "leg_id": 2
}
```

## Sample cURL Request

```bash
curl -X POST http://127.0.0.1:5000/api/v1/strategy/close_leg \
  -H 'Content-Type: application/json' \
  -d '{
  "apikey": "<your_app_apikey>",
  "strategy_id": 7,
  "leg_id": 2
}'
```

## Sample API Response

```json
{
  "status": "success",
  "run_id": 42,
  "leg_id": 2,
  "run_stopped": false,
  "exits": [
    {
      "leg_id": 2,
      "ok": true,
      "position_ref": "80bb5fc9333f4922a582229f06a0fe45",
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
| `leg_id` | Positive configured leg id | Mandatory | - |

## Response Fields

| Field | Type | Description |
|---|---|---|
| `status` | string | `success` or `error` |
| `run_id` | integer | Current run containing the leg |
| `leg_id` | integer | Leg requested by the caller |
| `run_stopped` | boolean | True only when this call already proved the last owner flat |
| `exits` | array | Exit result for the leg |

## Notes

- `leg_id` is the configuration id in `data.legs[].id` from [Strategy Status](status.md), not an order or run id.
- A normal broker acknowledgement is asynchronous, so `run_stopped` is usually `false` even for the last leg. A later fill can finalise the run.
- A refused exit, an unfilled entry, a non-open leg, or a missing current run returns HTTP 409 and does not open an opposing configured-size position.
- Manual leg closure does not invoke trail-to-entry for the remaining legs.

---

**Back to**: [Strategy RMS API](README.md)
