---
title: Add MCP Server to Claude Code
description: Learn how to integrate the elmah.io MCP server into Claude Code via the terminal. Register, authenticate, and monitor your logs using the CLI.
---

# Add MCP Server to Claude Code

The elmah.io MCP Server can be integrated in Claude Code using the console.

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