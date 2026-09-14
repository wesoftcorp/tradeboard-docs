# Version 1.0.0.41 Released

**Date: 24th Dec 2025**

Version **1.0.0.41** is an **important infrastructure, real-time streaming, and stability release**, focused on **WebSocket connection pooling**, **options chain correctness**, **sandbox P\&L analytics**, **admin governance**, and **security hardening**, along with an **environment configuration update** to support these enhancements.

This release builds on **v1.0.0.40** and improves **scalability, observability, and operational control**, especially for users handling **large symbol subscriptions and multi-instance setups**.

***

### **0. Upgrade Notice**

This upgrade is **not mandatory**, but is **strongly recommended** for users who want to:

* Enable **WebSocket connection pooling**
* Stream large watchlists reliably
* Use improved sandbox P\&L analytics
* Access new admin-level market controls
* Apply the latest security and stability fixes

Upgrade guide:\
[https://docs.algo.wesoftcorp.com/installation-guidelines/getting-started/upgrade](https://docs.algo.wesoftcorp.com/installation-guidelines/getting-started/upgrade)

***

### **1. Market Data & Quote Enhancements**

#### **Quote Fixes & Improvements**

* **Upstox**: Previous close fixed in quote payloads
* **Underlying indices**: Previous close added for analytics
* **Fyers WebSocket**:
  * Quote field structure updated
  * Improved consistency with REST quotes

#### **Rate-Limit Safety**

* **Dhan Options Chain**:
  * Fixed field parameter mismatch
  * Added internal rate-limiting protection

***

### **2. Options Engine & Derivatives**

#### **Options Chain & Greeks**

* **Samco**:
  * Options chain fixed
  * Greeks calculation stabilized
  * Index scrip mapping updated
* **Fyers**:
  * Bid / Ask values fixed in options chain

#### **Expiry Handling**

* Added expiry-aware Python sample code
* Improved handling of expired contracts across APIs

***

### **3. WebSocket & Real-Time Infrastructure**

#### **WebSocket Connection Pooling (New – Optional)**

* Introduced automatic WebSocket connection pooling
* Supports broker symbol limits by spawning multiple connections
* Prevents silent quote drops for large subscriptions
* Configurable via `.env`

#### **Pooling Stability & ZMQ Fixes**

* Fixed ZMQ socket setup issues
* Added connection test scripts and diagnostic logs
* Introduced thread-local context detection to prevent:
  * Duplicate publishers
  * Socket conflicts during pooled creation

#### **Latency Improvements**

* Telegram alerts moved off request thread
* Reduced order placement latency

***

### **4. Sandbox, P\&L & Analytics**

#### **Sandbox Mode**

* Fixed day-wise P\&L tracking
* Added P\&L history page
* Improved historical continuity and accuracy

#### **P\&L Tracker**

* Added robust timestamp handling
* Safely supports multiple broker timestamp formats

***

### **5. Admin, Governance & Market Timings**

#### **Admin Panel**

* New Admin Panel added for:
  * Market timings
  * Exchange holidays
  * Freeze quantity management

#### **Freeze Quantity Enforcement**

* Freeze quantity stored in DB
* Exposed via:
  * Search API
  * Symbol API
  * Option Symbol API
  * Web UI search
* Prevents invalid order sizing at infra level

***

### **6. UI, Dashboard & Observability**

#### **UI Enhancements**

* Heatmap updated
* Improved F\&O search in Web UI
* Analyzer logs card text refined

#### **Logging & Monitoring**

* Added centralized logging dashboard at `/logging`
* Improved structured logging across:
  * WebSockets
  * Sandbox
  * Analyzer
* Reduced logging noise

***

### **7. SDK & Configuration**

#### **SDK**

* Tradeboard SDK version upgraded:
  * `1.0.44 → 1.0.45`

#### **Environment Configuration**

* `.sample.env` updated to **version 1.0.5**
* New configuration options added to support:
  * WebSocket pooling
  * Enhanced security
  * Improved logging and isolation

***

### **8. Security & Stability**

* Fixed **Marshmallow `Schema.load` DoS vulnerability**
* Updated security documentation
* Continued dependency and stability improvements

***

### **Summary**

Version **1.0.0.41** delivers:

* ✅ Optional WebSocket connection pooling
* ✅ Improved real-time streaming stability
* ✅ Options chain fixes across brokers
* ✅ Sandbox P\&L history and accuracy improvements
* ✅ New admin controls for market governance
* ✅ Enhanced logging and observability
* ✅ SDK and configuration updates
* ✅ Security vulnerability fixes

This release **enhances scalability and operational safety** while remaining **backward-compatible**, allowing users to opt-in to advanced real-time features as needed.

***
