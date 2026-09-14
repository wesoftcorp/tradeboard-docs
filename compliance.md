# Compliance

## Compliance and Regulatory Position

This document describes what Tradeboard is, how it operates, and where it stands in relation to the Securities and Exchange Board of India (SEBI) regulatory framework for algorithmic trading.

It is intended as a plain-language reference for users, broker compliance teams, and anyone evaluating Tradeboard in a regulated context. It is not legal advice.

### What Tradeboard Is

Tradeboard is open-source software published under the AGPL-3.0 licence on GitHub and PyPI. It is a broker-agnostic order execution platform that helps traders connect their own code to their own broker accounts.

Tradeboard is not a service, a subscription platform, a hosted execution engine, an algo marketplace, a broker, or an advisory.

### How Tradeboard Operates

1. **The trader downloads the source code** from GitHub or installs the Python package from PyPI.
2. **The trader deploys Tradeboard on their own infrastructure**, such as a home PC, a VPS, a Mac Mini, or a Docker container they control.
3. **The trader configures their own broker API credentials** in a local environment file on that infrastructure.
4. **Tradeboard makes API calls directly from the trader's machine to the trader's broker.** There is no intermediate server, proxy, relay, or observation point operated by creator/maintainer or any affiliated entity.

Order flow, credentials, positions, and trade data never leave the trader's infrastructure. Neither Tradeboard nor its maintainer has any technical visibility into them. The only network egress Tradeboard initiates is to the broker's own API, plus any outbound notification the operator configures themselves, such as a Telegram or WhatsApp alert.

### The Four Regulatory Facts

Under the SEBI framework for algorithmic trading (circular SEBI/HO/MIRSD/MIRSD-PoD/P/2025/0000013 dated February 4, 2025, in force since April 1, 2026), four facts define Tradeboard's position:

**1. Tradeboard is open-source software distributed on GitHub and PyPI.** It is published source code, not a service offering. The equivalent category is AmiBroker, MetaTrader, or any Python library on PyPI.

**2. Tradeboard does not host, route, proxy, or observe any order flow.** Traders run Tradeboard on their own infrastructure. The public IP that reaches the broker API gateway is the trader's own. The static IP registered with the broker under the SEBI framework is the trader's own. See [Static IP](static-ip.md) for what that registration involves.

**3. Tradeboard does not distribute trading strategies.** Tradeboard ships execution plumbing only. Traders write their own strategy logic or bring it from elsewhere. No strategies with performance claims are published or distributed through Tradeboard. The SEBI Research Analyst licensing requirement for black-box strategy distribution does not apply because no such distribution takes place.

**4. Tradeboard has no commercial association with any broker, research analyst, investment adviser, or financial services entity.** There are no referral arrangements, no brokerage revenue shares, no co-marketing deals, no bundled advisory partnerships, and no "sign up with broker X to get Tradeboard" promotions. Broker integrations in the source code exist solely because traders use those brokers, not because of any relationship between the maintainer and the broker.

### Trader Responsibilities

Because the trader is the operator of their own Tradeboard instance, the trader is the party responsible for all regulatory obligations that attach to the use of broker APIs. This includes:

* Procuring and registering a static IP with their broker, as required by the SEBI framework
* Keeping order flow within the 10 orders-per-second threshold, or registering their strategy with their broker and the exchange if they exceed it. Tradeboard's own rate limits default to 10 orders per second and are configurable, so the operator, not the software, decides whether that threshold is respected
* Ensuring their use of the broker API complies with the broker's own API terms of service
* Obtaining any required licenses if they distribute strategies or provide investment advice to others

Tradeboard does not mediate, monitor, or manage any of these responsibilities on the trader's behalf.

### Note to Broker Compliance Teams

If you are a broker compliance or risk team evaluating Tradeboard in connection with a client running it against your API, the relevant technical facts are:

* Tradeboard runs on the client's own infrastructure
* Your API credentials remain on the client's machine
* API calls originate from the client's own IP address
* There is no Tradeboard server, gateway, or relay in the path between the client and your API

The source code is publicly available on GitHub for architectural verification. For specific compliance questions, contact the maintainer through the channels listed in the repository.

### Summary

Tradeboard is software. Traders run it on their own infrastructure using their own broker credentials and their own strategies. The maintainer has no visibility into any trader's activity and no commercial relationship with any broker or advisory entity. Responsibility for SEBI, exchange, and broker API compliance rests with the individual trader operating the software.

***

_This document describes the operational and regulatory position of Tradeboard as of its publication date. It is provided for informational purposes and does not constitute legal advice. Traders should consult their own compliance advisors for questions specific to their situation._
