# OpenPosition

Get the current open position for a specific symbol. This endpoint returns the net quantity held for a symbol-exchange-product combination.

## Endpoint URL

```http
Local Host   :  POST http://127.0.0.1:5000/api/v1/openposition
Ngrok Domain :  POST https://<your-ngrok-domain>.ngrok-free.app/api/v1/openposition
Custom Domain:  POST https://<your-custom-domain>/api/v1/openposition
```

## Sample API Request

```json
{
  "apikey": "<your_app_apikey>",
  "symbol": "YESBANK",
  "exchange": "NSE",
  "product": "MIS",
  "strategy": "Test Strategy"
}
```

## Sample cURL Request

```bash
curl -X POST http://127.0.0.1:5000/api/v1/openposition \
  -H 'Content-Type: application/json' \
  -d '{
  "apikey": "<your_app_apikey>",
  "symbol": "YESBANK",
  "exchange": "NSE",
  "product": "MIS",
  "strategy": "Test Strategy"
}'
```

## Sample API Response

```json
{
  "quantity": "-10",
  "status": "success"
}
```

## Sample API Response (No Position)

When no matching position exists the handler substitutes the integer `0`, not the string `"0"`:

```json
{
  "quantity": 0,
  "status": "success"
}
```

## Request Body

| Parameter | Description | Mandatory/Optional | Default Value |
|-----------|-------------|-------------------|---------------|
| apikey | Your Tradeboard API key | Mandatory | - |
| strategy | Strategy identifier | Mandatory | - |
| symbol | Trading symbol | Mandatory | - |
| exchange | Exchange code | Mandatory | - |
| product | Product type: MIS, CNC, NRML | Mandatory | - |

All five fields are required by `OpenPositionSchema`; omitting `strategy` returns HTTP 400, and any additional field returns HTTP 400 as well.

Unlike the order schemas, `exchange` here is a plain string with no enum validation, so an unknown exchange is not rejected at the API boundary. It simply fails to match any position and the response comes back with `quantity` of `0`. Use a valid exchange code from [Order Constants](../order-constants.md).

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| status | string | "success" or "error" |
| quantity | string or number | Net position quantity, passed through unchanged from the position book. Most brokers normalize it to a string, but the "no matching position" fallback is the integer `0`. Coerce it on the client rather than comparing types |
| mode | string | `"analyze"` in analyzer mode. The key is **absent** in live mode |

The value is returned at the top level; there is no `data` wrapper on this endpoint.

## Understanding Position Quantity

| Quantity Value | Meaning |
|----------------|---------|
| Positive (+ve) | Long position (bought more than sold) |
| Negative (-ve) | Short position (sold more than bought) |
| Zero (0) | No open position (flat) |

## Notes

- This endpoint is useful for **position-based strategies** to check current holdings
- Returns **0** if no position exists for the symbol-exchange-product combination
- The position is fetched from the position book and filtered by the specified criteria
- Use with [PlaceSmartOrder](./placesmartorder.md) for position-aware trading
- For F&O positions, ensure you specify the correct product type (MIS or NRML)

## Use Cases

- **Position verification**: Check if a position exists before placing orders
- **Smart order logic**: Calculate order quantity based on current position
- **Risk management**: Monitor position size

## Related Endpoints

- [PositionBook](../accounts-api/positionbook.md) - Get all positions
- [PlaceSmartOrder](./placesmartorder.md) - Position-aware orders

---

**Back to**: [API Documentation](../README.md)
