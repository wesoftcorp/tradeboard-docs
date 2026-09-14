import{_ as s,o as a,c as p,a2 as l}from"./chunks/framework.BXzK3EA4.js";const q=JSON.parse('{"title":"Button Trading Module (Modern)","description":"","frontmatter":{},"headers":[],"relativePath":"trading-platform/amibroker/button-trading-module-modern.md","filePath":"trading-platform/amibroker/button-trading-module-modern.md"}'),e={name:"trading-platform/amibroker/button-trading-module-modern.md"};function t(i,n,o,c,r,u){return a(),p("div",null,[...n[0]||(n[0]=[l(`<h1 id="button-trading-module-modern" tabindex="-1">Button Trading Module (Modern) <a class="header-anchor" href="#button-trading-module-modern" aria-label="Permalink to &quot;Button Trading Module (Modern)&quot;">​</a></h1><p>This AmiBroker order pad lets you place <strong>instant BUY or SELL orders directly from your chart</strong> using Tradeboard. Just enter your <strong>Tradeboard API key</strong> (from your Tradeboard app), fill in the <strong>symbol, quantity, product type (MIS/CNC/NRML), and exchange (like NSE)</strong>, then click the green BUY or red SELL button. Make sure <strong>Tradeboard is running.</strong></p><p>All orders are <strong>market orders</strong> sent immediately, and you can see the detailed request and response in the AmiBroker <strong>Trace Window</strong> for full transparency.</p><div class="language-clike vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">clike</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>///Rajeev Upadhyay - Creator of Tradeboard</span></span>
<span class="line"><span>//website - tradeboard.in / marketcalls.in</span></span>
<span class="line"><span>//Tradeboard - Amibroker Button Trading Module (Modern) v1.0</span></span>
<span class="line"><span>//Date - 03/07/2025</span></span>
<span class="line"><span>_SECTION_BEGIN(&quot;Tradeboard Button Trading Module (Modern)&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//Note : This Amibroker AFL Works only on 6.35 or higher version only.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/* -----------------Globals-----------------------------------------------  */</span></span>
<span class="line"><span>global _x0, _y0, IDset;</span></span>
<span class="line"><span>_x0   = 20;</span></span>
<span class="line"><span>_y0   = 20;</span></span>
<span class="line"><span>IDset = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>DT_CENTER  = 1;</span></span>
<span class="line"><span>DT_VCENTER = 4 | 32;</span></span>
<span class="line"><span>RequestTimedRefresh( 1, False );</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/* ---------------- helper ------------------------------------------------ */</span></span>
<span class="line"><span>procedure GfxSetColors( fg, bg )</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    GfxSetTextColor( fg );  GfxSetBkColor( bg );</span></span>
<span class="line"><span>    GfxSelectPen( fg );     GfxSelectSolidBrush( bg );</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function PointInside( px, py, x, y, w, h )</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    x += _x0;  y += _y0;</span></span>
<span class="line"><span>    return ( px&gt;=x AND px&lt;=x+w AND py&gt;=y AND py&lt;=y+h );</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/* --------------------------------------------------------------------------</span></span>
<span class="line"><span>   LeftClickInside: single-return version</span></span>
<span class="line"><span>   -------------------------------------------------------------------------- */</span></span>
<span class="line"><span>function LeftClickInside( x, y, w, h )</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    /* default = NO click */</span></span>
<span class="line"><span>    hit = False;                         // ? initialise return flag (scalar)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    mb  = GetCursorMouseButtons();       //   current mouse-button state</span></span>
<span class="line"><span>    if ( mb &amp; 8 )                        //   8 = left button pressed</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        px = GetCursorXPosition( 1 );    //   cursor X (pixels)</span></span>
<span class="line"><span>        py = GetCursorYPosition( 1 );    //   cursor Y (pixels)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        /* set flag only if pointer is inside the rectangle */</span></span>
<span class="line"><span>        if ( PointInside( px, py, x, y, w, h ) )</span></span>
<span class="line"><span>            hit = True;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* SINGLE exit-point */</span></span>
<span class="line"><span>    return hit;                          // always one scalar value</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/* ---------------- Static-var state helpers ------------------------------ */</span></span>
<span class="line"><span>function _GetState( id ){ return Nz( StaticVarGet(&quot;GFX_&quot;+id+GetChartID()),0 ); }</span></span>
<span class="line"><span>procedure _SetState( id, v ){ StaticVarSet(&quot;GFX_&quot;+id+GetChartID(),v); }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/* -----------------------  GfxSelect  (patched) -------------------------- */</span></span>
<span class="line"><span>function GfxSelect( id, csv, x, y, w, h, fg, bg )</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    x += _x0;  y += _y0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    s  = _GetState( id );   if( s == 0 ) s = -1;        // closed initially</span></span>
<span class="line"><span>    cnt= StrCount( csv, &quot;,&quot; ) + 1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* mouse */</span></span>
<span class="line"><span>    if( s &lt; 0 )                               // closed, header only</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        if( LeftClickInside( x-_x0, y-_y0, w, h ) ) s = -s;      // open</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    else                                      // open</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        // ***** PATCHED LINE *****</span></span>
<span class="line"><span>        if( LeftClickInside( x-_x0, y-_y0, w, (cnt+1)*h ) )</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            py = GetCursorYPosition(1);</span></span>
<span class="line"><span>            idx= round( 0.5 + ( py-(y-_y0) )/h );</span></span>
<span class="line"><span>            if( idx&gt;1 ) s = -(idx-1); else s = -s;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    _SetState( id, s );</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    sel = abs(s) - 1;                         // 0-based index</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* draw */</span></span>
<span class="line"><span>    GfxSetColors( fg, bg );</span></span>
<span class="line"><span>    GfxRoundRect( x, y, x+w, y+h, 5, 5 );</span></span>
<span class="line"><span>    GfxDrawText( StrExtract(csv,sel), x,y,x+w,y+h, DT_CENTER|DT_VCENTER );</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if( s &gt; 0 )</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        GfxSetColors( bg, fg );</span></span>
<span class="line"><span>        for( i = 0; i &lt; cnt; i++ )</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            yy = y + (i+1)*h;</span></span>
<span class="line"><span>            GfxRectangle( x, yy, x+w, yy+h );</span></span>
<span class="line"><span>            GfxDrawText( StrExtract(csv,i), x,yy,x+w,yy+h,</span></span>
<span class="line"><span>                         DT_CENTER|DT_VCENTER );</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return sel;                               // ONE return</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/* ------------------ Tradeboard HTTP poster (unchanged) ------------------- */</span></span>
<span class="line"><span>function PostOA( host, act, qty, apiKey, sym, exch, iprod )</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    url  = host + &quot;/api/v1/placeorder&quot;;</span></span>
<span class="line"><span>    body = &quot;{\\&quot;apikey\\&quot;:\\&quot;&quot;+apiKey+&quot;\\&quot;,&quot;+</span></span>
<span class="line"><span>           &quot;\\&quot;strategy\\&quot;:\\&quot;Amibroker\\&quot;,&quot;+</span></span>
<span class="line"><span>           &quot;\\&quot;symbol\\&quot;:\\&quot;&quot;+sym+&quot;\\&quot;,&quot;+</span></span>
<span class="line"><span>           &quot;\\&quot;action\\&quot;:\\&quot;&quot;+act+&quot;\\&quot;,&quot;+</span></span>
<span class="line"><span>           &quot;\\&quot;exchange\\&quot;:\\&quot;&quot;+exch+&quot;\\&quot;,&quot;+</span></span>
<span class="line"><span>           &quot;\\&quot;pricetype\\&quot;:\\&quot;MARKET\\&quot;,&quot;+</span></span>
<span class="line"><span>           &quot;\\&quot;product\\&quot;:\\&quot;&quot;+iprod+&quot;\\&quot;,&quot;+</span></span>
<span class="line"><span>           &quot;\\&quot;quantity\\&quot;:\\&quot;&quot;+qty+&quot;\\&quot;}&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    _TRACEF(&quot;Tradeboard request : %s&quot;,body);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    InternetSetHeaders(&quot;Content-Type: application/json\\r\\n&quot;);</span></span>
<span class="line"><span>    ih = InternetPostRequest(url,body);</span></span>
<span class="line"><span>    if( ih )</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        rsp = &quot;&quot;;</span></span>
<span class="line"><span>        while( ( iln = InternetReadString(ih) ) != &quot;&quot; ) rsp += iln;</span></span>
<span class="line"><span>        _TRACEF(&quot;Tradeboard response: %s&quot;,rsp);</span></span>
<span class="line"><span>        InternetClose(ih);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    else _TRACE(&quot;Tradeboard HTTP post failed&quot;);</span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/*---------------------------------------------------------------------------</span></span>
<span class="line"><span>      VERSION CHECK  (GUI code only if &gt;= 6.35)</span></span>
<span class="line"><span>---------------------------------------------------------------------------*/</span></span>
<span class="line"><span>ReqVer = 6.35;</span></span>
<span class="line"><span>if ( Version() &lt; ReqVer )</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    /* old release: show banner, nothing more */</span></span>
<span class="line"><span>    SetChartOptions(0,chartShowDates);</span></span>
<span class="line"><span>    GfxSetBkColor(colorBlack);</span></span>
<span class="line"><span>    GfxSetTextColor(colorRed);</span></span>
<span class="line"><span>    GfxSelectFont(&quot;Arial&quot;,16,700);</span></span>
<span class="line"><span>    GfxTextOut(&quot;This AFL needs AmiBroker 6.35 or later&quot;,40,40);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/*---------------------------------------------------------------------------</span></span>
<span class="line"><span>      Amibroker GUI and GFX Controls to Place Order in Tradeboard</span></span>
<span class="line"><span>---------------------------------------------------------------------------*/</span></span>
<span class="line"><span></span></span>
<span class="line"><span>else </span></span>
<span class="line"><span>{</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/* ----------------------------- Layout ---------------------------------- */</span></span>
<span class="line"><span>row  = 35; lblW = 60; gap = 7; tbW = 210; ddW = 110; btnW = 90; btnH = 30;</span></span>
<span class="line"><span>GfxSetTextColor(colorWhite); GfxSetBkColor(colorBlack);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/* Host */</span></span>
<span class="line"><span>GfxDrawText(&quot;Host&quot;,_x0,_y0,_x0+lblW,_y0+row,DT_VCENTER);</span></span>
<span class="line"><span>rc = GuiEdit(++IDset,_x0+lblW+gap,_y0,tbW,25,notifyEditChange);</span></span>
<span class="line"><span>if(rc==guiNew)GuiSetText(&quot;http://127.0.0.1:5000&quot;,IDset);</span></span>
<span class="line"><span>hostURL = GuiGetText(IDset);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/* Buttons (top-right) */</span></span>
<span class="line"><span>btnY  = _y0;</span></span>
<span class="line"><span>btnBX = _x0+lblW+gap+tbW+40;</span></span>
<span class="line"><span>GuiButton(&quot;BUY&quot; ,++IDset,btnBX       ,btnY,btnW,btnH,notifyClicked); buyID = IDset;</span></span>
<span class="line"><span>GuiButton(&quot;SELL&quot;,++IDset,btnBX+btnW+20,btnY,btnW,btnH,notifyClicked); sellID= IDset;</span></span>
<span class="line"><span>GuiSetColors(buyID ,buyID ,1,colorWhite,colorGreen,colorWhite);</span></span>
<span class="line"><span>GuiSetColors(sellID,sellID,1,colorWhite,colorRed ,colorWhite);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/* API key */</span></span>
<span class="line"><span>yy = _y0+row;</span></span>
<span class="line"><span>GfxDrawText(&quot;API Key&quot;,_x0,yy,_x0+lblW,yy+row,DT_VCENTER);</span></span>
<span class="line"><span>rc = GuiEdit(++IDset,_x0+lblW+gap,yy,tbW,25,notifyEditChange);</span></span>
<span class="line"><span>if(rc==guiNew)GuiSetText(&quot;******&quot;,IDset);</span></span>
<span class="line"><span>apiKey = GuiGetText(IDset);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/* Symbol */</span></span>
<span class="line"><span>yy += row;</span></span>
<span class="line"><span>GfxDrawText(&quot;Symbol&quot;,_x0,yy,_x0+lblW,yy+row,DT_VCENTER);</span></span>
<span class="line"><span>rc = GuiEdit(++IDset,_x0+lblW+gap,yy,tbW,25,notifyEditChange);</span></span>
<span class="line"><span>if(rc==guiNew)GuiSetText(&quot;RELIANCE&quot;,IDset);</span></span>
<span class="line"><span>symbol = GuiGetText(IDset);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/* Quantity */</span></span>
<span class="line"><span>yy += row;</span></span>
<span class="line"><span>GfxDrawText(&quot;Qty&quot;,_x0,yy,_x0+lblW,yy+row,DT_VCENTER);</span></span>
<span class="line"><span>rc = GuiEdit(++IDset,_x0+lblW+gap,yy,80,25,notifyEditChange);</span></span>
<span class="line"><span>if(rc==guiNew)GuiSetText(&quot;1&quot;,IDset);</span></span>
<span class="line"><span>qtyVal = StrToNum(GuiGetText(IDset));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/* Product &amp; Exchange */</span></span>
<span class="line"><span>yy += row;</span></span>
<span class="line"><span>iprodIdx = GfxSelect(&quot;iprod&quot;,&quot;MIS,CNC,NRML&quot;,</span></span>
<span class="line"><span>                     _x0+lblW+gap,yy,ddW,28,colorWhite,colorRed);</span></span>
<span class="line"><span>exchIdx  = GfxSelect(&quot;exch&quot; ,&quot;NSE,NFO,BSE,BFO,MCX,CDS&quot;,</span></span>
<span class="line"><span>                     _x0+lblW+gap+ddW+20,yy,ddW+25,28,colorWhite,colorBlue);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>iprod    = StrExtract(&quot;MIS,CNC,NRML&quot;,iprodIdx);</span></span>
<span class="line"><span>exchange = StrExtract(&quot;NSE,NFO,BSE,BFO,MCX,CDS&quot;,exchIdx);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/* -------------------- event loop -------------------- */</span></span>
<span class="line"><span>for( i=0;(cid=GuiGetEvent(i,0))&gt;0;i++ )</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    if( GuiGetEvent(i,1) == notifyClicked )</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        if( cid == buyID )</span></span>
<span class="line"><span>            PostOA(hostURL,&quot;BUY&quot; ,qtyVal,apiKey,symbol,exchange,iprod);</span></span>
<span class="line"><span>        if( cid == sellID )</span></span>
<span class="line"><span>            PostOA(hostURL,&quot;SELL&quot;,qtyVal,apiKey,symbol,exchange,iprod);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/* Chart */</span></span>
<span class="line"><span>SetChartOptions(0,chartShowArrows|chartShowDates);</span></span>
<span class="line"><span>Plot(Close,&quot;Price&quot;,colorDefault,styleCandle);</span></span>
<span class="line"><span>_N( Title = StrFormat(&quot;{{NAME}} - {{INTERVAL}} {{DATE}}  O %g H %g L %g C %g (%.1f%%)  &quot;</span></span>
<span class="line"><span>       +&quot;Qty %g  iprod %s  Exch %s&quot;,</span></span>
<span class="line"><span>       O,H,L,C,SelectedValue(ROC(C,1)),qtyVal,iprod,exchange));</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>_SECTION_END();</span></span></code></pre></div>`,4)])])}const y=s(e,[["render",t]]);export{q as __pageData,y as default};
