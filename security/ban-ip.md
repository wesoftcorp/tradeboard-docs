# Ban IP

### Request Enforcement

Tradeboard checks active IP bans before Flask processes a request. A banned address receives HTTP 403. Ban state is stored in `logs.db` and cached briefly; manual and automatic changes invalidate the affected cache entry.

Open **Logs > Security** or visit `/logs/security` after signing in.

### Stored Trackers

| Table | Purpose |
| --- | --- |
| `ip_bans` | Temporary or permanent bans, reason, count, creator, and expiry |
| `error_404_tracker` | Per-IP 404 count and up to 50 distinct attempted paths in a 24-hour window |
| `invalid_api_key_tracker` | Per-IP invalid-key count and up to 20 key hashes in a 24-hour window |

Raw API keys are not stored by the invalid-key tracker.

### Automatic Ban Defaults

Automatic banning is **off** by default. The persisted settings start at:

| Setting | Default |
| --- | ---: |
| 404 threshold | 100 per 24 hours |
| 404 ban duration | 0 hours (permanent) |
| Invalid-key threshold | 100 per 24 hours |
| Invalid-key ban duration | 0 hours (permanent) |
| Repeat-offender limit | 2 bans |

A zero-hour duration means permanent. When automatic banning is enabled, localhost addresses are excluded. Reaching the repeat-offender limit makes the next active ban permanent; durations are not automatically doubled.

### Dashboard Actions

The authenticated dashboard can:

* ban one validated IPv4 or IPv6 address;
* unban an address;
* resolve a host observed in recent traffic and ban matching addresses;
* clear an address's 404 tracker;
* inspect invalid-key and 404 activity;
* update thresholds, durations, repeat limits, and the automatic-ban switch;
* review login activity and active application sessions.

Use a specific, factual ban reason. Host banning resolves addresses from recent stored traffic; it is not a permanent domain firewall rule and DNS can change.

### Client IP Resolution

With `TRUST_PROXY_HEADERS=False` (the default), Tradeboard uses the immediate peer address. With the setting enabled, it can accept `CF-Connecting-IP`, `True-Client-IP`, `X-Real-IP`, the first `X-Forwarded-For` value, and `X-Client-IP` in priority order.

Only enable forwarded headers when a controlled reverse proxy is the only network path to the application. Otherwise a client can spoof the address used for tracking and bans.

### What IP Bans Do Not Provide

* There is no current CIDR allowlist or trusted-IP bypass feature.
* Application bans do not replace a host firewall, cloud security group, VPN, WAF, or reverse-proxy policy.
* A ban does not revoke a compromised broker token, API key, session, or MCP token. Revoke those credentials separately.
* IP bans are not a substitute for rate limits or denial-of-service protection upstream.

### Incident Workflow

1. Confirm the address and attempted paths in Security and Traffic views.
2. Apply a manual ban when immediate containment is justified.
3. Regenerate exposed API keys and reconnect or revoke broker access as required.
4. Revoke application sessions or MCP token families when those credentials may be affected.
5. Preserve relevant logs before retention purges them.
6. Adjust automatic thresholds only after checking for legitimate traffic patterns.
