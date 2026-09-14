# Devtunnels

**What Are Dev Tunnels?**

Dev Tunnels is a feature built into [Visual Studio Code (VS Code)](https://code.visualstudio.com/). It enables developers to securely expose local web services to the public internet without wrestling with complex networking or cloud infrastructure. Although Dev Tunnels are perfect for ad-hoc testing and development, remember that they are not designed for production workloads.

#### Key Benefits of Dev Tunnels

**Flexibility:** Ideal for testing webhooks, APIs, and various integrations, especially for services like TradingView.

**Security:** Dev Tunnels establish encrypted, secure connections between your local environment and the public internet.

**Simplicity:** Skip the hassle of configuring cloud servers or proxies. With just a few clicks, you have a publicly accessible URL.

### Prerequisites

Before diving into the setup, ensure you have the following:

* **Visual Studio Code (VS Code):** Installed on your machine.
* **Tradeboard:** Running locally with `uv run app.py` (port 5000 by default).
* **TradingView Account:** Set up for alert creation.
* **GitHub or Microsoft Account:** For authenticating with Dev Tunnels.

### Step-by-Step Setup Guide

#### 1. Start and Verify Tradeboard

Begin by launching your Tradeboard application locally from your VS Code. Open your browser and navigate to the Tradeboard dashboard (e.g., [http://127.0.0.1:5000/dashboard](http://127.0.0.1:5000/dashboard)) to verify that the service is up and running.

#### 2. Create a Dev Tunnel in VS Code

* **Open VS Code** where your Tradeboard project is running.
* Navigate to the **Ports** tab located at the bottom of the VS Code interface.
* Click on **“Forward a Port”** to start the process.

#### 3. Configure the Forwarded Port

* Enter the port number on which Tradeboard is running (e.g., **5000**), then press **Enter**.
* This action forwards the specified port to a public URL.

#### 4. Set Port Visibility to Public

* In the **Ports** tab, right-click on the forwarded address.
* Select **“Port Visibility”** and then **“Public.”**
* VS Code will warn you that this action will expose your service to the internet, confirm to proceed.
* If prompted, sign up or log in using your **GitHub or Microsoft account** to create an encrypted URL.
* Once completed, verify your new public URL.

#### 5. Obtain Your Custom Webhook URL

* Refer to the **Tradeboard documentation** and navigate to **“API Documentation” → “V1” → “Orders API” → “Placeorder”.**
* Copy the custom domain information provided. For instance:\
  `POST https://your-custom-domain/api/v1/placeorder`
* Append your unique Dev Tunnel URL to this endpoint.\
  &#xNAN;_&#x45;xample:_\
  `https://h03ml9j.5000.inc1.devtunnels.ms/api/v1/placeorder`

#### 6. Create an Alert in TradingView

* Open your desired chart on **TradingView** and configure the conditions for your alert.
* Click the **“Alert”** icon to create a new alert.
* In the alert settings, navigate to the **“Notifications”** tab.
* Enable the **“Webhook URL”** option and paste your custom Tradeboard webhook URL from the previous step.

<figure><img src="/assets/image (1).png" alt=""><figcaption></figcaption></figure>

#### 7. Configure the TradingView Alert Message (JSON Payload)

The JSON payload sent by TradingView is pivotal, it instructs Tradeboard on how to execute orders.

* Return to the [**Tradeboard documentation**](https://docs.algo.wesoftcorp.com/api-documentation/v1/orders-api/placeorder) and copy the JSON payload structure.
* Ensure your TradingView alert message matches the required format so that Tradeboard can correctly interpret and act on the alert.

#### 8. Trigger an Alert and Verify

* Activate your TradingView alert settings and position the alert trigger line near the current trading range.
* Once the alert is live, monitor Tradeboard’s **Orderbook** and **live mode** to confirm that orders are being executed as expected.
* When the order is successfully placed and completed, the alert will cease, marking a successful integration.

<figure><img src="https://i0.wp.com/www.marketcalls.in/wp-content/uploads/2025/02/image-8.png?resize=854%2C637&#x26;ssl=1" alt="" height="637" width="854"><figcaption></figcaption></figure>

***

### Conclusion

By leveraging Dev Tunnels, you can effortlessly and securely connect TradingView alerts to your local Tradeboard instance. This setup is ideal for testing new trading strategies, exploring API integrations, and streamlining your algorithmic trading workflow. Remember, while Dev Tunnels are fantastic for development and testing, a more robust solution (such as cloud servers) is recommended for production environments.

Embrace this streamlined approach and elevate your algo trading game today!
