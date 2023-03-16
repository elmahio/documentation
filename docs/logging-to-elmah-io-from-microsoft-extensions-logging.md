---
title: Logging to elmah.io from Microsoft.Extensions.Logging
description: Learn about how to send structured logs from Microsoft.Extensions.Logging and ASP.NET Core to elmah.io. Add cloud logging with a NuGet package.
---

[![Build status](https://github.com/elmahio/Elmah.Io.Extensions.Logging/workflows/build/badge.svg)](https://github.com/elmahio/Elmah.Io.Extensions.Logging/actions?query=workflow%3Abuild)
[![NuGet](https://img.shields.io/nuget/v/Elmah.Io.Extensions.Logging.svg)](https://www.nuget.org/packages/Elmah.Io.Extensions.Logging)
[![Samples](https://img.shields.io/badge/samples-8-brightgreen.svg)](https://github.com/elmahio/Elmah.Io.Extensions.Logging/tree/main/samples)

# Logging to elmah.io from Microsoft.Extensions.Logging

[TOC]

Microsoft.Extensions.Logging is a common logging abstraction from Microsoft, much like log4net and Serilog. Microsoft.Extensions.Logging started as a new logging mechanism for ASP.NET Core but now acts as a logging framework for all sorts of project types.

Start by installing the [Elmah.Io.Extensions.Logging](https://www.nuget.org/packages/Elmah.Io.Extensions.Logging/) package:

```powershell fct_label="Package Manager"
Install-Package Elmah.Io.Extensions.Logging
```
```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.Extensions.Logging
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.Extensions.Logging" Version="4.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.Extensions.Logging
```

Locate your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and log ID. The two values will be referenced as `API_KEY` and `LOG_ID` ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)) in the following.

## Logging from ASP.NET Core

In the `Program.cs` file, add a new `using` statement:

```csharp
using Elmah.Io.Extensions.Logging;
```

Then call the `ConfigureLogging`-method and configure elmah.io like shown here:

```csharp
public static IHostBuilder CreateHostBuilder(string[] args) =>
    Host.CreateDefaultBuilder(args)
        .ConfigureWebHostDefaults(webBuilder =>
        {
            webBuilder.UseStartup<Startup>();
            webBuilder.ConfigureLogging((ctx, logging) =>
            {
                logging.AddElmahIo(options =>
                {
                    options.ApiKey = "API_KEY";
                    options.LogId = new Guid("LOG_ID");
                });
                logging.AddFilter<ElmahIoLoggerProvider>(null, LogLevel.Warning);
            });
        });
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

Then configure the section and use the `AddElmahIo` overload (without any parameters):

```csharp
Host.CreateDefaultBuilder(args)
    .ConfigureWebHostDefaults(webBuilder =>
    {
        webBuilder.UseStartup<Startup>();
        webBuilder.ConfigureLogging((ctx, logging) =>
        {
            logging.Services.Configure<ElmahIoProviderOptions>(ctx.Configuration.GetSection("ElmahIo"));
            logging.AddElmahIo();
        });
    });
```

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

For an example of configuring elmah.io with ASP.NET Core minimal APIs, check out [this sample](https://github.com/elmahio/Elmah.Io.Extensions.Logging/tree/main/samples/Elmah.Io.Extensions.Logging.AspNetCore60).

### Include HTTP context

A common use case for using Microsoft.Extensions.Logging is part of an ASP.NET Core project. When combining the two, you would expect the log messages to contain relevant information from the HTTP context (like URL, status code, cookies, etc.). This is not the case out of the box, since Microsoft.Extensions.Logging doesn't know which project type includes it.

> Logging HTTP context requires `Elmah.Io.Extensions.Logging` version `3.6.x` or newer.

To add HTTP context properties to log messages when logging from ASP.NET Core, install the `Elmah.Io.AspNetCore.ExtensionsLogging` NuGet package:

```powershell fct_label="Package Manager"
Install-Package Elmah.Io.AspNetCore.ExtensionsLogging
```
```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.AspNetCore.ExtensionsLogging
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.AspNetCore.ExtensionsLogging" Version="4.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.AspNetCore.ExtensionsLogging
```

Then call the `UseElmahIoExtensionsLogging` method in the `Configure` method in the `Startup.cs` file:

```csharp
public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
{
    // ... Exception handling middleware
    app.UseElmahIoExtensionsLogging();
    // ... UseMvc etc.
}
```

It's important to call the `UseElmahIoExtensionsLogging` method **after** any calls to `UseElmahIo`, `UseAuthentication`, and other exception handling middleware but **before** `UseMvc` and `UseEndpoints`. If you experience logged errors without the HTTP context, try moving the `UseElmahIoExtensionsLogging` method as the first call in the `Configure` method.

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

In this example, a log message with the template `Request to {url} caused an error` to be logged. The use of the variable names `statuscode`, `method`, and `url` will fill in those values in the correct fields on elmah.io. For a reference of all possible property names, check out the property names on [CreateMessage](https://github.com/elmahio/Elmah.Io.Client/blob/main/src/Elmah.Io.Client/ElmahioClient.cs#L3617).

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

Then register `IHttpContextAccessor` and the new class in the `ConfigureServices` method in the `Startup.cs` file:

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddHttpContextAccessor();
    services.AddSingleton<IConfigureOptions<ElmahIoProviderOptions>, DecorateElmahIoMessages>();
    // ...
}
```

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

Check out [How to include source code in log messages](/how-to-include-source-code-in-log-messages/) for additional requirements to make source code show up on elmah.io.

> Including source code on log messages is available in the `Elmah.Io.Client` v4 package and forward.

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

Finally, tell the logger to look for this information, by adding a bit of code to the `ConfigureLogging`-method:

```csharp
webBuilder.ConfigureLogging((ctx, logging) =>
{
    logging.AddConfiguration(ctx.Configuration.GetSection("Logging"));
    // ...
});
```

### Filtering log messages

As default, the elmah.io logger for Microsoft.Extensions.Logging only logs warnings, errors, and fatals. The rationale behind this is that we build an error management system and doesn't do much to support millions of debug messages from your code. Sometimes you may want to log non-exception messages, though. To do so, use filters in Microsoft.Extensions.Logging.

To log everything from log level `Information` and up, do the following:

Inside the `ConfigureLogging`-method in `Startup.cs`, change the minimum level:

```csharp
webBuilder.ConfigureLogging((ctx, logging) =>
{
    // ...
    logging.AddFilter<ElmahIoLoggerProvider>(null, LogLevel.Information);
});
```

In the code sample, every log message with a log level of `Information` and up will be logged to elmah.io. To log a new information message, create a logger with the `elmah.io` category, and call the `LogInformation` method:

```csharp
var logger = factory.CreateLogger("elmah.io");
logger.LogInformation("This is an information message");
```

### Logging through a proxy

> Proxy configuration requires `3.5.49` or newer.

You can log through a proxy using options:

```csharp
webBuilder.ConfigureLogging((ctx, logging) =>
{
    logging.AddElmahIo(options =>
    {
        // ...
        options.WebProxy = new WebProxy("localhost", 8000);
    });
});
```

In this example, the elmah.io client routes all traffic through `http://localhost:8000`.

## Logging from a console application

Choose the right framework version:

<div class="tabbable-responsive">
<div class="tabbable">
<ul class="nav nav-tabs" role="tablist">
    <li role="presentation" class="nav-item"><a class="nav-link active" href="#netcore3" aria-controls="home" role="tab" data-toggle="tab">.NET Core 3 and newer</a></li>
    <li role="presentation" class="nav-item"><a class="nav-link" href="#netcore2" aria-controls="home" role="tab" data-toggle="tab">.NET Core 2</a></li>
</ul>
</div>
</div>

<div class="tab-content tab-content-tabbable" markdown="1">
<div role="tabpanel" class="tab-pane active" id="netcore3" markdown="1">
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

<div role="tabpanel" class="tab-pane" id="netcore2" markdown="1">
Create a new `LoggerFactory`:

```csharp
using var factory = new LoggerFactory();
```

Configure Microsoft.Extensions.Logging to use elmah.io:

```csharp
factory.AddElmahIo("API_KEY", new Guid("LOG_ID"));
```
</div>
</div>

Adding the `using` keyword is important to let elmah.io store messages before exiting the application.

Finally, create a new logger and start logging exceptions:

```csharp
var logger = factory.CreateLogger("MyLog");
logger.LogError(1, ex, "Unexpected error");
```

## Troubleshooting

Here are some things to try out if logging from Microsoft.Extensions.Logging to elmah.io doesn't work:

- Run the `diagnose` command with the [elmah.io CLI](https://docs.elmah.io/cli-overview/) as shown here: [Diagnose potential problems with an elmah.io installation](https://docs.elmah.io/cli-diagnose/).

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
logging.AddFilter<ElmahIoLoggerProvider>("Microsoft.AspNetCore.Diagnostics.ExceptionHandlerMiddleware", LogLevel.None);
logging.AddFilter<ElmahIoLoggerProvider>("Microsoft.AspNetCore.Diagnostics.DeveloperExceptionPageMiddleware", LogLevel.None);
logging.AddFilter<ElmahIoLoggerProvider>("Microsoft.AspNetCore.Server.IIS.Core", LogLevel.None);
```

Be aware that these lines will ignore all messages from the specified class or namespace. To ignore specific errors you can implement the `OnFilter` action as shown previously in this document. Ignoring uncaught errors from IIS would look like this:

```csharp
options.OnFilter = msg =>
{
    return msg.TitleTemplate == "Connection ID \"{ConnectionId}\", Request ID \"{TraceIdentifier}\": An unhandled exception was thrown by the application.";
};
```