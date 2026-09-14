# Download & Install Library

**Download the MQL5 Libray and Unzip it**

[Download File](../../.gitbook/assets/Tradeboard.zip)

**Open MQL5 -> File -> Open DataFolder as shown below**

<figure><img src="/assets/image (31).png" alt=""><figcaption></figcaption></figure>

**Navigate to \MQL5\Include folder and paste the Unzipped Tradeboard Folder here as shown below**

<figure><img src="/assets/image (32).png" alt=""><figcaption></figcaption></figure>

Now the Installation Process is completed if you open MetaEditor you should see the Folders with Library Files as shown below

<figure><img src="/assets/image (26).png" alt=""><figcaption></figcaption></figure>

The `Tradeboard` folder contains four files:

* `TradeboardApi.mqh` - the six order functions. This is the only file you include.
* `CommonDefs.mqh` - the `Exchanges`, `ProductTypes` and `PriceTypes` enums.
* `UrlParser.mqh` - splits your Tradeboard URL into host, path and port.
* `WinINet.mqh` - the HTTP transport, built on `wininet.dll`.

Put the folder at `MQL5\Include\Tradeboard`, so the full path to the main file is `MQL5\Include\Tradeboard\TradeboardApi.mqh`. That matches the `#include <Tradeboard/TradeboardApi.mqh>` line used on the next page. If MetaEditor was already open, close and reopen it so it picks up the new include folder.

Because `WinINet.mqh` imports `wininet.dll` and `kernel32.dll`, every EA built on this library needs **Allow DLL imports** enabled. Set it per EA in the Common tab of the EA properties dialog, or globally under Tools, Options, Expert Advisors.

