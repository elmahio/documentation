---
title: Logging heartbeats from PowerShell
description: Monitor successful executions of PowerShell scheduled tasks and services with elmah.io Heartbeats. Get a notification when a job stops running.
howto_steps:
  - name: Set the heartbeat variables
    text: |
      $apiKey = "API_KEY"
      $logId = "LOG_ID"
      $heartbeatId = "HEARTBEAT_ID"
      $url = "https://api.elmah.io/v3/heartbeats/$logId/$heartbeatId/?api_key=$apiKey"
  - name: Log a Healthy heartbeat on success
    text: |
      Wrap your script in a try block, run your code, then POST a Healthy result:
      $body = @{
          result = "Healthy"
      }
      Invoke-RestMethod -Method Post -Uri $url -Body ($body|ConvertTo-Json) -ContentType "application/json-patch+json"
  - name: Log an Unhealthy heartbeat on failure
    text: |
      In the catch block, POST an Unhealthy result with the exception message:
      $body = @{
          result = "Unhealthy"
          reason = $_.Exception.Message
      }
      Invoke-RestMethod -Method Post -Uri $url -Body ($body|ConvertTo-Json) -ContentType "application/json-patch+json"
---

# Logging heartbeats from PowerShell

The Heartbeats feature is a great way to verify that scripts run successfully too. A lot of people have PowerShell scripts running on a schedule to clean up folders on the file system, make batch changes in a database, and more.

To include heartbeats in your PowerShell script, wrap the code in `try/catch` and add either `Healthy` or `Unhealthy` result:

```powershell
$apiKey = "API_KEY"
$logId = "LOG_ID"
$heartbeatId = "HEARTBEAT_ID"
$url = "https://api.elmah.io/v3/heartbeats/$logId/$heartbeatId/?api_key=$apiKey"

try
{
    # Your script goes here

    $body = @{
        result = "Healthy"
    }
    Invoke-RestMethod -Method Post -Uri $url -Body ($body|ConvertTo-Json) -ContentType "application/json-patch+json"
}
catch
{
    $body = @{
        result = "Unhealthy"
        reason = $_.Exception.Message
    }
    Invoke-RestMethod -Method Post -Uri $url -Body ($body|ConvertTo-Json) -ContentType "application/json-patch+json"
}
```

If everything goes well, a `Healthy` heartbeat is logged using the `Invoke-RestMethod` cmdlet. If an exception is thrown in your script, an `Unhealthy` heartbeat is logged.