# Multi Option Greeks

Calculate Black-76 Greeks and implied volatility for 1 to 50 option symbols. The service batches option quote retrieval, reuses underlying quotes, and uses a per-expiry synthetic forward when available, with spot as fallback.

## Endpoint

```http
POST /api/v1/multioptiongreeks
```

```bash
curl -X POST 'http://127.0.0.1:5000/api/v1/multioptiongreeks' \
  -H 'Content-Type: application/json' \
  -d '{
    "apikey": "<your_app_apikey>",
    "symbols": [
      {"symbol": "NIFTY30JUL2625000CE", "exchange": "NFO"},
      {"symbol": "NIFTY30JUL2625000PE", "exchange": "NFO"}
    ],
    "interest_rate": 7.0,
    "expiry_time": "15:30"
  }'
```

## Request

| Field | Required | Description |
|---|---:|---|
| `apikey` | Yes | Tradeboard API key |
| `symbols` | Yes | Array containing 1 to 50 option requests |
| `interest_rate` | No | Common annualized rate from 0 to 100 percent |
| `expiry_time` | No | Common expiry time in `HH:MM` form |

These four fields are the complete top-level `MultiOptionGreeksSchema`. Any other top-level field returns HTTP 400. There is no per-item `interest_rate` and no per-item `expiry_time`: both are set once for the whole batch.

Each `symbols` item requires `symbol` and `exchange`. Valid exchanges are the derivatives list: `NFO`, `BFO`, `MCX`, `CDS`, `NCO`, `BCD`, `NCDEX`, and `CRYPTO`. Optional `underlying_symbol` and `underlying_exchange` override underlying resolution for that item. Those four keys are the whole item schema; anything else returns HTTP 400 for the entire request.

This endpoint uses the shared `API_RATE_LIMIT`, not the `GREEKS_RATE_LIMIT` that the single-symbol [Option Greeks](./optiongreeks.md) endpoint uses.

## Response

```json
{
  "status": "success",
  "data": [
    {
      "status": "success",
      "symbol": "NIFTY30JUL2625000CE",
      "exchange": "NFO",
      "underlying": "NIFTY",
      "strike": 25000.0,
      "option_type": "CE",
      "expiry_date": "30-Jul-2026",
      "days_to_expiry": 28.5071,
      "spot_price": 25966.05,
      "option_price": 435,
      "interest_rate": 7.0,
      "implied_volatility": 15.25,
      "greeks": {
        "delta": 0.52,
        "gamma": 0.0001,
        "theta": -4.97,
        "vega": 30.76,
        "rho": 0.001
      }
    },
    {
      "status": "success",
      "symbol": "NIFTY30JUL2625000PE",
      "exchange": "NFO",
      "underlying": "NIFTY",
      "strike": 25000.0,
      "option_type": "PE",
      "expiry_date": "30-Jul-2026",
      "days_to_expiry": 28.5071,
      "spot_price": 25966.05,
      "option_price": 128.4,
      "interest_rate": 7.0,
      "implied_volatility": 14.9,
      "greeks": {
        "delta": -0.48,
        "gamma": 0.0001,
        "theta": -4.12,
        "vega": 30.41,
        "rho": -0.001
      }
    }
  ],
  "summary": {"total": 2, "success": 2, "failed": 0}
}
```

Each successful item carries the same field set as the single-symbol [Option Greeks](./optiongreeks.md) response. Failed items carry only `status`, `symbol`, `exchange`, and `message`. Items are returned in the order they were requested.

### Top-Level Status Is Three-Valued

| `status` | Meaning |
|---|---|
| `success` | Every symbol succeeded |
| `partial` | At least one succeeded and at least one failed |
| `error` | Every symbol failed |

Do not test for `status == "success"` alone. When any item fails, the response also gains a `message` string summarizing up to three distinct failure reasons. Always read `summary` and inspect the per-item `status`.

All three cases return HTTP 200, including `status: "error"` where every symbol failed. The HTTP status code is not a usable signal for per-symbol outcomes.

Expired options are normalized to an expired-option Greeks response and counted as successes, rather than failing the request.

**Back to**: [API documentation](../README.md)
