# Equity Exploration Module

## Internet Functions Module (Modern Method)

```clike
//Tradeboard - Intraday Cash Exploration Module
//Avoid using the code for running positional strategies
//If in case one have run for cash to cash intraday then ensure that symbol
//string manipulation is done according to the data vendor symbol format to match the
//brokers equity market symbols.

//Modernized code using AmiBroker's Internet functions

//////////////////////////////////////////////
//Amibroker Equity Exploration Module
//Coded by Rajeev Upadhyay - Creator, Tradeboard
//Date : 17/12/2024
//////////////////////////////////////////////

_SECTION_BEGIN("Exploration Module Order Controls");

strategy = ParamStr("Strategy Name", "Exploration Strategy");
apikey = ParamStr("Tradeboard API Key", "******");
exchange = ParamList("Exchange","NSE|BSE",0);
pricetype = ParamStr("Price Type", "MARKET");
product = ParamList("Product", "MIS|CNC",0);
host = ParamStr("host","http://127.0.0.1:5000");
ver = ParamStr("API Version","v1");

bridgeurl = host+"/api/"+ver;

// Mapping of Equity Symbol
symbol = Name(); // Adjust symbol mapping as per data vendor if needed
// Example:
// symbol = StrReplace(Name(),".NSE","")+"-EQ";    // For Globaldatafeeds

Position = Param("Position Size (Rupee Terms)",1000,1,10000000,1);

EntryDelay = Param("Entry Delay",0,0,1,1);
ExitDelay = Param("Exit Delay",0,0,1,1);
EnableAlgo = ParamList("Tradeboard","Disable|Enable|LongOnly|ShortOnly");

//Configure Trade Execution Delay (for recent signals)
AlgoBuy = LastValue(Ref(Buy,-EntryDelay));
AlgoSell = LastValue(Ref(Sell,-ExitDelay));
AlgoShort = LastValue(Ref(Short,-EntryDelay));
AlgoCover = LastValue(Ref(Cover,-ExitDelay));

//multiple order supression purpose we need static variables
static_name_ = Name()+GetChartID()+interval(2)+strategy;
static_name_algo = Name()+GetChartID()+interval(2)+strategy+"algostatus";

//Algo Dashboard
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
if(EnableAlgo == "LongOnly")
{
    AlgoStatus = "Long Only";
    GfxSetTextColor( colorYellow ); 
    GfxTextOut( "Algostatus : "+AlgoStatus , 20, 40); 
    if(Nz(StaticVarGet(static_name_algo),0)!=2)
    {
        _TRACE("Algo Status : Long Only");
        StaticVarSet(static_name_algo, 2);
    }
}
if(EnableAlgo == "ShortOnly")
{
    AlgoStatus = "Short Only";
    GfxSetTextColor( colorOrange ); 
    GfxTextOut( "Algostatus : "+AlgoStatus , 20, 40); 
    if(Nz(StaticVarGet(static_name_algo),0)!=3)
    {
        _TRACE("Algo Status : Short Only");
        StaticVarSet(static_name_algo, 3);
    }
}

// Function to Place Order using Internet Functions
function PlaceOrder(action, quantity)
{
    // Construct JSON body
    postData = "{"+
       "\"apikey\":\"" + apikey + "\"," +
       "\"strategy\":\"" + strategy + "\"," +
       "\"symbol\":\"" + symbol + "\"," +
       "\"action\":\"" + action + "\"," +
       "\"exchange\":\"" + exchange + "\"," +
       "\"pricetype\":\"" + pricetype + "\"," +
       "\"product\":\"" + product + "\"," +
       "\"quantity\":\"" + quantity + "\"}";

    headers = "Content-Type: application/json\r\n" +
              "Cache-Control: no-cache\r\n" +
              "Pragma: no-cache\r\n";

    InternetSetHeaders(headers);
    _TRACE("API Request (POST /placeorder): " + postData);

    ih = InternetPostRequest(bridgeurl + "/placeorder", postData);
    if(ih)
    {
        response = "";
        line = "";
        while((line = InternetReadString(ih)) != "")
        {
            response += line;
        }
        InternetClose(ih);

        _TRACE("API Response: " + response);
    }
    else
    {
        _TRACE("Failed to execute InternetPostRequest");
    }
}

if(Status("action") == actionExplore)
{
    entryquantity = int(Position/Close);
    exitbuyquantity = ValueWhen(Buy ,int(Position/Close));
    exitshortquantity = ValueWhen(Short ,int(Position/Close));

    bsr = Buy AND Cover;
    ssr = Short AND Sell;

    iSignal  = IIf(bsr,'L',IIf(ssr,'R',IIf(Buy,'B',IIf(Sell,'S',IIf(Short,'S','B')))));
    Filter = Buy OR Sell OR Short OR Cover;
    AddTextColumn(symbol,"Trading Symbol");
    AddColumn(IIf(Buy,'B','-'), "Long Entry",format=formatChar);
    AddColumn(IIf(Sell,'X','-'), "Long Exit",format=formatChar);
    AddColumn(IIf(Short,'S','-'), "Short Entry",format=formatChar);
    AddColumn(IIf(Cover,'C','-'), "Short  Exit",format=formatChar);
    AddColumn(IIf(bsr, entryquantity+exitshortquantity,IIf(ssr,entryquantity+exitbuyquantity,IIf(Buy OR Short,entryquantity,IIf(Sell,exitbuyquantity,IIf(Cover,exitshortquantity,Null))))),"Trading Quantity",1);
    AddColumn(iSignal, "Signal Value",format=formatChar);
    AddColumn(C,"LTP",1.2);
    SetSortColumns(2);

    // Execution Module
    if(EnableAlgo != "Disable")
    {
        lasttime = StrFormat("%0.f",LastValue(BarIndex()));
        SetChartBkColor(colorDarkGrey);

        if(EnableAlgo == "Enable")
        {   
            // Reverse Long Entry - Buy & Cover together
            if (AlgoBuy==True AND AlgoCover == True AND StaticVarGet(static_name_+"buyCoverAlgo")==0 AND StaticVarGetText(static_name_+"buyCoverAlgo_barvalue") != lasttime )
            {
                quantity = lastvalue(entryquantity+exitshortquantity);
                PlaceOrder("BUY", quantity);
                StaticVarSetText(static_name_+"buyCoverAlgo_barvalue",lasttime);  
                StaticVarSet(static_name_+"buyCoverAlgo",1);
            }
            else if ((AlgoBuy != True OR AlgoCover != True))
            {   
                StaticVarSet(static_name_+"buyCoverAlgo",0);
                StaticVarSetText(static_name_+"buyCoverAlgo_barvalue","");
            }

            // Long Entry Only
            if (AlgoBuy==True AND AlgoCover != True AND StaticVarGet(static_name_+"buyAlgo")==0 AND StaticVarGetText(static_name_+"buyAlgo_barvalue") != lasttime)
            {
                quantity = LastValue(entryquantity);
                PlaceOrder("BUY",quantity);
                StaticVarSetText(static_name_+"buyAlgo_barvalue",lasttime); 
                StaticVarSet(static_name_+"buyAlgo",1);
            }
            else if (AlgoBuy != True)
            {   
                StaticVarSet(static_name_+"buyAlgo",0);
                StaticVarSetText(static_name_+"buyAlgo_barvalue","");
            }

            // Long Exit Only
            if (AlgoSell==true AND AlgoShort != True AND StaticVarGet(static_name_+"sellAlgo")==0 AND StaticVarGetText(static_name_+"sellAlgo_barvalue") != lasttime)
            {     
                quantity = LastValue(exitbuyquantity);
                PlaceOrder("SELL",quantity);
                StaticVarSetText(static_name_+"sellAlgo_barvalue",lasttime);
                StaticVarSet(static_name_+"sellAlgo",1);
            }
            else if (AlgoSell != True )
            {   
                StaticVarSet(static_name_+"sellAlgo",0);
                StaticVarSetText(static_name_+"sellAlgo_barvalue","");
            }

            // Reverse Short Entry - Short & Sell together
            if (AlgoShort==True AND AlgoSell==True AND  StaticVarGet(static_name_+"ShortSellAlgo")==0 AND StaticVarGetText(static_name_+"ShortSellAlgo_barvalue") != lasttime)
            {
                quantity = LastValue(exitbuyquantity+entryquantity);
                PlaceOrder("SELL",quantity);
                StaticVarSetText(static_name_+"ShortsellAlgo_barvalue",lasttime);
                StaticVarSet(static_name_+"ShortSellAlgo",1);
            }
            else if ((AlgoShort != True OR AlgoSell != True))
            {   
                StaticVarSet(static_name_+"ShortSellAlgo",0);
                StaticVarSetText(static_name_+"ShortsellAlgo_barvalue","");
            }

            // Short Entry Only
            if (AlgoShort==True  AND  AlgoSell != True AND StaticVarGet(static_name_+"ShortAlgo")==0 AND  StaticVarGetText(static_name_+"ShortAlgo_barvalue") != lasttime)
            {
                quantity = LastValue(entryquantity);
                PlaceOrder("SELL",quantity);
                StaticVarSetText(static_name_+"ShortAlgo_barvalue",lasttime); 
                StaticVarSet(static_name_+"ShortAlgo",1);
            }
            else if (AlgoShort != True )
            {   
                StaticVarSet(static_name_+"ShortAlgo",0);
                StaticVarSetText(static_name_+"ShortAlgo_barvalue","");
            }

            // Short Exit Only
            if (AlgoCover==true AND AlgoBuy != True AND StaticVarGet(static_name_+"CoverAlgo")==0 AND StaticVarGetText(static_name_+"CoverAlgo_barvalue") != lasttime)
            {
                quantity = LastValue(exitshortquantity);
                PlaceOrder("BUY",quantity);
                StaticVarSetText(static_name_+"CoverAlgo_barvalue",lasttime); 
                StaticVarSet(static_name_+"CoverAlgo",1);
            }
            else if (AlgoCover != True )
            {   
                StaticVarSet(static_name_+"CoverAlgo",0);
                StaticVarSetText(static_name_+"CoverAlgo_barvalue","");
            }
        }

        else if(EnableAlgo == "LongOnly")
        {
            // Long Only Entry
            if (AlgoBuy==True AND StaticVarGet(static_name_+"buyAlgo")==0 AND StaticVarGetText(static_name_+"buyAlgo_barvalue") != lasttime)
            {
                quantity = LastValue(entryquantity);
                PlaceOrder("BUY",quantity);
                StaticVarSetText(static_name_+"buyAlgo_barvalue",lasttime);
                StaticVarSet(static_name_+"buyAlgo",1);
            }
            else if (AlgoBuy != True)
            {   
                StaticVarSet(static_name_+"buyAlgo",0);
                StaticVarSetText(static_name_+"buyAlgo_barvalue","");
            }

            // Long Only Exit
            if (AlgoSell==true AND StaticVarGet(static_name_+"sellAlgo")==0 AND StaticVarGetText(static_name_+"sellAlgo_barvalue") != lasttime)
            {
                quantity = LastValue(exitbuyquantity);
                PlaceOrder("SELL",quantity);
                StaticVarSetText(static_name_+"sellAlgo_barvalue",lasttime);
                StaticVarSet(static_name_+"sellAlgo",1);
            }
            else if (AlgoSell != True )
            {   
                StaticVarSet(static_name_+"sellAlgo",0);
                StaticVarSetText(static_name_+"sellAlgo_barvalue","");
            }
        }
        else if(EnableAlgo == "ShortOnly")
        {
            // Short Only Entry
            if (AlgoShort==True AND StaticVarGet(static_name_+"ShortAlgo")==0 AND StaticVarGetText(static_name_+"ShortAlgo_barvalue") != lasttime)
            {
                quantity = LastValue(entryquantity);
                PlaceOrder("SELL",quantity);
                StaticVarSetText(static_name_+"ShortAlgo_barvalue",lasttime); 
                StaticVarSet(static_name_+"ShortAlgo",1);
            }
            else if (AlgoShort != True )
            {   
                StaticVarSet(static_name_+"ShortAlgo",0);
                StaticVarSetText(static_name_+"ShortAlgo_barvalue","");
            }

            // Short Only Exit
            if (AlgoCover==true AND StaticVarGet(static_name_+"CoverAlgo")==0 AND StaticVarGetText(static_name_+"CoverAlgo_barvalue") != lasttime)
            {
                quantity = LastValue(exitshortquantity);
                PlaceOrder("BUY",quantity);
                StaticVarSetText(static_name_+"CoverAlgo_barvalue",lasttime); 
                StaticVarSet(static_name_+"CoverAlgo",1);
                _TRACE("Strategy : "+ strategy +" AlgoStatus : "+ EnableAlgo +" Chart Symbol : "+ Name() +"  Trading Symbol : "+  symbol +"  Quantity : "+ quantity +"  Signal : Cover Signal  TimeFrame : "+ Interval(2)+"  ChardId : "+ GetChartID() + " Latest Price : "+LastValue(C));
            }
            else if (AlgoCover != True)
            {   
                StaticVarSet(static_name_+"CoverAlgo",0);
                StaticVarSetText(static_name_+"CoverAlgo_barvalue","");
            }
        }
    }
}

_SECTION_END();

```

## VB Script Module (Legacy Method)

```clike

//Tradeboard - Intraday Cash Exploration Module
//Avoid using the code for running positional strategies
//If in case one have run for cash to cash intraday then ensure that symbol
//string manipulation is done according to the data vendor symbol format to match the
//brokers equity market symbols.

//////////////////////////////////////////////
//Amibroker Equity Exploration Module
//Coded by Rajeev Upadhyay - Creator, Tradeboard
//Date : 10/04/2024
//////////////////////////////////////////////

_SECTION_BEGIN("Exploration Module Order Controls");

strategy = ParamStr("Strategy Name", "Exploration Strategy");
apikey = ParamStr("Tradeboard API Key", "******");
exchange = ParamList("Exchange","NSE|BSE",0);
pricetype = ParamStr("Price Type", "MARKET");
product = ParamList("Product", "MIS|CNC",0);
host = ParamStr("host","http://127.0.0.1:5000");
ver = ParamStr("API Version","v1");

bridgeurl = host+"/api/"+ver;

//////////////////////////////////////////////////////////////////////////////////////////

//Mapping of Equity Symbol needs to be done which matches with the Tradeboard Trading Symbol

symbol = Name(); //AccelPix Symbol Mapping

//symbol = StrReplace(Name(),".NSE","")+"-EQ";    //Globaldatafeed Symbol mapping

//////////////////////////////////////////////////////////////////////////////////////////

Position = Param("Position Size (Rupee Terms)",1000,1,10000000,1);

EntryDelay = Param("Entry Delay",0,0,1,1);
ExitDelay = Param("Exit Delay",0,0,1,1);
EnableAlgo = ParamList("Tradeboard","Disable|Enable|LongOnly|ShortOnly");

//Configure Trade Execution Delay (for recently signals)

AlgoBuy = LastValue(Ref(Buy,-EntryDelay));
AlgoSell = LastValue(Ref(Sell,-ExitDelay));
AlgoShort = LastValue(Ref(Short,-EntryDelay));
AlgoCover = LastValue(Ref(Cover,-ExitDelay));

//multiple order supression purpose we need static variables
static_name_ = Name()+GetChartID()+interval(2)+strategy;
static_name_algo = Name()+GetChartID()+interval(2)+strategy+"algostatus";

//Algo Dashboard

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
if(EnableAlgo == "LongOnly")
{
AlgoStatus = "Long Only";
GfxSetTextColor( colorYellow ); 
GfxTextOut( "Algostatus : "+AlgoStatus , 20, 40); 
if(Nz(StaticVarGet(static_name_algo),0)!=2)
{
_TRACE("Algo Status : Long Only");
StaticVarSet(static_name_algo, 2);
}
}
if(EnableAlgo == "ShortOnly")
{
AlgoStatus = "Short Only";
GfxSetTextColor( colorOrange ); 
GfxTextOut( "Algostatus : "+AlgoStatus , 20, 40); 
if(Nz(StaticVarGet(static_name_algo),0)!=3)
{
_TRACE("Algo Status : Short Only");
StaticVarSet(static_name_algo, 3);
}
}

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

//Execution Module

if(Status("action") == actionExplore)
//if(Status("action") == actionIndicator)
{

entryquantity = int(position/close);
exitbuyquantity = ValueWhen(Buy ,int(position/close));
exitshortquantity = ValueWhen(short ,int(position/close));

bsr = Buy AND Cover;
ssr = Short AND Sell;

iSignal  = IIf(bsr,'L',IIf(ssr,'R',IIf(Buy,'B',IIf(Sell,'S',IIf(Short,'S','B')))));
Filter = Buy OR Sell OR Short OR Cover;
AddTextColumn(symbol,"Trading Symbol");
AddColumn(IIf(Buy,'B','-'), "Long Entry",format=formatChar);
AddColumn(IIf(Sell,'X','-'), "Long Exit",format=formatChar);
AddColumn(IIf(Short,'S','-'), "Short Entry",format=formatChar);
AddColumn(IIf(Cover,'C','-'), "Short  Exit",format=formatChar);
AddColumn(IIf(bsr, entryquantity+exitshortquantity,IIf(ssr,entryquantity+exitbuyquantity,IIf(Buy OR Short,entryquantity,IIf(Sell,exitbuyquantity,IIf(Cover,exitshortquantity,Null))))),"Trading Quantity",1);
AddColumn(iSignal, "Signal Value",format=formatChar);
AddColumn(C,"LTP",1.2);
SetSortColumns(2);

 

//Execution Module

if(EnableAlgo != "Disable")
    {
        lasttime = StrFormat("%0.f",LastValue(BarIndex()));
        
        SetChartBkColor(colorDarkGrey);
        if(EnableAlgo == "Enable")
        {   
            if (AlgoBuy==True AND AlgoCover == True AND StaticVarGet(static_name_+"buyCoverAlgo")==0 AND StaticVarGetText(static_name_+"buyCoverAlgo_barvalue") != lasttime )
            {
            // reverse Long Entry 
				quantity = lastvalue(entryquantity+exitshortquantity);
                tradeboard.PlaceOrder("BUY",quantity);
                
				_TRACE("API Request : "+api_request);
				_TRACE("API Response : "+api_response);
				
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
				quantity = LastValue(entryquantity);
                
                tradeboard.PlaceOrder("BUY",quantity);
                
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
				quantity = LastValue(exitbuyquantity);
				
                tradeboard.PlaceOrder("SELL",quantity);
                
				_TRACE("API Request : "+api_request);
				_TRACE("API Response : "+api_response);
				
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
				quantity = LastValue(exitbuyquantity+entryquantity);
                
                tradeboard.PlaceOrder("SELL",quantity);
                
				_TRACE("API Request : "+api_request);
				_TRACE("API Response : "+api_response);
                
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
				quantity = LastValue(entryquantity);
                
                tradeboard.PlaceOrder("SELL",quantity);
                
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
				quantity = LastValue(exitshortquantity);
                
                tradeboard.PlaceOrder("BUY",quantity);
                
				_TRACE("API Request : "+api_request);
				_TRACE("API Response : "+api_response);
                
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
				quantity = LastValue(entryquantity);
                
                tradeboard.PlaceOrder("BUY",quantity);
                
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
				quantity = LastValue(exitbuyquantity);
                
                tradeboard.PlaceOrder("SELL",quantity);
                
				_TRACE("API Request : "+api_request);
				_TRACE("API Response : "+api_response);
                
                
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
				quantity = LastValue(entryquantity);
                
                tradeboard.PlaceOrder("SELL",quantity);
                
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
            if (AlgoCover==true AND StaticVarGet(static_name_+"CoverAlgo")==0 AND StaticVarGetText(static_name_+"CoverAlgo_barvalue") != lasttime)
            {
            // Short Exit
				quantity = LastValue(exitshortquantity);
                
                tradeboard.PlaceOrder("BUY",quantity);
                
				_TRACE("API Request : "+api_request);
				_TRACE("API Response : "+api_response);
                
                
                StaticVarSetText(static_name_+"CoverAlgo_barvalue",lasttime); 
                StaticVarSet(static_name_+"CoverAlgo",1); //Algo Order was triggered, no more order on this bar
                _TRACE("Strategy : "+ strategy +"AlgoStatus : "+ EnableAlgo +"Chart Symbol : "+ Name() +"  Trading Symbol : "+  symbol +"  Quantity : "+ quantity +"  Signal : Cover Signal  TimeFrame : "+ Interval(2)+"  Response : "+ resp +"  ChardId : "+ GetChartID() + " Latest Price : "+LastValue(C));
            }
            else if (AlgoCover != True)
            {   
                StaticVarSet(static_name_+"CoverAlgo",0);
                StaticVarSetText(static_name_+"CoverAlgo_barvalue","");
            }
        }
        
    
    }//end main if

} 
  
_SECTION_END();

```
