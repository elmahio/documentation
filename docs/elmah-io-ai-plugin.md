---
title: elmah.io AI Plugin
description: Install the elmah.io AI Plugin to add prebuilt skills and a background monitoring agent on top of the elmah.io MCP server.
---

# elmah.io AI Plugin

[TOC]

The elmah.io AI Plugin packages the [elmah.io MCP server](/setup-mcp-server/) together with a set of prebuilt skills and a background monitoring agent. Instead of writing your own prompts to query logs, deployments, and uptime, you get ready-made workflows that already know which tools to call and in what order.

## What's included

### Skills

| Skill | Description |
| --- | --- |
| `debug-production-error` | Investigate a specific error by ID, message, or stack trace |
| `post-deployment-check` | Verify production health after shipping code |
| `investigate-frequent-errors` | Find and prioritize your highest-impact errors |
| `check-uptime-status` | Check monitor status and investigate downtime events |

### Agent

`deployment-watchdog` is a background agent that monitors for regressions after a deployment. It alerts immediately on fatal errors or downtime, or reports back with a HEALTHY / UNHEALTHY verdict once enough data has accumulated.

## Supported editors

The plugin is currently available for **Claude Code** and **Cursor**. For other editors, use the [raw MCP server setup](/setup-mcp-server/) — you'll get the same tools, just without the bundled skills and agent.

## Installing in Claude Code

### From the command line

```
claude plugin marketplace add elmahio/elmah-io-ai-plugin
claude plugin install elmah-io@elmah-io
```

### From the plugin directory

- Open Claude Code's plugin directory and go to **Plugins**.
- Click **Add marketplace** and choose **Add from a repository**.
- Enter `elmahio/elmah-io-ai-plugin` and confirm.
- Find **elmah.io** in the list and install it.

### Authenticate

Installing the plugin registers the elmah.io MCP server, which still needs to be authenticated the same way as a manual setup:

- Run `/mcp`.
- Locate **elmahio** in the list and verify that it shows **Needs authentication**.
- Select the **elmahio** server and click **Authenticate**.
- Follow the OAuth flow to sign in with your elmah.io account.

See [Set Up MCP Server](/setup-mcp-server/) for details on how authentication works, including token expiry.

## Installing in Cursor

Cursor installs the plugin from a local clone of the repository rather than directly from GitHub.

- Clone the repository to your machine:

```
git clone https://github.com/elmahio/elmah-io-ai-plugin.git
```

- In Cursor, click the settings icon next to your profile.
- Click **Plugins**.
- Click **Browse Marketplace**.
- Click the **+ Add** button.
- Select **From Local Repo**.
- Browse to and select your local clone of the elmah.io AI Plugin.

The elmah.io plugin is added. Authenticate the MCP server the same way as described above for Claude Code.

## Using the plugin

Skills are invoked automatically based on what you ask for. Some examples:

Investigate a specific error:

```
Debug this production error: NullReferenceException in OrderService
```

Verify production health after shipping code:

```
Run a post-deployment check after my latest deploy
```

Find your highest-impact errors:

```
What are the most frequent errors in my production log this week?
```

Check monitor status:

```
Is my site up? Check uptime status
```

Launch the background agent after a deployment:

```
Start the deployment watchdog for version 2.4.1
```

## Source

The plugin is open source under the Apache 2.0 license: [github.com/elmahio/elmah-io-ai-plugin](https://github.com/elmahio/elmah-io-ai-plugin).
