# Button Trading Module

## Internet Functions Method (Modern)

```clike
//Rajeev Upadhyay - Creator of Tradeboard
//website - tradeboard.in / marketcalls.in
//Tradeboard - Amibroker Button Trading Module v1.0
//Date - 10/12/2024

_SECTION_BEGIN("Tradeboard Button Trading - Modern Internet Functions");

amiversion = Version();

RequestTimedRefresh(1, False);

// Define parameter controls
apikey = ParamStr("Tradeboard API Key", "******");
strategy = ParamStr("Strategy", "Amibroker");
symbol = ParamStr("Symbol", "RELIANCE");
exchange = ParamList("Exchange", "NSE|NFO|BSE|MCX|CDS");
pricetype = ParamStr("Price Type", "MARKET");
product = ParamList("Product", "MIS|NRML|CNC");
quantity = Param("Quantity", 1, 1, 1000, 1);

host = ParamStr("Host", "http://127.0.0.1:5000");
ver = ParamStr("API Version", "v1");

VoiceAlert = ParamList("Voice Alert", "Disable|Enable", 1);
EnableAlgo = ParamList("Algo Mode", "Disable|Enable", 0);

// Construct URL base
bridgeurl = host + "/api/" + ver;

// Static variable for Algo status
static_name_algo = Name() + GetChartID() + interval(2) + strategy + "_algostatus";

// Function to Place Order
function PlaceOrder(action, quantity)
{
    postData = 
    "{\"apikey\": \"" + apikey + "\", " +
    "\"strategy\": \"" + strategy + "\", " +
    "\"symbol\": \"" + symbol + "\", " +
    "\"action\": \"" + action + "\", " +
    "\"exchange\": \"" + exchange + "\", " +
    "\"pricetype\": \"" + pricetype + "\", " +
    "\"product\": \"" + product + "\", " +
    "\"quantity\": \"" + quantity + "\"}";

    headers = "Content-Type: application/json\r\n" +
              "Accept-Encoding: gzip, deflate\r\n";
    InternetSetHeaders(headers);

    _TRACE("Request Sent: " + postData); // Log request
    ih = InternetPostRequest(bridgeurl + "/placeorder", postData);

    if (ih)
    {
        response = "";
        while ((line = InternetReadString(ih)) != "")
        {
            response += line;
        }
        _TRACEF("Order Response: %s", response);
        if (VoiceAlert == "Enable") Say(action + " Order Placed.");
        InternetClose(ih);
    }
    else
    {
        _TRACE("Failed to place order.");
    }
}

// Function to Square Off All Positions
function SquareOffAll()
{
    postData = "{\"apikey\": \"" + apikey + "\", \"strategy\": \"" + strategy + "\"}";
    headers = "Content-Type: application/json\r\n" +
              "Accept-Encoding: gzip, deflate\r\n";
    InternetSetHeaders(headers);

    _TRACE("Request Sent: " + postData); // Log request
    ih = InternetPostRequest(bridgeurl + "/closeposition", postData);

    if (ih)
    {
        response = "";
        while ((line = InternetReadString(ih)) != "")
        {
            response += line;
        }
        _TRACEF("Square Off Response: %s", response);
        if (VoiceAlert == "Enable") Say("All positions squared off.");
        InternetClose(ih);
    }
    else
    {
        _TRACE("Failed to square off positions.");
    }
}

// Button Trading Implementation
X0 = 20;
Y0 = 100;
X1 = 60;

LBClick = GetCursorMouseButtons() == 9;
MouseX = Nz(GetCursorXPosition(1));
MouseY = Nz(GetCursorYPosition(1));

// Procedure to Draw Button
procedure DrawButton(Text, x1, y1, x2, y2, colorFrom, colorTo)
{
    GfxSetOverlayMode(0);
    GfxSelectFont("Verdana", 9, 700);
    GfxSetBkMode(1);
    GfxGradientRect(x1, y1, x2, y2, colorFrom, colorTo);
    GfxDrawText(Text, x1, y1, x2, y2, 32 | 1 | 4 | 16);
}

if (amiversion >= 6.4) {

// Algo Mode Status Dashboard
GfxSelectFont("BOOK ANTIQUA", 14, 100);
GfxSetBkMode(1);

if (EnableAlgo == "Enable")
{
    AlgoStatus = "Algo Enabled";
    GfxSetTextColor(colorGreen);
    GfxTextOut("Algostatus: " + AlgoStatus, 20, 40);
    if (Nz(StaticVarGet(static_name_algo), 0) != 1)
    {
        _TRACE("Algo Status: Enabled");
        StaticVarSet(static_name_algo, 1);
    }
}
else
{
    AlgoStatus = "Algo Disabled";
    GfxSetTextColor(colorRed);
    GfxTextOut("Algostatus: " + AlgoStatus, 20, 40);
    if (Nz(StaticVarGet(static_name_algo), 0) != 0)
    {
        _TRACE("Algo Status: Disabled");
        StaticVarSet(static_name_algo, 0);
    }
}
GfxSetTextColor(colorWhite);

if (EnableAlgo == "Enable")
{
    // Draw buttons
    DrawButton("BE", X0, Y0, X0 + X1, Y0 + 50, colorGreen, colorGreen);
    CursorInBEButton = MouseX >= X0 AND MouseX <= X0 + X1 AND MouseY >= Y0 AND MouseY <= Y0 + 50;
    BEButtonClick = CursorInBEButton AND LBClick;

    DrawButton("BX", X0 + 65, Y0, X0 + X1 + 65, Y0 + 50, colorRed, colorRed);
    CursorInBXButton = MouseX >= X0 + 65 AND MouseX <= X0 + X1 + 65 AND MouseY >= Y0 AND MouseY <= Y0 + 50;
    BxButtonClick = CursorInBXButton AND LBClick;

    DrawButton("SE", X0, Y0 + 55, X0 + X1, Y0 + 105, colorRed, colorRed);
    CursorInSEButton = MouseX >= X0 AND MouseX <= X0 + X1 AND MouseY >= Y0 + 55 AND MouseY <= Y0 + 105;
    SEButtonClick = CursorInSEButton AND LBClick;

    DrawButton("SX", X0 + 65, Y0 + 55, X0 + X1 + 65, Y0 + 105, colorGreen, colorGreen);
    CursorInSXButton = MouseX >= X0 + 65 AND MouseX <= X0 + X1 + 65 AND MouseY >= Y0 + 55 AND MouseY <= Y0 + 105;
    SXButtonClick = CursorInSXButton AND LBClick;

    DrawButton("CLOSE ALL", X0, Y0 + 110, X0 + X1 + 65, Y0 + 155, colorRed, colorRed);
    CursorInCXButton = MouseX >= X0 AND MouseX <= X0 + X1 + 65 AND MouseY >= Y0 + 110 AND MouseY <= Y0 + 155;
    CXButtonClick = CursorInCXButton AND LBClick;

    // Button Actions
    if (BEButtonClick AND StaticVarGet(static_name_algo + "BE") == 0)
    {
        PlaceOrder("BUY", quantity);
        StaticVarSet(static_name_algo + "BE", 1);
    }
    else
    {
        StaticVarSet(static_name_algo + "BE", 0);
    }

    if (BXButtonClick AND StaticVarGet(static_name_algo + "BX") == 0)
    {
        PlaceOrder("SELL", quantity);
        StaticVarSet(static_name_algo + "BX", 1);
    }
    else
    {
        StaticVarSet(static_name_algo + "BX", 0);
    }

    if (SEButtonClick AND StaticVarGet(static_name_algo + "SE") == 0)
    {
        PlaceOrder("SELL", quantity);
        StaticVarSet(static_name_algo + "SE", 1);
    }
    else
    {
        StaticVarSet(static_name_algo + "SE", 0);
    }

    if (SXButtonClick AND StaticVarGet(static_name_algo + "SX") == 0)
    {
        PlaceOrder("BUY", quantity);
        StaticVarSet(static_name_algo + "SX", 1);
    }
    else
    {
        StaticVarSet(static_name_algo + "SX", 0);
    }

    if (CXButtonClick AND StaticVarGet(static_name_algo + "CX") == 0)
    {
        SquareOffAll();
        StaticVarSet(static_name_algo + "CX", 1);
    }
    else
    {
        StaticVarSet(static_name_algo + "CX", 0);
    }
}

}

else {
    GfxSetBkMode(1); // Transparent background
    GfxSelectFont("Arial", 16, 700); // Font for text
    GfxSetTextColor(colorRed); // Text color
    GfxTextOut("You are using an older version of AmiBroker. This feature is not supported. Amibroker 6.4 or higher is required", 50, 50);
}

_SECTION_END();

_SECTION_BEGIN("Candlestick Charts with Date & Time Axis");

// Enable the Date & Time Axis
SetChartOptions(0, chartShowArrows | chartShowDates);

// Plotting Candlestick charts
Plot(Close, "Candle", colorDefault, stylebar);

_SECTION_END();

```

## VB Script Method (Legacy)

```clike
//Rajeev Upadhyay - Creator of Tradeboard
//website - tradeboard.in / marketcalls.in
//Tradeboard - Amibroker Button Trading Module v1.0
//Date - 10/02/2024

_SECTION_BEGIN("Tradeboard Button Trading");

RequestTimedRefresh(1,False);

apikey = ParamStr("Tradeboard API Key", "******");
strategy = ParamStr("Strategy", "Amibroker");
symbol = ParamStr("Symbol", "RELIANCE");
exchange = ParamList("Exchange", "NSE|NFO|BSE|MCX|CDS");
pricetype = ParamStr("Price Type", "MARKET");
product = ParamList("Product", "MIS|NRML|CNC");
quantity = Param("Quantity", 1,1,1000,1);

host = ParamStr("host","http://127.0.0.1:5000");
ver = ParamStr("API Version","v1");

VoiceAlert = ParamList("Voice Alert","Disable|Enable",1);
EnableAlgo = ParamList("Algo Mode","Disable|Enable",0); // Algo Mode

bridgeurl = host+"/api/"+ver;

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

_SECTION_BEGIN("Button Trading - For Old Amibroker Versions");

X0 = 20;
Y0 = 100;
X1 = 60;

LBClick = GetCursorMouseButtons() == 9;	// Click
MouseX  = Nz(GetCursorXPosition(1));		// 
MouseY  = Nz(GetCursorYPosition(1));		//

procedure DrawButton (Text, x1, y1, x2, y2, colorFrom, colorTo)
{
	GfxSetOverlayMode(0);
	GfxSelectFont("Verdana", 9, 700);
	GfxSetBkMode(1);
	GfxGradientRect(x1, y1, x2, y2, colorFrom, colorTo);
	GfxDrawText(Text, x1, y1, x2, y2, 32|1|4|16);
}
GfxSetTextColor(colorWhite);

if(EnableAlgo == "Enable")
{  

	DrawButton("BE", X0, Y0, X0+X1, Y0+50, colorGreen, colorGreen);
	CursorInBEButton = MouseX >= X0 AND MouseX <= X0+X1 AND MouseY >= Y0 AND MouseY <= Y0+50;
	BEButtonClick = CursorInBEButton AND LBClick;
	
	DrawButton("BX", X0+65, Y0, X0+X1+65, Y0+50, colorRed, colorRed);
	CursorInBXButton = MouseX >= X0+65 AND MouseX <= X0+X1+65 AND MouseY >= Y0 AND MouseY <= Y0+50;
	BxButtonClick = CursorInBXButton AND LBClick;
	
	DrawButton("SE", X0, Y0+55, X0+X1, Y0+105, colorRed, colorRed);
	CursorInSEButton = MouseX >= X0 AND MouseX <= X0+X1 AND MouseY >= Y0+55 AND MouseY <= Y0+105;
	SEButtonClick = CursorInSEButton AND LBClick;
	
	DrawButton("SX", X0+65, Y0+55, X0+X1+65, Y0+105, colorGreen, colorGreen);
	CursorInSXButton = MouseX >= X0+65 AND MouseX <= X0+X1+65 AND MouseY >= Y0+55 AND MouseY <= Y0+105;
	SXButtonClick = CursorInSXButton AND LBClick;
	
	DrawButton("CLOSE ALL", X0, Y0+110, X0+X1+65, Y0+155, colorRed, colorRed);
	CursorInCXButton = MouseX >= X0 AND MouseX <= X0+X1+65 AND MouseY >= Y0+110 AND MouseY <= Y0+155;
	CXButtonClick = CursorInCXButton AND LBClick;
	
	
	if( BEButtonClick AND StaticVarGet(static_name_+"BEAlgo")==0 ) 
	{
		tradeboard.placeorder("BUY",quantity);
        if(VoiceAlert == "Enable"){
				Say("Buy Order Triggered");  	
			}
		_TRACE("API Request : "+api_request);
		_TRACE("API Response : "+api_response);
		
		StaticVarSet(static_name_+"BEAlgo",1); 
	}
	else
	{
		StaticVarSet(static_name_+"BEAlgo",0);
	}
	if( BXButtonClick AND StaticVarGet(static_name_+"BXAlgo")==0 ) 
	{
		tradeboard.placeorder("SELL",quantity);
        if(VoiceAlert == "Enable"){
				Say("Sell Order Triggered");  	
			}
		_TRACE("API Request : "+api_request);
		_TRACE("API Response : "+api_response);
		StaticVarSet(static_name_+"BXAlgo",1); 
	}
	else
	{
		StaticVarSet(static_name_+"BXAlgo",0);
	}
		
	if( SEButtonClick AND StaticVarGet(static_name_+"SEAlgo")==0 ) 
	{
		tradeboard.placeorder("SELL",quantity);
        if(VoiceAlert == "Enable"){
				Say("Short Order Triggered");  	
			}
		_TRACE("API Request : "+api_request);
		_TRACE("API Response : "+api_response);
		StaticVarSet(static_name_+"SEAlgo",1); 
	}
	else
	{
		StaticVarSet(static_name_+"SEAlgo",0);
	}

	if( SXButtonClick AND StaticVarGet(static_name_+"SXAlgo")==0 ) 
	{
		tradeboard.placeorder("BUY",quantity);
        if(VoiceAlert == "Enable"){
				Say("Cover Order Triggered");  	
			}
		_TRACE("API Request : "+api_request);
		_TRACE("API Response : "+api_response);
		StaticVarSet(static_name_+"SXAlgo",1); 
	}
	else
	{
		StaticVarSet(static_name_+"SXAlgo",0); 
	}
	
	if( CXButtonClick AND StaticVarGet(Name()+GetChartID()+"CXAlgo")==0 ) 
	{
		tradeboard.Squareoffall();
		if(VoiceAlert == "Enable"){
				Say("Squareoff All Triggered");  	
			}
		_TRACE("API Request : "+sq_api_request);
		_TRACE("API Response : "+sq_api_response);
		StaticVarSet(Name()+GetChartID()+"CXAlgo",1); 
	}
	else
	{
		StaticVarSet(Name()+GetChartID()+"CXAlgo",0);
	}
	
	
}

_SECTION_END();

_SECTION_BEGIN("Candlestick Charts with Date & Time Axis");

//Enable the Date & Time Axis
SetChartOptions(0, chartShowArrows | chartShowDates);

//Plotting Candlestick charts
Plot(Close,"Candle",colorDefault,styleCandle);

_SECTION_END();

```
