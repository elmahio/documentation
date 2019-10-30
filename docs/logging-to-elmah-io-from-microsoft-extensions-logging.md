[![Build status](https://ci.appveyor.com/api/projects/status/eiw9tpstm67t02v6?svg=true)](https://ci.appveyor.com/project/ThomasArdal/elmah-io-extensions-logging)
[![NuGet](https://img.shields.io/nuget/v/Elmah.Io.Extensions.Logging.svg)](https://www.nuget.org/packages/Elmah.Io.Extensions.Logging)
[![Samples](https://img.shields.io/badge/samples-5-brightgreen.svg)](https://github.com/elmahio/Elmah.Io.Extensions.Logging/tree/master/samples)

# Logging to elmah.io from Microsoft.Extensions.Logging

[TOC]

[Microsoft.Extensions.Logging](https://github.com/aspnet/Logging) is a common logging abstraction from Microsoft, much like log4net and Serilog. Microsoft.Extensions.Logging started as a new logging mechanism for ASP.NET Core but now acts as a logging framework for all sorts of project types.

Start by installing the [Elmah.Io.Extensions.Logging](https://www.nuget.org/packages/Elmah.Io.Extensions.Logging/) package:

```powershell
Install-Package Elmah.Io.Extensions.Logging
```

Locate your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and log ID. The two values will be referenced as `API_KEY` and `LOG_ID` ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)) in the following.

## Logging from ASP.NET Core

In the `Program.cs` file, add a new `using` statement:

```csharp
using Elmah.Io.Extensions.Logging;
```

Then call the `ConfigureLogging`-method and configure elmah.io like shown here:

```csharp
WebHost.CreateDefaultBuilder(args)
    .UseStartup<Startup>()
    .ConfigureLogging((ctx, logging) =>
    {
        logging.AddElmahIo(options =>
        {
            options.ApiKey = "API_KEY";
            options.LogId = new Guid("LOG_ID");
        });
        logging.AddFilter<ElmahIoLoggerProvider>(null, LogLevel.Warning);
    })
    .Build();
```
By calling, the `AddFilter`-method, you ensure that only warnings and up are logged to elmah.io.

The API key and log ID can also be configured in `appsettings.json`:

```json
{
  ...
  "ElmahIo": {
    "ApiKey": "API_KEY",
    "LogId": "LOG_ID"
  }
}
```

Then configure the section and use the `AddElmahIo` overload (without any parameters):

```csharp
WebHost.CreateDefaultBuilder(args)
    .UseStartup<Startup>()
    .ConfigureLogging((ctx, logging) =>
    {
        logging.Services.Configure<ElmahIoProviderOptions>(ctx.Configuration.GetSection("ElmahIo"));
        logging.AddElmahIo();
    })
    .Build();
```

Start logging messages by injecting an `ILogger` in your controllers:

```csharp
public class HomeController : Controller
{
    private readonly ILogger _logger;

    public HomeController(ILogger logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        _logger.LogWarning("Request to index");
        return View();
    }
}
```

### Include HTTP context

A common use case for using Microsoft.Extensions.Logging is part of an ASP.NET Core project. When combining the two, you would expect the log messages to contain relevant information from the HTTP context (like URL, status code, cookies, etc.). This is not the case out of the box, since Microsoft.Extensions.Logging doesn't know which project type that includes it.

To add HTTP context properties to log messages when logging from ASP.NET Core, install the `Elmah.Io.AspNetCore.ExtensionsLogging` NuGet package:

```ps
Install-Package Elmah.Io.AspNetCore.ExtensionsLogging -IncludePrerelease
```

Then call the `UseElmahIoExtensionsLogging` method in the `Configure` method in the `Startup.cs` file:

```csharp
public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
{
    ... // Exception handling middleware
    app.UseElmahIoExtensionsLogging();
    ... // UseMvc etc.
}
```

> Logging HTTP context requires `Elmah.Io.Extensions.Logging` version `3.6.x` or newer.

## Logging custom properties

`Elmah.Io.Extensions.Logging` support Microsoft.Extensions.Logging scopes from version `3.6.x`. In short, scopes are a way to decorate your log messages like enrichers in Serilog and context in NLog and log4net. By including properties to a scope, these properties automatically go into the *Data* tab on elmah.io.

To define a new scope, wrap your logging code in a `using`:

```csharp
using (_logger.BeginScope(new Dictionary<string, object> { { "UserId", 42 } }))
{
    _logger.LogInformation("Someone says hello");
}
```

In the example above, the `UserId` key will be added on the *Data* tab with the value of `42`.

Like the other logging framework integrations, `Elmah.Io.Extensions.Logging` supports a range of known keys that can be used to insert value in the correct fields on the elmah.io UI.

```csharp
using (_logger.BeginScope(new Dictionary<string, object>
    { { "statuscode", 500 }, { "method", "GET" } }))
{
    _logger.LogError("Request to {url} caused an error", "/profile");
}
```

In this example, a log message with the template `Request to {url} caused an error` is logged. The use of the variable names `statuscode`, `method`, and `url` will fill in those values in the correct fields on elmah.io. For a reference of all possible property names, check out the property names on [CreateMessage](https://github.com/elmahio/Elmah.Io.Client/blob/master/src/Elmah.Io.Client/Models/CreateMessage.cs).

An alternative is to use the `OnMessage` action. As an example, we'll add a version number to all messages:

```csharp
logging
    .AddElmahIo(options =>
    {
        ...
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
    services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
    services.AddSingleton<IConfigureOptions<ElmahIoProviderOptions>, DecorateElmahIoMessages>();

    ...
}
```

## Options

### appsettings.json configuration

Some of the configuration for Elmah.Io.Extensions.Logging can be done through the `appsettings.json` file when using ASP.NET Core 2.x. To configure the minimum log level, add a new logger named `ElmahIo` to the settings file:

```json
{
  "Logging": {
    ...
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
WebHost.CreateDefaultBuilder(args)
    .UseStartup<Startup>()
    .ConfigureLogging((ctx, logging) =>
    {
        logging.AddConfiguration(ctx.Configuration.GetSection("Logging"));
        ...
    })
    .Build();
```

### Filtering log messages

As default, the elmah.io logger for Microsoft.Extensions.Logging only logs warnings, errors, and fatals. The rationale behind this is that we build an error management system and doesn't do much to support millions of debug messages from your code. Sometimes you may want to log non-exception messages, though. To do so, use filters in Microsoft.Extensions.Logging.

To log everything from log level `Information` and up, do the following:

Inside the `ConfigureLogging`-method in `Startup.cs`, change the minimum level:

```csharp
WebHost.CreateDefaultBuilder(args)
    .UseStartup<Startup>()
    .ConfigureLogging((ctx, logging) =>
    {
        ...
        logging.AddFilter<ElmahIoLoggerProvider>(null, LogLevel.Information);
    })
    .Build();
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
WebHost.CreateDefaultBuilder(args)
    .UseStartup<Startup>()
    .ConfigureLogging((ctx, logging) =>
    {
        logging.AddElmahIo(options =>
        {
            ...
            options.WebProxy = new WebProxy("localhost", 8000);
        });
    })
    .Build();
```

In this example, the elmah.io client routes all traffic through `http://localhost:8000`.

## Logging from a console application

Create a new `LoggerFactory`:

```csharp
var factory = new LoggerFactory();
```

Configure Microsoft.Extensions.Logging to use elmah.io:

```csharp
factory.AddElmahIo("API_KEY", new Guid("LOG_ID"));
```

Finally, create a new logger and start logging exceptions:

```csharp
var logger = factory.CreateLogger("MyLog");
logger.LogError(1, ex, "Unexpected error");
```

## Troubleshooting

**`x` message(s) dropped because of queue size limit**

If you see this message in your log, it means that you are logging a large number of messages to elmah.io through Microsoft.Extensions.Logging within a short period of time. Either turn down the volume using filters:

```csharp
logging.AddElmahIo(options => { ... });
logging.AddFilter<ElmahIoLoggerProvider>(null, LogLevel.Warning);
```

or increase the queue size of `Elmah.Io.Extensions.Logging`:

```csharp
logging.AddElmahIo(options =>
{
    ...
    options.BackgroundQueueSize = 5000;
});
```