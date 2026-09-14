# Margin

Calculate margin requirement for a basket of positions. Useful for pre-trade margin checks.

## Endpoint URL

```http
Local Host   :  POST http://127.0.0.1:5000/api/v1/margin
Ngrok Domain :  POST https://<your-ngrok-domain>.ngrok-free.app/api/v1/margin
Custom Domain:  POST https://<your-custom-domain>/api/v1/margin
```

## Sample API Request

```json
{
  "apikey": "<your_app_apikey>",
  "positions": [
    {
      "symbol": "NIFTY25NOV2525000CE",
      "exchange": "NFO",
      "action": "BUY",
      "product": "NRML",
      "pricetype": "MARKET",
      "quantity": "65"
    },
    {
      "symbol": "NIFTY25NOV2525500CE",
      "exchange": "NFO",
      "action": "SELL",
      "product": "NRML",
      "pricetype": "MARKET",
      "quantity": "65"
    }
  ]
}
```

## Sample cURL Request

```bash
curl -X POST http://127.0.0.1:5000/api/v1/margin \
  -H 'Content-Type: application/json' \
  -d '{
  "apikey": "<your_app_apikey>",
  "positions": [
    {
      "symbol": "NIFTY25NOV2525000CE",
      "exchange": "NFO",
      "action": "BUY",
      "product": "NRML",
      "pricetype": "MARKET",
      "quantity": "65"
    },
    {
      "symbol": "NIFTY25NOV2525500CE",
      "exchange": "NFO",
      "action": "SELL",
      "product": "NRML",
      "pricetype": "MARKET",
      "quantity": "65"
    }
  ]
}'
```

## Sample API Response

```json
{
  "status": "success",
  "data": {
    "total_margin_required": 91555.7625,
    "span_margin": 0.0,
    "exposure_margin": 91555.7625
  }
}
```

## Request Body

| Parameter | Description | Mandatory/Optional | Default Value |
|-----------|-------------|-------------------|---------------|
| apikey | Your Tradeboard API key | Mandatory | - |
| positions | Array of 1 to 50 position objects | Mandatory | - |

`MarginCalculatorSchema` declares only `apikey` and `positions`. Any other top-level field returns HTTP 400.

### Position Object Fields

| Field | Description | Mandatory/Optional | Default Value |
|-------|-------------|-------------------|---------------|
| symbol | Trading symbol, 1 to 50 characters | Mandatory | - |
| exchange | Any value in the shared `VALID_EXCHANGES` list | Mandatory | - |
| action | BUY or SELL (lowercase accepted) | Mandatory | - |
| quantity | Position quantity, sent as a **string** | Mandatory | - |
| product | Product type: MIS, CNC, NRML | Mandatory | - |
| pricetype | Price type: MARKET, LIMIT, SL, SL-M | Mandatory | - |
| price | Order price, sent as a **string** | Optional | `"0"` |
| trigger_price | Trigger price, sent as a **string** | Optional | `"0"` |

`quantity`, `price`, and `trigger_price` are declared as string fields to match the existing API contract; their numeric ranges are checked in the service layer, not by marshmallow. Sending them as JSON numbers returns HTTP 400. These eight keys are the whole item schema; anything else returns HTTP 400 for the entire request.

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| status | string | "success" or "error" |
| data | object | Margin calculation results |

### Data Object Fields

| Field | Type | Description |
|-------|------|-------------|
| total_margin_required | number | Total margin required for the basket |
| span_margin | number | SPAN margin component. `0` for brokers that do not break it out |
| exposure_margin | number | Exposure margin component. `0` for brokers that do not break it out |
| margin_benefit | number | Margin benefit from hedged positions. Broker-dependent: only some broker mappers emit this key, so treat it as optional |

## Notes

- Between **1 and 50 positions** per request
- Margin calculation includes **hedging benefits** for spread positions
- Actual margin may vary slightly due to real-time price changes
- Brokers without a `margin_api` module return HTTP 501 with a "not supported" message
- Use this for **pre-trade validation** to check if sufficient margin exists

## Use Cases

- **Pre-trade check**: Verify margin before placing orders
- **Strategy planning**: Calculate margin for option strategies
- **Risk management**: Understand margin exposure

## Example: Iron Condor Margin

```json
{
  "apikey": "<your_app_apikey>",
  "positions": [
    {"symbol": "NIFTY25NOV2526500CE", "exchange": "NFO", "action": "SELL", "quantity": "65", "product": "NRML", "pricetype": "MARKET"},
    {"symbol": "NIFTY25NOV2527000CE", "exchange": "NFO", "action": "BUY", "quantity": "65", "product": "NRML", "pricetype": "MARKET"},
    {"symbol": "NIFTY25NOV2525500PE", "exchange": "NFO", "action": "SELL", "quantity": "65", "product": "NRML", "pricetype": "MARKET"},
    {"symbol": "NIFTY25NOV2525000PE", "exchange": "NFO", "action": "BUY", "quantity": "65", "product": "NRML", "pricetype": "MARKET"}
  ]
}
```

---

**Back to**: [API Documentation](../README.md)
