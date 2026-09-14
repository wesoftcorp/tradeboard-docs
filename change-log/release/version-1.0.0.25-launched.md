# Version 1.0.0.25 Launched

29th May 2025

**Major New Broker Addition & Enhancements:**

* **Tradejini**
* **Groww**
* **Dhan (Sandbox)**

**Major New Features & System Enhancements:**

* **Full WebSocket Implementation (Pilot Testing with Angel):**
  * Introduced robust WebSocket support for real-time market data streaming.
  * Delivers LTP (Last Traded Price), Quotes, and full Market Depth (including Top 5 Bid/Ask).
  * Includes server-side (server.py) and Nginx configuration for WebSocket proxying on Ubuntu.
  * Added necessary WebSocket host, port, and URL configurations to .sample.env.
  * Provided WebSocket usage examples (e.g., stoploss example).
  * Fixes implemented for subscription mode isolation and JSON deserialization error handling.
  * Addressed issues such as "No. of Orders in the Depth" display.
* **Docker Build Optimization:**
  * Implemented **multi-stage builds** for Docker, significantly reducing the final Docker image size.
* **Enhanced Connection Pooling:**
  * Rolled out and fixed shared connection pooling for Data APIs, Order APIs, Authentication, Funds, and Master Contract services across applicable brokers, improving performance and resource management.
* **Database Enhancements:**
  * Integrated SQLiteDB for storing IST (Indian Standard Time) data.
  * Added DuckDB library support and functionality for efficient intraday data downloads.

🔧 **Broker-Specific Fixes & Enhancements (Recent):**

* **AngelOne:**
  * Angel Average Price Fix (related to WebSocket data).
  * Added Angel UserID to the AuthDB for enhanced WebSocket authentication.
* **Fyers:**
  * Fine-tuned Master Contract Data for missing SENSEX index. (Assuming this was a recent touch-up)
* **ICICI:**
  * Removed ICICI integration and removed relevant references
* **Fivepaisa:**
  * Recent general updates and fixes to order APIs, common symbols, order status, master contract DB.
* **XTS API Supported Brokers (General):**
  * Refined scripts and processes for XTS Based Market Data Credentials setup.

**Common Symbol Format Now Implemented/Enhanced For:**

* **Tradejini (New)**
* **Groww**
* **Aliceblue**
* Fyers
* Dhan
* Dhan(Sandbox)
* Zerodha
* Flattrade
* Shoonya (BSE indices not available)
* Compositedge
* AngelOne
* Upstox
* Paytm
* Pocketful
* Jainam (XTS API)
* IIFL (XTS API)
* Wisdom Capital (XTS API)
* 5paisa (XTS API)
* 5paisa&#x20;

⚙️ **System Architecture & Further Enhancements:**

* **API & Service Layer:**
  * Integrated a dedicated Service Layer with the Restx API Layer for better modularity.
  * Fixed socket emitting event errors, mitigating potential rate limiting issues.
* **Dependency Management & Environment:**
  * Updated core libraries: tornado and flask-cors (crucial for WebSocket and API layers).
  * Adopted and updated configurations for the UV package manager (e.g., uv.lock updates).
  * Upgraded key dependencies like httpcore (to 1.0.9), setuptools (security fix), and h11 library.
  * Updated requirements.txt and websockets.txt to reflect new and updated dependencies.
* **Security & Deployment:**
  * Implemented/Updated CORS (Cross-Origin Resource Sharing) and CSP (Content Security Policy) configurations.
  * Updated Ubuntu server shell scripts and installation scripts, including improved support for UV.

**Documentation & DevOps Updates:**

* **New & Updated Docs:**
  * Comprehensive documentation for the new WebSocket implementation.
  * Documentation updates related to the Tradejini integration.
  * Added internal assessment and broker design documents.
* **Configuration & Testing:**
  * Updated .sample.env file with WebSocket configurations and new settings (e.g., for Cloudflare insights).
  * Added significant new test code for WebSocket features and other enhancements.
  * Updates to the general Docker build process to reflect multi-stage builds.
