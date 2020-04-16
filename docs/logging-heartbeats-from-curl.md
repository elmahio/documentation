# Logging heartbeats from cURL

Sometimes is just easier to use cURL when needing to call a REST API. Creating elmah.io heartbeats is easy using cURL and fits well into scripts, scheduled tasks, and similar.

To create a new heartbeat, include the following cURL command in your script:

```bash
curl -X POST "https://api.elmah.io/v3/heartbeats/LOG_ID/HEARTBEAT_ID?api_key=API_KEY" -H "accept: application/json" -H "Content-Type: application/json-patch+json" -d "{ \"result\": \"Healthy\"}"
```

Remember to place `LOG_ID`, `HEARTBEAT_ID`, and `API_KEY` with the values found on the *Heartbeats* tab in elmah.io.

To create an `Unhealthy` heartbeat, change the `result` in the body and include a `reason`:

```bash
curl -X POST "https://api.elmah.io/v3/heartbeats/LOG_ID/HEARTBEAT_ID?api_key=API_KEY" -H "accept: application/json" -H "Content-Type: application/json-patch+json" -d "{ \"result\": \"Unhealthy\", \"reason\": \"Something isn't working\" }"
```
