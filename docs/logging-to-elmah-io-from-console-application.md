---
title: Logging to elmah.io from C# and console applications
description: Set up logging from any C# and/or console application with the elmah.io client. In case you don't want to include a logging framework, use this.
---

# Logging to elmah.io from C\# and console applications

[TOC]

If you need to log to elmah.io and you cannot use one of the integrations we provide, logging through the [Elmah.Io.Client](https://www.nuget.org/packages/Elmah.Io.Client/) NuGet package is dead simple.

To start logging, install the `Elmah.Io.Client` package:

```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.Client
```
```powershell fct_label="Package Manager"
Install-Package Elmah.Io.Client
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.Client" Version="5.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.Client
```

Create a new `ElmahioAPI`:

```csharp
var logger = ElmahioAPI.Create("API_KEY");
```

Replace `API_KEY` with your API key ([Where is my API key?](where-is-my-api-key.md)).

The elmah.io client supports logging in different log levels much like other logging frameworks for .NET:

```csharp
var logId = new Guid("LOG_ID");
logger.Messages.Fatal(logId, new ApplicationException("A fatal exception"), "Fatal message");
logger.Messages.Error(logId, new ApplicationException("An exception"), "Error message");
logger.Messages.Warning(logId, "A warning");
logger.Messages.Information(logId, "An info message");
logger.Messages.Debug(logId, "A debug message");
logger.Messages.Verbose(logId, "A verbose message");
```

Replace ```LOG_ID``` with your log ID from elmah.io ([Where is my log ID?](where-is-my-log-id.md)).

To have 100% control of how the message is logged to elmah.io, you can use the `CreateAndNotify`-method:

```csharp
logger.Messages.CreateAndNotify(logId, new CreateMessage
{
    Title = "Hello World",
    Application = "Elmah.Io.Client sample",
    Detail = "This is a long description of the error. Maybe even a stack trace",
    Severity = Severity.Error.ToString(),
    Data = new List<Item>
    {
        new Item {Key = "Username", Value = "Man in black"}
    },
    Form = new List<Item>
    {
        new Item {Key = "Password", Value = "SecretPassword"},
        new Item {Key = "pwd", Value = "Other secret value"},
        new Item {Key = "visible form item", Value = "With a value"}
    }
});
```

## Structured logging

Like the integrations for Serilog, NLog and, Microsoft.Extensions.Logging, the elmah.io client supports structured logging:

```csharp
logger.Messages.CreateAndNotify(logId, new CreateMessage
{
    Title = "Thomas says Hello",
    TitleTemplate = "{User} says Hello",
});
```

## Breadcrumbs

You can log one or more breadcrumbs as part of a log message. Breadcrumbs indicate steps happening just before a log message (typically an error). Breadcrumbs are supported through the `Breadcrumbs` property on the `CreateMessage` class:

```csharp
logger.Messages.CreateAndNotify(logId, new CreateMessage
{
    Title = "Oh no, an error happened",
    Severity = "Error",
    Breadcrumbs = new List<Breadcrumb>
    {
        new Breadcrumb
        {
            DateTime = DateTime.UtcNow.AddSeconds(-10),
            Action = "Navigation",
            Message = "Navigate from / to /signin",
            Severity = "Information"
        },
        new Breadcrumb
        {
            DateTime = DateTime.UtcNow.AddSeconds(-3),
            Action = "Click",
            Message = "#submit",
            Severity = "Information"
        },
        new Breadcrumb
        {
            DateTime = DateTime.UtcNow.AddSeconds(-2),
            Action = "Submit",
            Message = "#loginform",
            Severity = "Information"
        },
        new Breadcrumb
        {
            DateTime = DateTime.UtcNow.AddSeconds(-1),
            Action = "Request",
            Message = "/save",
            Severity = "Information"
        }
    }
});
```

Breadcrumbs will be ordered by the `DateTime` field on the elmah.io API why the order you add them to the `Breadcrumbs` property isn't that important. Be aware that only the 10 most recent breadcrumbs and breadcrumbs with a date less than or equal to the logged message are stored.

In the example above, only `Information` breadcrumbs are added. The `Severity` property accepts the same severities as on the log message itself.

## Events

The elmah.io client supports a range of different events to help carry out common tasks.

### OnMessage

To get a callback every time a new message is being logged to elmah.io, you can implement the `OnMessage` event. This is a great chance to decorate all log messages with a specific property or similar.

```csharp
logger.Messages.OnMessage += (sender, eventArgs) =>
{
    eventArgs.Message.Version = "1.0.0";
};
```

#### Include source code

You can use the `OnMessage` event to include source code to log messages. This will require a stack trace in the `Detail` property with filenames and line numbers in it.

There are multiple ways of including source code to log messages. In short, you will need to install the `Elmah.Io.Client.Extensions.SourceCode` NuGet package and call the `WithSourceCodeFromPdb` method in the `OnMessage` event handler:

```csharp
logger.Messages.OnMessage += (sender, eventArgs) =>
{
    eventArgs.Message.WithSourceCodeFromPdb();
};
```

Check out [How to include source code in log messages](how-to-include-source-code-in-log-messages.md) for additional requirements to make source code show up on elmah.io.

!!! note
    Including source code on log messages is available in the `Elmah.Io.Client` v4 package and forward.

### OnMessageFail

Logging to elmah.io can fail if the network connection is down, if elmah.io experiences downtime, or something third. To make sure you log an error elsewhere if this happens, you can implement the `OnMessageFail` event:

```csharp
logger.Messages.OnMessageFail += (sender, eventArgs) =>
{
    System.Console.Error.WriteLine("Error when logging to elmah.io");
};
```

### OnMessageFilter

!!! note
    The `OnMessageFilter` event require `Elmah.Io.Client` version `5.2.*` or newer.

One or more filters can be set up to easily ignore messages based on their messages. To set up a filter, implement the `OnMessageFilter` event like this:

```csharp
logger.Messages.OnMessageFilter += (sender, eventArgs) =>
{
    eventArgs.Filter =
        eventArgs.Message.Title.Contains(
            "foo", StringComparison.InvariantCultureIgnoreCase);
};
```

This example sets the `Filter` property to a boolean indicating if the message should be filtered/ignored or not. In case the log message contains the word 'foo', the message will be ignored.

## Bulk upload

If logging many messages to elmah.io, bulk upload can be a way to optimize performance. The elmah.io client supports bulk upload using the `CreateBulkAndNotify`-method:

```csharp
logger.Messages.CreateBulkAndNotify(logId, new[]
{
    new CreateMessage { Title = "This is a bulk message" },
    new CreateMessage { Title = "This is another bulk message" },
}.ToList());
```

## Options

The elmah.io client contains a set of default options that you can override.

### Proxy

To log through a HTTP proxy, set the `WebProxy` property:

```csharp
var logger = ElmahioAPI.Create("API_KEY", new ElmahIoOptions
{
    WebProxy = new WebProxy("localhost", 8888)
});
```

A proxy needs to be specified as part of the options sent to the `ElmahioAPI.Create` method to make sure that the underlying `HttpClient` is properly initialized.

### Obfuscate form values

When logging POSTs with form values, you don't want users' passwords and similar logged to elmah.io. The elmah.io client automatically filters form keys named `password` and `pwd`. Using the `FormKeysToObfuscate` you can tell the client to obfuscate additional form entries:

```csharp
var logger = ElmahioAPI.Create("API_KEY");
logger.Options.FormKeysToObfuscate.Add("secret_key");
```

## Full example

Here's a full example of how to catch all exceptions in a console application and log as many information as possible to elmah.io:

```csharp
class Program
{
    private static IElmahioAPI elmahIo;

    static void Main(string[] args)
    {
        try
        {
            AppDomain.CurrentDomain.UnhandledException +=
                (sender, e) => LogException(e.ExceptionObject as Exception);

            // Run some code
        }
        catch (Exception e)
        {
            LogException(e);
        }
    }

    private static void LogException(Exception e)
    {
        if (elmahIo == null) elmahIo = ElmahioAPI.Create("API_KEY");

        var baseException = e?.GetBaseException();

        elmahIo.Messages.CreateAndNotify(new Guid("LOG_ID"), new CreateMessage
        {
            Data = e?.ToDataList(),
            Detail = e?.ToString(),
            Hostname = Environment.MachineName,
            Severity = Severity.Error.ToString(),
            Source = baseException?.Source,
            Title = baseException?.Message ?? "An error happened",
            Type = baseException?.GetType().FullName,
            User = Environment.UserName,
        });
    }
}
```

The code will catch all exceptions both from the `catch` block and exceptions reported through the `UnhandledException` event. You'd normally create a shared instance of the elmah.io logger, but in this example, the program will exit just after logging the exception why it doesn't matter. The `UnhandledException` event is implemented as a last resort to log any errors not triggering the `catch` block. This can be exceptions in background threads, async code, and similar.
