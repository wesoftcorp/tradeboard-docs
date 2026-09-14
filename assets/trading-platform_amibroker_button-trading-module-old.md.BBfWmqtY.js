import{_ as n,o as a,c as p,a2 as t}from"./chunks/framework.BXzK3EA4.js";const d=JSON.parse('{"title":"Button Trading Module","description":"","frontmatter":{},"headers":[],"relativePath":"trading-platform/amibroker/button-trading-module-old.md","filePath":"trading-platform/amibroker/button-trading-module-old.md"}'),e={name:"trading-platform/amibroker/button-trading-module-old.md"};function l(o,s,i,u,c,q){return a(),p("div",null,[...s[0]||(s[0]=[t(`<h1 id="button-trading-module" tabindex="-1">Button Trading Module <a class="header-anchor" href="#button-trading-module" aria-label="Permalink to &quot;Button Trading Module&quot;">​</a></h1><h2 id="internet-functions-method-modern" tabindex="-1">Internet Functions Method (Modern) <a class="header-anchor" href="#internet-functions-method-modern" aria-label="Permalink to &quot;Internet Functions Method (Modern)&quot;">​</a></h2><div class="language-clike vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">clike</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//Rajeev Upadhyay - Creator of Tradeboard</span></span>
<span class="line"><span>//website - tradeboard.in / marketcalls.in</span></span>
<span class="line"><span>//Tradeboard - Amibroker Button Trading Module v1.0</span></span>
<span class="line"><span>//Date - 10/12/2024</span></span>
<span class="line"><span></span></span>
<span class="line"><span>_SECTION_BEGIN(&quot;Tradeboard Button Trading - Modern Internet Functions&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>amiversion = Version();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>RequestTimedRefresh(1, False);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Define parameter controls</span></span>
<span class="line"><span>apikey = ParamStr(&quot;Tradeboard API Key&quot;, &quot;******&quot;);</span></span>
<span class="line"><span>strategy = ParamStr(&quot;Strategy&quot;, &quot;Amibroker&quot;);</span></span>
<span class="line"><span>symbol = ParamStr(&quot;Symbol&quot;, &quot;RELIANCE&quot;);</span></span>
<span class="line"><span>exchange = ParamList(&quot;Exchange&quot;, &quot;NSE|NFO|BSE|MCX|CDS&quot;);</span></span>
<span class="line"><span>pricetype = ParamStr(&quot;Price Type&quot;, &quot;MARKET&quot;);</span></span>
<span class="line"><span>product = ParamList(&quot;Product&quot;, &quot;MIS|NRML|CNC&quot;);</span></span>
<span class="line"><span>quantity = Param(&quot;Quantity&quot;, 1, 1, 1000, 1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>host = ParamStr(&quot;Host&quot;, &quot;http://127.0.0.1:5000&quot;);</span></span>
<span class="line"><span>ver = ParamStr(&quot;API Version&quot;, &quot;v1&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>VoiceAlert = ParamList(&quot;Voice Alert&quot;, &quot;Disable|Enable&quot;, 1);</span></span>
<span class="line"><span>EnableAlgo = ParamList(&quot;Algo Mode&quot;, &quot;Disable|Enable&quot;, 0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Construct URL base</span></span>
<span class="line"><span>bridgeurl = host + &quot;/api/&quot; + ver;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Static variable for Algo status</span></span>
<span class="line"><span>static_name_algo = Name() + GetChartID() + interval(2) + strategy + &quot;_algostatus&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Function to Place Order</span></span>
<span class="line"><span>function PlaceOrder(action, quantity)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    postData = </span></span>
<span class="line"><span>    &quot;{\\&quot;apikey\\&quot;: \\&quot;&quot; + apikey + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>    &quot;\\&quot;strategy\\&quot;: \\&quot;&quot; + strategy + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>    &quot;\\&quot;symbol\\&quot;: \\&quot;&quot; + symbol + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>    &quot;\\&quot;action\\&quot;: \\&quot;&quot; + action + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>    &quot;\\&quot;exchange\\&quot;: \\&quot;&quot; + exchange + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>    &quot;\\&quot;pricetype\\&quot;: \\&quot;&quot; + pricetype + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>    &quot;\\&quot;product\\&quot;: \\&quot;&quot; + product + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>    &quot;\\&quot;quantity\\&quot;: \\&quot;&quot; + quantity + &quot;\\&quot;}&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    headers = &quot;Content-Type: application/json\\r\\n&quot; +</span></span>
<span class="line"><span>              &quot;Accept-Encoding: gzip, deflate\\r\\n&quot;;</span></span>
<span class="line"><span>    InternetSetHeaders(headers);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    _TRACE(&quot;Request Sent: &quot; + postData); // Log request</span></span>
<span class="line"><span>    ih = InternetPostRequest(bridgeurl + &quot;/placeorder&quot;, postData);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (ih)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        response = &quot;&quot;;</span></span>
<span class="line"><span>        while ((line = InternetReadString(ih)) != &quot;&quot;)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            response += line;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        _TRACEF(&quot;Order Response: %s&quot;, response);</span></span>
<span class="line"><span>        if (VoiceAlert == &quot;Enable&quot;) Say(action + &quot; Order Placed.&quot;);</span></span>
<span class="line"><span>        InternetClose(ih);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    else</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        _TRACE(&quot;Failed to place order.&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Function to Square Off All Positions</span></span>
<span class="line"><span>function SquareOffAll()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    postData = &quot;{\\&quot;apikey\\&quot;: \\&quot;&quot; + apikey + &quot;\\&quot;, \\&quot;strategy\\&quot;: \\&quot;&quot; + strategy + &quot;\\&quot;}&quot;;</span></span>
<span class="line"><span>    headers = &quot;Content-Type: application/json\\r\\n&quot; +</span></span>
<span class="line"><span>              &quot;Accept-Encoding: gzip, deflate\\r\\n&quot;;</span></span>
<span class="line"><span>    InternetSetHeaders(headers);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    _TRACE(&quot;Request Sent: &quot; + postData); // Log request</span></span>
<span class="line"><span>    ih = InternetPostRequest(bridgeurl + &quot;/closeposition&quot;, postData);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (ih)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        response = &quot;&quot;;</span></span>
<span class="line"><span>        while ((line = InternetReadString(ih)) != &quot;&quot;)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            response += line;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        _TRACEF(&quot;Square Off Response: %s&quot;, response);</span></span>
<span class="line"><span>        if (VoiceAlert == &quot;Enable&quot;) Say(&quot;All positions squared off.&quot;);</span></span>
<span class="line"><span>        InternetClose(ih);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    else</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        _TRACE(&quot;Failed to square off positions.&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Button Trading Implementation</span></span>
<span class="line"><span>X0 = 20;</span></span>
<span class="line"><span>Y0 = 100;</span></span>
<span class="line"><span>X1 = 60;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>LBClick = GetCursorMouseButtons() == 9;</span></span>
<span class="line"><span>MouseX = Nz(GetCursorXPosition(1));</span></span>
<span class="line"><span>MouseY = Nz(GetCursorYPosition(1));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Procedure to Draw Button</span></span>
<span class="line"><span>procedure DrawButton(Text, x1, y1, x2, y2, colorFrom, colorTo)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    GfxSetOverlayMode(0);</span></span>
<span class="line"><span>    GfxSelectFont(&quot;Verdana&quot;, 9, 700);</span></span>
<span class="line"><span>    GfxSetBkMode(1);</span></span>
<span class="line"><span>    GfxGradientRect(x1, y1, x2, y2, colorFrom, colorTo);</span></span>
<span class="line"><span>    GfxDrawText(Text, x1, y1, x2, y2, 32 | 1 | 4 | 16);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if (amiversion &gt;= 6.4) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Algo Mode Status Dashboard</span></span>
<span class="line"><span>GfxSelectFont(&quot;BOOK ANTIQUA&quot;, 14, 100);</span></span>
<span class="line"><span>GfxSetBkMode(1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if (EnableAlgo == &quot;Enable&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    AlgoStatus = &quot;Algo Enabled&quot;;</span></span>
<span class="line"><span>    GfxSetTextColor(colorGreen);</span></span>
<span class="line"><span>    GfxTextOut(&quot;Algostatus: &quot; + AlgoStatus, 20, 40);</span></span>
<span class="line"><span>    if (Nz(StaticVarGet(static_name_algo), 0) != 1)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        _TRACE(&quot;Algo Status: Enabled&quot;);</span></span>
<span class="line"><span>        StaticVarSet(static_name_algo, 1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>else</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    AlgoStatus = &quot;Algo Disabled&quot;;</span></span>
<span class="line"><span>    GfxSetTextColor(colorRed);</span></span>
<span class="line"><span>    GfxTextOut(&quot;Algostatus: &quot; + AlgoStatus, 20, 40);</span></span>
<span class="line"><span>    if (Nz(StaticVarGet(static_name_algo), 0) != 0)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        _TRACE(&quot;Algo Status: Disabled&quot;);</span></span>
<span class="line"><span>        StaticVarSet(static_name_algo, 0);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>GfxSetTextColor(colorWhite);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if (EnableAlgo == &quot;Enable&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    // Draw buttons</span></span>
<span class="line"><span>    DrawButton(&quot;BE&quot;, X0, Y0, X0 + X1, Y0 + 50, colorGreen, colorGreen);</span></span>
<span class="line"><span>    CursorInBEButton = MouseX &gt;= X0 AND MouseX &lt;= X0 + X1 AND MouseY &gt;= Y0 AND MouseY &lt;= Y0 + 50;</span></span>
<span class="line"><span>    BEButtonClick = CursorInBEButton AND LBClick;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    DrawButton(&quot;BX&quot;, X0 + 65, Y0, X0 + X1 + 65, Y0 + 50, colorRed, colorRed);</span></span>
<span class="line"><span>    CursorInBXButton = MouseX &gt;= X0 + 65 AND MouseX &lt;= X0 + X1 + 65 AND MouseY &gt;= Y0 AND MouseY &lt;= Y0 + 50;</span></span>
<span class="line"><span>    BxButtonClick = CursorInBXButton AND LBClick;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    DrawButton(&quot;SE&quot;, X0, Y0 + 55, X0 + X1, Y0 + 105, colorRed, colorRed);</span></span>
<span class="line"><span>    CursorInSEButton = MouseX &gt;= X0 AND MouseX &lt;= X0 + X1 AND MouseY &gt;= Y0 + 55 AND MouseY &lt;= Y0 + 105;</span></span>
<span class="line"><span>    SEButtonClick = CursorInSEButton AND LBClick;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    DrawButton(&quot;SX&quot;, X0 + 65, Y0 + 55, X0 + X1 + 65, Y0 + 105, colorGreen, colorGreen);</span></span>
<span class="line"><span>    CursorInSXButton = MouseX &gt;= X0 + 65 AND MouseX &lt;= X0 + X1 + 65 AND MouseY &gt;= Y0 + 55 AND MouseY &lt;= Y0 + 105;</span></span>
<span class="line"><span>    SXButtonClick = CursorInSXButton AND LBClick;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    DrawButton(&quot;CLOSE ALL&quot;, X0, Y0 + 110, X0 + X1 + 65, Y0 + 155, colorRed, colorRed);</span></span>
<span class="line"><span>    CursorInCXButton = MouseX &gt;= X0 AND MouseX &lt;= X0 + X1 + 65 AND MouseY &gt;= Y0 + 110 AND MouseY &lt;= Y0 + 155;</span></span>
<span class="line"><span>    CXButtonClick = CursorInCXButton AND LBClick;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Button Actions</span></span>
<span class="line"><span>    if (BEButtonClick AND StaticVarGet(static_name_algo + &quot;BE&quot;) == 0)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        PlaceOrder(&quot;BUY&quot;, quantity);</span></span>
<span class="line"><span>        StaticVarSet(static_name_algo + &quot;BE&quot;, 1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    else</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        StaticVarSet(static_name_algo + &quot;BE&quot;, 0);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (BXButtonClick AND StaticVarGet(static_name_algo + &quot;BX&quot;) == 0)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        PlaceOrder(&quot;SELL&quot;, quantity);</span></span>
<span class="line"><span>        StaticVarSet(static_name_algo + &quot;BX&quot;, 1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    else</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        StaticVarSet(static_name_algo + &quot;BX&quot;, 0);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (SEButtonClick AND StaticVarGet(static_name_algo + &quot;SE&quot;) == 0)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        PlaceOrder(&quot;SELL&quot;, quantity);</span></span>
<span class="line"><span>        StaticVarSet(static_name_algo + &quot;SE&quot;, 1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    else</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        StaticVarSet(static_name_algo + &quot;SE&quot;, 0);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (SXButtonClick AND StaticVarGet(static_name_algo + &quot;SX&quot;) == 0)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        PlaceOrder(&quot;BUY&quot;, quantity);</span></span>
<span class="line"><span>        StaticVarSet(static_name_algo + &quot;SX&quot;, 1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    else</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        StaticVarSet(static_name_algo + &quot;SX&quot;, 0);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (CXButtonClick AND StaticVarGet(static_name_algo + &quot;CX&quot;) == 0)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        SquareOffAll();</span></span>
<span class="line"><span>        StaticVarSet(static_name_algo + &quot;CX&quot;, 1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    else</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        StaticVarSet(static_name_algo + &quot;CX&quot;, 0);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>else {</span></span>
<span class="line"><span>    GfxSetBkMode(1); // Transparent background</span></span>
<span class="line"><span>    GfxSelectFont(&quot;Arial&quot;, 16, 700); // Font for text</span></span>
<span class="line"><span>    GfxSetTextColor(colorRed); // Text color</span></span>
<span class="line"><span>    GfxTextOut(&quot;You are using an older version of AmiBroker. This feature is not supported. Amibroker 6.4 or higher is required&quot;, 50, 50);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>_SECTION_END();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>_SECTION_BEGIN(&quot;Candlestick Charts with Date &amp; Time Axis&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Enable the Date &amp; Time Axis</span></span>
<span class="line"><span>SetChartOptions(0, chartShowArrows | chartShowDates);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Plotting Candlestick charts</span></span>
<span class="line"><span>Plot(Close, &quot;Candle&quot;, colorDefault, stylebar);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>_SECTION_END();</span></span></code></pre></div><h2 id="vb-script-method-legacy" tabindex="-1">VB Script Method (Legacy) <a class="header-anchor" href="#vb-script-method-legacy" aria-label="Permalink to &quot;VB Script Method (Legacy)&quot;">​</a></h2><div class="language-clike vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">clike</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//Rajeev Upadhyay - Creator of Tradeboard</span></span>
<span class="line"><span>//website - tradeboard.in / marketcalls.in</span></span>
<span class="line"><span>//Tradeboard - Amibroker Button Trading Module v1.0</span></span>
<span class="line"><span>//Date - 10/02/2024</span></span>
<span class="line"><span></span></span>
<span class="line"><span>_SECTION_BEGIN(&quot;Tradeboard Button Trading&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>RequestTimedRefresh(1,False);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>apikey = ParamStr(&quot;Tradeboard API Key&quot;, &quot;******&quot;);</span></span>
<span class="line"><span>strategy = ParamStr(&quot;Strategy&quot;, &quot;Amibroker&quot;);</span></span>
<span class="line"><span>symbol = ParamStr(&quot;Symbol&quot;, &quot;RELIANCE&quot;);</span></span>
<span class="line"><span>exchange = ParamList(&quot;Exchange&quot;, &quot;NSE|NFO|BSE|MCX|CDS&quot;);</span></span>
<span class="line"><span>pricetype = ParamStr(&quot;Price Type&quot;, &quot;MARKET&quot;);</span></span>
<span class="line"><span>product = ParamList(&quot;Product&quot;, &quot;MIS|NRML|CNC&quot;);</span></span>
<span class="line"><span>quantity = Param(&quot;Quantity&quot;, 1,1,1000,1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>host = ParamStr(&quot;host&quot;,&quot;http://127.0.0.1:5000&quot;);</span></span>
<span class="line"><span>ver = ParamStr(&quot;API Version&quot;,&quot;v1&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>VoiceAlert = ParamList(&quot;Voice Alert&quot;,&quot;Disable|Enable&quot;,1);</span></span>
<span class="line"><span>EnableAlgo = ParamList(&quot;Algo Mode&quot;,&quot;Disable|Enable&quot;,0); // Algo Mode</span></span>
<span class="line"><span></span></span>
<span class="line"><span>bridgeurl = host+&quot;/api/&quot;+ver;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static_name_ = Name()+GetChartID()+interval(2)+strategy;</span></span>
<span class="line"><span>static_name_algo = static_name_+interval(2)+strategy+&quot;algostatus&quot;;</span></span>
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
<span class="line"><span>_SECTION_BEGIN(&quot;Tradeboard Bridge Controls&quot;);</span></span>
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
<span class="line"><span>Public Sub SquareoffAll()</span></span>
<span class="line"><span>    Dim oXMLHTTP</span></span>
<span class="line"><span>    Dim oStream</span></span>
<span class="line"><span>    Set oXMLHTTP = CreateObject(&quot;Msxml2.XMLHTTP&quot;)</span></span>
<span class="line"><span>    &#39; Define variables with the specified values</span></span>
<span class="line"><span>    Dim apikey, strategy</span></span>
<span class="line"><span>    apikey = AFL.Var(&quot;apikey&quot;)</span></span>
<span class="line"><span>    strategy = AFL.Var(&quot;strategy&quot;)</span></span>
<span class="line"><span>      </span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &#39; Construct the JSON string for the POST message</span></span>
<span class="line"><span>    Dim jsonRequestBody</span></span>
<span class="line"><span>    jsonRequestBody = &quot;{&quot;&quot;apikey&quot;&quot;:&quot;&quot;&quot; &amp; apikey &amp; _</span></span>
<span class="line"><span>    &quot;&quot;&quot;,&quot;&quot;strategy&quot;&quot;:&quot;&quot;&quot; &amp; strategy &amp; &quot;&quot;&quot;}&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &#39; Set the URL</span></span>
<span class="line"><span>    Dim url</span></span>
<span class="line"><span>    url = AFL.Var(&quot;bridgeurl&quot;)&amp;&quot;/closeposition&quot;</span></span>
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
<span class="line"><span>    api_parameters = &quot;Strategy :&quot; &amp; strategy &amp; &quot; api_url :&quot; &amp; url</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    AFL(&quot;sq_api_request&quot;) = api_parameters  </span></span>
<span class="line"><span>    AFL(&quot;sq_api_response&quot;) = oXMLHTTP.responseText</span></span>
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
<span class="line"><span>_SECTION_BEGIN(&quot;Button Trading - For Old Amibroker Versions&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>X0 = 20;</span></span>
<span class="line"><span>Y0 = 100;</span></span>
<span class="line"><span>X1 = 60;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>LBClick = GetCursorMouseButtons() == 9;	// Click</span></span>
<span class="line"><span>MouseX  = Nz(GetCursorXPosition(1));		// </span></span>
<span class="line"><span>MouseY  = Nz(GetCursorYPosition(1));		//</span></span>
<span class="line"><span></span></span>
<span class="line"><span>procedure DrawButton (Text, x1, y1, x2, y2, colorFrom, colorTo)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	GfxSetOverlayMode(0);</span></span>
<span class="line"><span>	GfxSelectFont(&quot;Verdana&quot;, 9, 700);</span></span>
<span class="line"><span>	GfxSetBkMode(1);</span></span>
<span class="line"><span>	GfxGradientRect(x1, y1, x2, y2, colorFrom, colorTo);</span></span>
<span class="line"><span>	GfxDrawText(Text, x1, y1, x2, y2, 32|1|4|16);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>GfxSetTextColor(colorWhite);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if(EnableAlgo == &quot;Enable&quot;)</span></span>
<span class="line"><span>{  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>	DrawButton(&quot;BE&quot;, X0, Y0, X0+X1, Y0+50, colorGreen, colorGreen);</span></span>
<span class="line"><span>	CursorInBEButton = MouseX &gt;= X0 AND MouseX &lt;= X0+X1 AND MouseY &gt;= Y0 AND MouseY &lt;= Y0+50;</span></span>
<span class="line"><span>	BEButtonClick = CursorInBEButton AND LBClick;</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	DrawButton(&quot;BX&quot;, X0+65, Y0, X0+X1+65, Y0+50, colorRed, colorRed);</span></span>
<span class="line"><span>	CursorInBXButton = MouseX &gt;= X0+65 AND MouseX &lt;= X0+X1+65 AND MouseY &gt;= Y0 AND MouseY &lt;= Y0+50;</span></span>
<span class="line"><span>	BxButtonClick = CursorInBXButton AND LBClick;</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	DrawButton(&quot;SE&quot;, X0, Y0+55, X0+X1, Y0+105, colorRed, colorRed);</span></span>
<span class="line"><span>	CursorInSEButton = MouseX &gt;= X0 AND MouseX &lt;= X0+X1 AND MouseY &gt;= Y0+55 AND MouseY &lt;= Y0+105;</span></span>
<span class="line"><span>	SEButtonClick = CursorInSEButton AND LBClick;</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	DrawButton(&quot;SX&quot;, X0+65, Y0+55, X0+X1+65, Y0+105, colorGreen, colorGreen);</span></span>
<span class="line"><span>	CursorInSXButton = MouseX &gt;= X0+65 AND MouseX &lt;= X0+X1+65 AND MouseY &gt;= Y0+55 AND MouseY &lt;= Y0+105;</span></span>
<span class="line"><span>	SXButtonClick = CursorInSXButton AND LBClick;</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	DrawButton(&quot;CLOSE ALL&quot;, X0, Y0+110, X0+X1+65, Y0+155, colorRed, colorRed);</span></span>
<span class="line"><span>	CursorInCXButton = MouseX &gt;= X0 AND MouseX &lt;= X0+X1+65 AND MouseY &gt;= Y0+110 AND MouseY &lt;= Y0+155;</span></span>
<span class="line"><span>	CXButtonClick = CursorInCXButton AND LBClick;</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	if( BEButtonClick AND StaticVarGet(static_name_+&quot;BEAlgo&quot;)==0 ) </span></span>
<span class="line"><span>	{</span></span>
<span class="line"><span>		tradeboard.placeorder(&quot;BUY&quot;,quantity);</span></span>
<span class="line"><span>        if(VoiceAlert == &quot;Enable&quot;){</span></span>
<span class="line"><span>				Say(&quot;Buy Order Triggered&quot;);  	</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>		_TRACE(&quot;API Request : &quot;+api_request);</span></span>
<span class="line"><span>		_TRACE(&quot;API Response : &quot;+api_response);</span></span>
<span class="line"><span>		</span></span>
<span class="line"><span>		StaticVarSet(static_name_+&quot;BEAlgo&quot;,1); </span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	else</span></span>
<span class="line"><span>	{</span></span>
<span class="line"><span>		StaticVarSet(static_name_+&quot;BEAlgo&quot;,0);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	if( BXButtonClick AND StaticVarGet(static_name_+&quot;BXAlgo&quot;)==0 ) </span></span>
<span class="line"><span>	{</span></span>
<span class="line"><span>		tradeboard.placeorder(&quot;SELL&quot;,quantity);</span></span>
<span class="line"><span>        if(VoiceAlert == &quot;Enable&quot;){</span></span>
<span class="line"><span>				Say(&quot;Sell Order Triggered&quot;);  	</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>		_TRACE(&quot;API Request : &quot;+api_request);</span></span>
<span class="line"><span>		_TRACE(&quot;API Response : &quot;+api_response);</span></span>
<span class="line"><span>		StaticVarSet(static_name_+&quot;BXAlgo&quot;,1); </span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	else</span></span>
<span class="line"><span>	{</span></span>
<span class="line"><span>		StaticVarSet(static_name_+&quot;BXAlgo&quot;,0);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>		</span></span>
<span class="line"><span>	if( SEButtonClick AND StaticVarGet(static_name_+&quot;SEAlgo&quot;)==0 ) </span></span>
<span class="line"><span>	{</span></span>
<span class="line"><span>		tradeboard.placeorder(&quot;SELL&quot;,quantity);</span></span>
<span class="line"><span>        if(VoiceAlert == &quot;Enable&quot;){</span></span>
<span class="line"><span>				Say(&quot;Short Order Triggered&quot;);  	</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>		_TRACE(&quot;API Request : &quot;+api_request);</span></span>
<span class="line"><span>		_TRACE(&quot;API Response : &quot;+api_response);</span></span>
<span class="line"><span>		StaticVarSet(static_name_+&quot;SEAlgo&quot;,1); </span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	else</span></span>
<span class="line"><span>	{</span></span>
<span class="line"><span>		StaticVarSet(static_name_+&quot;SEAlgo&quot;,0);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if( SXButtonClick AND StaticVarGet(static_name_+&quot;SXAlgo&quot;)==0 ) </span></span>
<span class="line"><span>	{</span></span>
<span class="line"><span>		tradeboard.placeorder(&quot;BUY&quot;,quantity);</span></span>
<span class="line"><span>        if(VoiceAlert == &quot;Enable&quot;){</span></span>
<span class="line"><span>				Say(&quot;Cover Order Triggered&quot;);  	</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>		_TRACE(&quot;API Request : &quot;+api_request);</span></span>
<span class="line"><span>		_TRACE(&quot;API Response : &quot;+api_response);</span></span>
<span class="line"><span>		StaticVarSet(static_name_+&quot;SXAlgo&quot;,1); </span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	else</span></span>
<span class="line"><span>	{</span></span>
<span class="line"><span>		StaticVarSet(static_name_+&quot;SXAlgo&quot;,0); </span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	if( CXButtonClick AND StaticVarGet(Name()+GetChartID()+&quot;CXAlgo&quot;)==0 ) </span></span>
<span class="line"><span>	{</span></span>
<span class="line"><span>		tradeboard.Squareoffall();</span></span>
<span class="line"><span>		if(VoiceAlert == &quot;Enable&quot;){</span></span>
<span class="line"><span>				Say(&quot;Squareoff All Triggered&quot;);  	</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>		_TRACE(&quot;API Request : &quot;+sq_api_request);</span></span>
<span class="line"><span>		_TRACE(&quot;API Response : &quot;+sq_api_response);</span></span>
<span class="line"><span>		StaticVarSet(Name()+GetChartID()+&quot;CXAlgo&quot;,1); </span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	else</span></span>
<span class="line"><span>	{</span></span>
<span class="line"><span>		StaticVarSet(Name()+GetChartID()+&quot;CXAlgo&quot;,0);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>}</span></span>
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
<span class="line"><span>_SECTION_END();</span></span></code></pre></div>`,5)])])}const S=n(e,[["render",l]]);export{d as __pageData,S as default};
