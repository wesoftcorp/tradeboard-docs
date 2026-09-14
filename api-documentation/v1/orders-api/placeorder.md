# PlaceOrder

Place a new order with the broker.

## Endpoint URL

```http
Local Host   :  POST http://127.0.0.1:5000/api/v1/placeorder
Ngrok Domain :  POST https://<your-ngrok-domain>.ngrok-free.app/api/v1/placeorder
Custom Domain:  POST https://<your-custom-domain>/api/v1/placeorder
```

## Sample API Request (Market Order)

```json
{
  "apikey": "<your_app_apikey>",
  "strategy": "Python",
  "symbol": "NHPC",
  "action": "BUY",
  "exchange": "NSE",
  "pricetype": "MARKET",
  "product": "MIS",
  "quantity": "1"
}
```

## Sample cURL Request

```bash
curl -X POST http://127.0.0.1:5000/api/v1/placeorder \
  -H 'Content-Type: application/json' \
  -d '{
  "apikey": "<your_app_apikey>",
  "strategy": "Python",
  "symbol": "NHPC",
  "action": "BUY",
  "exchange": "NSE",
  "pricetype": "MARKET",
  "product": "MIS",
  "quantity": "1"
}'
```

## Sample API Response

```json
{
  "orderid": "250408000989443",
  "status": "success"
}
```

## Sample API Request (Limit Order)

```json
{
  "apikey": "<your_app_apikey>",
  "strategy": "Python",
  "symbol": "YESBANK",
  "action": "BUY",
  "exchange": "NSE",
  "pricetype": "LIMIT",
  "product": "MIS",
  "quantity": "1",
  "price": "16",
  "trigger_price": "0",
  "disclosed_quantity": "0"
}
```

## Sample API Response (Limit Order)

```json
{
  "orderid": "250408001003813",
  "status": "success"
}
```

## Sample API Request (Stop-Loss Order)

```json
{
  "apikey": "<your_app_apikey>",
  "strategy": "Python",
  "symbol": "RELIANCE",
  "action": "SELL",
  "exchange": "NSE",
  "pricetype": "SL",
  "product": "MIS",
  "quantity": "1",
  "price": "1180",
  "trigger_price": "1185"
}
```

## Request Body

| Parameter | Description | Mandatory/Optional | Default Value |
|-----------|-------------|-------------------|---------------|
| apikey | Your Tradeboard API key | Mandatory | - |
| strategy | Strategy identifier for tracking | Mandatory | - |
| symbol | Trading symbol (e.g., RELIANCE, NIFTY30JAN25FUT) | Mandatory | - |
| action | Order action: BUY or SELL | Mandatory | - |
| exchange | Exchange code accepted by the shared validation constants | Mandatory | - |
| pricetype | Price type: MARKET, LIMIT, SL, SL-M | Optional | MARKET |
| product | Product type: MIS, CNC, NRML | Optional | MIS |
| quantity | Order quantity. Must be greater than 0 | Mandatory | - |
| price | Order price (required for LIMIT and SL orders) | Optional | 0 |
| trigger_price | Trigger price (required for SL and SL-M orders) | Optional | 0 |
| disclosed_quantity | Disclosed quantity for iceberg orders | Optional | 0 |

These eleven fields are the complete public `OrderSchema`. Any other field returns HTTP 400. The schema also declares `underlying_ltp`, which the options-order path populates internally as an execution reference; external callers should not send it.

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| status | string | "success" or "error" |
| orderid | string | Unique order ID from broker (on success) |
| message | string | Error message (on error) |
| mode | string | `"analyze"` in analyzer mode. The key is **absent** in live mode; there is no `"mode": "live"` |

## Notes

- For **MARKET** orders, price and trigger_price are not required
- For **LIMIT** orders, price is required
- For **SL** (Stop-Loss Limit) orders, both price and trigger_price are required
- For **SL-M** (Stop-Loss Market) orders, only trigger_price is required
- The **symbol** must be in Tradeboard standard format:
  - Equity: `RELIANCE`
  - Futures: `NIFTY30JAN25FUT`
  - Options: `NIFTY30JAN2525000CE`
- Use **MIS** for intraday, **CNC** for equity delivery, **NRML** for F&O overnight positions
- Fractional quantities are accepted only when `exchange` is `CRYPTO`. Other exchanges reject fractional values during schema validation.

---

**Back to**: [API Documentation](../README.md)
