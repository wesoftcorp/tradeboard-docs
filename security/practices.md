# Security Practices

This page is an operator checklist for the current implementation. It avoids fixed security ratings and source line numbers, which become stale as the code changes.

### Installation Secrets

Protect these values and files:

* `APP_KEY`, `API_KEY_PEPPER`, and `FERNET_SALT` in `.env`;
* broker API credentials and callback configuration in `.env`;
* `db/tradeboard.db`, `db/logs.db`, `db/latency.db`, `db/health.db`, `db/sandbox.db`, and `db/historify.duckdb`;
* Remote MCP signing keys;
* strategy environment variables, source files, and backups.

Official first-run and install paths replace sample placeholders with random values. Never restore placeholder secrets over an existing deployment. Do not rotate the pepper or Fernet material without following a migration procedure that accounts for hashes and ciphertext.

### Account Authentication

* Use a unique application password and enable login TOTP.
* The current TOTP implementation does not generate recovery codes. Preserve the setup secret securely before replacing an authenticator device.
* Review active sessions from the Security dashboard and change the password to revoke device sessions after suspected compromise.
* Treat broker TOTP/PIN flows as separate credentials from Tradeboard TOTP.

### REST API Keys

* Tradeboard generates one current 64-character hexadecimal API key per user.
* Store it in a secret manager or environment variable, not in strategy source.
* Regeneration invalidates the old key immediately; update every client together.
* Most `/api/v1` schemas require `apikey` in the JSON body. Do not assume generic Bearer or header authentication.
* The current key has no per-operation scopes. Possession authorizes the public REST surface subject to validation, mode, Action Center behavior, and rate limits.
* Test order workflows in Analyzer Mode before using the same key with live mode.

### Public Deployment

* Terminate TLS at a maintained reverse proxy.
* Restrict direct access to Flask, port 8765 WebSocket, and port 5555 ZeroMQ.
* Keep `ZMQ_HOST` on loopback unless a deliberately protected multi-host topology is required.
* Configure the host firewall or cloud security group; Tradeboard has no CIDR allowlist.
* Set `TRUST_PROXY_HEADERS=True` only when the reverse proxy is the sole path to the app.
* Keep debug mode disabled on any non-loopback deployment.
* Review CORS and CSP settings after adding an external frontend or integration.

### Rate Limits and IP Bans

Endpoint limits come from the deployment environment. `.sample.env` defaults include separate login, reset, general API, order, smart-order, webhook, strategy, and MCP limits.

Automatic IP banning is off by default. Before enabling it:

1. verify the proxy/IP boundary;
2. review legitimate 404 and invalid-key traffic;
3. choose temporary or permanent durations deliberately;
4. retain host-console access for recovery;
5. test manual unban and tracker clearing.

Rate limits and IP bans are complementary; neither replaces upstream denial-of-service controls.

### Traffic and Logs

Traffic logging captures metadata only. It excludes request/response bodies and headers, so it should not contain body-carried API keys. Other application logs can still contain broker error strings or operator-provided data; review logs before sharing them.

Set retention values according to operational and privacy needs, preserve evidence before cleanup, and keep `logs.db` access restricted. Traffic retention defaults to `TRAFFIC_LOG_RETENTION_DAYS=30` in `.sample.env`.

### Remote MCP

* Leave `MCP_HTTP_ENABLED` off unless hosted clients are required.
* Keep client approval on and `MCP_OAUTH_WRITE_SCOPE_ENABLED` off initially.
* Enable MCP TOTP before granting `write:orders`.
* Verify requested redirect URI and scopes on every approval.
* Use the kill switch after suspected token exposure; refresh-token reuse revokes the entire token family.
* Keep MCP signing keys and audit logs in the backup and incident-response plan.

### Updates and Backups

Use `bash install/update.sh` for the supported native update path. Back up all six stores, `.env`, signing keys, and strategy files before upgrading. The current updater omits `health.db` from its automatic database loop, so copy it separately when retaining health history matters.

After an update:

1. review migration output and service logs;
2. verify `/auth/app-info`;
3. sign in and reconnect the broker;
4. test a read-only REST call and WebSocket authentication;
5. test Analyzer Mode before live order execution.

### Incident Response

When credentials or the host may be compromised:

1. stop automated strategies and retain broker-terminal access;
2. isolate public access at the proxy or firewall;
3. regenerate the Tradeboard API key;
4. revoke application sessions and MCP tokens;
5. revoke or rotate broker credentials through the broker;
6. preserve and inspect application, proxy, OS, and broker logs;
7. rebuild or restore from a known-good revision and matching backups when host integrity is uncertain.
