# Delta Exchange

Tradeboard's `deltaexchange` plugin is the repository's crypto-derivatives adapter. Its `plugin.json` declares broker type `crypto`, exchange `CRYPTO`, and leverage configuration support. The adapter maps supported Delta Exchange order, account, data, and streaming operations into Tradeboard's normalized interfaces.

Product availability, fees, settlement, API-key requirements, and account eligibility are controlled by Delta Exchange and can change. Tradeboard does not provide legal or tax classification; verify current exchange documentation and the rules that apply to your location before trading.

### How Delta Exchange differs from a securities broker

This is the only `crypto` plugin in Tradeboard, and it behaves differently from the Indian securities brokers in four ways that affect how you write strategies.

* **One exchange code.** Every Delta instrument sits on the single Tradeboard exchange `CRYPTO`. There is no NSE/BSE/NFO split. Internally the plugin records the broker exchange as `DELTAIN` (Delta Exchange India).
* **Fractional quantities, on spot only.** Securities plugins take whole share or lot counts. Delta spot instruments accept fractional sizes such as `0.0001 BTC` or `0.05 SOL`, and the lot size stored for each instrument comes from the exchange's own `min_order_size`. Futures, perpetuals and options are still counted in **whole contracts**: passing a fractional quantity for a derivative is rejected before the order is sent.
* **No CNC/MIS/NRML.** Delta has no equity-style product types. Whatever product you pass is forwarded untouched, and every position read back reports as `NRML`.
* **24/7 markets.** Crypto does not close, so there is no daily session rollover to align with.

### Order types and leverage

The plugin maps Tradeboard price types onto Delta's order model as follows:

* `MARKET` and `SL-M` become `market_order`
* `LIMIT` and `SL` become `limit_order`, with `SL` adding the stop trigger

Delta requires leverage to be configured by a separate call before the order is submitted, so Tradeboard sets it for you. The value is resolved in priority order: the `leverage` field on the order, then the common leverage saved in Tradeboard's leverage settings, then the environment fallback. Leverage must be a whole number.

### Instruments in the master contract

Only contracts that are **live** and **operational** are downloaded. Contracts the exchange has put into reduce-only mode (pre-expiry wind-down or liquidation-only) are skipped deliberately, because storing them would let you place orders the API would reject.

Instrument types you will see include `PERPFUT` (perpetual futures), `FUT`, `CE` and `PE` (options), `SPOT`, `MOVE`, `SPREAD`, `COMBO`, `IRS`, the turbo options `TCE` and `TPE`, and the synthetic options `SYNCE` and `SYNPE`. Perpetuals have no expiry date; dated contracts carry one.

### API Key Registration

To integrate Tradeboard with Delta Exchange India, you need to generate an API key from within your Delta Exchange account. The API key serves as the authentication mechanism for all programmatic trading requests.

#### Step 1: Log in to Delta Exchange India

Visit [delta.exchange](https://delta.exchange) and log in to your account using your Gmail and password

<figure><img src="/assets/Delta1 (1).png" alt=""><figcaption></figcaption></figure>

<figure><img src="/assets/Delta2 (1).png" alt=""><figcaption></figcaption></figure>

#### Step 2: Navigate to AlgoHub > APIs

<figure><img src="/assets/Delta3 (1).png" alt=""><figcaption></figcaption></figure>

Once logged in, click on the **AlgoHub** menu in the top navigation bar. From the dropdown, select **APIs** ("Create API key and Start Trading"). This takes you to the Delta Exchange API landing page where you can manage your API keys.

#### Step 3: Create a New API Key

<figure><img src="/assets/Delat5 (1).png" alt=""><figcaption></figcaption></figure>

<figure><img src="/assets/Delta6 (1).png" alt=""><figcaption></figcaption></figure>

Click the **Create API Key** button on the API page. You will be taken to the API key creation form at delta.exchange/app/account/manageapikeys . Fill in the following details:

* **Account Name**: select **Main** (or the sub-account you want the key associated with)
* **API Key Name**: enter a recognisable name, e.g., tradeboard
* **Whitelisted IP**: enter the IP address of your Tradeboard server. Only whitelisted IPs will be permitted to interact with the trading API. Add the IP and select it from the **IPs to whitelist** dropdown.
* **Permissions**: enable both:
  * **Read Data**: enabled by default for all API keys
  * **Trading**: must be explicitly selected to allow order placement

#### Step 4: Save the API Key and Secret

After submitting the form, Delta Exchange will display your **API Key** and **API Secret**. Copy and store them securely, because the secret will not be shown again. Add them to your Tradeboard `.env` file as follows:

```
BROKER_API_KEY = 'your_api_key_here'
BROKER_API_SECRET = 'your_api_secret_here'
REDIRECT_URL = 'http://127.0.0.1:5000/deltaexchange/callback'
```

There is no browser login step. Clicking **Connect** on the broker page signs a request with the key and secret above and validates it against Delta directly. An invalid key or a bad signature is reported as such, so check both values before looking elsewhere.

#### Settings for a 24/7 market

Two further settings in `.env` exist because crypto never closes. The install script sets them for you when you choose a crypto broker; set them by hand if you are converting an existing install.

```
# Crypto markets run 24/7, so skip the daily session logout
DISABLE_SESSION_EXPIRY = 'true'

# Master contract cache boundary, in UTC rather than IST
CRYPTO_MASTER_CONTRACT_CUTOFF_TIME = '00:00'
```

Left at its default of `false`, `DISABLE_SESSION_EXPIRY` logs every session out at `SESSION_EXPIRY_TIME` (03:00 IST by default), which would interrupt a strategy mid-session. `CRYPTO_MASTER_CONTRACT_CUTOFF_TIME` replaces the IST-aligned cutoff used for Indian exchanges: the first login of each UTC day fetches a fresh instrument list and later logins that day reuse the cache.

The Delta Exchange plugin supports automated crypto-derivatives workflows where the connected account and instrument are available. Protect API credentials, use the exchange's current network controls, handle API failures explicitly, and test with the exchange's test environment before live use. Users remain responsible for verifying the legal, tax, and account rules that apply to their location and activity.
