# SSL Verification Failed

If you’ve encountered the SSL: CERTIFICATE\_VERIFY\_FAILED error while using Tradeboard on Windows, there’s good news. A user from the Tradeboard community has shared a comprehensive solution that resolved this issue on their Windows system. Here’s a detailed guide on how to implement this solution.

**Understanding the Issue**

The SSL: CERTIFICATE\_VERIFY\_FAILED error usually indicates that the SSL certificate presented by the server cannot be verified by the client. This can happen due to several reasons, including outdated or missing root certificates on your system.

**Proposed Solution**

A user successfully resolved this issue by updating the root certificates on their Windows system. The solution involves using the certutil tool to update and install root certificates. Here are the detailed steps:

**1. Update Certificates Using Certutil**

First, you need to update the root certificates on your Windows system. Follow these steps using Command Prompt with administrative access:

1\. **Open Command Prompt with Admin Access**: Right-click on the Command Prompt icon and select “Run as administrator”.

<figure><img src="/assets/image (82).png" alt=""><figcaption></figcaption></figure>

2\. **Generate Root Certificates File**: Run the following command to generate the root certificates file.

```bash
certutil -generateSSTFromWU roots.sst
```

\
3\. **Install Root Certificates**: Once the roots.sst file is generated, run the following command to install the certificates.

```bash
certutil -addstore -f root roots.sst
```

**2. Verify and Reinstall**

After updating the root certificates, you can verify if the issue is resolved by running your Tradeboard application. Here’s an additional step-by-step verification process shared by the user:

1\. **Uninstall Existing Python Installation**: If you still face issues, uninstall the existing Python installation.

2\. **Reboot the Server**: Reboot your Windows system to ensure all changes take effect.

3\. **Install a Current Python Version**: Download and install Python 3.12 or newer, which is the minimum Tradeboard supports (for example `python-3.12.x-amd64`). Tick "Add python.exe to PATH" during the install.

4\. **Run Tradeboard Application**: Run your Tradeboard application to verify if the SSL error is resolved.

By updating the root certificates using certutil and ensuring that your system has the latest Python installation, you can resolve the SSL: CERTIFICATE\_VERIFY\_FAILED error on Windows systems. This method has been tested and confirmed to work by couple of users in the Tradeboard community.

For more details and context, you can refer to [this issue on GitHub](https://github.com/wesoftcorp/tradeboard-docs/issues/43).

If you’re encountering SSL-related errors on Windows, give these Command Prompt actions a try. Your feedback and experiences are valuable, so feel free to share them in the comments below. Happy coding with Tradeboard!
