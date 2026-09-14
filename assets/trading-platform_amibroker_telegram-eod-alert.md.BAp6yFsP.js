import{_ as s,o as n,c as e,a2 as t}from"./chunks/framework.BXzK3EA4.js";const h=JSON.parse('{"title":"Telegram EOD Alert","description":"Works with Any Long-Only AFL Strategy","frontmatter":{"description":"Works with Any Long-Only AFL Strategy"},"headers":[],"relativePath":"trading-platform/amibroker/telegram-eod-alert.md","filePath":"trading-platform/amibroker/telegram-eod-alert.md"}'),l={name:"trading-platform/amibroker/telegram-eod-alert.md"};function i(p,a,o,r,c,d){return n(),e("div",null,[...a[0]||(a[0]=[t(`<h1 id="telegram-eod-alert" tabindex="-1">Telegram EOD Alert <a class="header-anchor" href="#telegram-eod-alert" aria-label="Permalink to &quot;Telegram EOD Alert&quot;">​</a></h1><h4 id="designed-exclusively-for-daily-timeframe" tabindex="-1">Designed Exclusively for Daily Timeframe <a class="header-anchor" href="#designed-exclusively-for-daily-timeframe" aria-label="Permalink to &quot;Designed Exclusively for Daily Timeframe&quot;">​</a></h4><p>This document describes how to automatically run a daily AFL exploration at 6:00 PM IST and send Telegram alerts using Tradeboard.</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//====================================================================</span></span>
<span class="line"><span>// UNIVERSAL TELEGRAM EXPLORATION MODULE (LONG ONLY)</span></span>
<span class="line"><span>// Plug-and-Play for any AFL strategy that defines Buy &amp; Sell signals</span></span>
<span class="line"><span>//====================================================================</span></span>
<span class="line"><span></span></span>
<span class="line"><span>_SECTION_BEGIN(&quot;Telegram Alerts (Long Only)&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// ---------- Tradeboard / Telegram parameters ----------</span></span>
<span class="line"><span>tgApiKey    = ParamStr(&quot;Tradeboard API Key&quot;, &quot;your_api_key_here&quot;);</span></span>
<span class="line"><span>tgUserName  = ParamStr(&quot;Tradeboard Username&quot;, &quot;your_tradeboard_username&quot;);</span></span>
<span class="line"><span>tgHost      = ParamStr(&quot;Host&quot;, &quot;http://127.0.0.1:5000&quot;);</span></span>
<span class="line"><span>tgVer       = ParamStr(&quot;API Version&quot;, &quot;v1&quot;);</span></span>
<span class="line"><span>tgPriority  = Param(&quot;Telegram Priority&quot;, 5, 1, 10, 1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Build endpoint URL</span></span>
<span class="line"><span>tgUrl = tgHost + &quot;/api/&quot; + tgVer + &quot;/telegram/notify&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// ---------- Telegram sender function ----------</span></span>
<span class="line"><span>function SendTelegramAlert(tgMessage)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    global tgApiKey, tgUserName, tgPriority, tgUrl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    pstr = StrFormat(&quot;%g&quot;, tgPriority);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    postBody =</span></span>
<span class="line"><span>          &quot;{&quot;</span></span>
<span class="line"><span>        + &quot;\\&quot;apikey\\&quot;:\\&quot;&quot;   + tgApiKey    + &quot;\\&quot;,&quot;</span></span>
<span class="line"><span>        + &quot;\\&quot;username\\&quot;:\\&quot;&quot; + tgUserName  + &quot;\\&quot;,&quot;</span></span>
<span class="line"><span>        + &quot;\\&quot;message\\&quot;:\\&quot;&quot;  + tgMessage   + &quot;\\&quot;,&quot;</span></span>
<span class="line"><span>        + &quot;\\&quot;priority\\&quot;:&quot;    + pstr</span></span>
<span class="line"><span>        + &quot;}&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    headers =</span></span>
<span class="line"><span>          &quot;Content-Type: application/json\\r\\n&quot;</span></span>
<span class="line"><span>        + &quot;Cache-Control: no-cache\\r\\n&quot;</span></span>
<span class="line"><span>        + &quot;Pragma: no-cache\\r\\n&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    InternetSetHeaders(headers);</span></span>
<span class="line"><span>    ih = InternetPostRequest(tgUrl, postBody);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if(ih)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        resp = &quot;&quot;;</span></span>
<span class="line"><span>        line = &quot;&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        while((line = InternetReadString(ih)) != &quot;&quot;)</span></span>
<span class="line"><span>            resp += line;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        InternetClose(ih);</span></span>
<span class="line"><span>        _TRACE(&quot;Telegram Response: &quot; + resp);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    else</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        _TRACE(&quot;Telegram Error: InternetPostRequest failed&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//====================================================================</span></span>
<span class="line"><span>// EXPLORATION BLOCK (Drop-in for any Long-Only strategy)</span></span>
<span class="line"><span>//====================================================================</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Show all BUY / SELL in exploration</span></span>
<span class="line"><span>Filter = Buy OR Sell;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Background coloring</span></span>
<span class="line"><span>bgColor   = IIf(Buy, colorGreen, IIf(Sell, colorRed, colorBlack));</span></span>
<span class="line"><span>textColor = colorWhite;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Exploration columns</span></span>
<span class="line"><span>AddTextColumn(Name(), &quot;Symbol&quot;, 1, textColor, bgColor);</span></span>
<span class="line"><span>AddColumn(Close, &quot;Close&quot;, 1.2, textColor, bgColor);</span></span>
<span class="line"><span>AddColumn(ROC(Close,1), &quot;% Chg&quot;, 1.2, textColor, bgColor);</span></span>
<span class="line"><span>AddColumn(IIf(Buy, 1, 0), &quot;Buy&quot;, 1, textColor, bgColor);</span></span>
<span class="line"><span>AddColumn(IIf(Sell,1, 0), &quot;Sell&quot;,1, textColor, bgColor);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>SetSortColumns(-2);  // Sort by % change</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//====================================================================</span></span>
<span class="line"><span>// TELEGRAM ALERT TRIGGER (Only when running Exploration)</span></span>
<span class="line"><span>//====================================================================</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if(Status(&quot;action&quot;) == actionExplore)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    lastBuy  = LastValue(Buy);</span></span>
<span class="line"><span>    lastSell = LastValue(Sell);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if(lastBuy OR lastSell)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        sname = Name();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // capture latest bar prices for signals</span></span>
<span class="line"><span>        bp = LastValue( ValueWhen(Buy,  Close) );</span></span>
<span class="line"><span>        sp = LastValue( ValueWhen(Sell, Close) );</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // build message</span></span>
<span class="line"><span>        if(lastBuy AND NOT lastSell)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            txt =</span></span>
<span class="line"><span>                &quot;Symbol : &quot; + sname + &quot;\\\\n&quot;</span></span>
<span class="line"><span>              + &quot;Price : &quot;  + StrFormat(&quot;%.2f&quot;, bp) + &quot;\\\\n&quot;</span></span>
<span class="line"><span>              + &quot;Signal Type : BUY Signal&quot;;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        else</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            txt =</span></span>
<span class="line"><span>                &quot;Symbol : &quot; + sname + &quot;\\\\n&quot;</span></span>
<span class="line"><span>              + &quot;Price : &quot;  + StrFormat(&quot;%.2f&quot;, sp) + &quot;\\\\n&quot;</span></span>
<span class="line"><span>              + &quot;Signal Type : SELL Signal&quot;;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // send alert</span></span>
<span class="line"><span>        SendTelegramAlert(txt);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        _TRACE(&quot;Telegram Sent -&gt; &quot; + txt);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>_SECTION_END();</span></span></code></pre></div><p><br><br> This module is intended for <strong>Daily timeframe only</strong>. Lower timeframes are <strong>not supported</strong> because they require special alert suppression logic.</p><hr><h2 id="_1-telegram-bot-setup-one-time-process" tabindex="-1">1. Telegram Bot Setup (One-Time Process) <a class="header-anchor" href="#_1-telegram-bot-setup-one-time-process" aria-label="Permalink to &quot;1. Telegram Bot Setup (One-Time Process)&quot;">​</a></h2><p>This step must be completed before AmiBroker can send alerts to your Telegram.</p><h3 id="_1-1-create-a-telegram-bot" tabindex="-1">1.1 Create a Telegram Bot <a class="header-anchor" href="#_1-1-create-a-telegram-bot" aria-label="Permalink to &quot;1.1 Create a Telegram Bot&quot;">​</a></h3><ol><li>Open the Telegram app.</li><li>Search for “BotFather”.</li><li>Send the command:</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/newbot</span></span></code></pre></div><ol start="4"><li>Choose a bot name and username.</li><li>BotFather will respond with:</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>HTTP API Token: 1234567890:ABCDEF...</span></span></code></pre></div><p>Save this token.</p><h3 id="_1-2-configure-the-bot-token-in-tradeboard" tabindex="-1">1.2 Configure the Bot Token in Tradeboard <a class="header-anchor" href="#_1-2-configure-the-bot-token-in-tradeboard" aria-label="Permalink to &quot;1.2 Configure the Bot Token in Tradeboard&quot;">​</a></h3><ol><li>Open Tradeboard in your browser (default <code>http://127.0.0.1:5000</code>).</li><li>Go to the <strong>Telegram Bot</strong> page at <code>/telegram</code>, then open <strong>Configuration</strong> (<code>/telegram/config</code>).</li><li>Paste the Bot Token received from BotFather and click “Save Configuration”.</li><li>Return to <code>/telegram</code> and click “Start Bot”.</li></ol><p>Your bot is now active. The bot has to stay started: <code>/api/v1/telegram/notify</code> rejects requests with HTTP 409 while the bot is stopped, so a scheduled exploration will run but no alert will be delivered.</p><h3 id="_1-3-link-your-telegram-account-with-tradeboard" tabindex="-1">1.3 Link Your Telegram Account with Tradeboard <a class="header-anchor" href="#_1-3-link-your-telegram-account-with-tradeboard" aria-label="Permalink to &quot;1.3 Link Your Telegram Account with Tradeboard&quot;">​</a></h3><p>In Telegram, open your bot and send:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/link &lt;your-tradeboard-api-key&gt; http://127.0.0.1:5000</span></span></code></pre></div><p>Example:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/link ABCD1234XYZ http://127.0.0.1:5000</span></span></code></pre></div><p>If successful, the bot will respond confirming the link.<br> Your Telegram account is now authenticated with Tradeboard and ready to receive alerts.</p><hr><h2 id="_2-add-the-telegram-exploration-module-to-your-afl-strategy" tabindex="-1">2. Add the Telegram Exploration Module to Your AFL Strategy <a class="header-anchor" href="#_2-add-the-telegram-exploration-module-to-your-afl-strategy" aria-label="Permalink to &quot;2. Add the Telegram Exploration Module to Your AFL Strategy&quot;">​</a></h2><p>Your strategy must contain valid daily timeframe Buy and Sell signals:</p><div class="language-afl vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">afl</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Buy  = ...;     // Daily timeframe signal</span></span>
<span class="line"><span>Sell = ...;     // Daily timeframe signal</span></span></code></pre></div><p>Below your strategy code, insert the <strong>Long-Only Daily Telegram Exploration Module</strong>.</p><p>This module automatically:</p><ul><li>Detects Buy/Sell signals on the <em>latest daily bar</em></li><li>Sends formatted alerts via Tradeboard when Exploration is executed</li></ul><p>The alert format is:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Symbol : RELIANCE</span></span>
<span class="line"><span>Price : 1542.00</span></span>
<span class="line"><span>Signal Type : BUY Signal</span></span></code></pre></div><p>This module is intended for <strong>Daily timeframe only</strong>.</p><hr><h2 id="_3-create-an-apx-analysis-settings-file" tabindex="-1">3. Create an APX (Analysis Settings File) <a class="header-anchor" href="#_3-create-an-apx-analysis-settings-file" aria-label="Permalink to &quot;3. Create an APX (Analysis Settings File)&quot;">​</a></h2><ol><li>Open AmiBroker’s Analysis window.</li><li>Load your AFL containing Buy/Sell signals and the Telegram module.</li><li>Set the following:</li></ol><ul><li>Apply To: Filter or All Symbols</li><li>Range: 1 recent day(s)</li><li>From/To: Today</li><li>Timeframe: Daily</li></ul><ol start="4"><li>Click “Explore” to verify signals display as expected.</li><li>Save the analysis settings:</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>File &gt; Save As…</span></span></code></pre></div><p>Save as:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>MyStrategy_Explore.apx</span></span></code></pre></div><p>The APX stores:</p><ul><li>Formulas</li><li>Symbol list</li><li>Date range</li><li>Exploration settings</li></ul><hr><h2 id="_4-create-a-batch-file-abb" tabindex="-1">4. Create a Batch File (.abb) <a class="header-anchor" href="#_4-create-a-batch-file-abb" aria-label="Permalink to &quot;4. Create a Batch File (.abb)&quot;">​</a></h2><ol><li>Go to:</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>File &gt; New &gt; Batch</span></span></code></pre></div><ol start="2"><li>Click “Insert”.</li><li>Select Action: <strong>Explore</strong>.</li><li>Browse and choose your <code>.apx</code> file.</li><li>Save the batch as:</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>MyStrategy_Batch.abb</span></span></code></pre></div><p>This batch file will run exploration automatically.</p><hr><h2 id="_5-schedule-automatic-daily-execution-at-6-pm-ist" tabindex="-1">5. Schedule Automatic Daily Execution at 6 PM IST <a class="header-anchor" href="#_5-schedule-automatic-daily-execution-at-6-pm-ist" aria-label="Permalink to &quot;5. Schedule Automatic Daily Execution at 6 PM IST&quot;">​</a></h2><ol><li>Open:</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Tools &gt; Scheduler</span></span></code></pre></div><ol start="2"><li>Click “Add Task”.</li><li>Select your batch file.</li><li>Configure:</li></ol><ul><li>At specific date/time: 18:00:00</li><li>Repeat: Daily (Monday to Friday)</li></ul><ol start="5"><li>Click “OK”.</li></ol><p>At the scheduled time, AmiBroker will automatically execute:</p><ul><li>The batch</li><li>The exploration</li><li>The Telegram alert module</li><li>The alerts will be delivered to your linked Telegram account via Tradeboard</li></ul><hr><h2 id="_6-daily-execution-workflow" tabindex="-1">6. Daily Execution Workflow <a class="header-anchor" href="#_6-daily-execution-workflow" aria-label="Permalink to &quot;6. Daily Execution Workflow&quot;">​</a></h2><p>Every day at 6 PM IST:</p><ol><li>AmiBroker loads the APX</li><li>Runs the daily exploration</li><li>Detects Buy/Sell signals from today’s daily bar</li><li>Sends Telegram alerts via Tradeboard</li><li>No manual intervention is required</li></ol><p>This works only on <strong>Daily timeframe</strong> strategies.</p><hr><h2 id="notes-and-restrictions" tabindex="-1">Notes and Restrictions <a class="header-anchor" href="#notes-and-restrictions" aria-label="Permalink to &quot;Notes and Restrictions&quot;">​</a></h2><ol><li>This module is <strong>exclusively designed for Daily timeframe</strong>.</li><li>Intraday or lower timeframes are <strong>not supported</strong>, because they require: <ul><li>Bar-level alert deduplication</li><li>StaticVar suppression</li><li>Session segmentation</li></ul></li><li>AmiBroker must remain running for Scheduler tasks to execute.</li><li>Tradeboard must remain running for Telegram API to respond.</li><li>The Telegram bot must be started in Tradeboard. If it is stopped, <code>POST /api/v1/telegram/notify</code> returns HTTP 409 and nothing is delivered.</li><li>The <strong>Tradeboard Username</strong> parameter must match the Tradeboard account that ran <code>/link</code> in Telegram. If no linked user matches, the API returns HTTP 404.</li><li><strong>Telegram Priority</strong> is clamped to the range 1 to 10; anything outside it falls back to 5.</li><li>Internet connection must remain active.</li></ol><hr><h2 id="summary" tabindex="-1">Summary <a class="header-anchor" href="#summary" aria-label="Permalink to &quot;Summary&quot;">​</a></h2><table tabindex="0"><thead><tr><th>Step</th><th>Description</th><th>Output</th></tr></thead><tbody><tr><td>1</td><td>Create Telegram bot + authenticate via Tradeboard</td><td>Bot ready</td></tr><tr><td>2</td><td>Add Telegram module to strategy AFL</td><td>AFL with alerts</td></tr><tr><td>3</td><td>Save analysis settings as APX</td><td>MyStrategy_Explore.apx</td></tr><tr><td>4</td><td>Map APX in Batch file</td><td>MyStrategy_Batch.abb</td></tr><tr><td>5</td><td>Schedule daily at 6 PM IST</td><td>Automatic daily alerts</td></tr></tbody></table><p>When combined, this provides a reliable fully automated <strong>Daily timeframe alerting system</strong> using AmiBroker + Tradeboard + Telegram.</p>`,71)])])}const g=s(l,[["render",i]]);export{h as __pageData,g as default};
