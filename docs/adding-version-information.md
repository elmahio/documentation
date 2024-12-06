---
title: Adding Version Information
description: Being able to distinguish one version from the other is important. elmah.io supports versioning as described in this document.
---

# Adding Version Information

[TOC]

Almost every piece of software has some sort of version. Whether it's a nice-looking [SemVer](https://semver.org/) string or a simple timestamp, distinguishing one version from the other is important. elmah.io supports sending version information from your application in every message logged in two ways:

1. By adding the version manually (as explained in this document).
2. By using the [Deployment Tracking](https://elmah.io/features/deployment-tracking/) feature (as explained in [Set Up Deployment Tracking](setup-deployment-tracking.md)).

## Version Numbers on the UI
Let's start by looking at how version numbers are represented in the elmah.io UI. Every message contains a version property as illustrated below:

![Error Details with Version Number](images/version-details-v2.png){: .image-400 }

The error is logged by an application with version number 1.0.0. This way, you will be able to see which version of your software logged each message.

Having the version number on the message opens up some interesting search possibilities. Imagine that you want to search for every message logged by 1.0.* versions of your software, including release candidates, etc. Simply search in the search box like this:

![Search for Versions](images/version-search-v2.png)

The example above finds every message logged from 1.0.0, 1.0.0-rc1, 1.0.1, etc.

## Adding Version Numbers

How you choose to represent version numbers in your system is really up to you. elmah.io doesn't require SemVer, even though we strongly recommend you use it. Version is a simple string in our [API](https://elmah.io/api/v3/), which means that you can send anything from SemVer to a stringified timestamp.

Adding a version number to every message logged in elmah.io is as easy as 1-2-3. If you're using our API, there's a property named `version` where you can put the version of your application. Chances are that you are using one of the integrations for ASP.NET Core, log4net, or Serilog. There are multiple ways to send a version number to elmah.io.

### ASP.NET Core

Adding version information to all errors logged from `Elmah.Io.AspNetCore` can be achieved using the `OnMessage` action when initializing logging to elmah.io:

```csharp
builder.Services.AddElmahIo(options =>
{
    // ...

    options.OnMessage = msg =>
    {
        msg.Version = "1.2.3";
    };
});
```

### ASP.NET

You probably want to attach the same version number on every message logged in elmah.io. The easiest way to achieve that is to create a global event handler for the OnMessage event, which is triggered every time the elmah.io client logs a message to elmah.io:

```csharp
Elmah.ErrorLog.GetDefault(null); // Forces creation of logger client
var logger = ErrorLog.Client;
logger.OnMessage += (sender, args) =>
{
    args.Message.Version = "1.2.3";
}
```

In the example, the message sent off to elmah.io is decorated with the version number `1.2.3` You will need to replace this with the value of an app setting, the assembly info, or whatever strategy you've used to make the version number available to your code.

If you're logging errors to elmah.io in catch blocks, logging the version number can be done using a similar approach to the above:

```csharp
try
{
    CallSomeBusinessLogic(inputValue);
}
catch (Exception e)
{
    e.Data.Add("X-ELMAHIO-VERSION", "1.2.3");
    ErrorSignal.FromCurrentContext().Raise(e);
}
```

In this case, the code at this point doesn't know anything about elmah.io. Luckily, there's an alternative to the Version property, by putting a custom element in the Data dictionary on Exception. The exact name of the key must be `X-ELMAHIO-VERSION` for elmah.io to interpret this as the version number.

### Microsoft.Extensions.Logging

When using the `Elmah.Io.Extensions.Logging` package there are multiple ways of enriching log messages with version information. If you want the same version number on all log messages you can use the `OnMessage` action:

```csharp
builder.Logging.AddElmahIo(options =>
{
    // ...

    options.OnMessage = msg =>
    {
        msg.Version = "1.2.3";
    };
});
```

As an alternative, you can push a version property on individual log messages using either a structured property:

```csharp
logger.LogInformation("Message from {version}", "1.2.3");
```

Or using scopes:

```csharp
using (logger.BeginScope(new { Version = "1.2.3" }))
{
    logger.LogInformation("A message inside a logging scope");
}
```

### log4net

log4net supports the concept of customer properties in various ways. Since log4net properties are converted to custom properties in elmah.io, the easiest way to add a version number of every message logged through log4net is by configuring a global property somewhere in your initialization code:

```csharp
log4net.GlobalContext.Properties["version"] = "1.2.3";
```

log4net supports custom properties in the context of a log call as well. To do that, put the `version` property in the `ThreadContext` before logging to log4net:

```csharp
log4net.ThreadContext.Properties["version"] = "1.2.3";
log4net.Error("This is an error message");
```

### NLog

NLog supports structured properties as well as various context objects. To set a version number on all log messages you can include the following code after initializing NLog:

```csharp
GlobalDiagnosticsContext.Set("version", "1.2.3");
```

If the elmah.io NLog target is initialized from C# code you can also use the `OnMessage` action:

```csharp
var elmahIoTarget = new ElmahIoTarget();
// ...
elmahIoTarget.OnMessage = msg =>
{
    msg.Version = "1.2.3";
};
```

To set a version number on a single log message, you can include it as a property:

```csharp
log.Info("Message from {version}", "1.2.3");
```

### Serilog

Serilog can decorate all log messages using enrichers:

```csharp
var logger =
    new LoggerConfiguration()
        .Enrich.WithProperty("version", "1.2.3")
        .Enrich.FromLogContext()
        .WriteTo.ElmahIo(new ElmahIoSinkOptions("API_KEY", new Guid("LOG_ID")))
        .CreateLogger();
```

You can also enrich a single log message with a version number using a structured property:

```csharp
Log.Information("Meesage from {version}", "1.2.3");
```

Or using the `LogContext`:

```csharp
using (LogContext.PushProperty("version", "1.2.3"))
{
    Log.Error("An error message");
}
```