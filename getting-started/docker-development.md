# Docker Development

This guide covers running Tradeboard in Docker on your own machine. Tradeboard ships its own `Dockerfile`, `docker-compose.yaml` and `.dockerignore` in the repository root, so you do not write any of them yourself.

### Prerequisites

* Docker Engine
* Docker Compose v2 (the `docker compose` subcommand, not the standalone `docker-compose` binary)
* Git

### Two ways to run it

| Approach | Command | When to use |
| --- | --- | --- |
| Pre-built image | `install/docker-run.sh` (or `install\docker-run.bat` on Windows) | You just want Tradeboard running. Pulls `wesoftcorp/tradeboard-docs:latest`, no build step. |
| Build from source | `docker compose up -d --build` | You are changing the code and want your changes in the image. |

The rest of this page covers the build-from-source path.

## Essential .env Changes for Docker

Start from the template, then change only what Docker needs:

```bash
cp .sample.env .env
```

### 1. WebSocket host

```dotenv
# The WebSocket proxy must bind all interfaces inside the container
# so the published port can reach it from the host
WEBSOCKET_HOST='0.0.0.0'
WEBSOCKET_PORT='8765'
WEBSOCKET_URL='ws://127.0.0.1:8765'
```

`WEBSOCKET_URL` is the address the **browser** uses, so it stays on the host's loopback address, not the container's.

### 2. Flask host

```dotenv
FLASK_HOST_IP='0.0.0.0'
FLASK_PORT='5000'
```

The container entrypoint binds Gunicorn to `0.0.0.0:5000` regardless, but `install-docker.sh` sets `FLASK_HOST_IP` too so the value in `.env` matches what is actually happening.

### 3. Leave ZeroMQ on loopback

```dotenv
ZMQ_HOST='127.0.0.1'
ZMQ_PORT='5555'
```

::: danger
**Do not set `ZMQ_HOST` to `0.0.0.0`.** ZeroMQ is the internal, unauthenticated bus between the broker WebSocket adapters and the WebSocket proxy. Both run inside the same container, so loopback is sufficient. Binding it to all interfaces publishes the raw tick feed to anything that can reach the port. The official `install-docker.sh` deliberately rewrites `WEBSOCKET_HOST` and `FLASK_HOST_IP` and deliberately leaves `ZMQ_HOST` alone.
:::

### Summary of changes

| Key | Local development | Docker |
| --- | --- | --- |
| `FLASK_HOST_IP` | `127.0.0.1` | `0.0.0.0` |
| `WEBSOCKET_HOST` | `127.0.0.1` | `0.0.0.0` |
| `ZMQ_HOST` | `127.0.0.1` | `127.0.0.1` (unchanged) |

Everything else, including broker credentials and database URLs, stays as it is.

### What the shipped Dockerfile does

You do not need to create it, but it helps to know what is in the image:

* **Python builder** stage on `python:3.12-bullseye`: creates `/app/.venv` with `uv sync` from `pyproject.toml`, then adds `gunicorn>=25.0,<26` and `eventlet`.
* **Frontend builder** stage on `node:22-bullseye-slim`: runs `npm ci` and `npm run build` in `frontend/`.
* **Production** stage on `python:3.12-slim-bullseye`: copies the virtual environment and the built `frontend/dist`, installs Chromium (needed by Kaleido for Telegram chart rendering), creates the `appuser` account pinned to UID/GID 1000, and runs `/app/start.sh`.

`start.sh` runs the database migrations, starts the WebSocket proxy on port 8765, then execs Gunicorn with the eventlet worker on port 5000.

### Quick Start

```bash
# 1. Configure
cp .sample.env .env
# edit .env: broker credentials, plus the Docker host changes above

# 2. Build and start
docker compose up -d --build

# 3. Watch startup logs
docker compose logs -f
```

Tradeboard is then reachable at [http://127.0.0.1:5000](http://127.0.0.1:5000). Create your account at [http://127.0.0.1:5000/setup](http://127.0.0.1:5000/setup).

### What the compose file gives you

`docker-compose.yaml` defines a single service named `tradeboard` (container name `tradeboard-web`):

* Publishes `${FLASK_PORT:-5000}:5000` and `${WEBSOCKET_PORT:-8765}:8765`
* Named volumes for `db`, `log`, `strategies`, `keys` and `tmp`, so data survives a rebuild
* Bind-mounts your host `./.env` to `/app/.env`
* Sets `TZ=Asia/Kolkata` and caps the BLAS/OpenMP thread counts at 2 to avoid `RLIMIT_NPROC` exhaustion
* A healthcheck against `http://127.0.0.1:5000/auth/check-setup`
* `restart: unless-stopped`

### Common Commands

```bash
# Start (detached)
docker compose up -d

# Start and rebuild after a code change
docker compose up -d --build

# View logs
docker compose logs -f

# Stop containers
docker compose down

# Rebuild ignoring the layer cache (after a dependency change)
docker compose build --no-cache && docker compose up -d

# Shell inside the container
docker compose exec tradeboard bash

# Container status and health
docker compose ps
docker inspect tradeboard-web --format='{{.State.Health.Status}}'
```

::: info
`docker compose down` removes the containers but **not** the named volumes, so your database survives. `docker compose down -v` deletes the volumes and everything in them.
:::

### Adjusting resources

Three settings in `.env` are read by `docker-compose.yaml` and matter on small containers:

```dotenv
STRATEGY_MEMORY_LIMIT_MB = '1024'   # per Python strategy subprocess
SHM_SIZE = '512m'                   # /dev/shm, roughly 25% of container RAM
OPENBLAS_NUM_THREADS = '2'          # also OMP / MKL / NUMEXPR / NUMBA
```

They are commented out in `.sample.env`; uncomment them to override the defaults. For a 2 GB container use `256`, `256m` and `1`.

### Directory Structure

```
tradeboard/
├── Dockerfile               # multi-stage: python builder, node builder, production
├── docker-compose.yaml
├── .dockerignore
├── start.sh                 # container entrypoint
├── .env                     # yours, bind-mounted into the container
├── app.py
├── pyproject.toml
├── frontend/
│   └── dist/                # pre-built React bundle, also rebuilt in the image
└── db/                      # named volume in Docker
```

### Development Tips

1. **Code changes need a rebuild.** The production image copies the source in rather than mounting it, so run `docker compose up -d --build` after editing Python code. For a tight edit-reload loop, run Tradeboard directly with `uv run app.py` instead of in Docker.
2. **Database access.** The SQLite databases live in the `tradeboard_db` named volume. Copy them out with `docker compose cp tradeboard:/app/db ./db-backup`.
3. **Debugging.** Logs go to the console and to the `tradeboard_log` volume. `log/errors.jsonl` carries structured errors with full tracebacks.
4. **Dependencies.** Add packages to `pyproject.toml`, then rebuild with `docker compose build --no-cache`.

### Troubleshooting

1.  **Port already in use**

    ```bash
    # See what is holding port 5000 or 8765
    sudo lsof -i :5000
    sudo lsof -i :8765

    docker compose down
    docker compose up -d
    ```

    You can also move the published ports by setting `FLASK_PORT` and `WEBSOCKET_PORT` in `.env`.
2.  **Permission errors on the mounted `.env`**

    The container runs as UID 1000. If the file is owned by another user the first-run secret rotation cannot write to it and the worker restarts in a loop:

    ```bash
    sudo chown 1000:1000 .env
    sudo chmod 600 .env
    docker compose up -d
    ```
3.  **Container will not start**

    ```bash
    docker compose logs --tail=100
    docker compose down
    docker compose up -d --build
    ```
4.  **Package installation issues**

    ```bash
    docker compose build --no-cache
    docker compose up -d
    ```
5.  **`docker-compose: command not found`**

    Compose v1 is end of life. Use the `docker compose` subcommand that ships with Docker Engine.

### Note

The shipped configuration is production-oriented: Gunicorn, a healthcheck and `restart: unless-stopped`. For a public deployment with a custom domain and SSL, use `install/install-docker.sh` instead, which adds nginx and a Let's Encrypt certificate in front of this container.
