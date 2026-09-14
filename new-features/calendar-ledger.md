# Calendar Ledger

Tradeboard includes an integrated **Calendar Ledger** designed for active algorithmic traders, quantitative funds, and retail traders to analyze daily performance, track closed-trade P&L, and review trading frequency at a glance.

---

## Overview

The Calendar Ledger transforms raw transaction logs into an intuitive, color-coded calendar heat map. Rather than sifting through tabular broker statements, traders can immediately identify winning days, drawdown clusters, and trading frequency patterns.

### Key Capabilities

- **Interactive Monthly Grid**: Full-month calendar view with daily net P&L figures prominently displayed.
- **Dynamic Color Coding**:
  - 🟢 **Profitable Days**: Highlighted in soft green with positive net returns.
  - 🔴 **Loss Days**: Highlighted in soft red with negative net drawdown.
  - ⚪ **Breakeven / Inactive Days**: Neutral display when no closed positions exist.
- **Detailed Day Inspection**: Clicking on any date opens an itemized modal of all executions for that trading session, including symbol, instrument type, entry/exit price, trade duration, and realized P&L.
- **Multi-Currency Support**: Seamless formatting in Indian Rupees (**₹**) for Indian stock brokers and US Dollars (**$**) for crypto exchanges.
- **Aggregate Performance Summary**:
  - Gross Realized P&L
  - Net Profit Factor
  - Winning Days vs. Losing Days ratio
  - Average Daily Gain / Average Daily Loss

---

## Accessing the Calendar Ledger

1. Log into your **Tradeboard** dashboard.
2. From the main navigation sidebar, select **Calendar Ledger** (under Analytics / Dashboard).
3. Use the month/year picker at the top to navigate between different historical periods.
4. Click any active trading day to inspect trade logs and execution timestamps.

---

## Integration with Sandbox & Live Accounts

The Calendar Ledger works across both live broker accounts and the **Tradeboard Sandbox**:
- **Sandbox Mode**: Perfect for forward-testing automated bots over weeks to evaluate consistency without risking real capital.
- **Live Trading**: Syncs directly with broker trade logs to ensure an accurate post-market journal.

::: tip PRO TIP
Review your Calendar Ledger weekly to identify if specific days of the week (e.g., expiry Thursdays) suffer from oversized drawdowns, and adjust your Strategy RMS max-drawdown rules accordingly.
:::
