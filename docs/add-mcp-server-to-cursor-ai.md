---
title: Add MCP Server to Cursor AI
description: Enable elmah.io in Cursor AI using its native MCP support. Follow this guide to configure your mcp.json file and authorize AI access to your logs.
howto_steps:
  - name: Open Cursor Settings
    text: Inside Cursor, click File > Preferences > Cursor Settings to open the Cursor Settings screen.
  - name: Open Tools & MCP
    text: In the left menu, click the Tools & MCP item.
  - name: Open the mcp.json file
    text: Click the Add Custom MCP item which will open a file editor on the mcp.json file.
  - name: Add the elmah.io MCP configuration
    text: "Add the following MCP configuration to include elmah.io's MCP server: { \"mcpServers\": { \"elmah.io\": { \"url\": \"https://mcp.elmah.io/mcp\", \"auth\": { \"CLIENT_ID\": \"cursor\" } } } }"
  - name: Connect to the server
    text: Navigate back to Cursor Settings and observe the elmah.io MCP server is now added and needs authentication. Click the Connect button.
  - name: Authenticate with elmah.io
    text: Allow Cursor to open an external website. A browser window will open, asking you to sign into elmah.io.
  - name: Verify the connection
    text: When signed in, the elmah.io MCP server will be added to the list of installed MCP servers and the available tools will be listed when expanding the server.
---

# Add MCP Server to Cursor AI

Cursor supports MCP natively. Follow these steps to integrate elmah.io.

!!! note
    Prefer prebuilt skills over writing your own prompts? See the [elmah.io AI Plugin](/elmah-io-ai-plugin/) instead, which installs the MCP server together with ready-made skills and a background monitoring agent.

- Inside of Cursor, click **File > Preferences > Cursor Settings** to open the **Cursor Settings** screen.
- In the left menu, click the **Tools & MCP** item.

![Cursor Tools](images/mcp/cursor-tools.png)

- Click the **Add Custom MCP** item which will open a file editor on the `mcp.json` file.
- Add the following MCP configuration to include elmah.io's MCP server:

```json
{
  "mcpServers": {
    "elmah.io": {
      "url": "https://mcp.elmah.io/mcp",
      "auth": {
        "CLIENT_ID": "cursor"
      }
    }
  }
}
```

- Navigate back to **Cursor Settings** and observe the elmah.io MCP server is now added and need authentication:

![Cursor Need authentication](images/mcp/cursor-need-authentication.png)

- Click the **Connect** button and allow Cursor to open an external website. A browser window will open, asking you to sign into elmah.io.
- When signed in, the elmah.io MCP server will be added to the list of installed MCP servers and the available tools will be listed when expanding the server. The MCP server is now ready for use.