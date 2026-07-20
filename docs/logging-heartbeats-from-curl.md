---
title: Logging heartbeats from cURL
description: Sometimes is just easier to use cURL when needing to call a REST API. Creating elmah.io heartbeats is easy using cURL and fits well into scripts.
howto_steps:
  - name: Send a Healthy heartbeat
    text: |
      curl -X POST "https://api.elmah.io/v3/heartbeats/LOG_ID/HEARTBEAT_ID?api_key=API_KEY" -H "accept: application/json" -H "Content-Type: application/json-patch+json" -d "{ \"result\": \"Healthy\"}"
  - name: Replace the placeholders
    text: "Replace LOG_ID, HEARTBEAT_ID, and API_KEY with the values found on the Heartbeats tab in elmah.io."
  - name: Send an Unhealthy heartbeat
    text: |
      To log a failure, change the result value and include a reason:
      curl -X POST "https://api.elmah.io/v3/heartbeats/LOG_ID/HEARTBEAT_ID?api_key=API_KEY" -H "accept: application/json" -H "Content-Type: application/json-patch+json" -d "{ \"result\": \"Unhealthy\", \"reason\": \"Something isn't working\" }"
---

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
