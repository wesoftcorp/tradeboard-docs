# Version 1.0.0.19 Launched

04th Jan 2025

* Data API Implemented for 5paisa , Angel, Upstox, Fyers, Firstock, Flatrade, Dhan, ICICI Direct, shoonya, Zebu
* Fixing log module and will be written once the placesmartorder is sentiment.
* Historical Date with GMT/UTC timing fix
*   While sending Basket Orders. Now Buy Orders will execute on priority compared to sell orders.&#x20;

    This helps traders to manage hedged trades and manage margins effectively.
* Fyers Data API fixed to support special symbols like 'M\&M'
* Dhan Broker V2 API Migration
* Added: Bruno and Postman collections are now available in the /collections folder for easier API testing and documentation.
* Updated readme file with stat badges
* Amibroker Amiquote Ticker API (enabled) to connect with Amibroker
* Updated Jinja library in requirement.txt
* Updated copyright year to 2025
* Dashboard Error Fix if the user changes the apikey and api secret to handle the invalid login gracefully.
* Ubuntu Server Install Script updated for Firstock and Flattrade\
  Removed hardcoding of FyersAPI Class and removed hardcoding of D,W,M in the intervals API

