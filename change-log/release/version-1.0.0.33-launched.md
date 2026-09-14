# Version 1.0.0.33 Launched

23rd September 2025

**Tradejini**

* WebSocket integration added for real-time data streaming
* Improved connection stability and reconnection handling
* Full support for market data feed
* Open Interest (OI) data added to quotes for derivative markets
* Enhanced quote response with OI field

**Telegram Bot Integration**

* Read-only Telegram bot for trading data access
* Secure account linking with encrypted API keys
* Real-time quotes, positions, orderbook, and P\&L tracking
* Intraday (5m) and daily chart generation with candlesticks
* Interactive button menus for easy navigation
* Broadcast messaging to all linked users
* Auto-start on system restart
* Rate limiting (30 commands/min per user)
* Setup Guide: https://docs.algo.wesoftcorp.com/trading-platform/telegram

**Technical Updates**

* Polling-only mode (removed webhook complexity)
* Tradeboard SDK integration for data fetching
* Fernet encryption for API key storage
* Async operations with python-telegram-bot v22.4
* DaisyUI modal dialogs for better UX
* Automatic database migration with path detection

**Security Enhancements**

* Read-only access for maximum security
* Session authentication on all admin endpoints
* CSRF protection and SQL injection prevention
* Complete audit logging for commands

**Bug Fixes**

* Fixed DataFrame handling from history API
* Corrected SDK method calls to keyword arguments
* Resolved chart x-axis date formatting
* Fixed bot token and broadcast settings persistence

### Upgrade Instructions

For detailed upgrade steps: https://docs.algo.wesoftcorp.com/getting-started/upgrade

#### New Dependencies to Install

**Using Python:**

```bash
pip install python-telegram-bot==22.4
pip install plotly==6.3.0
pip install kaleido==1.1.0

Using UV:

uv pip install python-telegram-bot==22.4
uv pip install plotly==6.3.0
uv pip install kaleido==1.1.0

Database Migration

After installing dependencies, run the migration:

# Using Python
cd upgrade
python migrate_telegram_bot.py

# Using UV
cd upgrade
uv run migrate_telegram_bot.py

```

**Configuration**

1. Get bot token from @BotFather on Telegram
2. Configure in Tradeboard: Profile → Telegram Bot → Configuration
3. Start the bot from dashboard
4. Link account in Telegram: /link YOUR\_API\_KEY YOUR\_HOST\_URL

**Documentation**

* Telegram Bot Docs: [`https://docs.algo.wesoftcorp.com/trading-platform/telegram`](https://docs.algo.wesoftcorp.com/trading-platform/telegram)
* Upgrade Guide: [https://docs.algo.wesoftcorp.com/getting-started/upgrade](https://docs.algo.wesoftcorp.com/getting-started/upgrade)

Added the Tradejini WebSocket support and OI (Open Interest) updates for derivative markets at the top\
of the changelog, maintaining the same concise format.
