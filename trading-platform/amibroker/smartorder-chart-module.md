# SmartOrder Chart Module

## Internet Function Method (Modern)

```clike
// Rajeev Upadhyay - Creator of Tradeboard
// Website - tradeboard.in / marketcalls.in
// Tradeboard - Amibroker SmartOrder Chart Trading Module v2.0
// Date - 12/12/2024

_SECTION_BEGIN("Tradeboard SmartOrder Trading Module - Modern Methods");

RequestTimedRefresh(1, False);

// Define parameter controls
apikey = ParamStr("Tradeboard API Key", "******");
strategy = ParamStr("Strategy", "Amibroker");
symbol = ParamStr("Symbol", "YESBANK");
exchange = ParamList("Exchange", "NSE|NFO|BSE|MCX|CDS");
pricetype = ParamStr("Price Type", "MARKET");
product = ParamList("Product", "MIS|NRML|CNC");
quantity = Param("Quantity", 1, 1, 1000, 1);
position_size = Param("Position Size", 0, -1000, 1000, 1);

host = ParamStr("Host", "http://127.0.0.1:5000");
ver = ParamStr("API Version", "v1");

VoiceAlert = ParamList("Voice Alert", "Disable|Enable", 1);
EnableAlgo = ParamList("Algo Mode", "Disable|Enable", 0);
EnableButton = ParamList("Button Trading", "Disable|Enable", 0);

Entrydelay = Param("Entry Delay",0,0,1,1);
Exitdelay = Param("Exit Delay",0,0,1,1);

AlgoBuy = lastvalue(Ref(Buy,-Entrydelay));
AlgoSell = lastvalue(Ref(Sell,-Exitdelay));
AlgoShort = lastvalue(Ref(Short,-Entrydelay));
AlgoCover = lastvalue(Ref(Cover,-Exitdelay));

// Construct URL base
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

//Button Trading Controls

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

// Function to Place Smart Order
function PlaceSmartOrder(action, quantity, position_size) {
    postData = "{\"apikey\": \"" + apikey + "\", " +
               "\"strategy\": \"" + strategy + "\", " +
               "\"symbol\": \"" + symbol + "\", " +
               "\"action\": \"" + action + "\", " +
               "\"exchange\": \"" + exchange + "\", " +
               "\"pricetype\": \"" + pricetype + "\", " +
               "\"product\": \"" + product + "\", " +
               "\"quantity\": \"" + quantity + "\", " +
               "\"position_size\": \"" + position_size + "\"}";

    headers = "Content-Type: application/json\r\n" +
              "Accept-Encoding: gzip, deflate\r\n";
    InternetSetHeaders(headers);

    _TRACE("Smart Order Request Sent: " + postData); // Log request
    ih = InternetPostRequest(bridgeurl + "/placesmartorder", postData);

    if (ih) {
        response = "";
        while ((line = InternetReadString(ih)) != "") {
            response += line;
        }
        _TRACEF("Smart Order Response: %s", response);
        if (VoiceAlert == "Enable") Say(action + " Smart Order Placed.");
        InternetClose(ih);
    } else {
        _TRACE("Failed to place smart order.");
    }
}

// Function to Exit Order
function ExitOrder(action) {
    postData = "{\"apikey\": \"" + apikey + "\", " +
               "\"strategy\": \"" + strategy + "\", " +
               "\"symbol\": \"" + symbol + "\", " +
               "\"action\": \"" + action + "\", " +
               "\"exchange\": \"" + exchange + "\", " +
               "\"pricetype\": \"" + pricetype + "\", " +
               "\"product\": \"" + product + "\", " +
               "\"quantity\": \"0\", " +
               "\"position_size\": \"0\"}";

    headers = "Content-Type: application/json\r\n" +
              "Accept-Encoding: gzip, deflate\r\n";
    InternetSetHeaders(headers);

    _TRACE("Exit Order Request Sent: " + postData); // Log request
    ih = InternetPostRequest(bridgeurl + "/placesmartorder", postData);

    if (ih) {
        response = "";
        while ((line = InternetReadString(ih)) != "") {
            response += line;
        }
        _TRACEF("Exit Order Response: %s", response);
        if (VoiceAlert == "Enable") Say(action + " Exit Order Placed.");
        InternetClose(ih);
    } else {
        _TRACE("Failed to place exit order.");
    }
}

// Function to Square Off All Positions
function SquareOffAll() {
    postData = "{\"apikey\": \"" + apikey + "\", " +
               "\"strategy\": \"" + strategy + "\"}";

    headers = "Content-Type: application/json\r\n" +
              "Accept-Encoding: gzip, deflate\r\n";
    InternetSetHeaders(headers);

    _TRACE("Square Off Request Sent: " + postData); // Log request
    ih = InternetPostRequest(bridgeurl + "/closeposition", postData);

    if (ih) {
        response = "";
        while ((line = InternetReadString(ih)) != "") {
            response += line;
        }
        _TRACEF("Square Off Response: %s", response);
        if (VoiceAlert == "Enable") Say("All positions squared off.");
        InternetClose(ih);
    } else {
        _TRACE("Failed to square off positions.");
    }
}

// Execution Module
if (EnableAlgo != "Disable") {
    lasttime = StrFormat("%0.f", LastValue(BarIndex()));
    SetChartBkColor(colorDarkGrey);

    if (EnableAlgo == "Enable") {
        if (AlgoBuy == True AND AlgoCover == True AND StaticVarGet(static_name_ + "buyCoverAlgo") == 0 AND StaticVarGetText(static_name_ + "buyCoverAlgo_barvalue") != lasttime) {
            PlaceSmartOrder("BUY", quantity, quantity);
            if (VoiceAlert == "Enable") Say("Buy Order Triggered");
            
            StaticVarSetText(static_name_ + "buyCoverAlgo_barvalue", lasttime);
            StaticVarSet(static_name_ + "buyCoverAlgo", 1);
        } else if (AlgoBuy != True OR AlgoCover != True) {
            StaticVarSet(static_name_ + "buyCoverAlgo", 0);
            StaticVarSetText(static_name_ + "buyCoverAlgo_barvalue", "");
        }

        if (AlgoBuy == True AND AlgoCover != True AND StaticVarGet(static_name_ + "buyAlgo") == 0 AND StaticVarGetText(static_name_ + "buyAlgo_barvalue") != lasttime) {
            PlaceSmartOrder("BUY", quantity, position_size);
            if (VoiceAlert == "Enable") Say("Buy Order Triggered");

            StaticVarSetText(static_name_ + "buyAlgo_barvalue", lasttime);
            StaticVarSet(static_name_ + "buyAlgo", 1);
        } else if (AlgoBuy != True) {
            StaticVarSet(static_name_ + "buyAlgo", 0);
            StaticVarSetText(static_name_ + "buyAlgo_barvalue", "");
        }

        if (AlgoSell == true AND AlgoShort != True AND StaticVarGet(static_name_ + "sellAlgo") == 0 AND StaticVarGetText(static_name_ + "sellAlgo_barvalue") != lasttime) {
            ExitOrder("SELL");
            if (VoiceAlert == "Enable") Say("Sell Exit Order Triggered");

            StaticVarSetText(static_name_ + "sellAlgo_barvalue", lasttime);
            StaticVarSet(static_name_ + "sellAlgo", 1);
        } else if (AlgoSell != True) {
            StaticVarSet(static_name_ + "sellAlgo", 0);
            StaticVarSetText(static_name_ + "sellAlgo_barvalue", "");
        }

        if (AlgoShort == True AND AlgoSell == True AND StaticVarGet(static_name_ + "ShortSellAlgo") == 0 AND StaticVarGetText(static_name_ + "ShortSellAlgo_barvalue") != lasttime) {
            PlaceSmartOrder("SELL", quantity, -1 * quantity);
            if (VoiceAlert == "Enable") Say("Short Order Triggered");
            StaticVarSetText(static_name_ + "ShortSellAlgo_barvalue", lasttime);
            StaticVarSet(static_name_ + "ShortSellAlgo", 1);
        } else if (AlgoShort != True OR AlgoSell != True) {
            StaticVarSet(static_name_ + "ShortSellAlgo", 0);
            StaticVarSetText(static_name_ + "ShortSellAlgo_barvalue", "");
        }

        if (AlgoShort == True AND AlgoSell != True AND StaticVarGet(static_name_ + "ShortAlgo") == 0 AND StaticVarGetText(static_name_ + "ShortAlgo_barvalue") != lasttime) {
            PlaceSmartOrder("SELL", quantity, position_size);
            if (VoiceAlert == "Enable") Say("Short Order Triggered");

            StaticVarSetText(static_name_ + "ShortAlgo_barvalue", lasttime);
            StaticVarSet(static_name_ + "ShortAlgo", 1);
        } else if (AlgoShort != True) {
            StaticVarSet(static_name_ + "ShortAlgo", 0);
            StaticVarSetText(static_name_ + "ShortAlgo_barvalue", "");
        }

        if (AlgoCover == true AND AlgoBuy != True AND StaticVarGet(static_name_ + "CoverAlgo") == 0 AND StaticVarGetText(static_name_ + "CoverAlgo_barvalue") != lasttime) {
            ExitOrder("BUY");
            if (VoiceAlert == "Enable") Say("Short Exit Order Triggered");

            StaticVarSetText(static_name_ + "CoverAlgo_barvalue", lasttime);
            StaticVarSet(static_name_ + "CoverAlgo", 1);
        } else if (AlgoCover != True) {
            StaticVarSet(static_name_ + "CoverAlgo", 0);
            StaticVarSetText(static_name_ + "CoverAlgo_barvalue", "");
        }
    }

    if (EnableButton == "Enable") {
        DrawButton("BE", X0, Y0, X0 + X1, Y0 + 50, colorGreen, colorGreen);
        CursorInBEButton = MouseX >= X0 AND MouseX <= X0 + X1 AND MouseY >= Y0 AND MouseY <= Y0 + 50;
        BEButtonClick = CursorInBEButton AND LBClick;

        DrawButton("BX", X0 + 65, Y0, X0 + X1 + 65, Y0 + 50, colorRed, colorRed);
        CursorInBXButton = MouseX >= X0 + 65 AND MouseX <= X0 + X1 + 65 AND MouseY >= Y0 AND MouseY <= Y0 + 50;
        BXButtonClick = CursorInBXButton AND LBClick;

        DrawButton("SE", X0, Y0 + 55, X0 + X1, Y0 + 105, colorRed, colorRed);
        CursorInSEButton = MouseX >= X0 AND MouseX <= X0 + X1 AND MouseY >= Y0 + 55 AND MouseY <= Y0 + 105;
        SEButtonClick = CursorInSEButton AND LBClick;

        DrawButton("SX", X0 + 65, Y0 + 55, X0 + X1 + 65, Y0 + 105, colorGreen, colorGreen);
        CursorInSXButton = MouseX >= X0 + 65 AND MouseX <= X0 + X1 + 65 AND MouseY >= Y0 + 55 AND MouseY <= Y0 + 105;
        SXButtonClick = CursorInSXButton AND LBClick;

        DrawButton("CLOSE ALL", X0, Y0 + 110, X0 + X1 + 65, Y0 + 155, colorRed, colorRed);
        CursorInCXButton = MouseX >= X0 AND MouseX <= X0 + X1 + 65 AND MouseY >= Y0 + 110 AND MouseY <= Y0 + 155;
        CXButtonClick = CursorInCXButton AND LBClick;

        if (BEButtonClick AND StaticVarGet(static_name_ + "BEAlgo") == 0) {
            PlaceSmartOrder("BUY", quantity, position_size);
            if (VoiceAlert == "Enable") {
                Say("Buy Order Triggered");
            }
            _TRACE("API Request: " + postData);
            StaticVarSet(static_name_ + "BEAlgo", 1);
        } else {
            StaticVarSet(static_name_ + "BEAlgo", 0);
        }

        if (BXButtonClick AND StaticVarGet(static_name_ + "BXAlgo") == 0) {
            PlaceSmartOrder("SELL", quantity, position_size);
            if (VoiceAlert == "Enable") {
                Say("Sell Order Triggered");
            }
            _TRACE("API Request: " + postData);
            StaticVarSet(static_name_ + "BXAlgo", 1);
        } else {
            StaticVarSet(static_name_ + "BXAlgo", 0);
        }

        if (SEButtonClick AND StaticVarGet(static_name_ + "SEAlgo") == 0) {
            PlaceSmartOrder("SELL", quantity, position_size);
            if (VoiceAlert == "Enable") {
                Say("Short Order Triggered");
            }
            _TRACE("API Request: " + postData);
            StaticVarSet(static_name_ + "SEAlgo", 1);
        } else {
            StaticVarSet(static_name_ + "SEAlgo", 0);
        }

        if (SXButtonClick AND StaticVarGet(static_name_ + "SXAlgo") == 0) {
            PlaceSmartOrder("BUY", quantity, position_size);
            if (VoiceAlert == "Enable") {
                Say("Cover Order Triggered");
            }
            _TRACE("API Request: " + postData);
            StaticVarSet(static_name_ + "SXAlgo", 1);
        } else {
            StaticVarSet(static_name_ + "SXAlgo", 0);
        }

        if (CXButtonClick AND StaticVarGet(Name() + GetChartID() + "CXAlgo") == 0) {
            SquareOffAll();
            if (VoiceAlert == "Enable") {
                Say("Square Off All Triggered");
            }
            _TRACE("API Request: " + postData);
            StaticVarSet(Name() + GetChartID() + "CXAlgo", 1);
        } else {
            StaticVarSet(Name() + GetChartID() + "CXAlgo", 0);
        }
    }
}

_SECTION_END();

```

## VB Script Method Legacy

```clike

//Rajeev Upadhyay - Creator of Tradeboard
//website - tradeboard.in / marketcalls.in
//Tradeboard - Amibroker SmartOrder Chart Trading Module v1.0
//Date - 10/02/2024

_SECTION_BEGIN("Tradeboard Trading Controls");

RequestTimedRefresh(1,False);

apikey = ParamStr("Tradeboard API Key", "******");
strategy = ParamStr("Strategy", "Amibroker");
symbol = ParamStr("Symbol", "YESBANK");
exchange = ParamList("Exchange", "NSE|NFO|BSE|MCX|CDS");
pricetype = ParamStr("Price Type", "MARKET");
product = ParamList("Product", "MIS|NRML|CNC");
quantity = Param("Quantity", 1,1,1000,1);

Entrydelay = Param("Entry Delay",0,0,1,1);
Exitdelay = Param("Exit Delay",0,0,1,1);

host = ParamStr("host","http://127.0.0.1:5000");
ver = ParamStr("API Version","v1");

VoiceAlert = ParamList("Voice Alert","Disable|Enable",1);
EnableButton = ParamList("Button Trading","Disable|Enable",0);
EnableAlgo = ParamList("Algo Mode","Disable|Enable",0); // Algo Mode

bridgeurl = host+"/api/"+ver;

AlgoBuy = lastvalue(Ref(Buy,-Entrydelay));
AlgoSell = lastvalue(Ref(Sell,-Exitdelay));
AlgoShort = lastvalue(Ref(Short,-Entrydelay));
AlgoCover = lastvalue(Ref(Cover,-Exitdelay));

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

//Button Trading Controls

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

Public Sub PlaceSmartOrder(action, quantity,position_size)
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
    """,""quantity"":""" & quantity & _
    """,""position_size"":""" & position_size & """}"
    
    ' Set the URL
    Dim url
    url = AFL.Var("bridgeurl")&"/placesmartorder"
    
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
                 " Position Size :" & position_size & " api_url :" & url

    
    AFL("sm_api_request") = api_parameters  
    AFL("sm_api_response") = oXMLHTTP.responseText
    
    
    ' Optionally, handle the response here
    ' Dim response
    ' response = oXMLHTTP.responseText
    ' Response handling code...
End Sub

Public Sub ExitOrder(action)
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
    position_size = "0"
    quantity = "0"
   
    
    ' Construct the JSON string for the POST message
    Dim jsonRequestBody
    jsonRequestBody = "{""apikey"":""" & apikey & _
    """,""strategy"":""" & strategy & _
    """,""symbol"":""" & symbol & _
    """,""action"":""" & action & _
    """,""exchange"":""" & exchange & _
    """,""pricetype"":""" & pricetype & _
    """,""product"":""" & product & _
    """,""quantity"":""" & quantity & _
    """,""position_size"":""" & position_size & """}"
    
    ' Set the URL
    Dim url
    url = AFL.Var("bridgeurl")&"/placesmartorder"
    
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
                 " Position Size :" & position_size & " api_url :" & url

    
    AFL("ex_api_request") = api_parameters  
    AFL("ex_api_response") = oXMLHTTP.responseText
    
    
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

//Execution Module

if(EnableAlgo != "Disable")
	{
		lasttime = StrFormat("%0.f",LastValue(BarIndex()));
			
		SetChartBkColor(colorDarkGrey);
		if(EnableButton == "Enable")
		
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
		
		}//button trading ends
		
		
	if(EnableAlgo == "Enable")
        {   
            if (AlgoBuy==True AND AlgoCover == True AND StaticVarGet(static_name_+"buyCoverAlgo")==0 AND StaticVarGetText(static_name_+"buyCoverAlgo_barvalue") != lasttime )
            {
                            
                tradeboard.PlaceSmartOrder("BUY",quantity,quantity);
                if(VoiceAlert == "Enable"){
						Say("Buy Order Triggered");  	
					}
				_TRACE("API Request : "+sm_api_request);
				_TRACE("API Response : "+sm_api_response);
                StaticVarSetText(static_name_+"buyCoverAlgo_barvalue",lasttime);  
                StaticVarSet(static_name_+"buyCoverAlgo",1); //Algo Order was triggered, no more order on this bar
                
        
            }
            else if ((AlgoBuy != True OR AlgoCover != True))
            {   
                StaticVarSet(static_name_+"buyCoverAlgo",0);
                StaticVarSetText(static_name_+"buyCoverAlgo_barvalue","");
            }
            
            if (AlgoBuy==True AND AlgoCover != True AND StaticVarGet(static_name_+"buyAlgo")==0 AND StaticVarGetText(static_name_+"buyAlgo_barvalue") != lasttime)
            {
            // Long Entry 
                tradeboard.PlaceOrder("BUY",quantity);
                if(VoiceAlert == "Enable"){
						Say("Buy Order Triggered");  	
					}
				_TRACE("API Request : "+api_request);
				_TRACE("API Response : "+api_response);
                StaticVarSetText(static_name_+"buyAlgo_barvalue",lasttime); 
                StaticVarSet(static_name_+"buyAlgo",1); //Algo Order was triggered, no more order on this bar
                
            }
            else if (AlgoBuy != True)
            {   
                StaticVarSet(static_name_+"buyAlgo",0);
                StaticVarSetText(static_name_+"buyAlgo_barvalue","");
                
            }
            if (AlgoSell==true AND AlgoShort != True AND StaticVarGet(static_name_+"sellAlgo")==0 AND StaticVarGetText(static_name_+"sellAlgo_barvalue") != lasttime)
            {     
            // Long Exit 
				tradeboard.ExitOrder("SELL");
                if(VoiceAlert == "Enable"){
						Say("Sell Exit Order Triggered");  	
					}
				_TRACE("API Request : "+ex_api_request);
				_TRACE("API Response : "+ex_api_response);
                
                StaticVarSetText(static_name_+"sellAlgo_barvalue",lasttime);
                StaticVarSet(static_name_+"sellAlgo",1); //Algo Order was triggered, no more order on this bar
                
            }
            else if (AlgoSell != True )
            {   
                StaticVarSet(static_name_+"sellAlgo",0);
                StaticVarSetText(static_name_+"sellAlgo_barvalue","");
            }
            if (AlgoShort==True AND AlgoSell==True AND  StaticVarGet(static_name_+"ShortSellAlgo")==0 AND StaticVarGetText(static_name_+"ShortSellAlgo_barvalue") != lasttime)
            {
            // reverse Short Entry 
				tradeboard.PlaceSmartOrder("SELL",quantity,-1*quantity);
                if(VoiceAlert == "Enable"){
						Say("Short Order Triggered");  	
					}
				_TRACE("API Request : "+sm_api_request);
				_TRACE("API Response : "+sm_api_response);
                StaticVarSetText(static_name_+"ShortsellAlgo_barvalue",lasttime);
                StaticVarSet(static_name_+"ShortSellAlgo",1); //Algo Order was triggered, no more order on this bar
                
            }
            else if ((AlgoShort != True OR AlgoSell != True))
            {   
                StaticVarSet(static_name_+"ShortSellAlgo",0);
                StaticVarSetText(static_name_+"ShortsellAlgo_barvalue","");
            }
                
            if (AlgoShort==True  AND  AlgoSell != True AND StaticVarGet(static_name_+"ShortAlgo")==0 AND  StaticVarGetText(static_name_+"ShortAlgo_barvalue") != lasttime)
            {
            // Short Entry
                tradeboard.PlaceOrder("SELL",quantity);
                if(VoiceAlert == "Enable"){
						Say("Short Order Triggered");  	
					}
				_TRACE("API Request : "+api_request);
				_TRACE("API Response : "+api_response);
                StaticVarSetText(static_name_+"ShortAlgo_barvalue",lasttime); 
                StaticVarSet(static_name_+"ShortAlgo",1); //Algo Order was triggered, no more order on this bar
                
            }
            else if (AlgoShort != True )
            {   
                StaticVarSet(static_name_+"ShortAlgo",0);
                StaticVarSetText(static_name_+"ShortAlgo_barvalue","");
            }
            if (AlgoCover==true AND AlgoBuy != True AND StaticVarGet(static_name_+"CoverAlgo")==0 AND StaticVarGetText(static_name_+"CoverAlgo_barvalue") != lasttime)
            {
            // Short Exit
				tradeboard.ExitOrder("BUY");
                if(VoiceAlert == "Enable"){
						Say("Short Exit Order Triggered");  	
					}
				_TRACE("API Request : "+ex_api_request);
				_TRACE("API Response : "+ex_api_response);
               
                StaticVarSetText(static_name_+"CoverAlgo_barvalue",lasttime); 
                StaticVarSet(static_name_+"CoverAlgo",1); //Algo Order was triggered, no more order on this bar
                
            }
            else if (AlgoCover != True )
            {   
                StaticVarSet(static_name_+"CoverAlgo",0);
                StaticVarSetText(static_name_+"CoverAlgo_barvalue","");
            }
        }
        
         else if(EnableAlgo == "LongOnly")
        {
            
            if (AlgoBuy==True AND StaticVarGet(static_name_+"buyAlgo")==0 AND StaticVarGetText(static_name_+"buyAlgo_barvalue") != lasttime)
            {  
            //  Long Entry
                tradeboard.PlaceOrder("BUY",quantity);
                if(VoiceAlert == "Enable"){
						Say("Buy Order Triggered");  	
					}
				_TRACE("API Request : "+api_request);
				_TRACE("API Response : "+api_response);
                StaticVarSetText(static_name_+"buyAlgo_barvalue",lasttime);
                StaticVarSet(static_name_+"buyAlgo",1); //Algo Order was triggered, no more order on this bar
                
            }
            else if (AlgoBuy != True)
            {   
                StaticVarSet(static_name_+"buyAlgo",0);
                StaticVarSetText(static_name_+"buyAlgo_barvalue","");
            }
            if (AlgoSell==true AND StaticVarGet(static_name_+"sellAlgo")==0 AND StaticVarGetText(static_name_+"sellAlgo_barvalue") != lasttime)
            {  
            // Long Exit
                tradeboard.ExitOrder("SELL");
                if(VoiceAlert == "Enable"){
						Say("Sell Exit Order Triggered");  	
					}
				_TRACE("API Request : "+ex_api_request);
				_TRACE("API Response : "+ex_api_response);
                StaticVarSetText(static_name_+"sellAlgo_barvalue",lasttime);
                StaticVarSet(static_name_+"sellAlgo",1); //Algo Order was triggered, no more order on this bar
                
            }
            else if (AlgoSell != True )
            {   
                StaticVarSet(static_name_+"sellAlgo",0);
                StaticVarSetText(static_name_+"sellAlgo_barvalue","");
            }
        }
        else if(EnableAlgo == "ShortOnly")
        {
            if (AlgoShort==True AND StaticVarGet(static_name_+"ShortAlgo")==0 AND StaticVarGetText(static_name_+"ShortAlgo_barvalue") != lasttime)
            {
            // Short Entry
                tradeboard.PlaceOrder("SELL",quantity);
                if(VoiceAlert == "Enable"){
						Say("Short Order Triggered");  	
					}
                StaticVarSetText(static_name_+"ShortAlgo_barvalue",lasttime); 
                StaticVarSet(static_name_+"ShortAlgo",1); //Algo Order was triggered, no more order on this bar
                
            }
            else if (AlgoShort != True )
            {   
                StaticVarSet(static_name_+"ShortAlgo",0);
                StaticVarSetText(static_name_+"ShortAlgo_barvalue","");
            }
            if (AlgoCover==true AND StaticVarGet(static_name_+"CoverAlgo")==0 AND StaticVarGetText(static_name_+"CoverAlgo_barvalue") != lasttime)
            {
            // Short Exit
                tradeboard.ExitOrder("BUY");
                if(VoiceAlert == "Enable"){
						Say("Short Exit Order Triggered");  	
					}
				_TRACE("API Request : "+ex_api_request);
				_TRACE("API Response : "+ex_api_response);
               
                StaticVarSetText(static_name_+"CoverAlgo_barvalue",lasttime); 
                StaticVarSet(static_name_+"CoverAlgo",1); //Algo Order was triggered, no more order on this bar
                
            }
            else if (AlgoCover != True)
            {   
                StaticVarSet(static_name_+"CoverAlgo",0);
                StaticVarSetText(static_name_+"CoverAlgo_barvalue","");
            }
        }
        
    }
    
```

