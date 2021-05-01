# Logging to elmah.io from C\#

[TOC]

If you need to log to elmah.io and you cannot use one of the integration we provide, logging through the [Elmah.Io.Client](https://www.nuget.org/packages/Elmah.Io.Client/) NuGet package is dead simple.

To start logging, install the `Elmah.Io.Client` package:

```powershell fct_label="Package Manager"
Install-Package Elmah.Io.Client
```
```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.Client
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.Client" Version="3.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.Client
```

Create a new `ElmahioAPI`:

```csharp
var logger = ElmahioAPI.Create("API_KEY");
```

Replace `API_KEY` with your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)).

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

Replace ```LOG_ID``` with your log ID from elmah.io ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)).

To have 100% control of how the message is logged to elmah.io, you can use the `CreateAndNotify`-method:

```csharp
logger.Messages.CreateAndNotify(logId, new CreateMessage
{
    Title = "Hello World",
    Application = "Elmah.Io.Client sample",
    Detail = "This is a long description of the error. Maybe even a stacktrace",
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

> Breadcrumbs is currently in prerelease and only supported on `Elmah.Io.Client` version `3.11.14-pre` or newer.

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
            Action = "navigation",
            Message = "Navigate from / to /signin",
            Severity = "Information"
        },
        new Breadcrumb
        {
            DateTime = DateTime.UtcNow.AddSeconds(-2),
            Action = "click",
            Message = "#submit",
            Severity = "Information"
        },
        new Breadcrumb
        {
            DateTime = DateTime.UtcNow.AddSeconds(-1),
            Action = "submit",
            Message = "#loginform",
            Severity = "Information"
        },
        new Breadcrumb
        {
            Action = "error",
            Message = "Oh no, an error happened",
            Severity = "Error"
        },
    }
});
```

## Events

The elmah.io client supports to different events: `OnMessage` and `OnMessageFail`.

### OnMessage

To get a callback every time a new message is being logged to elmah.io, you can implement the `OnMessage` event. This is a great chance to decorate all log messages with a specific property or similar.

```csharp
logger.Messages.OnMessage += (sender, eventArgs) =>
{
    eventArgs.Message.Version = "1.0.0";
};
```

### OnMessageFail

Logging to elmah.io can fail if the network connection is down, if elmah.io experience downtime, or something third. To make sure you log an error elsewhere if this happen, you can implement the `OnMessageFail` event:

```csharp
logger.Messages.OnMessageFail += (sender, eventArgs) =>
{
    System.Console.Error.WriteLine("Error when logging to elmah.io");
};
```

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
var logger = ElmahioAPI.Create("API_KEY");
logger.Options.WebProxy = new WebProxy("localhost", 8888);
```

### Opfuscate form values

When logging POSTs with form values, you don't want users password and similar logged to elmah.io. The elmah.io client automatically filter form keys named `password` and `pwd`. Using the `FormKeysToObfuscate` you can tell the client to opfuscate additional form entries:

```csharp
var logger = ElmahioAPI.Create("API_KEY");
logger.Options.FormKeysToObfuscate.Add("secret_key");
```