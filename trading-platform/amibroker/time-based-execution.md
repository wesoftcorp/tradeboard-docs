# Time Based Execution

```

//Rajeev Upadhyay - Creator of Tradeboard
//website - tradeboard.in / marketcalls.in
//Tradeboard - Amibroker TimeBased Execution Module v1.0
//Date - 23/08/2024

_SECTION_BEGIN("Tradeboard Trading Controls");

RequestTimedRefresh(0.1,False);
EnableTextOutput(False);

apikey = ParamStr("Tradeboard API Key", "******");
strategy = ParamStr("Strategy", "Amibroker");
symbol = ParamStr("Symbol", "YESBANK");
exchange = ParamList("Exchange", "NSE|NFO|BSE|MCX|CDS");
pricetype = ParamStr("Price Type", "MARKET");
product = ParamList("Product", "MIS|NRML|CNC");
quantity = Param("Quantity", 1,1,1000,1);

entrytime = ParamTime("Entry Time","19:50:00");
exittime = ParamTime("Exit Time","19:51:00");

host = ParamStr("host","http://127.0.0.1:5000");
ver = ParamStr("API Version","v1");

VoiceAlert = ParamList("Voice Alert","Disable|Enable",1);

EnableAlgo = ParamList("AlgoStatus","Disable|Enable",0);

bridgeurl = host+"/api/"+ver;
resp = "";

static_name_ = Name()+GetChartID()+interval(2)+strategy;
static_name_algo = static_name_+interval(2)+strategy+"algostatus";

printf("\n-----------Current Time-----------");
printf("\nThe time is "+Now(4));

printf("\n\n\n-----------Internal Memory-----------");
printf("\nEntry Time :"+entrytime);
printf("\nEntry Time Enabled :"+StaticVarGet(static_name_+"EntryTime"));
printf("\nExit Time :"+exittime);
printf("\nExit Time Enabled :"+StaticVarGet(static_name_+"ExitTime"));

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

%>

tradeboard = GetScriptObject();

if(EnableAlgo != "Disable")
	{
	
		
		if( Now(4)>=entrytime AND Nz(StaticVarGet(static_name_+"EntryTime"))==0 ) 
			{
				tradeboard.placeorder("BUY",quantity);
				if(VoiceAlert == "Enable"){
						Say("Buy Order Triggered");  	
					}
				_TRACE("API Request : "+api_request);
				_TRACE("API Response : "+api_response);
				
				StaticVarSet(static_name_+"EntryTime",1); 
			}
		else if(Now(4)<entrytime)
			{
				StaticVarSet(static_name_+"EntryTime",0); 
			}
			
		if( Now(4)>=exittime AND Nz(StaticVarGet(static_name_+"ExitTime"))==0 ) 
			{
				tradeboard.placeorder("SELL",quantity);
				if(VoiceAlert == "Enable"){
						Say("Sell Order Triggered");  	
					}
				_TRACE("API Request : "+api_request);
				_TRACE("API Response : "+api_response);
				
				StaticVarSet(static_name_+"ExitTime",1); 
			}
		else if(Now(4)<exittime)
			{
				StaticVarSet(static_name_+"ExitTime",0); 
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
