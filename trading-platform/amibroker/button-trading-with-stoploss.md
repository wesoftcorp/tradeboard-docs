# Button Trading with Stoploss

```clike
//Rajeev Upadhyay - Creator of Tradeboard
//website - tradeboard.in / marketcalls.in
//Tradeboard - Amibroker Button Trading Module v1.0 with Stoploss
//Date - 13/08/2024

_SECTION_BEGIN("Tradeboard Button Trading");

RequestTimedRefresh(1,False);
SetOption("StaticVarAutoSave", 30 );
EnableTextOutput(False);

apikey = ParamStr("Tradeboard API Key", "******");
strategy = ParamStr("Strategy", "Amibroker");
symbol = ParamStr("Symbol", "RELIANCE");
exchange = ParamList("Exchange", "NSE|NFO|BSE|MCX|CDS");
pricetype = ParamStr("Price Type", "MARKET");
product = ParamList("Product", "MIS|NRML|CNC");
quantity = Param("Quantity", 1,1,1000,1);
stops = Param("Stoploss (points)",30,0.05,1000,0.05);

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

Public Sub PlaceSLOrder(action, quantity,stopprice)
    Dim oXMLHTTP
    Dim oStream
    Set oXMLHTTP = CreateObject("Msxml2.XMLHTTP")
    ' Define variables with the specified values
    Dim apikey, strategy, symbol , exchange, pricetype, product, price, disclosed_quantity
    apikey = AFL.Var("apikey")
    strategy = AFL.Var("strategy")
    symbol = AFL.Var("symbol")
    exchange = AFL.Var("exchange")
    pricetype = "SL-M"
    product = AFL.Var("product")
    price = "0"
    disclosed_quantity = "0"
    
   
    
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
    """,""price"":""" & price & _
    """,""trigger_price"":""" & stopprice & _
    """,""disclosed_quantity"":""" & disclosed_quantity & """}"
    
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

    
    AFL("sl_api_request") = api_parameters  
    AFL("sl_api_response") = oXMLHTTP.responseText
    
    
    ' Optionally, handle the response here
    ' Dim response
    ' response = oXMLHTTP.responseText
    ' Response handling code...
End Sub

Public Sub CancelOrder(orderid)
    Dim oXMLHTTP
    Dim oStream
    Set oXMLHTTP = CreateObject("Msxml2.XMLHTTP")
    ' Define variables with the specified values
    Dim apikey, strategy, symbol , exchange, pricetype, product
    apikey = AFL.Var("apikey")
    strategy = AFL.Var("strategy")
  
   
    
    ' Construct the JSON string for the POST message
    Dim jsonRequestBody
    jsonRequestBody = "{""apikey"":""" & apikey & _
    """,""strategy"":""" & strategy & _
    """,""orderid"":""" & orderid & """}"
    
    ' Set the URL
    Dim url
    url = AFL.Var("bridgeurl")&"/cancelorder"
    
    ' Configure the HTTP request for POST method
    oXMLHTTP.Open "POST", url, False
    oXMLHTTP.setRequestHeader "Content-Type", "application/json"
    oXMLHTTP.setRequestHeader "Cache-Control", "no-cache"
    oXMLHTTP.setRequestHeader "Pragma", "no-cache"
    
    ' Send the request with the JSON body
    oXMLHTTP.Send jsonRequestBody
    
    api_parameters = "Strategy :" & strategy & " orderid :" & orderid 

    
    AFL("cancel_api_request") = api_parameters  
    AFL("cancel_api_response") = oXMLHTTP.responseText
    
    
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

_SECTION_BEGIN("Stoploss OrderID Display");

StaticVarBuySLOrderID = StaticVarGetText(static_name_ + "BuySLOrderID");
StaticVarSellSLOrderID = StaticVarGetText(static_name_ + "ShortSLOrderID");

printf("\n The Buy Stoploss Order ID is : " + StaticVarBuySLOrderID);
printf("\n The Sell Stoploss Order ID is : " + StaticVarSellSLOrderID);

_SECTION_END();

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
		_TRACE("API Request : "+api_request);
		_TRACE("API Response : "+api_response);
		slprice = LastValue(Close + stops);
		tradeboard.placeSLorder("SELL",quantity,slprice);
		
		orderid = StrExtract(sl_api_response,1,'{');
		orderid = StrExtract(orderid,1,':');
		orderid = StrExtract(orderid,0,',');
		orderid = StrExtract(orderid,1,'"');
		
		_TRACE("API Request : "+sl_api_request);
		_TRACE("API Response : "+sl_api_response);
		_TRACE("The OrderID : "+orderid);
		
		StaticVarSetText(static_name_+"BuySLOrderID",orderid,True);
		
				
        if(VoiceAlert == "Enable"){
				Say("Buy Order Triggered");  	
			}
		
		
		StaticVarSet(static_name_+"BEAlgo",1); 
	}
	else
	{
		StaticVarSet(static_name_+"BEAlgo",0);
	}
	if( BXButtonClick AND StaticVarGet(static_name_+"BXAlgo")==0 ) 
	{
	
		StaticVarBuySLOrderID = StaticVarGetText(static_name_ + "BuySLOrderID");
		tradeboard.cancelorder(StaticVarBuySLOrderID);
		_TRACE("Cancel API Request : "+cancel_api_request);
		_TRACE("Cancel API Response : "+cancel_api_response);
		StaticVarSetText(static_name_+"BuySLOrderID","",True);
		
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
		_TRACE("API Request : "+api_request);
		_TRACE("API Response : "+api_response);
		slprice = LastValue(Close - stops);
		tradeboard.placeSLorder("BUY",quantity,slprice);
		
		orderid = StrExtract(sl_api_response,1,'{');
		orderid = StrExtract(orderid,1,':');
		orderid = StrExtract(orderid,0,',');
		orderid = StrExtract(orderid,1,'"');
		
		_TRACE("API Request : "+sl_api_request);
		_TRACE("API Response : "+sl_api_response);
		_TRACE("The OrderID : "+orderid);
		
		StaticVarSetText(static_name_+"ShortSLOrderID",orderid,True);
		
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
		StaticVarSellSLOrderID = StaticVarGetText(static_name_ + "ShortSLOrderID");
		tradeboard.cancelorder(StaticVarSellSLOrderID);
		_TRACE("Cancel API Request : "+cancel_api_request);
		_TRACE("Cancel API Response : "+cancel_api_response);
		StaticVarSetText(static_name_+"ShortSLOrderID","",True);

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
