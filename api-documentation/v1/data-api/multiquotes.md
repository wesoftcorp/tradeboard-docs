# MultiQuotes

Get real-time quotes for multiple symbols in a single API call.

## Endpoint URL

```http
Local Host   :  POST http://127.0.0.1:5000/api/v1/multiquotes
Ngrok Domain :  POST https://<your-ngrok-domain>.ngrok-free.app/api/v1/multiquotes
Custom Domain:  POST https://<your-custom-domain>/api/v1/multiquotes
```

## Sample API Request

```json
{
  "apikey": "<your_app_apikey>",
  "symbols": [
    {"symbol": "RELIANCE", "exchange": "NSE"},
    {"symbol": "TCS", "exchange": "NSE"},
    {"symbol": "INFY", "exchange": "NSE"}
  ]
}
```

## Sample cURL Request

```bash
curl -X POST http://127.0.0.1:5000/api/v1/multiquotes \
  -H 'Content-Type: application/json' \
  -d '{
  "apikey": "<your_app_apikey>",
  "symbols": [
    {"symbol": "RELIANCE", "exchange": "NSE"},
    {"symbol": "TCS", "exchange": "NSE"},
    {"symbol": "INFY", "exchange": "NSE"}
  ]
}'
```

## Sample API Response

```json
{
  "status": "success",
  "results": [
    {
      "symbol": "RELIANCE",
      "exchange": "NSE",
      "data": {
        "open": 1542.3,
        "high": 1571.6,
        "low": 1540.5,
        "ltp": 1569.9,
        "prev_close": 1539.7,
        "ask": 1569.9,
        "bid": 0,
        "oi": 0,
        "volume": 14054299
      }
    },
    {
      "symbol": "TCS",
      "exchange": "NSE",
      "data": {
        "open": 3118.8,
        "high": 3178,
        "low": 3117,
        "ltp": 3162.9,
        "prev_close": 3119.2,
        "ask": 0,
        "bid": 3162.9,
        "oi": 0,
        "volume": 2508527
      }
    },
    {
      "symbol": "INFY",
      "exchange": "NSE",
      "data": {
        "open": 1532.1,
        "high": 1560.3,
        "low": 1532.1,
        "ltp": 1557.9,
        "prev_close": 1530.6,
        "ask": 0,
        "bid": 1557.9,
        "oi": 0,
        "volume": 7575038
      }
    }
  ]
}
```

## Request Body

| Parameter | Description | Mandatory/Optional | Default Value |
|-----------|-------------|-------------------|---------------|
| apikey | Your Tradeboard API key | Mandatory | - |
| symbols | Array of symbol objects, at least one | Mandatory | - |

`MultiQuotesSchema` declares only `apikey` and `symbols`. Any other top-level field returns HTTP 400.

### Symbol Object Fields

| Field | Description |
|-------|-------------|
| symbol | Trading symbol. Mandatory |
| exchange | Any value in the shared `VALID_EXCHANGES` list. Mandatory |

Each item accepts only these two keys; an extra key inside an item returns HTTP 400 for the whole request.

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| status | string | "success" or "error" |
| results | array | Array of quote results |

### Results Array Fields

| Field | Type | Description |
|-------|------|-------------|
| symbol | string | Trading symbol |
| exchange | string | Exchange code |
| data | object | Quote data (same as Quotes endpoint). Present only on success |
| error | string | Error message. Present only when that symbol failed |

An entry has either `data` or `error`, never both. The top-level `status` stays `"success"` when some symbols fail, so check each entry rather than the wrapper.

If **every** symbol is invalid the whole request fails with HTTP 400 and a different shape: `status: "error"`, a `message`, and an `invalid_symbols` array of `{symbol, exchange, error}` objects. There is no `results` key in that response.

### Data Object Fields

| Field | Type | Description |
|-------|------|-------------|
| open | number | Day's open price |
| high | number | Day's high price |
| low | number | Day's low price |
| ltp | number | Last traded price |
| ask | number | Best ask price |
| bid | number | Best bid price |
| prev_close | number | Previous day's close |
| oi | number | Open interest (for F&O) |
| volume | number | Total traded volume |

## Notes

- More efficient than making multiple [Quotes](./quotes.md) calls
- Invalid symbols are returned with an `error` field, and they appear first in `results`, before the valid ones. Do not assume `results` is in request order.
- The schema imposes no upper bound on the number of symbols; broker limits apply
- If broker doesn't support multiquotes natively, the API fetches quotes individually
- For F&O symbols, **oi** (open interest) field is populated

## Use Cases

- **Watchlist updates**: Refresh quotes for all watchlist symbols
- **Portfolio valuation**: Get LTP for all holdings
- **Multi-symbol strategies**: Monitor multiple correlated symbols

---

**Back to**: [API Documentation](../README.md)
