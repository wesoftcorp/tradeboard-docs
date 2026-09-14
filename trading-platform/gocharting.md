---
description: GoCharting Webhook Setup Guide
---

# GoCharting

### Overview

GoCharting is a professional HTML5 charting platform optimized for Indian markets. With a **Premium Plan**, you can set up webhook alerts to automate your trading strategies with Tradeboard.

***

### Prerequisites

#### 1. GoCharting Premium Plan

* Webhook alerts are only available on the **GoCharting Premium Plan**
* Subscribe at [GoCharting](https://gocharting.com) to access webhook features

<figure><img src="/assets/image (140).png" alt=""><figcaption></figcaption></figure>

#### 2. Tradeboard Setup

* Tradeboard instance running and accessible
* API key configured in Tradeboard
* Broker connected and authenticated

#### 3. Public URL Configuration

**Option A: Production/Custom Domain**

If you have a custom domain or server:

1. Open your `.env` file
2.  Update the `HOST_SERVER` variable:

    ```env
    HOST_SERVER=https://sub.yourdomain.com
    ```

**Option B: Local Development with Tunneling**

If you're running Tradeboard locally (on your computer) and want to test webhooks, you'll need to expose your local server to the internet using a tunneling service.

**Popular Tunneling Services:**

* **DevTunnel** (Microsoft) - Good for Visual Studio users
* **ngrok** - Popular cross-platform option
* **localtunnel** - Free and simple alternative
* **Cloudflare Tunnel** - Enterprise-grade option

**How Tunneling Works:**

1. Your local Tradeboard runs on `http://127.0.0.1:5000`
2. Tunneling service creates a public URL pointing to your local server
3. GoCharting can send webhooks to this public URL
4. The tunnel forwards requests to your local Tradeboard

**Typical URL Formats:**

* DevTunnel: `https://abc123.devtunnels.ms`
* ngrok: `https://abc123.ngrok.io`
* localtunnel: `https://abc123.loca.lt`

**Setup Steps:**

1. Install and configure your chosen tunneling service
2. Start the tunnel pointing to port 5000 (Tradeboard's default port)
3. Copy the public URL provided by the tunneling service
4.  Update your `.env` file:

    ```env
    HOST_SERVER=https://your-tunnel-url.com
    ```
5. Restart Tradeboard application

**Important Notes:**

* Tunnel URLs may change each time you restart (unless using paid plans)
* Free tier tunnels may have bandwidth/time limitations
* Update the webhook URL in GoCharting if your tunnel URL changes
* For production use, consider a custom domain instead of tunneling

***

### Step-by-Step Setup

#### Step 1: Generate Webhook Configuration

**Login to Tradeboard**

* Navigate to your Tradeboard dashboard
* Go to **Trading Platforms** from the main navigation menu (`/platforms`)

<figure><img src="/assets/image (141).png" alt=""><figcaption></figcaption></figure>

**Open GoCharting Configuration**

* Click the **GoCharting** card
* You'll be redirected to `/gocharting`

<figure><img src="/assets/image (142).png" alt=""><figcaption></figcaption></figure>

**Configure Your Trade Parameters**

* **Symbol**: type at least two characters and pick a match from the autocomplete list. Selecting a result also fills in the exchange.
* **Exchange**: the list is built from what your connected broker actually supports.
* **Product Type**: MIS (intraday), NRML (carry forward) or CNC (delivery). This selector is hidden for crypto brokers such as Delta Exchange because they ignore it.
* **Action**: BUY or SELL.
* **Quantity**: total units, not lots. For futures and options send the full contract quantity.

Your API key is read from Tradeboard automatically and embedded in the generated payload, so treat the JSON as a secret.

1. **Generate JSON**
   * The JSON regenerates as you change the form. The **"Generate JSON"** button forces a refresh.
   * The webhook configuration is displayed on the right side
2. **Copy Configuration**
   *   **Webhook URL**: Click "Copy" button next to the webhook URL

       ```bash
       https://yourdomain.com/api/v1/placeorder
       ```
   *   **JSON Payload**: Click "Copy" button to copy the generated JSON

       ```json
       {
         "apikey": "your_api_key_here",
         "strategy": "GoCharting Alert",
         "symbol": "SAIL",
         "exchange": "NSE",
         "action": "BUY",
         "product": "MIS",
         "pricetype": "MARKET",
         "quantity": "10"
       }
       ```

***

#### Step 2: Create Alert in GoCharting

**Open GoCharting Chart**

* Login to your GoCharting Premium account
* Open the chart for your desired instrument

<figure><img src="/assets/image (143).png" alt=""><figcaption></figcaption></figure>

**Set Alert Conditions**

* Right-click on the chart or use the alert button
* Click **"Create Alert"**

Configure the alert parameters:

**Setup Messaging**

* **Name**: Give your alert a descriptive name (e.g., "SAIL BUY ALERT")
*   **Message**: Paste your copied JSON payload here

    ```json
    {
      "apikey": "your_api_key_here",
      "strategy": "GoCharting Alert",
      "symbol": "SAIL",
      "exchange": "NSE",
      "action": "BUY",
      "product": "MIS",
      "pricetype": "MARKET",
      "quantity": "10"
    }
    ```

**Webhook URL**: Paste your Tradeboard webhook URL

```
https://yourdomain.com/api/v1/placeorder
```

1. **Create the Alert**
   * Review all settings
   * Click **"CREATE ALERT"** button
   * Your alert is now active!

***

***

### Support & Resources

#### Documentation

* Tradeboard Docs: https://docs.algo.wesoftcorp.com
* GoCharting Help: [https://gocharting.com/docs/scripting/webhookalertsforalgotrading](https://gocharting.com/docs/scripting/webhookalertsforalgotrading)

#### Community

* Tradeboard GitHub: https://github.com/wesoftcorp/tradeboard-docs
* Report Issues: https://github.com/wesoftcorp/tradeboard-docs/issues

#### Video Tutorials

* Check Tradeboard YouTube channel for video guides
* GoCharting tutorials for alert setup

***
