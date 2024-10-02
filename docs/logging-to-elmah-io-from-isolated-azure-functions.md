---
title: Logging to elmah.io from Isolated Azure Functions
description: Logging errors to elmah.io from Isolated Azure Functions requires only a few lines of code. We've created a client specifically for Functions.
---

[![Build status](https://github.com/elmahio/Elmah.Io.Functions.Isolated/workflows/build/badge.svg)](https://github.com/elmahio/Elmah.Io.Functions.Isolated/actions?query=workflow%3Abuild)
[![NuGet](https://img.shields.io/nuget/v/Elmah.Io.Functions.Isolated.svg)](https://www.nuget.org/packages/Elmah.Io.Functions.Isolated)
[![Samples](https://img.shields.io/badge/samples-6-brightgreen.svg)](https://github.com/elmahio/Elmah.Io.Functions.Isolated/tree/main/samples)

# Logging to elmah.io from Isolated Azure Functions

[TOC]

Logging errors from Isolated [Azure Functions](https://elmah.io/features/azure-functions/) requires only a few lines of code. We've created clients specifically for Isolated Azure Functions. If your are looking for logging from Azure Functions (in process) check out [Logging to elmah.io from Azure Functions](logging-to-elmah-io-from-azure-functions.md).

Install the `Elmah.Io.Functions.Isolated` package in your project to get started:

```powershell fct_label="Package Manager"
Install-Package Elmah.Io.Functions.Isolated
```
```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.Functions.Isolated
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.Functions.Isolated" Version="5.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.Functions.Isolated
```

Next, call the `AddElmahIo` method inside `ConfigureFunctionsWorkerDefaults`:

```csharp
.ConfigureFunctionsWorkerDefaults((context, app) =>
{
    app.AddElmahIo(options =>
    {
        options.ApiKey = "API_KEY";
        options.LogId = new Guid("LOG_ID");
    });
})
```

Also, include a `using` of the `Elmah.Io.Functions.Isolated` namespace. elmah.io now automatically identifies any uncaught exceptions and logs them to the specified log. Check out the [samples](https://github.com/elmahio/Elmah.Io.Functions.Isolated/tree/main/samples) for more ways to configure elmah.io.

## Configuration

### Application name

To set the application name on all errors, set the `Application` property:

```csharp
app.AddElmahIo(options =>
{
    // ...
    options.Application = "MyFunction";
});
```

### Message hooks

`Elmah.Io.Functions.Isolated` provide message hooks similar to the integrations with ASP.NET and ASP.NET Core.

#### Decorating log messages

To include additional information on log messages, you can use the `OnMessage` action:

```csharp
app.AddElmahIo(options =>
{
    // ...
    options.OnMessage = msg =>
    {
        msg.Version = "1.0.0";
    };
});
```

The example above includes a version number on all errors.

##### Include source code

You can use the `OnMessage` action to include source code to log messages. This will require a stack trace in the `Detail` property with filenames and line numbers in it.

There are multiple ways of including source code to log messages. In short, you will need to install the `Elmah.Io.Client.Extensions.SourceCode` NuGet package and call the `WithSourceCodeFromPdb` method in the `OnMessage` action:

```csharp
app.AddElmahIo(options =>
{
    // ...
    options.OnMessage = msg =>
    {
        msg.WithSourceCodeFromPdb();
    };
});
```

Check out [How to include source code in log messages](how-to-include-source-code-in-log-messages.md) for additional requirements to make source code show up on elmah.io.

#### Handle errors

To handle any errors happening while processing a log message, you can use the `OnError` action:

```csharp
app.AddElmahIo(options =>
{
    // ...
    options.OnError = (msg, ex) =>
    {
        logger.LogError(ex, ex.Message);
    };
});
```

The example above logs any errors during communication with elmah.io to a local log.

#### Error filtering

To ignore specific errors based on their content, you can use the `OnFilter` action:

```csharp
app.AddElmahIo(options =>
{
    // ...
    options.OnFilter = msg =>
    {
        return msg.Method == "GET";
    };
});
```

The example above ignores any errors generated during an HTTP `GET` request.

### API key and log ID in settings

In the examples above, the API key and log ID are hardcoded in C#. You typically want to define these in a settings file, environment variable, Azure settings, or similar. The simplest way to do this is to load the values through `IConfiguration`:

```csharp
var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults((context, app) =>
    {
        var config = context.Configuration;

        var logId = new Guid(config["logId"]);
        var apiKey = config["apiKey"];

        app.AddElmahIo(options =>
        {
            options.ApiKey = apiKey;
            options.LogId = logId;
        });

        // ...
    })
    .Build();
```

You need to specify the `logId` and `apiKey` variables in the `local.settings.json` file as well as the place you use to declare config variables on the environments you publish the function app to:

```json
{
  "Values": {
    "apiKey": "API_KEY",
    "logId": "LOG_ID"
  }
}
```

As an alternative, you can define all elmah.io configuration in a separate object in the `local.settings.json` file you may already know from the `appsettings.json` file in ASP.NET Core:

```json
{
  "Values": {
  },
  "ElmahIo": {
    "ApiKey": "API_KEY",
    "LogId": "LOG_ID"
  }
}
```

Loading values from a separate object like this requires custom code in the `Program.cs` file since only variables inside the `Values` object are automatically loaded by the runtime:

```csharp
var host = new HostBuilder()
    .ConfigureAppConfiguration(c =>
    {
        c.SetBasePath(Directory.GetCurrentDirectory());
#if DEBUG
        c.AddJsonFile("local.settings.json");
#endif
        c.AddEnvironmentVariables();
    })
    .ConfigureFunctionsWorkerDefaults((context, app) =>
    {
        app.Services.Configure<ElmahIoFunctionOptions>(context.Configuration.GetSection("ElmahIo"));
        app.AddElmahIo();
    })
    .Build();
```

In this example, configuration from the `local.settings.json` file is loaded. Rather than specifying options to the `AddElmahIo` method, we load the entire `ElmahIo` section from the config file. When published to a test or production environment, you will need to provide the `ElmahIo` object in the configuration system provided by the environment. For Azure, you would specify environment variables with a key looking like this:

```nohighlight
ElmahIo:ApiKey
```

Please note that specifying options like an application name or using hooks is still possible by providing options for the `AddElmahIo` method. When the API key and log ID are loaded from the config file, you don't need to specify them again.

## Logging through ILogger

Isolated Azure Functions can log through Microsoft.Extensions.Logging (MEL) too. When configuring your Function app to log through MEL, custom messages can be logged through the `ILogger` interface. Furthermore, you will get detailed log messages from within the Function host. To set this up, install the `Elmah.Io.Extensions.Logging` NuGet package:

```powershell fct_label="Package Manager"
Install-Package Elmah.Io.Extensions.Logging
```
```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.Extensions.Logging
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.Extensions.Logging" Version="5.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.Extensions.Logging
```

Then extend your `Program.cs` file like this:

```csharp
var host = new HostBuilder()
    // ...
    .ConfigureLogging(logging =>
    {
        logging.AddElmahIo(options =>
        {
            options.ApiKey = "API_KEY";
            options.LogId = new Guid("LOG_ID");
        });
        logging.AddFilter<ElmahIoLoggerProvider>(null, LogLevel.Warning);
    })
    // ...
    .Build();
```

In the example, only warning messages and above are logged to elmah.io. You can remove the filter or set another log level if you want to log more. Jump to [Log filtering](#log-filtering) to learn how to configure filters from config.

Either pass an `ILogger` to your function method:

```csharp
public class MyFunction
{
    public static void Run([TimerTrigger("...")]TimerInfo myTimer, ILogger<MyFunction> logger)
    {
        logger.LogWarning("This is a warning");
    }
}
```

Or inject an `ILoggerFactory` and create a logger as part of the constructor:

```csharp
public class MyFunction
{
    private readonly ILogger<MyFunction> logger;

    public Function1(ILoggerFactory loggerFactory)
    {
        this.logger = loggerFactory.CreateLogger<MyFunction>();
    }

    public void Run([TimerTrigger("...")]TimerInfo myTimer)
    {
        logger.LogWarning("This is a warning");
    }
}
```

### Log filtering

The code above filters out all log messages with a severity lower than `Warning`. You can use all of the log filtering capabilities of Microsoft.Extensions.Logging to enable and disable various log levels from multiple categories. A common requirement is to only log `Warning` and more severe originating from the Azure Functions runtime, but log `Information` messages from your function code. This can be enabled through a custom category:

```csharp
public class MyFunction
{
    public void Run([TimerTrigger("...")]TimerInfo myTimer, ILogger<MyFunction> logger)
    {
        logger.LogInformation("This is an information message");
    }
}
```

The `MyFunction` category will need configuration in either C# or in the a config file. In previous versions of Azure Functions you would use the `host.json` file for log configuration. The `host.json` file is dedicated for configuration of the host and since Isolated Functions are running in a process separate from the host, you will need a new file. Create a file named `appsettings.json` and include the following content:

```json
{
  // ...
  "Logging": {
    "LogLevel": {
      "Default": "Warning",
      "MyFunction": "Information"
    }
  }
}
```

Next, change the Build Action to *Content* and Copy to Output Directory to *Copy if newer* in the properties of the `appsettings.json` file. Finally, include the following code in the `Program.cs` file to have the `Logging` section loaded by the Isolated Function process:

```csharp
var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults((context, app) =>
    {
        // ...
    })
    .ConfigureAppConfiguration((hostContext, config) =>
    {
        // This adds the appsettings.json file to the global configuration
        config.AddJsonFile("appsettings.json", optional: true);
    })
    .ConfigureLogging((hostingContext, logging) =>
    {
        // This configured the logger to pull settings from the Logging part of appsettings.json
        logging.AddConfiguration(hostingContext.Configuration.GetSection("Logging"));
    })
    .Build();
```

## Troubleshooting

### Exceptions in Program.cs are not logged

Unfortunately, Azure Functions doesn't send exceptions happening in initialization code to the configured loggers. The only solution is to wrap your code in `try/catch`:

```csharp
try
{
    var host = new HostBuilder()
        .ConfigureFunctionsWorkerDefaults((context, app) =>
        {
            app.AddElmahIo(options =>
            {
                options.ApiKey = "API_KEY";
                options.LogId = new Guid("LOG_ID");
            });
        })
        .Build();

    host.Run();
}
catch (Exception e)
{
    Console.Error.WriteLine(e);
    throw;
}
```

Next, go to the *Log stream* page on the Azure portal and inspect any errors logged.