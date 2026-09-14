# Expiry

Get available expiry dates for a futures or options symbol.

## Endpoint URL

```http
Local Host   :  POST http://127.0.0.1:5000/api/v1/expiry
Ngrok Domain :  POST https://<your-ngrok-domain>.ngrok-free.app/api/v1/expiry
Custom Domain:  POST https://<your-custom-domain>/api/v1/expiry
```

## Sample API Request

```json
{
  "apikey": "<your_app_apikey>",
  "symbol": "NIFTY",
  "exchange": "NFO",
  "instrumenttype": "options"
}
```

## Sample cURL Request

```bash
curl -X POST http://127.0.0.1:5000/api/v1/expiry \
  -H 'Content-Type: application/json' \
  -d '{
  "apikey": "<your_app_apikey>",
  "symbol": "NIFTY",
  "exchange": "NFO",
  "instrumenttype": "options"
}'
```

## Sample API Response

```json
{
  "status": "success",
  "message": "Found 18 expiry dates for NIFTY options in NFO",
  "data": [
    "10-JUL-25",
    "17-JUL-25",
    "24-JUL-25",
    "31-JUL-25",
    "07-AUG-25",
    "28-AUG-25",
    "25-SEP-25",
    "24-DEC-25",
    "26-MAR-26",
    "25-JUN-26",
    "31-DEC-26",
    "24-JUN-27",
    "30-DEC-27",
    "29-JUN-28",
    "28-DEC-28",
    "28-JUN-29",
    "27-DEC-29",
    "25-JUN-30"
  ]
}
```

## Sample API Request (Futures)

```json
{
  "apikey": "<your_app_apikey>",
  "symbol": "NIFTY",
  "exchange": "NFO",
  "instrumenttype": "futures"
}
```

## Request Body

| Parameter | Description | Mandatory/Optional | Default Value |
|-----------|-------------|-------------------|---------------|
| apikey | Your Tradeboard API key | Mandatory | - |
| symbol | Underlying symbol (e.g., NIFTY, BANKNIFTY) | Mandatory | - |
| exchange | Derivatives exchange: NFO, BFO, MCX, CDS, NCO, BCD, NCDEX, CRYPTO | Mandatory | - |
| instrumenttype | Instrument type: `futures` or `options`, lowercase | Mandatory | - |

`ExpirySchema` declares exactly these four fields and all four are required. Any other field returns HTTP 400. In particular there is no `expirytype` parameter: this endpoint returns every expiry for the underlying, and weekly versus monthly is not a filter you can pass. Filter the returned array on the client instead.

`exchange` is validated against the derivatives list above, which is narrower than the full exchange set. Cash and index exchanges such as `NSE` or `NSE_INDEX` return HTTP 400 here.

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| status | string | "success" or "error" |
| message | string | Summary of results |
| data | array | Array of expiry dates in DD-MMM-YY format |

## Notes

- Expiry dates are sorted in **ascending order** (nearest first)
- Weekly expiries are included for index options (NIFTY, BANKNIFTY)
- Monthly expiries extend further into the future
- Use this data to populate expiry dropdowns in your application
- Format is **DD-MMM-YY** (e.g., 10-JUL-25). Note that the option and order endpoints that take an `expiry_date` want the compact **DDMMMYY** form (e.g., 10JUL25), so strip the hyphens before passing a value through.
- When the underlying has no expiries in that exchange, the response is still `status: "success"` with an empty `data` array and an explanatory `message`

## Use Cases

- **Options trading**: Get available expiries for option selection
- **Futures trading**: Find current and far-month futures
- **Strategy building**: Select appropriate expiry for strategy

---

**Back to**: [API Documentation](../README.md)
