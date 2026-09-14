# Amibroker Plugin

## Tradeboard Amibroker Plugin Setup Guide

This guide will walk you through the installation and configuration of the Tradeboard Plugin for AmiBroker.

### Prerequisites

* AmiBroker 6.0 or higher installed on your system
* Tradeboard server running (ensure it's accessible at your configured host URL)
* Your Tradeboard API key

### Features

* 1-minute intraday history, with manual backfill of 3 months, 6 months or 1 year
* Daily (EOD) history, with manual backfill of 5, 10 or 25 years
* Automatic intraday refresh on a configurable cadence, seeded from the existing cache so only new bars are fetched
* Realtime chart candles built from live WebSocket ticks
* Realtime Quote Window fed from live WebSocket quote and depth frames
* WebSocket reconnect, ping/pong and automatic resubscription
* Connects to all Tradeboard-supported brokers that provide historical data and live quotes
* Exchange coverage follows Tradeboard: NSE, NSE_INDEX, BSE, BSE_INDEX, NFO, BFO, MCX, CDS and the other Tradeboard exchanges
* Symbol format is `TRADEBOARD_SYMBOL-TRADEBOARD_EXCHANGE`, for example `INFY-NSE`, `CRUDEOIL19NOV25FUT-MCX`, `TCS-BSE`
* Coloured status indicator in the AmiBroker status bar
* Supports mixed EOD/intraday databases

The plugin uses two separate channels, and both have to be reachable:

* **Historical data** comes from the Tradeboard REST API, `POST /api/v1/history`, on the HTTP port (default `5000`). The plugin requests `interval=1m` for 1-minute charts and `interval=D` for daily charts. No other Tradeboard interval is exposed through the plugin.
* **Live data** comes from the Tradeboard WebSocket proxy (default `ws://127.0.0.1:8765`). The plugin authenticates with your Tradeboard API key, then subscribes each symbol in mode 1 (LTP), mode 2 (Quote) and mode 3 (Depth).

Streaming windows deliberately do not fall back to `POST /api/v1/quotes`. Live charts and the Quote Window therefore stay empty when the WebSocket connection is down, even if **Test Connection** on the HTTP side succeeds.

<figure><img src="/assets/Amibroker Charts (1).png" alt=""><figcaption></figcaption></figure>

### Installation Steps

#### 1. Download the Plugin

Download the [Tradeboard Amibroker Plugin](https://github.com/marketcalls/TradeboardPlugin/releases) from the official release page:

<figure><img src="/assets/image (134).png" alt=""><figcaption></figcaption></figure>

#### 2. Extract the Plugin

Extract the downloaded `Tradeboard.Plugin.zip` file. You'll find two folders:

* `32bit` - For 32-bit AmiBroker installations
* `64bit` - For 64-bit AmiBroker installations

<figure><img src="/assets/image (133).png" alt=""><figcaption></figcaption></figure>

#### 3. Close AmiBroker

**IMPORTANT:** If AmiBroker is currently running, close it completely before proceeding. This ensures the plugin loads correctly when AmiBroker restarts.

#### 4. Copy the Plugin File

1. Navigate to the appropriate folder based on your AmiBroker version:
   * For 64-bit AmiBroker: Open the `64bit` folder
   * For 32-bit AmiBroker: Open the `32bit` folder
2. Copy the `Tradeboard.dll` file
3.  Paste it into your AmiBroker Plugins folder, typically located at:

    ```
    C:\Program Files\AmiBroker\Plugins\
    ```

    or

    ```
    C:\Program Files (x86)\AmiBroker\Plugins\
    ```

<figure><img src="/assets/image (135).png" alt=""><figcaption></figcaption></figure>

#### 5. Restart AmiBroker

Launch AmiBroker. The Tradeboard plugin should now be loaded automatically.

### Configuration

#### 1. Create/Open AmiBroker Database

1. In AmiBroker, create a new database or open an existing one
2. When creating a database, select **Tradeboard Plugin** as the data source
3. Set the Number of Bars as 75000 for sufficient amount of backfill data
4. Set the Base Time Interval as 1-minute

<figure><img src="/assets/image (136).png" alt=""><figcaption></figcaption></figure>

#### 2. Configure Intraday Settings

1. Click on **Intraday** **Settings button**
2. Select the option: **"Allow mixed EOD/intraday data"**
3. Click **OK** to save

<figure><img src="/assets/image (137).png" alt=""><figcaption></figcaption></figure>

#### 3. Configure Tradeboard Plugin Settings

1. Click on  **Configure Button** (also reachable from **File** -> **Database Settings** -> **Configure**)
2. Configure the **Server Settings**:
   * **Server**: Enter your Tradeboard server address (e.g., `127.0.0.1`)
   * **Port**: Enter the port number (default: `5000`)
   * **API Key**: Enter your Tradeboard API key
   * **Backfill Refresh (sec)**: How often the plugin re-fetches 1-minute history for cached symbols (default: `30`). It does not control the live tick rate, which is driven by the WebSocket feed. The connection heartbeat is fixed internally at 30 seconds.
   * **Time Shift (hours)**: Set time shift if needed (default: `0`)
3. Click **Test Connection** to verify server connectivity
4. Configure the **WebSocket Settings**:
   * **WebSocket URL**: Enter your WebSocket URL (e.g., `ws://127.0.0.1:8765`)
   * Click **Test WebSocket** to verify the connection
   * Monitor the **WebSocket Status** field
5. Verify the **Connection Status** shows as "Ready"
6. Click **OK** to save all settings

<figure><img src="/assets/image (138).png" alt=""><figcaption></figcaption></figure>

#### 4. Add Symbols

1. In AmiBroker, go to **Symbol** > **New** to add a new symbol
2. Click **New** to add a new symbol
3. Enter the symbol ticker (e.g., `SBIN-NSE`, `RELIANCE-BSE`, `NIFTY-NSE_INDEX`, `CRUDEOIL18JUN26FUT-MCX`)
4. symbol format is `tradeboard symbol-tradeboard exchange`
5. If the exchange suffix is omitted the plugin falls back to `NSE`, which is wrong for futures, options, MCX and BSE symbols, so always include it
6. The plugin will automatically fetch live data for the symbol

#### 5. Backfill History

Right-click the Tradeboard status area in the AmiBroker status bar to open the plugin menu. Apart from **Connect**, **Disconnect** and **Configure...**, it offers:

* **Backfill 1-Minute Data**: 3 Months, 6 Months or 1 Year, for the current symbol or for all symbols
* **Backfill Daily Data**: 5 Years, 10 Years or 25 Years, for the current symbol or for all symbols

"Current symbol" is the active chart symbol. "All symbols" covers the symbols already in the chart cache or subscribed over the WebSocket. Backfill runs one symbol at a time on purpose, so a large "All Symbols" request finishes sequentially rather than bursting requests at your broker.

### Verification

1. Ensure Tradeboard server is running in the background
2. Add a symbol in AmiBroker
3. Open a chart for the symbol
4. You should see live data streaming into the chart
5. Check the AmiBroker log window for any connection or data errors

The plugin status area in the AmiBroker status bar reports the connection state as a coloured indicator:

| Indicator | Colour | Meaning                    |
| --------- | ------ | -------------------------- |
| WAIT      | Yellow | Waiting for connection     |
| OK        | Green  | Connected                  |
| ERR       | Red    | Disconnected or error      |
| OFF       | Purple | Shut down by the user      |
| ???       | Grey   | State unknown              |

### Troubleshooting

#### Plugin Not Loading

* Verify you copied the correct DLL version (32-bit or 64-bit) matching your AmiBroker installation
* Ensure AmiBroker was restarted after copying the plugin
* Check Windows Event Viewer for any DLL loading errors

#### Connection Issues

* Verify Tradeboard server is running
* Check the Server address and Port are correct
* Ensure your firewall is not blocking the connection
* Test the API key directly with Tradeboard API

#### WebSocket Issues

* Verify the WebSocket URL is correct
* Check if the WebSocket service is running on the Tradeboard server
* Ensure port 8765 (or your configured port) is not blocked

#### No Data Appearing

* Verify the symbol format matches what Tradeboard expects, including the `-EXCHANGE` suffix
* Check the AmiBroker log window for error messages
* Ensure Backfill Refresh (sec) is not set so high that intraday history stops catching up
* Verify your broker's market data feed covers the requested symbols and that Tradeboard is logged in to the broker

#### Known Limitations

* **Time & Sales is not populating reliably** in the current release. The plugin subscribes to the required WebSocket streams but the Time & Sales window may stay empty. Charts and the Realtime Quote Window are unaffected.
* Only the 1-minute and Daily intervals are exposed. Other Tradeboard intervals are not available through the plugin.
* Streaming windows are WebSocket-only by design. There is no REST quote polling fallback.

### Support

For issues and support, please visit:

* GitHub Issues: https://github.com/marketcalls/TradeboardPlugin/issues
* Tradeboard Documentation: https://docs.algo.wesoftcorp.com

### Notes

* The plugin requires an active internet connection and running Tradeboard server connected with your broker
* Ensure your Tradeboard server has valid broker credentials configured
* Data availability depends on your broker's data feed and on the intervals your broker's history API supports
* The WebSocket connection provides real-time tick data updates; the REST history API provides the completed bars behind them
