# Version 1.0.0.40 Released

Version **1.0.0.40** is a **stability, market‑data, and ecosystem expansion release**, focused on **MultiQuote accuracy**, **funds & margin correctness**, **charting APIs**, and **broker WebSocket maturity**, along with multiple UI, sandbox, and documentation enhancements.

This release builds on the v1.0.0.39 foundation and significantly improves **data correctness, options analytics, and broker parity**.

***

### **0. Upgrade Notice**

This release does **not introduce breaking DB schema changes**, but users are **strongly recommended to upgrade** to benefit from fixes in:

* Funds & collateral calculations
* MultiQuote accuracy
* Options chain & Greeks
* Sandbox safety and auto‑cleanup

Upgrade guide:\
[**https://docs.algo.wesoftcorp.com/installation-guidelines/getting-started/upgrade**](https://docs.algo.wesoftcorp.com/installation-guidelines/getting-started/upgrade)

***

### **1. Market Data & MultiQuote Enhancements**

#### **MultiQuote Accuracy Improvements**

* Fixed **OI propagation** in MultiQuotes (Fyers)
* Improved **single‑quote routing** to depth-backed quote endpoints
* Stabilized quote consistency across REST & WebSocket feeds
* Reduced rate‑limit edge cases across brokers

#### **Sandbox Mode**

* Sandbox fully upgraded to **MultiQuote-backed pricing**
* Auto‑close added for **expired F\&O contracts**
* Improved thread safety and price validation

***

### **2. Funds, Margin & P\&L Fixes**

#### **Funds & Collateral**

* **Angel**: Collateral values in Funds API fixed
* **Upstox**: Collateral parameter corrected
* **Samco / Wisdom / Jainam / FivePaisaXTS**: Margin APIs updated and stabilized
* Unified margin behavior across margin & non‑margin brokers

#### **P\&L**

* **Fyers**: M2M unrealized P\&L fixed
* **Aliceblue**: Holdings quantity & P\&L corrections
* Improved P\&L consistency across dashboards

***

### **3. Options Engine & Analytics**

#### **Options Chain & Greeks**

* Fixed **options chain & Greeks issues** (Firstock)
* Migrated Greeks engine to **Black‑76 (py\_vollib)**
* Added `forward_price` parameter to Greeks API
* Improved intrinsic value validation before IV calculation
* Deep ITM options now return **theoretical Greeks instead of errors**

#### **Examples & Docs**

* Updated Python examples for:
  * Options Chain
  * Straddles
  * NIFTY‑specific Greeks
* Bruno collections updated with:
  * Split size
  * Per‑leg expiry support

***

### **4. WebSocket & Real‑Time Streaming**

#### **New & Improved WebSockets**

* **Samco WebSocket**: Initial implementation
* **JainamXTS WebSockets**:
  * LTP fixes
  * Depth & quote updates
  * Logging noise reduction
* Fixed zero‑value LTP issues (IndMoney)
* Improved quote structure consistency across brokers

#### **Logging & Performance**

* Startup logs moved from `INFO` → `DEBUG`
* Broker‑specific log filtering added
* Reduced noise in high‑frequency streams

***

### **5. Charting & Strategy APIs**

#### **Chart APIs**

* Chart API structure aligned across Tradeboard
* New **Chart Sync API** added
* Improved type validation

#### **Strategy & Infra**

* Improved `.env` handling
* Docker permission fixes for Python strategies
* Railway + VPS dual deployment support
* Cache restoration improvements on restart

***

### **6. UI, Dashboard & UX**

* Heatmap updated
* Added **connected broker badge**
* Enhanced positions page:
  * Grouping
  * Filtering
  * Cleaner P\&L layout
* Fixed CSV export in sandbox/analyze mode
* Faster UI load via CSS minification & render‑blocking fixes

***

### **7. Security & Stability**

* Fixed critical Telegram webhook authentication issue
* Upgraded vulnerable dependencies (urllib3, Werkzeug)
* Improved auth caching and session expiry handling
* Safer endpoint routing and validation across APIs

***

### **8. Documentation & SDK Updates**

#### **Python SDK**

* Documentation refreshed
* Examples aligned with latest APIs
* Compatible with v1.0.0.40 server changes

#### **Docs**

* Expanded WebSocket documentation with performance monitoring
* Cache architecture & pluggable system documentation
* Design documentation updates
* Raspberry Pi installation guide added

***

### **Summary**

Version **1.0.0.40** delivers:

* ✅ MultiQuote accuracy & OI fixes
* ✅ Funds, collateral & margin correctness across brokers
* ✅ Upgraded Options Greeks engine (Black‑76)
* ✅ New & improved broker WebSockets
* ✅ Sandbox safety improvements
* ✅ Chart Sync API
* ✅ UI, heatmap & dashboard enhancements
* ✅ Security hardening & dependency upgrades
* ✅ Improved docs, examples & SDK alignment

This release **polishes Tradeboard’s data correctness layer** and **raises broker parity and analytical reliability**, making it safer and more accurate for **live trading, scanners, and options strategies**.

***
