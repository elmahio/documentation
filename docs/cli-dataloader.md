---
title: Dataloader loads data from the CLI
---

# Dataloader loads data from the CLI

The `dataloader` command loads 50 log messages into a specified log.

## Usage

```cmd
> elmahio dataloader --help

dataloader:
  Load 50 log messages into the specified log

Usage:
  elmahio dataloader [options]

Options:
  --apiKey <apikey> (REQUIRED)    An API key with permission to execute the command
  --logId <logid> (REQUIRED)      The log ID of the log to import messages into
  -?, -h, --help                  Show help and usage information
```