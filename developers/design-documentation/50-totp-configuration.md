# 50 - TOTP Configuration

## Model

The local `User` model (`database/user_db.py`, `__tablename__ = "users"`) stores an encrypted `totp_secret` column plus a master switch and three purpose flags. All four flags are `Boolean, default=False, nullable=False`, so existing installs are never silently locked out.

| Field | Meaning |
|---|---|
| `totp_enabled` | Master TOTP switch |
| `totp_required_for_login` | Require TOTP after password login |
| `totp_required_for_mcp` | Require fresh TOTP for sensitive Remote MCP consent |
| `totp_required_for_password_reset` | Require TOTP on the reset path |

When the master switch is false, `is_totp_required_for()` returns false for every purpose. The current implementation has no backup-code model or backup-code verification path.

## Secret Lifecycle

Initial user setup generates a base32 secret and stores Fernet ciphertext. `get_totp_secret()` is the only supported plaintext accessor and includes legacy fallback behavior. `get_totp_uri()` creates the authenticator provisioning URI through `pyotp`; `verify_totp()` checks submitted codes.

The Profile page can display the QR code and plaintext secret to the authenticated user for enrollment. That response is sensitive and must never be cached or logged.

## Login Flow

When login TOTP is enabled, a correct password creates a short-lived `pending_totp_user` and does not establish the authenticated user session. `/auth/login/totp` validates the six-digit code inside the pending window, promotes the session, records `totp_verified_at`, and then attempts broker-session resume.

Bad codes are rate limited through the login limit. One bad code does not immediately clear the pending marker; the five-minute freshness window bounds the flow.

## Configuration API

| Method/path | Purpose |
|---|---|
| `GET /auth/2fa/status` | Read master/purpose flags plus `last_totp_verified_at` |
| `POST /auth/2fa/configure` | Atomically set master and purpose flags |

Both routes require a valid application session. Changing TOTP policy requires a valid current TOTP code, including disabling it. Disabling the master switch forces all purpose flags false in the same write.

`last_totp_verified_at` is read from `session["totp_verified_at"]`, not from a database column: it reflects this browser session only, and a successful `POST /auth/2fa/configure` restamps it.

## Password Reset And MCP

The password-reset route offers TOTP as one of two mutually exclusive methods and verifies through `User.verify_totp()`. The `password_reset` purpose flag works as a gate in the other direction: an account with it set is refused the email-link path at `step == "select_email"` and pushed to the authenticator.

Remote MCP authorization requires recent TOTP before granting write scope. `blueprints/mcp_oauth._is_fresh_totp()` treats `session["totp_verified_at"]` as fresh for 60 seconds (`_FRESH_TOTP_SECONDS`), and only when `user.is_totp_required_for("mcp")` and write scope was requested. A successful consent-page TOTP restamps the marker.

## Security Rules

- Never read the ciphertext column directly where plaintext is required; use `get_totp_secret()`.
- Never log the secret, provisioning URI, QR payload, or submitted code.
- TOTP proves possession of the configured authenticator, not broker authorization.
- Purpose flags are effective only while the master switch is on.
- Do not document backup codes until an actual persisted and verified implementation exists.

## Key Files

| File | Purpose |
|---|---|
| `database/user_db.py` | Encrypted secret, flags, URI, verification |
| `blueprints/auth.py` | Login, status/config, reset integration |
| `blueprints/mcp_oauth.py` | Fresh-TOTP check for OAuth consent |
| `frontend/src/pages/Profile.tsx` | Enrollment/policy UI |
| `frontend/src/pages/Login.tsx` | Pending-login verification |
