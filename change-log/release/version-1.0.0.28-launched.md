# Version 1.0.0.28 Launched

29th July 2025

#### Flattrade

* OrderBook parsing fixed
* Market/SL-M order price sync corrected
* Expiry API format standardized
* BSE Index data feed issue fixed
* Daily data and volume decimal precision fixed
* Supported intervals and expiry alignment updated

#### Zerodha

* WebSocket random disconnection issue resolved
* Expiry API date handling patch applied
* LTP and PNL mapping corrected in position manager
* Tested with 1800+ symbols and test script added in /test folder

#### Firstock

* API upgraded to latest version
* Httpx connection pooling integrated
* Common index symbol format introduced
* Initial commit for WebSocket integration
* Quote stream and order handling framework prepared

#### Groww

* Authentication updated to support key and secret-based login

#### IIFL (XTS API)

* Fixed index spot price retrieval by correcting exchange segment mapping
* NSE\_INDEX and BSE\_INDEX mapped to proper segments
* Added checks for empty `listQuotes` response to avoid errors

#### Broker Removals

* Removed support for Jainam, JainamPro, and Trustline
* Reason: Limited to dealer-only access via XTS API
* Cleaned up legacy websocket adapters and related code

#### Security & UI Improvements

* Security audit completed using Google Gemini 2.5 Pro
* DaisyUI and TailwindCSS stack upgraded to latest version
* We've just rolled out critical security improvements to protect your trading infrastructure:&#x20;
* **What's New:** •&#x20;
  * **Webhook Protection** - 100 req/min (blocks external DoS attacks)&#x20;
  * **Strategy Management** - 200 req/min (prevents system flooding)&#x20;
  * **Order Operations** - 10 req/sec (stable order management)&#x20;
  * **Smart Orders** - 2 req/sec (complex strategy protection)&#x20;
  * **General APIs** - 50 req/sec (5x performance boost!)

#### Fixes and Cleanup

* WebSocket timeout and reconnection handling added
* Expiry API and Intervals API output sorted
* Postman environment and collection updated

#### Documentation

* Internal docs updated with broker removal notice and config improvements
