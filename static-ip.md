# Static IP

### Key FAQs About Static IP Regulation

**1) Can I deploy my algo on AWS or other cloud services without extra cost for IPs?**\
You can deploy on AWS or other cloud platforms, but for **API-based order placement** you still need a **static public IP** mapped with your broker if your setup falls under the client API/static-IP model. Whether the cloud provider charges separately for that IP depends on the provider and plan. The regulation requires the **static IP**, not that it must be free. VPS providers often include a fixed public IP by default, but you should verify this before setup.

**2) What if I travel often or work from different locations?**\
If your live order flow depends on a registered static IP, frequent location changes are not practical unless your trading system remains hosted on the same server. Exchange implementation standards allow clients to update mapped static IPs, but **not more than once in a calendar week**, except in extraordinary cases handled by the broker.

**3) Is it possible to register more than one static IP?**\
Yes. The client may provide **one primary static IP** and may also provide **one secondary static IP** for redundancy.

**4) Do I need a static IP if I’m just streaming market data?**\
The framework and FAQ focus the client static-IP requirement on **API use for placing orders** by a tech-savvy investor. So if your application is only consuming market data and not placing/modifying/cancelling orders, the static-IP requirement is generally **not the main trigger**. In practice, you should still check your broker/API portal requirements because implementation details can differ operationally.

**5) Can I use an IP address from any country?**\
The core SEBI/NSE framework I checked does **not** state a general “approved countries / restricted countries” list for client static IPs in the cited documents. So it is safer **not** to claim that any country is automatically allowed. The more reliable statement is: use a stable public static IP that your broker accepts and can map under its onboarding/compliance process. I did not find an authoritative exchange/SEBI source in the materials above establishing a blanket country rule.

**6) What if I’m a service provider placing trades for clients?**\
If you are offering algos to others, the treatment changes. Under the framework, **algo providers** have to be empanelled, and **black box algos** require the algo provider to register as a **Research Analyst** and maintain the required research documentation. Also, exchange FAQ guidance says all such strategies are to be hosted on the broker’s server, not freely run from a shared outside setup. So simply placing trades for multiple clients from one shared IP is **not** enough for compliance.

**7) Will I need to register if my app sends too many orders?**\
The implementation standards set an initial threshold of **10 orders per second per exchange**. Above that, the algo/strategy generally falls into the exchange registration framework and needs the required approvals and identification. It is safer not to describe repeated spikes as automatically “okay”; the practical standard is to design the system so it stays within the permitted unregistered limits unless formally registered.

**8) Can I use one static IP for multiple trading accounts?**\
A static IP can be mapped to **only one client at a time**. The main exception in the implementation standards is that it may be shared among clients belonging to the **same family**, subject to the required request/authentication process. So the older wording should be tightened: one IP is **not** generally a free-for-all across multiple accounts with the same broker. Cross-broker usage is not explicitly addressed in the cited standards the same way, so avoid making a broad claim there unless your brokers confirm it.

***

