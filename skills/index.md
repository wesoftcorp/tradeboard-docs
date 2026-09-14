# Skills

Skills are reusable capabilities for AI agents. Install them with a single command to enhance your agents with access to procedural knowledge.

Skills are designed to work with a wide range of AI agent frameworks and tools, helping make agents more capable and consistent.

Each skill encapsulates structured instructions and sometimes executable logic. That means instead of telling an agent how to do something from scratch with prompts, you can install a skill that encodes that knowledge for reuse.

### The Tradeboard Skill Packages

| Package | Covers | Repository |
| --- | --- | --- |
| [Execution](execution.md) | The full Tradeboard Python SDK surface: orders, execution algorithms, scanners, visualization, WebSocket streaming, and Telegram/WhatsApp alerts | [tradeboard-skills](https://github.com/wesoftcorp/tradeboard-skills) |
| [Indicators](indicators.md) | The `tradeboard.ta` library, Plotly charts, dashboards, and scanners | [tradeboard-indicator-skills](https://github.com/wesoftcorp/tradeboard-indicator-skills) |
| [Backtesting](backtesting.md) | VectorBT backtests for Indian, US, and crypto markets, with realistic cost models and QuantStats tearsheets | [vectorbt-backtesting-skills](https://github.com/marketcalls/vectorbt-backtesting-skills) |

Two related packages are not documented here but exist in the ecosystem: `tradeboard-execution-skills`, which pairs a backtest and a live implementation of the same strategy, and `tradeboard-claude-plugin`, a Claude Code plugin marketplace.

### Installing

All packages install through [skills.sh](https://github.com/vercel-labs/skills), which detects the agents on your machine and writes each skill into the directory that agent reads:

```bash
npx skills add marketcalls/tradeboard-skills
npx skills add marketcalls/tradeboard-indicator-skills
npx skills add marketcalls/vectorbt-backtesting-skills
```

Add `-g` to install globally rather than into the current project, and `-l` to list the skills a repository contains before installing.

### Skills Compared to MCP

Both let an AI agent work with Tradeboard, and they solve different halves of the problem.

| | Skills | [MCP](../mcp/README.md) |
| --- | --- | --- |
| What it gives the agent | Knowledge: how to structure a strategy, which endpoint to call, how to read the response | Capability: 49 callable tools that reach a running Tradeboard instance |
| Where the work happens | The agent writes Python that you run | The agent calls Tradeboard directly |
| Needs Tradeboard running | Only when the generated code runs | Yes, for every call |
| Good for | Building and backtesting strategies, dashboards, and scanners | Asking about positions, quotes, and Greeks, and placing orders conversationally |

They compose. A common setup is Skills installed for writing strategy code and MCP connected for inspecting the account while you write it.

### Safety

Generated code places real orders when you run it against a live Tradeboard instance. Run it in Analyzer mode first, read what it does before you run it, and treat a skill's output as a draft you own rather than a finished system. See [Responsibilities](../responsibilities.md).
