import{_ as n,o as a,c as p,a2 as t}from"./chunks/framework.BXzK3EA4.js";const m=JSON.parse('{"title":"Time Based Execution","description":"","frontmatter":{},"headers":[],"relativePath":"trading-platform/amibroker/time-based-execution.md","filePath":"trading-platform/amibroker/time-based-execution.md"}'),e={name:"trading-platform/amibroker/time-based-execution.md"};function l(o,s,i,u,c,q){return a(),p("div",null,[...s[0]||(s[0]=[t(`<h1 id="time-based-execution" tabindex="-1">Time Based Execution <a class="header-anchor" href="#time-based-execution" aria-label="Permalink to &quot;Time Based Execution&quot;">​</a></h1><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>//Rajeev Upadhyay - Creator of Tradeboard</span></span>
<span class="line"><span>//website - tradeboard.in / marketcalls.in</span></span>
<span class="line"><span>//Tradeboard - Amibroker TimeBased Execution Module v1.0</span></span>
<span class="line"><span>//Date - 23/08/2024</span></span>
<span class="line"><span></span></span>
<span class="line"><span>_SECTION_BEGIN(&quot;Tradeboard Trading Controls&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>RequestTimedRefresh(0.1,False);</span></span>
<span class="line"><span>EnableTextOutput(False);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>apikey = ParamStr(&quot;Tradeboard API Key&quot;, &quot;******&quot;);</span></span>
<span class="line"><span>strategy = ParamStr(&quot;Strategy&quot;, &quot;Amibroker&quot;);</span></span>
<span class="line"><span>symbol = ParamStr(&quot;Symbol&quot;, &quot;YESBANK&quot;);</span></span>
<span class="line"><span>exchange = ParamList(&quot;Exchange&quot;, &quot;NSE|NFO|BSE|MCX|CDS&quot;);</span></span>
<span class="line"><span>pricetype = ParamStr(&quot;Price Type&quot;, &quot;MARKET&quot;);</span></span>
<span class="line"><span>product = ParamList(&quot;Product&quot;, &quot;MIS|NRML|CNC&quot;);</span></span>
<span class="line"><span>quantity = Param(&quot;Quantity&quot;, 1,1,1000,1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>entrytime = ParamTime(&quot;Entry Time&quot;,&quot;19:50:00&quot;);</span></span>
<span class="line"><span>exittime = ParamTime(&quot;Exit Time&quot;,&quot;19:51:00&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>host = ParamStr(&quot;host&quot;,&quot;http://127.0.0.1:5000&quot;);</span></span>
<span class="line"><span>ver = ParamStr(&quot;API Version&quot;,&quot;v1&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>VoiceAlert = ParamList(&quot;Voice Alert&quot;,&quot;Disable|Enable&quot;,1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>EnableAlgo = ParamList(&quot;AlgoStatus&quot;,&quot;Disable|Enable&quot;,0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>bridgeurl = host+&quot;/api/&quot;+ver;</span></span>
<span class="line"><span>resp = &quot;&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static_name_ = Name()+GetChartID()+interval(2)+strategy;</span></span>
<span class="line"><span>static_name_algo = static_name_+interval(2)+strategy+&quot;algostatus&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>printf(&quot;\\n-----------Current Time-----------&quot;);</span></span>
<span class="line"><span>printf(&quot;\\nThe time is &quot;+Now(4));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>printf(&quot;\\n\\n\\n-----------Internal Memory-----------&quot;);</span></span>
<span class="line"><span>printf(&quot;\\nEntry Time :&quot;+entrytime);</span></span>
<span class="line"><span>printf(&quot;\\nEntry Time Enabled :&quot;+StaticVarGet(static_name_+&quot;EntryTime&quot;));</span></span>
<span class="line"><span>printf(&quot;\\nExit Time :&quot;+exittime);</span></span>
<span class="line"><span>printf(&quot;\\nExit Time Enabled :&quot;+StaticVarGet(static_name_+&quot;ExitTime&quot;));</span></span>
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
<span class="line"><span>%&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>tradeboard = GetScriptObject();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if(EnableAlgo != &quot;Disable&quot;)</span></span>
<span class="line"><span>	{</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>		</span></span>
<span class="line"><span>		if( Now(4)&gt;=entrytime AND Nz(StaticVarGet(static_name_+&quot;EntryTime&quot;))==0 ) </span></span>
<span class="line"><span>			{</span></span>
<span class="line"><span>				tradeboard.placeorder(&quot;BUY&quot;,quantity);</span></span>
<span class="line"><span>				if(VoiceAlert == &quot;Enable&quot;){</span></span>
<span class="line"><span>						Say(&quot;Buy Order Triggered&quot;);  	</span></span>
<span class="line"><span>					}</span></span>
<span class="line"><span>				_TRACE(&quot;API Request : &quot;+api_request);</span></span>
<span class="line"><span>				_TRACE(&quot;API Response : &quot;+api_response);</span></span>
<span class="line"><span>				</span></span>
<span class="line"><span>				StaticVarSet(static_name_+&quot;EntryTime&quot;,1); </span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>		else if(Now(4)&lt;entrytime)</span></span>
<span class="line"><span>			{</span></span>
<span class="line"><span>				StaticVarSet(static_name_+&quot;EntryTime&quot;,0); </span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>			</span></span>
<span class="line"><span>		if( Now(4)&gt;=exittime AND Nz(StaticVarGet(static_name_+&quot;ExitTime&quot;))==0 ) </span></span>
<span class="line"><span>			{</span></span>
<span class="line"><span>				tradeboard.placeorder(&quot;SELL&quot;,quantity);</span></span>
<span class="line"><span>				if(VoiceAlert == &quot;Enable&quot;){</span></span>
<span class="line"><span>						Say(&quot;Sell Order Triggered&quot;);  	</span></span>
<span class="line"><span>					}</span></span>
<span class="line"><span>				_TRACE(&quot;API Request : &quot;+api_request);</span></span>
<span class="line"><span>				_TRACE(&quot;API Response : &quot;+api_response);</span></span>
<span class="line"><span>				</span></span>
<span class="line"><span>				StaticVarSet(static_name_+&quot;ExitTime&quot;,1); </span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>		else if(Now(4)&lt;exittime)</span></span>
<span class="line"><span>			{</span></span>
<span class="line"><span>				StaticVarSet(static_name_+&quot;ExitTime&quot;,0); </span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>			</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>_SECTION_END();</span></span>
<span class="line"><span>			</span></span>
<span class="line"><span>			</span></span>
<span class="line"><span>_SECTION_BEGIN(&quot;Candlestick Charts with Date &amp; Time Axis&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//Enable the Date &amp; Time Axis</span></span>
<span class="line"><span>SetChartOptions(0, chartShowArrows | chartShowDates);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//Plotting Candlestick charts</span></span>
<span class="line"><span>Plot(Close,&quot;Candle&quot;,colorDefault,styleCandle);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>_SECTION_END();</span></span></code></pre></div>`,2)])])}const d=n(e,[["render",l]]);export{m as __pageData,d as default};
