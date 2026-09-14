# Button Trading Module (Modern)

This AmiBroker order pad lets you place **instant BUY or SELL orders directly from your chart** using Tradeboard. Just enter your **Tradeboard API key** (from your Tradeboard app), fill in the **symbol, quantity, product type (MIS/CNC/NRML), and exchange (like NSE)**, then click the green BUY or red SELL button. Make sure **Tradeboard is running.**

All orders are **market orders** sent immediately, and you can see the detailed request and response in the AmiBroker **Trace Window** for full transparency.

```clike
///Rajeev Upadhyay - Creator of Tradeboard
//website - tradeboard.in / marketcalls.in
//Tradeboard - Amibroker Button Trading Module (Modern) v1.0
//Date - 03/07/2025
_SECTION_BEGIN("Tradeboard Button Trading Module (Modern)");

//Note : This Amibroker AFL Works only on 6.35 or higher version only.

/* -----------------Globals-----------------------------------------------  */
global _x0, _y0, IDset;
_x0   = 20;
_y0   = 20;
IDset = 0;

DT_CENTER  = 1;
DT_VCENTER = 4 | 32;
RequestTimedRefresh( 1, False );

/* ---------------- helper ------------------------------------------------ */
procedure GfxSetColors( fg, bg )
{
    GfxSetTextColor( fg );  GfxSetBkColor( bg );
    GfxSelectPen( fg );     GfxSelectSolidBrush( bg );
}

function PointInside( px, py, x, y, w, h )
{
    x += _x0;  y += _y0;
    return ( px>=x AND px<=x+w AND py>=y AND py<=y+h );
}

/* --------------------------------------------------------------------------
   LeftClickInside: single-return version
   -------------------------------------------------------------------------- */
function LeftClickInside( x, y, w, h )
{
    /* default = NO click */
    hit = False;                         // ? initialise return flag (scalar)

    mb  = GetCursorMouseButtons();       //   current mouse-button state
    if ( mb & 8 )                        //   8 = left button pressed
    {
        px = GetCursorXPosition( 1 );    //   cursor X (pixels)
        py = GetCursorYPosition( 1 );    //   cursor Y (pixels)

        /* set flag only if pointer is inside the rectangle */
        if ( PointInside( px, py, x, y, w, h ) )
            hit = True;
    }

    /* SINGLE exit-point */
    return hit;                          // always one scalar value
}

/* ---------------- Static-var state helpers ------------------------------ */
function _GetState( id ){ return Nz( StaticVarGet("GFX_"+id+GetChartID()),0 ); }
procedure _SetState( id, v ){ StaticVarSet("GFX_"+id+GetChartID(),v); }

/* -----------------------  GfxSelect  (patched) -------------------------- */
function GfxSelect( id, csv, x, y, w, h, fg, bg )
{
    x += _x0;  y += _y0;

    s  = _GetState( id );   if( s == 0 ) s = -1;        // closed initially
    cnt= StrCount( csv, "," ) + 1;

    /* mouse */
    if( s < 0 )                               // closed, header only
    {
        if( LeftClickInside( x-_x0, y-_y0, w, h ) ) s = -s;      // open
    }
    else                                      // open
    {
        // ***** PATCHED LINE *****
        if( LeftClickInside( x-_x0, y-_y0, w, (cnt+1)*h ) )
        {
            py = GetCursorYPosition(1);
            idx= round( 0.5 + ( py-(y-_y0) )/h );
            if( idx>1 ) s = -(idx-1); else s = -s;
        }
    }
    _SetState( id, s );

    sel = abs(s) - 1;                         // 0-based index

    /* draw */
    GfxSetColors( fg, bg );
    GfxRoundRect( x, y, x+w, y+h, 5, 5 );
    GfxDrawText( StrExtract(csv,sel), x,y,x+w,y+h, DT_CENTER|DT_VCENTER );

    if( s > 0 )
    {
        GfxSetColors( bg, fg );
        for( i = 0; i < cnt; i++ )
        {
            yy = y + (i+1)*h;
            GfxRectangle( x, yy, x+w, yy+h );
            GfxDrawText( StrExtract(csv,i), x,yy,x+w,yy+h,
                         DT_CENTER|DT_VCENTER );
        }
    }
    return sel;                               // ONE return
}

/* ------------------ Tradeboard HTTP poster (unchanged) ------------------- */
function PostOA( host, act, qty, apiKey, sym, exch, iprod )
{
    url  = host + "/api/v1/placeorder";
    body = "{\"apikey\":\""+apiKey+"\","+
           "\"strategy\":\"Amibroker\","+
           "\"symbol\":\""+sym+"\","+
           "\"action\":\""+act+"\","+
           "\"exchange\":\""+exch+"\","+
           "\"pricetype\":\"MARKET\","+
           "\"product\":\""+iprod+"\","+
           "\"quantity\":\""+qty+"\"}";

    _TRACEF("Tradeboard request : %s",body);

    InternetSetHeaders("Content-Type: application/json\r\n");
    ih = InternetPostRequest(url,body);
    if( ih )
    {
        rsp = "";
        while( ( iln = InternetReadString(ih) ) != "" ) rsp += iln;
        _TRACEF("Tradeboard response: %s",rsp);
        InternetClose(ih);
    }
    else _TRACE("Tradeboard HTTP post failed");
    return 0;
}

/*---------------------------------------------------------------------------
      VERSION CHECK  (GUI code only if >= 6.35)
---------------------------------------------------------------------------*/
ReqVer = 6.35;
if ( Version() < ReqVer )
{
    /* old release: show banner, nothing more */
    SetChartOptions(0,chartShowDates);
    GfxSetBkColor(colorBlack);
    GfxSetTextColor(colorRed);
    GfxSelectFont("Arial",16,700);
    GfxTextOut("This AFL needs AmiBroker 6.35 or later",40,40);
}

/*---------------------------------------------------------------------------
      Amibroker GUI and GFX Controls to Place Order in Tradeboard
---------------------------------------------------------------------------*/

else 
{

/* ----------------------------- Layout ---------------------------------- */
row  = 35; lblW = 60; gap = 7; tbW = 210; ddW = 110; btnW = 90; btnH = 30;
GfxSetTextColor(colorWhite); GfxSetBkColor(colorBlack);

/* Host */
GfxDrawText("Host",_x0,_y0,_x0+lblW,_y0+row,DT_VCENTER);
rc = GuiEdit(++IDset,_x0+lblW+gap,_y0,tbW,25,notifyEditChange);
if(rc==guiNew)GuiSetText("http://127.0.0.1:5000",IDset);
hostURL = GuiGetText(IDset);

/* Buttons (top-right) */
btnY  = _y0;
btnBX = _x0+lblW+gap+tbW+40;
GuiButton("BUY" ,++IDset,btnBX       ,btnY,btnW,btnH,notifyClicked); buyID = IDset;
GuiButton("SELL",++IDset,btnBX+btnW+20,btnY,btnW,btnH,notifyClicked); sellID= IDset;
GuiSetColors(buyID ,buyID ,1,colorWhite,colorGreen,colorWhite);
GuiSetColors(sellID,sellID,1,colorWhite,colorRed ,colorWhite);

/* API key */
yy = _y0+row;
GfxDrawText("API Key",_x0,yy,_x0+lblW,yy+row,DT_VCENTER);
rc = GuiEdit(++IDset,_x0+lblW+gap,yy,tbW,25,notifyEditChange);
if(rc==guiNew)GuiSetText("******",IDset);
apiKey = GuiGetText(IDset);

/* Symbol */
yy += row;
GfxDrawText("Symbol",_x0,yy,_x0+lblW,yy+row,DT_VCENTER);
rc = GuiEdit(++IDset,_x0+lblW+gap,yy,tbW,25,notifyEditChange);
if(rc==guiNew)GuiSetText("RELIANCE",IDset);
symbol = GuiGetText(IDset);

/* Quantity */
yy += row;
GfxDrawText("Qty",_x0,yy,_x0+lblW,yy+row,DT_VCENTER);
rc = GuiEdit(++IDset,_x0+lblW+gap,yy,80,25,notifyEditChange);
if(rc==guiNew)GuiSetText("1",IDset);
qtyVal = StrToNum(GuiGetText(IDset));

/* Product & Exchange */
yy += row;
iprodIdx = GfxSelect("iprod","MIS,CNC,NRML",
                     _x0+lblW+gap,yy,ddW,28,colorWhite,colorRed);
exchIdx  = GfxSelect("exch" ,"NSE,NFO,BSE,BFO,MCX,CDS",
                     _x0+lblW+gap+ddW+20,yy,ddW+25,28,colorWhite,colorBlue);

iprod    = StrExtract("MIS,CNC,NRML",iprodIdx);
exchange = StrExtract("NSE,NFO,BSE,BFO,MCX,CDS",exchIdx);

/* -------------------- event loop -------------------- */
for( i=0;(cid=GuiGetEvent(i,0))>0;i++ )
{
    if( GuiGetEvent(i,1) == notifyClicked )
    {
        if( cid == buyID )
            PostOA(hostURL,"BUY" ,qtyVal,apiKey,symbol,exchange,iprod);
        if( cid == sellID )
            PostOA(hostURL,"SELL",qtyVal,apiKey,symbol,exchange,iprod);
    }
}

/* Chart */
SetChartOptions(0,chartShowArrows|chartShowDates);
Plot(Close,"Price",colorDefault,styleCandle);
_N( Title = StrFormat("{{NAME}} - {{INTERVAL}} {{DATE}}  O %g H %g L %g C %g (%.1f%%)  "
       +"Qty %g  iprod %s  Exch %s",
       O,H,L,C,SelectedValue(ROC(C,1)),qtyVal,iprod,exchange));
}
_SECTION_END();

```
