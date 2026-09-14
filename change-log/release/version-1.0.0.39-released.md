# Version 1.0.0.39 Released

Version **1.0.0.39** is a **major milestone release**, introducing a new Tier-1 broker (Kotak), expanding MultiQuote capabilities, and delivering extensive performance, stability, and data-pipeline improvements.

***

### **0. Mandatory Upgrade Notice**

This version **requires mandatory upgrade steps** due to new DB indexes, migration updates, and broker integrations.

Upgrade guide:\
[**https://docs.algo.wesoftcorp.com/installation-guidelines/getting-started/upgrade**](https://docs.algo.wesoftcorp.com/installation-guidelines/getting-started/upgrade)

***

### **1. Major New Integration: Motilal Oswal Added**

Tradeboard now officially includes **full Motilal Oswal Integration**.

**Motilal Oswal Integration Includes**

* Order placement, modification, cancellation
* Funds, positions, holdings
* WebSocket support
* Margin API
* Contract & exchange mapping
* Fully production-ready routing

Motilal joins Angel, Dhan, Zerodha, Fyers, Upstox, and Kotak as a primary supported broker.

This is one of the **largest broker integrations since Tradeboard launched**.

***

### **2. MultiQuote API – Pilot Release**

A new-generation **MultiQuote API** has been introduced.

**Pilot Launch**

* **Fyers MultiQuote API** added.
* Designed for ultra-fast multi-symbol quote retrieval.

MultiQuote provides low-latency quotes for scanners, dashboards, and strategies.

_(Further broker rollout will occur in upcoming versions.)_

***

### **3. Platform Improvements**

#### **WebSocket Verbose Mode**

* New toggleable verbose mode to reduce noise and improve streaming efficiency.

#### **Database & Latency Engine**

* Added multiple high-impact DB indexes.
* Unified migration system implemented.
* Latency stats optimized (N+1 query fix).
* latency.db storage trimmed by removing heavy request/response data.

#### **PNLTracker**

* Now supports **sub-minute trades** for precise scalping and HFT-style analytics.

#### **Python SDK v1.0.40**

* Updated for compatibility with v1.0.0.39.
* Enhanced WebSocket support with verbose control.

***

### **4. Major Motilal Enhancements**

**WebSocket Updates**

* Normalized depth levels 2–5 (set to zero values).
* Fixed depth feed and LTP updates for Index symbols.
* Full LTP + quotes + 1-level depth implemented.
* SSL certificate issue handled by disabling SSL until broker fixes.

**Market Data & Contracts**

* Master contract updated with Index contracts.
* Historical API aligned with new contract updates.
* Index quote logic improved.

**Orders, Margin & Holdings**

* Quantity-to-lot conversion fixed.
* Minor order API bugs resolved.
* Holdings API updated and stabilized.
* Margin API enhanced.

***

### **5. Options Engine Enhancements**

**OptionsMultiOrder**

* Response formatting fixed.
* Underlying LTP “None” issue resolved.
* Multi-quote underlying resolution improved.
* Multiple fixes based on PR review.

**Options APIs**

* Cleanup and parameter corrections across OptionsOrder and OptionSymbol.

***

### **6. Additional Broker-Level Improvements**

**Dhan**

* depth\_level fixes.
* Depth 5/20 activation.
* unsubscribe\_all fixed.

**Fyers**

* TBT unsubscription fixed.
* TBT 50-level depth upgraded.

**Zebu, PayTM, TradeJini**

* Margin APIs updated (standardized for non-margin brokers).

**General**

* Multiple contract mapping and feed consistency fixes across brokers.

***

### **7. UI, Security & Documentation**

* Design documentation updated for November release.
* Security updates including IDOR fixes and safer endpoint routing.
* Removed unused login decorators from Playground.
* Navigation/UI clean-ups.
* Migration scripts updated for order mode changes.

***

### **Summary**

Version **1.0.0.39** introduces:

* **Full Kotak integration**
* **Pilot MultiQuote API for Fyers**
* **Mandatory upgrade procedure**
* Major Motilal WebSocket, depth & contract fixes
* Database indexing & latency engine optimizations
* Sub-minute PNL tracking
* WebSocket verbose mode
* Python SDK 1.0.40
* Dozens of broker stability improvements

This release significantly strengthens Tradeboard’s real-time data layer, multi-broker coverage, and execution reliability.

***

***
