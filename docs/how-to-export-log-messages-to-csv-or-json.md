---
title: How to export log messages to CSV or JSON
description: Learn different approaches to export log messages from elmah.io to CSV or JSON and viewing them in Excel.
---

# How to export log messages to CSV or JSON

Log messages can be exported from elmah.io in a few ways. Here's a range of options, depending on how much data you need and what tools you have available.

## Exporting using the elmah.io CLI

To export multiple messages, the easiest approach is to use the [elmah.io CLI](https://docs.elmah.io/cli-overview/). If you haven't installed it already, it can be done like this:

```console
dotnet tool install --global Elmah.Io.Cli
```

Then call the `export` command:

```console
elmahio export --apiKey API_KEY --logId LOG_ID --dateFrom 2020-08-21 --dateTo 2020-08-28 --query "statusCode: 404"
```

The command exports to JSON as a default, but you can export to CSV by including the `--format Csv` parameter.

## Exporting using the elmah.io CLI

If you prefer making an HTTP request or need to integrate this in another tool that doesn't support calling the elmah.io CLI, you can export messages using the elmah.io API. To return messages, use the `/messages/` endpoint:

```
GET https://api.elmah.io/v3/messages/LOG_ID?query=statusCode:404
```

This will return matching log messages as JSON that you can further parse and process if you need it in another format.

## Exporting a single message

If you want to export a single message, you can do it directly from the elmah.io UI. On the message details view, click the *Export message* icon in the toolbar on the right and then click *Copy message*. This will export the log message details in a key/value format that can be imported in various tools.