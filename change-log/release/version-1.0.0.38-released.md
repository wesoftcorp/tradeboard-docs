# Version 1.0.0.38 Released

Version **1.0.0.38** is a feature-heavy release focused on **Options Trading APIs**, **Python 3.14 compatibility**, **Playground upgrades**, **WebSocket improvements**, and **major broker updates**.\
This is also the release where **OptionMultiOrder** becomes production-ready.

***

## **Major Feature Updates**

### **1. OptionsMultiOrder – Calendar, Diagonal, Multi-Expiry Support**

* OptionsMultiOrder now supports **different expiries** for each leg.
* Enables **Calendar Spreads**, **Diagonal Spreads**, **Multi-expiry Condors**, etc.
* Underlying LTP handling improved (None-type issues fixed).
* Multi-leg duplication bug removed.

### **2. Synthetic Futures API**

* New lightweight API to generate **Synthetic Futures** using CE/PE combos.
* Faster than computing spreads manually.
* Part of the expanding derivatives toolkit.

### **3. Strikes Lookup Cache**

* Implemented **in-memory caching** for near-instant strike discovery.
* Massive performance boost for OptionsOrder, OptionsSymbol, OptionsMultiOrder.

### **4. Python 3.14 Compatibility**

* Tradeboard Python SDK upgraded to **v1.0.38**.
* Ensures clean installs on macOS, Windows, Linux.
* Fixes around dependency chain and wheel compatibility.

### **5. API Playground – Major Refresh**

* Alphabetical sorting for endpoints.
* Modern UI with cleaner validation.
* Request builder improvements.
* Local assets only (no CDN usage).
* Ability to load endpoints directly from Bruno files.
* New playground.js with improved utilities.
* NavBar cleaned (playground removed from top nav and moved to Tools section).

### **6. Security Improvements**

* Multiple **security documentation updates**.
* IDor vulnerability fixes.
* Removed unused `login_required` decorators.
* Safer routing between POST and GET usage.

***

## **Broker-wise Enhancements**

### **Motilal Oswal**

* MCX Options master scrip symbol issue fixed.

### **MStock**

* History API fixes.
* Index values corrected in master contract.
* OA exchange mapping fixed in orderbook, tradebook, positionbook.
* Net P\&L in positionbook corrected.

### **Dhan**

* Depth-level WebSocket: 5-level and 20-level depth fully activated.
* depth\_level parameter bug fixed.
* WebSocket unsubscribe\_all fixed.

### **Fyers**

* TBT (Tick-by-Tick) WebSocket unsubscription fixed.
* TBT 50-level depth update implemented.

### **IndMoney**

* LTP WebSocket improved.
* Tradebook updated.

### **Kotak**

* Margin API updated.

### **Groww**

* Margin API updated.

### **Zebu**

* Margin API updated (broker does not support margin; aligned accordingly).

### **TradeJini**

* Margin API updated (non-margin broker standardization).

### **PayTM Money**

* Margin API cleaned (non-margin broker standardization).

### **Fivepaisa**

* Margin API updated.

### **Firstock**

* Margin API updated.

### **Definedge**

* Margin API updated.

### **AliceBlue**

* Margin API updated.

***

## **Execution & Engine Improvements**

### **1. Options Engine**

* Multi-quote fix added for underlying price fetch.
* strike\_int parameter removed from OptionsOrder and OptionSymbol (optional for backward compatibility only).

### **2. WebSockets**

* Improved depth streaming and TBT stability.
* Memory cleanup in WebSocket pipelines.
* Logging noise heavily reduced.

### **3. Sandbox Fixes**

* Race condition issue in parallel order placement fixed.
* SmartOrder sandbox bug resolved earlier in 1.0.0.37, reinforced here.

***

## **Latency & Storage Optimizations**

* Latency monitoring optimized.
* Requests and Responses trimmed to **NULL** inside latency.db to prevent DB bloat.
* Database writes reduced significantly.

***

## **UI, UX, and Misc Updates**

* Password strength validation added.
* Navbar improved using flex alignment.
* Removed theme toggle from Playground (simplified UI).
* Updated DaisyUI compiled CSS.
* Fixed multiple mapping issues across the platform.
* README updated with latest examples and SDK instructions.

***

## **Summary**

Version **1.0.0.38** delivers critical upgrades across the entire stack:

* OptionsMultiOrder now supports **multi-expiry spreads**
* Python SDK fully compatible with **Python 3.14**
* Playground modern UI, utilities, security, and performance
* Synthetic Futures API added
* Huge batch of **Margin API** updates
* Improved **WebSocket depth, TBT, and data pipelines**
* Multiple **MStock**, **Dhan**, **Fyers**, **IndMoney**, and **Motilal** fixes
* DB trimming + latency monitoring optimization

This release focuses on **speed, reliability, and advanced options workflow automation**.

