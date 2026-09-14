---
description: Tradeboard Release Notes
---

# Version 1.0.0.1 Launched

23rd June 2024

#### New Features

* **Flask Version Management**: Added Flask version management in the environmental file. The Tradeboard version is now displayed in the footer.

```
# Tradeboard Flask App Version Management
FLASK_APP_VERSION='1.0.0.1'
```

* **Setup Configuration Route**: If the app is launched for the first time, attempting to log in without any signup will redirect to the `/setup` configuration route for user registration.
*   **Flask Host and Port Configuration**: Added Flask Host IP, Port Number, and Debug settings in the environmental file.

    ```
    # Tradeboard Flask App Host and Port Configuration
    FLASK_HOST_IP='127.0.0.1' # For 0.0.0.0 (accessible from other devices on the network)
    FLASK_PORT='5000' # Default Port is 5000
    FLASK_DEBUG='False'
    ```

**Smart Order Delay Configuration**: Added a 0.5 second delay configuration for placing multi-legged smart orders to accommodate API rate limiting by brokers. Brokers typically rate limit position book requests to 1 request/second. Sudden multiple requests can result in order failures. The delay parameter can be controlled as follows:

```
SMART_ORDER_DELAY = '0.5'
```

#### Bug Fixes

* None listed for this version.
