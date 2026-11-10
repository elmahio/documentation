---
title: How to stay below the message size limit
description: Learn about the maximum message size in the elmah.io API and how to trim large messages with OnMessage before they are sent.
---

# How to stay below the message size limit

[TOC]

The elmah.io API limits how large a request can be. Normally you will never notice, since a typical log message is a few kilobytes. But a long stack trace, a large request body stored as custom data, or a serialized object in a log message can add up. When a message goes over the limit, the API rejects it and the message is never stored.

## The limits

| What you send | Maximum size | What happens when exceeded |
|---|---|---|
| A single message | 256 kb | The API responds with status code `413` and the message is not stored. |
| A bulk request | 10 MB | The API responds with status code `413` and none of the messages in the request are stored. |
| A message inside a bulk request | 256 kb | The message gets status code `413` in its entry of the response body. The other messages in the request are stored as normal. |

The limits apply to the size of the JSON body sent to the API, not to a single field. Everything in the message counts: `message`, `detail`, `data`, `cookies`, `serverVariables`, `form`, `queryString`, and so on. The size is measured in bytes. Characters outside the ASCII range take more than one byte in UTF-8, so a string of 100,000 characters can be larger than 100 kb.

Most integrations (Serilog, NLog, Microsoft.Extensions.Logging, and others) send messages in batches using the bulk endpoint. A batch of messages that is each below 256 kb can still go over 10 MB if the batch is large enough. The default batch size is 50, which is rarely a problem, but you can [lower it](#lower-the-batch-size) if you log large messages.

## Find out which messages are too large

If a message is rejected by the API, the client calls the `OnError` action (or event) if you have set one up. Make sure to log those errors somewhere other than elmah.io, since logging a failed message back to elmah.io would fail in the same way. Look for status code `413` in the error.

If you are in doubt about the size of a message, serialize it and check the length of the result:

```csharp
var json = System.Text.Json.JsonSerializer.Serialize(msg);
var bytes = System.Text.Encoding.UTF8.GetByteCount(json);
```

You can run this in the `OnMessage` action described below and write the size to a local log while you investigate.

## Trim messages with OnMessage

All the elmah.io integrations for .NET have an `OnMessage` action or event, which is called just before a message is sent to the API. This is the place to shorten the fields that tend to grow too large. The field that causes problems most often is `Detail`, which contains the stack trace and, in some integrations, additional text from the exception.

Start by creating a small extension method that shortens a string:

```csharp
public static class StringExtensions
{
    public static string TrimTo(this string s, int characters)
    {
        if (string.IsNullOrWhiteSpace(s)) return s;

        return s.Length > characters ? s[..characters] : s;
    }
}
```

Then call it for the fields you want to limit. The following snippet is a good starting point, and it works the same way in all integrations. Only the way you hook into `OnMessage` differs:

```csharp
msg.Detail = msg.Detail.TrimTo(50000);
msg.Message = msg.Message.TrimTo(10000);
```

The numbers are examples. Pick values that leave room for the other fields. 50,000 characters of `Detail` is typically more than you will ever read, and even in the worst case of 4 bytes per character it is well below 256 kb.

!!! note
    Trimming the end of a stack trace keeps the exception type and the topmost frames, which are the most important part in most cases.

### ASP.NET Core

```csharp
builder.Services.AddElmahIo(options =>
{
    // ...
    options.OnMessage = msg =>
    {
        msg.Detail = msg.Detail.TrimTo(50000);
    };
});
```

If you configure `ElmahIoOptions` through `Configure<ElmahIoOptions>`, set `OnMessage` the same way inside that action. See [Logging to elmah.io from ASP.NET Core](logging-to-elmah-io-from-aspnet-core.md) for details.

### Microsoft.Extensions.Logging

```csharp
builder.Logging.AddElmahIo(options =>
{
    // ...
    options.OnMessage = msg =>
    {
        msg.Detail = msg.Detail.TrimTo(50000);
    };
});
```

### Azure Functions

The in-process package, `Elmah.Io.Functions`, uses `ElmahIoFunctionOptions`:

```csharp
builder.Services.Configure<ElmahIoFunctionOptions>(o =>
{
    o.ApiKey = config["apiKey"];
    o.LogId = new Guid(config["logId"]);
    o.OnMessage = msg =>
    {
        msg.Detail = msg.Detail.TrimTo(50000);
    };
});
```

The isolated worker package, `Elmah.Io.Functions.Isolated`, sets `OnMessage` in the options passed to `AddElmahIo`:

```csharp
.AddElmahIo(options =>
{
    // ...
    options.OnMessage = msg =>
    {
        msg.Detail = msg.Detail.TrimTo(50000);
    };
});
```

See [Logging to elmah.io from Azure Functions](logging-to-elmah-io-from-azure-functions.md) and [Logging to elmah.io from isolated Azure Functions](logging-to-elmah-io-from-isolated-azure-functions.md) for details.

### Serilog

```csharp
Log.Logger =
    new LoggerConfiguration()
        .WriteTo.ElmahIo(new ElmahIoSinkOptions("API_KEY", new Guid("LOG_ID"))
        {
            OnMessage = msg =>
            {
                msg.Detail = msg.Detail.TrimTo(50000);
            }
        })
        .CreateLogger();
```

With Serilog, large messages often come from destructuring a big object into a property. Properties end up in `msg.Data`, so you may want to trim those as well (see [Trimming custom data](#trimming-custom-data)).

### NLog

```csharp
elmahIoTarget.OnMessage = msg =>
{
    msg.Detail = msg.Detail.TrimTo(50000);
};
```

### log4net

log4net and the console client use an event instead of an action:

```csharp
elmahIoAppender.Client.Messages.OnMessage += (sender, a) =>
{
    a.Message.Detail = a.Message.Detail.TrimTo(50000);
};
```

### Console applications and other uses of the client

```csharp
logger.Messages.OnMessage += (sender, eventArgs) =>
{
    eventArgs.Message.Detail = eventArgs.Message.Detail.TrimTo(50000);
};
```

## Trimming custom data

Custom data, form values, cookies, query string, and server variables are all lists of key/value pairs. Each value counts toward the size of the message. To limit these, loop through the list and trim each value:

```csharp
OnMessage = msg =>
{
    foreach (var item in msg.Data)
    {
        item.Value = item.Value.TrimTo(5000);
    }

    foreach (var item in msg.Form)
    {
        item.Value = item.Value.TrimTo(5000);
    }
}
```

Be aware that `Data`, `Form`, `Cookies`, `QueryString`, and `ServerVariables` can be `null` if nothing is set on the message. In ASP.NET Core they are initialized by the integration, but add a null check if you are unsure.

If you only want to protect against a single huge value, you can also remove the offending key altogether, like shown in the section on how to remove sensitive form data in [Logging to elmah.io from ASP.NET Core](logging-to-elmah-io-from-aspnet-core.md#remove-sensitive-form-data).

## Lower the batch size

Serilog, Microsoft.Extensions.Logging, and NLog collect log messages in a queue and send them to elmah.io in batches. The default batch size is 50 messages. With each message below 256 kb, 50 messages can add up to more than 10 MB in the worst case. Lowering the batch size makes sure that a batch stays below the limit, even if all messages in it are at the maximum size:

| Batch size | Worst case (all messages 256 kb) |
|---|---|
| 50 (default) | 12.5 MB |
| 25 | 6.25 MB |
| 10 | 2.5 MB |

A batch size of 25 is a good choice for most applications, and 10 if you log a lot of large messages. Smaller batches mean more HTTP requests to elmah.io, but only if you log more messages than the batch size within the same period. Normal applications won't notice the difference. Combine a lower batch size with [trimming](#trim-messages-with-onmessage) of the large fields to be safe.

### Serilog

```csharp
Log.Logger =
    new LoggerConfiguration()
        .WriteTo.ElmahIo(new ElmahIoSinkOptions("API_KEY", new Guid("LOG_ID"))
        {
            BatchPostingLimit = 25
        })
        .CreateLogger();
```

### Microsoft.Extensions.Logging

```csharp
builder.Logging.AddElmahIo(options =>
{
    // ...
    options.BatchPostingLimit = 25;
});
```

### NLog

```csharp
elmahIoTarget.BatchSize = 25;
```

The ASP.NET Core integration, log4net, and the Azure Functions packages send messages one at a time, so there is no batch size to lower.

## Avoid logging large objects

Trimming is a safety net. The best way to stay below the limit is to avoid putting large things in log messages in the first place:

- Don't log whole request or response bodies. Log the parts you need, like an ID or a size.
- Don't log collections with thousands of items. Log the count and a few samples.
- Be careful with the `@` operator in Serilog and message templates, which destructures an entire object graph into a property.
- If you catch an exception just to wrap it in another one with a long message, keep the message short and let the inner exception carry the details.

## Sending many messages at once

If you call the bulk endpoint yourself, split the messages into several requests when the total size gets close to 10 MB. A few hundred messages per request is a good size. Check the status code of each entry in the response body, since a single message above 256 kb is rejected with `413` while the rest of the batch is stored.

Looking to limit the number of messages instead of their size? Check out [Tips and tricks to stay below your message limit](tips-and-tricks-to-stay-below-your-message-limit.md).
