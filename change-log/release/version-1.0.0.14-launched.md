# Version 1.0.0.14 Launched

6th Dec 2024

**Major Features**

1. **API Analyzer Mode**
   * New analyze/live mode toggle for strategy testing.
   * Real-time order validation without actual execution.
   * Strategy performance monitoring and analysis.
   * Garden theme in analyze mode for clear visual distinction.
   * Mode switcher with status badge for easy toggling.
2. **Enhanced Security**
   * TOTP-based two-factor authentication.
   * QR code generation for easy TOTP setup.
   * Secure password reset with multi-step verification.
   * Rate limiting for password reset (3 attempts/hour).
   * Improved security hashing mechanisms.
3. **New Broker Integration**
   * Added Shoonya broker support.
   * Complete order management capabilities.
   * Real-time data integration.
   * Portfolio tracking support.
4. **User Experience Improvements**
   * Garden theme for analyze mode, Light/Dark for live mode.
   * API key requirement notification for TradingView access.
   * Visual mode indicators for analyze/live states.
   * Copyable TOTP secret key for manual entry.
   * Improved error messages and validations.
5. **Technical Improvements**
   * Centralized version management through version.py.
   * Removed version from environment variables.
   * Enhanced version checking mechanism.
   * Improved environment variable validation.
   * Better error handling and user feedback.

**Detailed Changes**

**Security Enhancements**

* Multi-step password reset flow:
  * TOTP verification.
  * Secure token generation.
  * New password setup.
* Session-based token validation.
* Enhanced rate limiting protection.

**TOTP Implementation**

* QR code generation from TOTP URI.
* Manual secret key entry option.
* Copyable secret key display.
* Optional TOTP setup during installation for forgot password

**UI/UX Updates**

* Distinct themes for analyze/live modes.
* Clear mode indicators.
* Improved navigation.
* Enhanced error messaging.
* Better user guidance.

**System Improvements**

* Centralized version control.
* Improved configuration management.
* Enhanced validation systems.
* Better error handling.
* Streamlined setup process.

#### Password Meter

* Added a password strength meter in the setup section.
* Provides real-time feedback on password strength.
* Encourages users to create stronger, more secure passwords.

**Notes**

* TOTP setup is optional but recommended for account security.
* Analyze mode is for testing only, not paper trading.
* Garden theme indicates analyze mode operation.
* Version is now managed through version.py.
