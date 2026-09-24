---
title: Add MCP Server to Antigravity
description: Connect the elmah.io MCP server to Google Antigravity using the agy CLI, so your AI assistant can query your error logs, deployments, and organization data directly.
howto_steps:
  - name: Get an API key
    text: Copy an API key from your organization settings, making sure it has the permissions for the tools you want to use.
  - name: Register the MCP server
    text: "Open a terminal and run: agy mcp add --header \"Authorization: Bearer API_KEY\" elmah.io https://mcp.elmah.io/mcp"
  - name: Verify the connection
    text: "Run: agy mcp list, and confirm elmah.io is listed as enabled."
---

# Add MCP Server to Antigravity

Antigravity supports MCP servers through the `agy` CLI. Follow these steps to integrate elmah.io.

!!! note
    Antigravity's OAuth sign-in pop-up currently doesn't complete successfully ([known issue](https://github.com/google-antigravity/antigravity-cli/issues/25)), so this guide uses an API key as a Bearer token instead. Once that's fixed, you'll be able to register the server without the `--header` flag and sign in interactively.

- Copy an API key from your organization settings. Make sure it has the permissions for the tools you want to use; see [How to configure API key permissions](/how-to-configure-api-key-permissions/) ([Where is my API key?](where-is-my-api-key.md)).
- Open a terminal and run the following command to register the elmah.io MCP server, replacing `API_KEY` with your actual API key:

```
agy mcp add --header "Authorization: Bearer API_KEY" elmah.io https://mcp.elmah.io/mcp
```

- Run the following to confirm the server is registered:

```
agy mcp list
```

- You should see **elmah.io** listed as **enabled**.

The command writes the server configuration to `mcp_config.json` in your Antigravity config folder (`~/.gemini/config/mcp_config.json`), which will look like this:

```json
{
  "mcpServers": {
    "elmah.io": {
      "headers": {
        "Authorization": "Bearer API_KEY"
      },
      "serverUrl": "https://mcp.elmah.io/mcp"
    }
  }
}
```

The `headers` block sets the `Authorization` header on every request, so Antigravity doesn't need to complete the OAuth flow to connect. The elmah.io MCP server detects that the token isn't a JWT and treats it as an API key rather than an OAuth token. See [Call MCP Server Using an API Key](/call-mcp-server-using-api-key/) for what that means for authentication.
