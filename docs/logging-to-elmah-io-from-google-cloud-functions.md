---
title: Logging to elmah.io from Google Cloud Functions
description: Configure error monitoring and log management on Google Cloud Functions with elmah.io. Simple install of the integration and you're flying.
---

# Logging to elmah.io from Google Cloud Functions

Logging to elmah.io from Google Cloud Functions uses our integration with *Microsoft.Extensions.Logging*. To start logging, install the `Elmah.Io.Extensions.Logging` NuGet package through the Cloud Shell or locally:

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

In the root of your Function app create a new file named `Startup.cs`:

```csharp
public class Startup : FunctionsStartup
{
    public override void ConfigureServices(WebHostBuilderContext ctx, IServiceCollection services)
    {
        services.AddLogging(logging =>
        {
            logging.AddElmahIo(o =>
            {
                o.ApiKey = "API_KEY";
                o.LogId = new Guid("LOG_ID");
            });
            logging.AddFilter<ElmahIoLoggerProvider>(null, LogLevel.Warning);
        });
    }
}
```

Replace `API_KEY` with your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and `LOG_ID` with the ID of the log to store messages in ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)).

The filter tells Google Cloud Functions to log warnings and above to elmah.io only. If you want to log detailed information about what goes on inside Google Cloud Functions, you can lower the log level.

Decorate your function with a `FunctionsStartup` attribute:

```csharp
[FunctionsStartup(typeof(Startup))]    
public class Function : IHttpFunction
{
    // ...
}
```

All uncaught exceptions happening in your function as well as log messages sent from Google Cloud Functions are now stored in elmah.io.

To log messages manually, you can inject an `ILogger` in your function:

```csharp
public class Function : IHttpFunction
{
    private ILogger<Function> _logger;

    public Function(ILogger<Function> logger)
    {
        _logger = logger;
    }

    // ...
}
```

Then log messages using the injected logger:

```csharp
_logger.LogWarning("Your log message goes here");
```