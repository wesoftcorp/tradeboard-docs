import{_ as n,o as s,c as p,a2 as t}from"./chunks/framework.BXzK3EA4.js";const S=JSON.parse('{"title":"Equity Exploration Module","description":"","frontmatter":{},"headers":[],"relativePath":"trading-platform/amibroker/equity-exploration-module.md","filePath":"trading-platform/amibroker/equity-exploration-module.md"}'),l={name:"trading-platform/amibroker/equity-exploration-module.md"};function e(o,a,i,u,c,r){return s(),p("div",null,[...a[0]||(a[0]=[t(`<h1 id="equity-exploration-module" tabindex="-1">Equity Exploration Module <a class="header-anchor" href="#equity-exploration-module" aria-label="Permalink to &quot;Equity Exploration Module&quot;">​</a></h1><h2 id="internet-functions-module-modern-method" tabindex="-1">Internet Functions Module (Modern Method) <a class="header-anchor" href="#internet-functions-module-modern-method" aria-label="Permalink to &quot;Internet Functions Module (Modern Method)&quot;">​</a></h2><div class="language-clike vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">clike</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//Tradeboard - Intraday Cash Exploration Module</span></span>
<span class="line"><span>//Avoid using the code for running positional strategies</span></span>
<span class="line"><span>//If in case one have run for cash to cash intraday then ensure that symbol</span></span>
<span class="line"><span>//string manipulation is done according to the data vendor symbol format to match the</span></span>
<span class="line"><span>//brokers equity market symbols.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//Modernized code using AmiBroker&#39;s Internet functions</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//////////////////////////////////////////////</span></span>
<span class="line"><span>//Amibroker Equity Exploration Module</span></span>
<span class="line"><span>//Coded by Rajeev Upadhyay - Creator, Tradeboard</span></span>
<span class="line"><span>//Date : 17/12/2024</span></span>
<span class="line"><span>//////////////////////////////////////////////</span></span>
<span class="line"><span></span></span>
<span class="line"><span>_SECTION_BEGIN(&quot;Exploration Module Order Controls&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>strategy = ParamStr(&quot;Strategy Name&quot;, &quot;Exploration Strategy&quot;);</span></span>
<span class="line"><span>apikey = ParamStr(&quot;Tradeboard API Key&quot;, &quot;******&quot;);</span></span>
<span class="line"><span>exchange = ParamList(&quot;Exchange&quot;,&quot;NSE|BSE&quot;,0);</span></span>
<span class="line"><span>pricetype = ParamStr(&quot;Price Type&quot;, &quot;MARKET&quot;);</span></span>
<span class="line"><span>product = ParamList(&quot;Product&quot;, &quot;MIS|CNC&quot;,0);</span></span>
<span class="line"><span>host = ParamStr(&quot;host&quot;,&quot;http://127.0.0.1:5000&quot;);</span></span>
<span class="line"><span>ver = ParamStr(&quot;API Version&quot;,&quot;v1&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>bridgeurl = host+&quot;/api/&quot;+ver;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Mapping of Equity Symbol</span></span>
<span class="line"><span>symbol = Name(); // Adjust symbol mapping as per data vendor if needed</span></span>
<span class="line"><span>// Example:</span></span>
<span class="line"><span>// symbol = StrReplace(Name(),&quot;.NSE&quot;,&quot;&quot;)+&quot;-EQ&quot;;</span><span>    // For Globaldatafeeds</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Position = Param(&quot;Position Size (Rupee Terms)&quot;,1000,1,10000000,1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>EntryDelay = Param(&quot;Entry Delay&quot;,0,0,1,1);</span></span>
<span class="line"><span>ExitDelay = Param(&quot;Exit Delay&quot;,0,0,1,1);</span></span>
<span class="line"><span>EnableAlgo = ParamList(&quot;Tradeboard&quot;,&quot;Disable|Enable|LongOnly|ShortOnly&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//Configure Trade Execution Delay (for recent signals)</span></span>
<span class="line"><span>AlgoBuy = LastValue(Ref(Buy,-EntryDelay));</span></span>
<span class="line"><span>AlgoSell = LastValue(Ref(Sell,-ExitDelay));</span></span>
<span class="line"><span>AlgoShort = LastValue(Ref(Short,-EntryDelay));</span></span>
<span class="line"><span>AlgoCover = LastValue(Ref(Cover,-ExitDelay));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//multiple order supression purpose we need static variables</span></span>
<span class="line"><span>static_name_ = Name()+GetChartID()+interval(2)+strategy;</span></span>
<span class="line"><span>static_name_algo = Name()+GetChartID()+interval(2)+strategy+&quot;algostatus&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//Algo Dashboard</span></span>
<span class="line"><span>GfxSelectFont( &quot;BOOK ANTIQUA&quot;, 14, 100 );</span></span>
<span class="line"><span>GfxSetBkMode( 1 );</span></span>
<span class="line"><span>if(EnableAlgo == &quot;Enable&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    AlgoStatus = &quot;Algo Enabled&quot;;</span></span>
<span class="line"><span>    GfxSetTextColor( colorGreen ); </span></span>
<span class="line"><span>    GfxTextOut( &quot;Algostatus : &quot;+AlgoStatus , 20, 40); </span></span>
<span class="line"><span>    if(Nz(StaticVarGet(static_name_algo),0)!=1)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        _TRACE(&quot;Algo Status : Enabled&quot;);</span></span>
<span class="line"><span>        StaticVarSet(static_name_algo, 1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>if(EnableAlgo == &quot;Disable&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    AlgoStatus = &quot;Algo Disabled&quot;;</span></span>
<span class="line"><span>    GfxSetTextColor( colorRed ); </span></span>
<span class="line"><span>    GfxTextOut( &quot;Algostatus : &quot;+AlgoStatus , 20, 40); </span></span>
<span class="line"><span>    if(Nz(StaticVarGet(static_name_algo),0)!=0)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        _TRACE(&quot;Algo Status : Disabled&quot;);</span></span>
<span class="line"><span>        StaticVarSet(static_name_algo, 0);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>if(EnableAlgo == &quot;LongOnly&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    AlgoStatus = &quot;Long Only&quot;;</span></span>
<span class="line"><span>    GfxSetTextColor( colorYellow ); </span></span>
<span class="line"><span>    GfxTextOut( &quot;Algostatus : &quot;+AlgoStatus , 20, 40); </span></span>
<span class="line"><span>    if(Nz(StaticVarGet(static_name_algo),0)!=2)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        _TRACE(&quot;Algo Status : Long Only&quot;);</span></span>
<span class="line"><span>        StaticVarSet(static_name_algo, 2);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>if(EnableAlgo == &quot;ShortOnly&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    AlgoStatus = &quot;Short Only&quot;;</span></span>
<span class="line"><span>    GfxSetTextColor( colorOrange ); </span></span>
<span class="line"><span>    GfxTextOut( &quot;Algostatus : &quot;+AlgoStatus , 20, 40); </span></span>
<span class="line"><span>    if(Nz(StaticVarGet(static_name_algo),0)!=3)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        _TRACE(&quot;Algo Status : Short Only&quot;);</span></span>
<span class="line"><span>        StaticVarSet(static_name_algo, 3);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Function to Place Order using Internet Functions</span></span>
<span class="line"><span>function PlaceOrder(action, quantity)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    // Construct JSON body</span></span>
<span class="line"><span>    postData = &quot;{&quot;+</span></span>
<span class="line"><span>       &quot;\\&quot;apikey\\&quot;:\\&quot;&quot; + apikey + &quot;\\&quot;,&quot; +</span></span>
<span class="line"><span>       &quot;\\&quot;strategy\\&quot;:\\&quot;&quot; + strategy + &quot;\\&quot;,&quot; +</span></span>
<span class="line"><span>       &quot;\\&quot;symbol\\&quot;:\\&quot;&quot; + symbol + &quot;\\&quot;,&quot; +</span></span>
<span class="line"><span>       &quot;\\&quot;action\\&quot;:\\&quot;&quot; + action + &quot;\\&quot;,&quot; +</span></span>
<span class="line"><span>       &quot;\\&quot;exchange\\&quot;:\\&quot;&quot; + exchange + &quot;\\&quot;,&quot; +</span></span>
<span class="line"><span>       &quot;\\&quot;pricetype\\&quot;:\\&quot;&quot; + pricetype + &quot;\\&quot;,&quot; +</span></span>
<span class="line"><span>       &quot;\\&quot;product\\&quot;:\\&quot;&quot; + product + &quot;\\&quot;,&quot; +</span></span>
<span class="line"><span>       &quot;\\&quot;quantity\\&quot;:\\&quot;&quot; + quantity + &quot;\\&quot;}&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    headers = &quot;Content-Type: application/json\\r\\n&quot; +</span></span>
<span class="line"><span>              &quot;Cache-Control: no-cache\\r\\n&quot; +</span></span>
<span class="line"><span>              &quot;Pragma: no-cache\\r\\n&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    InternetSetHeaders(headers);</span></span>
<span class="line"><span>    _TRACE(&quot;API Request (POST /placeorder): &quot; + postData);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ih = InternetPostRequest(bridgeurl + &quot;/placeorder&quot;, postData);</span></span>
<span class="line"><span>    if(ih)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        response = &quot;&quot;;</span></span>
<span class="line"><span>        line = &quot;&quot;;</span></span>
<span class="line"><span>        while((line = InternetReadString(ih)) != &quot;&quot;)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            response += line;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        InternetClose(ih);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        _TRACE(&quot;API Response: &quot; + response);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    else</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        _TRACE(&quot;Failed to execute InternetPostRequest&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if(Status(&quot;action&quot;) == actionExplore)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    entryquantity = int(Position/Close);</span></span>
<span class="line"><span>    exitbuyquantity = ValueWhen(Buy ,int(Position/Close));</span></span>
<span class="line"><span>    exitshortquantity = ValueWhen(Short ,int(Position/Close));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    bsr = Buy AND Cover;</span></span>
<span class="line"><span>    ssr = Short AND Sell;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    iSignal  = IIf(bsr,&#39;L&#39;,IIf(ssr,&#39;R&#39;,IIf(Buy,&#39;B&#39;,IIf(Sell,&#39;S&#39;,IIf(Short,&#39;S&#39;,&#39;B&#39;)))));</span></span>
<span class="line"><span>    Filter = Buy OR Sell OR Short OR Cover;</span></span>
<span class="line"><span>    AddTextColumn(symbol,&quot;Trading Symbol&quot;);</span></span>
<span class="line"><span>    AddColumn(IIf(Buy,&#39;B&#39;,&#39;-&#39;), &quot;Long Entry&quot;,format=formatChar);</span></span>
<span class="line"><span>    AddColumn(IIf(Sell,&#39;X&#39;,&#39;-&#39;), &quot;Long Exit&quot;,format=formatChar);</span></span>
<span class="line"><span>    AddColumn(IIf(Short,&#39;S&#39;,&#39;-&#39;), &quot;Short Entry&quot;,format=formatChar);</span></span>
<span class="line"><span>    AddColumn(IIf(Cover,&#39;C&#39;,&#39;-&#39;), &quot;Short  Exit&quot;,format=formatChar);</span></span>
<span class="line"><span>    AddColumn(IIf(bsr, entryquantity+exitshortquantity,IIf(ssr,entryquantity+exitbuyquantity,IIf(Buy OR Short,entryquantity,IIf(Sell,exitbuyquantity,IIf(Cover,exitshortquantity,Null))))),&quot;Trading Quantity&quot;,1);</span></span>
<span class="line"><span>    AddColumn(iSignal, &quot;Signal Value&quot;,format=formatChar);</span></span>
<span class="line"><span>    AddColumn(C,&quot;LTP&quot;,1.2);</span></span>
<span class="line"><span>    SetSortColumns(2);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Execution Module</span></span>
<span class="line"><span>    if(EnableAlgo != &quot;Disable&quot;)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        lasttime = StrFormat(&quot;%0.f&quot;,LastValue(BarIndex()));</span></span>
<span class="line"><span>        SetChartBkColor(colorDarkGrey);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if(EnableAlgo == &quot;Enable&quot;)</span></span>
<span class="line"><span>        {   </span></span>
<span class="line"><span>            // Reverse Long Entry - Buy &amp; Cover together</span></span>
<span class="line"><span>            if (AlgoBuy==True AND AlgoCover == True AND StaticVarGet(static_name_+&quot;buyCoverAlgo&quot;)==0 AND StaticVarGetText(static_name_+&quot;buyCoverAlgo_barvalue&quot;) != lasttime )</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>                quantity = lastvalue(entryquantity+exitshortquantity);</span></span>
<span class="line"><span>                PlaceOrder(&quot;BUY&quot;, quantity);</span></span>
<span class="line"><span>                StaticVarSetText(static_name_+&quot;buyCoverAlgo_barvalue&quot;,lasttime);  </span></span>
<span class="line"><span>                StaticVarSet(static_name_+&quot;buyCoverAlgo&quot;,1);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            else if ((AlgoBuy != True OR AlgoCover != True))</span></span>
<span class="line"><span>            {   </span></span>
<span class="line"><span>                StaticVarSet(static_name_+&quot;buyCoverAlgo&quot;,0);</span></span>
<span class="line"><span>                StaticVarSetText(static_name_+&quot;buyCoverAlgo_barvalue&quot;,&quot;&quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            // Long Entry Only</span></span>
<span class="line"><span>            if (AlgoBuy==True AND AlgoCover != True AND StaticVarGet(static_name_+&quot;buyAlgo&quot;)==0 AND StaticVarGetText(static_name_+&quot;buyAlgo_barvalue&quot;) != lasttime)</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>                quantity = LastValue(entryquantity);</span></span>
<span class="line"><span>                PlaceOrder(&quot;BUY&quot;,quantity);</span></span>
<span class="line"><span>                StaticVarSetText(static_name_+&quot;buyAlgo_barvalue&quot;,lasttime); </span></span>
<span class="line"><span>                StaticVarSet(static_name_+&quot;buyAlgo&quot;,1);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            else if (AlgoBuy != True)</span></span>
<span class="line"><span>            {   </span></span>
<span class="line"><span>                StaticVarSet(static_name_+&quot;buyAlgo&quot;,0);</span></span>
<span class="line"><span>                StaticVarSetText(static_name_+&quot;buyAlgo_barvalue&quot;,&quot;&quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            // Long Exit Only</span></span>
<span class="line"><span>            if (AlgoSell==true AND AlgoShort != True AND StaticVarGet(static_name_+&quot;sellAlgo&quot;)==0 AND StaticVarGetText(static_name_+&quot;sellAlgo_barvalue&quot;) != lasttime)</span></span>
<span class="line"><span>            {     </span></span>
<span class="line"><span>                quantity = LastValue(exitbuyquantity);</span></span>
<span class="line"><span>                PlaceOrder(&quot;SELL&quot;,quantity);</span></span>
<span class="line"><span>                StaticVarSetText(static_name_+&quot;sellAlgo_barvalue&quot;,lasttime);</span></span>
<span class="line"><span>                StaticVarSet(static_name_+&quot;sellAlgo&quot;,1);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            else if (AlgoSell != True )</span></span>
<span class="line"><span>            {   </span></span>
<span class="line"><span>                StaticVarSet(static_name_+&quot;sellAlgo&quot;,0);</span></span>
<span class="line"><span>                StaticVarSetText(static_name_+&quot;sellAlgo_barvalue&quot;,&quot;&quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            // Reverse Short Entry - Short &amp; Sell together</span></span>
<span class="line"><span>            if (AlgoShort==True AND AlgoSell==True AND  StaticVarGet(static_name_+&quot;ShortSellAlgo&quot;)==0 AND StaticVarGetText(static_name_+&quot;ShortSellAlgo_barvalue&quot;) != lasttime)</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>                quantity = LastValue(exitbuyquantity+entryquantity);</span></span>
<span class="line"><span>                PlaceOrder(&quot;SELL&quot;,quantity);</span></span>
<span class="line"><span>                StaticVarSetText(static_name_+&quot;ShortsellAlgo_barvalue&quot;,lasttime);</span></span>
<span class="line"><span>                StaticVarSet(static_name_+&quot;ShortSellAlgo&quot;,1);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            else if ((AlgoShort != True OR AlgoSell != True))</span></span>
<span class="line"><span>            {   </span></span>
<span class="line"><span>                StaticVarSet(static_name_+&quot;ShortSellAlgo&quot;,0);</span></span>
<span class="line"><span>                StaticVarSetText(static_name_+&quot;ShortsellAlgo_barvalue&quot;,&quot;&quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            // Short Entry Only</span></span>
<span class="line"><span>            if (AlgoShort==True  AND  AlgoSell != True AND StaticVarGet(static_name_+&quot;ShortAlgo&quot;)==0 AND  StaticVarGetText(static_name_+&quot;ShortAlgo_barvalue&quot;) != lasttime)</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>                quantity = LastValue(entryquantity);</span></span>
<span class="line"><span>                PlaceOrder(&quot;SELL&quot;,quantity);</span></span>
<span class="line"><span>                StaticVarSetText(static_name_+&quot;ShortAlgo_barvalue&quot;,lasttime); </span></span>
<span class="line"><span>                StaticVarSet(static_name_+&quot;ShortAlgo&quot;,1);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            else if (AlgoShort != True )</span></span>
<span class="line"><span>            {   </span></span>
<span class="line"><span>                StaticVarSet(static_name_+&quot;ShortAlgo&quot;,0);</span></span>
<span class="line"><span>                StaticVarSetText(static_name_+&quot;ShortAlgo_barvalue&quot;,&quot;&quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            // Short Exit Only</span></span>
<span class="line"><span>            if (AlgoCover==true AND AlgoBuy != True AND StaticVarGet(static_name_+&quot;CoverAlgo&quot;)==0 AND StaticVarGetText(static_name_+&quot;CoverAlgo_barvalue&quot;) != lasttime)</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>                quantity = LastValue(exitshortquantity);</span></span>
<span class="line"><span>                PlaceOrder(&quot;BUY&quot;,quantity);</span></span>
<span class="line"><span>                StaticVarSetText(static_name_+&quot;CoverAlgo_barvalue&quot;,lasttime); </span></span>
<span class="line"><span>                StaticVarSet(static_name_+&quot;CoverAlgo&quot;,1);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            else if (AlgoCover != True )</span></span>
<span class="line"><span>            {   </span></span>
<span class="line"><span>                StaticVarSet(static_name_+&quot;CoverAlgo&quot;,0);</span></span>
<span class="line"><span>                StaticVarSetText(static_name_+&quot;CoverAlgo_barvalue&quot;,&quot;&quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        else if(EnableAlgo == &quot;LongOnly&quot;)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            // Long Only Entry</span></span>
<span class="line"><span>            if (AlgoBuy==True AND StaticVarGet(static_name_+&quot;buyAlgo&quot;)==0 AND StaticVarGetText(static_name_+&quot;buyAlgo_barvalue&quot;) != lasttime)</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>                quantity = LastValue(entryquantity);</span></span>
<span class="line"><span>                PlaceOrder(&quot;BUY&quot;,quantity);</span></span>
<span class="line"><span>                StaticVarSetText(static_name_+&quot;buyAlgo_barvalue&quot;,lasttime);</span></span>
<span class="line"><span>                StaticVarSet(static_name_+&quot;buyAlgo&quot;,1);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            else if (AlgoBuy != True)</span></span>
<span class="line"><span>            {   </span></span>
<span class="line"><span>                StaticVarSet(static_name_+&quot;buyAlgo&quot;,0);</span></span>
<span class="line"><span>                StaticVarSetText(static_name_+&quot;buyAlgo_barvalue&quot;,&quot;&quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            // Long Only Exit</span></span>
<span class="line"><span>            if (AlgoSell==true AND StaticVarGet(static_name_+&quot;sellAlgo&quot;)==0 AND StaticVarGetText(static_name_+&quot;sellAlgo_barvalue&quot;) != lasttime)</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>                quantity = LastValue(exitbuyquantity);</span></span>
<span class="line"><span>                PlaceOrder(&quot;SELL&quot;,quantity);</span></span>
<span class="line"><span>                StaticVarSetText(static_name_+&quot;sellAlgo_barvalue&quot;,lasttime);</span></span>
<span class="line"><span>                StaticVarSet(static_name_+&quot;sellAlgo&quot;,1);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            else if (AlgoSell != True )</span></span>
<span class="line"><span>            {   </span></span>
<span class="line"><span>                StaticVarSet(static_name_+&quot;sellAlgo&quot;,0);</span></span>
<span class="line"><span>                StaticVarSetText(static_name_+&quot;sellAlgo_barvalue&quot;,&quot;&quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        else if(EnableAlgo == &quot;ShortOnly&quot;)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            // Short Only Entry</span></span>
<span class="line"><span>            if (AlgoShort==True AND StaticVarGet(static_name_+&quot;ShortAlgo&quot;)==0 AND StaticVarGetText(static_name_+&quot;ShortAlgo_barvalue&quot;) != lasttime)</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>                quantity = LastValue(entryquantity);</span></span>
<span class="line"><span>                PlaceOrder(&quot;SELL&quot;,quantity);</span></span>
<span class="line"><span>                StaticVarSetText(static_name_+&quot;ShortAlgo_barvalue&quot;,lasttime); </span></span>
<span class="line"><span>                StaticVarSet(static_name_+&quot;ShortAlgo&quot;,1);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            else if (AlgoShort != True )</span></span>
<span class="line"><span>            {   </span></span>
<span class="line"><span>                StaticVarSet(static_name_+&quot;ShortAlgo&quot;,0);</span></span>
<span class="line"><span>                StaticVarSetText(static_name_+&quot;ShortAlgo_barvalue&quot;,&quot;&quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            // Short Only Exit</span></span>
<span class="line"><span>            if (AlgoCover==true AND StaticVarGet(static_name_+&quot;CoverAlgo&quot;)==0 AND StaticVarGetText(static_name_+&quot;CoverAlgo_barvalue&quot;) != lasttime)</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>                quantity = LastValue(exitshortquantity);</span></span>
<span class="line"><span>                PlaceOrder(&quot;BUY&quot;,quantity);</span></span>
<span class="line"><span>                StaticVarSetText(static_name_+&quot;CoverAlgo_barvalue&quot;,lasttime); </span></span>
<span class="line"><span>                StaticVarSet(static_name_+&quot;CoverAlgo&quot;,1);</span></span>
<span class="line"><span>                _TRACE(&quot;Strategy : &quot;+ strategy +&quot; AlgoStatus : &quot;+ EnableAlgo +&quot; Chart Symbol : &quot;+ Name() +&quot;  Trading Symbol : &quot;+  symbol +&quot;  Quantity : &quot;+ quantity +&quot;  Signal : Cover Signal  TimeFrame : &quot;+ Interval(2)+&quot;  ChardId : &quot;+ GetChartID() + &quot; Latest Price : &quot;+LastValue(C));</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            else if (AlgoCover != True)</span></span>
<span class="line"><span>            {   </span></span>
<span class="line"><span>                StaticVarSet(static_name_+&quot;CoverAlgo&quot;,0);</span></span>
<span class="line"><span>                StaticVarSetText(static_name_+&quot;CoverAlgo_barvalue&quot;,&quot;&quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>_SECTION_END();</span></span></code></pre></div><h2 id="vb-script-module-legacy-method" tabindex="-1">VB Script Module (Legacy Method) <a class="header-anchor" href="#vb-script-module-legacy-method" aria-label="Permalink to &quot;VB Script Module (Legacy Method)&quot;">​</a></h2><div class="language-clike vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">clike</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>//Tradeboard - Intraday Cash Exploration Module</span></span>
<span class="line"><span>//Avoid using the code for running positional strategies</span></span>
<span class="line"><span>//If in case one have run for cash to cash intraday then ensure that symbol</span></span>
<span class="line"><span>//string manipulation is done according to the data vendor symbol format to match the</span></span>
<span class="line"><span>//brokers equity market symbols.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//////////////////////////////////////////////</span></span>
<span class="line"><span>//Amibroker Equity Exploration Module</span></span>
<span class="line"><span>//Coded by Rajeev Upadhyay - Creator, Tradeboard</span></span>
<span class="line"><span>//Date : 10/04/2024</span></span>
<span class="line"><span>//////////////////////////////////////////////</span></span>
<span class="line"><span></span></span>
<span class="line"><span>_SECTION_BEGIN(&quot;Exploration Module Order Controls&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>strategy = ParamStr(&quot;Strategy Name&quot;, &quot;Exploration Strategy&quot;);</span></span>
<span class="line"><span>apikey = ParamStr(&quot;Tradeboard API Key&quot;, &quot;******&quot;);</span></span>
<span class="line"><span>exchange = ParamList(&quot;Exchange&quot;,&quot;NSE|BSE&quot;,0);</span></span>
<span class="line"><span>pricetype = ParamStr(&quot;Price Type&quot;, &quot;MARKET&quot;);</span></span>
<span class="line"><span>product = ParamList(&quot;Product&quot;, &quot;MIS|CNC&quot;,0);</span></span>
<span class="line"><span>host = ParamStr(&quot;host&quot;,&quot;http://127.0.0.1:5000&quot;);</span></span>
<span class="line"><span>ver = ParamStr(&quot;API Version&quot;,&quot;v1&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>bridgeurl = host+&quot;/api/&quot;+ver;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//////////////////////////////////////////////////////////////////////////////////////////</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//Mapping of Equity Symbol needs to be done which matches with the Tradeboard Trading Symbol</span></span>
<span class="line"><span></span></span>
<span class="line"><span>symbol = Name(); //AccelPix Symbol Mapping</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//symbol = StrReplace(Name(),&quot;.NSE&quot;,&quot;&quot;)+&quot;-EQ&quot;;</span><span>    //Globaldatafeed Symbol mapping</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//////////////////////////////////////////////////////////////////////////////////////////</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Position = Param(&quot;Position Size (Rupee Terms)&quot;,1000,1,10000000,1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>EntryDelay = Param(&quot;Entry Delay&quot;,0,0,1,1);</span></span>
<span class="line"><span>ExitDelay = Param(&quot;Exit Delay&quot;,0,0,1,1);</span></span>
<span class="line"><span>EnableAlgo = ParamList(&quot;Tradeboard&quot;,&quot;Disable|Enable|LongOnly|ShortOnly&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//Configure Trade Execution Delay (for recently signals)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>AlgoBuy = LastValue(Ref(Buy,-EntryDelay));</span></span>
<span class="line"><span>AlgoSell = LastValue(Ref(Sell,-ExitDelay));</span></span>
<span class="line"><span>AlgoShort = LastValue(Ref(Short,-EntryDelay));</span></span>
<span class="line"><span>AlgoCover = LastValue(Ref(Cover,-ExitDelay));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//multiple order supression purpose we need static variables</span></span>
<span class="line"><span>static_name_ = Name()+GetChartID()+interval(2)+strategy;</span></span>
<span class="line"><span>static_name_algo = Name()+GetChartID()+interval(2)+strategy+&quot;algostatus&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//Algo Dashboard</span></span>
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
<span class="line"><span>if(EnableAlgo == &quot;LongOnly&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>AlgoStatus = &quot;Long Only&quot;;</span></span>
<span class="line"><span>GfxSetTextColor( colorYellow ); </span></span>
<span class="line"><span>GfxTextOut( &quot;Algostatus : &quot;+AlgoStatus , 20, 40); </span></span>
<span class="line"><span>if(Nz(StaticVarGet(static_name_algo),0)!=2)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>_TRACE(&quot;Algo Status : Long Only&quot;);</span></span>
<span class="line"><span>StaticVarSet(static_name_algo, 2);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>if(EnableAlgo == &quot;ShortOnly&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>AlgoStatus = &quot;Short Only&quot;;</span></span>
<span class="line"><span>GfxSetTextColor( colorOrange ); </span></span>
<span class="line"><span>GfxTextOut( &quot;Algostatus : &quot;+AlgoStatus , 20, 40); </span></span>
<span class="line"><span>if(Nz(StaticVarGet(static_name_algo),0)!=3)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>_TRACE(&quot;Algo Status : Short Only&quot;);</span></span>
<span class="line"><span>StaticVarSet(static_name_algo, 3);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>EnableScript(&quot;VBScript&quot;); </span></span>
<span class="line"><span>&lt;%</span></span>
<span class="line"><span>Public Sub PlaceOrder(action, quantity)</span></span>
<span class="line"><span>    Dim oXMLHTTP</span></span>
<span class="line"><span>    Dim oStream</span></span>
<span class="line"><span>    Set oXMLHTTP = CreateObject(&quot;Msxml2.XMLHTTP&quot;)</span></span>
<span class="line"><span>    &#39; Define variables with the specified values</span></span>
<span class="line"><span>    Dim apikey, strategy, symbol , exchange, pricetype, product</span></span>
<span class="line"><span>    apikey = AFL.Var(&quot;apikey&quot;)</span></span>
<span class="line"><span>    strategy = AFL.Var(&quot;strategy&quot;)</span></span>
<span class="line"><span>    symbol = AFL.Var(&quot;symbol&quot;)</span></span>
<span class="line"><span>    exchange = AFL.Var(&quot;exchange&quot;)</span></span>
<span class="line"><span>    pricetype = AFL.Var(&quot;pricetype&quot;)</span></span>
<span class="line"><span>    product = AFL.Var(&quot;product&quot;)</span></span>
<span class="line"><span>   </span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &#39; Construct the JSON string for the POST message</span></span>
<span class="line"><span>    Dim jsonRequestBody</span></span>
<span class="line"><span>    jsonRequestBody = &quot;{&quot;&quot;apikey&quot;&quot;:&quot;&quot;&quot; &amp; apikey &amp; _</span></span>
<span class="line"><span>    &quot;&quot;&quot;,&quot;&quot;strategy&quot;&quot;:&quot;&quot;&quot; &amp; strategy &amp; _</span></span>
<span class="line"><span>    &quot;&quot;&quot;,&quot;&quot;symbol&quot;&quot;:&quot;&quot;&quot; &amp; symbol &amp; _</span></span>
<span class="line"><span>    &quot;&quot;&quot;,&quot;&quot;action&quot;&quot;:&quot;&quot;&quot; &amp; action &amp; _</span></span>
<span class="line"><span>    &quot;&quot;&quot;,&quot;&quot;exchange&quot;&quot;:&quot;&quot;&quot; &amp; exchange &amp; _</span></span>
<span class="line"><span>    &quot;&quot;&quot;,&quot;&quot;pricetype&quot;&quot;:&quot;&quot;&quot; &amp; pricetype &amp; _</span></span>
<span class="line"><span>    &quot;&quot;&quot;,&quot;&quot;product&quot;&quot;:&quot;&quot;&quot; &amp; product &amp; _</span></span>
<span class="line"><span>    &quot;&quot;&quot;,&quot;&quot;quantity&quot;&quot;:&quot;&quot;&quot; &amp; quantity &amp; &quot;&quot;&quot;}&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &#39; Set the URL</span></span>
<span class="line"><span>    Dim url</span></span>
<span class="line"><span>    url = AFL.Var(&quot;bridgeurl&quot;)&amp;&quot;/placeorder&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &#39; Configure the HTTP request for POST method</span></span>
<span class="line"><span>    oXMLHTTP.Open &quot;POST&quot;, url, False</span></span>
<span class="line"><span>    oXMLHTTP.setRequestHeader &quot;Content-Type&quot;, &quot;application/json&quot;</span></span>
<span class="line"><span>    oXMLHTTP.setRequestHeader &quot;Cache-Control&quot;, &quot;no-cache&quot;</span></span>
<span class="line"><span>    oXMLHTTP.setRequestHeader &quot;Pragma&quot;, &quot;no-cache&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &#39; Send the request with the JSON body</span></span>
<span class="line"><span>    oXMLHTTP.Send jsonRequestBody</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    api_parameters = &quot;Strategy :&quot; &amp; strategy &amp; &quot; Symbol :&quot; &amp; symbol &amp; &quot; Exchange :&quot; &amp; exchange &amp; _</span></span>
<span class="line"><span>                 &quot; Action :&quot; &amp; action &amp; &quot; Pricetype :&quot; &amp; pricetype &amp; _</span></span>
<span class="line"><span>                 &quot; Product :&quot; &amp; product &amp; &quot; Quantity:&quot; &amp; quantity &amp; _</span></span>
<span class="line"><span>                 &quot; api_url :&quot; &amp; url</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    AFL(&quot;api_request&quot;) = api_parameters  </span></span>
<span class="line"><span>    AFL(&quot;api_response&quot;) = oXMLHTTP.responseText</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &#39; Optionally, handle the response here</span></span>
<span class="line"><span>    &#39; Dim response</span></span>
<span class="line"><span>    &#39; response = oXMLHTTP.responseText</span></span>
<span class="line"><span>    &#39; Response handling code...</span></span>
<span class="line"><span>End Sub</span></span>
<span class="line"><span></span></span>
<span class="line"><span>%&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>tradeboard = GetScriptObject();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//Execution Module</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if(Status(&quot;action&quot;) == actionExplore)</span></span>
<span class="line"><span>//if(Status(&quot;action&quot;) == actionIndicator)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span></span></span>
<span class="line"><span>entryquantity = int(position/close);</span></span>
<span class="line"><span>exitbuyquantity = ValueWhen(Buy ,int(position/close));</span></span>
<span class="line"><span>exitshortquantity = ValueWhen(short ,int(position/close));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>bsr = Buy AND Cover;</span></span>
<span class="line"><span>ssr = Short AND Sell;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>iSignal  = IIf(bsr,&#39;L&#39;,IIf(ssr,&#39;R&#39;,IIf(Buy,&#39;B&#39;,IIf(Sell,&#39;S&#39;,IIf(Short,&#39;S&#39;,&#39;B&#39;)))));</span></span>
<span class="line"><span>Filter = Buy OR Sell OR Short OR Cover;</span></span>
<span class="line"><span>AddTextColumn(symbol,&quot;Trading Symbol&quot;);</span></span>
<span class="line"><span>AddColumn(IIf(Buy,&#39;B&#39;,&#39;-&#39;), &quot;Long Entry&quot;,format=formatChar);</span></span>
<span class="line"><span>AddColumn(IIf(Sell,&#39;X&#39;,&#39;-&#39;), &quot;Long Exit&quot;,format=formatChar);</span></span>
<span class="line"><span>AddColumn(IIf(Short,&#39;S&#39;,&#39;-&#39;), &quot;Short Entry&quot;,format=formatChar);</span></span>
<span class="line"><span>AddColumn(IIf(Cover,&#39;C&#39;,&#39;-&#39;), &quot;Short  Exit&quot;,format=formatChar);</span></span>
<span class="line"><span>AddColumn(IIf(bsr, entryquantity+exitshortquantity,IIf(ssr,entryquantity+exitbuyquantity,IIf(Buy OR Short,entryquantity,IIf(Sell,exitbuyquantity,IIf(Cover,exitshortquantity,Null))))),&quot;Trading Quantity&quot;,1);</span></span>
<span class="line"><span>AddColumn(iSignal, &quot;Signal Value&quot;,format=formatChar);</span></span>
<span class="line"><span>AddColumn(C,&quot;LTP&quot;,1.2);</span></span>
<span class="line"><span>SetSortColumns(2);</span></span>
<span class="line"><span></span></span>
<span class="line"><span> </span></span>
<span class="line"><span></span></span>
<span class="line"><span>//Execution Module</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if(EnableAlgo != &quot;Disable&quot;)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        lasttime = StrFormat(&quot;%0.f&quot;,LastValue(BarIndex()));</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        SetChartBkColor(colorDarkGrey);</span></span>
<span class="line"><span>        if(EnableAlgo == &quot;Enable&quot;)</span></span>
<span class="line"><span>        {   </span></span>
<span class="line"><span>            if (AlgoBuy==True AND AlgoCover == True AND StaticVarGet(static_name_+&quot;buyCoverAlgo&quot;)==0 AND StaticVarGetText(static_name_+&quot;buyCoverAlgo_barvalue&quot;) != lasttime )</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>            // reverse Long Entry </span></span>
<span class="line"><span>				quantity = lastvalue(entryquantity+exitshortquantity);</span></span>
<span class="line"><span>                tradeboard.PlaceOrder(&quot;BUY&quot;,quantity);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>				_TRACE(&quot;API Request : &quot;+api_request);</span></span>
<span class="line"><span>				_TRACE(&quot;API Response : &quot;+api_response);</span></span>
<span class="line"><span>				</span></span>
<span class="line"><span>                StaticVarSetText(static_name_+&quot;buyCoverAlgo_barvalue&quot;,lasttime);  </span></span>
<span class="line"><span>                StaticVarSet(static_name_+&quot;buyCoverAlgo&quot;,1); //Algo Order was triggered, no more order on this bar</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            else if ((AlgoBuy != True OR AlgoCover != True))</span></span>
<span class="line"><span>            {   </span></span>
<span class="line"><span>                StaticVarSet(static_name_+&quot;buyCoverAlgo&quot;,0);</span></span>
<span class="line"><span>                StaticVarSetText(static_name_+&quot;buyCoverAlgo_barvalue&quot;,&quot;&quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            </span></span>
<span class="line"><span>            if (AlgoBuy==True AND AlgoCover != True AND StaticVarGet(static_name_+&quot;buyAlgo&quot;)==0 AND StaticVarGetText(static_name_+&quot;buyAlgo_barvalue&quot;) != lasttime)</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>            // Long Entry </span></span>
<span class="line"><span>				quantity = LastValue(entryquantity);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                tradeboard.PlaceOrder(&quot;BUY&quot;,quantity);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>				_TRACE(&quot;API Request : &quot;+api_request);</span></span>
<span class="line"><span>				_TRACE(&quot;API Response : &quot;+api_response);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                StaticVarSetText(static_name_+&quot;buyAlgo_barvalue&quot;,lasttime); </span></span>
<span class="line"><span>                StaticVarSet(static_name_+&quot;buyAlgo&quot;,1); //Algo Order was triggered, no more order on this bar</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            </span></span>
<span class="line"><span>            else if (AlgoBuy != True)</span></span>
<span class="line"><span>            {   </span></span>
<span class="line"><span>                StaticVarSet(static_name_+&quot;buyAlgo&quot;,0);</span></span>
<span class="line"><span>                StaticVarSetText(static_name_+&quot;buyAlgo_barvalue&quot;,&quot;&quot;);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            if (AlgoSell==true AND AlgoShort != True AND StaticVarGet(static_name_+&quot;sellAlgo&quot;)==0 AND StaticVarGetText(static_name_+&quot;sellAlgo_barvalue&quot;) != lasttime)</span></span>
<span class="line"><span>            {     </span></span>
<span class="line"><span>            // Long Exit </span></span>
<span class="line"><span>				quantity = LastValue(exitbuyquantity);</span></span>
<span class="line"><span>				</span></span>
<span class="line"><span>                tradeboard.PlaceOrder(&quot;SELL&quot;,quantity);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>				_TRACE(&quot;API Request : &quot;+api_request);</span></span>
<span class="line"><span>				_TRACE(&quot;API Response : &quot;+api_response);</span></span>
<span class="line"><span>				</span></span>
<span class="line"><span>                StaticVarSetText(static_name_+&quot;sellAlgo_barvalue&quot;,lasttime);</span></span>
<span class="line"><span>                StaticVarSet(static_name_+&quot;sellAlgo&quot;,1); //Algo Order was triggered, no more order on this bar</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            else if (AlgoSell != True )</span></span>
<span class="line"><span>            {   </span></span>
<span class="line"><span>                StaticVarSet(static_name_+&quot;sellAlgo&quot;,0);</span></span>
<span class="line"><span>                StaticVarSetText(static_name_+&quot;sellAlgo_barvalue&quot;,&quot;&quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            if (AlgoShort==True AND AlgoSell==True AND  StaticVarGet(static_name_+&quot;ShortSellAlgo&quot;)==0 AND StaticVarGetText(static_name_+&quot;ShortSellAlgo_barvalue&quot;) != lasttime)</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>            // reverse Short Entry </span></span>
<span class="line"><span>				quantity = LastValue(exitbuyquantity+entryquantity);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                tradeboard.PlaceOrder(&quot;SELL&quot;,quantity);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>				_TRACE(&quot;API Request : &quot;+api_request);</span></span>
<span class="line"><span>				_TRACE(&quot;API Response : &quot;+api_response);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                StaticVarSetText(static_name_+&quot;ShortsellAlgo_barvalue&quot;,lasttime);</span></span>
<span class="line"><span>                StaticVarSet(static_name_+&quot;ShortSellAlgo&quot;,1); //Algo Order was triggered, no more order on this bar</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            else if ((AlgoShort != True OR AlgoSell != True))</span></span>
<span class="line"><span>            {   </span></span>
<span class="line"><span>                StaticVarSet(static_name_+&quot;ShortSellAlgo&quot;,0);</span></span>
<span class="line"><span>                StaticVarSetText(static_name_+&quot;ShortsellAlgo_barvalue&quot;,&quot;&quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>            if (AlgoShort==True  AND  AlgoSell != True AND StaticVarGet(static_name_+&quot;ShortAlgo&quot;)==0 AND  StaticVarGetText(static_name_+&quot;ShortAlgo_barvalue&quot;) != lasttime)</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>            // Short Entry</span></span>
<span class="line"><span>				quantity = LastValue(entryquantity);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                tradeboard.PlaceOrder(&quot;SELL&quot;,quantity);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>				_TRACE(&quot;API Request : &quot;+api_request);</span></span>
<span class="line"><span>				_TRACE(&quot;API Response : &quot;+api_response);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                StaticVarSetText(static_name_+&quot;ShortAlgo_barvalue&quot;,lasttime); </span></span>
<span class="line"><span>                StaticVarSet(static_name_+&quot;ShortAlgo&quot;,1); //Algo Order was triggered, no more order on this bar</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            else if (AlgoShort != True )</span></span>
<span class="line"><span>            {   </span></span>
<span class="line"><span>                StaticVarSet(static_name_+&quot;ShortAlgo&quot;,0);</span></span>
<span class="line"><span>                StaticVarSetText(static_name_+&quot;ShortAlgo_barvalue&quot;,&quot;&quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            if (AlgoCover==true AND AlgoBuy != True AND StaticVarGet(static_name_+&quot;CoverAlgo&quot;)==0 AND StaticVarGetText(static_name_+&quot;CoverAlgo_barvalue&quot;) != lasttime)</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>            // Short Exit</span></span>
<span class="line"><span>				quantity = LastValue(exitshortquantity);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                tradeboard.PlaceOrder(&quot;BUY&quot;,quantity);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>				_TRACE(&quot;API Request : &quot;+api_request);</span></span>
<span class="line"><span>				_TRACE(&quot;API Response : &quot;+api_response);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                StaticVarSetText(static_name_+&quot;CoverAlgo_barvalue&quot;,lasttime); </span></span>
<span class="line"><span>                StaticVarSet(static_name_+&quot;CoverAlgo&quot;,1); //Algo Order was triggered, no more order on this bar</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            else if (AlgoCover != True )</span></span>
<span class="line"><span>            {   </span></span>
<span class="line"><span>                StaticVarSet(static_name_+&quot;CoverAlgo&quot;,0);</span></span>
<span class="line"><span>                StaticVarSetText(static_name_+&quot;CoverAlgo_barvalue&quot;,&quot;&quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>           else if(EnableAlgo == &quot;LongOnly&quot;)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            </span></span>
<span class="line"><span>            if (AlgoBuy==True AND StaticVarGet(static_name_+&quot;buyAlgo&quot;)==0 AND StaticVarGetText(static_name_+&quot;buyAlgo_barvalue&quot;) != lasttime)</span></span>
<span class="line"><span>            {  </span></span>
<span class="line"><span>            //  Long Entry</span></span>
<span class="line"><span>				quantity = LastValue(entryquantity);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                tradeboard.PlaceOrder(&quot;BUY&quot;,quantity);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>				_TRACE(&quot;API Request : &quot;+api_request);</span></span>
<span class="line"><span>				_TRACE(&quot;API Response : &quot;+api_response);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                StaticVarSetText(static_name_+&quot;buyAlgo_barvalue&quot;,lasttime);</span></span>
<span class="line"><span>                StaticVarSet(static_name_+&quot;buyAlgo&quot;,1); //Algo Order was triggered, no more order on this bar</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            else if (AlgoBuy != True)</span></span>
<span class="line"><span>            {   </span></span>
<span class="line"><span>                StaticVarSet(static_name_+&quot;buyAlgo&quot;,0);</span></span>
<span class="line"><span>                StaticVarSetText(static_name_+&quot;buyAlgo_barvalue&quot;,&quot;&quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            if (AlgoSell==true AND StaticVarGet(static_name_+&quot;sellAlgo&quot;)==0 AND StaticVarGetText(static_name_+&quot;sellAlgo_barvalue&quot;) != lasttime)</span></span>
<span class="line"><span>            {  </span></span>
<span class="line"><span>            // Long Exit</span></span>
<span class="line"><span>				quantity = LastValue(exitbuyquantity);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                tradeboard.PlaceOrder(&quot;SELL&quot;,quantity);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>				_TRACE(&quot;API Request : &quot;+api_request);</span></span>
<span class="line"><span>				_TRACE(&quot;API Response : &quot;+api_response);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                StaticVarSetText(static_name_+&quot;sellAlgo_barvalue&quot;,lasttime);</span></span>
<span class="line"><span>                StaticVarSet(static_name_+&quot;sellAlgo&quot;,1); //Algo Order was triggered, no more order on this bar</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            else if (AlgoSell != True )</span></span>
<span class="line"><span>            {   </span></span>
<span class="line"><span>                StaticVarSet(static_name_+&quot;sellAlgo&quot;,0);</span></span>
<span class="line"><span>                StaticVarSetText(static_name_+&quot;sellAlgo_barvalue&quot;,&quot;&quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        else if(EnableAlgo == &quot;ShortOnly&quot;)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            if (AlgoShort==True AND StaticVarGet(static_name_+&quot;ShortAlgo&quot;)==0 AND StaticVarGetText(static_name_+&quot;ShortAlgo_barvalue&quot;) != lasttime)</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>            // Short Entry</span></span>
<span class="line"><span>				quantity = LastValue(entryquantity);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                tradeboard.PlaceOrder(&quot;SELL&quot;,quantity);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>				_TRACE(&quot;API Request : &quot;+api_request);</span></span>
<span class="line"><span>				_TRACE(&quot;API Response : &quot;+api_response);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                StaticVarSetText(static_name_+&quot;ShortAlgo_barvalue&quot;,lasttime); </span></span>
<span class="line"><span>                StaticVarSet(static_name_+&quot;ShortAlgo&quot;,1); //Algo Order was triggered, no more order on this bar</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            else if (AlgoShort != True )</span></span>
<span class="line"><span>            {   </span></span>
<span class="line"><span>                StaticVarSet(static_name_+&quot;ShortAlgo&quot;,0);</span></span>
<span class="line"><span>                StaticVarSetText(static_name_+&quot;ShortAlgo_barvalue&quot;,&quot;&quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            if (AlgoCover==true AND StaticVarGet(static_name_+&quot;CoverAlgo&quot;)==0 AND StaticVarGetText(static_name_+&quot;CoverAlgo_barvalue&quot;) != lasttime)</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>            // Short Exit</span></span>
<span class="line"><span>				quantity = LastValue(exitshortquantity);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                tradeboard.PlaceOrder(&quot;BUY&quot;,quantity);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>				_TRACE(&quot;API Request : &quot;+api_request);</span></span>
<span class="line"><span>				_TRACE(&quot;API Response : &quot;+api_response);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                StaticVarSetText(static_name_+&quot;CoverAlgo_barvalue&quot;,lasttime); </span></span>
<span class="line"><span>                StaticVarSet(static_name_+&quot;CoverAlgo&quot;,1); //Algo Order was triggered, no more order on this bar</span></span>
<span class="line"><span>                _TRACE(&quot;Strategy : &quot;+ strategy +&quot;AlgoStatus : &quot;+ EnableAlgo +&quot;Chart Symbol : &quot;+ Name() +&quot;  Trading Symbol : &quot;+  symbol +&quot;  Quantity : &quot;+ quantity +&quot;  Signal : Cover Signal  TimeFrame : &quot;+ Interval(2)+&quot;  Response : &quot;+ resp +&quot;  ChardId : &quot;+ GetChartID() + &quot; Latest Price : &quot;+LastValue(C));</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            else if (AlgoCover != True)</span></span>
<span class="line"><span>            {   </span></span>
<span class="line"><span>                StaticVarSet(static_name_+&quot;CoverAlgo&quot;,0);</span></span>
<span class="line"><span>                StaticVarSetText(static_name_+&quot;CoverAlgo_barvalue&quot;,&quot;&quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    }//end main if</span></span>
<span class="line"><span></span></span>
<span class="line"><span>} </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>_SECTION_END();</span></span></code></pre></div>`,5)])])}const _=n(l,[["render",e]]);export{S as __pageData,_ as default};
