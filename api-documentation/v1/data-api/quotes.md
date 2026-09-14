# Quotes

Get real-time market quotes for a single symbol including OHLC, LTP, bid/ask, and volume.

## Endpoint URL

```http
Local Host   :  POST http://127.0.0.1:5000/api/v1/quotes
Ngrok Domain :  POST https://<your-ngrok-domain>.ngrok-free.app/api/v1/quotes
Custom Domain:  POST https://<your-custom-domain>/api/v1/quotes
```

## Sample API Request

```json
{
  "apikey": "<your_app_apikey>",
  "symbol": "RELIANCE",
  "exchange": "NSE"
}
```

## Sample cURL Request

```bash
curl -X POST http://127.0.0.1:5000/api/v1/quotes \
  -H 'Content-Type: application/json' \
  -d '{
  "apikey": "<your_app_apikey>",
  "symbol": "RELIANCE",
  "exchange": "NSE"
}'
```

## Sample API Response

```json
{
  "status": "success",
  "data": {
    "open": 1172.0,
    "high": 1196.6,
    "low": 1163.3,
    "ltp": 1187.75,
    "ask": 1188.0,
    "bid": 1187.85,
    "prev_close": 1165.7,
    "volume": 14414545,
    "oi": 0
  }
}
```

## Request Body

| Parameter | Description | Mandatory/Optional | Default Value |
|-----------|-------------|-------------------|---------------|
| apikey | Your Tradeboard API key | Mandatory | - |
| symbol | Trading symbol | Mandatory | - |
| exchange | Any value in the shared `VALID_EXCHANGES` list | Mandatory | - |

These three fields are the complete `QuotesSchema`. Any other field returns HTTP 400.

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| status | string | "success" or "error" |
| data | object | Quote data object |

### Data Object Fields

| Field | Type | Description |
|-------|------|-------------|
| open | number | Day's open price |
| high | number | Day's high price |
| low | number | Day's low price |
| ltp | number | Last traded price |
| ask | number | Best ask price |
| bid | number | Best bid price |
| prev_close | number | Previous day's close price |
| volume | number | Total traded volume |
| oi | number | Open interest. `0` for cash instruments and for brokers that do not report it |

The `data` object is the broker adapter's normalized quote. The fields above are the common contract; individual brokers may add fields, and a broker that cannot supply a value returns `0` rather than omitting the key.

## Notes

- Quotes are **real-time** and refresh with each trade
- For **F&O symbols**, use the Tradeboard standard format (e.g., NIFTY30JAN25FUT)
- For **multiple symbols**, use the [MultiQuotes](./multiquotes.md) endpoint
- The **bid/ask** spread indicates liquidity

## Example: F&O Quote

```json
{
  "apikey": "<your_app_apikey>",
  "symbol": "NIFTY30JAN25FUT",
  "exchange": "NFO"
}
```

## Related Endpoints

- [MultiQuotes](./multiquotes.md) - Get quotes for multiple symbols
- [Depth](./depth.md) - Get market depth (Level 2)

---

**Back to**: [API Documentation](../README.md)
