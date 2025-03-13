---
title: Exporting log messages from the CLI
description: Learn about the export CLI command and how you can use it to export messages from elmah.io. Back up a log, import messages in another tool, etc.
---

# Exporting log messages from the CLI

The `export` command is used to export one or more log messages from a log to JSON.

## Usage

```cmd
> elmahio export --help

Description:
  Export log messages from a specified log

Usage:
  elmahio export [options]

Options:
  --apiKey <apiKey> (REQUIRED)      An API key with permission to execute the command
  --logId <logId> (REQUIRED)        The ID of the log to export messages from
  --dateFrom <dateFrom> (REQUIRED)  Defines the Date from which the logs start. Ex. " --dateFrom 2025-03-06"
  --dateTo <dateTo> (REQUIRED)      Defines the Date from which the logs end. Ex. " --dateTo 2025-03-13"
  --filename <filename>             Defines the path and filename of the file to export to. Ex. " --filename
                                    C:\myDirectory\myFile.json" or " --filename myFile.csv"
  --query <query>                   Defines the query that is passed to the API [default: *]
  --includeHeaders                  Include headers, cookies, etc. in output (will take longer to export)
  --format <Csv|Json>               The format to export [default: Json]
  --proxyHost <proxyHost>           A hostname or IP for a proxy to use to call elmah.io
  --proxyPort <proxyPort>           A port number for a proxy to use to call elmah.io
  -?, -h, --help                    Show help and usage information
```

## Examples

**Simple JSON:**

```cmd
elmahio export --apiKey API_KEY --logId LOG_ID --dateFrom 2020-08-21 --dateTo 2020-08-28
```

**Simple CSV:**

```cmd
elmahio export --apiKey API_KEY --logId LOG_ID --dateFrom 2020-08-21 --dateTo 2020-08-28 --format Csv
```

**Full:**

```cmd
elmahio export --apiKey API_KEY --logId LOG_ID --dateFrom 2020-08-21 --dateTo 2020-08-28 --filename c:\temp\elmahio.json --query "statusCode: 404" --includeHeaders --format Json
```