---
title: Dataloader loads data from the CLI
description: Learn about the dataloader CLI command and how you can use it to load log messages to elmah.io. Fill a log with test data to try out elmah.io.
---

# Dataloader loads data from the CLI

The `dataloader` command loads 50 log messages into a specified log.

## Usage

```cmd
> elmahio dataloader --help

Description:
  Load 50 log messages into the specified log

Usage:
  elmahio dataloader [options]

Options:
  --apiKey <apiKey> (REQUIRED)  An API key with permission to execute the command
  --logId <logId> (REQUIRED)    The log ID of the log to import messages into
  --proxyHost <proxyHost>       A hostname or IP for a proxy to use to call elmah.io
  --proxyPort <proxyPort>       A port number for a proxy to use to call elmah.io
  -?, -h, --help                Show help and usage information
```

## Example

```cmd
elmahio dataloader --apiKey API_KEY --logId LOG_ID
```