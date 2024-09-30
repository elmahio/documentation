---
title: Importing log messages to elmah.io from the CLI
description: Learn about the import CLI command and how you can use it to import messages to elmah.io from popular log formats like IIS and W3C.
---

# Importing log messages from the CLI

The `import` command is used to import log messages from IIS log files and W3C Extended log files to an elmah.io log.

## Usage

```cmd
> elmahio import --help

Description:
  Import log messages to a specified log

Usage:
  elmahio import [options]

Options:
  --apiKey <apiKey> (REQUIRED)      An API key with permission to execute the command
  --logId <logId> (REQUIRED)        The ID of the log to import messages to
  --type <iis|w3c> (REQUIRED)       The type of log file to import. Use 'w3c' for W3C Extended Log File Format and
                                    'iis' for IIS Log File Format
  --filename <filename> (REQUIRED)  Defines the path and filename of the file to import from. Ex. " --filename
                                    C:\myDirectory\log.txt"
  --dateFrom <dateFrom>             Defines the Date from which the logs start. Ex. " --dateFrom 2024-09-23"
  --dateTo <dateTo>                 Defines the Date from which the logs end. Ex. " --dateTo 2024-09-30"
  --proxyHost <proxyHost>           A hostname or IP for a proxy to use to call elmah.io
  --proxyPort <proxyPort>           A port number for a proxy to use to call elmah.io
  -?, -h, --help                    Show help and usage information
```

## Examples

**IIS:**

```cmd
elmahio import --apiKey API_KEY --logId LOG_ID --type iis --filename u_inetsv1.log --dateFrom 2023-03-13T10:14 --dateTo 2023-03-13T10:16
```

**w3c:**

```cmd
elmahio import --apiKey API_KEY --logId LOG_ID --type w3c --filename u_extend1.log --dateFrom 2023-03-13T10:14 --dateTo 2023-03-13T10:16
```