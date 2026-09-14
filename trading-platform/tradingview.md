# Tradingview

TradingView is a popular charting and analysis platform used by traders for market analysis, and it also offers features that support automated trading through the use of webhooks.

#### What is a Webhook?

A webhook is a method for an app to provide other applications with real-time information. A webhook delivers data to other applications as it happens, meaning you get data immediately. In the context of TradingView, webhooks are used to send signals or alerts to external systems (like a brokerage or a trading bot) whenever certain predefined conditions are met.

#### Setting up Automated Trading using TradingView Webhooks

1. **Define Trading Strategy**: First, you create a trading strategy in TradingView using its Pine Script programming language. This strategy could be based on technical analysis indicators, patterns, or other criteria.
2. **Configure Alerts**: Once your strategy is defined, you set up alerts in TradingView that trigger when specific conditions of your strategy are met. These conditions could be anything that your strategy considers a signal, such as the crossing of moving averages or reaching a certain RSI level.
3. **Set Up Webhook URL**: In the alert settings, you specify a webhook URL to which TradingView will send POST requests when the alert conditions are triggered. This URL is typically provided by the external service or trading bot that will execute the trades on your behalf. It's essential to ensure that this service can accept and process TradingView's webhook notifications.

**Tradeboard Configuration**

> TradingView cannot reach `127.0.0.1` or `localhost`. Your Tradeboard instance has to be reachable from the internet. Expose it with ngrok, Cloudflare Tunnel, a VS Code Dev Tunnel or a custom domain, then set `HOST_SERVER` in the `.env` file to that external URL and restart Tradeboard. The TradingView page shows a red warning banner for as long as `HOST_SERVER` still points at localhost.

Login to the Tradeboard Application, open **Trading Platforms** from the navigation menu (`/platforms`) and click the **TradingView** card. That opens the **TradingView Configuration** page at `/tradingview`, which contains the JSON generator.

<figure><img src="/assets/image (27).png" alt=""><figcaption></figcaption></figure>

**Alert modes**

The generator has two tabs, and the tab you pick decides both the webhook URL and the payload it produces.

* **Strategy Alert**: for Pine Script `strategy()` scripts. Posts to `/api/v1/placesmartorder` and fills the payload with TradingView placeholders so the same alert handles entries, exits and reversals. Tradeboard reconciles the incoming `position_size` against your actual open position, so a repeated alert does not stack duplicate orders.
* **Line Alert**: for a plain price line, indicator condition or drawing alert with no strategy behind it. Posts to `/api/v1/placeorder` with a fixed **Action** (BUY or SELL) and a fixed **Quantity** that you choose in the form.

**Filling the form**

Type at least two characters in the **Symbol** box and pick a match from the autocomplete list. Selecting a result fills in the exchange for you. Then choose the **Exchange** and the **Product Type** (MIS for intraday, NRML for carry forward, CNC for delivery). The product selector is hidden for crypto brokers such as Delta Exchange because they ignore it. In **Line Alert** mode you also choose **Action** and **Quantity**.

The JSON regenerates as you type, and the **Generate JSON** button forces a refresh. Your API key is pulled in automatically and embedded in the payload, so treat the generated JSON as a secret.

**Strategy Alert payload**

Webhook URL: `https://your-tradeboard-domain/api/v1/placesmartorder`

```json
{
  "apikey": "your_api_key_here",
  "strategy": "TradingView Strategy",
  "symbol": "NHPC",
  "exchange": "NSE",
  "action": "{{strategy.order.action}}",
  "product": "MIS",
  "pricetype": "MARKET",
  "quantity": "{{strategy.order.contracts}}",
  "position_size": "{{strategy.position_size}}"
}
```

**Line Alert payload**

Webhook URL: `https://your-tradeboard-domain/api/v1/placeorder`

```json
{
  "apikey": "your_api_key_here",
  "strategy": "TradingView Line Alert",
  "symbol": "NHPC",
  "exchange": "NSE",
  "action": "BUY",
  "product": "MIS",
  "pricetype": "MARKET",
  "quantity": "1"
}
```

Copy the Webhook URL and the Alert Message for a Tradingview Strategy and configure the same in your tradingview strategy

<figure><img src="/assets/image (28).png" alt=""><figcaption></figcaption></figure>

Enter the Webhook URL

<figure><img src="/assets/image (29).png" alt=""><figcaption></figcaption></figure>

**Notes and limits**

* Both endpoints accept `MARKET`, `LIMIT`, `SL` and `SL-M` in `pricetype`, but the generator always emits `MARKET`. Edit the JSON by hand if you need a limit order, and add `price` (and `trigger_price` for SL and SL-M).
* Both endpoints are rate limited to 10 requests per second by default, from `ORDER_RATE_LIMIT` and `SMART_ORDER_RATE_LIMIT` in `.env`.
* Quantity is the total number of units, not the number of lots. For futures and options send the full contract quantity.
* For a non-crypto exchange the quantity must be a whole number. Fractional quantities are rejected.
