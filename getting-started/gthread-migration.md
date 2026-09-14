# Migrating to gthread (Experimental)

Tradeboard is moving off the **eventlet** worker and onto Gunicorn's threaded **gthread** worker. This page explains why, what changes, how to opt in, how to verify it, and how to go back.

::: warning
**This is experimental and opt-in. It is not the default.**

If you upgrade and do nothing, Tradeboard continues to run on eventlet exactly as before. Only set the variable described below if you are willing to test and report results.
:::

**Branch:** [github.com/marketcalls/tradeboard/tree/gthread](https://github.com/wesoftcorp/tradeboard-docs/tree/gthread)
**Discussion and reports:** [issue #1722](https://github.com/wesoftcorp/tradeboard-docs/issues/1722)

***

### Why this migration is necessary

Tradeboard has always run as `gunicorn --worker-class eventlet -w 1`.

**Eventlet is retired software, and Gunicorn 26 removed the eventlet worker entirely.** That pins Tradeboard to `gunicorn>=25.0,<26` permanently, a version that will stop receiving fixes, with no upgrade path.

This is not a performance project. It is about not being stranded on a dead dependency.

Two options were evaluated and rejected before settling on gthread:

| Option | Verdict |
| ------ | ------- |
| **Granian** | Rejected. Its WSGI mode cannot provide the socket that `simple_websocket` needs, so Socket.IO WebSocket transport breaks. |
| **uvicorn / ASGI** | Deferred. Would require converting Flask to an ASGI application, a far larger change than the problem justifies today. |
| **gthread** | Chosen. Supported by Flask-SocketIO, keeps Flask and WSGI, and changes one launch flag rather than the framework. |

***

### What actually changes

This is the single sentence that governs the whole migration:

> Under eventlet, code that does not yield is atomic relative to other greenlets. Under gthread it is not.

**Eventlet** uses cooperative green threads. Your code runs uninterrupted until it chooses to yield (on I/O, or an explicit sleep). Two requests never interleave in the middle of a calculation.

**gthread** uses real operating system threads. The OS can suspend a thread **anywhere**, between two lines, or between reading a dictionary and writing it back.

The practical consequence is that code which was *accidentally* safe under eventlet is genuinely racy under real threads. This matters most on a server that runs all day, places real orders, and is never restarted.

#### What this found

These were reproduced, not theorised:

* Order cancellation releasing blocked margin **twice**
* Expired-contract settlement releasing margin twice, triggerable by leaving two browser tabs open
* The symbol lookup going **blank during its daily refresh**, so a valid symbol briefly looks like it does not exist
* MCP quota admitting 7 and 8 concurrent requests against a configured limit of 5
* Sandbox catch-up and square-off sweeps each running twice
* A Python strategy launch path that could **deadlock before the strategy started**

::: info
**If you run Tradeboard on Windows or macOS with `uv run app.py`, you have never been on eventlet.** The development server uses standard threading. Every one of the issues above has been reachable on your setup all along.

The migration did not introduce them. It found them.
:::

***

### What we gain from this

#### Strategic: the actual reason

* **Unblocks Gunicorn 26 and beyond.** Eventlet's removal currently pins Tradeboard to `gunicorn<26` permanently.
* **Removes a retired dependency** that no longer has active maintenance.
* **Keeps Flask and WSGI.** No framework rewrite, unlike the ASGI route.
* **One launch flag changes**, not the architecture.

#### Correctness: the unexpected payoff

* Forced a full concurrency audit that surfaced **real money-path defects**: margin released twice on cancellation, the symbol cache blanking mid-refresh, duplicate sandbox sweeps.
* Those defects were **already live for every Windows and macOS user**, whose development server has always used real threads.
* Locking and lifecycle rules are now **documented and enforced by tests** rather than holding by accident.

#### Operational

* An **explicit, tunable thread budget** instead of an unbounded pool of green threads.
* Real OS threads are **visible to standard tooling**, `top`, `py-spy` and thread dumps all work normally, where green threads are invisible to them.
* Diagnostics report the **live worker class, thread count and open stream counts**.
* **No dependency change to adopt.** Gunicorn 25.3 already ships both workers.

#### Risk profile

* **Opt-in behind a single `.env` line**; the default is unchanged.
* **Rollback is deleting that line and restarting**, no rebuild, no dependency change.

::: info
**This is not a performance improvement.** Expect broadly similar throughput. The value is being able to move to a supported Gunicorn, plus the correctness work the migration forced. Treat any claim that gthread makes Tradeboard faster with suspicion.
:::

***

### Who is affected by the switch itself

| How you run Tradeboard | Uses eventlet today? | Affected by this switch |
| -------------------- | -------------------- | ----------------------- |
| Docker | Yes | **Yes** |
| Ubuntu server via `install.sh` (systemd + nginx) | Yes | **Yes** |
| Ubuntu multi-instance via `install-multi.sh` | Yes | **Yes** |
| Windows / macOS desktop (`uv run app.py`) | No, already real threads | No change |

Windows and macOS desktop users do not run Gunicorn at all, so there is nothing to opt into. The concurrency fixes on the branch still benefit you.

***

### Current status

Being direct about readiness:

* **122 files changed, 41 commits**
* **Roughly 64% of tracked migration items complete** (70 of 109 actionable)
* Several known issues remain open and are recorded on the branch
* Three independent audits have already found cases where an earlier fix was itself wrong

Progress notes live in `docs/progress/gthread/` on the branch, and every item is tracked in `docs/plans/2026-08-01-gthread-migration-tracker.csv`.

**Do not run this on a production trading account you cannot afford to babysit.**

***

### Step 1: Get the branch

The opt-in variable does nothing on code built from `main`. The worker-resolution logic only exists on the `gthread` branch, so you must switch the checkout first.

::: danger
Take a backup before switching branches. On Ubuntu, `install/update.sh` backs up your databases automatically; for Docker, copy your `.env` and back up the `db/` volume yourself.
:::

```bash
cd /opt/tradeboard          # or wherever you cloned Tradeboard
git fetch origin gthread
git checkout gthread
git pull origin gthread
```

Your `.env` is not tracked by git and is preserved.

***

### Step 2: Opt in

Add **one line** to your `.env`:

```bash
TRADEBOARD_WORKER_CLASS = 'gthread'
```

That is sufficient. A safe thread count is chosen for you.

::: warning
**Do not set the thread count on its own.** `TRADEBOARD_GUNICORN_THREADS` does nothing without the worker class, and Gunicorn's own default of one thread would let a single live strategy log or MCP stream block the entire server.
:::

There is no dependency change. Gunicorn 25.3, the version already pinned in Tradeboard, ships **both** the eventlet and gthread workers.

***

### Step 3: Apply it

#### Docker

```bash
cd /opt/tradeboard
docker compose build
docker compose up -d
docker compose logs -f
```

`.env` is bind-mounted into the container, so the setting **survives `docker pull`** and does not require regenerating `docker-compose.yaml`.

#### Ubuntu server (systemd)

```bash
cd /var/python/tradeboard
sudo bash install/update.sh
```

The updater rewrites `ExecStart` in your systemd unit, **backs up the previous unit first**, verifies the new one before touching dependencies, and **restores the backup automatically if the service fails to start**.

#### Ubuntu multi-instance

Each instance has its own `.env`. Set the variable per instance and re-run the updater for that instance.

::: warning
Threads are per instance, so the host cost is `threads x instances`. With the default of 64 threads and 4 instances that is 256 request threads on one box. `install-multi.sh` prints the total; divide a per-host budget with `TRADEBOARD_GUNICORN_THREADS` if that is too high for your VPS.
:::

***

### Step 4: Verify it is actually running

Do not trust the `.env` file alone. Confirm the running process.

**Docker:**

```bash
docker logs tradeboard-web 2>&1 | grep "Starting application"
# [Tradeboard] Starting application on port 5000 with gthread (64 threads)...

docker top tradeboard-web | grep worker-class
# ... gunicorn --worker-class gthread --threads 64 --workers 1 ...
```

**Ubuntu:**

```bash
systemctl cat tradeboard | grep worker-class
ps -eo args | grep "[g]unicorn"
```

**In the web UI:** the admin runtime panel reports the live worker class, configured thread count, active thread count and open stream counts. Use it to see the real numbers under load rather than guessing.

***

### Tuning the thread count

The default is **64**, chosen because Tradeboard holds a request thread for the entire life of certain connections:

```
required threads >=
    active Socket.IO clients x 2       (polling holds a GET and a POST)
  + live Python Strategy log streams   (each holds a thread until closed)
  + live MCP streams                   (same)
  + internal loopback reserve          (MCP, Telegram and WhatsApp re-enter the API)
  + requests parked in broker rate limiters
  + peak ordinary HTTP concurrency
  + failure and reconnect headroom
```

To override:

```bash
TRADEBOARD_GUNICORN_THREADS = '96'
```

| Behaviour | Value |
| --------- | ----- |
| Default when gthread is selected | 64 |
| Values below 16 | raised to 16, with a warning |
| Values above 512 | permitted, with a warning about memory |
| Non-numeric | falls back to 64, with a warning |

::: info
**Market data does not consume Gunicorn threads.** The options tools, charting and scalping terminals stream over a direct WebSocket to the proxy on port 8765, and all tabs share a single connection. Opening the entire tools suite adds zero request threads.
:::

***

### Rolling back

Removing the line and restarting is the entire rollback. No rebuild is needed.

**Docker:**

```bash
sed -i "/TRADEBOARD_WORKER_CLASS/d;/TRADEBOARD_GUNICORN_THREADS/d" .env
docker compose up -d
```

**Ubuntu:**

```bash
sudo sed -i "/TRADEBOARD_WORKER_CLASS/d;/TRADEBOARD_GUNICORN_THREADS/d" /var/python/tradeboard/.env
cd /var/python/tradeboard && sudo bash install/update.sh
```

To leave the branch entirely, `git checkout main` and rebuild or re-run the updater.

***

### Troubleshooting

**The log still says eventlet.**
The image or unit was not rebuilt, or you are still on `main`. Confirm with `git rev-parse --abbrev-ref HEAD`, then rebuild.

**A warning names an unknown worker class.**
The value is misspelled. Only `eventlet` and `gthread` are accepted; anything else falls back to eventlet **and warns**, so a typo cannot silently leave you thinking you are testing gthread.

**The service will not start after `update.sh`.**
The updater restores the previous unit automatically. Check `install/logs/` for the run log, and `journalctl -u tradeboard -n 50`.

**The server becomes unresponsive when a strategy is running.**
Report it on issue #1722 with your thread count. This is exactly the failure mode the thread budget exists to prevent.

**"database is locked" errors.**
Real threads make SQLite writers genuinely collide where green threads did not. A 15-second busy timeout and a retry for stale-snapshot conflicts are already in place, please report the full entry from `log/errors.jsonl`.

***

### What to test and report

Starting up is not evidence. What is genuinely useful:

* **Your broker, through a full trading day**, login, order placement, positions, and the roughly 3:00 AM IST token rollover
* **Live WebSocket streaming**, `/websocket/test` and the option chain tools under real market data
* **Python strategies**, especially multi-file strategies and scheduled start/stop
* **Sandbox mode**, order fills, square-off, expiry settlement
* **Telegram alerts, scalping and charting terminals**
* **Thread and stream counts from the admin runtime panel under real load**, these numbers are what will justify the final thread budget

Report on [issue #1722](https://github.com/wesoftcorp/tradeboard-docs/issues/1722) with your **broker, operating system, deployment method and thread count**. Negative results are as valuable as positive ones.

***

### When does this become the default

When it has been through real trading days, on real brokers, on both Docker and Ubuntu, without surprises. **There is no target date.**

Tradeboard is self-hosted, so there is no central rollback: once a change is on `main`, it reaches your machine whenever you choose to update, and it cannot be recalled. That is precisely why this ships opt-in first and why the default will not change until the evidence supports it.

***

### FAQ

**Will this speed up Tradeboard?**
That is not the goal. Expect broadly similar throughput. The point is being able to move to a supported Gunicorn.

**Do I need to change my strategies?**
No. Strategies run as isolated subprocesses, not inside the web worker.

**Does this affect the WebSocket proxy or ZeroMQ?**
No. The proxy runs as its own process on port 8765, and the ZeroMQ bus is unchanged.

**Do I need Node.js or a frontend rebuild?**
No. The branch carries a built frontend, as `main` does.

**Can I run one instance on gthread and another on eventlet?**
Yes. The setting is per instance, and comparing the two on one host is a genuinely useful test.

**Is my data at risk?**
The switch does not alter the database schema. Normal upgrade care still applies, take backups before switching branches.
