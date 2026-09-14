# History

Get historical OHLCV (Open, High, Low, Close, Volume) data for a symbol.

## Endpoint URL

```http
Local Host   :  POST http://127.0.0.1:5000/api/v1/history
Ngrok Domain :  POST https://<your-ngrok-domain>.ngrok-free.app/api/v1/history
Custom Domain:  POST https://<your-custom-domain>/api/v1/history
```

## Sample API Request

```json
{
  "apikey": "<your_app_apikey>",
  "symbol": "SBIN",
  "exchange": "NSE",
  "interval": "5m",
  "start_date": "2025-04-01",
  "end_date": "2025-04-08"
}
```

## Sample cURL Request

```bash
curl -X POST http://127.0.0.1:5000/api/v1/history \
  -H 'Content-Type: application/json' \
  -d '{
  "apikey": "<your_app_apikey>",
  "symbol": "SBIN",
  "exchange": "NSE",
  "interval": "5m",
  "start_date": "2025-04-01",
  "end_date": "2025-04-08"
}'
```

## Sample API Response

```json
{
  "status": "success",
  "data": [
    {
      "timestamp": 1743480300,
      "open": 766.50,
      "high": 774.00,
      "low": 763.20,
      "close": 772.50,
      "volume": 318625,
      "oi": 0
    },
    {
      "timestamp": 1743480600,
      "open": 772.45,
      "high": 774.95,
      "low": 772.10,
      "close": 773.20,
      "volume": 197189,
      "oi": 0
    },
    {
      "timestamp": 1743480900,
      "open": 773.20,
      "high": 775.60,
      "low": 772.60,
      "close": 775.15,
      "volume": 227544,
      "oi": 0
    }
  ]
}
```

## Request Body

| Parameter | Description | Mandatory/Optional | Default Value |
|-----------|-------------|-------------------|---------------|
| apikey | Your Tradeboard API key | Mandatory | - |
| symbol | Trading symbol | Mandatory | - |
| exchange | Any value in the shared `VALID_EXCHANGES` list | Mandatory | - |
| interval | Time interval (see below) | Mandatory | - |
| start_date | Start date (YYYY-MM-DD) | Mandatory | - |
| end_date | End date (YYYY-MM-DD) | Mandatory | - |
| source | Data source: `api` (broker) or `db` (local Historify/DuckDB store) | Optional | `api` |

These seven fields are the complete `HistorySchema`. Any other field returns HTTP 400.

`source` accepts only the two literal strings `api` and `db`. `broker` is **not** a valid value and returns HTTP 400; use `api` for broker data. `source: "db"` reads candles previously downloaded by Historify and returns HTTP 404 with a "Download data first using Historify" message when the local store has nothing for that symbol, exchange, and interval.

Open interest is always included for F&O symbols; there is no flag to request it.

## Supported Intervals

The schema validates `interval` against this exact list. A value outside it returns HTTP 400, and a value inside it can still be rejected by a broker that does not offer that interval.

| Group | Values |
|-------|--------|
| Seconds | `1s`, `5s`, `10s`, `15s`, `30s`, `45s` |
| Minutes | `1m`, `2m`, `3m`, `5m`, `10m`, `15m`, `20m`, `30m` |
| Hours | `1h`, `2h`, `3h`, `4h` |
| Daily and longer | `D` (daily), `W` (weekly), `M` (monthly), `Q` (quarterly), `Y` (yearly) |

Call [Intervals](./intervals.md) to see which of these the connected broker actually supports.

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| status | string | "success" or "error" |
| data | array | Array of OHLCV candles |

### Data Array Fields

| Field | Type | Description |
|-------|------|-------------|
| timestamp | number | Candle timestamp as a Unix epoch value in seconds |
| open | number | Opening price |
| high | number | Highest price |
| low | number | Lowest price |
| close | number | Closing price |
| volume | number | Volume traded |
| oi | number | Open interest. Always present; `0` when the instrument or broker has none |

## Notes

- Historical data availability depends on broker
- Response timestamps are Unix epoch seconds, not formatted date strings. Convert them to whatever timezone the client needs; do not treat the numeric value itself as an IST-local timestamp.
- For intraday intervals, data is typically available for the last 30-90 days
- For daily data, longer history may be available
- Use [Intervals](./intervals.md) endpoint to check available intervals for your broker

## Example: Reading From The Local Historify Store

```json
{
  "apikey": "<your_app_apikey>",
  "symbol": "SBIN",
  "exchange": "NSE",
  "interval": "5m",
  "start_date": "2025-04-01",
  "end_date": "2025-04-08",
  "source": "db"
}
```

## Example: Daily Data

```json
{
  "apikey": "<your_app_apikey>",
  "symbol": "RELIANCE",
  "exchange": "NSE",
  "interval": "D",
  "start_date": "2024-01-01",
  "end_date": "2025-01-01"
}
```

## Related Endpoints

- [Intervals](./intervals.md) - Get available time intervals

---

**Back to**: [API Documentation](../README.md)
