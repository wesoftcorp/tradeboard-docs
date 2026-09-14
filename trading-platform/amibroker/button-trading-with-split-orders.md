# Button Trading with Split Orders

This module adds BUY, SELL, SHORT, COVER and CLOSE ALL buttons to the chart and splits a large order into freeze-quantity sized chunks before sending them. The splitting happens in AFL: the `PlaceSplitOrders` function loops and calls `POST /api/v1/placeorder` once per chunk, and CLOSE ALL calls `POST /api/v1/closeposition`.

::: info
Tradeboard also exposes a native [splitorder](../../api-documentation/v1/orders-api/splitorder.md) endpoint that does the same chunking server side from a single request: send `quantity` plus `splitsize` to `POST /api/v1/splitorder`. It keeps the AFL simpler and avoids the client-side loop. See [Button Trading with Spit Order (Options)](button-trading-with-spit-order-options.md) for a module built that way.
:::

```clike
//Rajeev Upadhyay - Creator of Tradeboard
//website - tradeboard.in / marketcalls.in
//Tradeboard - Amibroker Button Trading Split Order Module v1.0
//Date - 21/08/2024

_SECTION_BEGIN("Tradeboard Button Trading with Split Orders");

RequestTimedRefresh(1, False);

// Parameters for trading settings
apikey = ParamStr("Tradeboard API Key", "******");
strategy = ParamStr("Strategy", "Button Trading");
symbol = ParamStr("Symbol", "NIFTY29AUG2424600CE"); //Tradeboard Symbol
exchange = ParamList("Exchange", "NSE|NFO|BSE|MCX|CDS",1);
pricetype = ParamStr("Price Type", "MARKET");
product = ParamList("Product", "MIS|NRML|CNC");
quantity = Param("Quantity", 5000, 1, 10000, 1);  // Total quantity to be traded
freezeqty = Param("Freeze Quantity", 1800, 1, 5000, 1);  // Maximum allowed quantity per order

// Parameters for connectivity settings
host = ParamStr("Host", "http://127.0.0.1:5000");
ver = ParamStr("API Version", "v1");

// Control parameters for voice alerts and algo mode
VoiceAlert = ParamList("Voice Alert", "Disable|Enable", 1);
EnableAlgo = ParamList("Algo Mode", "Disable|Enable", 0);  // Algo Mode

bridgeurl = host + "/api/" + ver;

static_name_ = Name()+GetChartID()+interval(2)+strategy;
static_name_algo = static_name_+interval(2)+strategy+"algostatus";

//Tradeboard Dashboard

GfxSelectFont( "BOOK ANTIQUA", 14, 100 );
GfxSetBkMode( 1 );
if(EnableAlgo == "Enable")
{
AlgoStatus = "Algo Enabled";
GfxSetTextColor( colorGreen ); 
GfxTextOut( "Algostatus : "+AlgoStatus , 20, 40); 
if(Nz(StaticVarGet(static_name_algo),0)!=1)
{
_TRACE("Algo Status : Enabled");
StaticVarSet(static_name_algo, 1);
}
}
if(EnableAlgo == "Disable")
{
AlgoStatus = "Algo Disabled";
GfxSetTextColor( colorRed ); 
GfxTextOut( "Algostatus : "+AlgoStatus , 20, 40); 
if(Nz(StaticVarGet(static_name_algo),0)!=0)
{
_TRACE("Algo Status : Disabled");
StaticVarSet(static_name_algo, 0);
}
}

_SECTION_BEGIN("Tradeboard Bridge Controls");

EnableScript("VBScript"); 
<%
Public Sub PlaceOrder(action, quantity)
    Dim oXMLHTTP
    Dim oStream
    Set oXMLHTTP = CreateObject("Msxml2.XMLHTTP")
    ' Define variables with the specified values
    Dim apikey, strategy, symbol , exchange, pricetype, product
    apikey = AFL.Var("apikey")
    strategy = AFL.Var("strategy")
    symbol = AFL.Var("symbol")
    exchange = AFL.Var("exchange")
    pricetype = AFL.Var("pricetype")
    product = AFL.Var("product")
   
    
    ' Construct the JSON string for the POST message
    Dim jsonRequestBody
    jsonRequestBody = "{""apikey"":""" & apikey & _
    """,""strategy"":""" & strategy & _
    """,""symbol"":""" & symbol & _
    """,""action"":""" & action & _
    """,""exchange"":""" & exchange & _
    """,""pricetype"":""" & pricetype & _
    """,""product"":""" & product & _
    """,""quantity"":""" & quantity & """}"
    
    ' Set the URL
    Dim url
    url = AFL.Var("bridgeurl")&"/placeorder"
    
    ' Configure the HTTP request for POST method
    oXMLHTTP.Open "POST", url, False
    oXMLHTTP.setRequestHeader "Content-Type", "application/json"
    oXMLHTTP.setRequestHeader "Cache-Control", "no-cache"
    oXMLHTTP.setRequestHeader "Pragma", "no-cache"
    
    ' Send the request with the JSON body
    oXMLHTTP.Send jsonRequestBody
    
    api_parameters = "Strategy :" & strategy & " Symbol :" & symbol & " Exchange :" & exchange & _
                 " Action :" & action & " Pricetype :" & pricetype & _
                 " Product :" & product & " Quantity:" & quantity & _
                 " api_url :" & url

    
    AFL("api_request") = api_parameters  
    AFL("api_response") = oXMLHTTP.responseText
    
    
    ' Optionally, handle the response here
    ' Dim response
    ' response = oXMLHTTP.responseText
    ' Response handling code...
End Sub

Public Sub SquareoffAll()
    Dim oXMLHTTP
    Dim oStream
    Set oXMLHTTP = CreateObject("Msxml2.XMLHTTP")
    ' Define variables with the specified values
    Dim apikey, strategy
    apikey = AFL.Var("apikey")
    strategy = AFL.Var("strategy")
      
    
    ' Construct the JSON string for the POST message
    Dim jsonRequestBody
    jsonRequestBody = "{""apikey"":""" & apikey & _
    """,""strategy"":""" & strategy & """}"
    
    ' Set the URL
    Dim url
    url = AFL.Var("bridgeurl")&"/closeposition"
    
    ' Configure the HTTP request for POST method
    oXMLHTTP.Open "POST", url, False
    oXMLHTTP.setRequestHeader "Content-Type", "application/json"
    oXMLHTTP.setRequestHeader "Cache-Control", "no-cache"
    oXMLHTTP.setRequestHeader "Pragma", "no-cache"
    
    ' Send the request with the JSON body
    oXMLHTTP.Send jsonRequestBody
    
    api_parameters = "Strategy :" & strategy & " api_url :" & url

    
    AFL("sq_api_request") = api_parameters  
    AFL("sq_api_response") = oXMLHTTP.responseText
    
    
    ' Optionally, handle the response here
    ' Dim response
    ' response = oXMLHTTP.responseText
    ' Response handling code...
End Sub

%>

tradeboard = GetScriptObject();

// Function to split orders and place them in smaller batches based on freezeqty
function PlaceSplitOrders(action, totalQuantity) {
    remainingQuantity = totalQuantity;  // Start with total quantity

    while (remainingQuantity > 0) {
        if (remainingQuantity >= freezeqty) {
            orderQuantity = freezeqty;
        } else {
            orderQuantity = remainingQuantity;  // Remaining quantity for the last order
        }

        // Place the order with the calculated order quantity
        tradeboard.PlaceOrder(action, orderQuantity);
        _TRACE("Placed " + action + " order for " + orderQuantity + " qty");
		_TRACE("API Request : " + api_request);
        _TRACE("API Response : " + api_response);
        

        // Update the remaining quantity
        remainingQuantity = remainingQuantity - orderQuantity;
    }
}

// Button Trading Logic
X0 = 20;
Y0 = 100;
X1 = 60;

LBClick = GetCursorMouseButtons() == 9;  // Left Button Click
MouseX  = Nz(GetCursorXPosition(1));     // X Position of Mouse
MouseY  = Nz(GetCursorYPosition(1));     // Y Position of Mouse

// Procedure to draw buttons on the chart
procedure DrawButton(Text, x1, y1, x2, y2, colorFrom, colorTo) {
    GfxSetOverlayMode(0);
    GfxSelectFont("Verdana", 9, 700);
    GfxSetBkMode(1);
    GfxGradientRect(x1, y1, x2, y2, colorFrom, colorTo);
    GfxDrawText(Text, x1, y1, x2, y2, 32 | 1 | 4 | 16);
}

GfxSetTextColor(colorWhite);

if (EnableAlgo == "Enable") {
    // Drawing buttons for Buy, Sell, Short, Cover, and Close All
    DrawButton("BUY", X0, Y0, X0 + X1, Y0 + 50, colorGreen, colorGreen);
    CursorInBEButton = MouseX >= X0 AND MouseX <= X0 + X1 AND MouseY >= Y0 AND MouseY <= Y0 + 50;
    BEButtonClick = CursorInBEButton AND LBClick;

    DrawButton("SELL", X0 + 65, Y0, X0 + X1 + 65, Y0 + 50, colorRed, colorRed);
    CursorInBXButton = MouseX >= X0 + 65 AND MouseX <= X0 + X1 + 65 AND MouseY >= Y0 AND MouseY <= Y0 + 50;
    BXButtonClick = CursorInBXButton AND LBClick;

    DrawButton("SHORT", X0, Y0 + 55, X0 + X1, Y0 + 105, colorRed, colorRed);
    CursorInSEButton = MouseX >= X0 AND MouseX <= X0 + X1 AND MouseY >= Y0 + 55 AND MouseY <= Y0 + 105;
    SEButtonClick = CursorInSEButton AND LBClick;

    DrawButton("COVER", X0 + 65, Y0 + 55, X0 + X1 + 65, Y0 + 105, colorGreen, colorGreen);
    CursorInSXButton = MouseX >= X0 + 65 AND MouseX <= X0 + X1 + 65 AND MouseY >= Y0 + 55 AND MouseY <= Y0 + 105;
    SXButtonClick = CursorInSXButton AND LBClick;

    DrawButton("CLOSE ALL", X0, Y0 + 110, X0 + X1 + 65, Y0 + 155, colorRed, colorRed);
    CursorInCXButton = MouseX >= X0 AND MouseX <= X0 + X1 + 65 AND MouseY >= Y0 + 110 AND MouseY <= Y0 + 155;
    CXButtonClick = CursorInCXButton AND LBClick;

    // BUY Button Click Event
    if (BEButtonClick AND StaticVarGet(static_name_ + "BEAlgo") == 0) {
        PlaceSplitOrders("BUY", quantity);  // Split the order into smaller quantities
        if (VoiceAlert == "Enable") {
            Say("Buy Order Triggered");
        }
        
        StaticVarSet(static_name_ + "BEAlgo", 1);
    } else {
        StaticVarSet(static_name_ + "BEAlgo", 0);
    }

    // SELL Button Click Event
    if (BXButtonClick AND StaticVarGet(static_name_ + "BXAlgo") == 0) {
        PlaceSplitOrders("SELL", quantity);  // Split the order into smaller quantities
        if (VoiceAlert == "Enable") {
            Say("Sell Order Triggered");
        }

        StaticVarSet(static_name_ + "BXAlgo", 1);
    } else {
        StaticVarSet(static_name_ + "BXAlgo", 0);
    }

    // SHORT Button Click Event
    if (SEButtonClick AND StaticVarGet(static_name_ + "SEAlgo") == 0) {
        PlaceSplitOrders("SELL", quantity);  // Execute short order as SELL
        if (VoiceAlert == "Enable") {
            Say("Short Order Triggered");
        }

        StaticVarSet(static_name_ + "SEAlgo", 1);
    } else {
        StaticVarSet(static_name_ + "SEAlgo", 0);
    }

    // COVER Button Click Event
    if (SXButtonClick AND StaticVarGet(static_name_ + "SXAlgo") == 0) {
        PlaceSplitOrders("BUY", quantity);  // Execute cover order as BUY
        if (VoiceAlert == "Enable") {
            Say("Cover Order Triggered");
        }

        StaticVarSet(static_name_ + "SXAlgo", 1);
    } else {
        StaticVarSet(static_name_ + "SXAlgo", 0);
    }

    // CLOSE ALL Button Click Event
    if (CXButtonClick AND StaticVarGet(Name() + GetChartID() + "CXAlgo") == 0) {
        tradeboard.SquareoffAll();  // Call the function to close all open positions
        if (VoiceAlert == "Enable") {
            Say("Squareoff All Triggered");
        }
        _TRACE("API Request : " + sq_api_request);
        _TRACE("API Response : " + sq_api_response);
        StaticVarSet(Name() + GetChartID() + "CXAlgo", 1);
    } else {
        StaticVarSet(Name() + GetChartID() + "CXAlgo", 0);
    }
}

_SECTION_END();

_SECTION_BEGIN("Candlestick Charts with Date & Time Axis");

// Enable the Date & Time Axis
SetChartOptions(0, chartShowArrows | chartShowDates);

// Plotting Candlestick charts
Plot(Close, "Candle", colorDefault, styleCandle);

_SECTION_END();

```
