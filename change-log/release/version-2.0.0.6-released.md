# Version 2.0.0.6 Released

**Date: 27th Apr 2026**

**Critical Security Update: APP\_KEY / API\_KEY\_PEPPER Hardening, Encrypted Credentials at Rest, Reverse-Proxy Trust Gate, Docker Permission Fix & Broker Updates**

This is a critical security update covering **10 commits** since v2.0.0.5. It closes the highest-impact remote attack surface in Tradeboard's web tier (forge-able session cookies signed with the publicly-known sample `APP_KEY`), encrypts every remaining plaintext credential in the database, gates client-supplied forwarded-IP headers behind an explicit `TRUST_PROXY_HEADERS` flag (so attackers can no longer spoof source IP to dodge IP bans / rate limits), invalidates all sessions on password change, fixes the Docker `.env` permission bug behind issue #960, and patches a transitive `postcss` CVE pulled in by the React build.

> **Every running deployment should pull and apply this update.** Most installs only need the standard four-step upgrade (stop → pull → migrate → restart) — the code changes are backward-compatible and your data, authenticator codes, broker session, and external API keys are all preserved. See the **Required Upgrade Steps** at the bottom.

***

**Highlights**

* **Per-instance APP\_KEY auto-rotation** — `.sample.env` no longer ships real-looking hex values for `APP_KEY` / `API_KEY_PEPPER`. Instead it carries placeholder strings; the app detects them on first run and replaces them in `.env` with cryptographically random values via `secrets.token_hex(32)`. This closes the entire class of "forge a session cookie offline using the public sample key" attacks against any deployment that previously copied `.sample.env` to `.env` without manually rotating.
* **Credentials encrypted at rest** — TOTP secrets, the Telegram bot token, the Samco 2FA secret, and Flow workflow API keys are now Fernet-encrypted in the database, matching the existing pattern used for broker tokens and TradingView API keys. The Flask session cookie also no longer carries the user's TOTP secret (it was signed but not encrypted, exposing the seed via cookie reads). All read paths fall back to plaintext for pre-update rows so existing data continues to work without a forced migration.
* **Forwarded-IP header trust gate (TRUST\_PROXY\_HEADERS)** — `utils/ip_helper.py` previously honoured `CF-Connecting-IP` / `X-Forwarded-For` / `X-Real-IP` / `True-Client-IP` / `X-Client-IP` from any client unconditionally. Direct-bind deployments could be fooled by a client setting these headers to fake their source IP, silently bypassing the IP ban list, the per-IP login rate-limiter, the 404 auto-ban tracker, and the login-attempt audit log. Headers are now ignored by default and only trusted when `TRUST_PROXY_HEADERS=TRUE` is set; the install scripts that configure nginx set this automatically.
* **Password change kicks every browser session** — `change_password`, `change_password_api`, and the `/auth/reset-password` flow now clear all active sessions and emit `force_logout` so other devices stop accepting the old cookie immediately. Closes the gap where an attacker holding a stolen cookie kept their session even after the legitimate user changed the password.
* **Docker `.env` permission fix (closes #960)** — fresh Docker installs no longer crash-loop with `Error: .env file not found.` because the install scripts now use a permission mode that the container's `appuser` can read via the bind mount. The Profile → System health check is Docker-aware and recommends the correct mode for each deployment type.
* **postcss CVE-2026-41305** — pinned to `>=8.5.10` (resolves to 8.5.12) via npm `overrides`. Closes Dependabot alert #153.
* **Two earlier credential-leak vectors** — fixes carried in `2c53573f` (closes session and log leaks identified in the security audit).
* **Broker fixes** — Paytm and Groww decimal-strike option symbols (#908), Kotak native MPP via the `mp` parameter (#1293), sandbox `FundManager._lock` self-deadlock when the funds row is missing (#1274).

***

**Security**

**APP\_KEY / API\_KEY\_PEPPER**

* `.sample.env` now uses placeholder strings instead of real-looking hex values. New users running `cp .sample.env .env` followed by `uv run app.py` see a one-time green `[Tradeboard first-run setup]` message; the app generates fresh secrets and writes them back to `.env` atomically.
* Existing users who installed via `install.sh` (custom keys generated at install time) see no change — the check is a single `frozenset` lookup that returns immediately for any non-placeholder value.
* The same detection covers `.env` files copied from a pre-fix commit (the historical leaked literals are also recognised and rotated).
* `update.sh` and `update.bat` no longer fall through to a `cp .sample.env .env` that leaves placeholder values in place; they now generate fresh keys in that recovery branch.
* `.env` is tightened to mode `0o600` on bare-metal installs and `0o644` on Docker installs (UID 1000 must read it via the bind mount). `update.sh` retroactively tightens existing-install `.env` perms when run.

**Encrypted-at-rest credentials**

Four columns previously stored in plaintext are now Fernet-encrypted on write and decrypted on read:

* `users.totp_secret`
* `bot_config.token` (Telegram bot token)
* `auth.secret_api_key` (Samco 2FA secret)
* `flow_workflows.api_key` (Flow workflow Tradeboard API key)

A backward-compatible read path means existing rows continue to work between the code update and any operator-driven re-encryption pass — there is no in-between broken state.

The Flask session cookie no longer carries `session["totp_secret"]` (Flask sessions are signed, not encrypted; the cookie was leaking the TOTP seed to anyone who could read the cookie value).

**Reverse-proxy trust (TRUST\_PROXY\_HEADERS)**

* New `.env` flag, default `FALSE`. When false, `get_real_ip()` returns the immediate peer address only; client-supplied forwarded-IP headers are ignored.
* `install.sh`, `install-multi.sh`, `install-docker.sh`, and `install-docker-multi-custom-ssl.sh` set this to `TRUE` automatically because they configure an nginx reverse proxy as part of the install (gunicorn binds on a Unix socket / container-gateway-only port that cannot be reached directly from the internet, so the proxy headers are trustworthy).
* `update.sh` migrates existing installs by detecting nginx in `/etc/nginx/sites-enabled` or `/etc/nginx/conf.d` and adding the appropriate value to `.env` — `TRUE` if a proxy is found, `FALSE` otherwise. No manual edit needed for the common reverse-proxied bare-metal install.
* Local dev (`cp .sample.env .env` + `uv run app.py`) and `docker-run.sh` desktop installs leave it `FALSE`, which is the correct default for direct-bind setups.

**Password change session invalidation**

* `blueprints/auth.py:change_password`, `change_password_api`, and the `/auth/reset-password` `step="password"` branch all now call `clear_user_sessions(username)` and emit `socketio.emit("force_logout", …)` after a successful password change. Every device — including the one that just changed the password — gets logged out and prompted to log in again with the new credentials.
* This matches the convention used by banking and high-security web apps: a password change is a hard reset of the auth state, on the assumption that the change was triggered by suspected compromise (or routine rotation that wants the same effect).

**postcss XSS (CVE-2026-41305)**

* Bumped via `frontend/package.json` `overrides` to `postcss >= 8.5.10`. Resolves to 8.5.12 in the lockfile.
* `npm install` now reports 0 vulnerabilities.

**Pip CVE-2026-3219**

* Dependabot alert #152 dismissed as `tolerable_risk`. `pip` is transitive in `uv.lock`, only invoked at install time, never at runtime. The advisory has no `first_patched_version` published yet; will revisit when `uv` picks up the upstream fix.

**Optional operator tool: `upgrade/rotate_pepper.py`**

A standalone, opt-in tool is included for operators who want to additionally rotate `API_KEY_PEPPER` to a fresh value and re-encrypt every credential in the database. It is intentionally **not** wired into `migrate_all.py` because rotating the pepper invalidates Argon2 password hashes (Argon2 is one-way; hashes cannot be migrated) — running it requires a one-time password reset via the TOTP flow afterwards. Use this only if your `.env` ever held the publicly-known sample `API_KEY_PEPPER` literal and you want to make absolutely sure no attacker has a copy of decryptable ciphertext from your database. Most users will never need it; the regular four-step upgrade below is sufficient.

***

**Bug Fixes**

**Docker / Install**

* **`.env` permission bug (#960)** — host `.env` at mode `0o600` was unreadable to the container's `appuser` (UID 1000) when bind-mounted, causing `start.sh` to exit with `Error: .env file not found.` and crash-loop the container. Fixed across `install/install-docker.sh`, `install/install-docker-multi-custom-ssl.sh`, and `install/docker-run.sh` (now use mode `0o644`). The Profile → System health check at `/api/system` is Docker-aware and expects the correct mode per deployment.
* **`update.sh` recovery branch** — when `.env` was missing, the script previously copied `.sample.env` verbatim and exited; the running app would have hit the public sample keys. Now generates fresh keys via `secrets.token_hex(32)` in that path.
* **`update.sh` existing-install hardening** — automatically adds `TRUST_PROXY_HEADERS` (auto-detected) and tightens `.env` perms to `0o600` on the next update if not already set.

**Brokers**

* **Paytm and Groww decimal strikes (#908)** — option symbols like `VEDL25APR24292.5CE` now retain the `.5` instead of being silently stripped during symbol normalisation.
* **Kotak — native MPP via `mp` parameter (#1293)** — replace the local `MKT → LMT` rewrite with the broker's native market-protection-price flag.

**Sandbox**

* **`FundManager._lock` self-deadlock (#1274)** — when the sandbox funds row was missing, the `_lock`-holding code path tried to acquire the same lock again. Fix unwinds the call so the missing-row branch releases the lock first.

**Auth / Logging**

* **Two credential-leak vectors closed in `2c53573f`** — session and log paths that could surface API keys / tokens in error contexts.

***

**Frontend / Tooling**

* `frontend/package.json` overrides extended with `postcss >= 8.5.10`.
* `db/backups/` added to `.gitignore` (created automatically by the optional pepper-rotation tool).

***

**Dependencies**

* `postcss`: pinned `>= 8.5.10` (resolved 8.5.12) — closes CVE-2026-41305 / GHSA-qx2v-qp2m-jg93.

***

**Required Upgrade Steps**

The standard four-step upgrade. Your data, broker session, authenticator codes, and TradingView/Chartink API keys are all preserved automatically. No new password reset is required for the regular upgrade path.

**1. Stop Tradeboard**

| Deployment           | Command                                          |
| -------------------- | ------------------------------------------------ |
| Bare-metal (systemd) | `sudo systemctl stop tradeboard-<your-deployment>` |
| Docker               | `cd /opt/tradeboard && sudo docker compose down`   |
| Docker desktop       | `./install/docker-run.sh stop`                   |
| Local dev            | Ctrl+C in the terminal running `uv run app.py`   |

**2. Pull the latest code and dependencies**

```bash
cd /path/to/tradeboard
git pull origin main
uv sync
```

If you're on Docker and your `.env` was at mode `0o600`, run this once to unbreak the container before the next start:

```bash
sudo chmod 644 .env
```

If you installed via `install.sh` and want the new `TRUST_PROXY_HEADERS` flag + tightened `.env` perms applied automatically, run:

```bash
sudo bash install/update.sh
```

It detects nginx, sets the right value in `.env`, and tightens perms to `0o600`. (Skipping this is fine — IP-based features still work; they just see the proxy IP instead of the real client IP until you set `TRUST_PROXY_HEADERS=TRUE` manually.)

**3. Apply standard database migrations**

This is the same step you've always run on every release.

```bash
cd upgrade
uv run migrate_all.py
cd ..
```

**4. Restart Tradeboard**

| Deployment           | Command                                           |
| -------------------- | ------------------------------------------------- |
| Bare-metal (systemd) | `sudo systemctl start tradeboard-<your-deployment>` |
| Docker               | `cd /opt/tradeboard && sudo docker compose up -d`   |
| Docker desktop       | `./install/docker-run.sh start`                   |
| Local dev            | `uv run app.py`                                   |

**What's preserved (no action needed)**

* **Authenticator app codes** — your TOTP enrolment is unchanged. The same QR you scanned at setup keeps producing valid codes.
* **Login password** — the regular four-step upgrade does not change your password. You keep using the same credentials.
* **Broker session** — your saved broker auth token still works. No need to re-OAuth with your broker.
* **TradingView / Chartink / Excel / Python API keys** — your Tradeboard API key value is unchanged. External integrations continue to work without any configuration change.
* **All trades, positions, strategies, watchlists, settings, logs.**

**What changes**

* If your `.env` ever held the publicly-known sample `APP_KEY` value, the app rotates it to a fresh random value on first start and prints a one-time `[Tradeboard first-run setup]` line in the console. Your existing browser session ends and you log in again with the same password. Most users who installed via `install.sh` already have custom keys and see no message.
* `TRUST_PROXY_HEADERS` is added to your `.env` on the next `update.sh` run (auto-detected, no manual edit required).
* New TOTP secrets, Telegram bot tokens, Samco 2FA secrets, and Flow workflow API keys created from this release onward are stored encrypted at rest. Existing rows continue to work transparently via the backward-compatible read path.

**Optional: full credential refresh (operator-driven)**

If your installation ever ran with the publicly-known sample `API_KEY_PEPPER` value in `.env`, you can additionally run the standalone pepper-rotation tool to generate a fresh pepper and re-encrypt every credential in the database. This is a one-time operator decision and requires a one-time password reset via the TOTP flow afterwards. The tool prompts for confirmation, creates a database backup before any change, and is documented inline:

```bash
cd upgrade
uv run rotate_pepper.py
# Type 'yes' when prompted. Then restart and use /auth/reset-password (TOTP)
# to set a new password.
```

Most users do not need this — `install.sh` deployments have always generated fresh per-instance keys, so their database has never been encrypted under a publicly-known value.

***

**Contributors**

* **@marketcalls (Rajandran)** — release management, broker fixes (Paytm/Groww strike preservation, Kotak native MPP), sandbox `FundManager` fix, websocket polish, and the v2.0.0.6 critical security update including APP\_KEY/PEPPER hardening, encrypted-at-rest credential overhaul, the optional pepper-rotation tool, the reverse-proxy trust gate, password-change session invalidation, the Docker `.env` permission fix, and the postcss CVE bump.

***

**Upgrade Quick Reference**

```bash
# 1. Stop Tradeboard (see table above for your deployment type)

# 2. Pull and sync
cd /path/to/tradeboard
git pull origin main
uv sync

# 3. (Optional, server-mode only) Apply install-script hardening
sudo bash install/update.sh

# 4. Run standard migrations
cd upgrade && uv run migrate_all.py && cd ..

# 5. Restart Tradeboard (see table above for your deployment type)
uv run app.py

# 6. Open the web UI -> Login (same password as before)
```

***

**Links**

* **Repository**: [https://github.com/wesoftcorp/tradeboard-docs](https://github.com/wesoftcorp/tradeboard-docs)
* **Documentation**: [https://docs.algo.wesoftcorp.com](https://docs.algo.wesoftcorp.com)
* **Discord**: [https://www.tradeboard.in/discord](https://www.tradeboard.in/discord)
* **Issue tracker**: [https://github.com/wesoftcorp/tradeboard-docs/issues](https://github.com/wesoftcorp/tradeboard-docs/issues)

***
