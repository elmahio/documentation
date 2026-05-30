---
title: Set Up MCP Server
description: Learn how to connect your AI assistants to elmah.io using the Model Context Protocol (MCP) to debug production issues faster.
---

# Set Up MCP Server

[TOC]

The [elmah.io MCP server](https://mcp.elmah.io/) allows AI assistants to interact directly with your error logs, deployments, and organization statistics. By connecting your AI tools to elmah.io, you can debug production issues, analyze trends, and monitor your organization's health using natural language.

The MCP Server is available on the following URL:

```
https://mcp.elmah.io/mcp
```

## MCP Authentication

The elmah.io MCP server uses **OAuth2** to securely authorize your AI client. The authentication steps will vary from client to client, but all end up in a pop-up where you need to sign into elmah.io using either a username/password or with a social provider. Once signed in, a token will be generated for the MCP. The token is valid for 30 days. After the 30 days, your assistant will report an unauthorized error and you will need to re-authenticate.

If you need to call the MCP server from a script, CI/CD pipeline, or other automated context where browser sign-in is not practical, you can use an API key as a Bearer token instead. See [Call MCP Server Using an API Key](/call-mcp-server-using-api-key/) for details.

## Setting up the MCP server in client

The elmah.io MCP server should be supported in all clients offering the OAuth flow. This documentation cover installation steps for a range of popular clients:

<div class="guides-boxes row">
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/add-mcp-server-to-claude-code/" title="Claude Code">
            <div class="guide-box">
                <div class="guide-image">
                    <img class="no-lightbox" src="/./assets/img/guides/claude.png" alt="Claude Code" />
                </div>
                <div class="guide-title">Claude Code</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/add-mcp-server-to-claude-desktop/" title="Claude Desktop">
            <div class="guide-box">
                <div class="guide-image">
                    <img class="no-lightbox" src="/./assets/img/guides/claude.png" alt="Claude Desktop" />
                </div>
                <div class="guide-title">Claude Desktop</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/add-mcp-server-to-chatgpt/" title="ChatGPT">
            <div class="guide-box">
                <div class="guide-image">
                    <img class="no-lightbox" src="/./assets/img/guides/chatgpt.png" alt="ChatGPT" />
                </div>
                <div class="guide-title">ChatGPT</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/add-mcp-server-to-cursor-ai/" title="Cursor AI">
            <div class="guide-box">
                <div class="guide-image">
                    <img class="no-lightbox" src="/./assets/img/guides/cursor.png" alt="Cursor AI" />
                </div>
                <div class="guide-title">Cursor AI</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/add-mcp-server-to-perplexity-ai/" title="Perplexity AI">
            <div class="guide-box">
                <div class="guide-image">
                    <img class="no-lightbox" src="/./assets/img/guides/perplexity.png" alt="Perplexity AI" />
                </div>
                <div class="guide-title">Perplexity AI</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/add-mcp-server-to-visual-studio/" title="Visual Studio">
            <div class="guide-box">
                <div class="guide-image">
                    <img class="no-lightbox" src="/./assets/img/guides/visual-studio.png" alt="Visual Studio" />
                </div>
                <div class="guide-title">Visual Studio</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/add-mcp-server-to-vs-code/" title="VS Code">
            <div class="guide-box">
                <div class="guide-image">
                    <img class="no-lightbox" src="/./assets/img/guides/vs-code.png" alt="VS Code" />
                </div>
                <div class="guide-title">VS Code</div>
            </div>
        </a>
    </div>
</div>

## Available tools

The elmah.io MCP server exposes the following tools to AI assistants:

| Tool | Description |
| --- | --- |
| `users_get_current` | Fetch the current user details. |
| `system_get_context` | Get system information like current date and time. Useful when calculating time intervals. |
| `organizations_list` | Get a list of all organizations that the current user is a part of. When authenticated as an organization, the current organization is returned. |
| `organizations_get_details` | Get detailed information about an organization including configuration, subscription, usage statistics, and more. |
| `logs_list` | Get a list of logs that the current user has access to. |
| `logs_get_details` | Get detailed configuration and metadata for a specific log. |
| `messages_get` | Fetch a single log message by ID. Includes full details like stack trace and metadata. |
| `messages_list_recent` | List the most recent log messages for a specific log. |
| `messages_list_frequent` | Identify the most frequent/common error groups in a log. Great for finding 'noisy' bugs. |
| `messages_count` | Count the number of log messages based on severity and timeframe. |
| `deployments_list` | List recent deployments for a log. A deployment represents a release of the software. |
| `uptime_list` | Get a list of all uptime checks for a log, including their current status and 24h up/down percentage. |
| `uptime_get_details` | Fetch the latest real-time results for a specific uptime check, including regional performance metrics. |
| `heartbeats_list` | Get a list of all heartbeats configured for a log, including their current status. |
| `heartbeats_get_details` | Get detailed information and recent check-in history for a specific heartbeat. |