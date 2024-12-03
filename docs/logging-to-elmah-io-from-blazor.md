---
title: Logging to elmah.io from Blazor
description: Easy monitoring of Blazor web applications with elmah.io. Support for both Blazor server apps and Blazor WebAssembly.
---

[![Build status](https://github.com/elmahio/Elmah.Io.Blazor.Wasm/workflows/build/badge.svg)](https://github.com/elmahio/Elmah.Io.Blazor.Wasm/actions?query=workflow%3Abuild)
[![NuGet](https://img.shields.io/nuget/v/Elmah.Io.Blazor.Wasm.svg)](https://www.nuget.org/packages/Elmah.Io.Blazor.Wasm)
[![Samples](https://img.shields.io/badge/samples-1-brightgreen.svg)](https://github.com/elmahio/Elmah.Io.Blazor.Wasm/tree/main/samples)

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
<PackageReference Include="Elmah.Io.Extensions.Logging" Version="5.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.Extensions.Logging
```

In the `Program.cs` file, add elmah.io logging configuration:

```csharp
builder.Logging.AddElmahIo(options =>
{
    options.ApiKey = "API_KEY";
    options.LogId = new Guid("LOG_ID");
});
```

Replace `API_KEY` with your API key ([Where is my API key?](where-is-my-api-key.md)) and `LOG_ID` with the ID of the log you want messages sent to ([Where is my log ID?](where-is-my-log-id.md)). The package can be configured through settings if you prefer. Check out [appsettings.json configuration](logging-to-elmah-io-from-microsoft-extensions-logging.md#appsettingsjson-configuration) for details.

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
            forecasts = await Http
                .GetJsonAsync<WeatherForecast[]>("api/SampleData/WeatherForecasts-nonexisting");
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
<PackageReference Include="Elmah.Io.AspNetCore.ExtensionsLogging" Version="5.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.AspNetCore.ExtensionsLogging
```

And add the following code to the `Program.cs` file:

```csharp
app.UseElmahIoExtensionsLogging();
```

Make sure to call this method just before the call to `UseRouting` and `UseEndpoints`. This will include some of the information you are looking for.

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

To start logging to elmah.io from a Blazor Wasm App, install the `Elmah.Io.Blazor.Wasm` NuGet package:

```powershell fct_label="Package Manager"
Install-Package Elmah.Io.Blazor.Wasm
```
```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.Blazor.Wasm
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.Blazor.Wasm" Version="4.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.Blazor.Wasm
```

In the `Program.cs` file, add elmah.io logging configuration:

```csharp
builder.Logging.AddElmahIo(options =>
{
    options.ApiKey = "API_KEY";
    options.LogId = new Guid("LOG_ID");
});
```

Replace `API_KEY` with your API key ([Where is my API key?](where-is-my-api-key.md)) and `LOG_ID` with the ID of the log you want messages sent to ([Where is my log ID?](where-is-my-log-id.md)).

All uncaught exceptions are automatically logged to elmah.io after calling `AddElmahIo`. Errors and other severities can be logged manually, by injecting an `ILogger` into your view and adding `try/catch` or by implementing error boundaries:

```csharp
@page "/"
@inject ILogger<Index> logger

@code {
    protected override void OnInitialized()
    {
        logger.LogInformation("Initializing index view");

        try
        {
            object text = "Text";
            var cast = (int)text;
        }
        catch (InvalidCastException e)
        {
            logger.LogError(e, "An error happened");
        }
    }
}
```

The following may be implemented by the package later:

- Additional information about the HTTP context (like cookies, URL, and user).
- Internal message queue and/or batch processing like `Microsoft.Extensions.Logging`.
- Support for logging scopes.

### Configuration in appsettings.json

Blazor WebAssembly doesn't provide an `appsettings.json` file as part of the default template. To add one, create a new file named `appsettings.json` in the `wwwroot` directory. Make sure to set *Build Action* to *Content* and *Copy to Output Directory* to *Copy if Newer*. In the file, add the following content:

```json
{
  "ElmahIo": {
    "ApiKey": "API_KEY",
    "LogId": "LOG_ID"
  }
}
```

As before, `API_KEY` and `LOG_ID` should be replaced with real values. In the `Program.cs` file you can load the config and set up `Elmah.Io.Blazor.Wasm` using the overloaded `AddElmahIo` method:

```csharp
builder.Services.Configure<ElmahIoBlazorOptions>(builder.Configuration.GetSection("ElmahIo"));
builder.Logging.AddElmahIo();
```

!!! note
    The `AddElmahIo` mehtod without parameters was introduced in `Elmah.Io.Blazor.Wasm` v5 package. For earlier versions, provide empty options like this: `builder.Logging.AddElmahIo(options => {});`

## Blazor (United) App

.NET 8 introduces a new approach to developing Blazor applications, formerly known as Blazor United. We have started experimenting a bit with Blazor Apps which have the option of rendering both server-side and client-side from within the same Blazor application. As shown in the sections above, using server-side rendering needs `Elmah.Io.Extensions.Logging` while client-side rendering needs `Elmah.Io.Blazor.Wasm`. You cannot have both packages installed and configured in the same project so you need to stick to one of them for Blazor (United) Apps. Since the `Elmah.Io.Extensions.Logging` package doesn't work with Blazor WebAssembly, we recommend installing the `Elmah.Io.Blazor.Wasm` package if you want to log from both server-side and client-side. Once the new Blazor App framework matures, we will probably consolidate features from both packages into an `Elmah.Io.Blazor` package or similar.