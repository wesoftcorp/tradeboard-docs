# Mobile App

**Tradeboard Terminal** is a Flutter mobile trading app that connects to your own Tradeboard server. It is a **frontend only** application: it holds no broker credentials of its own, stores no data centrally, and talks exclusively to the server URL and API key you give it.

* Repository: [wesoftcorp/tradeboard-docs-mobile](https://github.com/wesoftcorp/tradeboard-mobile)
* Built with Flutter and Dart
* Platforms: Android and Web
* Licence: AGPL-3.0

***

## What It Does

### Trading

| Feature | Description |
| --- | --- |
| **Watchlist** | Track multiple instruments with real-time quotes |
| **Live market data** | Price updates on a rolling refresh |
| **Order management** | Place, modify and cancel orders |
| **Positions** | Monitor open positions and holdings |
| **Tradebook** | Full history of executions |
| **Market depth** | Level 2 order book |
| **Account overview** | Available cash, used margin and P&L |

### Other

| Feature | Description |
| --- | --- |
| **Analyzer mode** | Switch between live and analyze (paper trading) without leaving the app |
| **Configurable header** | Choose the indices on the header, such as NIFTY, BANKNIFTY, SENSEX and INDIAVIX |
| **Themes** | Light and dark |

***

## Prerequisites

You need a **running Tradeboard server** and an API key from its dashboard. The app is a client; it cannot trade on its own.

* Install Tradeboard from [Getting Started](../getting-started/README.md), or
* Point the app at a server you already run

Then generate an API key from the `/apikey` page of that server.

***

## Connecting

The app asks for two things on first run:

1. **Server URL**, for example `https://yourdomain.com` or your local address
2. **API key**, from your Tradeboard dashboard

::: warning
Reaching a **local** Tradeboard install from a phone needs the server to be accessible from the phone's network. `127.0.0.1` refers to the phone itself, not your computer.

Use your machine's LAN address, or expose the server properly with one of the tunnelling or custom domain guides under [Getting Started](../getting-started/README.md). Anything you expose publicly needs TLS and the usual hardening: the API key is the credential that resolves your broker session.
:::

***

## Security Model

The app follows the same principle as the rest of Tradeboard: **your broker credentials never leave your server.**

* The app holds an **Tradeboard API key**, not broker credentials
* The server resolves that key to the active broker session
* Revoking the key from the dashboard cuts the app off without touching your broker account
* No trading data passes through any third party

***

## Related

* [Chrome Extension](chrome-extension.md) for browser-based order entry
* [Mini FOSS Universe](../mini-foss-universe.md) for the rest of the ecosystem
* [Getting Started](../getting-started/README.md) to set up the server the app connects to
