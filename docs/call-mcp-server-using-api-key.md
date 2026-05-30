---
title: Call MCP Server Using an API Key
description: Learn how to call the elmah.io MCP server using an API key as a Bearer token for scripted and automated access without a browser.
---

# Call MCP Server Using an API Key

[TOC]

The elmah.io MCP server supports using an API key as a Bearer token as an alternative to the OAuth browser flow. This is useful when calling the MCP server from scripts, CI/CD pipelines, or any automated context where opening a browser is not practical.

## How it works

You need an elmah.io API key with the appropriate read permissions for the tools you want to call. API keys are managed under your organization settings. See [How to configure API key permissions](/how-to-configure-api-key-permissions/) for details on enabling permissions. If your API key is missing a required permission, the tool will return an error.

Pass your API key in the `Authorization` header as a Bearer token on every request to `https://mcp.elmah.io/mcp`. The server distinguishes API keys from OAuth tokens automatically. Any Bearer token that does not look like a JWT is treated as an API key.

When authenticating with an API key, all requests run in the context of your organization rather than a specific user. This means the MCP server has access to all logs, deployments, and other resources belonging to your organization, regardless of which individual user created them. This is different from signing in through OAuth, where access is scoped to the resources available to your personal user account.

The MCP server uses the Streamable HTTP transport. Each request is a `POST` with a JSON-RPC 2.0 body, and responses are returned as Server-Sent Events (SSE).

## Example

The following examples list your logs and fetch the most recent messages from the first log found. Replace `API_KEY` with your actual API key ([Where is my API key?](where-is-my-api-key.md)).

<div class="tabbable-responsive">
<div class="tabbable">
<ul class="nav nav-tabs" role="tablist">
    <li role="presentation" class="nav-item"><a class="nav-link active" href="#powershell" role="tab" data-bs-toggle="tab">PowerShell</a></li>
    <li role="presentation" class="nav-item"><a class="nav-link" href="#curl" role="tab" data-bs-toggle="tab">curl</a></li>
</ul>
</div>
</div>

<div class="tab-content tab-content-tabbable" markdown="1">
<div role="tabpanel" class="tab-pane active" id="powershell" markdown="1">

```powershell
$mcpUrl  = "https://mcp.elmah.io/mcp"
$headers = @{
    "Authorization" = "Bearer API_KEY"
    "Content-Type"  = "application/json"
    "Accept"        = "application/json, text/event-stream"
}

function Invoke-McpTool([string]$toolName, [hashtable]$arguments = @{}) {
    $body = @{
        jsonrpc = "2.0"
        id      = 1
        method  = "tools/call"
        params  = @{ name = $toolName; arguments = $arguments }
    } | ConvertTo-Json -Depth 10

    $response = Invoke-WebRequest -Uri $mcpUrl -Method POST -Headers $headers -Body $body
    $dataLine = ($response.Content -split "`r?`n") | Where-Object { $_ -match "^data: " } | Select-Object -First 1
    return (($dataLine -replace "^data: ", "") | ConvertFrom-Json).result.content[0].text
}

# List all logs in your organization
$logsJson = Invoke-McpTool "logs_list"
$logs     = ($logsJson | ConvertFrom-Json).logs
$logs | Format-Table id, name

# Fetch recent messages from the first log
$logId    = $logs[0].id
$messages = Invoke-McpTool "messages_list_recent" @{ logId = $logId }
Write-Output $messages
```

</div>
<div role="tabpanel" class="tab-pane" id="curl" markdown="1">

List all logs in your organization:

```bash
curl -s -X POST https://mcp.elmah.io/mcp \
  -H "Authorization: Bearer API_KEY" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"logs_list","arguments":{}}}'
```

Fetch recent messages from a specific log (replace `LOG_ID` with a log ID from the previous response):

```bash
curl -s -X POST https://mcp.elmah.io/mcp \
  -H "Authorization: Bearer API_KEY" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"messages_list_recent","arguments":{"logId":"LOG_ID"}}}'
```

Responses are returned in SSE format. The result is contained in the `data:` line:

```
data: {"jsonrpc":"2.0","id":1,"result":{"content":[{"type":"text","text":"..."}]}}
```

</div>
</div>

The same pattern works for any MCP tool. Replace the tool name and arguments to call other tools such as `messages_count`, `deployments_list`, or `organizations_list`. See [all available tools](/setup-mcp-server/#available-tools) for the full list.
