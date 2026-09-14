# Websockets (Verbose Control)

The `verbose` parameter manages SDK-level logging for WebSocket feed operations (LTP, Quote, Depth and order updates).\
This helps developers toggle between silent mode, basic logs, or full debug-level market data streaming.

***

### **Verbose Levels**

| Level      | Value          | Description                                        |
| ---------- | -------------- | -------------------------------------------------- |
| **Silent** | `False` or `0` | No SDK output, not even errors (default)           |
| **Basic**  | `True` or `1`  | Connection, authentication, subscription and error logs |
| **Debug**  | `2`            | All updates: LTP, Quote, Depth and order updates   |

`verbose` only controls what the SDK prints. Your own `on_data_received` callbacks always run, and every method still returns its result, so a silent client is not a blind one. Set `verbose=1` while you are wiring up a feed: at level `0` a failed authentication or a rejected subscription is silent.

***

### **Usage**

```python
from tradeboard import api

# Silent mode (default) - no SDK output
client = api(api_key="...", host="...", ws_url="...", verbose=False)

# Basic logging - connection/subscription info
client = api(api_key="...", host="...", ws_url="...", verbose=True)

# Full debug - all data updates
client = api(api_key="...", host="...", ws_url="...", verbose=2)
```

`ws_url` is optional. When it is omitted the SDK derives the WebSocket URL from `host` and `ws_port` (default `8765`), so a local install can simply use `api(api_key="...", verbose=2)`.

***

### **Auto Reconnect**

`auto_reconnect` defaults to `True`. After a dropped connection the SDK reconnects with exponential backoff (1, 2, 5, 10, 30, 60 seconds, capped at 60), re-authenticates, and replays every active LTP, Quote and Depth subscription plus the account-level order-update subscription. Your existing callbacks are preserved, so they resume firing without any extra code.

```python
# Default: transparent reconnect and subscription replay
client = api(api_key="...", host="http://127.0.0.1:5000")

# Opt out and handle reconnects yourself
client = api(api_key="...", host="http://127.0.0.1:5000", auto_reconnect=False)
```

With `verbose=1` or higher the reconnect attempts and the replayed subscriptions are logged under the `[WS]` and `[SUB]` tags.

***

## **Test Example**

```python
"""
Test verbose control in Tradeboard WebSocket Feed
"""
from tradeboard import api
import time

# Change this to test different levels: False, True, 1, 2
VERBOSE_LEVEL = True

client = api(
    api_key="your_api_key_here",
    host="http://127.0.0.1:5000",
    ws_url="ws://127.0.0.1:8765",
    verbose=VERBOSE_LEVEL
)

instruments_list = [
    {"exchange": "NSE_INDEX", "symbol": "NIFTY"},
    {"exchange": "NSE", "symbol": "INFY"}
]

def on_data_received(data):
    # User callback: always executed regardless of verbose mode
    print(f"MY CALLBACK: {data['symbol']} LTP: {data['data'].get('ltp')}")

print(f"\n=== Testing with verbose={VERBOSE_LEVEL} ===\n")

# Connect and subscribe
client.connect()
client.subscribe_quote(instruments_list, on_data_received=on_data_received)

# Poll few times
for i in range(5):
    print(f"\n--- Poll {i+1} ---")
    quotes = client.get_quotes()
    for exch, symbols in quotes.get('quote', {}).items():
        for sym, data in symbols.items():
            print(f"  {exch}:{sym} = {data.get('ltp')}")
    time.sleep(1)

# Cleanup
client.unsubscribe_quote(instruments_list)
client.disconnect()
```

***

## **Expected Output**

### **verbose=False (Silent)**

```
=== Testing with verbose=False ===

MY CALLBACK: NIFTY LTP: 26008.5

--- Poll 1 ---
  NSE_INDEX:NIFTY = 26008.5
  NSE:INFY = 1531.0
```

***

### **verbose=True (Basic)**

```
=== Testing with verbose=True ===

[WS]     Connected to ws://127.0.0.1:8765
[AUTH]   Authenticating with API key: bf1267a1...7cf9169f
[AUTH]   Success | Broker: upstox | User: rajandran
[SUB]    Subscribing NSE_INDEX:NIFTY Quote...
[SUB]    Subscribing NSE:INFY Quote...
[SUB]    NSE_INDEX:NIFTY | Mode: Quote | Status: success
[SUB]    NSE:INFY | Mode: Quote | Status: success
MY CALLBACK: NIFTY LTP: 26008.5

--- Poll 1 ---
  NSE_INDEX:NIFTY = 26008.5
  NSE:INFY = 1531.0
```

***

### **verbose=2 (Full Debug)**

```
=== Testing with verbose=2 ===

[WS]     Connected to ws://127.0.0.1:8765
[AUTH]   Authenticating with API key: bf1267a1...7cf9169f
[AUTH]   Success | Broker: upstox | User: rajandran
[AUTH]   Full response: {'type': 'auth', 'status': 'success', ...}
[SUB]    Subscribing NSE_INDEX:NIFTY Quote...
[SUB]    Subscribing NSE:INFY Quote...
[SUB]    NSE_INDEX:NIFTY | Mode: Quote | Status: success
[SUB]    NSE:INFY | Mode: Quote | Status: success
[SUB]    Full response: {'type': 'subscribe', ...}
[QUOTE]  NSE_INDEX:NIFTY      | O: 25998.5    H: 26025.5    L: 25924.15   C: 26008.5    LTP: 26008.5
MY CALLBACK: NIFTY LTP: 26008.5
[QUOTE]  NSE:INFY             | O: 1549.0     H: 1550.6     L: 1525.9     C: 1531.0     LTP: 1531.0

--- Poll 1 ---
  NSE_INDEX:NIFTY = 26008.5
  NSE:INFY = 1531.0
```

***

## **Log Categories**

| Tag          | Meaning                             |
| ------------ | ----------------------------------- |
| **\[WS]**    | WebSocket connection events         |
| **\[AUTH]**  | Authentication requests & responses |
| **\[SUB]**   | Subscription operations             |
| **\[UNSUB]** | Unsubscription logs                 |
| **\[LTP]**   | LTP updates _(verbose=2)_           |
| **\[QUOTE]** | Quote updates _(verbose=2)_         |
| **\[DEPTH]** | Market depth updates _(verbose=2)_  |
| **\[ORDER]** | Order status updates via `subscribe_orders()` _(verbose=2)_ |
| **\[ERROR]** | Error messages _(verbose=1 and above)_ |

