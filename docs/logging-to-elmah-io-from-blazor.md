[![Build status](https://ci.appveyor.com/api/projects/status/70hjy8k0twlgjqqg?svg=true)](https://ci.appveyor.com/project/ThomasArdal/elmah-io-blazor)
[![NuGet](https://img.shields.io/nuget/v/Elmah.Io.Blazor.svg)](https://www.nuget.org/packages/Elmah.Io.Blazor)
[![Samples](https://img.shields.io/badge/samples-1-brightgreen.svg)](https://github.com/elmahio/Elmah.Io.Blazor/tree/master/sample)

# Logging to elmah.io from Blazor

> Like Blazor itself, `Elmah.Io.Blazor` is highly experimental and should not be used for production use.

To start logging exceptions from Blazor, install the NuGet package:

```powershell
Install-Package Elmah.Io.Blazor -IncludePrerelease
```

In the `Startup.cs` file, add the elmah.io integration for Blazor:

```csharp
...
using Elmah.Io.Blazor;

namespace MyBlazorApp
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddLogging(l => l
                .AddElmahIo("API_KEY", new Guid("LOG_ID")));
        }

        ...
    }
}
```

Replace `API_KEY` with your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and `LOG_ID` with the ID of the log you want messages sent to ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)).

As of writing this article, Blazor doesn't support global error handling. Exceptions can be logged manually, by injecting an `ILogger` into your view and adding `try/catch`:

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