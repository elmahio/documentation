---
title: Logging to elmah.io from Microsoft.Extensions.Logging
description: Learn about how to send structured logs from Microsoft.Extensions.Logging and ASP.NET Core to elmah.io. Add cloud logging with a NuGet package.
---

[![Build status](https://github.com/elmahio/Elmah.Io.Extensions.Logging/workflows/build/badge.svg)](https://github.com/elmahio/Elmah.Io.Extensions.Logging/actions?query=workflow%3Abuild)
[![NuGet](https://img.shields.io/nuget/v/Elmah.Io.Extensions.Logging.svg)](https://www.nuget.org/packages/Elmah.Io.Extensions.Logging)
[![Samples](https://img.shields.io/badge/samples-11-brightgreen.svg)](https://github.com/elmahio/Elmah.Io.Extensions.Logging/tree/main/samples)

# Logging to elmah.io from Microsoft.Extensions.Logging

[TOC]

Microsoft.Extensions.Logging is both a logging framework itself and a logging abstraction on top of other logging frameworks like log4net and Serilog.

Start by installing the [Elmah.Io.Extensions.Logging](https://www.nuget.org/packages/Elmah.Io.Extensions.Logging/) package:

```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.Extensions.Logging
```
```powershell fct_label="Package Manager"
Install-Package Elmah.Io.Extensions.Logging
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.Extensions.Logging" Version="5.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.Extensions.Logging
```

Locate your API key ([Where is my API key?](where-is-my-api-key.md)) and log ID. The two values will be referenced as `API_KEY` and `LOG_ID` ([Where is my log ID?](where-is-my-log-id.md)) in the following.

## Logging from ASP.NET Core

In the `Program.cs` file, add a new `using` statement:

```csharp
using Elmah.Io.Extensions.Logging;
```

Then call the `AddElmahIo`-method as shown here:

```csharp
builder.Logging.AddElmahIo(options =>
{
    options.ApiKey = "API_KEY";
    options.LogId = new Guid("LOG_ID");
});
builder.Logging.AddFilter<ElmahIoLoggerProvider>(null, LogLevel.Warning);
```

By calling, the `AddFilter`-method, you ensure that only warnings and up are logged to elmah.io.

The API key and log ID can also be configured in `appsettings.json`:

```json
{
  // ...
  "ElmahIo": {
    "ApiKey": "API_KEY",
    "LogId": "LOG_ID"
  }
}
```

To tell Microsoft.Extensions.Logging to use configuration from the `appsettings.json` file, include the following code in `Program.cs`:

```csharp
builder.Services.Configure<ElmahIoProviderOptions>(builder.Configuration.GetSection("ElmahIo"));
builder.Logging.AddConfiguration(builder.Configuration.GetSection("Logging"));
builder.Logging.AddElmahIo();
```

The first line fetches elmah.io configuration from the `ElmahIo` object in the `appsettings.json` file. The second line configures log levels in Microsoft.Extensions.Logging from the `Logging` object in `appsettings.json`. The third line adds the elmah.io logger to Microsoft.Extensions.Logging. Notice how the overload without any options object is called since options are already loaded from `appsettings.json`.

Start logging messages by injecting an `ILogger` in your controllers:

```csharp
public class HomeController : Controller
{
    private readonly ILogger<HomeController> logger;

    public HomeController(ILogger<HomeController> logger)
    {
        this.logger = logger;
    }

    public IActionResult Index()
    {
        logger.LogWarning("Request to index");
        return View();
    }
}
```

### Include HTTP context

A common use case for using Microsoft.Extensions.Logging is part of an ASP.NET Core project. When combining the two, you would expect the log messages to contain relevant information from the HTTP context (like URL, status code, cookies, etc.). This is not the case out of the box, since Microsoft.Extensions.Logging doesn't know which project type includes it.

!!! note
    Logging HTTP context requires `Elmah.Io.Extensions.Logging` version `3.6.x` or newer.

To add HTTP context properties to log messages when logging from ASP.NET Core, install the `Elmah.Io.AspNetCore.ExtensionsLogging` NuGet package:

```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.AspNetCore.ExtensionsLogging
```
```powershell fct_label="Package Manager"
Install-Package Elmah.Io.AspNetCore.ExtensionsLogging
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.AspNetCore.ExtensionsLogging" Version="5.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.AspNetCore.ExtensionsLogging
```

Then call the `UseElmahIoExtensionsLogging` method in the `Program.cs` file:

```csharp
// ... Exception handling middleware
app.UseElmahIoExtensionsLogging();
// ... UseMvc etc.
```

It's important to call the `UseElmahIoExtensionsLogging` method **after** any calls to `UseElmahIo`, `UseAuthentication`, and other exception handling middleware but **before** `UseMvc` and `UseEndpoints`. If you experience logged errors without the HTTP context, try moving the `UseElmahIoExtensionsLogging` method as the first call in the `Configure` method.

## Logging from a console application

Choose the right framework version:

<div class="tabbable-responsive">
<div class="tabbable">
<ul class="nav nav-tabs" role="tablist">
    <li role="presentation" class="nav-item"><a class="nav-link active" href="#netcore6" aria-controls="home" role="tab" data-bs-toggle="tab" data-bs-tab="net6">.NET >= 6</a></li>
    <li role="presentation" class="nav-item"><a class="nav-link" href="#netcore3" aria-controls="home" role="tab" data-bs-toggle="tab" data-bs-tab="net3">.NET Core 3</a></li>
</ul>
</div>
</div>

<div class="tab-content tab-content-tabbable" markdown="1">
<div role="tabpanel" class="tab-pane active" id="netcore6" markdown="1">
Configure logging to elmah.io using a new or existing `ServiceCollection`:

```csharp
var services = new ServiceCollection();
services.AddLogging(logging => logging.AddElmahIo(options =>
{
    options.ApiKey = "API_KEY";
    options.LogId = new Guid("LOG_ID");
}));
```

Get a reference to the `LoggerFactory`:

```csharp
using var serviceProvider = services.BuildServiceProvider();
var loggerFactory = serviceProvider.GetService<ILoggerFactory>();
```
</div>
<div role="tabpanel" class="tab-pane" id="netcore3" markdown="1">
Create a new `LoggerFactory` and configure it to use elmah.io:

```csharp
using var loggerFactory = LoggerFactory.Create(builder => builder
    .AddElmahIo(options =>
    {
        options.ApiKey = "API_KEY";
        options.LogId = new Guid("LOG_ID");
    }));
```
</div>
</div>

Adding the `using` keyword is important to let elmah.io store messages before exiting the application.

Finally, create a new logger and start logging exceptions:

```csharp
var logger = factory.CreateLogger("MyLog");
logger.LogError(ex, "Unexpected error");
```

## Logging custom properties

`Elmah.Io.Extensions.Logging` support Microsoft.Extensions.Logging scopes from version `3.6.x`. In short, scopes are a way to decorate your log messages like enrichers in Serilog and context in NLog and log4net. By including properties in a scope, these properties automatically go into the *Data* tab on elmah.io.

To define a new scope, wrap your logging code in a `using`:

```csharp
using (logger.BeginScope(new Dictionary<string, object> { { "UserId", 42 } }))
{
    logger.LogInformation("Someone says hello");
}
```

In the example above, the `UserId` key will be added on the *Data* tab with the value of `42`.

Like the other logging framework integrations, `Elmah.Io.Extensions.Logging` supports a range of known keys that can be used to insert value in the correct fields on the elmah.io UI.

```csharp
using (logger.BeginScope(new Dictionary<string, object>
    { { "statuscode", 500 }, { "method", "GET" } }))
{
    logger.LogError("Request to {url} caused an error", "/profile");
}
```

In this example, a log message with the template `Request to {url} caused an error` to be logged. The use of the variable names `statuscode`, `method`, and `url` will fill in those values in the correct fields on elmah.io. For a reference of all possible property names, check out the property names on [CreateMessage](https://github.com/elmahio/Elmah.Io.Client/blob/main/src/Elmah.Io.Client/ElmahioClient.cs#L4371C26-L4371C39).

An alternative is to use the `OnMessage` action. As an example, we'll add a version number to all messages:

```csharp
logging
    .AddElmahIo(options =>
    {
        // ...
        options.OnMessage = msg =>
        {
            msg.Version = "2.0.0";
        };
    });
```

You can even access the current HTTP context in the `OnMessage` action. To do so, start by creating a new class named `DecorateElmahIoMessages`:

```csharp
public class DecorateElmahIoMessages : IConfigureOptions<ElmahIoProviderOptions>
{
    private readonly IHttpContextAccessor httpContextAccessor;

    public DecorateElmahIoMessages(IHttpContextAccessor httpContextAccessor)
    {
        this.httpContextAccessor = httpContextAccessor;
    }

    public void Configure(ElmahIoProviderOptions options)
    {
        options.OnMessage = msg =>
        {
            var context = httpContextAccessor.HttpContext;
            if (context == null) return;
            msg.User = context.User?.Identity?.Name;
        };
    }
}
```

Then register `IHttpContextAccessor` and the new class in the `Program.cs` file:

```csharp
builder.Services.AddHttpContextAccessor();
builder.Services.AddSingleton<IConfigureOptions<ElmahIoProviderOptions>, DecorateElmahIoMessages>();
```

### Setting category

elmah.io provide a field named *Category* to better group log messages by class name, namespace, or similar. Category maps to Microsoft.Extensions.Logging field of the same name. The category field is automatically set when using a typed logger:

```csharp
ILogger<MyType> logger = ...;
logger.LogInformation("This is an information message with category");
```

The category can be overwritten using a property named `category` on either the log message or a new scope:

```csharp
using (logger.BeginScope(new Dictionary<string, object> { { "category", "The category" } }))
{
    logger.LogInformation("This is an information message with category");
}
```

## Logging with LoggerMessage

.NET 6 introduced the `LoggerMessage` attribute that uses source generators for highly usable and performant log statements. `Elmah.Io.Extensions.Logging` fully supports log messages sent through logger messages.

```csharp
[LoggerMessage(Level = LogLevel.Information, Message = "Created {UserId}")]
private static partial void LogUserCreated(ILogger logger, int userId);

// ...

LogUserCreated(logger, 42);
```

This will log a message saying `Created 42` to elmah.io. Remember that the class including the `LogUserCreated` method needs to be declared as `partial` as well.

.NET 8 extends this even further by offering a new `LogProperties` attribute:

```csharp
[LoggerMessage(Level = LogLevel.Information, Message = "Created user")]
private static partial void LogUserCreated(ILogger logger, [LogProperties]User user);

// ...

LogUserCreated(logger, new User
{
    Firstname = "Tyrion",
    Lastname = "Lannister"
});
```

By adding the `LogProperties` attribute to the `User` parameter, a log message saying `Created user` will be sent to elmah.io. In addition, the *Data* tab on the extended log message details will show the keys `user.Firstname` and `user.Lastname` with the values from the `User` object provided for the `LogUserCreated` method.

## Include source code

You can use the `OnMessage` action already described to include source code to log messages. This will require a stack trace in the `Detail` property with filenames and line numbers in it.

There are multiple ways of including source code to log messages. In short, you will need to install the `Elmah.Io.Client.Extensions.SourceCode` NuGet package and call the `WithSourceCodeFromPdb` method in the `OnMessage` action:

```csharp
logging
    .AddElmahIo(options =>
    {
        // ...
        options.OnMessage = msg =>
        {
            msg.WithSourceCodeFromPdb();
        };
    });
```

Check out [How to include source code in log messages](how-to-include-source-code-in-log-messages.md) for additional requirements to make source code show up on elmah.io.

!!! note
    Including source code on log messages is available in the `Elmah.Io.Client` v4 package and forward.

## Options

### Setting application name

If logging to the same log from multiple applications it is a good idea to set unique application names from each app. This will let you search and filter errors on the elmah.io UI. To set an application name, add the following code to the options:

```csharp
logging.AddElmahIo(options =>
{
    // ...
    options.Application = "MyApp";
});
```

The application name can also be configured through `appsettings.json`:

```json
{
  // ...
  "ElmahIo": {
    // ...
    "Application": "MyApp"
  }
}
```

### appsettings.json configuration

Some of the configuration for Elmah.Io.Extensions.Logging can be done through the `appsettings.json` file when using ASP.NET Core 2.x or above. To configure the minimum log level, add a new logger named `ElmahIo` to the settings file:

```json
{
  "Logging": {
    // ...
    "ElmahIo": {
      "LogLevel": {
        "Default": "Warning"
      }
    }
  }
}
```

Finally, tell the logger to look for this information, by adding a bit of code to `Program.cs`:

```csharp
builder.Logging.AddConfiguration(builder.Configuration.GetSection("Logging"));
```

### Filtering log messages

As default, the elmah.io logger for Microsoft.Extensions.Logging only logs warnings, errors, and fatals. The rationale behind this is that we build an error management system and doesn't do much to support millions of debug messages from your code. Sometimes you may want to log non-exception messages, though. To do so, use filters in Microsoft.Extensions.Logging.

To log everything from log level `Information` and up, do the following:

Inside `Program.cs` change the minimum level:

```csharp
builder.Logging.AddFilter<ElmahIoLoggerProvider>(null, LogLevel.Information);
```

In the code sample, every log message with a log level of `Information` and up will be logged to elmah.io.

### Logging through a proxy

!!! note
    Proxy configuration requires `3.5.49` or newer.

You can log through a proxy using options:

```csharp
logging.AddElmahIo(options =>
{
    // ...
    options.WebProxy = new WebProxy("localhost", 8000);
});
```

In this example, the elmah.io client routes all traffic through `http://localhost:8000`.

## Microsoft.Extensions.Logging Troubleshooting

Here are some things to try out if logging from Microsoft.Extensions.Logging to elmah.io doesn't work:

- Run the `diagnose` command with the [elmah.io CLI](cli-overview.md) as shown here: [Diagnose potential problems with an elmah.io installation](cli-diagnose.md).

**`x` message(s) dropped because of queue size limit**

If you see this message in your log, it means that you are logging a large number of messages to elmah.io through Microsoft.Extensions.Logging within a short period of time. Either turn down the volume using filters:

```csharp
logging.AddElmahIo(options => { /*...*/ });
logging.AddFilter<ElmahIoLoggerProvider>(null, LogLevel.Warning);
```

or increase the queue size of `Elmah.Io.Extensions.Logging`:

```csharp
logging.AddElmahIo(options =>
{
    // ...
    options.BackgroundQueueSize = 5000;
});
```

**Uncaught errors are logged twice**

If you have both `Elmah.Io.Extensions.Logging` and `Elmah.Io.AspNetCore` installed, you may see a pattern of uncaught errors being logged twice. This is because a range of middleware from Microsoft (and others) log uncaught exceptions through `ILogger`. When you have `Elmah.Io.AspNetCore` installed you typically don't want other pieces of middleware to log the same error but with fewer details.

To ignore duplicate errors you need to figure out which middleware class that trigger the logging and in which namespace it is located. One or more of the following ignore filters can be added to your `Program.cs` file:

```csharp
logging.AddFilter<ElmahIoLoggerProvider>(
    "Microsoft.AspNetCore.Diagnostics.ExceptionHandlerMiddleware", LogLevel.None);
logging.AddFilter<ElmahIoLoggerProvider>(
    "Microsoft.AspNetCore.Diagnostics.DeveloperExceptionPageMiddleware", LogLevel.None);
logging.AddFilter<ElmahIoLoggerProvider>(
    "Microsoft.AspNetCore.Server.IIS.Core", LogLevel.None);
```

Be aware that these lines will ignore all messages from the specified class or namespace. To ignore specific errors you can implement the `OnFilter` action as shown previously in this document. Ignoring uncaught errors from IIS would look like this:

```csharp
options.OnFilter = msg =>
{
    return msg.TitleTemplate == "Connection ID \"{ConnectionId}\", Request ID \"{TraceIdentifier}\": An unhandled exception was thrown by the application.";
};
```