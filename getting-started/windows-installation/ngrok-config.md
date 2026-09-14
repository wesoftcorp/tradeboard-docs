# Ngrok Config

##

## Download Ngrok

1. Visit the [Ngrok ](https://ngrok.com/)website and sign up or log in.
2. Navigate to the [download section](https://dashboard.ngrok.com/get-started/setup/windows) and select the version for Windows.
3. Download the ZIP file.
4. Copy the Auth Token and keep it separately later this will be used to set the **ngrok.yml** config file

<figure><img src="/assets/Ngrok Windows Download.webp" alt=""><figcaption></figcaption></figure>

## Extract the Zip File

Once downloaded, extract the ZIP file to a folder of your choice, such as `C:\ngrok\`. This folder will contain the `ngrok.exe` executable.

## Add Ngrok Path to Environmental Variable

For Windows users:

1. Unzip the `ngrok` executable to a directory, e.g., `C:\ngrok\`.
2. Right-click on ‘This PC’ or ‘Computer’ on your desktop and select ‘Properties’.
3. Click on ‘Advanced system settings’.
4. Click on the ‘Environment Variables‘ button.
5. In the ‘System variables’ section, find the ‘Path‘ variable and click ‘Edit’.
6. Click ‘New’ and add the path to the directory where you unzipped `ngrok` (e.g., `C:\ngrok\`).
7. Click ‘OK’ to close the dialogs and apply the changes.

<figure><img src="/assets/Ngrok Environmental Variables.webp" alt=""><figcaption></figcaption></figure>

Now, `ngrok` can be run from the command line regardless of the current directory.

## Setting up the Ngrok Free Custom Domain

Go to the **Ngrok portal**, navigate to **Domains -> New Domain**, and create your free domain.

<figure><img src="/assets/Ngrok Free Custom Domain.webp" alt=""><figcaption></figcaption></figure>

## Setting up the Ngrok Config File

1. Open the command prompt in Windows.
2. Enter the command `ngrok config edit`.
3. This opens the ngrok config file. Enter your Auth Token, Tunnel Name, hostname, and addr as follows:

```markup
version: "3"
tunnels:
    flask:
        proto: http
        hostname: <your-ngrok-free-domain>.ngrok-free.app
        addr: 127.0.0.1:5000
agent:
    authtoken: <your-ngrok-auth-token>
```

Replace `<Your Auth Token>` with your actual Ngrok authentication token and `<your-chosen-hostname>` with the hostname you’ve set up.

####

## &#x20;Security Best Practices When Using Ngrok

* **Keep Your Ngrok Auth Token Secure**: Your Ngrok authentication token is the key to creating tunnels with your account. Keep it secure to prevent unauthorized access.
* **Use Strong Authentication for Exposed Services**: If you’re exposing a web service or application, ensure it has its own strong authentication mechanism.
* **Monitor Tunnel Usage**: Regularly review logs and monitor tunnel usage for any unexpected or unauthorized access.
* **Limit Exposure Time**: Only keep tunnels open for as long as necessary. The longer a tunnel is open, the higher the potential security risk.
