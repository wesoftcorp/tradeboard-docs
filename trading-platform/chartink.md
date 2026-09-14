# ChartInk

Tradeboard supports integration with Chartink for automated trading based on scanner alerts. This integration allows you to:

* Create and manage trading strategies
* Configure symbols with quantities and product types
* Currently Supports only NSE and BSE Symbols
* Handle intraday and positional strategies
* Automate order placement based on Chartink alerts
* Auto square-off positions for intraday strategies

<figure><img src="/assets/Screenshot 2024-12-17 at 3.38.04 PM.png" alt=""><figcaption></figcaption></figure>

### Requirements

ChartInk Paid Account (Supports Webhook Features to send Alerts to Tradeboard)

Ngrok with Custom Domain Configuration (Provides Webhooks to Chartink/Tradingview) if hosted locally in Laptop/Desktop.&#x20;

Configure the .env file with Custom Domain  (you cannot run Chartink by default with localhost or 127.0.0.1:5000)

### Order Processing System

#### Queue Management

Tradeboard uses a dual-queue system to handle orders efficiently:

1. Regular Order Queue (Entry Orders):
   * Handles BUY and SHORT orders
   * Processes up to 10 orders per second
   * Orders are batched for maximum throughput
   * Example: 50 BUY orders complete in \~5 seconds
2. Smart Order Queue (Exit Orders):
   * Handles SELL and COVER orders
   * Maintains 1-second delay between orders
   * Higher priority than entry orders
   * Example: 50 SELL orders complete in \~50 seconds
3. Multiple Strategy Handling:
   * All strategies share the same queues
   * Exit orders always processed before entries
   * Rate limits maintained across strategies
   * Each strategy respects its trading hours
4. Auto Square-off Processing:
   * Uses smart order queue
   * 1-second delay between position closures
   * Processes positions sequentially
   * Example: 20 positions take \~20 seconds to close

### Setting Up a Strategy

<figure><img src="/assets/Screenshot 2024-12-17 at 3.39.35 PM.png" alt=""><figcaption></figcaption></figure>

1. Open **Trading Platforms** from the Tradeboard navigation menu (`/platforms`) and click the **Chartink** card, which takes you to `/chartink`
2. Click "New Strategy" button
3. Fill in the strategy details:
   * Name: A unique name for your strategy (will be prefixed with 'chartink\_'). Only letters, numbers, spaces, hyphens and underscores are accepted.
   * Type: Choose between Intraday or Positional
   * For Intraday strategies:
     * Start Time: Trading start time (default: 09:15)
     * End Time: Trading end time (default: 15:00)
     * Square Off Time: Auto square-off time (default: 15:15)
     * The three times are validated as start time < end time < square off time. A strategy that breaks that order is rejected.

<figure><img src="/assets/Screenshot 2024-12-17 at 4.31.16 PM.png" alt=""><figcaption></figcaption></figure>

### Alert Name Keywords

<figure><img src="/assets/Screenshot 2024-12-17 at 3.41.35 PM.png" alt=""><figcaption></figcaption></figure>

The alert name in Chartink MUST include one of these keywords (not case-sensitive):

1. **BUY** - For entering long positions
   * Examples:
     * "BUY Alert"
     * "Alert for BUY 2024-12-13"
     * "Supertrend BUY Signal"
2. **SELL** - For exiting long positions or regular selling
   * Examples:
     * "SELL Alert"
     * "Alert for SELL 2024-12-13"
     * "Supertrend SELL Signal"
3. **SHORT** - For entering short positions (selling first)
   * Examples:
     * "SHORT Alert"
     * "Alert for SHORT 2024-12-13"
     * "Supertrend SHORT Signal"
4. **COVER** - For exiting short positions (buying to cover)
   * Examples:
     * "COVER Alert"
     * "Alert for COVER 2024-12-13"
     * "Supertrend COVER Signal"

<figure><img src="/assets/Screenshot 2024-12-17 at 4.10.01 PM.png" alt=""><figcaption></figcaption></figure>

#### Keyword Rules

* Keywords can appear anywhere in the alert name
* Keywords are not case-sensitive (buy/BUY/Buy all work)
* Alert will fail if no valid keyword is found
* Only one action will be taken even if multiple keywords are present

### Configuring Symbols

After creating a strategy, you need to configure the symbols to trade:

1. Click "Configure Symbols" on your strategy
2. Add symbols individually:
   * Search and select Symbol (with exchange badge)
   * Select Exchange. Only NSE and BSE are accepted here.
   * Enter Quantity, in units and not lots
   * Select Product Type. Only MIS and CNC are accepted. NRML is not offered, because Chartink strategies are equity only.
3.  Or bulk add symbols using CSV format, one row per symbol as `ChartinkSymbol,Exchange,Quantity,Product`:

    ```
    RELIANCE,NSE,10,MIS
    HDFCBANK,NSE,5,CNC
    TATASTEEL,BSE,15,MIS
    ```

<figure><img src="/assets/Screenshot 2024-12-17 at 3.42.54 PM.png" alt=""><figcaption></figcaption></figure>

### Setting Up Chartink Alert

**Creating a Scanner**

1. Goto [Chartink Scanner Dashboard](https://chartink.com/scan_dashboard)
2. Click "Create a new scanner" button
3. Create the Scanner conditions and Press Save Scan
4. Enter an alert name that includes one of the action keywords

<figure><img src="/assets/Screenshot 2024-12-17 at 3.47.00 PM.png" alt=""><figcaption></figcaption></figure>

Creating Alert

1. Once the Scanner is Saved Click Create Alert
2. Find the "Webhook url(optional)" field
3.  Copy and paste your strategy's webhook URL:

    ```
    https://your-tradeboard-domain/chartink/webhook/<webhook-id>
    ```
4. Configure other alert settings as needed
5. Click "Save alert" button

<figure><img src="/assets/Screenshot 2024-12-17 at 3.52.43 PM.png" alt=""><figcaption></figcaption></figure>

### How It Works

1. When your scanner conditions are met, Chartink sends an alert to your webhook URL
2. Tradeboard receives the alert and:
   * Validates the webhook ID
   * Checks if strategy is active
   * Validates the alert name for action keyword
   * For intraday strategies, checks if within trading hours
   * Matches symbols from alert with your configured symbols
   * Places orders according to your configuration

#### Intraday Trading

For intraday strategies:

* Orders are only placed between Start Time and End Time
* At Square Off Time, all open positions are automatically closed
* Uses MIS product type for better leverage

#### Positional Trading

For positional strategies:

* Orders can be placed any time during market hours
* No automatic square-off
* Uses CNC product type for delivery trades

### Order Placement

When a Chartink alert is received:

*   For entries (a BUY or SHORT keyword in the scan name), sent to `/api/v1/placeorder`:

    ```
    {
      "apikey": "your-api-key",
      "strategy": "Strategy Name",
      "symbol": "SYMBOL",
      "exchange": "NSE/BSE",
      "action": "BUY or SELL",
      "product": "MIS/CNC",
      "pricetype": "MARKET",
      "quantity": "configured-quantity"
    }
    ```

    Note that `action` is always `BUY` or `SELL` on the wire. SHORT becomes `SELL` and COVER becomes `BUY`; the SHORT and COVER keywords exist only to tell Tradeboard whether the alert is an entry or an exit.
*   For exits and for the scheduled square-off, sent to `/api/v1/placesmartorder`:

    ```
    {
      "apikey": "your-api-key",
      "strategy": "Strategy Name",
      "symbol": "SYMBOL",
      "exchange": "NSE/BSE",
      "action": "SELL",
      "product": "MIS",
      "pricetype": "MARKET",
      "quantity": "0",
      "position_size": "0",
      "price": "0",
      "trigger_price": "0",
      "disclosed_quantity": "0"
    }
    ```

    With `position_size` set to `0`, Tradeboard looks up the live open position and flattens it, working out the direction itself. The `action` field in this payload is therefore ignored, and if the position is already flat no order reaches the broker.

### Strategy Management

#### Activation/Deactivation

* Active strategies process incoming alerts
* Inactive strategies ignore alerts
* Toggle status from strategy view

#### Symbol Management

* Add/remove symbols any time
* Update quantities as needed
* View all configured symbols with exchange badges
* Bulk import for multiple symbols
* Delete confirmation for symbol removal

#### Time Controls

For intraday strategies:

* Start Time: When to start accepting alerts
* End Time: When to stop accepting alerts
* Square Off Time: When to close all positions

### Best Practices

1. Use Chartink Custom Watchlists
   * Create custom watchlists with only your trading symbols
   * Avoid scanning large portfolios like NIFTY500, NIFTY200
   * Helps manage positions efficiently
   * Reduces processing time for orders
   * Better control over trading universe
2. Test your strategy with small quantities first
   * Verify order placement
   * Check position management
   * Monitor square-off process
   * Validate webhook integration
3. Use proper stop-losses in your Chartink scanner
   * Implement risk management rules
   * Set appropriate price conditions
   * Add volume filters if needed
4. Monitor the first few alerts
   * Verify order execution
   * Check processing times
   * Validate symbol matching
   * Ensure proper position tracking
5. Keep your webhook URL private
   * Don't share webhook URLs
   * Regularly check for unauthorized alerts
   * Monitor strategy activity
6. Include action keyword in scan name
   * Use clear, consistent naming
   * Follow keyword rules strictly
   * Avoid multiple keywords
7. For intraday strategies:
   * Ensure orders are placed during trading hours
   * Monitor square-off at configured time
   * Plan for processing delays with large lists
8. For large symbol lists:
   * Entry orders process faster (10/sec)
   * Exit orders take longer (1/sec)
   * Plan strategy timing accordingly
   * Consider splitting into multiple strategies

### Error Handling

Tradeboard handles various error scenarios:

* Invalid webhook IDs
* Missing action keywords in alert names
* Inactive strategies
* Outside trading hours
* Symbol mismatches
* Order placement failures

All errors are logged and can be viewed in the API analyzer.

### Limitations

1. Only supports NSE and BSE exchanges
2. Intraday square-off is all-or-nothing
3. No partial position closures
4. No modification of existing orders
5. Market orders only
6. Alert name must contain valid action keyword

### Security

* Each strategy has a unique webhook ID
* API keys are required for order placement
* Session validation for web interface
* Secure storage of credentials
* Rate limiting on the webhook endpoint, 100 requests per minute by default (`WEBHOOK_RATE_LIMIT`)
* Confirmation dialogs for deletions

### Troubleshooting

1. Check strategy status (active/inactive)
2. Verify trading hours for intraday
3. Confirm symbol configurations
4. Check alert name contains valid keyword
5. Check API analyzer for errors
6. Verify webhook URL in Chartink

### Support

For issues or questions:

1. Check the logs in API analyzer
2. Review error messages
3. Contact support with:
   * Strategy ID
   * Error details
   * Time of occurrence
   * Relevant logs
   * Alert name and webhook URL used
