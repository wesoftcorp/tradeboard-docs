# Version 1.0.0.27 Launched

21th July 2025

#### Features Added

* Analyzer Mode Integration
  * Enabled Analyzer Mode toggle support in API and MCP Server
  * Introduced Analyzer Functions in Python SDK (v1.0.21)
  * Support for Analyzer Mode in MCP config and local MCP integration
* Broker Enhancements
  * Migrated Upstox API from V2 to V3 (Quotes, Historical Data, Intervals)
  * Fixes for Upstox quote depth and daily data issues
  * Flattrade daily data and volume decimal fixes included
* **Critical Fix : WebSocket and Docker Improvements**
  * Docker setup updated to support IST timings
  * WebSocket compatibility fixes for Docker
  * Hardcoded 127.0.0.1:5000 URLs removed from services

#### Fixes and Cleanup

* Depth LTP fixes
* Port binding conflict resolved
* Minor typo and code cleanup
* Requirements file updated
* Updated MCP search to include NSE\_INDEX, BSE\_INDEX, and other index symbols
* MCP config updated with API key support
* Removed packaging of local states and secrets (.env, db/, log/, etc.)

#### Documentation

* Readme and internal documentation updated to reflect Analyzer Mode and new configurations
