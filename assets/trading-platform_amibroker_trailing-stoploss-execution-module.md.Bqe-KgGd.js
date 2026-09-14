import{_ as n,o as a,c as p,a2 as t}from"./chunks/framework.BXzK3EA4.js";const d=JSON.parse('{"title":"Trailing Stoploss Execution Module","description":"","frontmatter":{},"headers":[],"relativePath":"trading-platform/amibroker/trailing-stoploss-execution-module.md","filePath":"trading-platform/amibroker/trailing-stoploss-execution-module.md"}'),e={name:"trading-platform/amibroker/trailing-stoploss-execution-module.md"};function l(o,s,i,u,r,c){return a(),p("div",null,[...s[0]||(s[0]=[t(`<h1 id="trailing-stoploss-execution-module" tabindex="-1">Trailing Stoploss Execution Module <a class="header-anchor" href="#trailing-stoploss-execution-module" aria-label="Permalink to &quot;Trailing Stoploss Execution Module&quot;">​</a></h1><h2 id="internet-function-method" tabindex="-1">Internet Function Method <a class="header-anchor" href="#internet-function-method" aria-label="Permalink to &quot;Internet Function Method&quot;">​</a></h2><div class="language-clike vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">clike</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// Rajeev Upadhyay - Creator of Tradeboard</span></span>
<span class="line"><span>// Website - tradeboard.in / marketcalls.in</span></span>
<span class="line"><span>// Tradeboard - Amibroker Trailing Stoploss Execution Module</span></span>
<span class="line"><span>// Date - 13/12/2024</span></span>
<span class="line"><span></span></span>
<span class="line"><span>_SECTION_BEGIN(&quot;Tradeboard Trailing Stoploss Execution Module&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Initial setup and parameters</span></span>
<span class="line"><span>RequestTimedRefresh(1, False);</span></span>
<span class="line"><span>EnableTextOutput(False);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Tradeboard Configuration Parameters</span></span>
<span class="line"><span>apikey = ParamStr(&quot;Tradeboard API Key&quot;, &quot;******&quot;);</span></span>
<span class="line"><span>strategy = ParamStr(&quot;Strategy&quot;, &quot;TSL_Strategy&quot;);</span></span>
<span class="line"><span>symbol = ParamStr(&quot;Symbol&quot;, &quot;YESBANK&quot;);</span></span>
<span class="line"><span>exchange = ParamList(&quot;Exchange&quot;, &quot;NSE|NFO|BSE|MCX|CDS&quot;);</span></span>
<span class="line"><span>product = ParamList(&quot;Product&quot;, &quot;MIS|NRML|CNC&quot;);</span></span>
<span class="line"><span>quantity = Param(&quot;Quantity&quot;, 1, 1, 1000, 1);</span></span>
<span class="line"><span>host = ParamStr(&quot;Host&quot;, &quot;http://127.0.0.1:5000&quot;);</span></span>
<span class="line"><span>ver = ParamStr(&quot;API Version&quot;, &quot;v1&quot;);</span></span>
<span class="line"><span>VoiceAlert = ParamList(&quot;Voice Alert&quot;, &quot;Disable|Enable&quot;, 1);</span></span>
<span class="line"><span>EnableAlgo = ParamList(&quot;Algo Mode&quot;, &quot;Disable|Enable&quot;, 0);</span></span>
<span class="line"><span>TestMode = ParamList(&quot;Test Mode&quot;, &quot;Disable|Enable&quot;, 0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// TSL Specific Parameters</span></span>
<span class="line"><span>StopLevel = 1 - Param(&quot;Trailing Stop %&quot;, 3, 0.1, 10, 0.1)/100;</span></span>
<span class="line"><span>Order_TickSize = Param(&quot;Order Tick Size&quot;, 1, 0.01, 1, 0.01);</span></span>
<span class="line"><span>Entrydelay = Param(&quot;Entry Delay&quot;, 0, 0, 1, 1);</span></span>
<span class="line"><span>Exitdelay = Param(&quot;Exit Delay&quot;, 0, 0, 1, 1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>reset = ParamTrigger(&quot;Memory Reset&quot;,&quot;Reset Now&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Function to round price to nearest tick size</span></span>
<span class="line"><span>function RoundToTickSize(price, tickSize) {</span></span>
<span class="line"><span>    return Floor(price/tickSize + 0.5) * tickSize;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Initialize static variables</span></span>
<span class="line"><span>bridgeurl = host + &quot;/api/&quot; + ver;</span></span>
<span class="line"><span>static_name_ = Name() + GetChartID() + interval(2) + strategy;</span></span>
<span class="line"><span>static_name_algo = static_name_ + interval(2) + strategy + &quot;algostatus&quot;;</span></span>
<span class="line"><span>static_name_tsl = static_name_ + &quot;_tsl&quot;;</span></span>
<span class="line"><span>static_name_orderid = static_name_ + &quot;_orderid&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if(reset)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span></span></span>
<span class="line"><span>StaticVarRemove(static_name_+&quot;_tsl&quot;);</span></span>
<span class="line"><span>StaticVarRemove(static_name_+&quot;_orderid&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// HTTP Post Request Function</span></span>
<span class="line"><span>function HttpPostRequest(url, postData) {</span></span>
<span class="line"><span>    headers = &quot;Content-Type: application/json\\r\\n&quot; +</span></span>
<span class="line"><span>              &quot;Accept-Encoding: gzip, deflate\\r\\n&quot;;</span></span>
<span class="line"><span>    InternetSetHeaders(headers);</span></span>
<span class="line"><span>    ih = InternetPostRequest(url, postData);</span></span>
<span class="line"><span>    response = &quot;&quot;;</span></span>
<span class="line"><span>    if(ih) {</span></span>
<span class="line"><span>        while((line = InternetReadString(ih)) != &quot;&quot;) </span></span>
<span class="line"><span>            response += line;</span></span>
<span class="line"><span>        InternetClose(ih);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return response;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// JSON Value Extraction Function</span></span>
<span class="line"><span>function ExtractJsonValue(jsonStr, key, isNested) {</span></span>
<span class="line"><span>    result = &quot;&quot;;</span></span>
<span class="line"><span>    jsonData = jsonStr;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if(isNested) {</span></span>
<span class="line"><span>        dataStart = StrFind(jsonStr, &quot;\\&quot;data\\&quot;:{&quot;);</span></span>
<span class="line"><span>        if(dataStart &gt; 0) dataStart = dataStart - 1;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        if(dataStart &gt;= 0) {</span></span>
<span class="line"><span>            valueStart = dataStart + 7;</span></span>
<span class="line"><span>            valueEnd = valueStart;</span></span>
<span class="line"><span>            braceCount = 1;</span></span>
<span class="line"><span>            strLenJson = StrLen(jsonStr);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            while(valueEnd &lt; strLenJson) {</span></span>
<span class="line"><span>                currChar = StrMid(jsonStr, valueEnd, 1);</span></span>
<span class="line"><span>                if(currChar == &quot;{&quot;) braceCount++;</span></span>
<span class="line"><span>                if(currChar == &quot;}&quot;) braceCount--;</span></span>
<span class="line"><span>                if(braceCount == 0) break;</span></span>
<span class="line"><span>                valueEnd++;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            </span></span>
<span class="line"><span>            jsonData = StrMid(jsonStr, valueStart, valueEnd - valueStart);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    keyPos = StrFind(jsonData, &quot;\\&quot;&quot; + key + &quot;\\&quot;:&quot;);</span></span>
<span class="line"><span>    if(keyPos &gt; 0) keyPos = keyPos - 1;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    if(keyPos &gt; -1) {</span></span>
<span class="line"><span>        valueStart = keyPos + StrLen(key) + 3;</span></span>
<span class="line"><span>        while(StrMid(jsonData, valueStart, 1) == &quot; &quot;) valueStart++;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        firstValChar = StrMid(jsonData, valueStart, 1);</span></span>
<span class="line"><span>        isQuoted = (firstValChar == &quot;\\&quot;&quot;);</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        strLenData = StrLen(jsonData);</span></span>
<span class="line"><span>        valueEnd = valueStart;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        if(isQuoted) {</span></span>
<span class="line"><span>            valueStart++;</span></span>
<span class="line"><span>            valueEnd = valueStart;</span></span>
<span class="line"><span>            while(valueEnd &lt; strLenData) {</span></span>
<span class="line"><span>                currChar = StrMid(jsonData, valueEnd, 1);</span></span>
<span class="line"><span>                if(currChar == &quot;\\&quot;&quot;) break; </span></span>
<span class="line"><span>                valueEnd++;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            result = StrMid(jsonData, valueStart, valueEnd - valueStart);</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            while(valueEnd &lt; strLenData) {</span></span>
<span class="line"><span>                currChar = StrMid(jsonData, valueEnd, 1);</span></span>
<span class="line"><span>                if(currChar == &quot;,&quot; OR currChar == &quot;}&quot;) break;</span></span>
<span class="line"><span>                valueEnd++;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            result = StrMid(jsonData, valueStart, valueEnd - valueStart);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    return result;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Order Management Functions</span></span>
<span class="line"><span>function PlaceStopLossMarketOrder(action, triggerPrice) {</span></span>
<span class="line"><span>    postData = &quot;{\\&quot;apikey\\&quot;: \\&quot;&quot; + apikey + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>               &quot;\\&quot;strategy\\&quot;: \\&quot;&quot; + strategy + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>               &quot;\\&quot;symbol\\&quot;: \\&quot;&quot; + symbol + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>               &quot;\\&quot;action\\&quot;: \\&quot;&quot; + action + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>               &quot;\\&quot;exchange\\&quot;: \\&quot;&quot; + exchange + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>               &quot;\\&quot;pricetype\\&quot;: \\&quot;SL-M\\&quot;, &quot; +</span></span>
<span class="line"><span>               &quot;\\&quot;price\\&quot;: \\&quot;0\\&quot;, &quot; +</span><span>  // Price is 0 for SL-M orders</span></span>
<span class="line"><span>               &quot;\\&quot;trigger_price\\&quot;: \\&quot;&quot; + triggerPrice + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>               &quot;\\&quot;product\\&quot;: \\&quot;&quot; + product + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>               &quot;\\&quot;quantity\\&quot;: \\&quot;&quot; + quantity + &quot;\\&quot;}&quot;;</span></span>
<span class="line"><span>    _TRACE(&quot;SL-M Order Request: &quot; + postData);</span></span>
<span class="line"><span>    response = HttpPostRequest(bridgeurl + &quot;/placeorder&quot;, postData);</span></span>
<span class="line"><span>    _TRACE(&quot;SL-M Order Response: &quot; + response);</span></span>
<span class="line"><span>    return response;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function CheckOrderStatus(orderid) {</span></span>
<span class="line"><span>    postData = &quot;{\\&quot;apikey\\&quot;: \\&quot;&quot; + apikey + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>               &quot;\\&quot;strategy\\&quot;: \\&quot;&quot; + strategy + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>               &quot;\\&quot;orderid\\&quot;: \\&quot;&quot; + orderid + &quot;\\&quot;}&quot;;</span></span>
<span class="line"><span>    response = HttpPostRequest(bridgeurl + &quot;/orderstatus&quot;, postData);</span></span>
<span class="line"><span>    _TRACE(&quot;Order Status Check for OrderID &quot; + orderid + &quot; Response: &quot; + response);</span></span>
<span class="line"><span>    return response;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function ModifyStopLossMarketOrder(orderid, triggerPrice) {</span></span>
<span class="line"><span>    postData = &quot;{\\&quot;apikey\\&quot;: \\&quot;&quot; + apikey + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>               &quot;\\&quot;strategy\\&quot;: \\&quot;&quot; + strategy + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>               &quot;\\&quot;symbol\\&quot;: \\&quot;&quot; + symbol + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>               &quot;\\&quot;action\\&quot;: \\&quot;SELL\\&quot;, &quot; +</span><span>  // Added action field</span></span>
<span class="line"><span>               &quot;\\&quot;exchange\\&quot;: \\&quot;&quot; + exchange + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>               &quot;\\&quot;orderid\\&quot;: \\&quot;&quot; + orderid + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>               &quot;\\&quot;product\\&quot;: \\&quot;&quot; + product + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>               &quot;\\&quot;pricetype\\&quot;: \\&quot;SL-M\\&quot;, &quot; +</span></span>
<span class="line"><span>               &quot;\\&quot;price\\&quot;: \\&quot;0\\&quot;, &quot; +</span><span>  // Price is 0 for SL-M orders</span></span>
<span class="line"><span>               &quot;\\&quot;trigger_price\\&quot;: \\&quot;&quot; + triggerPrice + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>               &quot;\\&quot;quantity\\&quot;: \\&quot;&quot; + quantity + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>               &quot;\\&quot;disclosed_quantity\\&quot;: \\&quot;0\\&quot;}&quot;;</span><span>  // Added disclosed_quantity field</span></span>
<span class="line"><span>    _TRACE(&quot;Modify SL-M Order Request for OrderID &quot; + orderid + &quot;: &quot; + postData);</span></span>
<span class="line"><span>    response = HttpPostRequest(bridgeurl + &quot;/modifyorder&quot;, postData);</span></span>
<span class="line"><span>    _TRACE(&quot;Modify SL-M Order Response: &quot; + response);</span></span>
<span class="line"><span>    return response;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function PlaceMarketEntry(action) {</span></span>
<span class="line"><span>    postData = &quot;{\\&quot;apikey\\&quot;: \\&quot;&quot; + apikey + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>               &quot;\\&quot;strategy\\&quot;: \\&quot;&quot; + strategy + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>               &quot;\\&quot;symbol\\&quot;: \\&quot;&quot; + symbol + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>               &quot;\\&quot;action\\&quot;: \\&quot;&quot; + action + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>               &quot;\\&quot;exchange\\&quot;: \\&quot;&quot; + exchange + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>               &quot;\\&quot;pricetype\\&quot;: \\&quot;MARKET\\&quot;, &quot; +</span></span>
<span class="line"><span>               &quot;\\&quot;product\\&quot;: \\&quot;&quot; + product + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>               &quot;\\&quot;quantity\\&quot;: \\&quot;&quot; + quantity + &quot;\\&quot;}&quot;;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    _TRACE(&quot;Market Entry Order Request: &quot; + postData);</span></span>
<span class="line"><span>    response = HttpPostRequest(bridgeurl + &quot;/placeorder&quot;, postData);</span></span>
<span class="line"><span>    _TRACE(&quot;Market Entry Order Response: &quot; + response);</span></span>
<span class="line"><span>    return response;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Trading signals</span></span>
<span class="line"><span>Buy = Cross(MACD(), Signal());</span></span>
<span class="line"><span>Sell = 0;</span></span>
<span class="line"><span>trailARRAY = Null;</span></span>
<span class="line"><span>trailstop = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Calculate Trailing Stop Level</span></span>
<span class="line"><span>for(i = 1; i &lt; BarCount; i++) {</span></span>
<span class="line"><span>    if(trailstop == 0 AND Buy[i]) { </span></span>
<span class="line"><span>        trailstop = High[i] * StopLevel;</span></span>
<span class="line"><span>        //_TRACE(&quot;New TSL Level calculated: &quot; + trailstop);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    else Buy[i] = 0;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    if(trailstop &gt; 0 AND Low[i] &lt; trailstop) {</span></span>
<span class="line"><span>        Sell[i] = 1;</span></span>
<span class="line"><span>        SellPrice[i] = trailstop;</span></span>
<span class="line"><span>        //_TRACE(&quot;TSL Hit - Sell Signal Generated at: &quot; + trailstop);</span></span>
<span class="line"><span>        trailstop = 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    if(trailstop &gt; 0) {</span></span>
<span class="line"><span>        newTSL = Max(High[i] * StopLevel, trailstop);</span></span>
<span class="line"><span>        if(newTSL != trailstop) {</span></span>
<span class="line"><span>            //_TRACE(&quot;TSL Level Updated from &quot; + trailstop + &quot; to &quot; + newTSL);</span></span>
<span class="line"><span>            trailstop = newTSL;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        trailARRAY[i] = trailstop;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Execution Logic</span></span>
<span class="line"><span>AlgoBuy = LastValue(Ref(Buy, -Entrydelay));</span></span>
<span class="line"><span>AlgoSell = LastValue(Ref(Sell, -Exitdelay));</span></span>
<span class="line"><span>currentTSL = RoundToTickSize(LastValue(trailARRAY), Order_TickSize);</span></span>
<span class="line"><span>//_TRACE(&quot;Raw TSL: &quot; + LastValue(trailARRAY) + &quot;, Rounded to tick size: &quot; + currentTSL);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if(EnableAlgo == &quot;Enable&quot;) {</span></span>
<span class="line"><span>    // Print current stored OrderID</span></span>
<span class="line"><span>    printf(&quot;\\nAlgo Mode Enabled&quot;);</span></span>
<span class="line"><span>    storedOrderId = StaticVarGetText(static_name_orderid);</span></span>
<span class="line"><span>    printf(&quot;\\nCurrent Stored OrderID: &quot; + storedOrderId);</span></span>
<span class="line"><span>    printf(&quot;\\nCurrent TSL: &quot; + currentTSL);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // Entry Logic</span></span>
<span class="line"><span>    if(AlgoBuy AND Nz(StaticVarGet(static_name_ + &quot;entryAlgo&quot;)) == 0) {</span></span>
<span class="line"><span>        _TRACE(&quot;Buy Signal Detected - Executing Market Entry&quot;);</span></span>
<span class="line"><span>        entryResponse = PlaceMarketEntry(&quot;BUY&quot;);</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        if(entryResponse != &quot;&quot;) {</span></span>
<span class="line"><span>            _TRACE(&quot;Entry Order Executed Successfully&quot;);</span></span>
<span class="line"><span>            if(currentTSL &gt; 0) {</span></span>
<span class="line"><span>                _TRACE(&quot;Placing Initial TSL SL-M Order at trigger: &quot; + currentTSL);</span></span>
<span class="line"><span>                tslResponse = PlaceStopLossMarketOrder(&quot;SELL&quot;, currentTSL);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                if(tslResponse != &quot;&quot;) {</span></span>
<span class="line"><span>                    orderid = ExtractJsonValue(tslResponse, &quot;orderid&quot;, False);</span></span>
<span class="line"><span>                    if(orderid != &quot;&quot;) {</span></span>
<span class="line"><span>                        StaticVarSetText(static_name_orderid, orderid);</span></span>
<span class="line"><span>                        StaticVarSet(static_name_tsl, currentTSL);</span></span>
<span class="line"><span>                        _TRACE(&quot;New TSL OrderID Stored: &quot; + orderid);</span></span>
<span class="line"><span>                        if(VoiceAlert == &quot;Enable&quot;) Say(&quot;Entry and TSL Orders Placed&quot;);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            StaticVarSet(static_name_ + &quot;entryAlgo&quot;, 1);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // TSL Modification Logic</span></span>
<span class="line"><span>    if(currentTSL &gt; 0 AND currentTSL != StaticVarGet(static_name_tsl)) {</span></span>
<span class="line"><span>        orderid = StaticVarGetText(static_name_orderid);</span></span>
<span class="line"><span>        _TRACE(&quot;Checking TSL Order: &quot; + orderid);</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        if(orderid != &quot;&quot;) {</span></span>
<span class="line"><span>            statusResponse = CheckOrderStatus(orderid);</span></span>
<span class="line"><span>            if(statusResponse != &quot;&quot;) {</span></span>
<span class="line"><span>                orderStatus = ExtractJsonValue(statusResponse, &quot;order_status&quot;, True);</span></span>
<span class="line"><span>                _TRACE(&quot;Current TSL Order Status: &quot; + orderStatus);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                if(orderStatus == &quot;open&quot;) {</span></span>
<span class="line"><span>                    _TRACE(&quot;Modifying SL-M Order &quot; + orderid + &quot; trigger from &quot; + StaticVarGet(static_name_tsl) + &quot; to &quot; + currentTSL);</span></span>
<span class="line"><span>                    modifyResponse = ModifyStopLossMarketOrder(orderid, currentTSL);</span></span>
<span class="line"><span>                    if(modifyResponse != &quot;&quot;) {</span></span>
<span class="line"><span>                        StaticVarSet(static_name_tsl, currentTSL);</span></span>
<span class="line"><span>                        _TRACE(&quot;TSL Order Modified Successfully&quot;);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // Exit Logic</span></span>
<span class="line"><span>    if(AlgoSell AND Nz(StaticVarGet(static_name_ + &quot;exitAlgo&quot;)) == 0) {</span></span>
<span class="line"><span>        orderid = StaticVarGetText(static_name_orderid);</span></span>
<span class="line"><span>        _TRACE(&quot;TSL Hit - Checking Order: &quot; + orderid);</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        if(orderid != &quot;&quot;) {</span></span>
<span class="line"><span>            statusResponse = CheckOrderStatus(orderid);</span></span>
<span class="line"><span>            if(statusResponse != &quot;&quot;) {</span></span>
<span class="line"><span>                orderStatus = ExtractJsonValue(statusResponse, &quot;order_status&quot;, True);</span></span>
<span class="line"><span>                _TRACE(&quot;TSL Hit - Order Status: &quot; + orderStatus);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                if(orderStatus == &quot;complete&quot;) {</span></span>
<span class="line"><span>                    _TRACE(&quot;TSL Order &quot; + orderid + &quot; Executed Successfully&quot;);</span></span>
<span class="line"><span>                    if(VoiceAlert == &quot;Enable&quot;) Say(&quot;Trailing Stop Loss Hit&quot;);</span></span>
<span class="line"><span>                    StaticVarSet(static_name_ + &quot;exitAlgo&quot;, 1);</span></span>
<span class="line"><span>                    // Clear the stored OrderID</span></span>
<span class="line"><span>                    StaticVarSetText(static_name_orderid, &quot;&quot;);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Plot(trailARRAY, &quot;Trailing Stop Level&quot;, colorRed);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>_SECTION_END();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>_SECTION_BEGIN(&quot;Trading Signals&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//Plot the trading signals</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/* Plot Buy and Sell Signal Arrows */</span></span>
<span class="line"><span>PlotShapes(IIf(Buy, shapeSquare, shapeNone),colorGreen, 0, L, Offset=-40);</span></span>
<span class="line"><span>PlotShapes(IIf(Buy, shapeSquare, shapeNone),colorLime, 0,L, Offset=-50);                      </span></span>
<span class="line"><span>PlotShapes(IIf(Buy, shapeUpArrow, shapeNone),colorWhite, 0,L, Offset=-45); </span></span>
<span class="line"><span>PlotShapes(IIf(Sell, shapeSquare, shapeNone),colorRed, 0, H, Offset=40);</span></span>
<span class="line"><span>PlotShapes(IIf(Sell, shapeSquare, shapeNone),colorOrange, 0,H, Offset=50);                      </span></span>
<span class="line"><span>PlotShapes(IIf(Sell, shapeDownArrow, shapeNone),colorWhite, 0,H, Offset=-45);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>_SECTION_END();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>_SECTION_BEGIN(&quot;Candlestick Charts with Date &amp; Time Axis&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//Enable the Date &amp; Time Axis</span></span>
<span class="line"><span>SetChartOptions(0, chartShowArrows | chartShowDates);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//Plotting Candlestick charts</span></span>
<span class="line"><span>Plot(Close,&quot;Candle&quot;,colorDefault,styleCandle);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>_SECTION_END();</span></span></code></pre></div>`,3)])])}const S=n(e,[["render",l]]);export{d as __pageData,S as default};
