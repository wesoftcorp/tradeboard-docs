# Version 1.0.0.37 Launched

16th Nov 2025

***

## **0. Major New Feature: Semi-Automatic Mode + Action Center**

#### **Semi-Automatic Mode**

A new execution workflow where:

* Your strategy generates signals.
* Instead of sending orders automatically, signals appear in the **Action Center**.
* You decide whether to **Approve** or **Reject** each order.

Perfect for:

* Traders who want manual oversight
* Discretionary intraday traders
* Human-in-the-loop decision making
* Semi-automatic strategy deployment

#### **Action Center**

A brand-new dashboard:

* Shows all **pending trading actions** in one place.
* Orders can be instantly approved or rejected.
* Rejection modal removed for faster interaction.
* Backend includes new database initialization logic.
* Designed for speed, clarity, and real-time responsiveness.

Reference: [https://docs.algo.wesoftcorp.com/new-features/action-center](https://docs.algo.wesoftcorp.com/new-features/action-center)

***

## **1. MStock (Major Integration Completed)**

#### **API & Backend Updates**

* Updated placeorder, modifyorder, cancelorder, cancelall to the new Type-B API format.
* Funds, orderbook, tradebook, and positionbook standardized to Tradeboard schema.
* Master contract updated and mapped correctly to internal structures.

#### **WebSocket**

* Full WebSocket integration for quotes and depth.
* UI fixes for MStock streaming modules.

#### **Logging**

* Logging noise significantly reduced for better clarity and performance.

***

## **2. Angel One**

#### **API Updates**

* Order APIs updated to match Tradeboard unified format.

#### **Margin**

* Margin API updated and aligned with the new system.

#### **WebSocket Performance**

* Large multi-symbol subscription optimized to reduce load.

***

## **3. Zerodha**

#### **Margin**

* SPAN + Exposure margin calculation updated and validated.

***

## **4. Upstox**

#### **Margin**

* Margin API updated in parity with other major brokers.

#### **PositionBook**

* Average price calculation corrected.

***

## **5. Dhan**

#### **Historical Data**

* Intraday historical chunk size updated to 90 days for API compliance.

#### **Margin**

* Margin API updated.

***

## **6. XTS**

#### **Historical API**

* Hardcoded timing logic removed from historical endpoints.

***

## **7. Compositedge**

#### **WebSockets**

* Depth streaming fixed.
* WebSocket stability and data handling improved.

#### **Logging**

* Cleaner logging with filtered levels.

***

## **8. Flattrade**

#### **Margin**

* Margin API updated.

***

## **9. Shoonya**

#### **Margin**

* Margin API updated to match the new unified structure.

***

## **10. IndMoney**

#### **Data APIs**

* Index values corrected.
* Historical API updated.

#### **Order & Funds**

* Order API logging improved.
* Funds API corrected and standardized.

***

## **11. PayTM**

#### **Margin**

* Margin NA removed since PayTM does not support margin in their API.

***

## **12. TradeJini**

#### **Logging**

* Logging level cleanup.

***

## **13. Wisdom Capital**

#### **Logging**

* Noise removed from data and order streams.

***

## **14. Platform-Wide Enhancements**

#### **SmartOrder Sandbox**

* PlaceSmartOrder fixed and now fully functional in Sandbox Mode.

#### **WebSocket Engine Enhancements**

* Implemented message throttling.
* Pre-created message dictionaries to reduce CPU load.

#### **Instrument API**

* New `/instruments` API added for unified broker instrument retrieval.

#### **Timeframe & Interval Validation**

* Updated validation rules across historical APIs.

***

## **15. Documentation & Examples**

#### **Examples**

* Removed exposed API keys from sample files.

#### **Contributor Guidelines**

* Updated and improved for clarity and onboarding.

***

## **Summary**

Version **1.0.0.37** delivers:

* Full **Semi-Automatic Mode + Action Center**
* Complete **MStock integration**
* Major **Margin API refresh** across all brokers
* Better **WebSocket stability**
* Cleaner logging and reduced CPU usage
* New **Instrument API**
* Better historical data consistency

The focus of this release is **precision, stability, and trader-centric workflows**, enabling faster, safer, and more controlled trading automation.

