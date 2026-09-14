# Windows with Caddy

## Setting Up HTTPS for Tradeboard on Windows with Caddy

Run Tradeboard locally on `https://tradeboard.local` with a valid SSL certificate, no browser warnings, and zero changes to `app.py`.

<figure><img src="/assets/image.png" alt=""><figcaption></figcaption></figure>

### Why this setup?

OAuth flows for brokers like shoonya,hdfcsky often require HTTPS redirect URLs. Running Tradeboard on plain `http://127.0.0.1:5000` works for testing, but production-like local development needs:

* A proper hostname (`tradeboard.local` instead of `127.0.0.1`)
* HTTPS with a trusted certificate (no `Not Secure` warnings)
* No code changes to Tradeboard itself

Caddy handles all of this in front of your Flask app as a reverse proxy.

### Prerequisites

* Windows 10 or 11
* Tradeboard already cloned and running locally
* Administrator access for two one-time setup steps (hosts file edit, certificate trust)

### Step 1: Download Caddy

Go to https://caddyserver.com/download

Select:

* **Platform:** Windows
* **Architecture:** amd64

Click **Download**. You'll get a file named something like `caddy_windows_amd64_custom.exe`.

### Step 2: Place and rename the binary

Create a folder to hold Caddy:

```powershell
mkdir C:\caddy
```

Move the downloaded file into `C:\caddy\` and rename it to `caddy.exe`.

In PowerShell:

```powershell
cd C:\caddy
Rename-Item caddy_windows_amd64.exe caddy.exe
```

Verify it works:

```powershell
.\caddy.exe version
```

You should see something like:

```
v2.11.2 h1:iOlpsSiSKqEW+SIXrcZsZ/NO74SzB/ycqqvAIEfIm64=
```

#### Tip: Show file extensions in Windows

If you see `caddy.exe.exe` after renaming, Windows is hiding extensions. Open File Explorer, click **View > Show > File name extensions**, then rename again.

### Step 3: Edit the hosts file

This maps `tradeboard.local` to your local machine.

1. Press the Windows key, type **Notepad**
2. Right-click Notepad and select **Run as administrator**
3. In Notepad: **File > Open**
4. Navigate to: `C:\Windows\System32\drivers\etc\`
5. Change the file type dropdown (bottom right) from `Text Documents (*.txt)` to `All Files`
6. Open `hosts`

Add this line:

```
127.0.0.1    tradeboard.local
```

A typical hosts file will look like this after editing:

```
# localhost name resolution is handled within DNS itself.
#	127.0.0.1       localhost
#	::1             localhost

# Added by Docker Desktop
192.168.1.6 host.docker.internal
192.168.1.6 gateway.docker.internal

# To allow the same kube context to work on the host and the container:
127.0.0.1 kubernetes.docker.internal
127.0.0.1 tradeboard.local
# End of section
```

Save and close.

**Verify the entry works:**

```powershell
ping tradeboard.local
```

You should see replies from `127.0.0.1`. If you see `could not find host`, the hosts file did not save correctly. Reopen Notepad as Administrator and try again.

### Step 4: Create the Caddyfile

Tradeboard ships with a default `Caddyfile` in the project root. If yours is missing, create it.

Navigate to your Tradeboard project folder:

```powershell
cd D:\tradeboard-remote\tradeboard
notepad Caddyfile
```

When Notepad asks if you want to create the file, click **Yes**. Paste this:

```
tradeboard.local {
    reverse_proxy localhost:5000
}
```

Save and close.

#### Note on the Caddyfile name

The file must be named exactly `Caddyfile` with no extension. If Notepad saves it as `Caddyfile.txt`, rename it:

```powershell
Rename-Item Caddyfile.txt Caddyfile
```

### Step 5: Run Caddy for the first time (Administrator)

The first run installs Caddy's local certificate authority into Windows so browsers trust the auto-generated SSL certificate.

1. Press Windows key, type **PowerShell**
2. Right-click **Windows PowerShell** and select **Run as administrator**
3. Run these commands:

```powershell
cd D:\tradeboard-remote\tradeboard
C:\caddy\caddy.exe run
```

Windows will show a security dialog asking permission to install a root certificate. Click **Yes**.

You should see logs like:

```
INFO    using adjacent Caddyfile
INFO    adapted config to JSON
INFO    http.auto_https enabling automatic HTTP->HTTPS redirects
INFO    serving initial configuration
```

Leave this terminal open. Caddy is now running.

### Step 6: Start Tradeboard in a separate terminal

Open another PowerShell window (no admin needed). Navigate to the project folder and start Tradeboard:

```powershell
cd D:\tradeboard-remote\tradeboard
uv run app.py
```

You should see:

```
╭─── Tradeboard v2.0.2.2 ──────────────────────────────╮
│                                                    │
│        Your Personal Algo Trading Platform         │
│                                                    │
│ Endpoints                                          │
│ Web App    http://127.0.0.1:5000                   │
│ WebSocket  ws://127.0.0.1:8765                     │
│ Docs       https://docs.algo.wesoftcorp.com                │
│                                                    │
│ Status     Ready                                   │
│                                                    │
╰────────────────────────────────────────────────────╯
```

### Step 7: Open Tradeboard in your browser

Go to: **https://tradeboard.local**

You should see the Tradeboard login screen with a valid lock icon next to the URL. No certificate warnings.

### Step 8: Update broker callback URLs

Now that Tradeboard runs on HTTPS, update the redirect URL in your `.env` file:

```dotenv
REDIRECT_URL = 'https://tradeboard.local/shoonya/callback'
```

Match this exactly in your broker's developer console:

* **Shoonya API Portal:** Edit your app and set the Redirect URL to `https://tradeboard.local/shoonya/callback`

Restart Tradeboard after editing `.env`.

All the brokers the procedure remains the same.

### Daily workflow after setup

Once everything is set up, your daily workflow is just two terminals:\
\
Run this from the tradeboard root folder

**Terminal 1 (Caddy):**

```powershell
C:\caddy\caddy.exe run
```

**Terminal 2 (Tradeboard):**

```powershell
uv run app.py
```

Press `Ctrl+C` in either terminal to stop. Nothing runs in the background as a service.

### Optional: Single-command launcher

Create `start.bat` in your Tradeboard folder:

```batch
@echo off
start "Caddy" cmd /k C:\caddy\caddy.exe run
start "Tradeboard" cmd /k uv run app.py
```

Double-click to launch both. Close both terminal windows when done.

### Troubleshooting

#### Browser shows ERR\_CONNECTION\_REFUSED

Make sure both terminals are running. Caddy must be running for HTTPS to work, and Tradeboard must be running for Caddy to have something to proxy to.

#### Certificate warning in browser

This means Caddy's root CA is not trusted. Stop Caddy, then run as Administrator:

```powershell
C:\caddy\caddy.exe trust
```

Accept the Windows prompt. Restart Caddy.

#### Port 443 already in use

Another service is using the HTTPS port. Common culprits:

```powershell
netstat -ano | findstr :443
```

If IIS or `World Wide Web Publishing Service` is using it, stop the service. Or change Caddy to use a different port:

```
tradeboard.local:8443 {
    reverse_proxy localhost:5000
}
```

Then access Tradeboard at `https://tradeboard.local:8443`.

#### Caddy says "Caddyfile input is not formatted"

Cosmetic warning only. To fix, run:

```powershell
C:\caddy\caddy.exe fmt --overwrite Caddyfile
```

#### Hosts file ping does not resolve

The most common cause is saving `hosts` as `hosts.txt`. Open `C:\Windows\System32\drivers\etc\` in File Explorer with extensions visible (View > Show > File name extensions). If you see `hosts.txt`, delete it and edit the original `hosts` file again.

### Removing the setup

If you want to undo everything:

1. Stop Caddy and Tradeboard
2. Untrust the Caddy CA: `C:\caddy\caddy.exe untrust` (as Administrator)
3. Remove the `127.0.0.1 tradeboard.local` line from `C:\Windows\System32\drivers\etc\hosts`
4. Delete `C:\caddy\`
5. Delete the `Caddyfile` from your Tradeboard folder

### Summary

You now have Tradeboard running on `https://tradeboard.local` with a fully trusted SSL certificate. No background services, no code changes to Tradeboard, and OAuth callbacks work cleanly with broker APIs that require HTTPS redirect URLs.
