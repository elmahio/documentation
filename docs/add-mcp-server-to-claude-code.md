---
title: Add MCP Server to Claude Code
description: Learn how to integrate the elmah.io MCP server into Claude Code via the terminal. Register, authenticate, and monitor your logs using the CLI.
howto_steps:
  - name: Register the MCP server
    text: "Open a terminal and run: claude mcp add --transport http --client-id claudecode elmahio https://mcp.elmah.io/mcp"
  - name: Open the MCP menu
    text: "Launch Claude Code and run: /mcp"
  - name: Start authentication
    text: Locate elmahio in the list, verify it shows Needs authentication, select it, and click Authenticate.
  - name: Complete the OAuth flow
    text: Follow the OAuth flow to sign in with your elmah.io account.
  - name: Verify the connection
    text: "Run: claude mcp list, and confirm elmahio is listed with a connected status."
---

# Add MCP Server to Claude Code

The elmah.io MCP Server can be integrated in Claude Code using the console.

!!! note
    Prefer prebuilt skills over writing your own prompts? See the [elmah.io AI Plugin](/elmah-io-ai-plugin/) instead, which installs the MCP server together with ready-made skills and a background monitoring agent.

- Open a terminal and run the following command to register the elmah.io MCP server in your local Claude Code configuration:

```
claude mcp add --transport http --client-id claudecode elmahio https://mcp.elmah.io/mcp
```

- Launch Claude Code and run the following command:

```
/mcp
```

- Locate **elmahio** in the list and verify that it shows **Needs authentication**.
- Select the **elmahio** server and click **Authenticate**.
- Follow the OAuth flow to sign in with your elmah.io account.
- Run the following to confirm the server is connected:

```
claude mcp list
```

- You should see **elmahio** listed with a connected status.