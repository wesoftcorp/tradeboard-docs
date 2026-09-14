# Community Support

Tradeboard is community supported. There is no vendor helpdesk and no paid support tier: help comes from other traders and developers running the same software, and from the maintainers when they have time.

### Where to Get Help

| Channel | Use it for | Link |
| --- | --- | --- |
| Discord | Questions, setup problems, strategy discussion, release news | [https://www.tradeboard.in/discord](https://www.tradeboard.in/discord) |
| GitHub Issues | Reproducible bugs and feature requests | [github.com/marketcalls/tradeboard/issues](https://github.com/wesoftcorp/tradeboard-docs/issues) |
| GitHub Discussions | Open-ended questions that are not bugs | [github.com/marketcalls/tradeboard/discussions](https://github.com/wesoftcorp/tradeboard-docs/discussions) |
| X (Twitter) | Announcements | [@tradeboardHQ](https://twitter.com/tradeboardHQ) |

**Security issues are the exception.** Do not report a vulnerability in a public channel. Email `rajandran@tradeboard.in` instead, as described in the repository's `SECURITY.md`.

### Community Guidelines

* **Respect:** Treat every member with respect. No harassment or discrimination is tolerated.
* **Collaboration:** Feel free to ask for help and offer support. Share your knowledge and learn from others.
* **No Spam:** Keep discussions on-topic. Avoid spamming channels with promotions or irrelevant content.
* **No paid signal selling:** Tradeboard is execution infrastructure, not a marketplace. Do not use the community to sell strategies or tips.
* **Intellectual Property:** Respect copyright laws and do not share illegal downloads or copyrighted content.
* **Privacy:** Do not share personal information of yourself or others. Never paste an API key, a broker credential, or the contents of your `.env` file into a public channel or a GitHub issue.

### Asking a Question That Gets Answered

Tradeboard runs on your own machine against your own broker, so nobody else can see what went wrong. Include:

* your Tradeboard version, from the dashboard footer or `pyproject.toml`;
* your operating system and Python version;
* the broker plugin you are connected to;
* what you expected and what actually happened;
* the relevant lines from `log/`, with API keys and order IDs redacted.

"It does not work" cannot be answered. A log excerpt usually can.

### Before You Ask

Most questions are already answered:

* [What is Tradeboard?](README.md) for scope and boundaries
* [Getting Started](getting-started/README.md) for installation
* [API Documentation](api-documentation/v1/README.md) for the REST and WebSocket contract
* [Symbol Format](symbol-format.md) for how symbols are constructed
* [Responsibilities](responsibilities.md) for what you are expected to own
* [Contributors](contributors.md) for the development setup

Search the existing GitHub issues too. A bug you hit today has often been reported, and sometimes fixed, already.

### Contributing Back

The community works because people give as well as take. Useful contributions include reporting a reproducible bug, improving a documentation page, adding a broker plugin, and answering someone else's question on Discord. See [Contributors](contributors.md) for the development setup and pull-request conventions.

### What Support Does Not Cover

* Guaranteed response times, including during market hours.
* Debugging your trading strategy or its profitability.
* Broker-side problems. Contact your broker for API entitlement, rate limits, static IP registration, and account issues.
* Recovering money lost to a strategy, a misconfiguration, or an outage. See [Responsibilities](responsibilities.md).
