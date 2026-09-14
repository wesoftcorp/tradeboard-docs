---
description: Tradeboard Release Notes
---

# Version 1.0.0.10 Launched

07 November 2024

**Major Changes**

1\)Added Robust Session Expiry Handling\
2\)Detect Broker Configuration at Login\
3\)Error Handling in improper Redirect URL\
4\)Werkzeug library upgrade to 3.1.2 - Security upgrade\
5\)token.html Enhanced UI and UX\
6\)Profile icon Sub Menu issue Fix\
7\)kotak bug fix in holdings display issue and PNL Calculation

**Environment Configuration:**\
Added SESSION\_EXPIRY\_TIME to .env and .sample.env files\
Set default value to '03:00' (3 AM IST)

Now Tradeboard will automatically identify the configured broker from .env

<figure><img src="/assets/image (15).png" alt=""><figcaption></figcaption></figure>

