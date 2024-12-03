---
title: Clearing log messages from the CLI
description: Learn about the clear CLI command and how you can use it to clear messages from a log. Set up a nightly batch job to enforce custom retention.
---

# Clearing log messages from the CLI

The `clear` command is used to delete one or more messages from a log.

!!! note
    Be aware that clearing a log does not reset the monthly counter towards log messages included in your current plan. The `clear` command is intended for cleanup in non-expired log messages you no longer need.

## Usage

```cmd
> elmahio clear --help

Description:
  Delete one or more messages from a log

Usage:
  elmahio clear [options]

Options:
  --apiKey <apiKey> (REQUIRED)  An API key with permission to execute the command
  --logId <logId> (REQUIRED)    The log ID of the log to clear messages
  --query <query> (REQUIRED)    Clear messages matching this query (use * for all messages)
  --from <from>                 Optional date and time to clear messages from
  --to <to>                     Optional date and time to clear messages to
  --proxyHost <proxyHost>       A hostname or IP for a proxy to use to call elmah.io
  --proxyPort <proxyPort>       A port number for a proxy to use to call elmah.io
  -?, -h, --help                Show help and usage information
```

## Examples

**Simple:**

```cmd
elmahio clear --apiKey API_KEY --logId LOG_ID --query "statusCode:404"
```

**Full:**

```cmd
elmahio clear --apiKey API_KEY --logId LOG_ID --query "statusCode:404" --from 2022-05-17 --to 2022-05-18
```