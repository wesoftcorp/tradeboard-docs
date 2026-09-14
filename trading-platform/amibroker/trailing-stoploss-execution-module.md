# Trailing Stoploss Execution Module

## Internet Function Method

```clike
// Rajeev Upadhyay - Creator of Tradeboard
// Website - tradeboard.in / marketcalls.in
// Tradeboard - Amibroker Trailing Stoploss Execution Module
// Date - 13/12/2024

_SECTION_BEGIN("Tradeboard Trailing Stoploss Execution Module");

// Initial setup and parameters
RequestTimedRefresh(1, False);
EnableTextOutput(False);

// Tradeboard Configuration Parameters
apikey = ParamStr("Tradeboard API Key", "******");
strategy = ParamStr("Strategy", "TSL_Strategy");
symbol = ParamStr("Symbol", "YESBANK");
exchange = ParamList("Exchange", "NSE|NFO|BSE|MCX|CDS");
product = ParamList("Product", "MIS|NRML|CNC");
quantity = Param("Quantity", 1, 1, 1000, 1);
host = ParamStr("Host", "http://127.0.0.1:5000");
ver = ParamStr("API Version", "v1");
VoiceAlert = ParamList("Voice Alert", "Disable|Enable", 1);
EnableAlgo = ParamList("Algo Mode", "Disable|Enable", 0);
TestMode = ParamList("Test Mode", "Disable|Enable", 0);

// TSL Specific Parameters
StopLevel = 1 - Param("Trailing Stop %", 3, 0.1, 10, 0.1)/100;
Order_TickSize = Param("Order Tick Size", 1, 0.01, 1, 0.01);
Entrydelay = Param("Entry Delay", 0, 0, 1, 1);
Exitdelay = Param("Exit Delay", 0, 0, 1, 1);

reset = ParamTrigger("Memory Reset","Reset Now");

// Function to round price to nearest tick size
function RoundToTickSize(price, tickSize) {
    return Floor(price/tickSize + 0.5) * tickSize;
}

// Initialize static variables
bridgeurl = host + "/api/" + ver;
static_name_ = Name() + GetChartID() + interval(2) + strategy;
static_name_algo = static_name_ + interval(2) + strategy + "algostatus";
static_name_tsl = static_name_ + "_tsl";
static_name_orderid = static_name_ + "_orderid";

if(reset)
{

StaticVarRemove(static_name_+"_tsl");
StaticVarRemove(static_name_+"_orderid");

}

// HTTP Post Request Function
function HttpPostRequest(url, postData) {
    headers = "Content-Type: application/json\r\n" +
              "Accept-Encoding: gzip, deflate\r\n";
    InternetSetHeaders(headers);
    ih = InternetPostRequest(url, postData);
    response = "";
    if(ih) {
        while((line = InternetReadString(ih)) != "") 
            response += line;
        InternetClose(ih);
    }
    return response;
}

// JSON Value Extraction Function
function ExtractJsonValue(jsonStr, key, isNested) {
    result = "";
    jsonData = jsonStr;

    if(isNested) {
        dataStart = StrFind(jsonStr, "\"data\":{");
        if(dataStart > 0) dataStart = dataStart - 1;
        
        if(dataStart >= 0) {
            valueStart = dataStart + 7;
            valueEnd = valueStart;
            braceCount = 1;
            strLenJson = StrLen(jsonStr);

            while(valueEnd < strLenJson) {
                currChar = StrMid(jsonStr, valueEnd, 1);
                if(currChar == "{") braceCount++;
                if(currChar == "}") braceCount--;
                if(braceCount == 0) break;
                valueEnd++;
            }
            
            jsonData = StrMid(jsonStr, valueStart, valueEnd - valueStart);
        }
    }
    
    keyPos = StrFind(jsonData, "\"" + key + "\":");
    if(keyPos > 0) keyPos = keyPos - 1;
    
    if(keyPos > -1) {
        valueStart = keyPos + StrLen(key) + 3;
        while(StrMid(jsonData, valueStart, 1) == " ") valueStart++;
        
        firstValChar = StrMid(jsonData, valueStart, 1);
        isQuoted = (firstValChar == "\"");
        
        strLenData = StrLen(jsonData);
        valueEnd = valueStart;
        
        if(isQuoted) {
            valueStart++;
            valueEnd = valueStart;
            while(valueEnd < strLenData) {
                currChar = StrMid(jsonData, valueEnd, 1);
                if(currChar == "\"") break; 
                valueEnd++;
            }
            result = StrMid(jsonData, valueStart, valueEnd - valueStart);
        } else {
            while(valueEnd < strLenData) {
                currChar = StrMid(jsonData, valueEnd, 1);
                if(currChar == "," OR currChar == "}") break;
                valueEnd++;
            }
            result = StrMid(jsonData, valueStart, valueEnd - valueStart);
        }
    }
    
    return result;
}

// Order Management Functions
function PlaceStopLossMarketOrder(action, triggerPrice) {
    postData = "{\"apikey\": \"" + apikey + "\", " +
               "\"strategy\": \"" + strategy + "\", " +
               "\"symbol\": \"" + symbol + "\", " +
               "\"action\": \"" + action + "\", " +
               "\"exchange\": \"" + exchange + "\", " +
               "\"pricetype\": \"SL-M\", " +
               "\"price\": \"0\", " +  // Price is 0 for SL-M orders
               "\"trigger_price\": \"" + triggerPrice + "\", " +
               "\"product\": \"" + product + "\", " +
               "\"quantity\": \"" + quantity + "\"}";
    _TRACE("SL-M Order Request: " + postData);
    response = HttpPostRequest(bridgeurl + "/placeorder", postData);
    _TRACE("SL-M Order Response: " + response);
    return response;
}

function CheckOrderStatus(orderid) {
    postData = "{\"apikey\": \"" + apikey + "\", " +
               "\"strategy\": \"" + strategy + "\", " +
               "\"orderid\": \"" + orderid + "\"}";
    response = HttpPostRequest(bridgeurl + "/orderstatus", postData);
    _TRACE("Order Status Check for OrderID " + orderid + " Response: " + response);
    return response;
}

function ModifyStopLossMarketOrder(orderid, triggerPrice) {
    postData = "{\"apikey\": \"" + apikey + "\", " +
               "\"strategy\": \"" + strategy + "\", " +
               "\"symbol\": \"" + symbol + "\", " +
               "\"action\": \"SELL\", " +  // Added action field
               "\"exchange\": \"" + exchange + "\", " +
               "\"orderid\": \"" + orderid + "\", " +
               "\"product\": \"" + product + "\", " +
               "\"pricetype\": \"SL-M\", " +
               "\"price\": \"0\", " +  // Price is 0 for SL-M orders
               "\"trigger_price\": \"" + triggerPrice + "\", " +
               "\"quantity\": \"" + quantity + "\", " +
               "\"disclosed_quantity\": \"0\"}";  // Added disclosed_quantity field
    _TRACE("Modify SL-M Order Request for OrderID " + orderid + ": " + postData);
    response = HttpPostRequest(bridgeurl + "/modifyorder", postData);
    _TRACE("Modify SL-M Order Response: " + response);
    return response;
}

function PlaceMarketEntry(action) {
    postData = "{\"apikey\": \"" + apikey + "\", " +
               "\"strategy\": \"" + strategy + "\", " +
               "\"symbol\": \"" + symbol + "\", " +
               "\"action\": \"" + action + "\", " +
               "\"exchange\": \"" + exchange + "\", " +
               "\"pricetype\": \"MARKET\", " +
               "\"product\": \"" + product + "\", " +
               "\"quantity\": \"" + quantity + "\"}";
    
    _TRACE("Market Entry Order Request: " + postData);
    response = HttpPostRequest(bridgeurl + "/placeorder", postData);
    _TRACE("Market Entry Order Response: " + response);
    return response;
}

// Trading signals
Buy = Cross(MACD(), Signal());
Sell = 0;
trailARRAY = Null;
trailstop = 0;

// Calculate Trailing Stop Level
for(i = 1; i < BarCount; i++) {
    if(trailstop == 0 AND Buy[i]) { 
        trailstop = High[i] * StopLevel;
        //_TRACE("New TSL Level calculated: " + trailstop);
    }
    else Buy[i] = 0;
    
    if(trailstop > 0 AND Low[i] < trailstop) {
        Sell[i] = 1;
        SellPrice[i] = trailstop;
        //_TRACE("TSL Hit - Sell Signal Generated at: " + trailstop);
        trailstop = 0;
    }
    
    if(trailstop > 0) {
        newTSL = Max(High[i] * StopLevel, trailstop);
        if(newTSL != trailstop) {
            //_TRACE("TSL Level Updated from " + trailstop + " to " + newTSL);
            trailstop = newTSL;
        }
        trailARRAY[i] = trailstop;
    }
}

// Execution Logic
AlgoBuy = LastValue(Ref(Buy, -Entrydelay));
AlgoSell = LastValue(Ref(Sell, -Exitdelay));
currentTSL = RoundToTickSize(LastValue(trailARRAY), Order_TickSize);
//_TRACE("Raw TSL: " + LastValue(trailARRAY) + ", Rounded to tick size: " + currentTSL);

if(EnableAlgo == "Enable") {
    // Print current stored OrderID
    printf("\nAlgo Mode Enabled");
    storedOrderId = StaticVarGetText(static_name_orderid);
    printf("\nCurrent Stored OrderID: " + storedOrderId);
    printf("\nCurrent TSL: " + currentTSL);
    
    // Entry Logic
    if(AlgoBuy AND Nz(StaticVarGet(static_name_ + "entryAlgo")) == 0) {
        _TRACE("Buy Signal Detected - Executing Market Entry");
        entryResponse = PlaceMarketEntry("BUY");
        
        if(entryResponse != "") {
            _TRACE("Entry Order Executed Successfully");
            if(currentTSL > 0) {
                _TRACE("Placing Initial TSL SL-M Order at trigger: " + currentTSL);
                tslResponse = PlaceStopLossMarketOrder("SELL", currentTSL);
                
                if(tslResponse != "") {
                    orderid = ExtractJsonValue(tslResponse, "orderid", False);
                    if(orderid != "") {
                        StaticVarSetText(static_name_orderid, orderid);
                        StaticVarSet(static_name_tsl, currentTSL);
                        _TRACE("New TSL OrderID Stored: " + orderid);
                        if(VoiceAlert == "Enable") Say("Entry and TSL Orders Placed");
                    }
                }
            }
            StaticVarSet(static_name_ + "entryAlgo", 1);
        }
    }
    
    // TSL Modification Logic
    if(currentTSL > 0 AND currentTSL != StaticVarGet(static_name_tsl)) {
        orderid = StaticVarGetText(static_name_orderid);
        _TRACE("Checking TSL Order: " + orderid);
        
        if(orderid != "") {
            statusResponse = CheckOrderStatus(orderid);
            if(statusResponse != "") {
                orderStatus = ExtractJsonValue(statusResponse, "order_status", True);
                _TRACE("Current TSL Order Status: " + orderStatus);
                
                if(orderStatus == "open") {
                    _TRACE("Modifying SL-M Order " + orderid + " trigger from " + StaticVarGet(static_name_tsl) + " to " + currentTSL);
                    modifyResponse = ModifyStopLossMarketOrder(orderid, currentTSL);
                    if(modifyResponse != "") {
                        StaticVarSet(static_name_tsl, currentTSL);
                        _TRACE("TSL Order Modified Successfully");
                    }
                }
            }
        }
    }
    
    // Exit Logic
    if(AlgoSell AND Nz(StaticVarGet(static_name_ + "exitAlgo")) == 0) {
        orderid = StaticVarGetText(static_name_orderid);
        _TRACE("TSL Hit - Checking Order: " + orderid);
        
        if(orderid != "") {
            statusResponse = CheckOrderStatus(orderid);
            if(statusResponse != "") {
                orderStatus = ExtractJsonValue(statusResponse, "order_status", True);
                _TRACE("TSL Hit - Order Status: " + orderStatus);
                
                if(orderStatus == "complete") {
                    _TRACE("TSL Order " + orderid + " Executed Successfully");
                    if(VoiceAlert == "Enable") Say("Trailing Stop Loss Hit");
                    StaticVarSet(static_name_ + "exitAlgo", 1);
                    // Clear the stored OrderID
                    StaticVarSetText(static_name_orderid, "");
                }
            }
        }
    }
}

Plot(trailARRAY, "Trailing Stop Level", colorRed);

_SECTION_END();

_SECTION_BEGIN("Trading Signals");

//Plot the trading signals

/* Plot Buy and Sell Signal Arrows */
PlotShapes(IIf(Buy, shapeSquare, shapeNone),colorGreen, 0, L, Offset=-40);
PlotShapes(IIf(Buy, shapeSquare, shapeNone),colorLime, 0,L, Offset=-50);                      
PlotShapes(IIf(Buy, shapeUpArrow, shapeNone),colorWhite, 0,L, Offset=-45); 
PlotShapes(IIf(Sell, shapeSquare, shapeNone),colorRed, 0, H, Offset=40);
PlotShapes(IIf(Sell, shapeSquare, shapeNone),colorOrange, 0,H, Offset=50);                      
PlotShapes(IIf(Sell, shapeDownArrow, shapeNone),colorWhite, 0,H, Offset=-45);

_SECTION_END();

_SECTION_BEGIN("Candlestick Charts with Date & Time Axis");

//Enable the Date & Time Axis
SetChartOptions(0, chartShowArrows | chartShowDates);

//Plotting Candlestick charts
Plot(Close,"Candle",colorDefault,styleCandle);

_SECTION_END();
```
