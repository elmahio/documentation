# Logging to elmah.io from Blazor

[TOC]

## Blazor Server App

To start logging to elmah.io from a Blazor Server App, install the `Elmah.Io.Extensions.Logging` NuGet package:

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

In the `Startup.cs` file, add elmah.io logging configuration:

```csharp
using Microsoft.Extensions.DependencyInjection;
using Elmah.Io.Extensions.Logging;

namespace MyBlazorApp
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddLogging(builder => builder
                .AddElmahIo(options =>
                {
                    options.ApiKey = "API_KEY";
                    options.LogId = new Guid("LOG_ID");
                })
            );
        }

        // ...
    }
}
```

Replace `API_KEY` with your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and `LOG_ID` with the ID of the log you want messages sent to ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)).

All uncaught exceptions are automatically logged to elmah.io. Exceptions can be logged manually, by injecting an `ILogger` into your view and adding `try/catch`:

```csharp
@using Microsoft.Extensions.Logging
@inject ILogger<FetchData> logger

<!-- ... -->

@functions {
    WeatherForecast[] forecasts;

    protected override async Task OnInitAsync()
    {
        try
        {
            forecasts = await Http.GetJsonAsync<WeatherForecast[]>("api/SampleData/WeatherForecasts-nonexisting");
        }
        catch (Exception e)
        {
            logger.LogError(e, e.Message);
        }
    }
}
```

`Information` and other severities can be logged as well:

```csharp
@using Microsoft.Extensions.Logging
@inject ILogger<Counter> logger

<!-- ... -->

@functions {
    int currentCount = 0;

    void IncrementCount()
    {
        currentCount++;
        logger.LogInformation("Incremented count to {currentCount}", currentCount);
    }
}
```

## Blazor WebAssembly App (wasm)

> Please notice that the code for Blazor WebAssembly App is highly experimental.

Logging to elmah.io from a Blazor WebAssembly App can be done by adding some code. While being "production-ready" according to Microsoft, Blazor WebAssembly Apps are still very limited in regards to using third-party libraries. All of our integrations log to elmah.io through the `Elmah.Io.Client` package. Neither `Elmah.Io.Client` or `Elmah.Io.Extensions.Logging` are allowed to run on the runtime provided by Blazor WebAssembly. For now, you can log to elmah.io by adding the following code to the `Program.cs` file:

```csharp
public class Program
{
    public static async Task Main(string[] args)
    {
        // ...

        // If not already there make sure to include a HttpClient like this:
        builder.Services.AddTransient(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });

        // Set up logging
        builder.Logging.SetMinimumLevel(LogLevel.Warning);
        builder.Services.AddSingleton<ILoggerProvider, ElmahIoLoggerProvider>(services =>
        {
            var httpClient = services.GetService<HttpClient>();
            return new ElmahIoLoggerProvider(httpClient);
        });

        // ...
    }

    private class ElmahIoLoggerProvider : ILoggerProvider
    {
        private readonly HttpClient httpClient;

        public ElmahIoLoggerProvider(HttpClient httpClient)
        {
            this.httpClient = httpClient;
        }

        public ILogger CreateLogger(string categoryName)
        {
            return new ElmahIoLogger(httpClient);
        }

        public void Dispose()
        {
        }
    }

    private class ElmahIoLogger : ILogger
    {
        private readonly HttpClient httpClient;

        public ElmahIoLogger(HttpClient httpClient)
        {
            this.httpClient = httpClient;
        }

        public IDisposable BeginScope<TState>(TState state)
        {
            return null;
        }

        public bool IsEnabled(LogLevel logLevel)
        {
            return true;
        }

        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception exception, Func<TState, Exception, string> formatter)
        {
            httpClient.PostAsJsonAsync(
                "https://api.elmah.io/v3/messages/LOG_ID?api_key=API_KEY",
                new
                {
                    title = formatter(state, exception),
                    dateTime = DateTime.UtcNow,
                    severity = LogLevelToSeverity(logLevel),
                    source = exception?.GetBaseException().Source,
                    hostname = Environment.MachineName,
                    type = exception?.GetBaseException().GetType().FullName,
                });
        }

        private string LogLevelToSeverity(LogLevel logLevel)
        {
            switch (logLevel)
            {
                case LogLevel.Critical:
                    return "Fatal";
                case LogLevel.Debug:
                    return "Debug";
                case LogLevel.Error:
                    return "Error";
                case LogLevel.Information:
                    return "Information";
                case LogLevel.Trace:
                    return "Verbose";
                case LogLevel.Warning:
                    return "Warning";
                default:
                    return "Information";
            }
        }
    }
}
```

Replace `API_KEY` with your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and `LOG_ID` with the ID of the log you want messages sent to ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)).

The code uses `HttpClient` to call the elmah.io API directly. This implementation is provided as code to copy, to make it clear that this is not a polished package yet. When Blazor WebAssembly Apps mature, we will decide if we want to release an official package for Blazor or utilize some of the existing packages. There's a couple of disadvantages with the code above that you need to consider before copying:

- A lot of information about the HTTP context is missing (like cookies, URL, and user).
- There's a lot of code lines compared to the usual elmah.io integration where you install a NuGet package.
- The `Log` method calls an `async` method without `await`.
- No internal message queue and/or batch processing like `Microsoft.Extensions.Logging`.
- No support for logging scopes.