# Tradeboard MQL5 Functions

Below is the API documentation for the TradeboardAPI functions provided in your MQL5 header file:

***

## TradeboardAPI Function Documentation

All six functions are `void`. They print the request and the Tradeboard response to the Experts log rather than returning a value, so read the log (or the Tradeboard order book) to confirm what happened.

Each function takes `apiUrlParam` as the base URL of your Tradeboard instance, for example `http://127.0.0.1:5000`, and appends the endpoint path itself.

### `PlaceOrder`

Places an order with the specified parameters by sending a POST request to `/api/v1/placeorder`.

```mql5
void PlaceOrder(string actionParam,
                int quantityParam,
                string apiUrlParam,
                string apiKeyParam,
                string strategyParam,
                string symbolParam,
                Exchanges exchangeParam,
                ProductTypes productParam,
                PriceTypes priceTypeParam,
                double priceParam = 0,
                double triggerPriceParam = 0,
                int disclosedQuantityParam = 0)
```

#### Parameters:

* `actionParam`: The trade action, either "BUY" or "SELL".
* `quantityParam`: The quantity of the asset to trade, in units and not lots.
* `apiUrlParam`: The base URL of the Tradeboard API.
* `apiKeyParam`: The Tradeboard API key, generated on the API Key page of the dashboard. This is not your broker's API key.
* `strategyParam`: The name of the trading strategy. Tradeboard records it against every order.
* `symbolParam`: The Tradeboard symbol for the instrument being traded.
* `exchangeParam`: An `Exchanges` enum value (NSE, NFO, CDS, BSE, BFO, BCD, MCX, NCDEX).
* `productParam`: A `ProductTypes` enum value (CNC, NRML, MIS).
* `priceTypeParam`: A `PriceTypes` enum value (MARKET, LIMIT, SL, SLM). SLM is sent as `SL-M`.
* `priceParam` (optional): The price at which to place the order. Required for LIMIT and SL.
* `triggerPriceParam` (optional): The trigger price for SL and SL-M orders.
* `disclosedQuantityParam` (optional): The disclosed quantity of the order.

The three optional numeric parameters are only written into the JSON body when they are greater than zero, so leaving them at their defaults keeps the payload minimal.

#### Usage:

```mql5
PlaceOrder("BUY", 10, "http://127.0.0.1:5000", "your_api_key", "Meta Strategy", "SBIN", NSE, MIS, MARKET);
```

### `PlaceSmartOrder`

Places an order that considers the current open position size and matches the position size given in the position book. Sends a POST request to `/api/v1/placesmartorder`.

```mql5
void PlaceSmartOrder(string actionParam,
                     int quantityParam,
                     int positionSizeParam,
                     string apiUrlParam,
                     string apiKeyParam,
                     string strategyParam,
                     string symbolParam,
                     Exchanges exchangeParam,
                     ProductTypes productParam,
                     PriceTypes priceTypeParam,
                     double priceParam = 0,
                     double triggerPriceParam = 0,
                     int disclosedQuantityParam = 0)
```

#### Parameters:

* Inherits all parameters from `PlaceOrder`.
* `positionSizeParam`: The target position size. It sits third, immediately after `quantityParam`.

Tradeboard compares `positionSizeParam` with your live open position for that symbol, exchange and product, then places only the difference. A target of `0` flattens the position, and in that case Tradeboard works out the direction itself, so `actionParam` and `quantityParam` are ignored. If the position already matches the target, no order goes to the broker.

#### Usage:

```mql5
PlaceSmartOrder("SELL", 5, 10, "http://127.0.0.1:5000", "your_api_key", "ReversalStrategy", "TATASTEEL", NSE, MIS, LIMIT, 150.00);
```

### `ModifyOrder`

Modifies an existing order with new parameters. Sends a POST request to `/api/v1/modifyorder`.

```mql5
void ModifyOrder(string orderidParam,
                 string actionParam,
                 int quantityParam,
                 double priceParam,
                 string apiUrlParam,
                 string apiKeyParam,
                 string strategyParam,
                 string symbolParam,
                 Exchanges exchangeParam,
                 ProductTypes productParam,
                 PriceTypes priceTypeParam,
                 int disclosedQuantityParam = 0,
                 double triggerPriceParam = 0)
```

#### Parameters:

* `orderidParam`: The ID of the order to be modified, as returned by Tradeboard when the order was placed.
* `priceParam`: Mandatory here, unlike in `PlaceOrder`. It sits fourth, right after `quantityParam`.
* The remaining parameters match `PlaceOrder`.

Note the tail of the argument list: in `ModifyOrder` the optional `disclosedQuantityParam` comes BEFORE `triggerPriceParam`, which is the reverse of `PlaceOrder` and `PlaceSmartOrder`. `/api/v1/modifyorder` requires every field, so this function always sends price, quantity, disclosed quantity and trigger price, even when they are zero.

#### Usage:

```mql5
ModifyOrder("123456789", "BUY", 10, 155.00, "http://127.0.0.1:5000", "your_api_key", "Meta Strategy", "YESBANK", NSE, CNC, LIMIT);
```

### `CancelOrder`

Cancels an existing order. Sends a POST request to `/api/v1/cancelorder`.

```mql5
void CancelOrder(string orderidParam,
                 string apiUrlParam,
                 string apiKeyParam,
                 string strategyParam)
```

#### Parameters:

* `orderidParam`: The ID of the order to be canceled.
* `apiUrlParam`: The base URL of the Tradeboard API.
* `apiKeyParam`: The Tradeboard API key.
* `strategyParam`: The name of the trading strategy.

#### Usage:

```mql5
CancelOrder("123456789", "http://127.0.0.1:5000", "your_api_key", "Meta Strategy");
```

### `ClosePosition`

Closes all open positions associated with a given strategy. Sends a POST request to `/api/v1/closeposition`.

```mql5
void ClosePosition(string apiUrlParam,
                   string apiKeyParam,
                   string strategyParam)
```

#### Parameters:

* `apiUrlParam`: The base URL of the Tradeboard API.
* `apiKeyParam`: The Tradeboard API key.
* `strategyParam`: The name of the trading strategy to close positions for.

#### Usage:

```mql5
ClosePosition("http://127.0.0.1:5000", "your_api_key", "Meta Strategy");
```

### `CancelAllOrders`

Cancels all orders associated with a given strategy. Sends a POST request to `/api/v1/cancelallorder`.

```mql5
void CancelAllOrders(string apiUrlParam,
                     string apiKeyParam,
                     string strategyParam)
```

#### Parameters:

* `apiUrlParam`: The base URL of the Tradeboard API.
* `apiKeyParam`: The Tradeboard API key.
* `strategyParam`: The name of the trading strategy to cancel orders for.

#### Usage:

```mql5
CancelAllOrders("http://127.0.0.1:5000", "your_api_key", "Meta Strategy");
```

***

**Notes**

* Replace placeholder values like `"your_api_key"` and `"http://127.0.0.1:5000"` with the actual key and URL for your setup.
* `symbolParam` is the Tradeboard symbol, not the MetaTrader symbol. Equities carry no `-EQ` suffix, so use `SBIN`, not `SBIN-EQ`.
* The transport is `wininet.dll`, so **Allow DLL imports** must be enabled for the EA. MQL5's `WebRequest()` allowlist is not involved.
* Tradeboard rate limits order placement to 10 requests per second. Guard your EA against firing on every tick.
* This library covers order management only. Market data, the order book, positions and holdings are reached by calling the Tradeboard REST API directly.
