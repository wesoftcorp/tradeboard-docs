# OptionSymbol

Get the option symbol based on underlying, expiry, offset (ATM/ITM/OTM), and option type. This endpoint resolves the correct strike price automatically.

## Endpoint URL

```http
Local Host   :  POST http://127.0.0.1:5000/api/v1/optionsymbol
Ngrok Domain :  POST https://<your-ngrok-domain>.ngrok-free.app/api/v1/optionsymbol
Custom Domain:  POST https://<your-custom-domain>/api/v1/optionsymbol
```

## Sample API Request (ATM Option)

```json
{
  "apikey": "<your_app_apikey>",
  "underlying": "NIFTY",
  "exchange": "NSE_INDEX",
  "expiry_date": "30DEC25",
  "offset": "ATM",
  "option_type": "CE"
}
```

## Sample cURL Request

```bash
curl -X POST http://127.0.0.1:5000/api/v1/optionsymbol \
  -H 'Content-Type: application/json' \
  -d '{
  "apikey": "<your_app_apikey>",
  "underlying": "NIFTY",
  "exchange": "NSE_INDEX",
  "expiry_date": "30DEC25",
  "offset": "ATM",
  "option_type": "CE"
}'
```

## Sample API Response (ATM Option)

```json
{
  "status": "success",
  "symbol": "NIFTY30DEC2525950CE",
  "exchange": "NFO",
  "lotsize": 65,
  "tick_size": 5,
  "freeze_qty": 1800,
  "underlying_ltp": 25966.4
}
```

## Sample API Request (ITM Option)

```json
{
  "apikey": "<your_app_apikey>",
  "underlying": "NIFTY",
  "exchange": "NSE_INDEX",
  "expiry_date": "30DEC25",
  "offset": "ITM3",
  "option_type": "PE"
}
```

## Sample API Response (ITM Option)

```json
{
  "status": "success",
  "symbol": "NIFTY30DEC2526100PE",
  "exchange": "NFO",
  "lotsize": 65,
  "tick_size": 5,
  "freeze_qty": 1800,
  "underlying_ltp": 25966.4
}
```

## Sample API Request (OTM Option)

```json
{
  "apikey": "<your_app_apikey>",
  "underlying": "NIFTY",
  "exchange": "NSE_INDEX",
  "expiry_date": "30DEC25",
  "offset": "OTM4",
  "option_type": "CE"
}
```

## Sample API Response (OTM Option)

```json
{
  "status": "success",
  "symbol": "NIFTY30DEC2526150CE",
  "exchange": "NFO",
  "lotsize": 65,
  "tick_size": 5,
  "freeze_qty": 1800,
  "underlying_ltp": 25966.4
}
```

## Request Body

| Parameter | Description | Mandatory/Optional | Default Value |
|-----------|-------------|-------------------|---------------|
| apikey | Your Tradeboard API key | Mandatory | - |
| underlying | Underlying symbol (NIFTY, BANKNIFTY, SENSEX) or a futures symbol that already carries the expiry, such as `NIFTY28OCT25FUT` | Mandatory | - |
| exchange | Underlying's exchange. Any value in the shared `VALID_EXCHANGES` list passes validation; the practical values are NSE_INDEX, NSE, BSE_INDEX, BSE, NFO, BFO | Mandatory | - |
| expiry_date | Expiry date in DDMMMYY format. Not required when `underlying` already includes the expiry | Optional | Derived from `underlying` |
| strike_int | Strike interval, positive integer or `null`. Omit it so the actual strikes in the instrument master are used, which is recommended | Optional | Derived from the instrument master |
| offset | Strike offset: ATM, ITM1-ITM50, OTM1-OTM50 | Mandatory | - |
| option_type | Option type: CE or PE (lowercase accepted) | Mandatory | - |
| strategy | Deprecated. Accepted and ignored; it will be removed in a future version | Optional | - |

These eight fields are the complete `OptionSymbolSchema`. Any other field returns HTTP 400. If you omit both `expiry_date` and an expiry-bearing `underlying`, the request fails in the service rather than at validation.

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| status | string | "success" or "error" |
| symbol | string | Resolved option symbol |
| exchange | string | Options exchange (NFO/BFO) |
| lotsize | number | Lot size for the option |
| tick_size | number | Minimum price movement |
| freeze_qty | number | Maximum quantity per order |
| underlying_ltp | number | Current underlying price |

## Understanding Offset

| Offset | Description | CE Strike Direction | PE Strike Direction |
|--------|-------------|--------------------|--------------------|
| ATM | At-The-Money | Closest to LTP | Closest to LTP |
| ITM1-ITM50 | In-The-Money | Below LTP | Above LTP |
| OTM1-OTM50 | Out-of-The-Money | Above LTP | Below LTP |

## Lot Sizes

Lot sizes come from the downloaded instrument master, not from a fixed table. The exchanges revise them, so read `lotsize` from the response rather than hard-coding a value. The examples on this page reflect one particular master contract.

## Notes

- The offset is calculated based on actual **strike intervals** in the database
- **underlying_ltp** shows the current price used for ATM calculation
- Use this endpoint to **discover the symbol** before placing orders
- For placing orders directly with offset, use [OptionsOrder](../orders-api/optionsorder.md)

---

**Back to**: [API Documentation](../README.md)
