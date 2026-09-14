# Mini FOSS Universe

The **Tradeboard Mini FOSS Universe** is a curated collection of open-source projects, SDKs, libraries, and integrations that extend the Tradeboard ecosystem across languages, platforms, and workflows.

Whether you’re building trading strategies, data pipelines, dashboards, or AI-driven systems, Tradeboard provides open-source tools that integrate seamlessly into every modern trading workflow.

This ecosystem is designed to be:

* **Modular**: use only what you need
* **Extensible**: customize and build on top of existing components
* **Language-agnostic**: work in the stack you’re most comfortable with
* **Production-ready**: stable APIs with long-term support

All projects in the Mini FOSS Universe are community-driven and built with real-world trading and automation use cases in mind.

***

### Core Project

| Component            | Repository                                                                         |
| -------------------- | ---------------------------------------------------------------------------------- |
| **Tradeboard Core**    | [https://github.com/wesoftcorp/tradeboard-docs](https://github.com/wesoftcorp/tradeboard-docs) |

**Tradeboard Core** is the central heartbeat of the ecosystem, powering the API service, authentication, routing, and platform logic.\
\
All SDKs, libraries, and integrations interact with the API endpoints exposed by Tradeboard Core.

***

### Libraries and SDKs

Tradeboard provides official SDKs and libraries to help developers interact with the Tradeboard API without making raw HTTP calls. These packages handle authentication, request formatting, and response parsing, allowing you to focus on strategy and logic.

#### API Version

The current stable version of the Tradeboard API is **v1**.

* All SDKs and integrations listed below are built against **API v1**
* v1 is stable, backward-compatible, and recommended for production use
* Future versions will be introduced without breaking existing v1 integrations

***

### SDKs

SDKs are officially supported client packages intended for application development and system-level integrations.

| Language / Platform | Repository                                                                                                       |
| ------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Python              | [https://github.com/wesoftcorp/tradeboard-python-library](https://github.com/wesoftcorp/tradeboard-python-library) |
| Node.js             | [https://github.com/wesoftcorp/tradeboard-node](https://github.com/wesoftcorp/tradeboard-node)                     |
| Java                | [https://github.com/wesoftcorp/tradeboard-java](https://github.com/wesoftcorp/tradeboard-java)                     |
| RUST                | [https://github.com/wesoftcorp/tradeboard-rust](https://github.com/wesoftcorp/tradeboard-rust)                     |
| .NET / C#           | [https://github.com/wesoftcorp/tradeboard.NET](https://github.com/wesoftcorp/tradeboard.NET)                       |
| Go                  | [https://github.com/wesoftcorp/tradeboard-go](https://github.com/wesoftcorp/tradeboard-go)                         |

***

### Libraries and Platform Integrations

These libraries and tools extend Tradeboard support to popular trading platforms, analysis tools, and user interfaces.

| Platform / Tool                 | Repository                                                                                           |
| ------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Excel Add-in**                | [https://github.com/marketcalls/Tradeboard-Excel](https://github.com/marketcalls/Tradeboard-Excel)       |
| **Amibroker Plugin**            | [https://github.com/marketcalls/TradeboardPlugin](https://github.com/marketcalls/TradeboardPlugin)       |
| **Backtrader Integration**      | [https://github.com/p2c2e/tradeboard-backtrader](https://github.com/p2c2e/tradeboard-backtrader)         |
| **PineTS**                      | [https://github.com/wesoftcorp/tradeboard-pinets](https://github.com/wesoftcorp/tradeboard-pinets)     |
| **Tradeboard Charts**             | [https://github.com/wesoftcorp/tradeboard-charts](https://github.com/wesoftcorp/tradeboard-charts)     |
| **AlgoMirror**                  | [https://github.com/marketcalls/algomirror](https://github.com/marketcalls/algomirror)               |
| **Tradeboard chart**              | [https://github.com/crypt0inf0/tradeboard-chart](https://github.com/crypt0inf0/tradeboard-chart)         |
| **Tradeboard Heatmap**            | [https://github.com/wesoftcorp/tradeboard-heatmap](https://github.com/wesoftcorp/tradeboard-heatmap)   |
| **Historify (standalone)**      | [https://github.com/marketcalls/historify](https://github.com/marketcalls/historify)                 |
| **Tradeboard Helm Chart**         | [https://github.com/p2c2e/tradeboard\_helm](https://github.com/p2c2e/tradeboard_helm)                    |
| **MCP / AI Agents**             | [https://github.com/wesoftcorp/tradeboard-mcp](https://github.com/wesoftcorp/tradeboard-mcp)           |
| **Tradeboard Mobile (Flutter)**   | [https://github.com/wesoftcorp/tradeboard-mobile](https://github.com/wesoftcorp/tradeboard-mobile)     |
| **Web Portal**                  | [https://github.com/wesoftcorp/tradeboard-webpage](https://github.com/wesoftcorp/tradeboard-webpage)   |
| **Chrome Extension**            | [https://github.com/wesoftcorp/tradeboard-chrome](https://github.com/wesoftcorp/tradeboard-chrome)     |
| **Fast Scalper (Rust + Tauri)** | [https://github.com/marketcalls/fastscalper-tauri](https://github.com/marketcalls/fastscalper-tauri) |

Two of these deserve a note, because the feature also exists inside Tradeboard Core:

* **MCP.** Core ships its own Model Context Protocol server at `mcp/mcpserver.py`, with a local stdio transport and an optional OAuth-protected remote HTTP transport. The separate `tradeboard-mcp` repository is the older standalone server and its documentation. Prefer the built-in one, and see [MCP](mcp/README.md).
* **Historify.** Core ships Historify as a built-in DuckDB history store at `/historify`. The standalone `historify` repository is the separate full-stack application. See [Historify](new-features/historify.md).

***

### Agent Skills

Skills are installable instruction packages that teach an AI coding agent how to drive Tradeboard. They install through [skills.sh](https://github.com/vercel-labs/skills) with `npx skills add <repo>` and work across Claude Code, Cursor, Codex, OpenCode, Cline, Windsurf, and other agents.

| Skill package                    | Repository                                                                                                                           |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Tradeboard Skills (execution)**   | [https://github.com/wesoftcorp/tradeboard-skills](https://github.com/wesoftcorp/tradeboard-skills)                                     |
| **Indicator Skills**              | [https://github.com/wesoftcorp/tradeboard-indicator-skills](https://github.com/wesoftcorp/tradeboard-indicator-skills)                 |
| **VectorBT Backtesting Skills**   | [https://github.com/marketcalls/vectorbt-backtesting-skills](https://github.com/marketcalls/vectorbt-backtesting-skills)             |
| **Execution Skills (dual-mode)**  | [https://github.com/wesoftcorp/tradeboard-execution-skills](https://github.com/wesoftcorp/tradeboard-execution-skills)                 |
| **Claude Code Plugin**            | [https://github.com/wesoftcorp/tradeboard-claude-plugin](https://github.com/wesoftcorp/tradeboard-claude-plugin)                       |

See [Skills](skills/README.md) for what each package installs and how to use it.

***

### Documentation and Examples

Each SDK and integration has dedicated documentation that includes installation steps, configuration guidance, and working examples:

* Python: [https://docs.algo.wesoftcorp.com/trading-platform/python](https://docs.algo.wesoftcorp.com/trading-platform/python)
* Node.js: [https://docs.algo.wesoftcorp.com/trading-platform/nodejs](https://docs.algo.wesoftcorp.com/trading-platform/nodejs)
* Java: [https://docs.algo.wesoftcorp.com/trading-platform/java](https://docs.algo.wesoftcorp.com/trading-platform/java)
* .NET: [https://docs.algo.wesoftcorp.com/trading-platform/.net](https://docs.algo.wesoftcorp.com/trading-platform/.net)
* Go: [https://docs.algo.wesoftcorp.com/trading-platform/go](https://docs.algo.wesoftcorp.com/trading-platform/go)
* RUST: https://docs.algo.wesoftcorp.com/trading-platform/rust
* Excel: [https://docs.algo.wesoftcorp.com/trading-platform/excel](https://docs.algo.wesoftcorp.com/trading-platform/excel)
* Amibroker Plugin: [https://docs.algo.wesoftcorp.com/trading-platform/amibroker/amibroker-plugin](https://docs.algo.wesoftcorp.com/trading-platform/amibroker/amibroker-plugin)
* Chrome Extension: [https://docs.algo.wesoftcorp.com/trading-platform/chrome-extension](https://docs.algo.wesoftcorp.com/trading-platform/chrome-extension)
* MCP / AI Agents: [https://docs.algo.wesoftcorp.com/mcp](https://docs.algo.wesoftcorp.com/mcp)
* Skills: [https://docs.algo.wesoftcorp.com/skills](https://docs.algo.wesoftcorp.com/skills)

***

### Philosophy

The Mini FOSS Universe reflects Tradeboard’s core philosophy:\
**open standards, transparent design, and tools that adapt to how traders actually work**.

You can use these projects independently, combine them into larger systems, or fork and extend them to suit your own trading infrastructure.

