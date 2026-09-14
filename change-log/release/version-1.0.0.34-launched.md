# Version 1.0.0.34 Launched

**2nd October 2025**

**Sandbox Environment**

* Full-stack sandbox environment added for traders
* Analyzer integration to validate strategies before going live
* Supports execution testing with live broker APIs in a safe, isolated mode
* Toggle sandbox mode directly from the dashboard
* Database migration adds new sandbox tables/settings

**Telegram Alerts**

* Telegram alert service implemented for order notifications
* Configurable alerts for orders, positions, P\&L, and risk checks
* Supports intraday and EOD alerts
* Enhanced initialization logic for synchronous and eventlet/Docker environments
* Graceful shutdown, retry logic, and improved error handling
* New migration script to add missing security columns for alert handling

**Logging Enhancements**\
Production-grade logging has been standardized and filtered across brokers:

* Angel
* Dhan
* Fyers
* Shoonya
* Upstox
* Zerodha

Key improvements:

* Logging levels filtered (info → debug where appropriate)
* Suppressed noisy hpack and websocket debug logs
* Structured error logs for better broker debugging
* Reduced sensitive information in Telegram bot logs
* Docker logging configuration updated for standalone mode

**Security & Infra Updates**

* Comprehensive Security Dashboard + IP ban system implemented
* `ip_helper` refactor – improved real IP retrieval (Cloudflare headers supported)
* CSRF protection, SQL injection hardening, and improved session handling
* API key handling robustness improved for Telegram and data services

**Bug Fixes**

* Flattrade: `placesmartorder` and modify order issue fixed
* Angel: Sensex symbol format corrected
* Shoonya: MTM PNL curve fixed, logging levels filtered
* Alice Blue: PNL/LTP fixes in positionbook, index data and PNL curve corrected
* Upstox: Logging levels filtered, websocket LTQ field added
* Sandbox analyzer crash fixed on invalid data
* Memory leak in auto square-off thread resolved
* UI fixes in DaisyUI dialogs

***

#### Upgrade Instructions

For detailed steps: [https://docs.algo.wesoftcorp.com/getting-started/upgrade](https://docs.algo.wesoftcorp.com/getting-started/upgrade)

**Dependencies**

No new Python dependencies introduced in this release.

**Database Migration**

Run migrations after pulling v1.0.0.34:

```bash
# Using Python
cd upgrade
python migrate_sandbox.py
python migrate_telegram_alerts.py
python migrate_security.py

# Using UV
cd upgrade
uv run migrate_sandbox.py
uv run migrate_telegram_alerts.py
uv run migrate_security.py
```

**Environment Configuration**

1.  Copy the new `.sample.env` (version **1.0.4**):

    ```bash
    cp .sample.env .env
    ```
2. Update `.env` with your broker API keys and config
3. Restart Tradeboard service

***

***
