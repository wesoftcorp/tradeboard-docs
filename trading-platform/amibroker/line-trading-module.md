# Line Trading Module

The line Trading Automation tool is designed for Manual traders who want to perform level-based trade execution faster and also bring some advanced trade management in their trades (multiple entries, targets, stops, pyramiding, martingale, etc)

<br>

<figure><img src="/assets/image (42).png" alt=""><figcaption><p>Line Trade Automation v1.0</p></figcaption></figure>

### **What is Line Trading Automation 1.0?**

* Draw Horizontal Lines or Trend Lines in Amibroker When the levels are touched then the Line Trade Automation Module will convert into signals and orders will be transmitted to the broker automatically.

* Module **Supports Multiple Entry, Targets, Stoploss levels** can be drawn and converted into orders, Supports pyramiding.

* Module **prevents placing multiple orders** at the same signal

* Supports **Intraday and Positional Trades**

* Supports **3 Long Entry, 3 Long Exit(Target/Stoploss), 3 Short Entries**, and **3 Short Exit (Target/Stoploss)** Line based trading.

```clike
//Module - Line Pair Tading Automation Module 
//Rajeev Upadhyay - Creator of Tradeboard
//website - tradeboard.in / marketcalls.in
//Tradeboard - Amibroker SmartOrder Chart Trading Module v1.0
//Date - 29/05/2024

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
EnableAlgo = ParamList("Algo Mode","Disable|Enable",0); // Algo Mode

bridgeurl = host+"/api/"+ver;
resp = "";

//Static Variables for Order protection

static_name_ = Name()+GetChartID()+interval(2)+strategy;
static_name_algo = Name()+GetChartID()+interval(2)+strategy+"algostatus";
//Mapping of Orders

iBuy = "BUY";
iSell = "SELL";

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

_SECTION_END();

_SECTION_BEGIN("Line Pair Trading Module");

SetBarsRequired(-2,-2); //turning off quick afl
SetChartOptions(0,chartShowArrows|chartShowDates);
_N(Title = StrFormat("{{NAME}} - {{INTERVAL}} {{DATE}} Open %g, Hi %g, Lo %g, Close %g (%.1f%%) {{VALUES}}", O, H, L, C, SelectedValue( ROC( C, 1 ) ) ));
Plot( C, "Close", ParamColor("Color", colorDefault ), styleNoTitle | ParamStyle("Style") | GetPriceStyle() ); 
_SECTION_END();

//Static Variables will be saved in Amibroker every 60 seconds once
SetOption("StaticVarAutoSave",60);

// Send orders even if Amibroker is minimized or Chart is not active
RequestTimedRefresh(0.1, False); 
EnableTextOutput(False);

IntradayMode = ParamList("Intraday Mode","ON|OFF",0);
StartTradeTime = ParamTime("Start Time","09:30");
EndTradeTime = ParamTime("End Time","15:00");
ExitTradeTime = ParamTime("Squareoff Time","15:15");

BuyMode=ParamToggle("Buy Mode","BUY ABOVE|BUY BELOW",0);
SellMode=ParamToggle("Sell Mode","SELL ABOVE|SELL BELOW",0);
ShortMode=ParamToggle("Short Mode","SHORT ABOVE|SHORT BELOW",1);
CoverMode=ParamToggle("Cover Mode","COVER ABOVE|COVER BELOW",1);

ExitPos = ParamList("Exit Positions","CURRENT|ALLOPENPOSITIONS");

buyquantity1 = Param("Buy Quantity1",1,0,10000,1);
buyquantity2 = Param("Buy Quantity2",1,0,10000,1);
buyquantity3 = Param("Buy Quantity3",1,0,10000,1);
shortquantity1 = Param("Short Quantity1",1,0,10000,1);
shortquantity2 = Param("Short Quantity2",1,0,10000,1);
shortquantity3 = Param("Short Quantity3",1,0,10000,1);

clear = ParamTrigger("Reset Trades and Signals","Press to Reset");
staticvar = Name()+Interval()+GetChartID();
if(clear)
{

StaticVarRemove(staticvar+"*");
_TRACE("Static Variables Cleared");
}

Plot( C, "Price", colorBlack, styleCandle );

if(BuyMode==0) 	Buydisplaytext = "Buy Above";
if(BuyMode==1)  Buydisplaytext = "Buy Below";
if(SellMode==0) Selldisplaytext = "Sell Above";
if(SellMode==1) Selldisplaytext = "Sell Below";
	
if(ShortMode==0) Shortdisplaytext = "Short Above";
if(ShortMode==1) Shortdisplaytext = "Short Below";
if(CoverMode==0) Coverdisplaytext = "Cover Above";
if(CoverMode==1) Coverdisplaytext = "Cover Below";

B1 = LastValue(Study("B1", GetChartID() ));
B2 = LastValue(Study("B2", GetChartID() ));
B3 = LastValue(Study("B3", GetChartID() ));
X1 = LastValue(Study("X1", GetChartID() ));
X2 = LastValue(Study("X2", GetChartID() ));
X3 = LastValue(Study("X3", GetChartID() ));

S1 = LastValue(Study("S1", GetChartID() ));
S2 = LastValue(Study("S2", GetChartID() ));
S3 = LastValue(Study("S3", GetChartID() ));
C1 = LastValue(Study("C1", GetChartID() ));
C2 = LastValue(Study("C2", GetChartID() ));
C3 = LastValue(Study("C3", GetChartID() ));

function lineplot(value,text,quantity,displaytext)
{

	

textcolor = IIf(text=="B1" OR text=="B2" OR text=="B3", colorGreen, 
				IIf(text=="X1" OR text=="X2" OR text=="X3", colorRed, 
					IIf(text=="S1" OR text=="S2" OR text=="S3", colorBrown, 
						IIf(text=="C1" OR text=="C2" OR text=="C3", colorBlue,colorGrey40))));

x = LastValue( ValueWhen( ExRem( value, 0 ), DateTime() ) );
if( x!= 0 AND (text=="B1" OR text=="B2" OR text=="B3"))
  PlotText(text+"    "+Displaytext+" : "+value+"    Qty ="+quantity,BarCount-40,value,colorWhite,textcolor,10);

if( x!= 0  AND (text=="S1" OR text=="S2" OR text=="S3"))
  PlotText(text+"    "+Displaytext+" : "+value+"    Qty ="+quantity,BarCount-40,value,colorWhite,textcolor,10);

if( x!= 0 AND ExitPos=="CURRENT" AND (text=="X1" OR text=="X2" OR text=="X3"))
  PlotText(text+"    "+Displaytext+" : "+value+"    Qty ="+quantity,BarCount-40,value,colorWhite,textcolor,10);

if( x!= 0 AND ExitPos=="CURRENT" AND (text=="C1" OR text=="C2" OR text=="C3"))
  PlotText(text+"    "+Displaytext+" : "+value+"    Qty ="+quantity,BarCount-40,value,colorWhite,textcolor,10);

if( x!= 0 AND ExitPos=="ALLOPENPOSITIONS" AND (text=="X1" OR text=="X2" OR text=="X3"))
  PlotText(text+"    "+Displaytext+" : "+value+"    Qty = All",BarCount-40,value,colorWhite,textcolor,10);

if( x!= 0 AND ExitPos=="ALLOPENPOSITIONS" AND (text=="C1" OR text=="C2" OR text=="C3"))
  PlotText(text+"    "+Displaytext+" : "+value+"   Qty = All",BarCount-40,value,colorWhite,textcolor,10);

}

lineplot(B1,"B1",buyquantity1,Buydisplaytext);
lineplot(B2,"B2",buyquantity2,Buydisplaytext);
lineplot(B3,"B3",buyquantity3,Buydisplaytext);
lineplot(X1,"X1",buyquantity1,Selldisplaytext);
lineplot(X2,"X2",buyquantity2,Selldisplaytext);
lineplot(X3,"X3",buyquantity3,Selldisplaytext);
lineplot(S1,"S1",shortquantity1,Shortdisplaytext);
lineplot(S2,"S2",shortquantity2,Shortdisplaytext);
lineplot(S3,"S3",shortquantity3,Shortdisplaytext);
lineplot(C1,"C1",shortquantity1,Coverdisplaytext);
lineplot(C2,"C2",shortquantity2,Coverdisplaytext);
lineplot(C3,"C3",shortquantity3,Coverdisplaytext);

if(EnableAlgo != "Disable")
{
    lasttime = StrFormat("%0.f",LastValue(BarIndex()));
    SetChartBkColor(colorDarkGrey);
    
if(IntradayMode=="ON" AND LastValue(TimeNum())== ExitTradeTime AND Nz(StaticVarGet(staticvar+"SquareOff"))==0)
{

tradeboard.ExitOrder("SELL");

StaticVarSet(staticvar+"SquareOffIndex",LastValue(BarIndex()));
StaticVarSet(staticvar+"SquareOff",1);
_TRACE("Squareoff Alert Triggered");
}

if(BuyMode==0 AND LastValue(Cross(H,B1)) AND Nz(StaticVarGet(staticvar+"B1"))==0)
{

if((IntradayMode=="ON" AND LastValue(TimeNum())>= StartTradeTime AND LastValue(TimeNum()) <= EndTradeTime) OR IntradayMode=="OFF")
{

tradeboard.placeorder("BUY",buyquantity1);
StaticVarSet(staticvar+"B1index",LastValue(BarIndex()));
StaticVarSet(staticvar+"B1",1);
_TRACE("Buy Above B1 Triggered");
}
}

if(BuyMode==1 AND LastValue(Cross(B1,L)) AND Nz(StaticVarGet(staticvar+"B1"))==0)
{
if((IntradayMode=="ON" AND LastValue(TimeNum())>= StartTradeTime AND LastValue(TimeNum()) <= EndTradeTime) OR IntradayMode=="OFF")
{
tradeboard.placeorder("BUY",buyquantity1);
StaticVarSet(staticvar+"B1index",LastValue(BarIndex()));
StaticVarSet(staticvar+"B1",1);
_TRACE("Buy Below B1 Triggered");
}
}

if(BuyMode==0 AND LastValue(Cross(H,B2)) AND Nz(StaticVarGet(staticvar+"B2"))==0)
{
if((IntradayMode=="ON" AND LastValue(TimeNum())>= StartTradeTime AND LastValue(TimeNum()) <= EndTradeTime) OR IntradayMode=="OFF")
{
tradeboard.placeorder("BUY",buyquantity2);
StaticVarSet(staticvar+"B2index",LastValue(BarIndex()));
StaticVarSet(staticvar+"B2",1);
_TRACE("Buy Above B2 Triggered");
}
}

if(BuyMode==1 AND LastValue(Cross(B2,L)) AND Nz(StaticVarGet(staticvar+"B2"))==0)
{
if((IntradayMode=="ON" AND LastValue(TimeNum())>= StartTradeTime AND LastValue(TimeNum()) <= EndTradeTime) OR IntradayMode=="OFF")
{
tradeboard.placeorder("BUY",buyquantity2);
StaticVarSet(staticvar+"B2index",LastValue(BarIndex()));
StaticVarSet(staticvar+"B2",1);
_TRACE("Buy Below B2 Triggered");
}
}

if(BuyMode==0 AND LastValue(Cross(H,B3)) AND Nz(StaticVarGet(staticvar+"B3"))==0)
{
if((IntradayMode=="ON" AND LastValue(TimeNum())>= StartTradeTime AND LastValue(TimeNum()) <= EndTradeTime) OR IntradayMode=="OFF")
{
tradeboard.placeorder("BUY",buyquantity3);
StaticVarSet(staticvar+"B3index",LastValue(BarIndex()));
StaticVarSet(staticvar+"B3",1);
_TRACE("Buy Above B3 Triggered");
}
}

if(BuyMode==1 AND LastValue(Cross(B3,L)) AND Nz(StaticVarGet(staticvar+"B3"))==0)
{
if((IntradayMode=="ON" AND LastValue(TimeNum())>= StartTradeTime AND LastValue(TimeNum()) <= EndTradeTime) OR IntradayMode=="OFF")
{
tradeboard.placeorder("BUY",buyquantity3);
StaticVarSet(staticvar+"B3index",LastValue(BarIndex()));
StaticVarSet(staticvar+"B3",1);
_TRACE("Buy Below B3 Triggered");
}
}

if(SellMode==0 AND LastValue(Cross(H,X1)) AND Nz(StaticVarGet(staticvar+"X1"))==0)
{
if((IntradayMode=="ON" AND LastValue(TimeNum())>= StartTradeTime AND LastValue(TimeNum()) <= EndTradeTime) OR IntradayMode=="OFF")
{

if(ExitPos=="CURRENT")
{
//If positive open positions are there only then exit the Current Order Quantity 
tradeboard.placeorder("SELL",buyquantity1);
}
if(ExitPos=="ALLOPENPOSITIONS")
{
//If positive open positions are there only then exit the All Open Positions 
tradeboard.ExitOrder("SELL");
}

StaticVarSet(staticvar+"X1index",LastValue(BarIndex()));
StaticVarSet(staticvar+"X1",1);
_TRACE("Sell Above X1 Triggered");
}
}

if(SellMode==1 AND LastValue(Cross(X1,L)) AND Nz(StaticVarGet(staticvar+"X1"))==0)
{
if((IntradayMode=="ON" AND LastValue(TimeNum())>= StartTradeTime AND LastValue(TimeNum()) <= EndTradeTime) OR IntradayMode=="OFF")
{

if(ExitPos=="CURRENT")
{
//If positive open positions are there only then exit the Current Order Quantity 
tradeboard.placeorder("SELL",buyquantity1);
}
if(ExitPos=="ALLOPENPOSITIONS")
{
//If positive open positions are there only then exit the All Open Positions 
tradeboard.ExitOrder("SELL");
}

StaticVarSet(staticvar+"X1index",LastValue(BarIndex()));
StaticVarSet(staticvar+"X1",1);
_TRACE("Sell Below X1 Triggered");
}
}
if(SellMode==0 AND LastValue(Cross(H,X2)) AND Nz(StaticVarGet(staticvar+"X2"))==0)
{
if((IntradayMode=="ON" AND LastValue(TimeNum())>= StartTradeTime AND LastValue(TimeNum()) <= EndTradeTime) OR IntradayMode=="OFF")
{

if(ExitPos=="CURRENT")
{
//If positive open positions are there only then exit the Current Order Quantity 
tradeboard.placeorder("SELL",buyquantity2);
}
if(ExitPos=="ALLOPENPOSITIONS")
{
//If positive open positions are there only then exit the All Open Positions 
tradeboard.ExitOrder("SELL");
}

StaticVarSet(staticvar+"X2index",LastValue(BarIndex()));
StaticVarSet(staticvar+"X2",1);
_TRACE("Sell Above X2 Triggered");
}
}
if(SellMode==1 AND LastValue(Cross(X2,L)) AND Nz(StaticVarGet(staticvar+"X2"))==0)
{
if((IntradayMode=="ON" AND TimeNum()== ExitTradeTime) OR IntradayMode=="OFF")
{

if(ExitPos=="CURRENT")
{
//If positive open positions are there only then exit the Current Order Quantity 
tradeboard.placeorder("SELL",buyquantity2);
}
if(ExitPos=="ALLOPENPOSITIONS")
{
//If positive open positions are there only then exit the All Open Positions 
tradeboard.ExitOrder("SELL");
}

StaticVarSet(staticvar+"X2index",LastValue(BarIndex()));
StaticVarSet(staticvar+"X2",1);
_TRACE("Sell Below X2 Triggered");
}
}
if(SellMode==0 AND LastValue(Cross(H,X3)) AND Nz(StaticVarGet(staticvar+"X3"))==0)
{
if((IntradayMode=="ON" AND LastValue(TimeNum())>= StartTradeTime AND LastValue(TimeNum()) <= EndTradeTime) OR IntradayMode=="OFF")
{

if(ExitPos=="CURRENT")
{
//If positive open positions are there only then exit the Current Order Quantity 
tradeboard.placeorder("SELL",buyquantity3);
}
if(ExitPos=="ALLOPENPOSITIONS")
{
//If positive open positions are there only then exit the All Open Positions 
tradeboard.ExitOrder("SELL");
}

StaticVarSet(staticvar+"X3index",LastValue(BarIndex()));
StaticVarSet(staticvar+"X3",1);
_TRACE("Sell Above X3 Triggered");
}
}
if(SellMode==1 AND LastValue(Cross(X3,L)) AND Nz(StaticVarGet(staticvar+"X3"))==0)
{
if((IntradayMode=="ON" AND LastValue(TimeNum())>= StartTradeTime AND LastValue(TimeNum()) <= EndTradeTime) OR IntradayMode=="OFF")
{

if(ExitPos=="CURRENT")
{
//If positive open positions are there only then exit the Current Order Quantity 
tradeboard.placeorder("SELL",buyquantity3);
}
if(ExitPos=="ALLOPENPOSITIONS")
{
//If positive open positions are there only then exit the All Open Positions 
tradeboard.ExitOrder("SELL");
}

StaticVarSet(staticvar+"X3index",LastValue(BarIndex()));
StaticVarSet(staticvar+"X3",1);
_TRACE("Sell Below X3 Triggered");
}
}

if(ShortMode==0 AND LastValue(Cross(H,S1)) AND Nz(StaticVarGet(staticvar+"S1"))==0)
{
if((IntradayMode=="ON" AND LastValue(TimeNum())>= StartTradeTime AND LastValue(TimeNum()) <= EndTradeTime) OR IntradayMode=="OFF")
{
tradeboard.placeorder("SELL",shortquantity1);
StaticVarSet(staticvar+"S1index",LastValue(BarIndex()));
StaticVarSet(staticvar+"S1",1);
_TRACE("Short Above S1 Triggered");
}
}

if(ShortMode==1 AND LastValue(Cross(S1,L)) AND Nz(StaticVarGet(staticvar+"S1"))==0)
{
if((IntradayMode=="ON" AND LastValue(TimeNum())>= StartTradeTime AND LastValue(TimeNum()) <= EndTradeTime) OR IntradayMode=="OFF")
{
tradeboard.placeorder("SELL",shortquantity1);
StaticVarSet(staticvar+"S1index",LastValue(BarIndex()));
StaticVarSet(staticvar+"S1",1);
_TRACE("Short Below S1 Triggered");
}
}

if(ShortMode==0 AND LastValue(Cross(H,S2)) AND Nz(StaticVarGet(staticvar+"S2"))==0)
{
if((IntradayMode=="ON" AND LastValue(TimeNum())>= StartTradeTime AND LastValue(TimeNum()) <= EndTradeTime) OR IntradayMode=="OFF")
{
tradeboard.placeorder("SELL",shortquantity2);
StaticVarSet(staticvar+"S2index",LastValue(BarIndex()));
StaticVarSet(staticvar+"S2",1);
_TRACE("Short Above S2 Triggered");
}
}

if(ShortMode==1 AND LastValue(Cross(S2,L)) AND Nz(StaticVarGet(staticvar+"S2"))==0)
{
if((IntradayMode=="ON" AND LastValue(TimeNum())>= StartTradeTime AND LastValue(TimeNum()) <= EndTradeTime) OR IntradayMode=="OFF")
{
tradeboard.placeorder("SELL",shortquantity2);
StaticVarSet(staticvar+"S2index",LastValue(BarIndex()));
StaticVarSet(staticvar+"S2",1);
_TRACE("Short Below S2 Triggered");
}
}

if(ShortMode==0 AND LastValue(Cross(H,S3)) AND Nz(StaticVarGet(staticvar+"S3"))==0)
{
if((IntradayMode=="ON" AND LastValue(TimeNum())>= StartTradeTime AND LastValue(TimeNum()) <= EndTradeTime) OR IntradayMode=="OFF")
{
tradeboard.placeorder("SELL",shortquantity3);
StaticVarSet(staticvar+"S3index",LastValue(BarIndex()));
StaticVarSet(staticvar+"S3",1);
_TRACE("Short Above S3 Triggered");
}
}

if(ShortMode==1 AND LastValue(Cross(S3,L)) AND Nz(StaticVarGet(staticvar+"S3"))==0)
{
if((IntradayMode=="ON" AND LastValue(TimeNum())>= StartTradeTime AND LastValue(TimeNum()) <= EndTradeTime) OR IntradayMode=="OFF")
{
tradeboard.placeorder("SELL",shortquantity3);
StaticVarSet(staticvar+"S3index",LastValue(BarIndex()));
StaticVarSet(staticvar+"S3",1);
_TRACE("Short Below S3 Triggered");
}
}

if(CoverMode==0 AND LastValue(Cross(H,C1)) AND Nz(StaticVarGet(staticvar+"C1"))==0)
{
if((IntradayMode=="ON" AND LastValue(TimeNum())>= StartTradeTime AND LastValue(TimeNum()) <= EndTradeTime) OR IntradayMode=="OFF")
{

if(ExitPos=="CURRENT")
{
//If positive open positions are there only then exit the Current Order Quantity 
tradeboard.PlaceOrder("BUY",shortquantity1);
}
if(ExitPos=="ALLOPENPOSITIONS")
{
//If positive open positions are there only then exit the All Open Positions 
tradeboard.ExitOrder("BUY");
}

StaticVarSet(staticvar+"C1index",LastValue(BarIndex()));
StaticVarSet(staticvar+"C1",1);
_TRACE("Cover Above C1 Triggered");
}
}

if(CoverMode==1 AND LastValue(Cross(C1,L)) AND Nz(StaticVarGet(staticvar+"C1"))==0)
{
if((IntradayMode=="ON" AND LastValue(TimeNum())>= StartTradeTime AND LastValue(TimeNum()) <= EndTradeTime) OR IntradayMode=="OFF")
{

if(ExitPos=="CURRENT")
{
//If positive open positions are there only then exit the Current Order Quantity 
tradeboard.PlaceOrder("BUY",shortquantity1);
}
if(ExitPos=="ALLOPENPOSITIONS")
{
//If positive open positions are there only then exit the All Open Positions 
tradeboard.ExitOrder("BUY");
}

StaticVarSet(staticvar+"C1index",LastValue(BarIndex()));
StaticVarSet(staticvar+"C1",1);
_TRACE("Cover Below C1 Triggered");
}
}

if(CoverMode==0 AND LastValue(Cross(H,C2)) AND Nz(StaticVarGet(staticvar+"C2"))==0)
{
if((IntradayMode=="ON" AND LastValue(TimeNum())>= StartTradeTime AND LastValue(TimeNum()) <= EndTradeTime) OR IntradayMode=="OFF")
{

if(ExitPos=="CURRENT")
{
//If positive open positions are there only then exit the Current Order Quantity 
tradeboard.PlaceOrder("BUY",shortquantity2);
}
if(ExitPos=="ALLOPENPOSITIONS")
{
//If positive open positions are there only then exit the All Open Positions 
tradeboard.ExitOrder("BUY");
}

StaticVarSet(staticvar+"C2index",LastValue(BarIndex()));
StaticVarSet(staticvar+"C2",1);
_TRACE("Cover Above C2 Triggered");
}
}
if(CoverMode==1 AND LastValue(Cross(C2,L)) AND Nz(StaticVarGet(staticvar+"C2"))==0)
{
if((IntradayMode=="ON" AND LastValue(TimeNum())>= StartTradeTime AND LastValue(TimeNum()) <= EndTradeTime) OR IntradayMode=="OFF")
{

if(ExitPos=="CURRENT")
{
//If positive open positions are there only then exit the Current Order Quantity 
tradeboard.PlaceOrder("BUY",shortquantity2);
}
if(ExitPos=="ALLOPENPOSITIONS")
{
//If positive open positions are there only then exit the All Open Positions 
tradeboard.ExitOrder("BUY");
}

StaticVarSet(staticvar+"C2index",LastValue(BarIndex()));
StaticVarSet(staticvar+"C2",1);
_TRACE("Cover Below C2 Triggered");
}
}

if(CoverMode==0 AND LastValue(Cross(H,C3)) AND Nz(StaticVarGet(staticvar+"C3"))==0)
{
if((IntradayMode=="ON" AND LastValue(TimeNum())>= StartTradeTime AND LastValue(TimeNum()) <= EndTradeTime) OR IntradayMode=="OFF")
{

if(ExitPos=="CURRENT")
{
//If positive open positions are there only then exit the Current Order Quantity 
tradeboard.PlaceOrder("BUY",shortquantity3);
}
if(ExitPos=="ALLOPENPOSITIONS")
{
//If positive open positions are there only then exit the All Open Positions 
tradeboard.ExitOrder("BUY");
}

StaticVarSet(staticvar+"C3index",LastValue(BarIndex()));
StaticVarSet(staticvar+"C3",1);
_TRACE("Cover Above C3 Triggered");
}
}

if(CoverMode==1 AND LastValue(Cross(C3,L)) AND Nz(StaticVarGet(staticvar+"C3"))==0)
{
if((IntradayMode=="ON" AND LastValue(TimeNum())>= StartTradeTime AND LastValue(TimeNum()) <= EndTradeTime) OR IntradayMode=="OFF")
{

if(ExitPos=="CURRENT")
{
//If positive open positions are there only then exit the Current Order Quantity 
tradeboard.PlaceOrder("BUY",shortquantity3);
}
if(ExitPos=="ALLOPENPOSITIONS")
{
//If positive open positions are there only then exit the All Open Positions 
tradeboard.ExitOrder("BUY");
}

StaticVarSet(staticvar+"C3index",LastValue(BarIndex()));
StaticVarSet(staticvar+"C3",1);
_TRACE("Cover Below C3 Triggered");
}
}

//Plot Signals and Arrows
PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+"B1index"), shapeSquare, shapeNone),colorGreen, 0, L, Offset=-40);
PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+"B1index"), shapeSquare, shapeNone),colorLime, 0,L, Offset=-50);                      
PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+"B1index"), shapeUpArrow, shapeNone),colorWhite, 0,L, Offset=-45);

PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+"B2index"), shapeSquare, shapeNone),colorGreen, 0, L, Offset=-40);
PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+"B2index"), shapeSquare, shapeNone),colorLime, 0,L, Offset=-50);                      
PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+"B2index"), shapeUpArrow, shapeNone),colorWhite, 0,L, Offset=-45);

PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+"B3index"), shapeSquare, shapeNone),colorGreen, 0, L, Offset=-40);
PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+"B3index"), shapeSquare, shapeNone),colorLime, 0,L, Offset=-50);                      
PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+"B3index"), shapeUpArrow, shapeNone),colorWhite, 0,L, Offset=-45);

PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+"S1index"), shapeSquare, shapeNone),colorRed, 0, H, Offset=40);
PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+"S1index"), shapeSquare, shapeNone),colorOrange, 0,H, Offset=50);                      
PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+"S1index"), shapeDownArrow, shapeNone),colorWhite, 0,H, Offset=-45);

PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+"S2index"), shapeSquare, shapeNone),colorRed, 0, H, Offset=40);
PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+"S2index"), shapeSquare, shapeNone),colorOrange, 0,H, Offset=50);                      
PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+"S2index"), shapeDownArrow, shapeNone),colorWhite, 0,H, Offset=-45);

PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+"S3index"), shapeSquare, shapeNone),colorRed, 0, H, Offset=40);
PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+"S3index"), shapeSquare, shapeNone),colorOrange, 0,H, Offset=50);                      
PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+"S3index"), shapeDownArrow, shapeNone),colorWhite, 0,H, Offset=-45);

PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+"X1index"),  shapeStar,shapeNone), colorBrightGreen, 0, High, 12);
PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+"X2index"),  shapeStar,shapeNone), colorBrightGreen, 0, High, 12);
PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+"X3index"),  shapeStar,shapeNone), colorBrightGreen, 0, High, 12);

PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+"C1index"),  shapeStar,shapeNone), colorRed, 0, Low, -12);
PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+"C2index"),  shapeStar,shapeNone), colorRed, 0, Low, -12);
PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+"C3index"),  shapeStar,shapeNone), colorRed, 0, Low, -12);

if(IntradayMode=="ON")
{
PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+"SquareOffIndex"),  shapeStar,shapeNone), colorYellow, 0, Low, -12);
}

}

_SECTION_END();
```

### **Smart Order Exits**

* **Smart Orders** are enabled while exiting the position.

* If there are no open positions and if exit orders are triggered then those orders are **smartly ignored**.

* Provision to close only **Current Quantity** and **All  Open Positions** is provided so that traders can flexibly use their own exit methods

### **Requirements**

* Tradeboard Downloaded and Configured

* Tradeboard Supported Broker

* Amibroker 6.0 or Higher

* Realtime Datafeed Subscription

### **Type of Entry and Exits (Amibroker Terms)**

where the characters ‘B’. ‘X’, ‘S’, ‘C’ are used along with horizontal or trendline study names.

<figure><img src="/assets/image (43).png" alt=""><figcaption></figcaption></figure>

### Type of Trendline Signals

<br>

<figure><img src="/assets/image (44).png" alt=""><figcaption></figcaption></figure>

### Type of Entry and Exit Trendlines

<br>

<figure><img src="/assets/image (45).png" alt=""><figcaption></figcaption></figure>

### Drawing Trend Line and Assigning Study Name

<br>

<figure><img src="/assets/image (46).png" alt=""><figcaption><p>Drawing trendlines and Assigning study ID</p></figcaption></figure>

### Pyramiding and Pyramiding Settings with Targets

<br>

<figure><img src="/assets/image (47).png" alt=""><figcaption><p>Using Line Automation for Pyramiding</p></figcaption></figure>

### Creating Multiple Entries and Multiple Stops using Line Automation Module

<br>

<figure><img src="/assets/image (48).png" alt=""><figcaption><p>Using Line Automation with Multiple Long Entry and Long Exit Signals</p></figcaption></figure>
