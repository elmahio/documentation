---
title: Monitor MCP Servers with Uptime Checks
description: Learn how to monitor your own MCP server with elmah.io Uptime Monitoring. MCP checks connect to your server, verify a tool and alert you when it stops working.
---

# Monitor MCP Servers with Uptime Checks

[TOC]

If you build or host an MCP (Model Context Protocol) server, an HTTP check only tells you that the endpoint answers. It doesn't tell you that an AI client can still connect, authenticate, and use your tools. elmah.io Uptime Monitoring supports an MCP check type that does exactly that.

!!! note
    MCP checks are currently in beta.

!!! note
    This page is about monitoring *your own* MCP server. If you are looking for how to let AI tools like Claude Code or Cursor read your elmah.io data, see [Set Up MCP Server](/setup-mcp-server/).

## What an MCP check does

On every run, each region you selected does the following:

1. Connects to the MCP endpoint, using the headers you configured.
2. Verifies that the tool you selected still exists on the server.
3. Calls the tool without arguments.

The region reports a failure if the server can't be reached, rejects the credentials, no longer has the tool, or the tool returns an error. Like HTTP checks, the check is marked down when the number of regions configured for the check fail within the timeout. The timeout covers the whole MCP session, not just the first request.

Since the tool is called without arguments, pick a tool that works without input and has no side effects, like a status or ping tool. Don't pick a tool that creates or deletes data.

## Create an MCP check

MCP checks are created the same way as other uptime checks, from the *Uptime* tab on a log. Choose *MCP* in the type toggle at the top of the panel, and fill in the form:

1. Input a *Name* and the *URL* of your MCP endpoint, like `https://example.com/mcp`. Add a description if you like.
2. If your server requires authentication, expand *Request* and add an `Authorization` header with the value `Bearer your-token`. The header is optional. Servers without authentication can be checked without it.
3. Click *Connect to MCP Server*. elmah.io lists the tools available on your server using the URL and headers you entered.
4. Select the tool to monitor. The description of the tool is shown below the list.
5. Select the regions and the timeout (1 to 60 seconds, default 30) and click save.

A tool is required to save an MCP check. If you change the URL after connecting, the tool list and your selection are cleared and you need to connect again.

Tool names and descriptions come from your server and are shown as plain text.

### Differences from HTTP checks

Some options only make sense for HTTP and aren't available on MCP checks:

- The HTTP method. MCP checks always use `POST`.
- The expected status code.
- The optional checks: SSL certificate, domain expiration, Lighthouse, canonical, ELMAH, and security headers.

The type of a check can't be changed after it has been created. To switch between HTTP and MCP, create a new check.

MCP checks count toward the same uptime check limit as HTTP checks. See [pricing](https://elmah.io/pricing/) for the number of checks included in each plan.

### Identifying the requests

Requests from MCP checks use the same `elmahio-uptimebot` user agent as other uptime checks, and include the `X-ELMAHIO-UPTIMEBOT-LOCATION` header with the region name. If your server restricts access by IP or user agent, see [Allowing elmah.io uptime agents](/allowing-elmah-io-uptime-agents/).

## Edit an MCP check

The saved tool is shown as read-only text when editing a check. To pick another tool, click *Connect to MCP Server* again and select the new tool from the list.

## Troubleshooting

Here are some things to try out if an MCP check doesn't work:

- If Connect to MCP Server says the server rejected the credentials, make sure the `Authorization` header is present, that the value starts with `Bearer`, and that the token hasn't expired.
- Listing tools gives the server 20 seconds to answer. If you get no response, verify that the URL is correct and publicly reachable from the internet. If you restrict access by IP, see [Allowing elmah.io uptime agents](/allowing-elmah-io-uptime-agents/).
- If you get a message saying the tools couldn't be listed, make sure the URL points at the MCP endpoint (often ending in `/mcp`) and not at a web page, and that the server is available over HTTP (the Streamable HTTP transport or the older SSE transport).
- Connecting to list tools is rate limited. If you get a message about too many requests, wait a little while and try again.

If a check has been working and then starts failing, the most common causes are:

- An expired or rotated token.
- A tool that has been renamed or removed in a new version of the server. The error says that the server no longer has a tool with that name.
- A tool that now requires parameters. The error says that the call was rejected because of its parameters, since the check never sends any.
- A tool that returns an error. The error text from your tool is included in the failed check.
