# EMA Crossover Strategy with Stoploss and Target

### Strategy Type

**Test Strategy**: purpose-built for functional validation of data flow, signal generation, order placement, and WebSocket-based exits. Tight SL/Target are kept intentional for testing.

### Instrument Configuration

* Exchange: **NSE**
* Symbol: **NHPC**
* Quantity: **1**
* Product: **MIS**
* Timeframe (bars): **5m**
* Historical Lookback: **3 days** (`LOOKBACK_DAYS`, valid range 1 to 30)
* Trade Direction Mode: **BOTH** (supports `LONG` / `SHORT` / `BOTH`)

> Note: Behavior is logic-driven; MIS is used only for convenience during tests.

### Indicators Used

* **EMA 2:** Exponential Moving Average over the last 2 closing prices (very short-term).
* **EMA 4:** Exponential Moving Average over the last 4 closing prices (short-term).

### Entry Conditions

* Fetch **5-minute** historical candle data approximately every **5 seconds**.
* Calculate **EMA-2** and **EMA-4**.
* Confirm crossover using the **last two closed candles** (not the current forming candle).
* **Buy Signal:** Previous candle EMA-2 is at or below EMA-4 **and** last closed candle EMA-2 > EMA-4.
* **Sell Signal:** Previous candle EMA-2 is at or above EMA-4 **and** last closed candle EMA-2 < EMA-4.
* On confirmed signal:
  * Place a **MARKET** order (**BUY** or **SELL**).
  * Capture entry price and compute risk levels:
    * **For BUY:** Stoploss = Entry - **Rs.0.10**, Target = Entry + **Rs.0.20**
    * **For SELL:** Stoploss = Entry + **Rs.0.10**, Target = Entry - **Rs.0.20**

### Exit Conditions

* Use **WebSocket** streaming to receive live **LTP** updates.
* Continuously check if LTP hits the defined **stoploss** or **target**.
* When triggered, **exit** via a **MARKET** order in the **opposite** direction.

### Strategy Architecture

* **Two threads:**
  * **WebSocket Thread:** Listens to real-time LTP and checks SL/Target.
  * **Strategy Thread:** Periodically fetches historical data, evaluates EMA signals, and initiates trades.
* Uses `threading.Event()` for graceful shutdown via **CTRL+C**.

### Shutdown Behavior

* On keyboard interrupt, both threads are stopped safely.
* WebSocket subscription is removed and the connection is closed.
* If a position is open, the strategy attempts to **close it with a MARKET order** before exit.
* The strategy exits cleanly and logs the shutdown.

***

#### Complete Code

```python
"""
===============================================================================
                EMA CROSSOVER WITH FIXED DATETIME HANDLING
                            Tradeboard Trading Bot
===============================================================================
"""

from tradeboard import api
import pandas as pd
from datetime import datetime, timedelta
import threading
import time

# ===============================================================================
# TRADING CONFIGURATION
# ===============================================================================

# API Configuration
API_KEY = "tradeboard-apikey"
API_HOST = "http://127.0.0.1:5000"
WS_URL = "ws://127.0.0.1:8765"

# Trade Settings
SYMBOL = "NHPC"              # Stock to trade
EXCHANGE = "NSE"             # Exchange (NSE, BSE, NFO, etc.)
QUANTITY = 1                 # Number of shares
PRODUCT = "MIS"              # MIS (Intraday) or CNC (Delivery)

# Strategy Parameters
FAST_EMA_PERIOD = 2          # Fast EMA (smaller number)
SLOW_EMA_PERIOD = 4          # Slow EMA (larger number)
CANDLE_TIMEFRAME = "5m"      # 1m, 5m, 15m, 30m, 1h, D (see client.intervals())

# Historical Data Lookback
LOOKBACK_DAYS = 3            # Number of days to fetch historical data (1-30)

# Risk Management
STOPLOSS = 0.1               # Stoploss in Rupees
TARGET = 0.2                 # Target in Rupees

# Direction Control
TRADE_DIRECTION = "BOTH"     # Options: "LONG", "SHORT", "BOTH"

# Signal Check Interval
SIGNAL_CHECK_INTERVAL = 5    # Check for signals every X seconds

# ===============================================================================
# TRADING BOT WITH FIXED DATETIME
# ===============================================================================

class ConfigurableEMABot:
    def __init__(self):
        """Initialize the trading bot with configurable parameters"""
        # Initialize API client
        self.client = api(
            api_key=API_KEY,
            host=API_HOST,
            ws_url=WS_URL
        )
        
        # Position tracking
        self.position = None
        self.entry_price = 0
        self.stoploss_price = 0
        self.target_price = 0
        
        # Real-time price tracking
        self.ltp = None
        self.exit_in_progress = False
        
        # Thread control
        self.running = True
        self.stop_event = threading.Event()
        
        # Instrument for WebSocket
        self.instrument = [{"exchange": EXCHANGE, "symbol": SYMBOL}]
        
        # Strategy name
        self.strategy_name = f"EMA_{TRADE_DIRECTION}"
        
        # Validate lookback period
        if LOOKBACK_DAYS < 1:
            print("[WARNING] LOOKBACK_DAYS too small, setting to 1")
            self.lookback_days = 1
        elif LOOKBACK_DAYS > 30:
            print("[WARNING] LOOKBACK_DAYS too large, setting to 30")
            self.lookback_days = 30
        else:
            self.lookback_days = LOOKBACK_DAYS
        
        print("[BOT] Tradeboard Trading Bot Started")
        print(f"[BOT] Direction Mode: {TRADE_DIRECTION}")
        print(f"[BOT] Strategy: {FAST_EMA_PERIOD} EMA x {SLOW_EMA_PERIOD} EMA")
        print(f"[BOT] Lookback Period: {self.lookback_days} days")
        print(f"[BOT] Signal Check Interval: {SIGNAL_CHECK_INTERVAL} seconds")
    
    # ===============================================================================
    # WEBSOCKET HANDLER WITH IMMEDIATE EXIT
    # ===============================================================================
    
    def on_ltp_update(self, data):
        """Handle real-time LTP updates and place exit orders immediately"""
        if data.get("type") == "market_data" and data.get("symbol") == SYMBOL:
            self.ltp = float(data["data"]["ltp"])
            
            # Display current status
            current_time = datetime.now().strftime("%H:%M:%S")
            
            if self.position and not self.exit_in_progress:
                # Calculate real-time P&L
                if self.position == "BUY":
                    unrealized_pnl = (self.ltp - self.entry_price) * QUANTITY
                else:
                    unrealized_pnl = (self.entry_price - self.ltp) * QUANTITY
                
                pnl_sign = "+" if unrealized_pnl > 0 else "-"
                print(f"\r[{current_time}] LTP: Rs.{self.ltp:.2f} | "
                      f"{self.position} @ Rs.{self.entry_price:.2f} | "
                      f"P&L: {pnl_sign}Rs.{abs(unrealized_pnl):.2f} | "
                      f"SL: {self.stoploss_price:.2f} | TG: {self.target_price:.2f}    ", end="")
                
                # Check and execute exit immediately
                exit_reason = None
                
                if self.position == "BUY":
                    if self.ltp <= self.stoploss_price:
                        exit_reason = "STOPLOSS HIT"
                        print(f"\n[ALERT] STOPLOSS HIT! LTP Rs.{self.ltp:.2f} <= SL Rs.{self.stoploss_price:.2f}")
                    elif self.ltp >= self.target_price:
                        exit_reason = "TARGET HIT"
                        print(f"\n[ALERT] TARGET HIT! LTP Rs.{self.ltp:.2f} >= Target Rs.{self.target_price:.2f}")
                
                elif self.position == "SELL":
                    if self.ltp >= self.stoploss_price:
                        exit_reason = "STOPLOSS HIT"
                        print(f"\n[ALERT] STOPLOSS HIT! LTP Rs.{self.ltp:.2f} >= SL Rs.{self.stoploss_price:.2f}")
                    elif self.ltp <= self.target_price:
                        exit_reason = "TARGET HIT"
                        print(f"\n[ALERT] TARGET HIT! LTP Rs.{self.ltp:.2f} <= Target Rs.{self.target_price:.2f}")
                
                # Place exit order immediately if SL/Target hit
                if exit_reason and not self.exit_in_progress:
                    self.exit_in_progress = True
                    print(f"[EXIT] Placing exit order immediately...")
                    
                    # Create a new thread for exit to avoid blocking WebSocket
                    exit_thread = threading.Thread(
                        target=self.place_exit_order,
                        args=(exit_reason,)
                    )
                    exit_thread.start()
            
            elif not self.position:
                print(f"\r[{current_time}] LTP: Rs.{self.ltp:.2f} | No Position | Mode: {TRADE_DIRECTION} | Lookback: {self.lookback_days}d    ", end="")
    
    def websocket_thread(self):
        """WebSocket thread for real-time price updates"""
        try:
            print("[WEBSOCKET] Connecting...")
            self.client.connect()
            
            # Subscribe to LTP updates
            self.client.subscribe_ltp(self.instrument, on_data_received=self.on_ltp_update)
            print(f"[WEBSOCKET] Connected - Monitoring {SYMBOL} in real-time")
            
            # Keep thread alive
            while not self.stop_event.is_set():
                time.sleep(1)
                
        except Exception as e:
            print(f"\n[ERROR] WebSocket error: {e}")
        finally:
            print("\n[WEBSOCKET] Closing connection...")
            try:
                self.client.unsubscribe_ltp(self.instrument)
                self.client.disconnect()
            except:
                pass
            print("[WEBSOCKET] Connection closed")
    
    # ===============================================================================
    # TRADING FUNCTIONS
    # ===============================================================================
    
    def get_historical_data(self):
        """Fetch historical candle data with configurable lookback - FIXED VERSION"""
        try:
            end_date = datetime.now()
            start_date = end_date - timedelta(days=self.lookback_days)
            
            print(f"\n[DATA] Fetching {self.lookback_days} days of historical data...")
            print(f"[DATA] From: {start_date.strftime('%Y-%m-%d')} To: {end_date.strftime('%Y-%m-%d')}")
            
            data = self.client.history(
                symbol=SYMBOL,
                exchange=EXCHANGE,
                interval=CANDLE_TIMEFRAME,
                start_date=start_date.strftime("%Y-%m-%d"),
                end_date=end_date.strftime("%Y-%m-%d")
            )
            
            if data is not None and len(data) > 0:
                # Handle datetime field properly
                if 'datetime' in data.columns:
                    # Get first and last datetime as strings
                    first_time = str(data['datetime'].iloc[0])
                    last_time = str(data['datetime'].iloc[-1])
                    print(f"[DATA] Received {len(data)} candles from {first_time} to {last_time}")
                elif 'date' in data.columns:
                    first_date = str(data['date'].iloc[0])
                    last_date = str(data['date'].iloc[-1])
                    print(f"[DATA] Received {len(data)} candles from {first_date} to {last_date}")
                else:
                    print(f"[DATA] Received {len(data)} candles")
            else:
                print("[WARNING] No data received from API")
            
            return data
            
        except Exception as e:
            print(f"\n[ERROR] Failed to fetch data: {str(e)}")
            print(f"[DEBUG] Error type: {type(e).__name__}")
            
            # Try alternative approach without datetime access
            try:
                end_date = datetime.now()
                start_date = end_date - timedelta(days=self.lookback_days)
                
                data = self.client.history(
                    symbol=SYMBOL,
                    exchange=EXCHANGE,
                    interval=CANDLE_TIMEFRAME,
                    start_date=start_date.strftime("%Y-%m-%d"),
                    end_date=end_date.strftime("%Y-%m-%d")
                )
                
                if data is not None and len(data) > 0:
                    print(f"[DATA] Successfully received {len(data)} candles (alternative method)")
                    return data
                    
            except Exception as e2:
                print(f"[ERROR] Alternative fetch also failed: {str(e2)}")
            
            return None
    
    def check_for_signal(self, data):
        """Check for EMA crossover signals with direction filter"""
        if data is None:
            return None
            
        if len(data) < SLOW_EMA_PERIOD + 2:
            print(f"[INFO] Insufficient data. Need at least {SLOW_EMA_PERIOD + 2} candles, have {len(data)}")
            return None
        
        try:
            # Calculate EMAs
            data['fast_ema'] = data['close'].ewm(span=FAST_EMA_PERIOD, adjust=False).mean()
            data['slow_ema'] = data['close'].ewm(span=SLOW_EMA_PERIOD, adjust=False).mean()
            
            # Get last two completed candles
            prev = data.iloc[-3]
            last = data.iloc[-2]
            current = data.iloc[-1]
            
            # Display EMA values for debugging
            print(f"[DEBUG] Fast EMA: {last['fast_ema']:.2f}, Slow EMA: {last['slow_ema']:.2f}, Close: {current['close']:.2f}")
            
            # Check for BUY signal (Fast EMA crosses above Slow EMA)
            if prev['fast_ema'] <= prev['slow_ema'] and last['fast_ema'] > last['slow_ema']:
                if TRADE_DIRECTION in ["LONG", "BOTH"]:
                    print(f"[SIGNAL] BUY - Fast EMA crossed above Slow EMA")
                    return "BUY"
                else:
                    print(f"[SIGNAL] BUY signal detected but ignored (Mode: {TRADE_DIRECTION})")
                    return None
            
            # Check for SELL signal (Fast EMA crosses below Slow EMA)
            if prev['fast_ema'] >= prev['slow_ema'] and last['fast_ema'] < last['slow_ema']:
                if TRADE_DIRECTION in ["SHORT", "BOTH"]:
                    print(f"[SIGNAL] SELL - Fast EMA crossed below Slow EMA")
                    return "SELL"
                else:
                    print(f"[SIGNAL] SELL signal detected but ignored (Mode: {TRADE_DIRECTION})")
                    return None
            
        except Exception as e:
            print(f"[ERROR] Error checking signal: {str(e)}")
        
        return None
    
    def get_executed_price(self, order_id):
        """Get actual executed price from order status"""
        max_attempts = 5
        
        for attempt in range(max_attempts):
            time.sleep(2)
            
            try:
                response = self.client.orderstatus(
                    order_id=order_id,
                    strategy=self.strategy_name
                )
                
                if response.get("status") == "success":
                    order_data = response.get("data", {})
                    
                    if order_data.get("order_status") == "complete":
                        executed_price = float(order_data.get("average_price", 0))
                        if executed_price > 0:
                            return executed_price
                    
                    elif order_data.get("order_status") in ["rejected", "cancelled"]:
                        print(f"[ERROR] Order {order_data.get('order_status')}")
                        return None
                    
                    else:
                        print(f"[WAITING] Order status: {order_data.get('order_status')}")
                
            except Exception as e:
                print(f"[ERROR] Failed to get order status: {e}")
        
        return None
    
    def place_entry_order(self, signal):
        """Place entry order based on direction filter"""
        # Double-check direction filter
        if signal == "BUY" and TRADE_DIRECTION == "SHORT":
            print("[INFO] BUY signal ignored - SHORT only mode")
            return False
        
        if signal == "SELL" and TRADE_DIRECTION == "LONG":
            print("[INFO] SELL signal ignored - LONG only mode")
            return False
        
        print(f"\n[ORDER] Placing {signal} order for {QUANTITY} shares of {SYMBOL}")
        
        try:
            response = self.client.placeorder(
                strategy=self.strategy_name,
                symbol=SYMBOL,
                exchange=EXCHANGE,
                action=signal,
                quantity=QUANTITY,
                price_type="MARKET",
                product=PRODUCT
            )
            
            if response.get("status") == "success":
                order_id = response.get("orderid")
                print(f"[ORDER] Order placed. ID: {order_id}")
                
                # Get actual executed price
                executed_price = self.get_executed_price(order_id)
                
                if executed_price:
                    self.position = signal
                    self.entry_price = executed_price
                    
                    # Set SL and Target
                    if signal == "BUY":
                        self.stoploss_price = round(self.entry_price - STOPLOSS, 2)
                        self.target_price = round(self.entry_price + TARGET, 2)
                    else:  # SELL
                        self.stoploss_price = round(self.entry_price + STOPLOSS, 2)
                        self.target_price = round(self.entry_price - TARGET, 2)
                    
                    print("\n" + "="*60)
                    print(" TRADE EXECUTED")
                    print("="*60)
                    print(f" Direction Mode: {TRADE_DIRECTION}")
                    print(f" Position: {signal}")
                    print(f" Entry Price: Rs.{self.entry_price:.2f}")
                    print(f" Quantity: {QUANTITY}")
                    print(f" Stoploss: Rs.{self.stoploss_price:.2f}")
                    print(f" Target: Rs.{self.target_price:.2f}")
                    print("="*60)
                    print("\n[INFO] WebSocket monitoring SL/Target in real-time...")
                    
                    # Reset exit flag after successful entry
                    self.exit_in_progress = False
                    
                    return True
                else:
                    print("[ERROR] Could not get executed price")
            else:
                print(f"[ERROR] Order failed: {response}")
                
        except Exception as e:
            print(f"[ERROR] Failed to place order: {e}")
        
        return False
    
    def place_exit_order(self, reason="Manual"):
        """Place exit order - called immediately from WebSocket handler"""
        if not self.position:
            self.exit_in_progress = False
            return
        
        exit_action = "SELL" if self.position == "BUY" else "BUY"
        print(f"\n[EXIT] Closing {self.position} position - {reason}")
        
        try:
            response = self.client.placeorder(
                strategy=self.strategy_name,
                symbol=SYMBOL,
                exchange=EXCHANGE,
                action=exit_action,
                quantity=QUANTITY,
                price_type="MARKET",
                product=PRODUCT
            )
            
            if response.get("status") == "success":
                order_id = response.get("orderid")
                print(f"[EXIT] Exit order placed. ID: {order_id}")
                
                exit_price = self.get_executed_price(order_id)
                
                if exit_price:
                    # Calculate P&L
                    if self.position == "BUY":
                        pnl = (exit_price - self.entry_price) * QUANTITY
                    else:
                        pnl = (self.entry_price - exit_price) * QUANTITY
                    
                    print("\n" + "="*60)
                    print(" POSITION CLOSED")
                    print("="*60)
                    print(f" Reason: {reason}")
                    print(f" Exit Price: Rs.{exit_price:.2f}")
                    print(f" Entry Price: Rs.{self.entry_price:.2f}")
                    print(f" P&L: Rs.{pnl:.2f} [{('PROFIT' if pnl > 0 else 'LOSS')}]")
                    print("="*60)
                else:
                    print("[WARNING] Exit order placed but could not confirm price")
                
                # Reset position regardless
                self.position = None
                self.entry_price = 0
                self.stoploss_price = 0
                self.target_price = 0
                self.exit_in_progress = False
                
            else:
                print(f"[ERROR] Exit order failed: {response}")
                self.exit_in_progress = False  # Reset flag to allow retry
                
        except Exception as e:
            print(f"[ERROR] Failed to exit: {e}")
            self.exit_in_progress = False  # Reset flag to allow retry
    
    # ===============================================================================
    # STRATEGY THREAD
    # ===============================================================================
    
    def strategy_thread(self):
        """Strategy thread for signal generation only (exit handled by WebSocket)"""
        print("[STRATEGY] Strategy thread started")
        print(f"[STRATEGY] Direction: {TRADE_DIRECTION} trades only")
        print(f"[STRATEGY] Checking signals every {SIGNAL_CHECK_INTERVAL} seconds")
        print(f"[STRATEGY] Using {self.lookback_days} days of historical data")
        
        # Initial data fetch on startup
        initial_data_fetched = False
        
        while not self.stop_event.is_set():
            try:
                # Only look for entry signals if not in position
                if not self.position and not self.exit_in_progress:
                    data = self.get_historical_data()
                    
                    if data is not None:
                        if not initial_data_fetched:
                            print(f"[STRATEGY] Initial data loaded: {len(data)} candles")
                            initial_data_fetched = True
                        
                        signal = self.check_for_signal(data)
                        if signal:
                            self.place_entry_order(signal)
                    else:
                        if not initial_data_fetched:
                            print("[WARNING] Waiting for historical data...")
                
                # Check signals at configured interval
                time.sleep(SIGNAL_CHECK_INTERVAL)
                
            except Exception as e:
                print(f"\n[ERROR] Strategy error: {e}")
                time.sleep(10)
    
    # ===============================================================================
    # MAIN RUN METHOD
    # ===============================================================================
    
    def run(self):
        """Main method to run the bot"""
        print("="*60)
        print(" EMA CROSSOVER BOT - FIXED VERSION")
        print("="*60)
        print(f" Symbol: {SYMBOL} | Exchange: {EXCHANGE}")
        print(f" Strategy: {FAST_EMA_PERIOD} EMA x {SLOW_EMA_PERIOD} EMA")
        print(f" Direction: {TRADE_DIRECTION} trades only")
        print(f" Risk: SL Rs.{STOPLOSS} | Target Rs.{TARGET}")
        print(f" Timeframe: {CANDLE_TIMEFRAME}")
        print(f" Lookback: {self.lookback_days} days")
        print(f" Signal Check: Every {SIGNAL_CHECK_INTERVAL} seconds")
        print("="*60)
        
        # Display direction mode details
        if TRADE_DIRECTION == "LONG":
            print(" [MODE] LONG ONLY - Will only take BUY trades")
        elif TRADE_DIRECTION == "SHORT":
            print(" [MODE] SHORT ONLY - Will only take SELL trades")
        else:
            print(" [MODE] BOTH - Will take both BUY and SELL trades")
        
        print("="*60)
        print("\nPress Ctrl+C to stop the bot\n")
        
        # Start WebSocket thread
        ws_thread = threading.Thread(target=self.websocket_thread, daemon=True)
        ws_thread.start()
        
        # Give WebSocket time to connect
        time.sleep(2)
        
        # Start strategy thread
        strat_thread = threading.Thread(target=self.strategy_thread, daemon=True)
        strat_thread.start()
        
        try:
            # Keep main thread alive
            while self.running:
                time.sleep(1)
                
        except KeyboardInterrupt:
            print("\n\n[SHUTDOWN] Shutting down bot...")
            self.running = False
            self.stop_event.set()
            
            # Close any open position
            if self.position and not self.exit_in_progress:
                print("[INFO] Closing open position before shutdown...")
                self.place_exit_order("Bot Shutdown")
            
            # Wait for threads to finish
            ws_thread.join(timeout=5)
            strat_thread.join(timeout=5)
            
            print("[SUCCESS] Bot stopped successfully!")

# ===============================================================================
# START THE BOT
# ===============================================================================

if __name__ == "__main__":
    print("\n" + "="*60)
    print(" TRADEBOARD EMA STRATEGY - READY TO RUN")
    print("="*60)
    print(f" Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f" Mode: {TRADE_DIRECTION}")
    print(f" Lookback: {LOOKBACK_DAYS} days")
    print("="*60 + "\n")
    
    # Create and run the bot
    bot = ConfigurableEMABot()
    bot.run()
```

***

