---
description: Responsibilities for Tradeboard Users
---

# Responsibilities

Tradeboard is designed to be a transparent, open-source platform that allows individual traders to automate their own strategies. Unlike commercial black-box solutions, Tradeboard gives you full control and visibility - but with that freedom comes complete responsibility.

This section outlines the key responsibilities every user must understand before operating Tradeboard.

***

### 1. Transparency vs. Black-Box Vendors

* **No hidden logic**: Tradeboard is 100% transparent. All execution logic is visible and customizable.
* **Comparison with paid platforms**: Many commercial algo platforms hide their execution rules or charge high fees for access, forcing users to trust them blindly.
* **Freedom with risk**: In Tradeboard, transparency means you control everything, but you also bear responsibility for testing and reliability.

***

### 2. Community-Driven Nature

* **Support model**: Tradeboard is community-driven. Support happens through **Discord** and **GitHub issues**.
* **No vendor hotline**: There is no centralized support desk. Users must learn, experiment, and engage with peers.
* **Active participation**: Users are encouraged to ask **relevant questions** and contribute back. Passive “plug-and-play” expectations will not work.

***

### 3. Boundaries of the Platform

* **Single-user architecture**: Tradeboard is built as a single-user tool, not a multi-tenant SaaS.
* **Low-code, not no-code**: Tradeboard simplifies complexity but still requires coding knowledge to design and test strategies.
* **What Tradeboard is not**:
  * Not a guaranteed profit system.
  * Not a compliance shield: users must follow broker and regulatory rules.
  * Not a broker replacement: orders still pass through your broker’s RMS.

***

### 4. Technical and Infrastructure Responsibilities

* **System Maintenance**: Keep your installation updated with the latest patches and fixes.
* **Security Practices**: Configure firewalls, SSL, and protect API keys. Secure hosting is your responsibility.
* **Data Management**: You own your data. Maintain backups and secure sensitive credentials.

***

### 5. Compliance and Regulatory Obligations

* **Broker API Rules**: Follow your broker’s API terms, including static IP use and respecting rate limits.
* **Personal Use Only**: Tradeboard is meant for individual trading. Commercial use requires proper regulatory empanelment.
* **Risk Management Systems**: Broker RMS safeguards exist, but users are responsible for losses caused by system failures or poorly designed strategies.

***

### 6. Strategy Development and Operational Discipline

* **Build your own strategies**: Tradeboard does not provide trading systems: you must design them yourself.
* **Testing before deployment**: Thorough backtesting and paper trading are mandatory before going live.
* **Real-time Monitoring**: Algorithms must be continuously monitored. Users must be prepared to intervene when necessary.
* **Documentation**: Keep records of strategies, trades, and performance for both analysis and regulatory needs.

***

### 7. API Usage and Abuse Prevention

* **Rate Limit Adherence**: Respect all API limits for logins, order placements, and WebSocket connections.
* **Connection Management**: Avoid repeated or unnecessary API calls that may overload systems or trigger broker restrictions.

***

### 8. Risk Acknowledgment

* **Financial Responsibility**: All profits and losses are the user’s responsibility. Neither the Tradeboard team nor your broker can be held liable.
* **System Reliability**: Failures such as internet downtime, server crashes, or coding errors can impact execution. Users must accept this risk.
* **No Guaranteed Support**: Tradeboard is community-supported. Immediate help during trading hours cannot be guaranteed.

***

### 9. The Maintenance Era Philosophy

Tradeboard contributors focus on building and maintaining **core features first**, rather than rushing into “fancy” features. Even with AI-assisted development, every feature must be built, tested, and validated carefully.

The **goal is simplicity**: reduce the complexity of algo infrastructure so traders and coders can focus on strategy development instead of low-level implementation.

### 10. Upgrade Discipline

* **When to upgrade**: Upgrade only when you are ready to test new features or security patches. Do not upgrade blindly during trading hours.
* **How to upgrade**: Always test upgrades first in a **safe environment** such as GitHub Codespaces, Docker test containers, or a staging server before applying changes to your live setup.
* **Backup first**: Before every upgrade, take a full backup of your Tradeboard directory. A simple method is to **zip the entire folder** and store it safely. This ensures you can roll back if something goes wrong.

***

### Final Note

Tradeboard is a **toolbox, not a solution**. It is designed to empower you with automation while keeping everything transparent and customizable. In return, you must accept the responsibilities of operating, securing, and maintaining your system.

Open source thrives when freedom meets accountability. Tradeboard gives you both: **the transparency of control, and the responsibility of ownership**.

***
