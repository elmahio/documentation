---
title: Exporting log messages from the CLI
---

# Exporting log messages from the CLI

The `export` command is used to export one or more log messages from a log to JSON.

## Usage

```cmd
> elmahio export --help

export:
  Export log messages from a specified log

Usage:
  elmahio export [options]

Options:
  --apiKey <apikey> (REQUIRED)        An API key with permission to execute the command
  --logId <logid> (REQUIRED)          The ID of the log to export messages from
  --dateFrom <datefrom> (REQUIRED)    Defines the Date from which the logs start. Ex. " --dateFrom 2020-08-21"
  --dateTo <dateto> (REQUIRED)        Defines the Date from which the logs end. Ex. " --dateTo 2020-08-28"
  --filename <filename>               Defines the path and filename of the file to export to. Ex. " -Filename
                                      C:\myDirectory\myFile.json" [default: c:\elmah.io\client-libraries\Elmah.Io.Cli\
                                      src\Elmah.Io.Cli\bin\Debug\netcoreapp3.1\Export-637342054498905430.json]
  --query <query>                     Defines the query that is passed to the API [default: *]
  --includeHeaders                    Include headers, cookies, etc. in output (will take longer to export)
  -?, -h, --help                      Show help and usage information
```