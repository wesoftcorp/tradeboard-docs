# Install Dependencies

Navigate to the directory where Tradeboard is cloned and install `uv`, the package manager Tradeboard uses:

```powershell
cd tradeboard
pip install uv
```

`uv` creates the `.venv` virtual environment and resolves every dependency from `pyproject.toml` the first time you start Tradeboard, so there is no separate install step:

```powershell
uv run app.py
```

The first run takes a few minutes while the environment is built. Later runs start immediately.

If you prefer to install the dependencies ahead of time rather than on first launch, run:

```powershell
uv sync
```

<figure><img src="/assets/pip install.png" alt=""><figcaption></figcaption></figure>
