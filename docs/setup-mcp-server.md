---
title: Set Up MCP Server
description: Learn how to connect your AI assistants to elmah.io using the Model Context Protocol (MCP) to debug production issues faster.
---

# Set Up MCP Server

The [elmah.io MCP server](https://mcp.elmah.io/) allows AI assistants to interact directly with your error logs, deployments, and organization statistics. By connecting your AI tools to elmah.io, you can debug production issues, analyze trends, and monitor your organization's health using natural language.

The MCP Server is available on the following URL:

```
https://mcp.elmah.io/mcp
```

## MCP Authentication

The elmah.io MCP server uses **OAuth2** to securely authorize your AI client. Unlike traditional integrations that might use a static API Key, the MCP server utilizes a web-based handshake. The authentication steps will vary from client to client, but all end up in a pop-up where you need to sign into elmah.io using either a username/password or with a social provider. Once signed in, a token will be generated for the MCP. The token is valid for 30 days. After the 30 days, your assistant will report an unauthorized error and you will need to re-authenticate.

## Setting up the MCP server in client

The elmah.io MCP server should be supported in all clients offering the OAuth flow. This documentation cover installation steps for a range of popular clients:

<div class="guides-boxes row">
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/add-mcp-server-to-claude-code/" title="Claude Code">
            <div class="guide-box">
                <div class="guide-image">
                    <img class="no-lightbox" src="/./assets/img/guides/elmahio.png" alt="Claude Code" />
                </div>
                <div class="guide-title">Claude Code</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/add-mcp-server-to-claude-desktop/" title="Claude Desktop">
            <div class="guide-box">
                <div class="guide-image">
                    <img class="no-lightbox" src="/./assets/img/guides/elmahio.png" alt="Claude Desktop" />
                </div>
                <div class="guide-title">Claude Desktop</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/add-mcp-server-to-chatgpt/" title="ChatGPT">
            <div class="guide-box">
                <div class="guide-image">
                    <img class="no-lightbox" src="/./assets/img/guides/elmahio.png" alt="ChatGPT" />
                </div>
                <div class="guide-title">ChatGPT</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/add-mcp-server-to-cursor-ai/" title="Cursor AI">
            <div class="guide-box">
                <div class="guide-image">
                    <img class="no-lightbox" src="/./assets/img/guides/elmahio.png" alt="Cursor AI" />
                </div>
                <div class="guide-title">Cursor AI</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/add-mcp-server-to-visual-studio/" title="Visual Studio">
            <div class="guide-box">
                <div class="guide-image">
                    <img class="no-lightbox" src="/./assets/img/guides/elmahio.png" alt="Visual Studio" />
                </div>
                <div class="guide-title">Visual Studio</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/add-mcp-server-to-vs-code/" title="VS Code">
            <div class="guide-box">
                <div class="guide-image">
                    <img class="no-lightbox" src="/./assets/img/guides/elmahio.png" alt="VS Code" />
                </div>
                <div class="guide-title">VS Code</div>
            </div>
        </a>
    </div>
</div>