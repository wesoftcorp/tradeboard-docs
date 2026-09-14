import{_ as n,o as a,c as p,a2 as t}from"./chunks/framework.BXzK3EA4.js";const g=JSON.parse('{"title":"Spot/Futures to Options Module (Two Leg)","description":"","frontmatter":{},"headers":[],"relativePath":"trading-platform/amibroker/spot-futures-to-options-module-two-leg.md","filePath":"trading-platform/amibroker/spot-futures-to-options-module-two-leg.md"}'),e={name:"trading-platform/amibroker/spot-futures-to-options-module-two-leg.md"};function l(o,s,i,c,u,r){return a(),p("div",null,[...s[0]||(s[0]=[t(`<h1 id="spot-futures-to-options-module-two-leg" tabindex="-1">Spot/Futures to Options Module (Two Leg) <a class="header-anchor" href="#spot-futures-to-options-module-two-leg" aria-label="Permalink to &quot;Spot/Futures to Options Module (Two Leg)&quot;">​</a></h1><p><strong>What is a Two-Legged Options Strategy</strong>?</p><p>A two-legged options trading strategy involves buying or selling two options at the same time, typically with different strike prices or expiration dates. The strategy is designed to take advantage of the price difference between the two options and can be used for a variety of purposes, such as hedging, speculation, or income generation.</p><p><strong>Features of the Two-Legged Options Execution Module</strong></p><p>1)Simple Drag and Drop Module on top of any Amibroker trading strategy with the proper buy, sell, short, and cover defined variables.<br> 2)Configure various styles of two-legged options execution strategies. Supports 9 types of two-legged options trading strategies.<br> 3)Configure separate options trading strategies for long-entry and short-entry signals in spot/futures charts<br> 4)Place Smart Option Orders to intelligent send orders by manipulating the current existing positions.<br> 5)Option Strike calculation at Amibroker end (Trades can configure the Underlying symbol as Spot./Futures) based on their trading requirement) accordingly, options strikes will be calculated.</p><div class="language-clike vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">clike</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>/* </span></span>
<span class="line"><span>Tradeboard - Smart Spot/Futures to Two Leg Options Trading Module v2.0</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Supported Two Leg Strategies:</span></span>
<span class="line"><span>1) Credit Spread</span></span>
<span class="line"><span>2) Debit Spread</span></span>
<span class="line"><span>3) Straddle</span></span>
<span class="line"><span>4) Strangle</span></span>
<span class="line"><span>5) Synthetic Futures</span></span>
<span class="line"><span>6) Diagonal Spread</span></span>
<span class="line"><span>7) Calendar Spread</span></span>
<span class="line"><span>8) Ratio Spread</span></span>
<span class="line"><span>9) Ratio Back Spread</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Created By: Rajeev Upadhyay (Founder - Tradeboard / Creator - Tradeboard)</span></span>
<span class="line"><span>Original: 24 Nov 2025</span></span>
<span class="line"><span>Updated: Uses OptionsMultiOrder API for server-side multi-leg execution</span></span>
<span class="line"><span>Fixed: ExtractLegValue function for proper API response parsing</span></span>
<span class="line"><span>Website: www.marketcalls.in / www.tradeboard.in</span></span>
<span class="line"><span>*/</span></span>
<span class="line"><span></span></span>
<span class="line"><span>_SECTION_BEGIN(&quot;Tradeboard - Two Leg Options Module v2.0&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/* --------------------------------------------------------------------------</span></span>
<span class="line"><span>   Version Check Variable</span></span>
<span class="line"><span>   -------------------------------------------------------------------------- */</span></span>
<span class="line"><span>ReqVer = 6.35;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/* --------------------------------------------------------------------------</span></span>
<span class="line"><span>   Global Variables for GUI</span></span>
<span class="line"><span>   -------------------------------------------------------------------------- */</span></span>
<span class="line"><span>global IDset;</span></span>
<span class="line"><span>IDset = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/* --------------------------------------------------------------------------</span></span>
<span class="line"><span>   Helper Functions - Defined at Global Scope</span></span>
<span class="line"><span>   -------------------------------------------------------------------------- */</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/* Simple JSON value extractor */</span></span>
<span class="line"><span>function ExtractJsonValue(json_str, key_name)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    result = &quot;&quot;;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    /* Find the key in JSON */</span></span>
<span class="line"><span>    search_key = &quot;\\&quot;&quot; + key_name + &quot;\\&quot;:&quot;;</span></span>
<span class="line"><span>    pos = StrFind(json_str, search_key);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    if (pos &gt;= 0)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        /* Move past the key */</span></span>
<span class="line"><span>        start = pos + StrLen(search_key);</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        /* Skip whitespace */</span></span>
<span class="line"><span>        while (start &lt; StrLen(json_str) AND StrMid(json_str, start, 1) == &quot; &quot;)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            start = start + 1;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        /* Check if value is quoted string */</span></span>
<span class="line"><span>        if (StrMid(json_str, start, 1) == &quot;\\&quot;&quot;)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            start = start + 1;  /* Skip opening quote */</span></span>
<span class="line"><span>            end = start;</span></span>
<span class="line"><span>            /* Find closing quote */</span></span>
<span class="line"><span>            while (end &lt; StrLen(json_str) AND StrMid(json_str, end, 1) != &quot;\\&quot;&quot;)</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>                end = end + 1;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            result = StrMid(json_str, start, end - start);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        else</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            /* Numeric or boolean value */</span></span>
<span class="line"><span>            end = start;</span></span>
<span class="line"><span>            while (end &lt; StrLen(json_str))</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>                ch = StrMid(json_str, end, 1);</span></span>
<span class="line"><span>                if (ch == &quot;,&quot; OR ch == &quot;}&quot; OR ch == &quot; &quot;)</span></span>
<span class="line"><span>                {</span></span>
<span class="line"><span>                    break;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                end = end + 1;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            result = StrMid(json_str, start, end - start);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    return result;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/* </span></span>
<span class="line"><span>   Function to extract leg data from optionsmultiorder API response</span></span>
<span class="line"><span>   The API returns: {&quot;results&quot;:[{&quot;leg&quot;:1,&quot;symbol&quot;:&quot;...&quot;,&quot;exchange&quot;:&quot;...&quot;,...},{&quot;leg&quot;:2,...}],&quot;status&quot;:&quot;success&quot;}</span></span>
<span class="line"><span>   leg_num: 1 for first leg, 2 for second leg (matches API &quot;leg&quot; field)</span></span>
<span class="line"><span>   key_name: the field to extract (symbol, exchange, orderid, status, etc.)</span></span>
<span class="line"><span>*/</span></span>
<span class="line"><span>function ExtractLegValue(json_str, leg_num, key_name)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    result = &quot;&quot;;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    /* Build search pattern to find the leg object by &quot;leg&quot;:N */</span></span>
<span class="line"><span>    leg_search = &quot;\\&quot;leg\\&quot;:&quot; + NumToStr(leg_num, 1.0, False);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    /* Find position of this leg marker */</span></span>
<span class="line"><span>    leg_pos = StrFind(json_str, leg_search);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    if (leg_pos &gt;= 0)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        /* Find the start of this leg&#39;s object by searching backwards for { */</span></span>
<span class="line"><span>        obj_start = leg_pos;</span></span>
<span class="line"><span>        while (obj_start &gt; 0 AND StrMid(json_str, obj_start, 1) != &quot;{&quot;)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            obj_start = obj_start - 1;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        /* Find the end of this leg&#39;s object by searching for matching } */</span></span>
<span class="line"><span>        brace_count = 1;</span></span>
<span class="line"><span>        obj_end = obj_start + 1;</span></span>
<span class="line"><span>        while (obj_end &lt; StrLen(json_str) AND brace_count &gt; 0)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            ch = StrMid(json_str, obj_end, 1);</span></span>
<span class="line"><span>            if (ch == &quot;{&quot;)</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>                brace_count = brace_count + 1;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            else if (ch == &quot;}&quot;)</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>                brace_count = brace_count - 1;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            obj_end = obj_end + 1;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        /* Extract the leg object */</span></span>
<span class="line"><span>        leg_obj = StrMid(json_str, obj_start, obj_end - obj_start);</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        /* Now extract the requested key from this leg object */</span></span>
<span class="line"><span>        result = ExtractJsonValue(leg_obj, key_name);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    return result;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/* Function to post multi-leg option order using OptionsMultiOrder API */</span></span>
<span class="line"><span>function PostMultiLegOrder(offset1, opttype1, action1, expiry1, qty1, offset2, opttype2, action2, expiry2, qty2, apikey_val, strategy_val, underlying_val, exchange_val, pricetype_val, product_val, host_val, ver_val)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    url = host_val + &quot;/api/&quot; + ver_val + &quot;/optionsmultiorder&quot;;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    /* Construct JSON request body with legs array */</span></span>
<span class="line"><span>    body = &quot;{\\&quot;apikey\\&quot;: \\&quot;&quot; + apikey_val + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>           &quot;\\&quot;strategy\\&quot;: \\&quot;&quot; + strategy_val + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>           &quot;\\&quot;underlying\\&quot;: \\&quot;&quot; + underlying_val + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>           &quot;\\&quot;exchange\\&quot;: \\&quot;&quot; + exchange_val + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>           &quot;\\&quot;legs\\&quot;: [&quot; +</span></span>
<span class="line"><span>           &quot;{&quot; +</span></span>
<span class="line"><span>           &quot;\\&quot;offset\\&quot;: \\&quot;&quot; + offset1 + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>           &quot;\\&quot;option_type\\&quot;: \\&quot;&quot; + opttype1 + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>           &quot;\\&quot;action\\&quot;: \\&quot;&quot; + action1 + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>           &quot;\\&quot;expiry_date\\&quot;: \\&quot;&quot; + expiry1 + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>           &quot;\\&quot;quantity\\&quot;: &quot; + NumToStr(qty1, 1.0) + &quot;, &quot; +</span></span>
<span class="line"><span>           &quot;\\&quot;pricetype\\&quot;: \\&quot;&quot; + pricetype_val + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>           &quot;\\&quot;product\\&quot;: \\&quot;&quot; + product_val + &quot;\\&quot;&quot; +</span></span>
<span class="line"><span>           &quot;}, &quot; +</span></span>
<span class="line"><span>           &quot;{&quot; +</span></span>
<span class="line"><span>           &quot;\\&quot;offset\\&quot;: \\&quot;&quot; + offset2 + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>           &quot;\\&quot;option_type\\&quot;: \\&quot;&quot; + opttype2 + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>           &quot;\\&quot;action\\&quot;: \\&quot;&quot; + action2 + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>           &quot;\\&quot;expiry_date\\&quot;: \\&quot;&quot; + expiry2 + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>           &quot;\\&quot;quantity\\&quot;: &quot; + NumToStr(qty2, 1.0) + &quot;, &quot; +</span></span>
<span class="line"><span>           &quot;\\&quot;pricetype\\&quot;: \\&quot;&quot; + pricetype_val + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>           &quot;\\&quot;product\\&quot;: \\&quot;&quot; + product_val + &quot;\\&quot;&quot; +</span></span>
<span class="line"><span>           &quot;}&quot; +</span></span>
<span class="line"><span>           &quot;]}&quot;;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    _TRACEF(&quot;Tradeboard OptionsMultiOrder Request: %s&quot;, body);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    /* Set headers */</span></span>
<span class="line"><span>    headers = &quot;Content-Type: application/json\\r\\n&quot; +</span></span>
<span class="line"><span>              &quot;Accept-Encoding: gzip, deflate\\r\\n&quot;;</span></span>
<span class="line"><span>    InternetSetHeaders(headers);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    ih = InternetPostRequest(url, body);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    response = &quot;&quot;;</span></span>
<span class="line"><span>    if (ih)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        while ((line = InternetReadString(ih)) != &quot;&quot;)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            response = response + line;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        _TRACEF(&quot;Tradeboard OptionsMultiOrder Response: %s&quot;, response);</span></span>
<span class="line"><span>        InternetClose(ih);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    else</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        _TRACE(&quot;Tradeboard HTTP post failed&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    return response;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/* Function to exit position using placesmartorder with quantity=0 and position_size=0 */</span></span>
<span class="line"><span>function ExitPosition(sym, exch, product_type, apikey_val, strategy_val, host_val, ver_val)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    /* Build postData for smart exit */</span></span>
<span class="line"><span>    postData = &quot;{\\&quot;apikey\\&quot;: \\&quot;&quot; + apikey_val + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>               &quot;\\&quot;strategy\\&quot;: \\&quot;&quot; + strategy_val + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>               &quot;\\&quot;symbol\\&quot;: \\&quot;&quot; + sym + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>               &quot;\\&quot;action\\&quot;: \\&quot;SELL\\&quot;, &quot; +</span></span>
<span class="line"><span>               &quot;\\&quot;exchange\\&quot;: \\&quot;&quot; + exch + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>               &quot;\\&quot;pricetype\\&quot;: \\&quot;MARKET\\&quot;, &quot; +</span></span>
<span class="line"><span>               &quot;\\&quot;product\\&quot;: \\&quot;&quot; + product_type + &quot;\\&quot;, &quot; +</span></span>
<span class="line"><span>               &quot;\\&quot;quantity\\&quot;: \\&quot;0\\&quot;, &quot; +</span></span>
<span class="line"><span>               &quot;\\&quot;position_size\\&quot;: \\&quot;0\\&quot;}&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    headers = &quot;Content-Type: application/json\\r\\n&quot; +</span></span>
<span class="line"><span>              &quot;Accept-Encoding: gzip, deflate\\r\\n&quot;;</span></span>
<span class="line"><span>    InternetSetHeaders(headers);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    _TRACE(&quot;Exit Order Request Sent: &quot; + postData);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    /* Build URL */</span></span>
<span class="line"><span>    bridgeurl = host_val + &quot;/api/&quot; + ver_val;</span></span>
<span class="line"><span>    ih = InternetPostRequest(bridgeurl + &quot;/placesmartorder&quot;, postData);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    response = &quot;&quot;;</span></span>
<span class="line"><span>    if (ih) </span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        while ((line = InternetReadString(ih)) != &quot;&quot;) </span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            response = response + line;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        _TRACEF(&quot;Exit Order Response: %s&quot;, response);</span></span>
<span class="line"><span>        InternetClose(ih);</span></span>
<span class="line"><span>    } </span></span>
<span class="line"><span>    else </span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        _TRACE(&quot;Failed to place exit order.&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    return response;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/* --------------------------------------------------------------------------</span></span>
<span class="line"><span>   Version Check and Main Code</span></span>
<span class="line"><span>   -------------------------------------------------------------------------- */</span></span>
<span class="line"><span>if (Version() &lt; ReqVer)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    SetChartOptions(0, chartShowDates);</span></span>
<span class="line"><span>    GfxSetBkMode(1);</span></span>
<span class="line"><span>    GfxSetBkColor(colorBlack);</span></span>
<span class="line"><span>    GfxSetTextColor(colorRed);</span></span>
<span class="line"><span>    GfxSelectFont(&quot;Arial&quot;, 16, 700);</span></span>
<span class="line"><span>    GfxTextOut(&quot;This AFL needs AmiBroker 6.35 or later&quot;, 40, 40);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>else</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    /* --------------------------------------------------------------------------</span></span>
<span class="line"><span>       Parameter Definitions</span></span>
<span class="line"><span>       -------------------------------------------------------------------------- */</span></span>
<span class="line"><span>    RequestTimedRefresh(1, False);</span></span>
<span class="line"><span>    EnableTextOutput(False);</span></span>
<span class="line"><span>    SetOption(&quot;StaticVarAutoSave&quot;, 30);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    apikey = ParamStr(&quot;Tradeboard API Key&quot;, &quot;******&quot;);</span></span>
<span class="line"><span>    strategy = ParamStr(&quot;Strategy Name&quot;, &quot;TwoLegOptions&quot;);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    /* Underlying and Exchange Settings */</span></span>
<span class="line"><span>    underlying = ParamList(&quot;Underlying Symbol&quot;, &quot;NIFTY|BANKNIFTY|FINNIFTY|SENSEX|CRUDEOILM&quot;);</span></span>
<span class="line"><span>    exchange = ParamList(&quot;Exchange&quot;, &quot;NSE_INDEX|BSE_INDEX|NFO|BFO|MCX&quot;, 0);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    /* Expiry Settings for Both Legs */</span></span>
<span class="line"><span>    expiry_leg1 = ParamStr(&quot;Expiry Date Leg1 (DDMMMYY)&quot;, &quot;30DEC25&quot;);</span></span>
<span class="line"><span>    expiry_leg2 = ParamStr(&quot;Expiry Date Leg2 (DDMMMYY)&quot;, &quot;30DEC25&quot;);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    /* Lot Size */</span></span>
<span class="line"><span>    LotSize = Param(&quot;Lot Size&quot;, 75, 1, 10000, 1);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    /* ========== BUY SIGNAL LEG CONFIGURATION ========== */</span></span>
<span class="line"><span>    /* Leg 1 (Buy Signal) */</span></span>
<span class="line"><span>    opttype_buyleg1 = ParamList(&quot;Buy Leg1 Option Type&quot;, &quot;CE|PE&quot;, 0);</span></span>
<span class="line"><span>    tradetype_buyleg1 = ParamList(&quot;Buy Leg1 Trade Type&quot;, &quot;BUY|SELL&quot;, 0);</span></span>
<span class="line"><span>    offset_buyleg1 = ParamStr(&quot;Buy Leg1 Offset&quot;, &quot;ATM&quot;);  /* ATM, ITM1, ITM2, OTM1, OTM2 */</span></span>
<span class="line"><span>    quantity_leg1 = Param(&quot;Buy Leg1 Quantity (Lots)&quot;, 1, 0, 100) * LotSize;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    /* Leg 2 (Buy Signal) */</span></span>
<span class="line"><span>    opttype_buyleg2 = ParamList(&quot;Buy Leg2 Option Type&quot;, &quot;CE|PE&quot;, 1);</span></span>
<span class="line"><span>    tradetype_buyleg2 = ParamList(&quot;Buy Leg2 Trade Type&quot;, &quot;BUY|SELL&quot;, 1);</span></span>
<span class="line"><span>    offset_buyleg2 = ParamStr(&quot;Buy Leg2 Offset&quot;, &quot;ATM&quot;);  /* ATM, ITM1, ITM2, OTM1, OTM2 */</span></span>
<span class="line"><span>    quantity_leg2 = Param(&quot;Buy Leg2 Quantity (Lots)&quot;, 1, 0, 100) * LotSize;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    /* ========== SHORT SIGNAL LEG CONFIGURATION ========== */</span></span>
<span class="line"><span>    /* Leg 1 (Short Signal) */</span></span>
<span class="line"><span>    opttype_shortleg1 = ParamList(&quot;Short Leg1 Option Type&quot;, &quot;CE|PE&quot;, 1);</span></span>
<span class="line"><span>    tradetype_shortleg1 = ParamList(&quot;Short Leg1 Trade Type&quot;, &quot;BUY|SELL&quot;, 0);</span></span>
<span class="line"><span>    offset_shortleg1 = ParamStr(&quot;Short Leg1 Offset&quot;, &quot;ATM&quot;);  /* ATM, ITM1, ITM2, OTM1, OTM2 */</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    /* Leg 2 (Short Signal) */</span></span>
<span class="line"><span>    opttype_shortleg2 = ParamList(&quot;Short Leg2 Option Type&quot;, &quot;CE|PE&quot;, 0);</span></span>
<span class="line"><span>    tradetype_shortleg2 = ParamList(&quot;Short Leg2 Trade Type&quot;, &quot;BUY|SELL&quot;, 1);</span></span>
<span class="line"><span>    offset_shortleg2 = ParamStr(&quot;Short Leg2 Offset&quot;, &quot;ATM&quot;);  /* ATM, ITM1, ITM2, OTM1, OTM2 */</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    /* Order Settings */</span></span>
<span class="line"><span>    pricetype = ParamList(&quot;Order Type&quot;, &quot;MARKET&quot;, 0);</span></span>
<span class="line"><span>    product = ParamList(&quot;Product&quot;, &quot;NRML|MIS&quot;, 0);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    /* Connection Settings */</span></span>
<span class="line"><span>    host = ParamStr(&quot;Host&quot;, &quot;http://127.0.0.1:5000&quot;);</span></span>
<span class="line"><span>    ver = ParamStr(&quot;API Version&quot;, &quot;v1&quot;);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    /* Alert and Timing Settings */</span></span>
<span class="line"><span>    VoiceAlert = ParamList(&quot;Voice Alert&quot;, &quot;Disable|Enable&quot;, 1);</span></span>
<span class="line"><span>    EntryDelay = Param(&quot;Entry Delay&quot;, 0, 0, 1, 1);</span></span>
<span class="line"><span>    ExitDelay = Param(&quot;Exit Delay&quot;, 0, 0, 1, 1);</span></span>
<span class="line"><span>    EnableAlgo = ParamList(&quot;AlgoStatus&quot;, &quot;Disable|Enable|LongOnly|ShortOnly&quot;, 0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* --------------------------------------------------------------------------</span></span>
<span class="line"><span>       Chart Settings</span></span>
<span class="line"><span>       -------------------------------------------------------------------------- */</span></span>
<span class="line"><span>    SetChartOptions(0, chartShowArrows | chartShowDates);</span></span>
<span class="line"><span>    _N(Title = StrFormat(&quot;{{NAME}} - {{INTERVAL}} {{DATE}} Open %g, Hi %g, Lo %g, Close %g (%.1f%%) {{VALUES}}&quot;, O, H, L, C, SelectedValue(ROC(C, 1))));</span></span>
<span class="line"><span>    Plot(Close, &quot;Close&quot;, colorDefault, styleNoTitle | ParamStyle(&quot;Style&quot;) | GetPriceStyle());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* --------------------------------------------------------------------------</span></span>
<span class="line"><span>       Static Variable Names for Tracking</span></span>
<span class="line"><span>       -------------------------------------------------------------------------- */</span></span>
<span class="line"><span>    static_name_ = Name() + GetChartID() + interval(2) + strategy;</span></span>
<span class="line"><span>    static_name_algo = static_name_ + &quot;_algostatus&quot;;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    /* Buy Signal Legs Tracking */</span></span>
<span class="line"><span>    static_buyleg1_order = static_name_ + &quot;_buyleg1_order&quot;;</span></span>
<span class="line"><span>    static_buyleg1_symbol = static_name_ + &quot;_buyleg1_symbol&quot;;</span></span>
<span class="line"><span>    static_buyleg1_exchange = static_name_ + &quot;_buyleg1_exchange&quot;;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    static_buyleg2_order = static_name_ + &quot;_buyleg2_order&quot;;</span></span>
<span class="line"><span>    static_buyleg2_symbol = static_name_ + &quot;_buyleg2_symbol&quot;;</span></span>
<span class="line"><span>    static_buyleg2_exchange = static_name_ + &quot;_buyleg2_exchange&quot;;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    /* Short Signal Legs Tracking */</span></span>
<span class="line"><span>    static_shortleg1_order = static_name_ + &quot;_shortleg1_order&quot;;</span></span>
<span class="line"><span>    static_shortleg1_symbol = static_name_ + &quot;_shortleg1_symbol&quot;;</span></span>
<span class="line"><span>    static_shortleg1_exchange = static_name_ + &quot;_shortleg1_exchange&quot;;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    static_shortleg2_order = static_name_ + &quot;_shortleg2_order&quot;;</span></span>
<span class="line"><span>    static_shortleg2_symbol = static_name_ + &quot;_shortleg2_symbol&quot;;</span></span>
<span class="line"><span>    static_shortleg2_exchange = static_name_ + &quot;_shortleg2_exchange&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* --------------------------------------------------------------------------</span></span>
<span class="line"><span>       Tradeboard Dashboard Display</span></span>
<span class="line"><span>       -------------------------------------------------------------------------- */</span></span>
<span class="line"><span>    GfxSelectFont(&quot;BOOK ANTIQUA&quot;, 14, 100);</span></span>
<span class="line"><span>    GfxSetBkMode(1);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    if (EnableAlgo == &quot;Enable&quot;)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        AlgoStatus = &quot;Algo Enabled&quot;;</span></span>
<span class="line"><span>        GfxSetTextColor(colorGreen);</span></span>
<span class="line"><span>        GfxTextOut(&quot;Algostatus : &quot; + AlgoStatus, 20, 40);</span></span>
<span class="line"><span>        if (Nz(StaticVarGet(static_name_algo), 0) != 1)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            _TRACE(&quot;Algo Status : Enabled&quot;);</span></span>
<span class="line"><span>            StaticVarSet(static_name_algo, 1);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    else if (EnableAlgo == &quot;Disable&quot;)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        AlgoStatus = &quot;Algo Disabled&quot;;</span></span>
<span class="line"><span>        GfxSetTextColor(colorRed);</span></span>
<span class="line"><span>        GfxTextOut(&quot;Algostatus : &quot; + AlgoStatus, 20, 40);</span></span>
<span class="line"><span>        if (Nz(StaticVarGet(static_name_algo), 0) != 0)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            _TRACE(&quot;Algo Status : Disabled&quot;);</span></span>
<span class="line"><span>            StaticVarSet(static_name_algo, 0);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    else if (EnableAlgo == &quot;LongOnly&quot;)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        AlgoStatus = &quot;Long Only&quot;;</span></span>
<span class="line"><span>        GfxSetTextColor(colorYellow);</span></span>
<span class="line"><span>        GfxTextOut(&quot;Algostatus : &quot; + AlgoStatus, 20, 40);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    else if (EnableAlgo == &quot;ShortOnly&quot;)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        AlgoStatus = &quot;Short Only&quot;;</span></span>
<span class="line"><span>        GfxSetTextColor(colorOrange);</span></span>
<span class="line"><span>        GfxTextOut(&quot;Algostatus : &quot; + AlgoStatus, 20, 40);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    /* Display Strategy Info */</span></span>
<span class="line"><span>    GfxSelectFont(&quot;BOOK ANTIQUA&quot;, 10, 400);</span></span>
<span class="line"><span>    GfxSetTextColor(colorWhite);</span></span>
<span class="line"><span>    GfxTextOut(&quot;Underlying: &quot; + underlying + &quot; | Product: &quot; + product + &quot; | API: OptionsMultiOrder&quot;, 20, 65);</span></span>
<span class="line"><span>    GfxTextOut(&quot;Expiry Leg1: &quot; + expiry_leg1 + &quot; | Expiry Leg2: &quot; + expiry_leg2, 20, 83);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    /* Display Buy Signal Configuration */</span></span>
<span class="line"><span>    GfxSetTextColor(colorBrightGreen);</span></span>
<span class="line"><span>    GfxTextOut(&quot;BUY Signal Config:&quot;, 20, 105);</span></span>
<span class="line"><span>    GfxSetTextColor(colorWhite);</span></span>
<span class="line"><span>    GfxTextOut(&quot;Leg1: &quot; + tradetype_buyleg1 + &quot; &quot; + opttype_buyleg1 + &quot; @ &quot; + offset_buyleg1 + &quot; | Qty: &quot; + NumToStr(quantity_leg1, 1.0), 20, 123);</span></span>
<span class="line"><span>    GfxTextOut(&quot;Leg2: &quot; + tradetype_buyleg2 + &quot; &quot; + opttype_buyleg2 + &quot; @ &quot; + offset_buyleg2 + &quot; | Qty: &quot; + NumToStr(quantity_leg2, 1.0), 20, 141);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    /* Display Short Signal Configuration */</span></span>
<span class="line"><span>    GfxSetTextColor(colorRed);</span></span>
<span class="line"><span>    GfxTextOut(&quot;SHORT Signal Config:&quot;, 20, 163);</span></span>
<span class="line"><span>    GfxSetTextColor(colorWhite);</span></span>
<span class="line"><span>    GfxTextOut(&quot;Leg1: &quot; + tradetype_shortleg1 + &quot; &quot; + opttype_shortleg1 + &quot; @ &quot; + offset_shortleg1, 20, 181);</span></span>
<span class="line"><span>    GfxTextOut(&quot;Leg2: &quot; + tradetype_shortleg2 + &quot; &quot; + opttype_shortleg2 + &quot; @ &quot; + offset_shortleg2, 20, 199);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    /* Display Position Status */</span></span>
<span class="line"><span>    GfxSelectFont(&quot;BOOK ANTIQUA&quot;, 10, 700);</span></span>
<span class="line"><span>    GfxSetTextColor(colorYellow);</span></span>
<span class="line"><span>    GfxTextOut(&quot;=== POSITION STATUS ===&quot;, 20, 225);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    GfxSelectFont(&quot;BOOK ANTIQUA&quot;, 9, 400);</span></span>
<span class="line"><span>    buyleg1_status = WriteIf(Nz(StaticVarGet(static_buyleg1_order), 0) == 1, &quot;ACTIVE: &quot; + StaticVarGetText(static_buyleg1_symbol), &quot;NONE&quot;);</span></span>
<span class="line"><span>    buyleg2_status = WriteIf(Nz(StaticVarGet(static_buyleg2_order), 0) == 1, &quot;ACTIVE: &quot; + StaticVarGetText(static_buyleg2_symbol), &quot;NONE&quot;);</span></span>
<span class="line"><span>    shortleg1_status = WriteIf(Nz(StaticVarGet(static_shortleg1_order), 0) == 1, &quot;ACTIVE: &quot; + StaticVarGetText(static_shortleg1_symbol), &quot;NONE&quot;);</span></span>
<span class="line"><span>    shortleg2_status = WriteIf(Nz(StaticVarGet(static_shortleg2_order), 0) == 1, &quot;ACTIVE: &quot; + StaticVarGetText(static_shortleg2_symbol), &quot;NONE&quot;);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    GfxSetTextColor(colorAqua);</span></span>
<span class="line"><span>    GfxTextOut(&quot;Buy Leg1: &quot; + buyleg1_status, 20, 243);</span></span>
<span class="line"><span>    GfxTextOut(&quot;Buy Leg2: &quot; + buyleg2_status, 20, 258);</span></span>
<span class="line"><span>    GfxSetTextColor(colorOrange);</span></span>
<span class="line"><span>    GfxTextOut(&quot;Short Leg1: &quot; + shortleg1_status, 20, 273);</span></span>
<span class="line"><span>    GfxTextOut(&quot;Short Leg2: &quot; + shortleg2_status, 20, 288);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* --------------------------------------------------------------------------</span></span>
<span class="line"><span>       Refresh Memory Button</span></span>
<span class="line"><span>       -------------------------------------------------------------------------- */</span></span>
<span class="line"><span>    btnRefreshY = 310;</span></span>
<span class="line"><span>    btnRefreshW = 150;</span></span>
<span class="line"><span>    btnRefreshH = 35;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    GuiButton(&quot;REFRESH MEMORY&quot;, ++IDset, 20, btnRefreshY, btnRefreshW, btnRefreshH, notifyClicked);</span></span>
<span class="line"><span>    btnRefreshMemory = IDset;</span></span>
<span class="line"><span>    GuiSetColors(btnRefreshMemory, btnRefreshMemory, 1, colorWhite, colorDarkTeal, colorWhite);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    /* Process Button Click Events */</span></span>
<span class="line"><span>    for (i = 0; (cid = GuiGetEvent(i, 0)) &gt; 0; i++)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        if (GuiGetEvent(i, 1) == notifyClicked)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            if (cid == btnRefreshMemory)</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>                _TRACE(&quot;=== REFRESH MEMORY BUTTON CLICKED ===&quot;);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                /* Clear Buy Legs Position Tracking */</span></span>
<span class="line"><span>                StaticVarSet(static_buyleg1_order, 0);</span></span>
<span class="line"><span>                StaticVarSetText(static_buyleg1_symbol, &quot;&quot;);</span></span>
<span class="line"><span>                StaticVarSetText(static_buyleg1_exchange, &quot;&quot;);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                StaticVarSet(static_buyleg2_order, 0);</span></span>
<span class="line"><span>                StaticVarSetText(static_buyleg2_symbol, &quot;&quot;);</span></span>
<span class="line"><span>                StaticVarSetText(static_buyleg2_exchange, &quot;&quot;);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                /* Clear Short Legs Position Tracking */</span></span>
<span class="line"><span>                StaticVarSet(static_shortleg1_order, 0);</span></span>
<span class="line"><span>                StaticVarSetText(static_shortleg1_symbol, &quot;&quot;);</span></span>
<span class="line"><span>                StaticVarSetText(static_shortleg1_exchange, &quot;&quot;);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                StaticVarSet(static_shortleg2_order, 0);</span></span>
<span class="line"><span>                StaticVarSetText(static_shortleg2_symbol, &quot;&quot;);</span></span>
<span class="line"><span>                StaticVarSetText(static_shortleg2_exchange, &quot;&quot;);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                /* Clear All Signal Tracking Variables */</span></span>
<span class="line"><span>                StaticVarSet(static_name_ + &quot;buyCoverAlgo&quot;, 0);</span></span>
<span class="line"><span>                StaticVarSetText(static_name_ + &quot;buyCoverAlgo_barvalue&quot;, &quot;&quot;);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                StaticVarSet(static_name_ + &quot;buyAlgo&quot;, 0);</span></span>
<span class="line"><span>                StaticVarSetText(static_name_ + &quot;buyAlgo_barvalue&quot;, &quot;&quot;);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                StaticVarSet(static_name_ + &quot;sellAlgo&quot;, 0);</span></span>
<span class="line"><span>                StaticVarSetText(static_name_ + &quot;sellAlgo_barvalue&quot;, &quot;&quot;);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                StaticVarSet(static_name_ + &quot;ShortSellAlgo&quot;, 0);</span></span>
<span class="line"><span>                StaticVarSetText(static_name_ + &quot;ShortSellAlgo_barvalue&quot;, &quot;&quot;);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                StaticVarSet(static_name_ + &quot;ShortAlgo&quot;, 0);</span></span>
<span class="line"><span>                StaticVarSetText(static_name_ + &quot;ShortAlgo_barvalue&quot;, &quot;&quot;);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                StaticVarSet(static_name_ + &quot;CoverAlgo&quot;, 0);</span></span>
<span class="line"><span>                StaticVarSetText(static_name_ + &quot;CoverAlgo_barvalue&quot;, &quot;&quot;);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                _TRACE(&quot;All Static Variables Cleared Successfully&quot;);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                if (VoiceAlert == &quot;Enable&quot;)</span></span>
<span class="line"><span>                {</span></span>
<span class="line"><span>                    Say(&quot;Memory Refreshed&quot;);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* --------------------------------------------------------------------------</span></span>
<span class="line"><span>       Trading Signal Variables</span></span>
<span class="line"><span>       -------------------------------------------------------------------------- */</span></span>
<span class="line"><span>    AlgoBuy = LastValue(Ref(Buy, -EntryDelay));</span></span>
<span class="line"><span>    AlgoSell = LastValue(Ref(Sell, -ExitDelay));</span></span>
<span class="line"><span>    AlgoShort = LastValue(Ref(Short, -EntryDelay));</span></span>
<span class="line"><span>    AlgoCover = LastValue(Ref(Cover, -ExitDelay));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* --------------------------------------------------------------------------</span></span>
<span class="line"><span>       Trading Logic</span></span>
<span class="line"><span>       -------------------------------------------------------------------------- */</span></span>
<span class="line"><span>    if (EnableAlgo != &quot;Disable&quot;)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        lasttime = StrFormat(&quot;%0.f&quot;, LastValue(BarIndex()));</span></span>
<span class="line"><span>        SetChartBkColor(colorDarkGrey);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        /* ========================================================================</span></span>
<span class="line"><span>           BUY + COVER SIGNAL (Reversal from Short to Long)</span></span>
<span class="line"><span>           ======================================================================== */</span></span>
<span class="line"><span>        if (AlgoBuy == True AND AlgoCover == True AND StaticVarGet(static_name_ + &quot;buyCoverAlgo&quot;) == 0 AND StaticVarGetText(static_name_ + &quot;buyCoverAlgo_barvalue&quot;) != lasttime)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            if (EnableAlgo == &quot;Enable&quot;)</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>                _TRACE(&quot;=== BUY + COVER Signal Triggered (MultiOrder) ===&quot;);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                /* Exit Short Legs First */</span></span>
<span class="line"><span>                exit_sym1 = StaticVarGetText(static_shortleg1_symbol);</span></span>
<span class="line"><span>                exit_exch1 = StaticVarGetText(static_shortleg1_exchange);</span></span>
<span class="line"><span>                if (exit_sym1 != &quot;&quot; AND Nz(StaticVarGet(static_shortleg1_order), 0) == 1)</span></span>
<span class="line"><span>                {</span></span>
<span class="line"><span>                    response = ExitPosition(exit_sym1, exit_exch1, product, apikey, strategy, host, ver);</span></span>
<span class="line"><span>                    if (StrFind(response, &quot;\\&quot;status\\&quot;:\\&quot;success\\&quot;&quot;) &gt;= 0)</span></span>
<span class="line"><span>                    {</span></span>
<span class="line"><span>                        StaticVarSet(static_shortleg1_order, 0);</span></span>
<span class="line"><span>                        StaticVarSetText(static_shortleg1_symbol, &quot;&quot;);</span></span>
<span class="line"><span>                        StaticVarSetText(static_shortleg1_exchange, &quot;&quot;);</span></span>
<span class="line"><span>                        _TRACE(&quot;Short Leg1 Exit Success&quot;);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                exit_sym2 = StaticVarGetText(static_shortleg2_symbol);</span></span>
<span class="line"><span>                exit_exch2 = StaticVarGetText(static_shortleg2_exchange);</span></span>
<span class="line"><span>                if (exit_sym2 != &quot;&quot; AND Nz(StaticVarGet(static_shortleg2_order), 0) == 1)</span></span>
<span class="line"><span>                {</span></span>
<span class="line"><span>                    response = ExitPosition(exit_sym2, exit_exch2, product, apikey, strategy, host, ver);</span></span>
<span class="line"><span>                    if (StrFind(response, &quot;\\&quot;status\\&quot;:\\&quot;success\\&quot;&quot;) &gt;= 0)</span></span>
<span class="line"><span>                    {</span></span>
<span class="line"><span>                        StaticVarSet(static_shortleg2_order, 0);</span></span>
<span class="line"><span>                        StaticVarSetText(static_shortleg2_symbol, &quot;&quot;);</span></span>
<span class="line"><span>                        StaticVarSetText(static_shortleg2_exchange, &quot;&quot;);</span></span>
<span class="line"><span>                        _TRACE(&quot;Short Leg2 Exit Success&quot;);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                /* Place Multi-Leg Buy Entry Order */</span></span>
<span class="line"><span>                response = PostMultiLegOrder(</span></span>
<span class="line"><span>                    offset_buyleg1, opttype_buyleg1, tradetype_buyleg1, expiry_leg1, quantity_leg1,</span></span>
<span class="line"><span>                    offset_buyleg2, opttype_buyleg2, tradetype_buyleg2, expiry_leg2, quantity_leg2,</span></span>
<span class="line"><span>                    apikey, strategy, underlying, exchange, pricetype, product, host, ver</span></span>
<span class="line"><span>                );</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                has_success = StrFind(response, &quot;\\&quot;status\\&quot;:\\&quot;success\\&quot;&quot;) &gt;= 0;</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                if (has_success)</span></span>
<span class="line"><span>                {</span></span>
<span class="line"><span>                    /* Extract Leg 1 details (API returns &quot;leg&quot;:1) */</span></span>
<span class="line"><span>                    symbol1 = StrReplace(ExtractLegValue(response, 1, &quot;symbol&quot;), &quot;\\&quot;&quot;, &quot;&quot;);</span></span>
<span class="line"><span>                    exchange1 = StrReplace(ExtractLegValue(response, 1, &quot;exchange&quot;), &quot;\\&quot;&quot;, &quot;&quot;);</span></span>
<span class="line"><span>                    </span></span>
<span class="line"><span>                    /* Extract Leg 2 details (API returns &quot;leg&quot;:2) */</span></span>
<span class="line"><span>                    symbol2 = StrReplace(ExtractLegValue(response, 2, &quot;symbol&quot;), &quot;\\&quot;&quot;, &quot;&quot;);</span></span>
<span class="line"><span>                    exchange2 = StrReplace(ExtractLegValue(response, 2, &quot;exchange&quot;), &quot;\\&quot;&quot;, &quot;&quot;);</span></span>
<span class="line"><span>                    </span></span>
<span class="line"><span>                    if (symbol1 != &quot;&quot;)</span></span>
<span class="line"><span>                    {</span></span>
<span class="line"><span>                        StaticVarSet(static_buyleg1_order, 1);</span></span>
<span class="line"><span>                        StaticVarSetText(static_buyleg1_symbol, symbol1, True);</span></span>
<span class="line"><span>                        StaticVarSetText(static_buyleg1_exchange, exchange1, True);</span></span>
<span class="line"><span>                        _TRACEF(&quot;Buy Leg1 Entry Success: %s on %s&quot;, symbol1, exchange1);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                    </span></span>
<span class="line"><span>                    if (symbol2 != &quot;&quot;)</span></span>
<span class="line"><span>                    {</span></span>
<span class="line"><span>                        StaticVarSet(static_buyleg2_order, 1);</span></span>
<span class="line"><span>                        StaticVarSetText(static_buyleg2_symbol, symbol2, True);</span></span>
<span class="line"><span>                        StaticVarSetText(static_buyleg2_exchange, exchange2, True);</span></span>
<span class="line"><span>                        _TRACEF(&quot;Buy Leg2 Entry Success: %s on %s&quot;, symbol2, exchange2);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                    </span></span>
<span class="line"><span>                    if (VoiceAlert == &quot;Enable&quot;)</span></span>
<span class="line"><span>                    {</span></span>
<span class="line"><span>                        Say(&quot;Buy Cover Multi Order Placed&quot;);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                else</span></span>
<span class="line"><span>                {</span></span>
<span class="line"><span>                    _TRACE(&quot;Buy MultiOrder Failed&quot;);</span></span>
<span class="line"><span>                    if (VoiceAlert == &quot;Enable&quot;)</span></span>
<span class="line"><span>                    {</span></span>
<span class="line"><span>                        Say(&quot;Buy Order Failed&quot;);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                StaticVarSet(static_name_ + &quot;buyCoverAlgo&quot;, 1);</span></span>
<span class="line"><span>                StaticVarSetText(static_name_ + &quot;buyCoverAlgo_barvalue&quot;, lasttime);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        else if (AlgoBuy != True OR AlgoCover != True)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            StaticVarSet(static_name_ + &quot;buyCoverAlgo&quot;, 0);</span></span>
<span class="line"><span>            StaticVarSetText(static_name_ + &quot;buyCoverAlgo_barvalue&quot;, &quot;&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        /* ========================================================================</span></span>
<span class="line"><span>           BUY ONLY SIGNAL (Fresh Long Entry)</span></span>
<span class="line"><span>           ======================================================================== */</span></span>
<span class="line"><span>        if (AlgoBuy == True AND AlgoCover != True AND StaticVarGet(static_name_ + &quot;buyAlgo&quot;) == 0 AND StaticVarGetText(static_name_ + &quot;buyAlgo_barvalue&quot;) != lasttime)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            if (EnableAlgo == &quot;Enable&quot; OR EnableAlgo == &quot;LongOnly&quot;)</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>                _TRACE(&quot;=== BUY Signal Triggered (MultiOrder) ===&quot;);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                /* Place Multi-Leg Buy Entry Order */</span></span>
<span class="line"><span>                response = PostMultiLegOrder(</span></span>
<span class="line"><span>                    offset_buyleg1, opttype_buyleg1, tradetype_buyleg1, expiry_leg1, quantity_leg1,</span></span>
<span class="line"><span>                    offset_buyleg2, opttype_buyleg2, tradetype_buyleg2, expiry_leg2, quantity_leg2,</span></span>
<span class="line"><span>                    apikey, strategy, underlying, exchange, pricetype, product, host, ver</span></span>
<span class="line"><span>                );</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                has_success = StrFind(response, &quot;\\&quot;status\\&quot;:\\&quot;success\\&quot;&quot;) &gt;= 0;</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                if (has_success)</span></span>
<span class="line"><span>                {</span></span>
<span class="line"><span>                    /* Extract Leg 1 details (API returns &quot;leg&quot;:1) */</span></span>
<span class="line"><span>                    symbol1 = StrReplace(ExtractLegValue(response, 1, &quot;symbol&quot;), &quot;\\&quot;&quot;, &quot;&quot;);</span></span>
<span class="line"><span>                    exchange1 = StrReplace(ExtractLegValue(response, 1, &quot;exchange&quot;), &quot;\\&quot;&quot;, &quot;&quot;);</span></span>
<span class="line"><span>                    </span></span>
<span class="line"><span>                    /* Extract Leg 2 details (API returns &quot;leg&quot;:2) */</span></span>
<span class="line"><span>                    symbol2 = StrReplace(ExtractLegValue(response, 2, &quot;symbol&quot;), &quot;\\&quot;&quot;, &quot;&quot;);</span></span>
<span class="line"><span>                    exchange2 = StrReplace(ExtractLegValue(response, 2, &quot;exchange&quot;), &quot;\\&quot;&quot;, &quot;&quot;);</span></span>
<span class="line"><span>                    </span></span>
<span class="line"><span>                    if (symbol1 != &quot;&quot;)</span></span>
<span class="line"><span>                    {</span></span>
<span class="line"><span>                        StaticVarSet(static_buyleg1_order, 1);</span></span>
<span class="line"><span>                        StaticVarSetText(static_buyleg1_symbol, symbol1, True);</span></span>
<span class="line"><span>                        StaticVarSetText(static_buyleg1_exchange, exchange1, True);</span></span>
<span class="line"><span>                        _TRACEF(&quot;Buy Leg1 Entry Success: %s on %s&quot;, symbol1, exchange1);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                    </span></span>
<span class="line"><span>                    if (symbol2 != &quot;&quot;)</span></span>
<span class="line"><span>                    {</span></span>
<span class="line"><span>                        StaticVarSet(static_buyleg2_order, 1);</span></span>
<span class="line"><span>                        StaticVarSetText(static_buyleg2_symbol, symbol2, True);</span></span>
<span class="line"><span>                        StaticVarSetText(static_buyleg2_exchange, exchange2, True);</span></span>
<span class="line"><span>                        _TRACEF(&quot;Buy Leg2 Entry Success: %s on %s&quot;, symbol2, exchange2);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                    </span></span>
<span class="line"><span>                    if (VoiceAlert == &quot;Enable&quot;)</span></span>
<span class="line"><span>                    {</span></span>
<span class="line"><span>                        Say(&quot;Buy Multi Order Placed&quot;);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                else</span></span>
<span class="line"><span>                {</span></span>
<span class="line"><span>                    _TRACE(&quot;Buy MultiOrder Failed&quot;);</span></span>
<span class="line"><span>                    if (VoiceAlert == &quot;Enable&quot;)</span></span>
<span class="line"><span>                    {</span></span>
<span class="line"><span>                        Say(&quot;Buy Order Failed&quot;);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                StaticVarSet(static_name_ + &quot;buyAlgo&quot;, 1);</span></span>
<span class="line"><span>                StaticVarSetText(static_name_ + &quot;buyAlgo_barvalue&quot;, lasttime);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        else if (AlgoBuy != True)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            StaticVarSet(static_name_ + &quot;buyAlgo&quot;, 0);</span></span>
<span class="line"><span>            StaticVarSetText(static_name_ + &quot;buyAlgo_barvalue&quot;, &quot;&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        /* ========================================================================</span></span>
<span class="line"><span>           SELL ONLY SIGNAL (Exit Long)</span></span>
<span class="line"><span>           ======================================================================== */</span></span>
<span class="line"><span>        if (AlgoSell == True AND AlgoShort != True AND StaticVarGet(static_name_ + &quot;sellAlgo&quot;) == 0 AND StaticVarGetText(static_name_ + &quot;sellAlgo_barvalue&quot;) != lasttime)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            if (EnableAlgo == &quot;Enable&quot; OR EnableAlgo == &quot;LongOnly&quot;)</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>                _TRACE(&quot;=== SELL Signal Triggered ===&quot;);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                /* Exit Buy Leg 1 */</span></span>
<span class="line"><span>                exit_sym1 = StaticVarGetText(static_buyleg1_symbol);</span></span>
<span class="line"><span>                exit_exch1 = StaticVarGetText(static_buyleg1_exchange);</span></span>
<span class="line"><span>                if (exit_sym1 != &quot;&quot; AND Nz(StaticVarGet(static_buyleg1_order), 0) == 1)</span></span>
<span class="line"><span>                {</span></span>
<span class="line"><span>                    response = ExitPosition(exit_sym1, exit_exch1, product, apikey, strategy, host, ver);</span></span>
<span class="line"><span>                    if (StrFind(response, &quot;\\&quot;status\\&quot;:\\&quot;success\\&quot;&quot;) &gt;= 0)</span></span>
<span class="line"><span>                    {</span></span>
<span class="line"><span>                        StaticVarSet(static_buyleg1_order, 0);</span></span>
<span class="line"><span>                        StaticVarSetText(static_buyleg1_symbol, &quot;&quot;);</span></span>
<span class="line"><span>                        StaticVarSetText(static_buyleg1_exchange, &quot;&quot;);</span></span>
<span class="line"><span>                        _TRACE(&quot;Buy Leg1 Exit Success&quot;);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                /* Exit Buy Leg 2 */</span></span>
<span class="line"><span>                exit_sym2 = StaticVarGetText(static_buyleg2_symbol);</span></span>
<span class="line"><span>                exit_exch2 = StaticVarGetText(static_buyleg2_exchange);</span></span>
<span class="line"><span>                if (exit_sym2 != &quot;&quot; AND Nz(StaticVarGet(static_buyleg2_order), 0) == 1)</span></span>
<span class="line"><span>                {</span></span>
<span class="line"><span>                    response = ExitPosition(exit_sym2, exit_exch2, product, apikey, strategy, host, ver);</span></span>
<span class="line"><span>                    if (StrFind(response, &quot;\\&quot;status\\&quot;:\\&quot;success\\&quot;&quot;) &gt;= 0)</span></span>
<span class="line"><span>                    {</span></span>
<span class="line"><span>                        StaticVarSet(static_buyleg2_order, 0);</span></span>
<span class="line"><span>                        StaticVarSetText(static_buyleg2_symbol, &quot;&quot;);</span></span>
<span class="line"><span>                        StaticVarSetText(static_buyleg2_exchange, &quot;&quot;);</span></span>
<span class="line"><span>                        _TRACE(&quot;Buy Leg2 Exit Success&quot;);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                if (VoiceAlert == &quot;Enable&quot;)</span></span>
<span class="line"><span>                {</span></span>
<span class="line"><span>                    Say(&quot;Sell Exit Order Placed&quot;);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                StaticVarSet(static_name_ + &quot;sellAlgo&quot;, 1);</span></span>
<span class="line"><span>                StaticVarSetText(static_name_ + &quot;sellAlgo_barvalue&quot;, lasttime);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        else if (AlgoSell != True)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            StaticVarSet(static_name_ + &quot;sellAlgo&quot;, 0);</span></span>
<span class="line"><span>            StaticVarSetText(static_name_ + &quot;sellAlgo_barvalue&quot;, &quot;&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        /* ========================================================================</span></span>
<span class="line"><span>           SHORT + SELL SIGNAL (Reversal from Long to Short)</span></span>
<span class="line"><span>           ======================================================================== */</span></span>
<span class="line"><span>        if (AlgoShort == True AND AlgoSell == True AND StaticVarGet(static_name_ + &quot;ShortSellAlgo&quot;) == 0 AND StaticVarGetText(static_name_ + &quot;ShortSellAlgo_barvalue&quot;) != lasttime)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            if (EnableAlgo == &quot;Enable&quot;)</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>                _TRACE(&quot;=== SHORT + SELL Signal Triggered (MultiOrder) ===&quot;);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                /* Exit Buy Legs First */</span></span>
<span class="line"><span>                exit_sym1 = StaticVarGetText(static_buyleg1_symbol);</span></span>
<span class="line"><span>                exit_exch1 = StaticVarGetText(static_buyleg1_exchange);</span></span>
<span class="line"><span>                if (exit_sym1 != &quot;&quot; AND Nz(StaticVarGet(static_buyleg1_order), 0) == 1)</span></span>
<span class="line"><span>                {</span></span>
<span class="line"><span>                    response = ExitPosition(exit_sym1, exit_exch1, product, apikey, strategy, host, ver);</span></span>
<span class="line"><span>                    if (StrFind(response, &quot;\\&quot;status\\&quot;:\\&quot;success\\&quot;&quot;) &gt;= 0)</span></span>
<span class="line"><span>                    {</span></span>
<span class="line"><span>                        StaticVarSet(static_buyleg1_order, 0);</span></span>
<span class="line"><span>                        StaticVarSetText(static_buyleg1_symbol, &quot;&quot;);</span></span>
<span class="line"><span>                        StaticVarSetText(static_buyleg1_exchange, &quot;&quot;);</span></span>
<span class="line"><span>                        _TRACE(&quot;Buy Leg1 Exit Success&quot;);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                exit_sym2 = StaticVarGetText(static_buyleg2_symbol);</span></span>
<span class="line"><span>                exit_exch2 = StaticVarGetText(static_buyleg2_exchange);</span></span>
<span class="line"><span>                if (exit_sym2 != &quot;&quot; AND Nz(StaticVarGet(static_buyleg2_order), 0) == 1)</span></span>
<span class="line"><span>                {</span></span>
<span class="line"><span>                    response = ExitPosition(exit_sym2, exit_exch2, product, apikey, strategy, host, ver);</span></span>
<span class="line"><span>                    if (StrFind(response, &quot;\\&quot;status\\&quot;:\\&quot;success\\&quot;&quot;) &gt;= 0)</span></span>
<span class="line"><span>                    {</span></span>
<span class="line"><span>                        StaticVarSet(static_buyleg2_order, 0);</span></span>
<span class="line"><span>                        StaticVarSetText(static_buyleg2_symbol, &quot;&quot;);</span></span>
<span class="line"><span>                        StaticVarSetText(static_buyleg2_exchange, &quot;&quot;);</span></span>
<span class="line"><span>                        _TRACE(&quot;Buy Leg2 Exit Success&quot;);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                /* Place Multi-Leg Short Entry Order */</span></span>
<span class="line"><span>                response = PostMultiLegOrder(</span></span>
<span class="line"><span>                    offset_shortleg1, opttype_shortleg1, tradetype_shortleg1, expiry_leg1, quantity_leg1,</span></span>
<span class="line"><span>                    offset_shortleg2, opttype_shortleg2, tradetype_shortleg2, expiry_leg2, quantity_leg2,</span></span>
<span class="line"><span>                    apikey, strategy, underlying, exchange, pricetype, product, host, ver</span></span>
<span class="line"><span>                );</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                has_success = StrFind(response, &quot;\\&quot;status\\&quot;:\\&quot;success\\&quot;&quot;) &gt;= 0;</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                if (has_success)</span></span>
<span class="line"><span>                {</span></span>
<span class="line"><span>                    /* Extract Leg 1 details (API returns &quot;leg&quot;:1) */</span></span>
<span class="line"><span>                    symbol1 = StrReplace(ExtractLegValue(response, 1, &quot;symbol&quot;), &quot;\\&quot;&quot;, &quot;&quot;);</span></span>
<span class="line"><span>                    exchange1 = StrReplace(ExtractLegValue(response, 1, &quot;exchange&quot;), &quot;\\&quot;&quot;, &quot;&quot;);</span></span>
<span class="line"><span>                    </span></span>
<span class="line"><span>                    /* Extract Leg 2 details (API returns &quot;leg&quot;:2) */</span></span>
<span class="line"><span>                    symbol2 = StrReplace(ExtractLegValue(response, 2, &quot;symbol&quot;), &quot;\\&quot;&quot;, &quot;&quot;);</span></span>
<span class="line"><span>                    exchange2 = StrReplace(ExtractLegValue(response, 2, &quot;exchange&quot;), &quot;\\&quot;&quot;, &quot;&quot;);</span></span>
<span class="line"><span>                    </span></span>
<span class="line"><span>                    if (symbol1 != &quot;&quot;)</span></span>
<span class="line"><span>                    {</span></span>
<span class="line"><span>                        StaticVarSet(static_shortleg1_order, 1);</span></span>
<span class="line"><span>                        StaticVarSetText(static_shortleg1_symbol, symbol1, True);</span></span>
<span class="line"><span>                        StaticVarSetText(static_shortleg1_exchange, exchange1, True);</span></span>
<span class="line"><span>                        _TRACEF(&quot;Short Leg1 Entry Success: %s on %s&quot;, symbol1, exchange1);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                    </span></span>
<span class="line"><span>                    if (symbol2 != &quot;&quot;)</span></span>
<span class="line"><span>                    {</span></span>
<span class="line"><span>                        StaticVarSet(static_shortleg2_order, 1);</span></span>
<span class="line"><span>                        StaticVarSetText(static_shortleg2_symbol, symbol2, True);</span></span>
<span class="line"><span>                        StaticVarSetText(static_shortleg2_exchange, exchange2, True);</span></span>
<span class="line"><span>                        _TRACEF(&quot;Short Leg2 Entry Success: %s on %s&quot;, symbol2, exchange2);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                    </span></span>
<span class="line"><span>                    if (VoiceAlert == &quot;Enable&quot;)</span></span>
<span class="line"><span>                    {</span></span>
<span class="line"><span>                        Say(&quot;Short Sell Multi Order Placed&quot;);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                else</span></span>
<span class="line"><span>                {</span></span>
<span class="line"><span>                    _TRACE(&quot;Short MultiOrder Failed&quot;);</span></span>
<span class="line"><span>                    if (VoiceAlert == &quot;Enable&quot;)</span></span>
<span class="line"><span>                    {</span></span>
<span class="line"><span>                        Say(&quot;Short Order Failed&quot;);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                StaticVarSet(static_name_ + &quot;ShortSellAlgo&quot;, 1);</span></span>
<span class="line"><span>                StaticVarSetText(static_name_ + &quot;ShortSellAlgo_barvalue&quot;, lasttime);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        else if (AlgoShort != True OR AlgoSell != True)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            StaticVarSet(static_name_ + &quot;ShortSellAlgo&quot;, 0);</span></span>
<span class="line"><span>            StaticVarSetText(static_name_ + &quot;ShortSellAlgo_barvalue&quot;, &quot;&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        /* ========================================================================</span></span>
<span class="line"><span>           SHORT ONLY SIGNAL (Fresh Short Entry)</span></span>
<span class="line"><span>           ======================================================================== */</span></span>
<span class="line"><span>        if (AlgoShort == True AND AlgoSell != True AND StaticVarGet(static_name_ + &quot;ShortAlgo&quot;) == 0 AND StaticVarGetText(static_name_ + &quot;ShortAlgo_barvalue&quot;) != lasttime)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            if (EnableAlgo == &quot;Enable&quot; OR EnableAlgo == &quot;ShortOnly&quot;)</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>                _TRACE(&quot;=== SHORT Signal Triggered (MultiOrder) ===&quot;);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                /* Place Multi-Leg Short Entry Order */</span></span>
<span class="line"><span>                response = PostMultiLegOrder(</span></span>
<span class="line"><span>                    offset_shortleg1, opttype_shortleg1, tradetype_shortleg1, expiry_leg1, quantity_leg1,</span></span>
<span class="line"><span>                    offset_shortleg2, opttype_shortleg2, tradetype_shortleg2, expiry_leg2, quantity_leg2,</span></span>
<span class="line"><span>                    apikey, strategy, underlying, exchange, pricetype, product, host, ver</span></span>
<span class="line"><span>                );</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                has_success = StrFind(response, &quot;\\&quot;status\\&quot;:\\&quot;success\\&quot;&quot;) &gt;= 0;</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                if (has_success)</span></span>
<span class="line"><span>                {</span></span>
<span class="line"><span>                    /* Extract Leg 1 details (API returns &quot;leg&quot;:1) */</span></span>
<span class="line"><span>                    symbol1 = StrReplace(ExtractLegValue(response, 1, &quot;symbol&quot;), &quot;\\&quot;&quot;, &quot;&quot;);</span></span>
<span class="line"><span>                    exchange1 = StrReplace(ExtractLegValue(response, 1, &quot;exchange&quot;), &quot;\\&quot;&quot;, &quot;&quot;);</span></span>
<span class="line"><span>                    </span></span>
<span class="line"><span>                    /* Extract Leg 2 details (API returns &quot;leg&quot;:2) */</span></span>
<span class="line"><span>                    symbol2 = StrReplace(ExtractLegValue(response, 2, &quot;symbol&quot;), &quot;\\&quot;&quot;, &quot;&quot;);</span></span>
<span class="line"><span>                    exchange2 = StrReplace(ExtractLegValue(response, 2, &quot;exchange&quot;), &quot;\\&quot;&quot;, &quot;&quot;);</span></span>
<span class="line"><span>                    </span></span>
<span class="line"><span>                    if (symbol1 != &quot;&quot;)</span></span>
<span class="line"><span>                    {</span></span>
<span class="line"><span>                        StaticVarSet(static_shortleg1_order, 1);</span></span>
<span class="line"><span>                        StaticVarSetText(static_shortleg1_symbol, symbol1, True);</span></span>
<span class="line"><span>                        StaticVarSetText(static_shortleg1_exchange, exchange1, True);</span></span>
<span class="line"><span>                        _TRACEF(&quot;Short Leg1 Entry Success: %s on %s&quot;, symbol1, exchange1);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                    </span></span>
<span class="line"><span>                    if (symbol2 != &quot;&quot;)</span></span>
<span class="line"><span>                    {</span></span>
<span class="line"><span>                        StaticVarSet(static_shortleg2_order, 1);</span></span>
<span class="line"><span>                        StaticVarSetText(static_shortleg2_symbol, symbol2, True);</span></span>
<span class="line"><span>                        StaticVarSetText(static_shortleg2_exchange, exchange2, True);</span></span>
<span class="line"><span>                        _TRACEF(&quot;Short Leg2 Entry Success: %s on %s&quot;, symbol2, exchange2);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                    </span></span>
<span class="line"><span>                    if (VoiceAlert == &quot;Enable&quot;)</span></span>
<span class="line"><span>                    {</span></span>
<span class="line"><span>                        Say(&quot;Short Multi Order Placed&quot;);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                else</span></span>
<span class="line"><span>                {</span></span>
<span class="line"><span>                    _TRACE(&quot;Short MultiOrder Failed&quot;);</span></span>
<span class="line"><span>                    if (VoiceAlert == &quot;Enable&quot;)</span></span>
<span class="line"><span>                    {</span></span>
<span class="line"><span>                        Say(&quot;Short Order Failed&quot;);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                StaticVarSet(static_name_ + &quot;ShortAlgo&quot;, 1);</span></span>
<span class="line"><span>                StaticVarSetText(static_name_ + &quot;ShortAlgo_barvalue&quot;, lasttime);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        else if (AlgoShort != True)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            StaticVarSet(static_name_ + &quot;ShortAlgo&quot;, 0);</span></span>
<span class="line"><span>            StaticVarSetText(static_name_ + &quot;ShortAlgo_barvalue&quot;, &quot;&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        /* ========================================================================</span></span>
<span class="line"><span>           COVER ONLY SIGNAL (Exit Short)</span></span>
<span class="line"><span>           ======================================================================== */</span></span>
<span class="line"><span>        if (AlgoCover == True AND AlgoBuy != True AND StaticVarGet(static_name_ + &quot;CoverAlgo&quot;) == 0 AND StaticVarGetText(static_name_ + &quot;CoverAlgo_barvalue&quot;) != lasttime)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            if (EnableAlgo == &quot;Enable&quot; OR EnableAlgo == &quot;ShortOnly&quot;)</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>                _TRACE(&quot;=== COVER Signal Triggered ===&quot;);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                /* Exit Short Leg 1 */</span></span>
<span class="line"><span>                exit_sym1 = StaticVarGetText(static_shortleg1_symbol);</span></span>
<span class="line"><span>                exit_exch1 = StaticVarGetText(static_shortleg1_exchange);</span></span>
<span class="line"><span>                if (exit_sym1 != &quot;&quot; AND Nz(StaticVarGet(static_shortleg1_order), 0) == 1)</span></span>
<span class="line"><span>                {</span></span>
<span class="line"><span>                    response = ExitPosition(exit_sym1, exit_exch1, product, apikey, strategy, host, ver);</span></span>
<span class="line"><span>                    if (StrFind(response, &quot;\\&quot;status\\&quot;:\\&quot;success\\&quot;&quot;) &gt;= 0)</span></span>
<span class="line"><span>                    {</span></span>
<span class="line"><span>                        StaticVarSet(static_shortleg1_order, 0);</span></span>
<span class="line"><span>                        StaticVarSetText(static_shortleg1_symbol, &quot;&quot;);</span></span>
<span class="line"><span>                        StaticVarSetText(static_shortleg1_exchange, &quot;&quot;);</span></span>
<span class="line"><span>                        _TRACE(&quot;Short Leg1 Exit Success&quot;);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                /* Exit Short Leg 2 */</span></span>
<span class="line"><span>                exit_sym2 = StaticVarGetText(static_shortleg2_symbol);</span></span>
<span class="line"><span>                exit_exch2 = StaticVarGetText(static_shortleg2_exchange);</span></span>
<span class="line"><span>                if (exit_sym2 != &quot;&quot; AND Nz(StaticVarGet(static_shortleg2_order), 0) == 1)</span></span>
<span class="line"><span>                {</span></span>
<span class="line"><span>                    response = ExitPosition(exit_sym2, exit_exch2, product, apikey, strategy, host, ver);</span></span>
<span class="line"><span>                    if (StrFind(response, &quot;\\&quot;status\\&quot;:\\&quot;success\\&quot;&quot;) &gt;= 0)</span></span>
<span class="line"><span>                    {</span></span>
<span class="line"><span>                        StaticVarSet(static_shortleg2_order, 0);</span></span>
<span class="line"><span>                        StaticVarSetText(static_shortleg2_symbol, &quot;&quot;);</span></span>
<span class="line"><span>                        StaticVarSetText(static_shortleg2_exchange, &quot;&quot;);</span></span>
<span class="line"><span>                        _TRACE(&quot;Short Leg2 Exit Success&quot;);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                if (VoiceAlert == &quot;Enable&quot;)</span></span>
<span class="line"><span>                {</span></span>
<span class="line"><span>                    Say(&quot;Cover Exit Order Placed&quot;);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                StaticVarSet(static_name_ + &quot;CoverAlgo&quot;, 1);</span></span>
<span class="line"><span>                StaticVarSetText(static_name_ + &quot;CoverAlgo_barvalue&quot;, lasttime);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        else if (AlgoCover != True)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            StaticVarSet(static_name_ + &quot;CoverAlgo&quot;, 0);</span></span>
<span class="line"><span>            StaticVarSetText(static_name_ + &quot;CoverAlgo_barvalue&quot;, &quot;&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>_SECTION_END();</span></span></code></pre></div><p><strong>Here are the Supported two-legged options trading strategies:</strong></p><p><strong>Credit Spread:</strong> Selling an option at one strike price and buying an option at a lower strike price.</p><p><strong>Debit Spread:</strong> Buying an option at one strike price and selling an option at a higher strike price.</p><p><strong>Straddle:</strong> buying a call and a put option with the same strike price and expiration date.</p><p><strong>Strangle:</strong> buying a call option with a higher strike price and a put option with a lower strike price</p><p><strong>Synthetic Futures:</strong> Buying/Selling a call option and selling/Buying a put option of the same strike price and expiration date</p><p><strong>Diagonal Spread:</strong> Buying a call or put option with a longer expiration date and selling a call or put option with a shorter expiration date and a different strike price.</p><p><strong>Calendar Spread:</strong> Buying a call or put option with a longer expiration date and selling a call or put option with a shorter expiration date.</p><p><strong>Ratio Spread:</strong> Buying a call or put option at one strike price and selling multiple options at a different strike price</p><p><strong>Ratio Back Spread:</strong> Buying multiple options at one strike price and selling an option at a different strike price</p>`,16)])])}const _=n(e,[["render",l]]);export{g as __pageData,_ as default};
