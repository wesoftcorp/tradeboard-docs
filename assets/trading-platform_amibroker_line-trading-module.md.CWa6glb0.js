import{_ as s,o as n,c as p,a2 as t}from"./chunks/framework.BXzK3EA4.js";const e="/assets/image%20(42).HsXFfcYM.png",o="/assets/image%20(43).jahVSSrP.png",l="/assets/image%20(44).gEVTCNll.png",i="/assets/image%20(45).DNiyu41Y.png",u="/assets/image%20(46).CiAAl1rp.png",r="/assets/image%20(47).BiCJWc4_.png",q="/assets/image%20(48).CYCVJzh2.png",x=JSON.parse('{"title":"Line Trading Module","description":"","frontmatter":{},"headers":[],"relativePath":"trading-platform/amibroker/line-trading-module.md","filePath":"trading-platform/amibroker/line-trading-module.md"}'),c={name:"trading-platform/amibroker/line-trading-module.md"};function d(S,a,m,y,T,h){return n(),p("div",null,[...a[0]||(a[0]=[t('<h1 id="line-trading-module" tabindex="-1">Line Trading Module <a class="header-anchor" href="#line-trading-module" aria-label="Permalink to &quot;Line Trading Module&quot;">​</a></h1><p>The line Trading Automation tool is designed for Manual traders who want to perform level-based trade execution faster and also bring some advanced trade management in their trades (multiple entries, targets, stops, pyramiding, martingale, etc)</p><br><figure><img src="'+e+`" alt=""><figcaption><p>Line Trade Automation v1.0</p></figcaption></figure><h3 id="what-is-line-trading-automation-1-0" tabindex="-1"><strong>What is Line Trading Automation 1.0?</strong> <a class="header-anchor" href="#what-is-line-trading-automation-1-0" aria-label="Permalink to &quot;**What is Line Trading Automation 1.0?**&quot;">​</a></h3><ul><li><p>Draw Horizontal Lines or Trend Lines in Amibroker When the levels are touched then the Line Trade Automation Module will convert into signals and orders will be transmitted to the broker automatically.</p></li><li><p>Module <strong>Supports Multiple Entry, Targets, Stoploss levels</strong> can be drawn and converted into orders, Supports pyramiding.</p></li><li><p>Module <strong>prevents placing multiple orders</strong> at the same signal</p></li><li><p>Supports <strong>Intraday and Positional Trades</strong></p></li><li><p>Supports <strong>3 Long Entry, 3 Long Exit(Target/Stoploss), 3 Short Entries</strong>, and <strong>3 Short Exit (Target/Stoploss)</strong> Line based trading.</p></li></ul><div class="language-clike vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">clike</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//Module - Line Pair Tading Automation Module </span></span>
<span class="line"><span>//Rajeev Upadhyay - Creator of Tradeboard</span></span>
<span class="line"><span>//website - tradeboard.in / marketcalls.in</span></span>
<span class="line"><span>//Tradeboard - Amibroker SmartOrder Chart Trading Module v1.0</span></span>
<span class="line"><span>//Date - 29/05/2024</span></span>
<span class="line"><span></span></span>
<span class="line"><span>_SECTION_BEGIN(&quot;Tradeboard Trading Controls&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>RequestTimedRefresh(1,False);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>apikey = ParamStr(&quot;Tradeboard API Key&quot;, &quot;******&quot;);</span></span>
<span class="line"><span>strategy = ParamStr(&quot;Strategy&quot;, &quot;Amibroker&quot;);</span></span>
<span class="line"><span>symbol = ParamStr(&quot;Symbol&quot;, &quot;YESBANK&quot;);</span></span>
<span class="line"><span>exchange = ParamList(&quot;Exchange&quot;, &quot;NSE|NFO|BSE|MCX|CDS&quot;);</span></span>
<span class="line"><span>pricetype = ParamStr(&quot;Price Type&quot;, &quot;MARKET&quot;);</span></span>
<span class="line"><span>product = ParamList(&quot;Product&quot;, &quot;MIS|NRML|CNC&quot;);</span></span>
<span class="line"><span>quantity = Param(&quot;Quantity&quot;, 1,1,1000,1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Entrydelay = Param(&quot;Entry Delay&quot;,0,0,1,1);</span></span>
<span class="line"><span>Exitdelay = Param(&quot;Exit Delay&quot;,0,0,1,1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>host = ParamStr(&quot;host&quot;,&quot;http://127.0.0.1:5000&quot;);</span></span>
<span class="line"><span>ver = ParamStr(&quot;API Version&quot;,&quot;v1&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>VoiceAlert = ParamList(&quot;Voice Alert&quot;,&quot;Disable|Enable&quot;,1);</span></span>
<span class="line"><span>EnableAlgo = ParamList(&quot;Algo Mode&quot;,&quot;Disable|Enable&quot;,0); // Algo Mode</span></span>
<span class="line"><span></span></span>
<span class="line"><span>bridgeurl = host+&quot;/api/&quot;+ver;</span></span>
<span class="line"><span>resp = &quot;&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//Static Variables for Order protection</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static_name_ = Name()+GetChartID()+interval(2)+strategy;</span></span>
<span class="line"><span>static_name_algo = Name()+GetChartID()+interval(2)+strategy+&quot;algostatus&quot;;</span></span>
<span class="line"><span>//Mapping of Orders</span></span>
<span class="line"><span></span></span>
<span class="line"><span>iBuy = &quot;BUY&quot;;</span></span>
<span class="line"><span>iSell = &quot;SELL&quot;;</span></span>
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
<span class="line"><span>Public Sub PlaceSmartOrder(action, quantity,position_size)</span></span>
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
<span class="line"><span>    &quot;&quot;&quot;,&quot;&quot;position_size&quot;&quot;:&quot;&quot;&quot; &amp; position_size &amp; &quot;&quot;&quot;}&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &#39; Set the URL</span></span>
<span class="line"><span>    Dim url</span></span>
<span class="line"><span>    url = AFL.Var(&quot;bridgeurl&quot;)&amp;&quot;/placesmartorder&quot;</span></span>
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
<span class="line"><span>                 &quot; Position Size :&quot; &amp; position_size &amp; &quot; api_url :&quot; &amp; url</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    AFL(&quot;sm_api_request&quot;) = api_parameters  </span></span>
<span class="line"><span>    AFL(&quot;sm_api_response&quot;) = oXMLHTTP.responseText</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &#39; Optionally, handle the response here</span></span>
<span class="line"><span>    &#39; Dim response</span></span>
<span class="line"><span>    &#39; response = oXMLHTTP.responseText</span></span>
<span class="line"><span>    &#39; Response handling code...</span></span>
<span class="line"><span>End Sub</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Public Sub ExitOrder(action)</span></span>
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
<span class="line"><span>    position_size = &quot;0&quot;</span></span>
<span class="line"><span>    quantity = &quot;0&quot;</span></span>
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
<span class="line"><span>    &quot;&quot;&quot;,&quot;&quot;position_size&quot;&quot;:&quot;&quot;&quot; &amp; position_size &amp; &quot;&quot;&quot;}&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &#39; Set the URL</span></span>
<span class="line"><span>    Dim url</span></span>
<span class="line"><span>    url = AFL.Var(&quot;bridgeurl&quot;)&amp;&quot;/placesmartorder&quot;</span></span>
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
<span class="line"><span>                 &quot; Position Size :&quot; &amp; position_size &amp; &quot; api_url :&quot; &amp; url</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    AFL(&quot;ex_api_request&quot;) = api_parameters  </span></span>
<span class="line"><span>    AFL(&quot;ex_api_response&quot;) = oXMLHTTP.responseText</span></span>
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
<span class="line"><span>_SECTION_END();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>_SECTION_BEGIN(&quot;Line Pair Trading Module&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>SetBarsRequired(-2,-2); //turning off quick afl</span></span>
<span class="line"><span>SetChartOptions(0,chartShowArrows|chartShowDates);</span></span>
<span class="line"><span>_N(Title = StrFormat(&quot;{{NAME}} - {{INTERVAL}} {{DATE}} Open %g, Hi %g, Lo %g, Close %g (%.1f%%) {{VALUES}}&quot;, O, H, L, C, SelectedValue( ROC( C, 1 ) ) ));</span></span>
<span class="line"><span>Plot( C, &quot;Close&quot;, ParamColor(&quot;Color&quot;, colorDefault ), styleNoTitle | ParamStyle(&quot;Style&quot;) | GetPriceStyle() ); </span></span>
<span class="line"><span>_SECTION_END();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//Static Variables will be saved in Amibroker every 60 seconds once</span></span>
<span class="line"><span>SetOption(&quot;StaticVarAutoSave&quot;,60);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Send orders even if Amibroker is minimized or Chart is not active</span></span>
<span class="line"><span>RequestTimedRefresh(0.1, False); </span></span>
<span class="line"><span>EnableTextOutput(False);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>IntradayMode = ParamList(&quot;Intraday Mode&quot;,&quot;ON|OFF&quot;,0);</span></span>
<span class="line"><span>StartTradeTime = ParamTime(&quot;Start Time&quot;,&quot;09:30&quot;);</span></span>
<span class="line"><span>EndTradeTime = ParamTime(&quot;End Time&quot;,&quot;15:00&quot;);</span></span>
<span class="line"><span>ExitTradeTime = ParamTime(&quot;Squareoff Time&quot;,&quot;15:15&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>BuyMode=ParamToggle(&quot;Buy Mode&quot;,&quot;BUY ABOVE|BUY BELOW&quot;,0);</span></span>
<span class="line"><span>SellMode=ParamToggle(&quot;Sell Mode&quot;,&quot;SELL ABOVE|SELL BELOW&quot;,0);</span></span>
<span class="line"><span>ShortMode=ParamToggle(&quot;Short Mode&quot;,&quot;SHORT ABOVE|SHORT BELOW&quot;,1);</span></span>
<span class="line"><span>CoverMode=ParamToggle(&quot;Cover Mode&quot;,&quot;COVER ABOVE|COVER BELOW&quot;,1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>ExitPos = ParamList(&quot;Exit Positions&quot;,&quot;CURRENT|ALLOPENPOSITIONS&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>buyquantity1 = Param(&quot;Buy Quantity1&quot;,1,0,10000,1);</span></span>
<span class="line"><span>buyquantity2 = Param(&quot;Buy Quantity2&quot;,1,0,10000,1);</span></span>
<span class="line"><span>buyquantity3 = Param(&quot;Buy Quantity3&quot;,1,0,10000,1);</span></span>
<span class="line"><span>shortquantity1 = Param(&quot;Short Quantity1&quot;,1,0,10000,1);</span></span>
<span class="line"><span>shortquantity2 = Param(&quot;Short Quantity2&quot;,1,0,10000,1);</span></span>
<span class="line"><span>shortquantity3 = Param(&quot;Short Quantity3&quot;,1,0,10000,1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>clear = ParamTrigger(&quot;Reset Trades and Signals&quot;,&quot;Press to Reset&quot;);</span></span>
<span class="line"><span>staticvar = Name()+Interval()+GetChartID();</span></span>
<span class="line"><span>if(clear)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span></span></span>
<span class="line"><span>StaticVarRemove(staticvar+&quot;*&quot;);</span></span>
<span class="line"><span>_TRACE(&quot;Static Variables Cleared&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Plot( C, &quot;Price&quot;, colorBlack, styleCandle );</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if(BuyMode==0) 	Buydisplaytext = &quot;Buy Above&quot;;</span></span>
<span class="line"><span>if(BuyMode==1)  Buydisplaytext = &quot;Buy Below&quot;;</span></span>
<span class="line"><span>if(SellMode==0) Selldisplaytext = &quot;Sell Above&quot;;</span></span>
<span class="line"><span>if(SellMode==1) Selldisplaytext = &quot;Sell Below&quot;;</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>if(ShortMode==0) Shortdisplaytext = &quot;Short Above&quot;;</span></span>
<span class="line"><span>if(ShortMode==1) Shortdisplaytext = &quot;Short Below&quot;;</span></span>
<span class="line"><span>if(CoverMode==0) Coverdisplaytext = &quot;Cover Above&quot;;</span></span>
<span class="line"><span>if(CoverMode==1) Coverdisplaytext = &quot;Cover Below&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>B1 = LastValue(Study(&quot;B1&quot;, GetChartID() ));</span></span>
<span class="line"><span>B2 = LastValue(Study(&quot;B2&quot;, GetChartID() ));</span></span>
<span class="line"><span>B3 = LastValue(Study(&quot;B3&quot;, GetChartID() ));</span></span>
<span class="line"><span>X1 = LastValue(Study(&quot;X1&quot;, GetChartID() ));</span></span>
<span class="line"><span>X2 = LastValue(Study(&quot;X2&quot;, GetChartID() ));</span></span>
<span class="line"><span>X3 = LastValue(Study(&quot;X3&quot;, GetChartID() ));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>S1 = LastValue(Study(&quot;S1&quot;, GetChartID() ));</span></span>
<span class="line"><span>S2 = LastValue(Study(&quot;S2&quot;, GetChartID() ));</span></span>
<span class="line"><span>S3 = LastValue(Study(&quot;S3&quot;, GetChartID() ));</span></span>
<span class="line"><span>C1 = LastValue(Study(&quot;C1&quot;, GetChartID() ));</span></span>
<span class="line"><span>C2 = LastValue(Study(&quot;C2&quot;, GetChartID() ));</span></span>
<span class="line"><span>C3 = LastValue(Study(&quot;C3&quot;, GetChartID() ));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function lineplot(value,text,quantity,displaytext)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	</span></span>
<span class="line"><span></span></span>
<span class="line"><span>textcolor = IIf(text==&quot;B1&quot; OR text==&quot;B2&quot; OR text==&quot;B3&quot;, colorGreen, </span></span>
<span class="line"><span>				IIf(text==&quot;X1&quot; OR text==&quot;X2&quot; OR text==&quot;X3&quot;, colorRed, </span></span>
<span class="line"><span>					IIf(text==&quot;S1&quot; OR text==&quot;S2&quot; OR text==&quot;S3&quot;, colorBrown, </span></span>
<span class="line"><span>						IIf(text==&quot;C1&quot; OR text==&quot;C2&quot; OR text==&quot;C3&quot;, colorBlue,colorGrey40))));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>x = LastValue( ValueWhen( ExRem( value, 0 ), DateTime() ) );</span></span>
<span class="line"><span>if( x!= 0 AND (text==&quot;B1&quot; OR text==&quot;B2&quot; OR text==&quot;B3&quot;))</span></span>
<span class="line"><span>  PlotText(text+&quot;    &quot;+Displaytext+&quot; : &quot;+value+&quot;    Qty =&quot;+quantity,BarCount-40,value,colorWhite,textcolor,10);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if( x!= 0  AND (text==&quot;S1&quot; OR text==&quot;S2&quot; OR text==&quot;S3&quot;))</span></span>
<span class="line"><span>  PlotText(text+&quot;    &quot;+Displaytext+&quot; : &quot;+value+&quot;    Qty =&quot;+quantity,BarCount-40,value,colorWhite,textcolor,10);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if( x!= 0 AND ExitPos==&quot;CURRENT&quot; AND (text==&quot;X1&quot; OR text==&quot;X2&quot; OR text==&quot;X3&quot;))</span></span>
<span class="line"><span>  PlotText(text+&quot;    &quot;+Displaytext+&quot; : &quot;+value+&quot;    Qty =&quot;+quantity,BarCount-40,value,colorWhite,textcolor,10);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if( x!= 0 AND ExitPos==&quot;CURRENT&quot; AND (text==&quot;C1&quot; OR text==&quot;C2&quot; OR text==&quot;C3&quot;))</span></span>
<span class="line"><span>  PlotText(text+&quot;    &quot;+Displaytext+&quot; : &quot;+value+&quot;    Qty =&quot;+quantity,BarCount-40,value,colorWhite,textcolor,10);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if( x!= 0 AND ExitPos==&quot;ALLOPENPOSITIONS&quot; AND (text==&quot;X1&quot; OR text==&quot;X2&quot; OR text==&quot;X3&quot;))</span></span>
<span class="line"><span>  PlotText(text+&quot;    &quot;+Displaytext+&quot; : &quot;+value+&quot;    Qty = All&quot;,BarCount-40,value,colorWhite,textcolor,10);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if( x!= 0 AND ExitPos==&quot;ALLOPENPOSITIONS&quot; AND (text==&quot;C1&quot; OR text==&quot;C2&quot; OR text==&quot;C3&quot;))</span></span>
<span class="line"><span>  PlotText(text+&quot;    &quot;+Displaytext+&quot; : &quot;+value+&quot;   Qty = All&quot;,BarCount-40,value,colorWhite,textcolor,10);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>lineplot(B1,&quot;B1&quot;,buyquantity1,Buydisplaytext);</span></span>
<span class="line"><span>lineplot(B2,&quot;B2&quot;,buyquantity2,Buydisplaytext);</span></span>
<span class="line"><span>lineplot(B3,&quot;B3&quot;,buyquantity3,Buydisplaytext);</span></span>
<span class="line"><span>lineplot(X1,&quot;X1&quot;,buyquantity1,Selldisplaytext);</span></span>
<span class="line"><span>lineplot(X2,&quot;X2&quot;,buyquantity2,Selldisplaytext);</span></span>
<span class="line"><span>lineplot(X3,&quot;X3&quot;,buyquantity3,Selldisplaytext);</span></span>
<span class="line"><span>lineplot(S1,&quot;S1&quot;,shortquantity1,Shortdisplaytext);</span></span>
<span class="line"><span>lineplot(S2,&quot;S2&quot;,shortquantity2,Shortdisplaytext);</span></span>
<span class="line"><span>lineplot(S3,&quot;S3&quot;,shortquantity3,Shortdisplaytext);</span></span>
<span class="line"><span>lineplot(C1,&quot;C1&quot;,shortquantity1,Coverdisplaytext);</span></span>
<span class="line"><span>lineplot(C2,&quot;C2&quot;,shortquantity2,Coverdisplaytext);</span></span>
<span class="line"><span>lineplot(C3,&quot;C3&quot;,shortquantity3,Coverdisplaytext);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if(EnableAlgo != &quot;Disable&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    lasttime = StrFormat(&quot;%0.f&quot;,LastValue(BarIndex()));</span></span>
<span class="line"><span>    SetChartBkColor(colorDarkGrey);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>if(IntradayMode==&quot;ON&quot; AND LastValue(TimeNum())== ExitTradeTime AND Nz(StaticVarGet(staticvar+&quot;SquareOff&quot;))==0)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span></span></span>
<span class="line"><span>tradeboard.ExitOrder(&quot;SELL&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;SquareOffIndex&quot;,LastValue(BarIndex()));</span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;SquareOff&quot;,1);</span></span>
<span class="line"><span>_TRACE(&quot;Squareoff Alert Triggered&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if(BuyMode==0 AND LastValue(Cross(H,B1)) AND Nz(StaticVarGet(staticvar+&quot;B1&quot;))==0)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if((IntradayMode==&quot;ON&quot; AND LastValue(TimeNum())&gt;= StartTradeTime AND LastValue(TimeNum()) &lt;= EndTradeTime) OR IntradayMode==&quot;OFF&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span></span></span>
<span class="line"><span>tradeboard.placeorder(&quot;BUY&quot;,buyquantity1);</span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;B1index&quot;,LastValue(BarIndex()));</span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;B1&quot;,1);</span></span>
<span class="line"><span>_TRACE(&quot;Buy Above B1 Triggered&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if(BuyMode==1 AND LastValue(Cross(B1,L)) AND Nz(StaticVarGet(staticvar+&quot;B1&quot;))==0)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>if((IntradayMode==&quot;ON&quot; AND LastValue(TimeNum())&gt;= StartTradeTime AND LastValue(TimeNum()) &lt;= EndTradeTime) OR IntradayMode==&quot;OFF&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>tradeboard.placeorder(&quot;BUY&quot;,buyquantity1);</span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;B1index&quot;,LastValue(BarIndex()));</span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;B1&quot;,1);</span></span>
<span class="line"><span>_TRACE(&quot;Buy Below B1 Triggered&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if(BuyMode==0 AND LastValue(Cross(H,B2)) AND Nz(StaticVarGet(staticvar+&quot;B2&quot;))==0)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>if((IntradayMode==&quot;ON&quot; AND LastValue(TimeNum())&gt;= StartTradeTime AND LastValue(TimeNum()) &lt;= EndTradeTime) OR IntradayMode==&quot;OFF&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>tradeboard.placeorder(&quot;BUY&quot;,buyquantity2);</span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;B2index&quot;,LastValue(BarIndex()));</span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;B2&quot;,1);</span></span>
<span class="line"><span>_TRACE(&quot;Buy Above B2 Triggered&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if(BuyMode==1 AND LastValue(Cross(B2,L)) AND Nz(StaticVarGet(staticvar+&quot;B2&quot;))==0)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>if((IntradayMode==&quot;ON&quot; AND LastValue(TimeNum())&gt;= StartTradeTime AND LastValue(TimeNum()) &lt;= EndTradeTime) OR IntradayMode==&quot;OFF&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>tradeboard.placeorder(&quot;BUY&quot;,buyquantity2);</span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;B2index&quot;,LastValue(BarIndex()));</span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;B2&quot;,1);</span></span>
<span class="line"><span>_TRACE(&quot;Buy Below B2 Triggered&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if(BuyMode==0 AND LastValue(Cross(H,B3)) AND Nz(StaticVarGet(staticvar+&quot;B3&quot;))==0)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>if((IntradayMode==&quot;ON&quot; AND LastValue(TimeNum())&gt;= StartTradeTime AND LastValue(TimeNum()) &lt;= EndTradeTime) OR IntradayMode==&quot;OFF&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>tradeboard.placeorder(&quot;BUY&quot;,buyquantity3);</span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;B3index&quot;,LastValue(BarIndex()));</span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;B3&quot;,1);</span></span>
<span class="line"><span>_TRACE(&quot;Buy Above B3 Triggered&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if(BuyMode==1 AND LastValue(Cross(B3,L)) AND Nz(StaticVarGet(staticvar+&quot;B3&quot;))==0)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>if((IntradayMode==&quot;ON&quot; AND LastValue(TimeNum())&gt;= StartTradeTime AND LastValue(TimeNum()) &lt;= EndTradeTime) OR IntradayMode==&quot;OFF&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>tradeboard.placeorder(&quot;BUY&quot;,buyquantity3);</span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;B3index&quot;,LastValue(BarIndex()));</span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;B3&quot;,1);</span></span>
<span class="line"><span>_TRACE(&quot;Buy Below B3 Triggered&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if(SellMode==0 AND LastValue(Cross(H,X1)) AND Nz(StaticVarGet(staticvar+&quot;X1&quot;))==0)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>if((IntradayMode==&quot;ON&quot; AND LastValue(TimeNum())&gt;= StartTradeTime AND LastValue(TimeNum()) &lt;= EndTradeTime) OR IntradayMode==&quot;OFF&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if(ExitPos==&quot;CURRENT&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>//If positive open positions are there only then exit the Current Order Quantity </span></span>
<span class="line"><span>tradeboard.placeorder(&quot;SELL&quot;,buyquantity1);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>if(ExitPos==&quot;ALLOPENPOSITIONS&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>//If positive open positions are there only then exit the All Open Positions </span></span>
<span class="line"><span>tradeboard.ExitOrder(&quot;SELL&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;X1index&quot;,LastValue(BarIndex()));</span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;X1&quot;,1);</span></span>
<span class="line"><span>_TRACE(&quot;Sell Above X1 Triggered&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if(SellMode==1 AND LastValue(Cross(X1,L)) AND Nz(StaticVarGet(staticvar+&quot;X1&quot;))==0)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>if((IntradayMode==&quot;ON&quot; AND LastValue(TimeNum())&gt;= StartTradeTime AND LastValue(TimeNum()) &lt;= EndTradeTime) OR IntradayMode==&quot;OFF&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if(ExitPos==&quot;CURRENT&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>//If positive open positions are there only then exit the Current Order Quantity </span></span>
<span class="line"><span>tradeboard.placeorder(&quot;SELL&quot;,buyquantity1);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>if(ExitPos==&quot;ALLOPENPOSITIONS&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>//If positive open positions are there only then exit the All Open Positions </span></span>
<span class="line"><span>tradeboard.ExitOrder(&quot;SELL&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;X1index&quot;,LastValue(BarIndex()));</span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;X1&quot;,1);</span></span>
<span class="line"><span>_TRACE(&quot;Sell Below X1 Triggered&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>if(SellMode==0 AND LastValue(Cross(H,X2)) AND Nz(StaticVarGet(staticvar+&quot;X2&quot;))==0)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>if((IntradayMode==&quot;ON&quot; AND LastValue(TimeNum())&gt;= StartTradeTime AND LastValue(TimeNum()) &lt;= EndTradeTime) OR IntradayMode==&quot;OFF&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if(ExitPos==&quot;CURRENT&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>//If positive open positions are there only then exit the Current Order Quantity </span></span>
<span class="line"><span>tradeboard.placeorder(&quot;SELL&quot;,buyquantity2);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>if(ExitPos==&quot;ALLOPENPOSITIONS&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>//If positive open positions are there only then exit the All Open Positions </span></span>
<span class="line"><span>tradeboard.ExitOrder(&quot;SELL&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;X2index&quot;,LastValue(BarIndex()));</span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;X2&quot;,1);</span></span>
<span class="line"><span>_TRACE(&quot;Sell Above X2 Triggered&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>if(SellMode==1 AND LastValue(Cross(X2,L)) AND Nz(StaticVarGet(staticvar+&quot;X2&quot;))==0)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>if((IntradayMode==&quot;ON&quot; AND TimeNum()== ExitTradeTime) OR IntradayMode==&quot;OFF&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if(ExitPos==&quot;CURRENT&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>//If positive open positions are there only then exit the Current Order Quantity </span></span>
<span class="line"><span>tradeboard.placeorder(&quot;SELL&quot;,buyquantity2);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>if(ExitPos==&quot;ALLOPENPOSITIONS&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>//If positive open positions are there only then exit the All Open Positions </span></span>
<span class="line"><span>tradeboard.ExitOrder(&quot;SELL&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;X2index&quot;,LastValue(BarIndex()));</span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;X2&quot;,1);</span></span>
<span class="line"><span>_TRACE(&quot;Sell Below X2 Triggered&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>if(SellMode==0 AND LastValue(Cross(H,X3)) AND Nz(StaticVarGet(staticvar+&quot;X3&quot;))==0)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>if((IntradayMode==&quot;ON&quot; AND LastValue(TimeNum())&gt;= StartTradeTime AND LastValue(TimeNum()) &lt;= EndTradeTime) OR IntradayMode==&quot;OFF&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if(ExitPos==&quot;CURRENT&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>//If positive open positions are there only then exit the Current Order Quantity </span></span>
<span class="line"><span>tradeboard.placeorder(&quot;SELL&quot;,buyquantity3);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>if(ExitPos==&quot;ALLOPENPOSITIONS&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>//If positive open positions are there only then exit the All Open Positions </span></span>
<span class="line"><span>tradeboard.ExitOrder(&quot;SELL&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;X3index&quot;,LastValue(BarIndex()));</span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;X3&quot;,1);</span></span>
<span class="line"><span>_TRACE(&quot;Sell Above X3 Triggered&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>if(SellMode==1 AND LastValue(Cross(X3,L)) AND Nz(StaticVarGet(staticvar+&quot;X3&quot;))==0)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>if((IntradayMode==&quot;ON&quot; AND LastValue(TimeNum())&gt;= StartTradeTime AND LastValue(TimeNum()) &lt;= EndTradeTime) OR IntradayMode==&quot;OFF&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if(ExitPos==&quot;CURRENT&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>//If positive open positions are there only then exit the Current Order Quantity </span></span>
<span class="line"><span>tradeboard.placeorder(&quot;SELL&quot;,buyquantity3);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>if(ExitPos==&quot;ALLOPENPOSITIONS&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>//If positive open positions are there only then exit the All Open Positions </span></span>
<span class="line"><span>tradeboard.ExitOrder(&quot;SELL&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;X3index&quot;,LastValue(BarIndex()));</span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;X3&quot;,1);</span></span>
<span class="line"><span>_TRACE(&quot;Sell Below X3 Triggered&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if(ShortMode==0 AND LastValue(Cross(H,S1)) AND Nz(StaticVarGet(staticvar+&quot;S1&quot;))==0)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>if((IntradayMode==&quot;ON&quot; AND LastValue(TimeNum())&gt;= StartTradeTime AND LastValue(TimeNum()) &lt;= EndTradeTime) OR IntradayMode==&quot;OFF&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>tradeboard.placeorder(&quot;SELL&quot;,shortquantity1);</span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;S1index&quot;,LastValue(BarIndex()));</span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;S1&quot;,1);</span></span>
<span class="line"><span>_TRACE(&quot;Short Above S1 Triggered&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if(ShortMode==1 AND LastValue(Cross(S1,L)) AND Nz(StaticVarGet(staticvar+&quot;S1&quot;))==0)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>if((IntradayMode==&quot;ON&quot; AND LastValue(TimeNum())&gt;= StartTradeTime AND LastValue(TimeNum()) &lt;= EndTradeTime) OR IntradayMode==&quot;OFF&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>tradeboard.placeorder(&quot;SELL&quot;,shortquantity1);</span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;S1index&quot;,LastValue(BarIndex()));</span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;S1&quot;,1);</span></span>
<span class="line"><span>_TRACE(&quot;Short Below S1 Triggered&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if(ShortMode==0 AND LastValue(Cross(H,S2)) AND Nz(StaticVarGet(staticvar+&quot;S2&quot;))==0)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>if((IntradayMode==&quot;ON&quot; AND LastValue(TimeNum())&gt;= StartTradeTime AND LastValue(TimeNum()) &lt;= EndTradeTime) OR IntradayMode==&quot;OFF&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>tradeboard.placeorder(&quot;SELL&quot;,shortquantity2);</span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;S2index&quot;,LastValue(BarIndex()));</span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;S2&quot;,1);</span></span>
<span class="line"><span>_TRACE(&quot;Short Above S2 Triggered&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if(ShortMode==1 AND LastValue(Cross(S2,L)) AND Nz(StaticVarGet(staticvar+&quot;S2&quot;))==0)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>if((IntradayMode==&quot;ON&quot; AND LastValue(TimeNum())&gt;= StartTradeTime AND LastValue(TimeNum()) &lt;= EndTradeTime) OR IntradayMode==&quot;OFF&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>tradeboard.placeorder(&quot;SELL&quot;,shortquantity2);</span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;S2index&quot;,LastValue(BarIndex()));</span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;S2&quot;,1);</span></span>
<span class="line"><span>_TRACE(&quot;Short Below S2 Triggered&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if(ShortMode==0 AND LastValue(Cross(H,S3)) AND Nz(StaticVarGet(staticvar+&quot;S3&quot;))==0)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>if((IntradayMode==&quot;ON&quot; AND LastValue(TimeNum())&gt;= StartTradeTime AND LastValue(TimeNum()) &lt;= EndTradeTime) OR IntradayMode==&quot;OFF&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>tradeboard.placeorder(&quot;SELL&quot;,shortquantity3);</span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;S3index&quot;,LastValue(BarIndex()));</span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;S3&quot;,1);</span></span>
<span class="line"><span>_TRACE(&quot;Short Above S3 Triggered&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if(ShortMode==1 AND LastValue(Cross(S3,L)) AND Nz(StaticVarGet(staticvar+&quot;S3&quot;))==0)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>if((IntradayMode==&quot;ON&quot; AND LastValue(TimeNum())&gt;= StartTradeTime AND LastValue(TimeNum()) &lt;= EndTradeTime) OR IntradayMode==&quot;OFF&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>tradeboard.placeorder(&quot;SELL&quot;,shortquantity3);</span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;S3index&quot;,LastValue(BarIndex()));</span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;S3&quot;,1);</span></span>
<span class="line"><span>_TRACE(&quot;Short Below S3 Triggered&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if(CoverMode==0 AND LastValue(Cross(H,C1)) AND Nz(StaticVarGet(staticvar+&quot;C1&quot;))==0)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>if((IntradayMode==&quot;ON&quot; AND LastValue(TimeNum())&gt;= StartTradeTime AND LastValue(TimeNum()) &lt;= EndTradeTime) OR IntradayMode==&quot;OFF&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if(ExitPos==&quot;CURRENT&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>//If positive open positions are there only then exit the Current Order Quantity </span></span>
<span class="line"><span>tradeboard.PlaceOrder(&quot;BUY&quot;,shortquantity1);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>if(ExitPos==&quot;ALLOPENPOSITIONS&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>//If positive open positions are there only then exit the All Open Positions </span></span>
<span class="line"><span>tradeboard.ExitOrder(&quot;BUY&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;C1index&quot;,LastValue(BarIndex()));</span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;C1&quot;,1);</span></span>
<span class="line"><span>_TRACE(&quot;Cover Above C1 Triggered&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if(CoverMode==1 AND LastValue(Cross(C1,L)) AND Nz(StaticVarGet(staticvar+&quot;C1&quot;))==0)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>if((IntradayMode==&quot;ON&quot; AND LastValue(TimeNum())&gt;= StartTradeTime AND LastValue(TimeNum()) &lt;= EndTradeTime) OR IntradayMode==&quot;OFF&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if(ExitPos==&quot;CURRENT&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>//If positive open positions are there only then exit the Current Order Quantity </span></span>
<span class="line"><span>tradeboard.PlaceOrder(&quot;BUY&quot;,shortquantity1);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>if(ExitPos==&quot;ALLOPENPOSITIONS&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>//If positive open positions are there only then exit the All Open Positions </span></span>
<span class="line"><span>tradeboard.ExitOrder(&quot;BUY&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;C1index&quot;,LastValue(BarIndex()));</span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;C1&quot;,1);</span></span>
<span class="line"><span>_TRACE(&quot;Cover Below C1 Triggered&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if(CoverMode==0 AND LastValue(Cross(H,C2)) AND Nz(StaticVarGet(staticvar+&quot;C2&quot;))==0)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>if((IntradayMode==&quot;ON&quot; AND LastValue(TimeNum())&gt;= StartTradeTime AND LastValue(TimeNum()) &lt;= EndTradeTime) OR IntradayMode==&quot;OFF&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if(ExitPos==&quot;CURRENT&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>//If positive open positions are there only then exit the Current Order Quantity </span></span>
<span class="line"><span>tradeboard.PlaceOrder(&quot;BUY&quot;,shortquantity2);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>if(ExitPos==&quot;ALLOPENPOSITIONS&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>//If positive open positions are there only then exit the All Open Positions </span></span>
<span class="line"><span>tradeboard.ExitOrder(&quot;BUY&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;C2index&quot;,LastValue(BarIndex()));</span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;C2&quot;,1);</span></span>
<span class="line"><span>_TRACE(&quot;Cover Above C2 Triggered&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>if(CoverMode==1 AND LastValue(Cross(C2,L)) AND Nz(StaticVarGet(staticvar+&quot;C2&quot;))==0)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>if((IntradayMode==&quot;ON&quot; AND LastValue(TimeNum())&gt;= StartTradeTime AND LastValue(TimeNum()) &lt;= EndTradeTime) OR IntradayMode==&quot;OFF&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if(ExitPos==&quot;CURRENT&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>//If positive open positions are there only then exit the Current Order Quantity </span></span>
<span class="line"><span>tradeboard.PlaceOrder(&quot;BUY&quot;,shortquantity2);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>if(ExitPos==&quot;ALLOPENPOSITIONS&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>//If positive open positions are there only then exit the All Open Positions </span></span>
<span class="line"><span>tradeboard.ExitOrder(&quot;BUY&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;C2index&quot;,LastValue(BarIndex()));</span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;C2&quot;,1);</span></span>
<span class="line"><span>_TRACE(&quot;Cover Below C2 Triggered&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if(CoverMode==0 AND LastValue(Cross(H,C3)) AND Nz(StaticVarGet(staticvar+&quot;C3&quot;))==0)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>if((IntradayMode==&quot;ON&quot; AND LastValue(TimeNum())&gt;= StartTradeTime AND LastValue(TimeNum()) &lt;= EndTradeTime) OR IntradayMode==&quot;OFF&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if(ExitPos==&quot;CURRENT&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>//If positive open positions are there only then exit the Current Order Quantity </span></span>
<span class="line"><span>tradeboard.PlaceOrder(&quot;BUY&quot;,shortquantity3);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>if(ExitPos==&quot;ALLOPENPOSITIONS&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>//If positive open positions are there only then exit the All Open Positions </span></span>
<span class="line"><span>tradeboard.ExitOrder(&quot;BUY&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;C3index&quot;,LastValue(BarIndex()));</span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;C3&quot;,1);</span></span>
<span class="line"><span>_TRACE(&quot;Cover Above C3 Triggered&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if(CoverMode==1 AND LastValue(Cross(C3,L)) AND Nz(StaticVarGet(staticvar+&quot;C3&quot;))==0)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>if((IntradayMode==&quot;ON&quot; AND LastValue(TimeNum())&gt;= StartTradeTime AND LastValue(TimeNum()) &lt;= EndTradeTime) OR IntradayMode==&quot;OFF&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if(ExitPos==&quot;CURRENT&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>//If positive open positions are there only then exit the Current Order Quantity </span></span>
<span class="line"><span>tradeboard.PlaceOrder(&quot;BUY&quot;,shortquantity3);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>if(ExitPos==&quot;ALLOPENPOSITIONS&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>//If positive open positions are there only then exit the All Open Positions </span></span>
<span class="line"><span>tradeboard.ExitOrder(&quot;BUY&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;C3index&quot;,LastValue(BarIndex()));</span></span>
<span class="line"><span>StaticVarSet(staticvar+&quot;C3&quot;,1);</span></span>
<span class="line"><span>_TRACE(&quot;Cover Below C3 Triggered&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//Plot Signals and Arrows</span></span>
<span class="line"><span>PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+&quot;B1index&quot;), shapeSquare, shapeNone),colorGreen, 0, L, Offset=-40);</span></span>
<span class="line"><span>PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+&quot;B1index&quot;), shapeSquare, shapeNone),colorLime, 0,L, Offset=-50);                      </span></span>
<span class="line"><span>PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+&quot;B1index&quot;), shapeUpArrow, shapeNone),colorWhite, 0,L, Offset=-45);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+&quot;B2index&quot;), shapeSquare, shapeNone),colorGreen, 0, L, Offset=-40);</span></span>
<span class="line"><span>PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+&quot;B2index&quot;), shapeSquare, shapeNone),colorLime, 0,L, Offset=-50);                      </span></span>
<span class="line"><span>PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+&quot;B2index&quot;), shapeUpArrow, shapeNone),colorWhite, 0,L, Offset=-45);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+&quot;B3index&quot;), shapeSquare, shapeNone),colorGreen, 0, L, Offset=-40);</span></span>
<span class="line"><span>PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+&quot;B3index&quot;), shapeSquare, shapeNone),colorLime, 0,L, Offset=-50);                      </span></span>
<span class="line"><span>PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+&quot;B3index&quot;), shapeUpArrow, shapeNone),colorWhite, 0,L, Offset=-45);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+&quot;S1index&quot;), shapeSquare, shapeNone),colorRed, 0, H, Offset=40);</span></span>
<span class="line"><span>PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+&quot;S1index&quot;), shapeSquare, shapeNone),colorOrange, 0,H, Offset=50);                      </span></span>
<span class="line"><span>PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+&quot;S1index&quot;), shapeDownArrow, shapeNone),colorWhite, 0,H, Offset=-45);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+&quot;S2index&quot;), shapeSquare, shapeNone),colorRed, 0, H, Offset=40);</span></span>
<span class="line"><span>PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+&quot;S2index&quot;), shapeSquare, shapeNone),colorOrange, 0,H, Offset=50);                      </span></span>
<span class="line"><span>PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+&quot;S2index&quot;), shapeDownArrow, shapeNone),colorWhite, 0,H, Offset=-45);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+&quot;S3index&quot;), shapeSquare, shapeNone),colorRed, 0, H, Offset=40);</span></span>
<span class="line"><span>PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+&quot;S3index&quot;), shapeSquare, shapeNone),colorOrange, 0,H, Offset=50);                      </span></span>
<span class="line"><span>PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+&quot;S3index&quot;), shapeDownArrow, shapeNone),colorWhite, 0,H, Offset=-45);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+&quot;X1index&quot;),  shapeStar,shapeNone), colorBrightGreen, 0, High, 12);</span></span>
<span class="line"><span>PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+&quot;X2index&quot;),  shapeStar,shapeNone), colorBrightGreen, 0, High, 12);</span></span>
<span class="line"><span>PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+&quot;X3index&quot;),  shapeStar,shapeNone), colorBrightGreen, 0, High, 12);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+&quot;C1index&quot;),  shapeStar,shapeNone), colorRed, 0, Low, -12);</span></span>
<span class="line"><span>PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+&quot;C2index&quot;),  shapeStar,shapeNone), colorRed, 0, Low, -12);</span></span>
<span class="line"><span>PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+&quot;C3index&quot;),  shapeStar,shapeNone), colorRed, 0, Low, -12);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if(IntradayMode==&quot;ON&quot;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>PlotShapes(IIf(BarIndex()==StaticVarGet(staticvar+&quot;SquareOffIndex&quot;),  shapeStar,shapeNone), colorYellow, 0, Low, -12);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>_SECTION_END();</span></span></code></pre></div><h3 id="smart-order-exits" tabindex="-1"><strong>Smart Order Exits</strong> <a class="header-anchor" href="#smart-order-exits" aria-label="Permalink to &quot;**Smart Order Exits**&quot;">​</a></h3><ul><li><p><strong>Smart Orders</strong> are enabled while exiting the position.</p></li><li><p>If there are no open positions and if exit orders are triggered then those orders are <strong>smartly ignored</strong>.</p></li><li><p>Provision to close only <strong>Current Quantity</strong> and <strong>All Open Positions</strong> is provided so that traders can flexibly use their own exit methods</p></li></ul><h3 id="requirements" tabindex="-1"><strong>Requirements</strong> <a class="header-anchor" href="#requirements" aria-label="Permalink to &quot;**Requirements**&quot;">​</a></h3><ul><li><p>Tradeboard Downloaded and Configured</p></li><li><p>Tradeboard Supported Broker</p></li><li><p>Amibroker 6.0 or Higher</p></li><li><p>Realtime Datafeed Subscription</p></li></ul><h3 id="type-of-entry-and-exits-amibroker-terms" tabindex="-1"><strong>Type of Entry and Exits (Amibroker Terms)</strong> <a class="header-anchor" href="#type-of-entry-and-exits-amibroker-terms" aria-label="Permalink to &quot;**Type of Entry and Exits (Amibroker Terms)**&quot;">​</a></h3><p>where the characters ‘B’. ‘X’, ‘S’, ‘C’ are used along with horizontal or trendline study names.</p><figure><img src="`+o+'" alt=""><figcaption></figcaption></figure><h3 id="type-of-trendline-signals" tabindex="-1">Type of Trendline Signals <a class="header-anchor" href="#type-of-trendline-signals" aria-label="Permalink to &quot;Type of Trendline Signals&quot;">​</a></h3><br><figure><img src="'+l+'" alt=""><figcaption></figcaption></figure><h3 id="type-of-entry-and-exit-trendlines" tabindex="-1">Type of Entry and Exit Trendlines <a class="header-anchor" href="#type-of-entry-and-exit-trendlines" aria-label="Permalink to &quot;Type of Entry and Exit Trendlines&quot;">​</a></h3><br><figure><img src="'+i+'" alt=""><figcaption></figcaption></figure><h3 id="drawing-trend-line-and-assigning-study-name" tabindex="-1">Drawing Trend Line and Assigning Study Name <a class="header-anchor" href="#drawing-trend-line-and-assigning-study-name" aria-label="Permalink to &quot;Drawing Trend Line and Assigning Study Name&quot;">​</a></h3><br><figure><img src="'+u+'" alt=""><figcaption><p>Drawing trendlines and Assigning study ID</p></figcaption></figure><h3 id="pyramiding-and-pyramiding-settings-with-targets" tabindex="-1">Pyramiding and Pyramiding Settings with Targets <a class="header-anchor" href="#pyramiding-and-pyramiding-settings-with-targets" aria-label="Permalink to &quot;Pyramiding and Pyramiding Settings with Targets&quot;">​</a></h3><br><figure><img src="'+r+'" alt=""><figcaption><p>Using Line Automation for Pyramiding</p></figcaption></figure><h3 id="creating-multiple-entries-and-multiple-stops-using-line-automation-module" tabindex="-1">Creating Multiple Entries and Multiple Stops using Line Automation Module <a class="header-anchor" href="#creating-multiple-entries-and-multiple-stops-using-line-automation-module" aria-label="Permalink to &quot;Creating Multiple Entries and Multiple Stops using Line Automation Module&quot;">​</a></h3><br><figure><img src="'+q+'" alt=""><figcaption><p>Using Line Automation with Multiple Long Entry and Long Exit Signals</p></figcaption></figure>',29)])])}const L=s(c,[["render",d]]);export{x as __pageData,L as default};
