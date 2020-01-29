# Logging to elmah.io from Blazor

> Please notice that we currently support server-side Blazor only. When client-side Blazor is officially released, we will make sure to follow along.

To start logging to elmah.io from Blazor, install the following NuGet package:

```powershell
Install-Package Elmah.Io.Extensions.Logging
```

In the `Startup.cs` file, add elmah.io logging configuration:

```csharp
using Microsoft.Extensions.DependencyInjection;
using Elmah.Io.Extensions.Logging;
...

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

        ...
    }
}
```

Replace `API_KEY` with your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and `LOG_ID` with the ID of the log you want messages sent to ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)).

Exceptions can be logged manually, by injecting an `ILogger` into your view and adding `try/catch`:

```csharp
@using Microsoft.Extensions.Logging
@inject ILogger<FetchData> logger

...

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

...

@functions {
    int currentCount = 0;

    void IncrementCount()
    {
        currentCount++;
        logger.LogInformation("Incremented count to {currentCount}", currentCount);
    }
}
```