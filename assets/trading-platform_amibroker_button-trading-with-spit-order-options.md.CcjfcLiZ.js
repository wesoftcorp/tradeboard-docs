import{_ as a,o as n,c as t,a2 as p}from"./chunks/framework.BXzK3EA4.js";const e="/assets/Split%20Order%20-%20Options.CPjiT2ql.png",y=JSON.parse('{"title":"Button Trading with Spit Order (Options)","description":"","frontmatter":{},"headers":[],"relativePath":"trading-platform/amibroker/button-trading-with-spit-order-options.md","filePath":"trading-platform/amibroker/button-trading-with-spit-order-options.md"}'),o={name:"trading-platform/amibroker/button-trading-with-spit-order-options.md"};function l(i,s,u,r,c,q){return n(),t("div",null,[...s[0]||(s[0]=[p('<h1 id="button-trading-with-spit-order-options" tabindex="-1">Button Trading with Spit Order (Options) <a class="header-anchor" href="#button-trading-with-spit-order-options" aria-label="Permalink to &quot;Button Trading with Spit Order (Options)&quot;">​</a></h1><p>This Tradeboard SplitOrder Trading Module for AmiBroker is designed to seamlessly integrate manual button-based trading into an algorithmic workflow. It allows traders to place orders on options (ATM, ITM, OTM for both Calls and Puts) directly from the AmiBroker chart interface by clicking visual buttons. Each button sends orders through the Tradeboard Bridge using the <code>/splitorder</code> endpoint, which intelligently splits large orders into smaller chunks as per the configured split size. The system dynamically calculates the ATM, ITM, and OTM strikes based on live market data, user-defined offsets, and strike intervals, ensuring that the correct option symbols are generated for execution. A graphical dashboard embedded in the chart shows the current calculated strikes, internal memory for each option leg, cumulative quantities traded, and the current algo enable/disable status, providing traders with full visibility and control.</p><figure><img src="'+e+`" alt=""><figcaption></figcaption></figure><p>Additionally, the module tracks how many shares or lots have been cumulatively ordered through each button. This allows precise exits later by automatically sending exactly the accumulated quantity in the opposite direction, ensuring positions are squared off cleanly. It includes a “Close All” button that closes all open positions for all option legs using the exact quantities stored in memory, and also provides a “Clear Memory” button to reset internal counters without sending any orders. The system can be configured for both option buyers (to initiate long call or put positions) and option sellers (to short calls or puts and later cover), making it highly versatile for different option trading strategies. This entire workflow is designed for intraday or short-term traders who want to streamline order placement, reduce manual errors, and maintain a tight control over their option trades directly from their AmiBroker environment.</p><div class="language-clike vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">clike</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//Rajeev Upadhyay - Creator of Tradeboard</span></span>
<span class="line"><span>//Tradeboard - Amibroker SplitOrder Module with cumulative qty &amp; explicit current strikes</span></span>
<span class="line"><span>//Date: 07/07/2025</span></span>
<span class="line"><span></span></span>
<span class="line"><span>_SECTION_BEGIN(&quot;Tradeboard Options SplitOrder Trading&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>RequestTimedRefresh(1,False);</span></span>
<span class="line"><span>EnableTextOutput(False);</span></span>
<span class="line"><span>SetOption(&quot;StaticVarAutoSave&quot;, 30 );</span></span>
<span class="line"><span></span></span>
<span class="line"><span>apikey     = ParamStr(&quot;Tradeboard API Key&quot;, &quot;******&quot;);</span></span>
<span class="line"><span>strategy   = ParamStr(&quot;Strategy Name&quot;, &quot;Test Strategy&quot;);</span></span>
<span class="line"><span>spot       = Paramlist(&quot;Spot Symbol&quot;,&quot;NIFTY|BANKNIFTY|FINNIFTY|SENSEX|CRUDEOILM&quot;);</span></span>
<span class="line"><span>expiry     = ParamStr(&quot;Expiry Date&quot;,&quot;17JUL25&quot;);</span></span>
<span class="line"><span>exchange   = ParamList(&quot;Exchange&quot;,&quot;NFO|BFO|MCX&quot;,0);</span></span>
<span class="line"><span>Symbol     = ParamStr(&quot;Underlying Symbol(Data Vendor Symbol)&quot;,&quot;NIFTY&quot;);</span></span>
<span class="line"><span>iInterval  = Param(&quot;Strike Interval&quot;,50,1,10000,1);</span></span>
<span class="line"><span>StrikeCalculation = Paramlist(&quot;Strike Calculation&quot;,&quot;TODAYSOPEN&quot;,0);</span></span>
<span class="line"><span>LotSize    = Param(&quot;Lot Size&quot;,75,1,10000,1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>ATMoffsetCE = Param(&quot;ATM CE Offset&quot;,0,-40,40,1);</span></span>
<span class="line"><span>ITMoffsetCE = Param(&quot;ITM CE Offset&quot;,-2,-40,-1,1);</span></span>
<span class="line"><span>OTMoffsetCE = Param(&quot;OTM CE Offset&quot;,4,1,40,1);</span></span>
<span class="line"><span>ATMoffsetPE = Param(&quot;ATM PE Offset&quot;,0,-40,40,1);</span></span>
<span class="line"><span>ITMoffsetPE = Param(&quot;ITM PE Offset&quot;,-2,-40,-1,1);</span></span>
<span class="line"><span>OTMoffsetPE = Param(&quot;OTM PE Offset&quot;,4,1,40,1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>pricetype  = ParamList(&quot;Order Type&quot;,&quot;MARKET&quot;,0);</span></span>
<span class="line"><span>product    = ParamList(&quot;Product&quot;,&quot;MIS|NRML&quot;,1);</span></span>
<span class="line"><span>tradetype  = ParamList(&quot;Option Trade Type&quot;,&quot;BUY|SELL&quot;,0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>quantity   = Param(&quot;Total Quantity(Lot Size)&quot;,1,0,10000,1)*LotSize;</span></span>
<span class="line"><span>splitsize  = Param(&quot;Split Size&quot;,25,1,10000,1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>host       = ParamStr(&quot;host&quot;,&quot;http://127.0.0.1:5000&quot;);</span></span>
<span class="line"><span>ver        = ParamStr(&quot;API Version&quot;,&quot;v1&quot;);</span></span>
<span class="line"><span>VoiceAlert = ParamList(&quot;Voice Alert&quot;,&quot;Disable|Enable&quot;,1);</span></span>
<span class="line"><span>EnableAlgo = ParamList(&quot;AlgoStatus&quot;,&quot;Disable|Enable&quot;,0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>bridgeurl = host+&quot;/api/&quot;+ver;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//Static Variables for Order protection</span></span>
<span class="line"><span>static_name_ = Name()+GetChartID()+interval(2)+strategy;</span></span>
<span class="line"><span>static_name_algo = Name()+GetChartID()+interval(2)+strategy+&quot;algostatus&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//Tradeboard Dashboard</span></span>
<span class="line"><span></span></span>
<span class="line"><span>GfxSelectFont( &quot;BOOK ANTIQUA&quot;, 14, 100 );</span></span>
<span class="line"><span>GfxSetBkMode( 1 );</span></span>
<span class="line"><span>if(EnableAlgo == &quot;Enable&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>AlgoStatus = &quot;Algo Enabled&quot;;</span></span>
<span class="line"><span>GfxSetTextColor( colorGreen ); </span></span>
<span class="line"><span>GfxTextOut( &quot;Algostatus : &quot;+AlgoStatus , 20, 40); </span></span>
<span class="line"><span>if(Nz(StaticVarGet(static_name_algo),0)!=1)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>_TRACE(&quot;Algo Status : Enabled&quot;);</span></span>
<span class="line"><span>StaticVarSet(static_name_algo, 1);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>if(EnableAlgo == &quot;Disable&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>AlgoStatus = &quot;Algo Disabled&quot;;</span></span>
<span class="line"><span>GfxSetTextColor( colorRed ); </span></span>
<span class="line"><span>GfxTextOut( &quot;Algostatus : &quot;+AlgoStatus , 20, 40); </span></span>
<span class="line"><span>if(Nz(StaticVarGet(static_name_algo),0)!=0)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>_TRACE(&quot;Algo Status : Disabled&quot;);</span></span>
<span class="line"><span>StaticVarSet(static_name_algo, 0);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>GfxSetTextColor( colorWhite ); </span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Strike Calculation</span></span>
<span class="line"><span>if(StrikeCalculation==&quot;PREVOPEN&quot;){ SetForeign(Symbol); spotC = LastValue(Ref(OPEN,-1)); RestorePriceArrays();}</span></span>
<span class="line"><span>if(StrikeCalculation==&quot;PREVCLOSE&quot;){ SetForeign(Symbol); spotC = LastValue(Ref(Close,-1)); RestorePriceArrays();}</span></span>
<span class="line"><span>if(StrikeCalculation==&quot;TODAYSOPEN&quot;){ SetForeign(Symbol); spotC = LastValue(TimeFrameGetPrice(&quot;O&quot;,inDaily)); RestorePriceArrays();}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>strike = IIf(spotC % iInterval &gt; iInterval/2, spotC - (spotC%iInterval) + iInterval, spotC - (spotC%iInterval));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>ATMstrikeCE = strike + (ATMoffsetCE * iInterval);</span></span>
<span class="line"><span>ATMstrikePE = strike - (ATMoffsetPE * iInterval);</span></span>
<span class="line"><span>ITMstrikeCE = strike + (ITMoffsetCE * iInterval);</span></span>
<span class="line"><span>ITMstrikePE = strike - (ITMoffsetPE * iInterval);</span></span>
<span class="line"><span>OTMstrikeCE = strike + (OTMoffsetCE * iInterval);</span></span>
<span class="line"><span>OTMstrikePE = strike - (OTMoffsetPE * iInterval);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>ATMsymbolCE = spot+expiry+ATMstrikeCE+&quot;CE&quot;;</span></span>
<span class="line"><span>ATMsymbolPE = spot+expiry+ATMstrikePE+&quot;PE&quot;;</span></span>
<span class="line"><span>ITMsymbolCE = spot+expiry+ITMstrikeCE+&quot;CE&quot;;</span></span>
<span class="line"><span>ITMsymbolPE = spot+expiry+ITMstrikePE+&quot;PE&quot;;</span></span>
<span class="line"><span>OTMsymbolCE = spot+expiry+OTMstrikeCE+&quot;CE&quot;;</span></span>
<span class="line"><span>OTMsymbolPE = spot+expiry+OTMstrikePE+&quot;PE&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Interpretation Print - current strikes</span></span>
<span class="line"><span>printf(&quot;\\n ------ Current Strikes ------&quot;);</span></span>
<span class="line"><span>printf(&quot;\\n ATM CE = &quot; + ATMsymbolCE);</span></span>
<span class="line"><span>printf(&quot;\\n ATM PE = &quot; + ATMsymbolPE);</span></span>
<span class="line"><span>printf(&quot;\\n ITM CE = &quot; + ITMsymbolCE);</span></span>
<span class="line"><span>printf(&quot;\\n ITM PE = &quot; + ITMsymbolPE);</span></span>
<span class="line"><span>printf(&quot;\\n OTM CE = &quot; + OTMstrikeCE);</span></span>
<span class="line"><span>printf(&quot;\\n OTM PE = &quot; + OTMstrikePE);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>printf(&quot;\\n ------ Memory State ------&quot;);</span></span>
<span class="line"><span>printf(&quot;\\n ATMsymbolCE = &quot; + StaticVarGetText(static_name_+&quot;ATMsymbolCE&quot;) + &quot; | Qty: &quot; + NumToStr(Nz(StaticVarGet(static_name_+&quot;ATMsymbolCE_qty&quot;)),1.0));</span></span>
<span class="line"><span>printf(&quot;\\n ITMsymbolCE = &quot; + StaticVarGetText(static_name_+&quot;ITMsymbolCE&quot;) + &quot; | Qty: &quot; + NumToStr(Nz(StaticVarGet(static_name_+&quot;ITMsymbolCE_qty&quot;)),1.0));</span></span>
<span class="line"><span>printf(&quot;\\n OTMsymbolCE = &quot; + StaticVarGetText(static_name_+&quot;OTMsymbolCE&quot;) + &quot; | Qty: &quot; + NumToStr(Nz(StaticVarGet(static_name_+&quot;OTMsymbolCE_qty&quot;)),1.0));</span></span>
<span class="line"><span>printf(&quot;\\n ATMsymbolPE = &quot; + StaticVarGetText(static_name_+&quot;ATMsymbolPE&quot;) + &quot; | Qty: &quot; + NumToStr(Nz(StaticVarGet(static_name_+&quot;ATMsymbolPE_qty&quot;)),1.0));</span></span>
<span class="line"><span>printf(&quot;\\n ITMsymbolPE = &quot; + StaticVarGetText(static_name_+&quot;ITMsymbolPE&quot;) + &quot; | Qty: &quot; + NumToStr(Nz(StaticVarGet(static_name_+&quot;ITMsymbolPE_qty&quot;)),1.0));</span></span>
<span class="line"><span>printf(&quot;\\n OTMsymbolPE = &quot; + StaticVarGetText(static_name_+&quot;OTMsymbolPE&quot;) + &quot; | Qty: &quot; + NumToStr(Nz(StaticVarGet(static_name_+&quot;OTMsymbolPE_qty&quot;)),1.0));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>_SECTION_BEGIN(&quot;Tradeboard Bridge SplitOrder Controls&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>EnableScript(&quot;VBScript&quot;);</span></span>
<span class="line"><span>&lt;%</span></span>
<span class="line"><span>Public Sub PlaceSplitOrder(symbol,action, quantity, splitsize)</span></span>
<span class="line"><span>    Dim oXMLHTTP</span></span>
<span class="line"><span>    Set oXMLHTTP = CreateObject(&quot;Msxml2.XMLHTTP&quot;)</span></span>
<span class="line"><span>    Dim apikey, strategy, exchange, pricetype, product</span></span>
<span class="line"><span>    apikey = AFL.Var(&quot;apikey&quot;)</span></span>
<span class="line"><span>    strategy = AFL.Var(&quot;strategy&quot;)</span></span>
<span class="line"><span>    exchange = AFL.Var(&quot;exchange&quot;)</span></span>
<span class="line"><span>    pricetype = AFL.Var(&quot;pricetype&quot;)</span></span>
<span class="line"><span>    product = AFL.Var(&quot;product&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Dim jsonRequestBody</span></span>
<span class="line"><span>    jsonRequestBody = &quot;{&quot;&quot;apikey&quot;&quot;:&quot;&quot;&quot; &amp; apikey &amp; _</span></span>
<span class="line"><span>    &quot;&quot;&quot;,&quot;&quot;strategy&quot;&quot;:&quot;&quot;&quot; &amp; strategy &amp; _</span></span>
<span class="line"><span>    &quot;&quot;&quot;,&quot;&quot;symbol&quot;&quot;:&quot;&quot;&quot; &amp; symbol &amp; _</span></span>
<span class="line"><span>    &quot;&quot;&quot;,&quot;&quot;action&quot;&quot;:&quot;&quot;&quot; &amp; action &amp; _</span></span>
<span class="line"><span>    &quot;&quot;&quot;,&quot;&quot;exchange&quot;&quot;:&quot;&quot;&quot; &amp; exchange &amp; _</span></span>
<span class="line"><span>    &quot;&quot;&quot;,&quot;&quot;pricetype&quot;&quot;:&quot;&quot;&quot; &amp; pricetype &amp; _</span></span>
<span class="line"><span>    &quot;&quot;&quot;,&quot;&quot;product&quot;&quot;:&quot;&quot;&quot; &amp; product &amp; _</span></span>
<span class="line"><span>    &quot;&quot;&quot;,&quot;&quot;quantity&quot;&quot;:&quot;&quot;&quot; &amp; quantity &amp; _</span></span>
<span class="line"><span>    &quot;&quot;&quot;,&quot;&quot;splitsize&quot;&quot;:&quot;&quot;&quot; &amp; splitsize &amp; &quot;&quot;&quot;}&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Dim url</span></span>
<span class="line"><span>    url = AFL.Var(&quot;bridgeurl&quot;) &amp; &quot;/splitorder&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    oXMLHTTP.Open &quot;POST&quot;, url, False</span></span>
<span class="line"><span>    oXMLHTTP.setRequestHeader &quot;Content-Type&quot;, &quot;application/json&quot;</span></span>
<span class="line"><span>    oXMLHTTP.Send jsonRequestBody</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    AFL(&quot;api_request&quot;) = jsonRequestBody</span></span>
<span class="line"><span>    AFL(&quot;api_response&quot;) = oXMLHTTP.responseText</span></span>
<span class="line"><span>End Sub</span></span>
<span class="line"><span>%&gt;</span></span>
<span class="line"><span>tradeboard = GetScriptObject();</span></span>
<span class="line"><span>_SECTION_END();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Global TryClose</span></span>
<span class="line"><span>procedure TryClose(sym)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    exitSymbol = StaticVarGetText(static_name_+sym);</span></span>
<span class="line"><span>    totalQty = Nz(StaticVarGet(static_name_+sym+&quot;_qty&quot;),0);</span></span>
<span class="line"><span>    if(exitSymbol!=&quot;&quot; AND totalQty&gt;0)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        tradeboard.PlaceSplitOrder(exitSymbol, &quot;SELL&quot;, totalQty, splitsize);</span></span>
<span class="line"><span>        _TRACE(&quot;CloseAll - &quot; + sym + &quot; API Request : &quot; + api_request);</span></span>
<span class="line"><span>        _TRACE(&quot;CloseAll - &quot; + sym + &quot; API Response : &quot; + api_response);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    StaticVarSetText(static_name_+sym, &quot;&quot;);</span></span>
<span class="line"><span>    StaticVarSet(static_name_+sym+&quot;_qty&quot;, 0);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Universal helpers</span></span>
<span class="line"><span>X0=20; Y0=100; X1=60;</span></span>
<span class="line"><span>LBClick = GetCursorMouseButtons() == 9;</span></span>
<span class="line"><span>MouseX  = Nz(GetCursorXPosition(1));</span></span>
<span class="line"><span>MouseY  = Nz(GetCursorYPosition(1));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>procedure DrawButton (Text, x1, y1, x2, y2, colorFrom, colorTo)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	GfxSetOverlayMode(0);</span></span>
<span class="line"><span>	GfxSelectFont(&quot;Verdana&quot;, 9, 700);</span></span>
<span class="line"><span>	GfxSetBkMode(1);</span></span>
<span class="line"><span>	GfxGradientRect(x1, y1, x2, y2, colorFrom, colorTo);</span></span>
<span class="line"><span>	GfxDrawText(Text, x1, y1, x2, y2, 32|1|4|16);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>procedure HandleTrade(symbolVar, memoryKey, buyText, exitText, x, y)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    DrawButton(buyText, x, y, x+X1+50, y+50, colorGreen, colorGreen);</span></span>
<span class="line"><span>    cursorInBuy = MouseX&gt;=x AND MouseX&lt;=x+X1+50 AND MouseY&gt;=y AND MouseY&lt;=y+50;</span></span>
<span class="line"><span>    btnClickBuy = cursorInBuy AND LBClick;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if(btnClickBuy AND StaticVarGet(static_name_+memoryKey+&quot;E&quot;)==0)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        tradeboard.PlaceSplitOrder(symbolVar, tradetype, quantity, splitsize);</span></span>
<span class="line"><span>        _TRACE(&quot;API Request : &quot; + api_request);</span></span>
<span class="line"><span>        _TRACE(&quot;API Response : &quot; + api_response);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        StaticVarSetText(static_name_+memoryKey, symbolVar, True);</span></span>
<span class="line"><span>        prevQty = Nz(StaticVarGet(static_name_+memoryKey+&quot;_qty&quot;), 0);</span></span>
<span class="line"><span>        StaticVarSet(static_name_+memoryKey+&quot;_qty&quot;, prevQty + quantity);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if(VoiceAlert==&quot;Enable&quot;){ Say(buyText+&quot; Order&quot;); }</span></span>
<span class="line"><span>        StaticVarSet(static_name_+memoryKey+&quot;E&quot;,1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    else { StaticVarSet(static_name_+memoryKey+&quot;E&quot;,0); }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    DrawButton(exitText, x, y+55, x+X1+50, y+105, colorRed, colorRed);</span></span>
<span class="line"><span>    cursorInExit = MouseX&gt;=x AND MouseX&lt;=x+X1+50 AND MouseY&gt;=y+55 AND MouseY&lt;=y+105;</span></span>
<span class="line"><span>    btnClickExit = cursorInExit AND LBClick;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if(btnClickExit AND StaticVarGet(static_name_+&quot;x&quot;+memoryKey)==0)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        exitSymbol = StaticVarGetText(static_name_+memoryKey);</span></span>
<span class="line"><span>        totalQty   = Nz(StaticVarGet(static_name_+memoryKey+&quot;_qty&quot;),0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if(exitSymbol!=&quot;&quot; AND totalQty&gt;0)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            tradeboard.PlaceSplitOrder(exitSymbol, &quot;SELL&quot;, totalQty, splitsize);</span></span>
<span class="line"><span>            _TRACE(&quot;API Request : &quot; + api_request);</span></span>
<span class="line"><span>            _TRACE(&quot;API Response : &quot; + api_response);</span></span>
<span class="line"><span>            if(VoiceAlert==&quot;Enable&quot;){ Say(&quot;Exit &quot;+exitText); }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        StaticVarSetText(static_name_+memoryKey, &quot;&quot;);</span></span>
<span class="line"><span>        StaticVarSet(static_name_+memoryKey+&quot;_qty&quot;, 0);</span></span>
<span class="line"><span>        StaticVarSet(static_name_+&quot;x&quot;+memoryKey, 1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    else { StaticVarSet(static_name_+&quot;x&quot;+memoryKey, 0); }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>_SECTION_BEGIN(&quot;Buttons with close all &amp; clear memory&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if(EnableAlgo == &quot;Enable&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    HandleTrade(ATMsymbolCE, &quot;ATMsymbolCE&quot;, &quot;ATM CE&quot;, &quot;x ATM CE&quot;, 20, 100);</span></span>
<span class="line"><span>    HandleTrade(ITMsymbolCE, &quot;ITMsymbolCE&quot;, &quot;ITM CE&quot;, &quot;x ITM CE&quot;, 140, 100);</span></span>
<span class="line"><span>    HandleTrade(OTMsymbolCE, &quot;OTMsymbolCE&quot;, &quot;OTM CE&quot;, &quot;x OTM CE&quot;, 260, 100);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    HandleTrade(ATMsymbolPE, &quot;ATMsymbolPE&quot;, &quot;ATM PE&quot;, &quot;x ATM PE&quot;, 20, 240);</span></span>
<span class="line"><span>    HandleTrade(ITMsymbolPE, &quot;ITMsymbolPE&quot;, &quot;ITM PE&quot;, &quot;x ITM PE&quot;, 140, 240);</span></span>
<span class="line"><span>    HandleTrade(OTMsymbolPE, &quot;OTMsymbolPE&quot;, &quot;OTM PE&quot;, &quot;x OTM PE&quot;, 260, 240);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    DrawButton(&quot;Close All&quot;, 20, 380, 200, 430, colorRed, colorRed);</span></span>
<span class="line"><span>    closeAll = MouseX&gt;=20 AND MouseX&lt;=200 AND MouseY&gt;=380 AND MouseY&lt;=430 AND LBClick;</span></span>
<span class="line"><span>    if(closeAll)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        TryClose(&quot;ATMsymbolCE&quot;); TryClose(&quot;ITMsymbolCE&quot;); TryClose(&quot;OTMsymbolCE&quot;);</span></span>
<span class="line"><span>        TryClose(&quot;ATMsymbolPE&quot;); TryClose(&quot;ITMsymbolPE&quot;); TryClose(&quot;OTMsymbolPE&quot;);</span></span>
<span class="line"><span>        Say(&quot;All Positions Closed and Memory Cleared&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    DrawButton(&quot;Clear Memory&quot;, 220, 380, 400, 430, colorBlue, colorBlue);</span></span>
<span class="line"><span>    clearMem = MouseX&gt;=220 AND MouseX&lt;=400 AND MouseY&gt;=380 AND MouseY&lt;=430 AND LBClick;</span></span>
<span class="line"><span>    if(clearMem)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        StaticVarSetText(static_name_+&quot;ATMsymbolCE&quot;,&quot;&quot;); StaticVarSet(static_name_+&quot;ATMsymbolCE_qty&quot;,0);</span></span>
<span class="line"><span>        StaticVarSetText(static_name_+&quot;ITMsymbolCE&quot;,&quot;&quot;); StaticVarSet(static_name_+&quot;ITMsymbolCE_qty&quot;,0);</span></span>
<span class="line"><span>        StaticVarSetText(static_name_+&quot;OTMsymbolCE&quot;,&quot;&quot;); StaticVarSet(static_name_+&quot;OTMsymbolCE_qty&quot;,0);</span></span>
<span class="line"><span>        StaticVarSetText(static_name_+&quot;ATMsymbolPE&quot;,&quot;&quot;); StaticVarSet(static_name_+&quot;ATMsymbolPE_qty&quot;,0);</span></span>
<span class="line"><span>        StaticVarSetText(static_name_+&quot;ITMsymbolPE&quot;,&quot;&quot;); StaticVarSet(static_name_+&quot;ITMsymbolPE_qty&quot;,0);</span></span>
<span class="line"><span>        StaticVarSetText(static_name_+&quot;OTMsymbolPE&quot;,&quot;&quot;); StaticVarSet(static_name_+&quot;OTMsymbolPE_qty&quot;,0);</span></span>
<span class="line"><span>        Say(&quot;Internal Memory Cleared&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>_SECTION_END();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>_SECTION_BEGIN(&quot;Candlestick Charts&quot;);</span></span>
<span class="line"><span>SetChartOptions(0, chartShowArrows|chartShowDates);</span></span>
<span class="line"><span>Plot(Close,&quot;Candle&quot;,colorDefault,styleCandle);</span></span>
<span class="line"><span>_SECTION_END();</span></span></code></pre></div>`,5)])])}const T=a(o,[["render",l]]);export{y as __pageData,T as default};
