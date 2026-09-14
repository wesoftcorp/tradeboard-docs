# Sample Expert Advisor

Here is a sample EMA Crossover Based Simple Expert Advisor which places orders to Tradeboard Connected Brokers.

Before attaching it to a chart, tick **Allow DLL imports** in the EA's Common tab. The Tradeboard library sends its requests through `wininet.dll`, so without that permission no order leaves MetaTrader.

`TradingSymbol` is the Tradeboard symbol of the instrument you want to trade, and it is independent of the MetaTrader chart the EA runs on. The EA reads its EMAs from the chart symbol (`_Symbol`) but routes every order to `TradingSymbol` through Tradeboard. The input is deliberately not called `Symbol`, because that would shadow MQL5's built-in `Symbol()` function.

```cpp
//+------------------------------------------------------------------+
//|                                                      Tradeboard.mq5|
//|                        Copyright 2024, Tradeboard.in               |
//|                        https://www.tradeboard.in                   |
//+------------------------------------------------------------------+
#property copyright "Copyright 2024, Tradeboard.in"
#property link      "https://www.tradeboard.in"
#property version   "1.00"
#property strict

#include <Tradeboard/TradeboardApi.mqh>

input string ApiUrl = "http://127.0.0.1:5000";
input string ApiKey = "your_app_apikey";
input string Strategy = "Metatrader 5 Strategy";
input string TradingSymbol = "SAIL";
input int Quantity = 1;

// Enums as input parameters
input Exchanges Exchange = NSE; // Default value set to NSE Equity
input ProductTypes Product = MIS; // Default value set to MIS for Intraday Square off
input PriceTypes PriceType = MARKET; // Default value set to Market Order

input int FastEMAPeriod = 5;
input int SlowEMAPeriod = 10;

int handleFastEMA;
int handleSlowEMA;
datetime lastOrderTime = 0; // This will store the time of the last candle for which an order was placed

int OnInit()
{
    handleFastEMA = iMA(_Symbol, _Period, FastEMAPeriod, 0, MODE_EMA, PRICE_CLOSE);
    handleSlowEMA = iMA(_Symbol, _Period, SlowEMAPeriod, 0, MODE_EMA, PRICE_CLOSE);

    if (handleFastEMA == INVALID_HANDLE || handleSlowEMA == INVALID_HANDLE)
    {
        Print("Failed to initialize EMA handles");
        return INIT_FAILED;
    }
    
    return INIT_SUCCEEDED;
}

void OnDeinit(const int reason)
{
    if(handleFastEMA != INVALID_HANDLE) IndicatorRelease(handleFastEMA);
    if(handleSlowEMA != INVALID_HANDLE) IndicatorRelease(handleSlowEMA);
}

void OnTick()
{
    // Buffer arrays to store EMA values for the last two completed candles
    double fastEMAValues[2];
    double slowEMAValues[2];
    
    // Get the opening time of the last completed candle
    datetime currentCandleTime = iTime(_Symbol, _Period, 1);

    // Copy EMA values for the last two completed candles
    if (CopyBuffer(handleFastEMA, 0, 1, 2, fastEMAValues) <= 0 ||
        CopyBuffer(handleSlowEMA, 0, 1, 2, slowEMAValues) <= 0)
        
        
    {
        Print("Error copying EMA values");
        return;
    }

    // Determine the direction of the crossover
    bool isPositiveCrossover = fastEMAValues[0] < slowEMAValues[0] && fastEMAValues[1] > slowEMAValues[1];
    bool isNegativeCrossover = fastEMAValues[0] > slowEMAValues[0] && fastEMAValues[1] < slowEMAValues[1];
    

    // Check if an order has already been placed for the current candle
    if (currentCandleTime > lastOrderTime)
    {
        if (isPositiveCrossover)
        {
            // Correct action for a positive crossover
            PlaceOrder("BUY", Quantity, ApiUrl, ApiKey, Strategy, TradingSymbol, Exchange, Product, PriceType);
            Print("Placing BUY order on positive EMA crossover");
            lastOrderTime = currentCandleTime; // Update the last order time
        }
        else if (isNegativeCrossover)
        {
            // Correct action for a negative crossover
            PlaceOrder("SELL", Quantity, ApiUrl, ApiKey, Strategy, TradingSymbol, Exchange, Product, PriceType);
            Print("Placing SELL order on negative EMA crossover");
            lastOrderTime = currentCandleTime; // Update the last order time
        }
    }
}

//+------------------------------------------------------------------+

```
