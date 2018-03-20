[![Build status](https://ci.appveyor.com/api/projects/status/eiw9tpstm67t02v6?svg=true)](https://ci.appveyor.com/project/ThomasArdal/elmah-io-extensions-logging)
[![NuGet](https://img.shields.io/nuget/v/Elmah.Io.Extensions.Logging.svg)](https://www.nuget.org/packages/Elmah.Io.Extensions.Logging)
[![Samples](https://img.shields.io/badge/samples-5-brightgreen.svg)](https://github.com/elmahio/Elmah.Io.Extensions.Logging/tree/master/samples)

# Logging from Microsoft.Extensions.Logging

[Microsoft.Extensions.Logging](https://github.com/aspnet/Logging) is a common logging abstraction from Microsoft, much like log4net and Serilog. Microsoft.Extensions.Logging started as a new logging mechanism for ASP.NET Core, but now acts as a logging framework for all sorts of project types.

Start by installing the [Elmah.Io.Extensions.Logging](https://www.nuget.org/packages/Elmah.Io.Extensions.Logging/) package:

```powershell
Install-Package Elmah.Io.Extensions.Logging
```

Locate your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and log ID. The two values will be referenced as `API_KEY` and `LOG_ID` ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)) in the following.

## Logging from ASP.NET Core

  <ul class="nav nav-tabs" role="tablist">
    <li role="presentation" class="active"><a href="#setup2" aria-controls="home" role="tab" data-toggle="tab">ASP.NET Core 2.x</a></li>
    <li role="presentation"><a href="#setup1" aria-controls="profile" role="tab" data-toggle="tab">ASP.NET Core 1.x</a></li>
  </ul>

  <div class="tab-content">
    <div role="tabpanel" class="tab-pane active" id="setup2">
In the `Program.cs` file, call the `ConfigureLogging`-method and configure elmah.io like shown here:
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
</div>
    <div role="tabpanel" class="tab-pane" id="setup1">
Call `AddElmahIo` in the `Configure`-method in `Startup.cs`:

```csharp
public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory fac)
{
    ...
    fac.AddElmahIo("API_KEY", new Guid("LOG_ID"));
    ...
}
```
</div>
  </div>

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

## Filtering log messages

As default, the elmah.io logger for Microsoft.Extensions.Logging only logs warnings, errors and fatals. The rationale behind this is that we build an error management system and really doesn't do much to support millions of debug messages from your code. Sometimes you may want to log non-exception messages, though. To do so, use filters in Microsoft.Extensions.Logging.

To log everything from log level `Information` and up, do the following:

  <ul class="nav nav-tabs" role="tablist">
    <li role="presentation" class="active"><a href="#home" aria-controls="home" role="tab" data-toggle="tab">ASP.NET Core 2.x</a></li>
    <li role="presentation"><a href="#profile" aria-controls="profile" role="tab" data-toggle="tab">ASP.NET Core 1.x</a></li>
  </ul>

  <div class="tab-content">
    <div role="tabpanel" class="tab-pane active" id="home">
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
</div>
    <div role="tabpanel" class="tab-pane" id="profile">
Use the `AddElmahIo` overload which accepts a filter:
```csharp
factory.AddElmahIo("API_KEY", new Guid("LOG_ID"), new FilterLoggerSettings
{
    {"*", LogLevel.Information}
});
```
</div>
  </div>

In the code sample, every log message with log level of `Information` and up, will be logged to elmah.io. To log a new information message, create a logger with the `elmah.io` category and call the `LogInformation` method:

```csharp
var logger = factory.CreateLogger("elmah.io");
logger.LogInformation("This is an information message");
```

## appsettings.json configuration

Some of the configuration for Elmah.Io.Extensions.Logging, can be done through the `appsettings.json` file when using ASP.NET Core 2.x. To configure the minimum log level, add a new logger named `ElmahIo` to the settings file:

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