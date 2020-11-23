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

### Include details from the HTTP context

`Microsoft.Extensions.Logging` doesn't know that it is running inside a web server. That is why `Elmah.Io.Extensions.Logging` doesn't include HTTP contextual information like URL and status code as default. To do so, install the `Elmah.Io.AspNetCore.ExtensionsLogging` NuGet package:

```powershell fct_label="Package Manager"
Install-Package Elmah.Io.AspNetCore.ExtensionsLogging
```
```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.AspNetCore.ExtensionsLogging
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.AspNetCore.ExtensionsLogging" Version="3.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.AspNetCore.ExtensionsLogging
```

And add the following code to the `Configure` method in the `Startup.cs` file:

```csharp
app.UseElmahIoExtensionsLogging();
```

Make sure to call this method just before the call to `UseEndpoints`. This will include some of the information you are looking for.

There's a problem when running Blazor Server where you will see some of the URLs logged as part of errors on elmah.io having the value `/_blazor`. This is because Blazor doesn't work like traditional websites where the client requests the server and returns an HTML or JSON response. When navigating the UI, parts of the UI are loaded through SignalR, which causes the URL to be `/_blazor`. Unfortunately, we haven't found a good way to fix this globally. You can include the current URL on manual log statements by injecting a `NavigationManager` in the top of your `.razor` file:

```csharp
@inject NavigationManager navigationManager
```

Then wrap your logging code in a new scope:

```csharp
Uri.TryCreate(navigationManager.Uri, UriKind.Absolute, out Uri url);
using (Logger.BeginScope(new Dictionary<string, object> 
{
    { "url", url.AbsolutePath }
}))
{
    logger.LogError(exception, "An error happened");
}
```

The code uses the current URL from the injected `NavigationManager` object.

## Blazor WebAssembly App (wasm)

> Please notice that the code for Blazor WebAssembly App is highly experimental.

To start logging to elmah.io from a Blazor Wasm App, install the `Elmah.Io.Blazor.Wasm` NuGet package:

```powershell fct_label="Package Manager"
Install-Package Elmah.Io.Blazor.Wasm
```
```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.Blazor.Wasm
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.Blazor.Wasm" Version="3.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.Blazor.Wasm
```

In the `Program.cs` file, add elmah.io logging configuration:

```csharp
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Elmah.Io.Blazor.Wasm;

namespace MyBlazorApp
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebAssemblyHostBuilder.CreateDefault(args);
            builder.RootComponents.Add<App>("#app");

            // Your other services here

            builder.Logging.AddElmahIo(options =>
            {
                options.ApiKey = "API_KEY";
                options.LogId = new Guid("LOG_ID");
            });

            await builder.Build().RunAsync();
        }
    }
}
```

Replace `API_KEY` with your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and `LOG_ID` with the ID of the log you want messages sent to ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)).

The package automatically logs all errors that you also see in the browser console. This package is still in a preview state and is therefore not as polished as our other packages. There's a couple of disadvantages with the package that you need to consider before you use it:

- A lot of information about the HTTP context is missing (like cookies, URL, and user).
- No internal message queue and/or batch processing like `Microsoft.Extensions.Logging`.
- No support for logging scopes.
