[![Build status](https://github.com/elmahio/Elmah.Io.Functions/workflows/build/badge.svg)](https://github.com/elmahio/Elmah.Io.Functions/actions?query=workflow%3Abuild)
[![NuGet](https://img.shields.io/nuget/v/Elmah.Io.Functions.svg)](https://www.nuget.org/packages/Elmah.Io.Functions)
[![Samples](https://img.shields.io/badge/samples-3-brightgreen.svg)](https://github.com/elmahio/Elmah.Io.Functions/tree/master/samples)

# Logging to elmah.io from Azure Functions

[TOC]

Logging errors from [Azure Functions](https://elmah.io/features/azure-functions/), requires only a few lines of code. We've created a client specifically for Azure Functions.

Install the newest `Elmah.Io.Functions` package in your Azure Functions project:

```powershell fct_label="Package Manager"
Install-Package Elmah.Io.Functions
```
```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.Functions
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.Functions" Version="3.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.Functions
```

The elmah.io integration for Azure Functions uses function filters and dependency injection part of the `Microsoft.Azure.Functions.Extensions` package. To configure elmah.io, open the `Startup.cs` file or create a new one if not already there. In the `Configure`-method, add the elmah.io options and exception filter:

```csharp
using Elmah.Io.Functions;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;

[assembly: FunctionsStartup(typeof(MyFunction.Startup))]

namespace MyFunction
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            var config = new ConfigurationBuilder()
                .AddJsonFile("local.settings.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables()
                .Build();

            builder.Services.Configure<ElmahIoFunctionOptions>(o =>
            {
                o.ApiKey = config["apiKey"];
                o.LogId = new Guid(config["logId"]);
            });

            builder.Services.AddSingleton<IFunctionFilter, ElmahIoExceptionFilter>();
        }
    }
}
```

Notice how API key and log ID are configured through the `ElmahIoFunctionOptions` object. In the last line of the `Configure`-method, the `ElmahIoExceptionFilter`-filter is configured. This filter will automatically catch any exception caused by your filter and log it to elmah.io.

A quick comment about the obsolete warning showed when using the package. Microsoft marked `IFunctionFilter` as obsolete. Not because it will be removed, but because they may change the way attributes work in functions in the future. For now, you can suppress this warning with the following code:

```csharp
#pragma warning disable CS0618 // Type or member is obsolete
builder.Services.AddSingleton<IFunctionFilter, ElmahIoExceptionFilter>();
#pragma warning restore CS0618 // Type or member is obsolete
```

In your settings, add the `apiKey`and `logId` variables:

```json
{
  // ...
  "Values": {
    // ...
    "apiKey": "API_KEY",
    "logId": "LOG_ID"
  }
}
```

Replace `API_KEY` with your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and `LOG_ID` ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)) with your log ID. When running on Azure or similar, you can overwrite `apiKey` and `logId` with application settings or environment variables as already thoroughly documented on Microsoft's documentation.

## Application name

To set the application name on all errors, set the `Application` property during initialization:

```csharp
builder.Services.Configure<ElmahIoFunctionOptions>(o =>
{
    o.ApiKey = config["apiKey"];
    o.LogId = new Guid(config["logId"]);
    o.Application = "MyFunction";
});
```

## Message hooks

`Elmah.Io.Functions` provide message hooks similar to the integrations with ASP.NET and ASP.NET Core.

### Decorating log messages

To include additional information on log messages, you can use the `OnMessage` event when initializing `ElmahIoFunctionOptions`:

```csharp
builder.Services.Configure<ElmahIoFunctionOptions>(o =>
{
    o.ApiKey = config["apiKey"];
    o.LogId = new Guid(config["logId"]);
    o.OnMessage = msg =>
    {
        msg.Version = "1.0.0";
    };
});
```

The example above includes a version number on all errors.

### Handle errors

To handle any errors happening while processing a log message, you can use the `OnError` event when initializing `ElmahIoFunctionOptions`:

```csharp
builder.Services.Configure<ElmahIoFunctionOptions>(o =>
{
    o.ApiKey = config["apiKey"];
    o.LogId = new Guid(config["logId"]);
    o.OnError = (msg, ex) =>
    {
        logger.LogError(ex, ex.Message);
    };
});
```

The example above logs any errors during communication with elmah.io to a local log.

### Error filtering

To ignore specific errors based on their content, you can use the `OnFilter` event when initializing `ElmahIoFunctionOptions`:

```csharp
builder.Services.Configure<ElmahIoFunctionOptions>(o =>
{
    o.ApiKey = config["apiKey"];
    o.LogId = new Guid(config["logId"]);
    o.OnFilter = msg =>
    {
        return msg.Method == "GET";
    };
});
```

The example above ignores any errors generated during an HTTP `GET` request.

## Logging through ILogger

Azure Functions can log through Microsoft.Extensions.Logging (MEL) too. By adding the filter, as shown above, all uncaught exceptions are automatically logged. But when configuring your Function app to log through MEL, custom messages can be logged through the `ILogger` interface. Furthermore, you will get detailed log messages from within the Function host. To set this up, install the `Elmah.Io.Extensions.Logging` NuGet package:

```powershell fct_label="Package Manager"
Install-Package Elmah.Io.Extensions.Logging
```
```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.Extensions.Logging
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.Extensions.Logging" Version="3.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.Extensions.Logging
```

Then extend your `Startup.cs` file like this:

```csharp
builder.Services.AddLogging(logging =>
{
    logging.AddElmahIo(o =>
    {
        o.ApiKey = config["apiKey"];
        o.LogId = new Guid(config["logId"]);
    });
    logging.AddFilter<ElmahIoLoggerProvider>(null, LogLevel.Warning);
});
```

In the example, only warning messages and above are logged to elmah.io. You can remove the filter or set another log level if you want to log more.

Either pass an `ILogger` to your function method:

```csharp
public class MyFunction
{
    public static void Run([TimerTrigger("...")]TimerInfo myTimer, ILogger log)
    {
        log.LogWarning("This is a warning");
    }
}
```

Or inject an `ILoggerFactory` and create a logger as part of the constructor:

```csharp
public class MyFunction
{
    private readonly ILogger log;

    public Function1(ILoggerFactory loggerFactory)
    {
        this.log = loggerFactory.CreateLogger("MyFunction");
    }

    public void Run([TimerTrigger("...")]TimerInfo myTimer)
    {
        log.LogWarning("This is a warning");
    }
}
```

## Azure Functions v1

The recent `Elmah.Io.Functions` package no longer supports Azure Functions v1. You can still log from Functions v1 using an older version of the package. Check out [Logging to elmah.io from Azure WebJobs](/logging-to-elmah-io-from-azure-webjobs/) for details. The guide is for Azure WebJobs but installation for Functions v1 is identical.