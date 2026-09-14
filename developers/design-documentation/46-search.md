# 46 - Symbol Search

## Surfaces

Tradeboard has two search contracts with different authentication and response shapes.

| Surface | Method and path | Auth | Purpose |
|---|---|---|---|
| Public RESTX contract | `POST /api/v1/search` | `apikey` in JSON | External symbol search |
| React/session suggestions | `GET /search/api/search` | App session | Filtered UI search |
| Expiry helper | `GET /search/api/expiries` | App session | Distinct expiries |
| Underlying helper | `GET /search/api/underlyings` | App session | Distinct option/futures underlyings |

The blueprint is `search_bp` with `url_prefix="/search"`. The React `/search` page is registered before the legacy template blueprint. `/search/token` and the blueprint's `/search/` renderer remain legacy session routes; the supported first-viewport UI is `frontend/src/pages/Search.tsx`. Note that the legacy `/search/` renderer reads its query from `symbol`, not `q`. Every blueprint route is guarded by `@check_session_validity` and none carries a `@limiter.limit` decorator.

## RESTX Search

`POST /api/v1/search` validates this JSON shape:

```json
{
  "apikey": "<tradeboard-api-key>",
  "query": "NIFTY 26000 DEC CE",
  "exchange": "NFO"
}
```

`query` and `apikey` are required; `exchange` is optional in `SearchSchema` (`restx_api/data_schemas.py`) and, when supplied, must be one of `VALID_EXCHANGES`. The resource carries `@limiter.limit(API_RATE_LIMIT)`, whose default in `restx_api/search.py` is `"10 per second"`. A schema failure returns HTTP 400 with the marshmallow messages.

`services/search_service.py` verifies the key, uses the enhanced in-memory token cache when loaded and valid, and falls back to `database.symbol.enhanced_search_symbols()`.

The normalized result includes Tradeboard and broker symbol/exchange values, name, token, expiry, strike, lot size, instrument type, tick size, and option freeze quantity where available.

## Session Search

`GET /search/api/search` accepts:

- `q`
- comma-separated `exchange`
- comma-separated `instrumenttype`
- `expiry`
- `underlying`
- `strike_min` and `strike_max`

At least a query or exchange is required to avoid a full-table scan; without either the endpoint returns `{"results": [], "total": 0}` rather than an error. Standard instruments use `database.symbol.enhanced_search_symbols()`. F&O filters or an F&O exchange use `database.token_db_enhanced.fno_search_symbols()`. Multi-value `exchange` and `instrumenttype` are evaluated as the union of every combination, and results are de-duplicated by `(symbol, exchange)`. The response shape is `{"results": [...], "total": <count>}`.

The expiry helper accepts optional `exchange`, `underlying` and `instrumenttype`, and returns `{"status": "success", "expiries": [...]}`. Option-chain tools pass `instrumenttype=options`; without it the list mixes futures and options expiries, which coincide on NFO but not on MCX.

The underlying helper accepts optional `exchange` and `include_futures` (`1`, `true` or `yes`), and returns `{"status": "success", "underlyings": [...]}`. Exchange test symbols containing `NSETEST` or `BSETEST` are filtered from its response.

## Cache Model

`database.token_db_enhanced` owns the token cache and cached F&O discovery. It provides:

- Validity-aware general symbol search.
- Indexed F&O filtering.
- Cached distinct expiry lookup.
- Cached distinct underlying lookup, optionally including futures-only names.

The search service must retain a database fallback because cache restoration happens asynchronously at startup and can be invalidated when master contracts change.

## Consumers

- `frontend/src/pages/Search.tsx` uses the session suggestion endpoint.
- IV, GEX, Gamma Density, OI Tracker/Profile, and related tools use the expiry/underlying helpers.
- External scripts and MCP-backed API behavior use the RESTX search contract.

## Key Files

| File | Responsibility |
|---|---|
| `restx_api/search.py` | External POST contract |
| `services/search_service.py` | API-key verification, cache-first search, DB fallback |
| `blueprints/search.py` | Session search and discovery helpers |
| `database/token_db_enhanced.py` | Enhanced token/F&O cache |
| `database/symbol.py` | SQLAlchemy fallback search |
| `frontend/src/pages/Search.tsx` | React search page |

See the [Search API](../../api-documentation/v1/data-api/search.md) for the public request contract.
