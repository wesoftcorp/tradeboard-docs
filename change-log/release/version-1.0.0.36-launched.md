# Version 1.0.0.36 Launched

**31st October 2025**

***

### **Theme & Performance Enhancements**

1. **🚀 75% Faster Startup**
   * Tradeboard now launches **in \~2 seconds** (previously 5–8 seconds).
   * Achieved by **parallelizing all 11 database connections** and **concurrent service startups** (execution engine, scheduler, WebSocket manager).
   * Delivers an instant, ready-to-trade experience every time you restart the server.
2. **⚡ Platform Speed & Latency Optimizations**
   * Introduced **Order Latency Dashboard v2** with detailed latency segmentation:
     * Platform Overhead
     * Broker API Time
     * Network RTT
   * Added **broker-level latency tracking** to the HTTPX client.
   * Improved in-memory caching for **API keys and symbol data** for quicker responses.
   * Average platform response time reduced by **40–60%**.
3. **🎨 UI & Frontend Updates**
   * `socket.io` now served from **local file** (no external CDN dependency).
   * Smart audio filtering — notifications now play **only for order placement**.
   * Fixed theme contrast issues, form alignments, and modal responsiveness across brokers.

***

### **New API Launches**

Introducing **4 Important Tradeboard APIs** — available in both **REST API** and **Python SDK**:

1. **OptionsOrder**\
   📘 [Docs](https://docs.algo.wesoftcorp.com/api-documentation/v1/orders-api/optionsorder)\
   Place and modify options orders programmatically with advanced parameter support.
2. **OptionSymbol**\
   📘 [Docs](https://docs.algo.wesoftcorp.com/api-documentation/v1/data-api/optionsymbol)\
   Retrieve complete option chain details — strikes, expiries, and instrument tokens.
3. **OptionGreeks**\
   📘 [Docs](https://docs.algo.wesoftcorp.com/api-documentation/v1/data-api/optiongreeks)\
   Get live Greeks (Delta, Gamma, Vega, Theta, IV) calculated using `mibian` and `scipy`.
4. **TelegramAlert**\
   📘 [Docs](https://docs.algo.wesoftcorp.com/api-documentation/v1/data-api-1/telegram)\
   Send instant Telegram alerts for strategy events, order triggers, and status updates.

🔗 Python equivalents available at:\
[https://docs.algo.wesoftcorp.com/trading-platform/python](https://docs.algo.wesoftcorp.com/trading-platform/python)

***

### **Broker & API Fixes**

#### **Kotak Securities (Critical Update)**

* Migrated to **Kotak API v2** — contributed by **@crypt0inf0**.
* Switched from **SMS-based OTP** to **TOTP-based OTP** authentication.
* New API Key / Secret generation workflow introduced.\
  → Read the updated docs: [https://docs.algo.wesoftcorp.com/connect-brokers/brokers/kotak-securities](https://docs.algo.wesoftcorp.com/connect-brokers/brokers/kotak-securities)

#### **Dhan API Update**

* Adopted **new API Key–based authentication** replacing old token-based flow.
* Supports **Static IP whitelisting** for improved reliability.
* Updated `.env` structure — refer to the new Dhan configuration guide:\
  [https://docs.algo.wesoftcorp.com/connect-brokers/brokers/dhan](https://docs.algo.wesoftcorp.com/connect-brokers/brokers/dhan)

#### **Other Broker Fixes**

* **Aliceblue** — WebSocket authentication issue resolved.
* **Fivepaisa** — Websocket Implementation
* **PayTM** — Websocket Implementation
* **Zerodha** — Added data error handling for users with free personal APIs (no data/WebSocket access).

***

### **Deployment & Server Enhancements**

1. **Universal Linux Support via install.sh**
   * Tradeboard can now be installed across **multiple distros with custom domains**.
   * Script supports:
     * **Debian-based:** Ubuntu, Mint, Zorin, Pop!\_OS, Raspbian
     * **RHEL-based:** CentOS, Fedora, Rocky, AlmaLinux, Amazon Linux, Oracle Linux
     * **Arch-based:** Arch, Manjaro, EndeavourOS, CachyOS
   * Recommended: **Custom Domain + Cloudflare Configuration**
   * Script: [https://github.com/wesoftcorp/tradeboard-docs/blob/main/install/install.sh](https://github.com/wesoftcorp/tradeboard-docs/blob/main/install/install.sh)
2. **Docker Improvements**
   * Updated base image to latest **Python version**.
   * Reduced vulnerabilities using **Snyk-optimized Dockerfile**.
   * Added persistent volumes for `/strategies` and `/keys`.
   * Enhanced Nginx configuration for custom domains and HTTP2.
3. **Security Update**
   * Disabled **automatic IP bans** to avoid self-lockouts.
   * Manual IP management now handled via the `/security` dashboard.

***

### **Sandbox & Margin Fixes**

* Fixed **Sandbox Margin Issue** (thanks to @Dipesh).
* DB migration required for this release — follow upgrade guide:\
  [https://docs.algo.wesoftcorp.com/installation-guidelines/getting-started/upgrade](https://docs.algo.wesoftcorp.com/installation-guidelines/getting-started/upgrade)
* Fresh installations do **not** require migration.

***

### **Dependencies**

**New Python Packages Added:**

```
mibian
scipy
```

**Configuration:**

* No changes to `.env` version (v1.0.4 remains compatible).

***

### **Summary**

Version **1.0.0.36** delivers a **major performance boost**, **new Options APIs**, and **critical broker upgrades**.\
From **faster startup times** and **real-time latency analytics** to **Kotak v2 migration** and **Telegram alerting.**
