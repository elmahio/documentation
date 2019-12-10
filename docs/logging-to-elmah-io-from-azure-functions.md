[![Build status](https://ci.appveyor.com/api/projects/status/wijhscta71muvd5b?svg=true)](https://ci.appveyor.com/project/ThomasArdal/elmah-io-functions)
[![NuGet](https://img.shields.io/nuget/v/Elmah.Io.Functions.svg)](https://www.nuget.org/packages/Elmah.Io.Functions)
[![Samples](https://img.shields.io/badge/samples-4-brightgreen.svg)](https://github.com/elmahio/Elmah.Io.Functions/tree/master/samples)

# Logging to elmah.io from Azure Functions

[TOC]

Logging errors from [Azure Functions](https://elmah.io/features/azure-functions/), requires only a few lines of code. We've created a client specifically for Azure Functions.
v1
<ul class="nav nav-tabs" role="tablist">
    <li role="presentation" class="nav-item"><a class="nav-link active" href="#v2" aria-controls="home" role="tab" data-toggle="tab">Azure Functions v2</a></li>
    <li role="presentation" class="nav-item"><a class="nav-link" href="#v1" aria-controls="home" role="tab" data-toggle="tab">Azure Functions v1</a></li>
</ul>

  <div class="tab-content">
<div role="tabpanel" class="tab-pane active" id="v2">
Install the newest `Elmah.Io.Functions` prerelease package in your Azure Functions project:

```powershell
Install-Package Elmah.Io.Functions -IncludePrerelease
```

The elmah.io integration for Azure Functions v2 uses function filters and dependency injection part of the `Microsoft.Azure.Functions.Extensions` package. To configure elmah.io, open the `Startup.cs` file or create a new one if not already there. In the `Configure`-method, add the elmah.io options and exception filter:

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

In your settings, add the `apiKey`and `logId` variables:

```json
{
  ...
  "Values": {
    ...
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

</div>
<div role="tabpanel" class="tab-pane" id="v1">
> For Functions v1, make sure to install the `Microsoft.Azure.WebJobs` in minimum version `2.2.0`

Install the newest `Elmah.Io.Functions` package in your Azure Functions project:

```powershell
Install-Package Elmah.Io.Functions
```

Log all uncaught exceptions using the `ElmahIoExceptionFilter` attribute:

```csharp
[ElmahIoExceptionFilter("API_KEY", "LOG_ID")]
public static class Function1
{
    [FunctionName("Function1")]
    public static void Run([TimerTrigger("0 */1 * * * *")]TimerInfo myTimer, TraceWriter log)
    {
        throw new Exception("Some exception");
    }
}
```

Replace `API_KEY` with your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and `LOG_ID` ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)) with your log ID.

> If your function method is declared as async, remember to change the return type to `Task`. Without it, the function host never invoke `ElmahIoExceptionFilter`.

The filter also supports config variables:

```csharp
[ElmahIoExceptionFilter("%apiKey%", "%logId%")]
```

The variables above, would require you to add your API key and log ID to your `settings.json`:

```json
{
  "Values": {
    "apiKey": "API_KEY",
    "logId": "LOG_ID"
  }
}
```

## Adding debug information to error messages

When debugging error messages logged from functions, it may be a good help to add information about the context the failing function is executed in. Contextual information isn't available for exception filters, but you can add it by implementing the following class:

```csharp
public class DebuggingFilter : FunctionInvocationFilterAttribute
{
    public override Task OnExecutingAsync(FunctionExecutingContext executingContext, CancellationToken cancellationToken)
    {
        executingContext.Properties.Add("message", executingContext.Arguments.First().Value.ToString());
        executingContext.Properties.Add("connection", ConfigurationManager.AppSettings["connection"]);
        return base.OnExecutingAsync(executingContext, cancellationToken);
    }
}
```

In the example, I add two properties (`message` and `connectiction`). This is an example only and you will need to add named values matching your setup. Properties added to `FunctionExecutingContext` are automatically picked up and logged to elmah.io.

Finally, add `DebuggingFilter` to your function:

```csharp
public static class MyFunction
{
    [DebuggingFilter]
    [FunctionName("MyFunction")]
    public static async Task Run(string mySbMsg)
    {
        ...
    }
}
```
</div>
</div>

