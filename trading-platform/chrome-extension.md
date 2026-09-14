# Chrome Extension

A lightweight Chrome extension for the Tradeboard trading platform with a DaisyUI-inspired modern UI.

### Features

* **Quick Trading Actions**: Instantly place trades using LE (Long Entry), LX (Long Exit), SE (Short Entry), and SX (Short Exit) buttons.
* **Minimal Interface**: Compact, draggable layout that integrates directly onto chart pages.
* **Integrated Settings Panel**: Easy configuration using a settings popup with support for multiple exchanges and trading products.
* **Modern UI**: Styled using DaisyUI for a clean and efficient interface.
* **Real-time Feedback**: Visual confirmation for each trading action.

### Download Tradeboard Chrome Extension

[https://github.com/wesoftcorp/tradeboard-chrome/releases/tag/v1.0](https://github.com/wesoftcorp/tradeboard-chrome/releases/tag/v1.0)

### Prerequisites

* **Tradeboard API Server**: The Tradeboard server must be running (locally or remotely) and accessible.
* **API Key**: A valid API key is required to authenticate API requests.
* **Browser**: Chrome version 88 or higher. (Recommended Latest Version of Chrome)

### Installation Guide

#### Install via Developer Mode

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (top right toggle)
3. Click on **"Load unpacked"**
4. Select the folder you extracted from the `.zip` file
5. The Tradeboard extension icon will now appear in your Chrome toolbar

<figure><img src="/assets/image (93).png" alt=""><figcaption></figcaption></figure>

### Usage Guide

#### Getting Started

1. **Start the Tradeboard Server**: Make sure the Tradeboard server is running (default: `http://127.0.0.1:5000`)

<figure><img src="/assets/image (92).png" alt=""><figcaption></figcaption></figure>

1. **Configure Settings**:
   * Click the 3-dot menu icon next to the button panel
   * Fill in the following fields:
     * Host URL (e.g., `http://127.0.0.1:5000`)
     * API Key
     * Symbol (e.g., `RELIANCE` or `NIFTY27APR25FUT`)
     * Exchange. The dropdown offers exactly six values: NSE, BSE, BFO, NFO, MCX and CDS
     * Product (MIS, NRML, CNC)
     * Quantity (e.g., 10, 20, etc.). Futures or Options symbols it is always the total number of shares instead of Lot Size
2. **Save Settings**: Click **Save** to apply your configuration

Settings are stored in Chrome's synced storage, so they follow your Chrome profile across machines. Every field is mandatory: if any one of them is blank the buttons refuse to fire and the settings panel opens instead.

<figure><img src="/assets/image (91).png" alt=""><figcaption></figcaption></figure>

#### Trading Actions

* **LE (Green)**: Long Entry (Buy to Open)
* **LX (Yellow)**: Long Exit (Sell to Close Long)
* **SE (Red)**: Short Entry (Sell to Open Short)
* **SX (Blue)**: Short Exit (Buy to Close Short)

The two entry buttons post a MARKET order to `/api/v1/placeorder` with your configured Quantity, and Tradeboard records the strategy as `Chrome`.

The two exit buttons post to `/api/v1/placesmartorder` with `position_size` set to `0`. That tells Tradeboard to look up your live open position for that symbol, exchange and product and flatten it, whatever its size and direction. Two consequences worth knowing:

* An exit closes the whole position. The Quantity field in settings is not used for exits.
* If there is no open position, nothing is sent to the broker and Tradeboard replies that the position already matches.

The extension is a content script registered against all URLs, so the button bar can be injected on any page you have open, not only charting sites. It can be repositioned anywhere on the screen.

#### Draggable Interface

* Hover over the top edge of the trading bar to reveal the grab handle
* Click and drag to reposition the widget anywhere on the screen

### Troubleshooting

* **No Response from Buttons**:
  * Ensure the Tradeboard server is running
  * Double-check Host URL and API Key
* **Incorrect or Missing Settings**:
  * Reopen settings panel and verify all fields are filled
* **Server Connection Errors**:
  * Confirm the server is reachable at the provided Host URL

***

The Tradeboard Chrome Extension is designed to simplify and streamline your trading experience. With a clean interface and real-time trading controls built right into your browser, it allows you to react quickly to market opportunities with just one click. Whether you're managing long or short positions, this extension brings the power of Tradeboard directly into your charting tools, making intraday trading more efficient and intuitive. Configure once, trade instantly, and let technology work for you while you focus on strategy.
