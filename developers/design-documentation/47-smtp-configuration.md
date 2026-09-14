# 47 - SMTP Configuration

## Storage

SMTP settings are columns on the single `Settings` row (`__tablename__ = "settings"`) in `database/settings_db.py`; there is no separate SMTP database or email service module.

| Column | Type | Notes |
|---|---|---|
| `smtp_server` | String(255) | Hostname |
| `smtp_port` | Integer | Route default is 587 when the form omits it |
| `smtp_username` | String(255) | |
| `smtp_password_encrypted` | Text | Fernet ciphertext, never plaintext |
| `smtp_use_tls` | Boolean | Defaults to `True` |
| `smtp_from_email` | String(255) | |
| `smtp_helo_hostname` | String(255) | Optional EHLO/HELO override |

New password writes use `_get_smtp_fernet()`: PBKDF2-HMAC-SHA256, 100,000 iterations, keyed on the validated `API_KEY_PEPPER` with the salt from `SMTP_KEY_SALT` (env var, default `smtp-tradeboard-salt`). `_decrypt_password()` falls back to `_legacy_smtp_fernet()` (the raw pepper padded to 32 bytes, no KDF) for values written before that upgrade, and re-saving the settings migrates them forward. Decrypted passwords must never be returned by profile/admin APIs or logged.

## Authenticated Routes

`blueprints/auth.py` exposes:

| Method/path | Purpose |
|---|---|
| `POST /auth/smtp-config` | Update settings from form fields; a blank password preserves the existing secret |
| `POST /auth/test-smtp` | Validate recipient and send a test message |
| `POST /auth/debug-smtp` | Run connection/auth diagnostics |
| `GET /auth/profile-data` | Return non-secret config and password-present state |

The React configuration UI is the SMTP tab in `frontend/src/pages/Profile.tsx`.

## Delivery

`utils/email_utils.py` exposes `send_test_email()`, `send_password_reset_email()`, `send_email()`, and `validate_smtp_settings()`. Port 465 uses `smtplib.SMTP_SSL` from the start; any other port opens a plain `SMTP` connection and upgrades with `starttls()` when `smtp_use_tls` is set. `smtp_helo_hostname` is passed to `ehlo()`, falling back to `smtp_server` when it is blank. `utils/email_debug.py` performs staged diagnostics behind `POST /auth/debug-smtp`.

## Security Rules

- Require a valid app session and CSRF token for changes.
- Preserve the existing password when the form leaves it blank.
- Return password presence only, never ciphertext or plaintext.
- Do not include credentials in SMTP errors or logs.
- Prefer provider app passwords and TLS/SSL.
- Treat debug output as authenticated operational data.

## Key Files

| File | Purpose |
|---|---|
| `database/settings_db.py` | Settings and SMTP encryption |
| `utils/email_utils.py` | Test/reset/general delivery |
| `utils/email_debug.py` | Connection diagnostics |
| `blueprints/auth.py` | Configuration routes |
| `frontend/src/pages/Profile.tsx` | SMTP form |
