# Strategy Status

Read one owned Strategy RMS configuration, its legs, and its current run when one exists.

## Endpoint URL

```http
Local Host   :  POST http://127.0.0.1:5000/api/v1/strategy/status
Ngrok Domain :  POST https://<your-ngrok-domain>.ngrok-free.app/api/v1/strategy/status
Custom Domain:  POST https://<your-custom-domain>/api/v1/strategy/status
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
curl -X POST http://127.0.0.1:5000/api/v1/strategy/status \
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
  "data": {
    "id": 7,
    "name": "NIFTY Short Straddle",
    "strategy_kind": "batch",
    "status": "running",
    "current_run_id": 42,
    "legs": [
      {
        "id": 1,
        "segment": "options",
        "position": "S",
        "lots": 1,
        "option_type": "CE",
        "expiry": "weekly"
      }
    ]
  },
  "run": {
    "id": 42,
    "mode": "sandbox",
    "broker": "sandbox",
    "started_at": "2026-08-30T03:50:11.402118+00:00",
    "stopped_at": null,
    "stop_requested_at": null,
    "stop_requested_reason": null,
    "pnl_realized": 0.0,
    "pnl_peak": 4880.0,
    "pnl_trough": -1220.25,
    "resolved_expiries": {"1": "04-SEP-26"}
  }
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
| `data` | object | Strategy configuration, including its saved leg definitions |
| `run` | object or null | Current run, or `null` when no run is current |

### Leg Fields

`data.legs` is the saved configuration, and the two kinds do not share a shape. A batch leg is resolved against the strategy's underlying; a signal leg names its own instrument.

| Field | Kind | Description |
|---|---|---|
| `id` | both | Leg id, unique within the strategy |
| `segment` | both | `options`, `futures`, or `cash`. A batch leg's segment must be one its `universe_tab` offers, and **cash is offered on `stocks_fno` only**: an index has no cash instrument and an MCX commodity has no spot. A signal leg takes `cash` or `futures` only |
| `position` | batch | `B` or `S`. A short cash leg is refused unless the product is `MIS`, because cash cannot be carried short |
| `lots` | batch | The configured count, multiplied by the contract's lot size on every segment. A cash row's lot size is 1, so the count reads as a share count |
| `expiry` | batch | Expiry rank; refused outright on a cash leg |
| `option_type`, `strike_mode`, `atm_offset`, `strike` | batch | Options legs only |
| `symbol`, `exchange` | signal | The exact instrument, checked against the master contract on every venue. The segment and the exchange must agree: cash cannot sit on a derivative venue |
| `side` | signal | `long`, `short`, or `both`. Which signals the leg accepts, not the side it is held |
| `qty`, `qty_mode` | signal | `lots` multiplies by the contract's lot size; `units` is the number outright. A derivative venue defaults to `lots` and a cash venue to `units`, and `lots` is refused on cash because there is no lot size to multiply by |
| `sl_pts`, `target_pts`, `trail` | both | Per-leg risk |
| `risk_unit` | both | `points` (the default) or `percent`, governing `sl_pts`, `target_pts` and `trail` together. A percentage is measured against the leg's own entry price, so 2 on a short filled at 2500 is a stop at 2550 |

### Run Object Fields

| Field | Type | Description |
|---|---|---|
| `id` | integer | Run id |
| `mode` | string | `live` or `sandbox`, fixed for the run |
| `broker` | string | Broker captured at start; `sandbox` for a sandbox run |
| `started_at`, `stopped_at` | string or null | ISO 8601 UTC timestamps |
| `stop_reason` | string or null | Terminal reason once finalised |
| `stop_requested_at`, `stop_requested_reason` | string or null | Durable pending-stop state |
| `pnl_realized` | number | Realised P&L after confirmed-flat finalisation |
| `pnl_peak`, `pnl_trough` | number | Highest and lowest run P&L |
| `trigger_source` | string | `manual`, `webhook`, or `scheduler` |
| `resolved_expiries` | object or null | Resolved expiry by string leg id |

## Notes

- A non-null `stop_requested_at` or `stop_requested_reason` means the run remains open and managed. Do not treat a stop request as proof of flatness.
- On an open run, P&L fields are persisted values rather than a current market mark. Use a finalised [Run History](runs.md) record for realised P&L.
- `resolved_expiries` preserves the contract identity that was chosen at run start.
- A missing strategy and a strategy owned by another user both return HTTP 404 with `Strategy not found`.

---

**Back to**: [Strategy RMS API](README.md)
