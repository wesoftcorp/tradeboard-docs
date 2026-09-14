import{_ as n,o as a,c as p,a2 as t}from"./chunks/framework.BXzK3EA4.js";const d=JSON.parse('{"title":"Button Trading with Stoploss","description":"","frontmatter":{},"headers":[],"relativePath":"trading-platform/amibroker/button-trading-with-stoploss.md","filePath":"trading-platform/amibroker/button-trading-with-stoploss.md"}'),e={name:"trading-platform/amibroker/button-trading-with-stoploss.md"};function l(o,s,u,i,c,q){return a(),p("div",null,[...s[0]||(s[0]=[t(`<h1 id="button-trading-with-stoploss" tabindex="-1">Button Trading with Stoploss <a class="header-anchor" href="#button-trading-with-stoploss" aria-label="Permalink to &quot;Button Trading with Stoploss&quot;">​</a></h1><div class="language-clike vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">clike</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//Rajeev Upadhyay - Creator of Tradeboard</span></span>
<span class="line"><span>//website - tradeboard.in / marketcalls.in</span></span>
<span class="line"><span>//Tradeboard - Amibroker Button Trading Module v1.0 with Stoploss</span></span>
<span class="line"><span>//Date - 13/08/2024</span></span>
<span class="line"><span></span></span>
<span class="line"><span>_SECTION_BEGIN(&quot;Tradeboard Button Trading&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>RequestTimedRefresh(1,False);</span></span>
<span class="line"><span>SetOption(&quot;StaticVarAutoSave&quot;, 30 );</span></span>
<span class="line"><span>EnableTextOutput(False);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>apikey = ParamStr(&quot;Tradeboard API Key&quot;, &quot;******&quot;);</span></span>
<span class="line"><span>strategy = ParamStr(&quot;Strategy&quot;, &quot;Amibroker&quot;);</span></span>
<span class="line"><span>symbol = ParamStr(&quot;Symbol&quot;, &quot;RELIANCE&quot;);</span></span>
<span class="line"><span>exchange = ParamList(&quot;Exchange&quot;, &quot;NSE|NFO|BSE|MCX|CDS&quot;);</span></span>
<span class="line"><span>pricetype = ParamStr(&quot;Price Type&quot;, &quot;MARKET&quot;);</span></span>
<span class="line"><span>product = ParamList(&quot;Product&quot;, &quot;MIS|NRML|CNC&quot;);</span></span>
<span class="line"><span>quantity = Param(&quot;Quantity&quot;, 1,1,1000,1);</span></span>
<span class="line"><span>stops = Param(&quot;Stoploss (points)&quot;,30,0.05,1000,0.05);</span></span>
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
<span class="line"><span>Public Sub PlaceSLOrder(action, quantity,stopprice)</span></span>
<span class="line"><span>    Dim oXMLHTTP</span></span>
<span class="line"><span>    Dim oStream</span></span>
<span class="line"><span>    Set oXMLHTTP = CreateObject(&quot;Msxml2.XMLHTTP&quot;)</span></span>
<span class="line"><span>    &#39; Define variables with the specified values</span></span>
<span class="line"><span>    Dim apikey, strategy, symbol , exchange, pricetype, product, price, disclosed_quantity</span></span>
<span class="line"><span>    apikey = AFL.Var(&quot;apikey&quot;)</span></span>
<span class="line"><span>    strategy = AFL.Var(&quot;strategy&quot;)</span></span>
<span class="line"><span>    symbol = AFL.Var(&quot;symbol&quot;)</span></span>
<span class="line"><span>    exchange = AFL.Var(&quot;exchange&quot;)</span></span>
<span class="line"><span>    pricetype = &quot;SL-M&quot;</span></span>
<span class="line"><span>    product = AFL.Var(&quot;product&quot;)</span></span>
<span class="line"><span>    price = &quot;0&quot;</span></span>
<span class="line"><span>    disclosed_quantity = &quot;0&quot;</span></span>
<span class="line"><span>    </span></span>
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
<span class="line"><span>    &quot;&quot;&quot;,&quot;&quot;quantity&quot;&quot;:&quot;&quot;&quot; &amp; quantity &amp; _</span></span>
<span class="line"><span>    &quot;&quot;&quot;,&quot;&quot;price&quot;&quot;:&quot;&quot;&quot; &amp; price &amp; _</span></span>
<span class="line"><span>    &quot;&quot;&quot;,&quot;&quot;trigger_price&quot;&quot;:&quot;&quot;&quot; &amp; stopprice &amp; _</span></span>
<span class="line"><span>    &quot;&quot;&quot;,&quot;&quot;disclosed_quantity&quot;&quot;:&quot;&quot;&quot; &amp; disclosed_quantity &amp; &quot;&quot;&quot;}&quot;</span></span>
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
<span class="line"><span>    AFL(&quot;sl_api_request&quot;) = api_parameters  </span></span>
<span class="line"><span>    AFL(&quot;sl_api_response&quot;) = oXMLHTTP.responseText</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &#39; Optionally, handle the response here</span></span>
<span class="line"><span>    &#39; Dim response</span></span>
<span class="line"><span>    &#39; response = oXMLHTTP.responseText</span></span>
<span class="line"><span>    &#39; Response handling code...</span></span>
<span class="line"><span>End Sub</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Public Sub CancelOrder(orderid)</span></span>
<span class="line"><span>    Dim oXMLHTTP</span></span>
<span class="line"><span>    Dim oStream</span></span>
<span class="line"><span>    Set oXMLHTTP = CreateObject(&quot;Msxml2.XMLHTTP&quot;)</span></span>
<span class="line"><span>    &#39; Define variables with the specified values</span></span>
<span class="line"><span>    Dim apikey, strategy, symbol , exchange, pricetype, product</span></span>
<span class="line"><span>    apikey = AFL.Var(&quot;apikey&quot;)</span></span>
<span class="line"><span>    strategy = AFL.Var(&quot;strategy&quot;)</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>   </span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &#39; Construct the JSON string for the POST message</span></span>
<span class="line"><span>    Dim jsonRequestBody</span></span>
<span class="line"><span>    jsonRequestBody = &quot;{&quot;&quot;apikey&quot;&quot;:&quot;&quot;&quot; &amp; apikey &amp; _</span></span>
<span class="line"><span>    &quot;&quot;&quot;,&quot;&quot;strategy&quot;&quot;:&quot;&quot;&quot; &amp; strategy &amp; _</span></span>
<span class="line"><span>    &quot;&quot;&quot;,&quot;&quot;orderid&quot;&quot;:&quot;&quot;&quot; &amp; orderid &amp; &quot;&quot;&quot;}&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &#39; Set the URL</span></span>
<span class="line"><span>    Dim url</span></span>
<span class="line"><span>    url = AFL.Var(&quot;bridgeurl&quot;)&amp;&quot;/cancelorder&quot;</span></span>
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
<span class="line"><span>    api_parameters = &quot;Strategy :&quot; &amp; strategy &amp; &quot; orderid :&quot; &amp; orderid </span></span>
<span class="line"><span></span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    AFL(&quot;cancel_api_request&quot;) = api_parameters  </span></span>
<span class="line"><span>    AFL(&quot;cancel_api_response&quot;) = oXMLHTTP.responseText</span></span>
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
<span class="line"><span>_SECTION_BEGIN(&quot;Stoploss OrderID Display&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>StaticVarBuySLOrderID = StaticVarGetText(static_name_ + &quot;BuySLOrderID&quot;);</span></span>
<span class="line"><span>StaticVarSellSLOrderID = StaticVarGetText(static_name_ + &quot;ShortSLOrderID&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>printf(&quot;\\n The Buy Stoploss Order ID is : &quot; + StaticVarBuySLOrderID);</span></span>
<span class="line"><span>printf(&quot;\\n The Sell Stoploss Order ID is : &quot; + StaticVarSellSLOrderID);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>_SECTION_END();</span></span>
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
<span class="line"><span>		_TRACE(&quot;API Request : &quot;+api_request);</span></span>
<span class="line"><span>		_TRACE(&quot;API Response : &quot;+api_response);</span></span>
<span class="line"><span>		slprice = LastValue(Close + stops);</span></span>
<span class="line"><span>		tradeboard.placeSLorder(&quot;SELL&quot;,quantity,slprice);</span></span>
<span class="line"><span>		</span></span>
<span class="line"><span>		orderid = StrExtract(sl_api_response,1,&#39;{&#39;);</span></span>
<span class="line"><span>		orderid = StrExtract(orderid,1,&#39;:&#39;);</span></span>
<span class="line"><span>		orderid = StrExtract(orderid,0,&#39;,&#39;);</span></span>
<span class="line"><span>		orderid = StrExtract(orderid,1,&#39;&quot;&#39;);</span></span>
<span class="line"><span>		</span></span>
<span class="line"><span>		_TRACE(&quot;API Request : &quot;+sl_api_request);</span></span>
<span class="line"><span>		_TRACE(&quot;API Response : &quot;+sl_api_response);</span></span>
<span class="line"><span>		_TRACE(&quot;The OrderID : &quot;+orderid);</span></span>
<span class="line"><span>		</span></span>
<span class="line"><span>		StaticVarSetText(static_name_+&quot;BuySLOrderID&quot;,orderid,True);</span></span>
<span class="line"><span>		</span></span>
<span class="line"><span>				</span></span>
<span class="line"><span>        if(VoiceAlert == &quot;Enable&quot;){</span></span>
<span class="line"><span>				Say(&quot;Buy Order Triggered&quot;);  	</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>		</span></span>
<span class="line"><span>		</span></span>
<span class="line"><span>		StaticVarSet(static_name_+&quot;BEAlgo&quot;,1); </span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	else</span></span>
<span class="line"><span>	{</span></span>
<span class="line"><span>		StaticVarSet(static_name_+&quot;BEAlgo&quot;,0);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	if( BXButtonClick AND StaticVarGet(static_name_+&quot;BXAlgo&quot;)==0 ) </span></span>
<span class="line"><span>	{</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>		StaticVarBuySLOrderID = StaticVarGetText(static_name_ + &quot;BuySLOrderID&quot;);</span></span>
<span class="line"><span>		tradeboard.cancelorder(StaticVarBuySLOrderID);</span></span>
<span class="line"><span>		_TRACE(&quot;Cancel API Request : &quot;+cancel_api_request);</span></span>
<span class="line"><span>		_TRACE(&quot;Cancel API Response : &quot;+cancel_api_response);</span></span>
<span class="line"><span>		StaticVarSetText(static_name_+&quot;BuySLOrderID&quot;,&quot;&quot;,True);</span></span>
<span class="line"><span>		</span></span>
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
<span class="line"><span>		_TRACE(&quot;API Request : &quot;+api_request);</span></span>
<span class="line"><span>		_TRACE(&quot;API Response : &quot;+api_response);</span></span>
<span class="line"><span>		slprice = LastValue(Close - stops);</span></span>
<span class="line"><span>		tradeboard.placeSLorder(&quot;BUY&quot;,quantity,slprice);</span></span>
<span class="line"><span>		</span></span>
<span class="line"><span>		orderid = StrExtract(sl_api_response,1,&#39;{&#39;);</span></span>
<span class="line"><span>		orderid = StrExtract(orderid,1,&#39;:&#39;);</span></span>
<span class="line"><span>		orderid = StrExtract(orderid,0,&#39;,&#39;);</span></span>
<span class="line"><span>		orderid = StrExtract(orderid,1,&#39;&quot;&#39;);</span></span>
<span class="line"><span>		</span></span>
<span class="line"><span>		_TRACE(&quot;API Request : &quot;+sl_api_request);</span></span>
<span class="line"><span>		_TRACE(&quot;API Response : &quot;+sl_api_response);</span></span>
<span class="line"><span>		_TRACE(&quot;The OrderID : &quot;+orderid);</span></span>
<span class="line"><span>		</span></span>
<span class="line"><span>		StaticVarSetText(static_name_+&quot;ShortSLOrderID&quot;,orderid,True);</span></span>
<span class="line"><span>		</span></span>
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
<span class="line"><span>		StaticVarSellSLOrderID = StaticVarGetText(static_name_ + &quot;ShortSLOrderID&quot;);</span></span>
<span class="line"><span>		tradeboard.cancelorder(StaticVarSellSLOrderID);</span></span>
<span class="line"><span>		_TRACE(&quot;Cancel API Request : &quot;+cancel_api_request);</span></span>
<span class="line"><span>		_TRACE(&quot;Cancel API Response : &quot;+cancel_api_response);</span></span>
<span class="line"><span>		StaticVarSetText(static_name_+&quot;ShortSLOrderID&quot;,&quot;&quot;,True);</span></span>
<span class="line"><span></span></span>
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
<span class="line"><span>_SECTION_END();</span></span></code></pre></div>`,2)])])}const m=n(e,[["render",l]]);export{d as __pageData,m as default};
