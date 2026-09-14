<AmiQuote Version="4.00">
<DataSource>
<Name>OpenAlgo</Name>
<Description>OpenAlgo EOD and Intraday Data from OpenAlgo Connected Broker</Description>
<URLTemplate>http://127.0.0.1:5000/api/v1/ticker/{symbol}?apikey={api_key}&amp;interval={interval_extra}&amp;from={from_ymd}&amp;to={to_ymd}&amp;format=txt
</URLTemplate>
<ErrorMsgPrefix/>
<Options>
<UseTodayAsEndDate>0</UseTodayAsEndDate>
<RunJavascript>0</RunJavascript>
</Options>
<Limits ReqPerMinute="0"/>
<CSVFormatOptions RemoveDoubleQuotes="0" ConvertISODateTime="0"/>
<ImporterOptions>
<FormatEOD>Ticker,Date_YMD,Open,High,Low,Close,Volume</FormatEOD>
<FormatIntra>Ticker,Date_YMD,Time,Open,High,Low,Close,Volume</FormatIntra>
<FileExtension>aqu1</FileExtension>
<Separators>,</Separators>
</ImporterOptions>
<SupportedIntervals>
<Interval Period="1440" MaxDays="3650" ExtraToken="D"/>
<Interval Period="1" MaxDays="1" ExtraToken="1m"/>
<Interval Period="5" MaxDays="0" ExtraToken=""/>
<Interval Period="10" MaxDays="0" ExtraToken=""/>
<Interval Period="15" MaxDays="0" ExtraToken=""/>
<Interval Period="30" MaxDays="0" ExtraToken=""/>
<Interval Period="60" MaxDays="0" ExtraToken=""/>
</SupportedIntervals>
<Javascript>// the processing function takes text as input and produces text as ouput
function Process( input )
{
	return input;
}</Javascript>
</DataSource>
</AmiQuote>
