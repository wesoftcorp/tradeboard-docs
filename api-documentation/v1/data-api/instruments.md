# Instruments

Download the locally stored instrument master for every exchange or for one exchange. This is the only v1 market-data resource that returns CSV as an alternative to JSON.

## Endpoint

```http
GET /api/v1/instruments?apikey=<key>&exchange=NFO&format=json
```

## Query Parameters

| Parameter | Required | Values | Default |
|---|---:|---|---|
| `apikey` | Yes | Tradeboard API key | - |
| `exchange` | Yes in practice | Any exchange accepted by `VALID_EXCHANGES` | - |
| `format` | No | `json`, `csv` | `json` |

`exchange` is declared optional in `InstrumentsSchema`, but the handler always passes the query value through, and an absent parameter arrives as `null`. The field does not set `allow_none`, so marshmallow rejects it with `{"exchange": ["Field may not be null."]}` and HTTP 400. **Always send `exchange`.** The "download every exchange in one call" path exists in the service but is currently unreachable through this route.

The route ignores query parameters it does not recognize, so a stray parameter is harmless.

## Response Fields

Each item in `data` carries exactly these keys, in this order, and the CSV column order matches:

| Field | Description |
|---|---|
| `symbol` | Tradeboard standard symbol |
| `brsymbol` | Broker-specific symbol |
| `name` | Underlying or instrument name |
| `exchange` | Tradeboard exchange code |
| `brexchange` | Broker-specific exchange code |
| `token` | Broker instrument token |
| `expiry` | Expiry date for derivatives |
| `strike` | Strike price |
| `lotsize` | Lot size |
| `instrumenttype` | Instrument type |
| `tick_size` | Tick size |

There is no `freeze_qty` on this resource; use [Symbol](./symbol.md) or [Search](./search.md) when you need it.

## JSON Example

```bash
curl --get 'http://127.0.0.1:5000/api/v1/instruments' \
  --data-urlencode 'apikey=<your_app_apikey>' \
  --data-urlencode 'exchange=NFO' \
  --data-urlencode 'format=json'
```

```json
{
  "status": "success",
  "message": "Found 1 instruments",
  "data": [
    {
      "symbol": "NIFTY30JUL2625000CE",
      "brsymbol": "NIFTY26JUL25000CE",
      "name": "NIFTY",
      "exchange": "NFO",
      "brexchange": "NFO",
      "token": "12345",
      "expiry": "30-JUL-26",
      "strike": 25000,
      "lotsize": 65,
      "instrumenttype": "CE",
      "tick_size": 0.05
    }
  ]
}
```

The exact symbols, broker symbols, token types, and row count depend on the active broker's downloaded master contract.

## CSV Example

```bash
curl --get 'http://127.0.0.1:5000/api/v1/instruments' \
  --data-urlencode 'apikey=<your_app_apikey>' \
  --data-urlencode 'exchange=NSE' \
  --data-urlencode 'format=csv' \
  --output instruments_NSE.csv
```

CSV responses use `Content-Type: text/csv` and a download filename of `instruments_<exchange>.csv` (or `instruments_all.csv`).

## Errors

| Status | Condition |
|---:|---|
| 400 | Invalid `exchange` or `format`, or either `apikey` or `exchange` omitted (both arrive as `null` and fail schema validation) |
| 403 | API key is invalid |
| 500 | Instrument database query failed |

The service also has a 401 "API key is required" branch, but the schema rejects a missing `apikey` with 400 first, so 401 is not reachable through this route.

When `format=csv`, errors are returned as `text/plain` with the message as the body rather than as a JSON object. The HTTP status code is the same.

**Back to**: [API documentation](../README.md)
