---
title: Tail log messages from the CLI
description: Learn about the tail CLI command and how you can use it to monitor your elmah.io logs from the command line. Inspect errors from the console.
---

# Tail log messages from the CLI

The `tail` command is used to tail log messages in a specified log.

## Usage

```cmd
> elmahio tail --help

Description:
  Tail log messages from a specified log

Usage:
  elmahio tail [options]

Options:
  --apiKey <apiKey> (REQUIRED)  An API key with permission to execute the command
  --logId <logId> (REQUIRED)    The ID of the log to send the log message to
  -?, -h, --help                Show help and usage information
```

## Example

```cmd
elmahio tail --apiKey API_KEY --logId LOG_ID
```