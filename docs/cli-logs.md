---
title: List, clear, import, export and more log commands
description: Learn about the various CLI commands related to logs. Automate tasks like clearing or exporting log messages.
---

# Logs commands

The `logs` command provide a range of sub-commands related to logs.

<div class="guides-boxes row">
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="#dataloader" title="Dataloader">
            <div class="guide-box">
                <div class="guide-image">
                  <i class="fas fa-file-import"></i>
                </div>
                <div class="guide-title">Dataloader</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="#clear" title="Clear">
            <div class="guide-box">
                <div class="guide-image">
                  <i class="fas fa-trash"></i>
                </div>
                <div class="guide-title">Clear</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="#list" title="List">
            <div class="guide-box">
                <div class="guide-image">
                  <i class="fas fa-list"></i>
                </div>
                <div class="guide-title">List</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="#get" title="Get">
            <div class="guide-box">
                <div class="guide-image">
                  <i class="fas fa-file"></i>
                </div>
                <div class="guide-title">Get</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="#export" title="Export">
            <div class="guide-box">
                <div class="guide-image">
                  <i class="fas fa-file-export"></i>
                </div>
                <div class="guide-title">Export</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="#import" title="Import">
            <div class="guide-box">
                <div class="guide-image">
                  <i class="fas fa-file-import"></i>
                </div>
                <div class="guide-title">Import</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="#sourcemap" title="Sourcemap">
            <div class="guide-box">
                <div class="guide-image">
                  <i class="fab fa-js"></i>
                </div>
                <div class="guide-title">Sourcemap</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="#tail" title="Tail">
            <div class="guide-box">
                <div class="guide-image">
                  <i class="fas fa-eye"></i>
                </div>
                <div class="guide-title">Tail</div>
            </div>
        </a>
    </div>
</div>

## Dataloader

The `dataloader` command loads 50 log messages into a specified log.

**Usage**

```cmd
> elmahio logs dataloader --help

Description:
  Load 50 log messages into the specified log

Usage:
  elmahio logs dataloader [options]

Options:
  --apiKey <apiKey>           An API key with permission to execute the command. If omitted,
                              the key stored via 'elmahio login' is used.
  --logId <logId> (REQUIRED)  The log ID of the log to import messages into
  --proxyHost <proxyHost>     A hostname or IP for a proxy to use to call elmah.io
  --proxyPort <proxyPort>     A port number for a proxy to use to call elmah.io
  -?, -h, --help              Show help and usage information
```

**Example**

```cmd
elmahio logs dataloader --logId LOG_ID
```

## Clear

The `clear` command is used to delete one or more messages from a log.

!!! note
    Be aware that clearing a log does not reset the monthly counter towards log messages included in your current plan. The `clear` command is intended for cleanup in non-expired log messages you no longer need.

**Usage**

```cmd
> elmahio logs clear --help

Description:
  Delete one or more messages from a log

Usage:
  elmahio logs clear [options]

Options:
  --apiKey <apiKey>           An API key with permission to execute the command. If omitted,
                              the key stored via 'elmahio login' is used.
  --logId <logId> (REQUIRED)  The log ID of the log to clear messages
  --query <query> (REQUIRED)  Clear messages matching this query (use * for all messages)
  --from <from>               Optional date and time to clear messages from
  --to <to>                   Optional date and time to clear messages to
  --proxyHost <proxyHost>     A hostname or IP for a proxy to use to call elmah.io
  --proxyPort <proxyPort>     A port number for a proxy to use to call elmah.io
  -?, -h, --help              Show help and usage information
```

**Simple example:**

```cmd
elmahio logs clear --logId LOG_ID --query "statusCode:404"
```

**Full example:**

```cmd
elmahio logs clear --apiKey API_KEY --logId LOG_ID --query "statusCode:404" --from 2022-05-17 --to 2022-05-18
```

## List

The `list` command is used to return a list of logs available through an API key.

**Usage**

```cmd
> elmahio logs list --help

Description:
  List all logs accessible with the API key

Usage:
  elmahio logs list [options]

Options:
  --apiKey <apiKey>            An API key with permission to execute the command. If omitted,
                               the key stored via 'elmahio login' is used.
  --environment <environment>  Filter logs by environment name
  --json                       Output results as JSON instead of formatted text
  --proxyHost <proxyHost>      A hostname or IP for a proxy to use to call elmah.io
  --proxyPort <proxyPort>      A port number for a proxy to use to call elmah.io
  -?, -h, --help               Show help and usage information
```

**Simple example:**

```cmd
elmahio logs list
```

**Full example:**

```cmd
elmahio logs list --apiKey API_KEY --environment Production
```

## Get

The `get` command is used to get details for a specific log.

**Usage**

```cmd
> elmahio logs get --help

Description:
  Get details for a specific log

Usage:
  elmahio logs get [options]

Options:
  --apiKey <apiKey>           An API key with permission to execute the command. If omitted,
                              the key stored via 'elmahio login' is used.
  --logId <logId> (REQUIRED)  The ID of the log to fetch details for
  --json                      Output results as JSON instead of formatted text
  --proxyHost <proxyHost>     A hostname or IP for a proxy to use to call elmah.io
  --proxyPort <proxyPort>     A port number for a proxy to use to call elmah.io
  -?, -h, --help              Show help and usage information
```

**Example:**

```cmd
elmahio logs get --logId LOG_ID
```

## Export

The `export` command is used to export one or more log messages from a log to JSON.

**Usage**

```cmd
> elmahio logs export --help

Description:
  Export log messages from a specified log

Usage:
  elmahio logs export [options]

Options:
  --apiKey <apiKey>                 An API key with permission to execute the command. If omitted,
                                    the key stored via 'elmahio login' is used.
  --logId <logId> (REQUIRED)        The ID of the log to export messages from
  --dateFrom <dateFrom> (REQUIRED)  Defines the Date from which the logs start.
                                    Ex. " --dateFrom 2026-04-01"
  --dateTo <dateTo> (REQUIRED)      Defines the Date from which the logs end.
                                    Ex. " --dateTo 2026-04-08"
  --filename <filename>             Defines the path and filename of the file to export to.
                                    Ex.
                                      " --filename C:\myDirectory\myFile.json" or
                                      " --filename myFile.csv"
  --query <query>                   Defines the query that is passed to the API [default: *]
  --includeHeaders                  Include headers, cookies, etc. in output
                                    (will take longer to export)
  --format <Csv|Json>               The format to export [default: Json]
  --proxyHost <proxyHost>           A hostname or IP for a proxy to use to call elmah.io
  --proxyPort <proxyPort>           A port number for a proxy to use to call elmah.io
  -?, -h, --help                    Show help and usage information
```

**Simple JSON example:**

```cmd
elmahio logs export --logId LOG_ID --dateFrom 2026-08-21 --dateTo 2026-08-28
```

**Simple CSV example:**

```cmd
elmahio logs export --logId LOG_ID --dateFrom 2026-08-21 --dateTo 2026-08-28 --format Csv
```

**Full example:**

```cmd
elmahio logs export --apiKey API_KEY --logId LOG_ID --dateFrom 2026-08-21 --dateTo 2026-08-28 --filename c:\temp\elmahio.json --query "statusCode: 404" --includeHeaders --format Json
```

## Import

The `import` command is used to import log messages from IIS log files and W3C Extended log files to an elmah.io log.

**Usage**

```cmd
> elmahio logs import --help

Description:
  Import log messages to a specified log

Usage:
  elmahio logs import [options]

Options:
  --apiKey <apiKey>                 An API key with permission to execute the command. If omitted,
                                    the key stored via 'elmahio login' is used.
  --logId <logId> (REQUIRED)        The ID of the log to import messages to
  --type <iis|w3c> (REQUIRED)       The type of log file to import. Use 'w3c' for W3C Extended Log
                                    File Format and 'iis' for IIS Log File Format
  --filename <filename> (REQUIRED)  Defines the path and filename of the file to import from.
                                    Ex. " --filename C:\myDirectory\log.txt"
  --dateFrom <dateFrom>             Defines the Date from which the logs start.
                                    Ex. " --dateFrom 2026-04-01"
  --dateTo <dateTo>                 Defines the Date from which the logs end.
                                    Ex. " --dateTo 2026-04-08"
  --proxyHost <proxyHost>           A hostname or IP for a proxy to use to call elmah.io
  --proxyPort <proxyPort>           A port number for a proxy to use to call elmah.io
  -?, -h, --help                    Show help and usage information
```

**IIS example:**

```cmd
elmahio logs import --logId LOG_ID --type iis --filename u_inetsv1.log --dateFrom 2026-03-13T10:14 --dateTo 2026-03-13T10:16
```

**w3c example:**

```cmd
elmahio logs import --logId LOG_ID --type w3c --filename u_extend1.log --dateFrom 2026-03-13T10:14 --dateTo 2026-03-13T10:16
```

## Sourcemap

The `sourcemap` command is used to upload source maps and minified JavaScript files to elmah.io.

**Usage**

```cmd
> elmahio logs sourcemap --help

Description:
  Upload a source map and minified JavaScript

Usage:
  elmahio logs sourcemap [options]

Options:
  --apiKey <apiKey>                                     An API key with permission to execute the command. If omitted,
                                                        the key stored via 'elmahio login' is used.
  --logId <logId> (REQUIRED)                            The ID of the log which should contain the minified JavaScript
                                                        and source map
  --path <path> (REQUIRED)                              An URL to the online minified JavaScript file
  --sourceMap <sourceMap> (REQUIRED)                    The source map file. Only files with an extension of .map and
                                                        content type of application/json will be accepted
  --minifiedJavaScript <minifiedJavaScript> (REQUIRED)  The minified JavaScript file. Only files with an extension of
                                                        .js and content type of text/javascript will be accepted
  --proxyHost <proxyHost>                               A hostname or IP for a proxy to use to call elmah.io
  --proxyPort <proxyPort>                               A port number for a proxy to use to call elmah.io
  -?, -h, --help                                        Show help and usage information
```

**Example:**

```cmd
elmahio logs sourcemap --logId LOG_ID --path "/bundles/sharedbundle.min.js" --sourceMap "c:\path\to\sharedbundle.map" --minifiedJavaScript "c:\path\to\sharedbundle.min.js"
```

## Tail

The `tail` command is used to tail log messages in a specified log.

**Usage**

```cmd
> elmahio logs tail --help

Description:
  Tail log messages from a specified log

Usage:
  elmahio logs tail [options]

Options:
  --apiKey <apiKey>           An API key with permission to execute the command. If omitted,
                              the key stored via 'elmahio login' is used.
  --logId <logId> (REQUIRED)  The ID of the log to send the log message to
  --proxyHost <proxyHost>     A hostname or IP for a proxy to use to call elmah.io
  --proxyPort <proxyPort>     A port number for a proxy to use to call elmah.io
  -?, -h, --help              Show help and usage information
```

**Example:**

```cmd
elmahio tail --logId LOG_ID
```