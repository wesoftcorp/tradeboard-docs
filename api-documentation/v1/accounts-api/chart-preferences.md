# Chart Preferences

Read and update per-API-key chart workspace preferences.

## Read Preferences

```http
GET /api/v1/chart?apikey=<key>
```

```bash
curl --get 'http://127.0.0.1:5000/api/v1/chart' \
  --data-urlencode 'apikey=<your_app_apikey>'
```

Successful responses return all stored keys under `data`:

```json
{
  "status": "success",
  "data": {
    "tv_theme": "dark",
    "tv_chart_layout": {"interval": "15m"}
  }
}
```

`apikey` is read from the query string only; a missing `apikey` returns HTTP 400, an invalid one HTTP 403.

## Update Preferences

```http
POST /api/v1/chart
```

```bash
curl -X POST 'http://127.0.0.1:5000/api/v1/chart' \
  -H 'Content-Type: application/json' \
  -d '{
    "apikey": "<your_app_apikey>",
    "tv_theme": "dark",
    "tv_chart_layout": {"interval": "15m"}
  }'
```

`ChartSchema` sets `unknown = INCLUDE`, so unlike every other POST resource this one accepts arbitrary preference keys alongside `apikey`. A request may update at most 50 keys; keys are limited to 50 characters and each JSON-serialized value is limited to 1 MiB. The request must contain at least one preference besides `apikey`.

POST is a partial update: only the keys you send are written. It returns a confirmation message rather than the stored preferences.

```json
{
  "status": "success",
  "message": "Preferences updated successfully"
}
```

Both methods verify the Tradeboard API key. Invalid keys return HTTP 403. An empty body, a body with no preference keys, or a payload that breaks one of the size limits returns HTTP 400.

**Back to**: [API documentation](../README.md)
