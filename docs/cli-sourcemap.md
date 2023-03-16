---
title: Upload source maps from the CLI
description: Learn about the sourcemap CLI command and how you can use it to upload source maps and minified JavaScript files to an elmah.io log.
---

# Upload a source map from the CLI

The `sourcemap` command is used to upload source maps and minified JavaScript files to elmah.io.

## Usage

```cmd
> elmahio sourcemap --help

Description:
  Upload a source map and minified JavaScript

Usage:
  elmahio sourcemap [options]

Options:
  --apiKey <apiKey> (REQUIRED)                          An API key with permission to execute the command
  --logId <logId> (REQUIRED)                            The ID of the log which should contain the minified JavaScript
                                                        and source map
  --path <path> (REQUIRED)                              An URL to the online minified JavaScript file
  --sourceMap <sourceMap> (REQUIRED)                    The source map file. Only files with an extension of .map and
                                                        content type of application/json will be accepted
  --minifiedJavaScript <minifiedJavaScript> (REQUIRED)  The minified JavaScript file. Only files with an extension of
                                                        .js and content type of text/javascript will be accepted
  -?, -h, --help                                        Show help and usage information
```

## Examples

```cmd
sourcemap --apiKey API_KEY --logId LOG_ID --path "/bundles/sharedbundle.min.js" --sourceMap "c:\path\to\sharedbundle.map" --minifiedJavaScript "c:\path\to\sharedbundle.min.js"
```