# Telegram

### Overview

The Tradeboard Telegram Bot provides a convenient interface to your trading account through Telegram. It gives you read access to orders, trades, positions, holdings, funds, P\&L, quotes and charts, and it also exposes a small set of remote actions: closing all positions, stopping running Python strategies, and switching the instance between Live and Analyze mode. Order alerts are pushed to you automatically when orders flow through the Tradeboard API.

### Features

* **Account Linking**: Securely link your Tradeboard account using an API key and host URL
* **Real-time Data Access**: View orderbook, tradebook, positions, holdings, and funds
* **P\&L Tracking**: Monitor realized and unrealized profit/loss
* **Quote Information**: Get real-time quotes for any symbol
* **Chart Generation**: Generate intraday and daily candlestick charts with volume
* **Remote Actions**: Close all positions, stop running Python strategies, toggle Live/Analyze mode
* **Automatic Order Alerts**: Every order, basket, split, options and GTT event pushed to your chat
* **Interactive Menu**: Inline button interface for quick access
* **Programmatic Sends**: `POST /api/v1/telegram/notify` and `client.telegram(...)` in the Python SDK

### Setup

#### 1. Create Your Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send the `/newbot` command
3. Follow the instructions to name your bot and choose its username
4. Copy the bot token provided by BotFather
5. Use this token in the Tradeboard configuration below

#### 2. Enable the Telegram Bot in Tradeboard

1. Log in to Tradeboard. From the profile dropdown (top right) click **Telegram Bot**, or navigate to `/telegram`
2. Click **Configuration** to open `/telegram/config`
3. Paste the bot token into the **Bot Token** field
4. Optionally adjust **Broadcast Messages** and **Rate Limit (messages per minute)**, then click **Save Configuration**
5. Return to `/telegram` and click **Start Bot**

The status badge on `/telegram` flips to **Online** once polling starts. If the bot was running when the server was last shut down, it auto-starts on the next boot, so you normally only press **Start Bot** once.

#### 3. Link Your Account

1. Start a conversation with your bot on Telegram and send `/start`
2.  Send the `/link` command with your API key and host URL:

    ```
    /link your_api_key_here http://127.0.0.1:5000
    ```
3. The bot validates the credentials by calling `funds` against that host. On success it stores the encrypted key, records your Tradeboard username and broker, and confirms that the account is linked

Both arguments are required. `/link` with anything other than exactly two arguments returns a usage message.

### Available Commands

#### Account Management

* `/start` - Initialize the bot and see the welcome message
* `/link <api_key> <host_url>` - Link your Tradeboard account
* `/unlink` - Unlink your account and delete the stored credentials
* `/status` - Check connection status, host URL and link date

#### Trading Data

* `/orderbook` - View orders (first 10 shown)
* `/tradebook` - View executed trades (first 10 shown)
* `/positions` - View open positions (first 10 shown)
* `/holdings` - View holdings (first 10 shown)
* `/funds` - View available cash, collateral, utilized margin and total
* `/pnl` - View realized, unrealized and total P\&L

Amounts are printed with the currency symbol that matches the broker recorded when you linked: `$` for crypto brokers (currently Delta Exchange), otherwise the rupee symbol.

#### Market Data

* `/quote <symbol> [exchange]` - Get quote for a symbol. Exchange defaults to `NSE`
  * Example: `/quote RELIANCE`
  * Example: `/quote NIFTY NSE_INDEX`
  * Returns LTP, change, change percent, open, high, low, previous close and volume

#### Charts

* `/chart <symbol> [exchange] [type] [interval] [days]` - Generate price charts
  * Exchange: defaults to `NSE`
  * Type: `intraday` (default), `daily`, or `both`
  * Interval: any interval the history API accepts. The bot's own help lists `1m`, `5m`, `15m`, `30m`, `1h` and `D`
  * Days: lookback period. Defaults to 5 for intraday and 252 for daily
  * Examples:
    * `/chart RELIANCE` - 5-minute intraday chart over 5 days
    * `/chart RELIANCE NSE intraday 15m 10` - 15-minute chart for 10 days
    * `/chart RELIANCE NSE daily D 100` - Daily chart for 100 days
    * `/chart RELIANCE NSE both` - Intraday and daily charts sent together as a media group

#### Remote Actions

These commands change state on the Tradeboard instance. None of them act on the command alone: each replies with inline buttons, and nothing happens until you press one.

* `/closeall` - Close all open positions. Offers **Yes, close all**, **Close all + Stop strategies**, and **Cancel**. The second option closes every position and then stops every running Python strategy
* `/stoppython` - List running Python strategies as buttons. Pick one to stop it, or **Stop All** to stop every running strategy. Each choice is confirmed before it runs. If nothing is running the bot says so and stops there
* `/mode` - Show whether the instance is in Live Mode or Analyze Mode, with a single button to switch to the other. The change is applied server-side and pushed to the web UI over SocketIO

#### Interactive Interface

* `/menu` - Display the inline button menu. Buttons: Orderbook, Tradebook, Positions, Holdings, Funds, P\&L, and Refresh. The Refresh button edits the same message in place and stamps it with the update time
* `/help` - Show the help message with all commands

The P\&L button and the `/pnl` command read the same fields from the funds response, so the two always agree.

### Order Alerts (Automatic Notifications)

#### Overview

The bot automatically sends real-time notifications for order-related API activity. No additional commands are needed: alerts are sent when orders are placed through the Tradeboard API. Delivery goes over a direct HTTPS call to the Telegram Bot API rather than through the polling bot, so alerts do not depend on the polling loop being mid-cycle. They do depend on the bot being started: if the bot is stopped from `/telegram`, automatic alerts stop with it.

#### Supported Order Types

Alerts are driven by the internal event bus. The events that produce a Telegram message are:

| Event topic            | Trigger                                                         |
| ---------------------- | --------------------------------------------------------------- |
| `order.placed`         | `placeorder` or `placesmartorder` succeeded                     |
| `order.no_action`      | Smart order evaluated and found nothing to do                   |
| `order.modified`       | `modifyorder` succeeded                                         |
| `order.cancelled`      | `cancelorder` succeeded                                         |
| `orders.all_cancelled` | `cancelallorder` succeeded                                      |
| `position.closed`      | `closeposition` succeeded                                       |
| `basket.completed`     | All legs of a `basketorder` completed                           |
| `split.completed`      | All sub-orders of a `splitorder` completed                      |
| `options.completed`    | All legs of an `optionsorder` completed                         |
| `multiorder.completed` | All legs of an `optionsmultiorder` completed                    |
| `gtt.placed`           | `placegttorder` succeeded                                       |
| `gtt.modified`         | `modifygttorder` succeeded                                      |
| `gtt.cancelled`        | `cancelgttorder` succeeded                                      |
| `gtt.triggered`        | A resting GTT fired and placed its order                        |
| `gtt.expired`          | A GTT lapsed past its `expires_at` without firing               |

Failure events (`order.failed`, `order.modify_failed`, `order.cancel_failed`, `gtt.failed`, `gtt.modify_failed`, `gtt.cancel_failed`, `analyzer.error`) deliberately do not send a Telegram message, so a run of validation rejections cannot flood your chat.

`gtt.placed`, `gtt.modified` and `gtt.cancelled` fire in both Live and Analyze mode. `gtt.triggered` and `gtt.expired` are published by the sandbox GTT manager, so today they only reach you in Analyze mode: a live GTT fires at the broker, where Tradeboard does not observe the moment it triggers.

The alert formatter has a dedicated layout for each order API type. GTT events do not have one yet, so they arrive under the generic `Order Update` heading with the mode line, strategy name and timestamp but no per-trigger detail.

#### Alert Format

Each alert includes:

* **Strategy Name**: First line, if `strategy` was supplied in the API call
* **Mode Indicator**: `LIVE MODE - Real Order` for real broker orders, `ANALYZE MODE - No Real Order` for sandbox orders, followed by a horizontal rule
* **Order Details**: Symbol, action, quantity, price type, exchange, product type
* **Status**: Order ID on success, or an error line with the failure message
* **Timestamp**: `Time: HH:MM:SS` on the last line

The bot sends its messages with Telegram Markdown, so mode indicators, strategy names and symbols arrive bold or monospaced rather than decorated with icons. Status markers inside multi-leg alerts are written as plain tags such as `[OK]` and `[FAILED]`.

#### Example Notifications

**Live order placed:**

```
Order Placed
Strategy: MyStrategy
LIVE MODE - Real Order
─────────────────────
Symbol: RELIANCE
Action: BUY
Quantity: 10
Price Type: MARKET
Exchange: NSE
Product: MIS
Order ID: 250408000989443
Time: 14:23:45
```

**Analyze mode order:**

```
Order Placed
Strategy: TestStrategy
ANALYZE MODE - No Real Order
─────────────────────
Symbol: RELIANCE
Action: BUY
Quantity: 10
Price Type: MARKET
Exchange: NSE
Product: MIS
Order ID: ANALYZE123456
Time: 14:23:45
```

#### Configuration

* Alerts are enabled by default for every linked user. The gate is the `notifications_enabled` flag on the linked-user row, which is shown on `/telegram/users` and defaults to on
* A send that fails (bad token, Telegram API error, timeout) is recorded in the `notification_queue` table at priority 8. There is no background worker that drains this queue, so treat it as a delivery audit trail rather than an automatic retry
* If Telegram rejects the message because of a Markdown parsing error, the alert is immediately re-sent as plain text
* Zero impact on order execution speed: formatting and sending happen on a five-worker thread pool, never on the order-placement path

#### Requirements for Receiving Alerts

1. The Telegram bot must be started (**Start Bot** on `/telegram`, or `POST /telegram/bot/start`). While the bot is stopped, automatic alerts are suppressed and `POST /api/v1/telegram/notify` returns HTTP 409
2. Your account must be linked with the `/link` command
3. `notifications_enabled` must be on for your linked user (the default)
4. Orders must be placed through the Tradeboard API. Orders placed directly on a broker website do not raise events

### Chart Features

#### Intraday Charts

* Default interval: 5 minutes
* Default period: 5 days
* Candlestick price panel plus a volume panel, with volume bars colored green or red by candle direction
* Category-type x-axis, so there are no blank gaps for non-trading hours

#### Daily Charts

* Default interval: Daily (`D`)
* Default period: 252 trading days. The history request reaches back 1.5 times that many calendar days to make sure enough sessions are returned, then the series is trimmed to the requested count
* Candlestick price panel plus a volume panel, using the same layout as the intraday chart. No moving averages or other overlays are drawn

#### Chart Customization

* **Intervals**: passed straight through to the history API. `1m`, `5m`, `15m`, `30m`, `1h` for intraday, `D` for daily
* **Days**: customize the lookback period
* **Exchange**: any exchange the history API supports, for example NSE, BSE, NFO, CDS, MCX, NSE\_INDEX, BSE\_INDEX

### Security

#### API Key Encryption

* API keys are encrypted with Fernet before storage in the `telegram_users` table
* The Fernet key is derived with PBKDF2-SHA256 (100,000 iterations) from `API_KEY_PEPPER` and the `TELEGRAM_KEY_SALT` salt
* Keys are never stored in plain text and each user's key is isolated

#### Authentication

* `/link` requires a valid API key and is validated against the Tradeboard server before anything is stored
* The bot management pages and routes under `/telegram` are behind the Flask login session
* The public `/api/v1/telegram/*` endpoints are authenticated with an Tradeboard API key, sent either as the `apikey` body field or the `X-API-KEY` header
* `POST /api/v1/telegram/webhook` is verified against the `X-Telegram-Bot-Api-Secret-Token` header. The expected value is `TELEGRAM_WEBHOOK_SECRET` if set, otherwise the first 32 characters of the SHA-256 digest of the bot token

#### Privacy

* Each Telegram user can only access their own linked account
* No cross-user data access
* Command usage is logged for security audit

### Database Schema

The bot uses SQLAlchemy ORM with the following tables:

#### TelegramUser

* Table `telegram_users`. Stores user-bot linkage: `telegram_id`, `tradeboard_username`, `encrypted_api_key`, `host_url`, `telegram_username`, `first_name`, `last_name`, `broker`, `is_active`, `notifications_enabled`, `last_command_at`

#### BotConfig

* Table `bot_config`, a single row with `id=1`. Holds the encrypted `token`, `bot_username`, `is_active`, `max_message_length` (default 4096), `rate_limit_per_minute` (default 30) and `broadcast_enabled`
* There is no webhook URL or polling-mode column. The bot always runs in polling mode; the webhook route exists but does not yet dispatch updates

#### CommandLog

* Table `command_logs`. Audit trail of every command and inline-button callback: `telegram_id`, `command`, `chat_id`, `parameters`, `executed_at`. This table backs the `/telegram/analytics` page and `GET /api/v1/telegram/stats`

#### NotificationQueue

* Table `notification_queue`. Rows written when a send fails, carrying `message`, `priority`, `status`, `error_message`

#### UserPreference

* Table `user_preferences`. Per-user flags: `order_notifications`, `trade_notifications`, `pnl_notifications`, `daily_summary`, `summary_time`, `language`, `timezone`. These are readable and writable through `GET`/`POST /api/v1/telegram/preferences`; the order-alert path currently gates only on `notifications_enabled`

### Technical Architecture

#### Components

1. **TelegramBotService** (`services/telegram_bot_service.py`)
   * Core bot logic and command handlers, built on python-telegram-bot
   * Tradeboard Python SDK integration for every data call
   * Chart generation using Plotly
2. **TelegramAlertService** (`services/telegram_alert_service.py`)
   * Formats and delivers order alerts using a synchronous `httpx.Client` straight to `https://api.telegram.org`, so no asyncio or greenlet boundary is crossed under Gunicorn plus eventlet
   * Owns the five-worker `alert_executor` thread pool
3. **Event bus subscriber** (`subscribers/telegram_subscriber.py`)
   * Registered in `subscribers/__init__.register_all()` on every order, position, batch and GTT topic
4. **Database Layer** (`database/telegram_db.py`)
   * SQLAlchemy models and queries
   * Fernet encryption and decryption helpers
   * Configuration management, with TTL caches on user and preference lookups
5. **Blueprint** (`blueprints/telegram.py`)
   * Session-authenticated routes for bot management, consumed by the React pages
6. **REST namespace** (`restx_api/telegram_bot.py`)
   * The public `/api/v1/telegram/*` surface
7. **React pages** (`frontend/src/pages/telegram/`)
   * `/telegram`, `/telegram/config`, `/telegram/users` and `/telegram/analytics`
8. **Auto-start Feature**
   * Bot automatically starts on application launch if it was active when the server stopped
   * State persistence across restarts, configured in `app.py`

#### Threading Model

* Bot runs in a separate thread with its own event loop
* Non-blocking operation with the main Flask application
* Graceful shutdown handling, with automatic reconnect and backoff on Telegram network errors

#### Chart Generation

* Uses Plotly for chart creation
* Kaleido engine for PNG export
* Pandas for data manipulation
* Category-type x-axis to handle gaps
* Tradeboard pins `kaleido==1.3.0`. Kaleido 1.x no longer bundles a browser: it drives a real headless Chromium over the Chrome DevTools Protocol, so Chromium must be installed on the host or in the container. Each render spawns a browser process for roughly one to three seconds. A missing Chromium is the usual reason `/chart` replies "Failed to generate charts"
* The render runs on a genuine, un-monkey-patched OS thread. Kaleido calls `asyncio.run()` internally, which cannot run inside the bot's live event loop, and eventlet's patched `threading.Thread` does not escape it

### Troubleshooting

#### Bot Not Responding

1. Check that the badge on `/telegram` reads **Online**
2. Verify the bot token is correct on `/telegram/config`
3. Check network connectivity to `api.telegram.org`
4. Review the server logs for errors

#### Chart Generation Issues

1. Confirm Chromium is installed and reachable. On Docker: `docker exec tradeboard-web /usr/bin/chromium --version`. On bare metal: `which chromium || which chromium-browser`
2. Ensure market data is available for the symbol
3. Check that the exchange is correct
4. Verify the interval is supported and the date range is valid

#### Linking Issues

1. Verify the API key is correct and active
2. Ensure the host URL is reachable from the machine running the bot, and that you passed both arguments to `/link`
3. Check that the API key resolves to an Tradeboard user
4. Verify the Tradeboard server is running

#### Alerts Stopped Arriving

1. Check whether the bot was stopped. Stopping the bot also stops automatic order alerts
2. Confirm `notifications_enabled` is on for your row on `/telegram/users`
3. Confirm the order actually went through the Tradeboard API
4. Look for `notification_queue` rows, which record sends that failed

### Environment Variables

The bot respects the following environment variables:

* `DATABASE_URL` - Database connection string. The Telegram tables live in the main Tradeboard database
* `API_KEY_PEPPER` - Pepper fed into the PBKDF2 key derivation for the stored API keys and bot token
* `TELEGRAM_KEY_SALT` - Salt for that derivation. Defaults to `telegram-tradeboard-salt`
* `HOST_SERVER` - Tradeboard server URL
* `TELEGRAM_RATE_LIMIT` - Rate limit for the `/api/v1/telegram/*` endpoints. Defaults to `30 per minute`
* `TELEGRAM_MESSAGE_RATE_LIMIT` - Rate limit for `POST /telegram/send-message`. Defaults to `10 per minute`
* `TELEGRAM_WEBHOOK_SECRET` - Shared secret for webhook verification. Derived from the bot token when unset

### API Endpoints

#### Web Interface

All routes below are under `/telegram` and require a logged-in Flask session. The pages themselves (`/telegram`, `/telegram/config`, `/telegram/users`, `/telegram/analytics`) are React routes served by the single-page app.

* `POST /telegram/config` - Update bot configuration (`token`, `broadcast_enabled`, `rate_limit_per_minute`)
* `POST /telegram/bot/start` - Start the bot
* `POST /telegram/bot/stop` - Stop the bot
* `GET /telegram/bot/status` - Bot lifecycle state
* `POST /telegram/broadcast` - Send a message to all users with notifications enabled
* `POST /telegram/test-message` - Send a test message to the logged-in user's linked chat
* `POST /telegram/send-message` - Send a message to one `telegram_id`
* `POST /telegram/user/<telegram_id>/unlink` - Unlink a user from the admin UI
* `GET /telegram/api/index` - Dashboard payload for the React page
* `GET /telegram/api/config` - Config payload (never returns the token itself)
* `GET /telegram/api/users` - Linked users plus 30-day command stats
* `GET /telegram/api/analytics` - 7-day and 30-day command stats

There is no restart route. To restart the bot, stop it and start it again.

#### Public REST API

Mounted at `/api/v1/telegram`. Authenticate with an Tradeboard API key in the `apikey` body field or the `X-API-KEY` header.

* `GET /api/v1/telegram/config` - Read bot configuration. The token is truncated in the response
* `POST /api/v1/telegram/config` - Update configuration. `rate_limit_per_minute` must be between 1 and 120
* `POST /api/v1/telegram/start` - Initialize and start the bot
* `POST /api/v1/telegram/stop` - Stop the bot
* `GET /api/v1/telegram/users` - List linked users. Optional `broker` and `notifications_enabled` query filters
* `POST /api/v1/telegram/notify` - Send a message to one linked user
* `POST /api/v1/telegram/broadcast` - Broadcast endpoint. Limited to 5 requests per minute and refuses with HTTP 403 when broadcast is disabled. The fan-out itself is not wired up yet, so it returns `success_count` and `fail_count` of 0. Use the **Send Broadcast** button on `/telegram`, which posts to `POST /telegram/broadcast` and does send
* `GET /api/v1/telegram/stats` - Command usage statistics. Optional `days` (1 to 365, default 7)
* `GET /api/v1/telegram/preferences` - Read per-user preferences. Requires `telegram_id`
* `POST /api/v1/telegram/preferences` - Update per-user preferences
* `POST /api/v1/telegram/webhook` - Inbound webhook receiver, verified by secret token

`POST /api/v1/telegram/notify` takes:

| Field               | Type    | Description                                                                    |
| ------------------- | ------- | ------------------------------------------------------------------------------ |
| `apikey`            | string  | Required. Tradeboard API key                                                     |
| `username`          | string  | Required. Tradeboard login username, not the Telegram username                   |
| `message`           | string  | Required. Message body, up to 4096 characters                                  |
| `priority`          | integer | Optional, 1 to 10, default 5. Out-of-range values fall back to 5               |
| `wait_for_delivery` | bool    | Optional, default `false`. When `true`, the call blocks until Telegram replies |

```bash
curl -X POST http://127.0.0.1:5000/api/v1/telegram/notify \
  -H 'Content-Type: application/json' \
  -d '{
    "apikey": "your_api_key",
    "username": "your_tradeboard_username",
    "message": "NIFTY crossed 24000",
    "priority": 8
  }'
```

The endpoint returns HTTP 409 when the bot is stopped, HTTP 404 when the username has no linked Telegram account, and HTTP 401 for a bad API key.

#### Python SDK

```python
from tradeboard import api

client = api(api_key="your_api_key", host="http://127.0.0.1:5000")

client.telegram(
    username="your_tradeboard_username",
    message="Stop loss hit on BANKNIFTY",
    priority=10,
)
```

`username`, `message` and `priority` are keyword-only. `username` is the Tradeboard login username, not the Telegram handle.

### Error Handling

* All errors are logged with context
* User-friendly error messages in Telegram
* A Markdown parse failure is retried once as plain text
* Network errors during polling trigger a reconnect with backoff, up to five attempts
* Graceful degradation for missing data

### Performance Considerations

* Alerts are dispatched on a five-worker thread pool, off the request path
* User, credential and preference lookups are served from 30-minute TTL caches
* Database queries are optimized with indexes
* Chart rendering is the one blocking step: it pauses the bot's event loop for the duration of the Chromium render, which is acceptable for personal, low-volume use

### Future Enhancements

* [ ] Real-time price alerts
* [ ] Portfolio analytics
* [ ] Custom indicators on charts
* [ ] Webhook dispatch (the route exists and is authenticated, but updates are not yet processed)
* [ ] Inline queries for quick quotes

### Support

For issues or questions:

1. Check the logs in the Tradeboard dashboard
2. Review this documentation
3. Contact Tradeboard support
