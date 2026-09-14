# Version 1.0.0.29 Launched

31st July 2025

***

#### Major Features

**Dual-Mode Password Reset System**

* **TOTP Authentication**: Secure password reset using Time-based One-Time Passwords
* **Email Verification**: Alternative password reset via secure email links
* **Method Selection UI**: Users can choose between TOTP or email verification
* **Fallback Support**: TOTP always available, email requires SMTP configuration

**Complete SMTP Integration**

* **Profile-Based Configuration**: SMTP settings accessible via `/auth/change` profile page
* **Secure Credential Storage**: Passwords encrypted using Fernet encryption in database
* **Gmail Support**: Both personal Gmail and Gmail Workspace configurations
* **Real-time Testing**: Built-in test email and debug functionality
* **Visual Configuration**: Comprehensive setup guides and troubleshooting tips

**Enhanced Profile Management**

* **Tabbed Interface**: Organized profile settings into Account & Password, SMTP Config, and TOTP tabs
* **Tab Persistence**: Maintains active tab after form submissions and page reloads
* **TOTP Integration**: QR code and secret key management directly in profile
* **Visual Password Requirements**: Real-time password strength indicator with progress bar

#### User Interface Improvements

**Modern Password Requirements Display**

* **Badge-Style Layout**: Compact rounded badges replacing vertical list
* **Real-time Feedback**: Icons change from ✗ to ✓ as requirements are met
* **Progress Bar**: Visual strength meter (None → Weak → Fair → Good → Strong)
* **Color-coded States**: Dynamic colors based on password strength
* **Responsive Grid**: 2-column layout adapting to screen size

**Enhanced Email Templates**

* **Professional Design**: Clean, modern HTML email templates
* **Gmail Compatibility**: Fixed button text color issues in Gmail
* **Security Styling**: Clear security notices and warnings
* **Mobile Responsive**: Templates work across all email clients

#### &#x20;Security Enhancements

**Advanced Password Security**

* **Strengthened Requirements**: 8+ chars, uppercase, lowercase, numbers, special characters
* **Real-time Validation**: Instant feedback as users type passwords
* **Secure Token Generation**: 32-byte cryptographically secure tokens
* **Session-based Validation**: Server-side token management

**Rate Limiting Improvements**

* **Separate Login Limits**: 5/minute, 25/hour for login attempts
* **Password Reset Limits**: 15/hour for reset requests
* **Configurable Rates**: Environment-based rate limit configuration
* **Anti-enumeration**: Consistent responses preventing user enumeration

**SMTP Security**

* **Encrypted Storage**: Password encryption using Fernet symmetric encryption
* **App Password Support**: Full support for Gmail App Passwords
* **Connection Security**: Proper SSL/TLS and STARTTLS handling
* **Debug Logging**: Secure diagnostic information without credential exposure

#### 📡 Broker Enhancements & WebSocket Fixes

**Common WebSocket Proxy (All Brokers)**

* **WebSocket Stability**: WebSocket made robust across Windows, macOS, and Linux
* **Thread Cleanup**: Fixed heartbeat thread timeouts and non-terminating threads
* **Graceful Shutdown**: WebSocket proxy now shuts down cleanly across all platforms

**Flattrade**

* **Subscription Handling**: Fixed rapid unsubscribe/subscribe edge cases
* **Order Accuracy**: Equity orders now use average price (`avgprc`) for precision
* **Cache & Snapshot Cleanup**: Ensures all maps, snapshots, and subscriptions are cleared

**Zerodha**

* **UI Data Streaming Fix**: Resolved issue where UI wasn’t reflecting WebSocket data
* **Subscription Timeout Fix**: Large symbol list subscriptions no longer timeout

**Firstock**

* **WebSocket Integration**: Native Firstock WebSocket support fully integrated
* **Index Symbol Handling**: Common index symbols mapped and standardized
* **LTP Update Fixes**: Resolved inconsistencies in LTP data stream
* **Historical Data Fix**: Fixed historical candle fetch via REST

#### 🛠️ Technical Improvements

**Database Enhancements**

* **New SMTP Schema**: Added 7 new columns for SMTP configuration
* **Migration Support**: Cross-platform Python migration scripts
* **Multi-database Support**: SQLite, PostgreSQL, MySQL compatibility
* **Data Validation**: Input sanitization and format validation

**Authentication Flow Updates**

* **Streamlined Setup**: Account creation redirects directly to login
* **Improved Messaging**: Clear SMTP configuration prompts
* **Session Management**: Enhanced session security and regeneration
* **Error Handling**: Comprehensive error messages and user guidance

**API & Backend**

* **New Endpoints**: `/auth/test-smtp`, `/auth/debug-smtp`, `/auth/smtp-config`
* **Enhanced Routing**: Password reset email link handling
* **Logging Integration**: Comprehensive audit logging for security events
* **Error Recovery**: Graceful handling of SMTP and authentication failures

#### Documentation

**New Documentation Files**

* **PASSWORD\_RESET.md**: Complete password reset system documentation
* **SMTP\_SETUP.md**: Gmail configuration and troubleshooting guide
* **Migration guides**: Step-by-step upgrade procedures

**Enhanced Existing Docs**

* Updated API documentation with new endpoints
* Added security best practices
* Included troubleshooting guides
* Cross-platform installation instructions

#### Configuration Changes

**New Environment Variables**

```env
# Rate Limiting Configuration
LOGIN_RATE_LIMIT_MIN=5 per minute
LOGIN_RATE_LIMIT_HOUR=25 per hour  
RESET_RATE_LIMIT=15 per hour

# Environment Version
ENV_CONFIG_VERSION=1.0.3
```

**Database Schema Updates**

* Added `smtp_server`, `smtp_port`, `smtp_username` columns
* Added `smtp_password_encrypted`, `smtp_use_tls` columns
* Added `smtp_from_email`, `smtp_helo_hostname` columns

#### Breaking Changes

* **Account Setup Flow**: QR code no longer displayed after account creation
* **Profile Structure**: Profile page reorganized into tabbed interface
* **Password Requirements**: Updated visual layout (functionality unchanged)
* **Environment Config**: New variables required in `.env` file

#### Dependencies

* **No new external dependencies**: All features use existing Python libraries
* **Enhanced existing usage**: Improved cryptography, email, and session handling
* **Cross-platform compatibility**: Removed Windows-incompatible shell scripts

***

### Upgrade Instructions

See [UPGRADE](https://docs.algo.wesoftcorp.com/getting-started/upgrade) for detailed upgrade procedures from previous versions.

### Migration Notes

* **Database migration required** for SMTP functionality
* **Environment file updates** needed for rate limiting
* **Profile page changes** may affect custom styling
* **Password reset flow** completely redesigned

### Support

* **Documentation**: Check `/docs` folder for detailed guides
* **Issues**: Report bugs on GitHub Issues
* **SMTP Problems**: Use built-in debug functionality
* **Migration Help**: See upgrade documentation

***
