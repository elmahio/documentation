---
title: Add MCP Server to Codex
description: Learn how to integrate the elmah.io MCP server into OpenAI Codex via the terminal. Register, authenticate, and monitor your logs using the CLI.
howto_steps:
  - name: Register the MCP server
    text: "Open a terminal and run: codex mcp add elmahio --url https://mcp.elmah.io/mcp --oauth-client-id codex"
  - name: Start authentication
    text: "Run: codex mcp login elmahio"
  - name: Complete the OAuth flow
    text: Follow the OAuth flow to sign in with your elmah.io account.
  - name: Verify the connection
    text: "Run: codex mcp list, and confirm elmahio is listed as connected."
---

# Add MCP Server to Codex

The elmah.io MCP Server can be integrated in Codex using the CLI.

!!! note
    This configuration is shared between Codex CLI, the Codex IDE extension, and the ChatGPT desktop app's Codex surface. Registering the server once makes it available in all three.

- Open a terminal and run the following command to register the elmah.io MCP server in your local Codex configuration:

```
codex mcp add elmahio --url https://mcp.elmah.io/mcp --oauth-client-id codex
```

- Run the following command to start authentication:

```
codex mcp login elmahio
```

- Follow the OAuth flow to sign in with your elmah.io account.
- Run the following to confirm the server is connected:

```
codex mcp list
```

- You should see **elmahio** listed as connected.
