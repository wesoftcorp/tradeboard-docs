# List Strategies

List the Strategy RMS strategies owned by the supplied API key, newest first.

## Endpoint URL

```http
Local Host   :  POST http://127.0.0.1:5000/api/v1/strategy/list
Ngrok Domain :  POST https://<your-ngrok-domain>.ngrok-free.app/api/v1/strategy/list
Custom Domain:  POST https://<your-custom-domain>/api/v1/strategy/list
```

## Sample API Request

```json
{
  "apikey": "<your_app_apikey>",
  "status": "running",
  "q": "NIFTY"
}
```

## Sample cURL Request

```bash
curl -X POST http://127.0.0.1:5000/api/v1/strategy/list \
  -H 'Content-Type: application/json' \
  -d '{
  "apikey": "<your_app_apikey>",
  "status": "running",
  "q": "NIFTY"
}'
```

## Sample API Response

```json
{
  "status": "success",
  "data": [
    {
      "id": 7,
      "name": "NIFTY Short Straddle",
      "strategy_kind": "batch",
      "strategy_type": "intraday",
      "product": "NRML",
      "pricetype": "MARKET",
      "overall_sl_mtm": -5000.0,
      "overall_target_mtm": 8000.0,
      "live_enabled": false,
      "status": "running",
      "current_run_id": 42,
      "created_at": "2026-08-30T03:50:11.402118+00:00",
      "last_finalized_run": {
        "id": 41,
        "pnl_realized": 1250.0,
        "stopped_at": "2026-08-29T09:40:11.482913+00:00"
      }
    }
  ]
}
```

## Request Body

| Parameter | Description | Mandatory/Optional | Default Value |
|---|---|---|---|
| `apikey` | Your Tradeboard API key | Mandatory | - |
| `status` | Filter: `stopped`, `running`, `paused`, or `errored` | Optional | `null` |
| `q` | Case-insensitive strategy-name substring, at most 100 characters | Optional | `null` |

Send `null` or omit `status` and `q` for no filter. An unsupported status or an undeclared request field returns HTTP 400.

## Response Fields

| Field | Type | Description |
|---|---|---|
| `status` | string | `success` or `error` |
| `data` | array | Owned strategy configurations, newest first |

### Strategy Object Fields

| Field | Type | Description |
|---|---|---|
| `id` | integer | Use as `strategy_id` on the other Strategy RMS endpoints |
| `name` | string | Strategy name, unique for the owning user |
| `strategy_kind` | string | `batch` or `signal` |
| `direction` | string | `both`, `long_only`, or `short_only`; used by signal strategies |
| `universe_tab` | string | `weekly_monthly`, `monthly_only`, `stocks_fno`, or `mcx`. The instrument universe the strategy was built from; it decides which segments its legs may use, and cash is offered on `stocks_fno` only |
| `strategy_type` | string | `intraday` or `positional` |
| `product` | string | Configured product intent: `CNC`, `NRML`, or `MIS` |
| `pricetype` | string | `MARKET` |
| `overall_sl_mtm` | number or null | Overall MTM stop loss in rupees |
| `overall_target_mtm` | number or null | Overall MTM target in rupees |
| `live_enabled` | boolean | Whether a live batch start is allowed |
| `webhook_locked` | boolean | Whether public webhook delivery is blocked by the kill switch |
| `status` | string | `stopped`, `running`, `paused`, or `errored` |
| `current_run_id` | integer or null | Current run id, when one exists |
| `created_at`, `updated_at` | string | ISO 8601 UTC timestamps |
| `last_finalized_run` | object or null | Most recently finalised run: `{id, pnl_realized, stopped_at}`. For a stopped strategy, this is the durable final P&L; unrealised P&L is zero and must not be read from an earlier checkpoint |

## Notes

- This list omits leg configuration. Call [Strategy Status](status.md) to read a strategy's legs and current run.
- The product is an intent. The engine translates it for the venue; [Order History](orders.md) reports the product actually sent.
- The response never contains a webhook token. Only its digest is stored.
- Only strategies owned by the API key are returned.
- A checkpoint is a live mark only. Once a run stops, use `last_finalized_run.pnl_realized` as the final total rather than a pre-close checkpoint.

---

**Back to**: [Strategy RMS API](README.md)
