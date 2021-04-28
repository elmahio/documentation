---
title: Logging from ASP.NET Core
description: "To log all warnings and errors from ASP.NET Core, install the following NuGet package: Install-Package Elmah.Io.AspNetCore. Call the AddElmahIo method."
---

[![Build status](https://github.com/elmahio/Elmah.Io.AspNetCore/workflows/build/badge.svg)](https://github.com/elmahio/Elmah.Io.AspNetCore/actions?query=workflow%3Abuild)
[![NuGet](https://img.shields.io/nuget/v/Elmah.Io.AspNetCore.svg)](https://www.nuget.org/packages/Elmah.Io.AspNetCore)
[![Samples](https://img.shields.io/badge/samples-5-brightgreen.svg)](https://github.com/elmahio/Elmah.Io.AspNetCore/tree/main/samples)

# Logging to elmah.io from ASP.NET Core

[TOC]

If you are looking to log all uncaught errors from ASP.NET Core, you've come to the right place. For help setting up general .NET Core logging similar to log4net, check out [Logging from Microsoft.Extensions.Logging](https://docs.elmah.io/logging-to-elmah-io-from-microsoft-extensions-logging/).

To log all warnings and errors from ASP.NET Core, install the following NuGet package:

```powershell fct_label="Package Manager"
Install-Package Elmah.Io.AspNetCore
```
```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.AspNetCore
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.AspNetCore" Version="3.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.AspNetCore
```

In the `Program.cs` file, add a new `using` statement:

```csharp
using Elmah.Io.AspNetCore;
```

Call `AddElmahIo` in the `ConfigureServices`-method:

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddElmahIo(o =>
    {
        o.ApiKey = "API_KEY";
        o.LogId = new Guid("LOG_ID");
    });
    // ...
}
```

Replace `API_KEY` with your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and `LOG_ID` ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)) with the log Id of the log you want to log to.

Call `UseElmahIo` in the `Configure`-method:

```csharp
public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory fac)
{
    // ...
    app.UseElmahIo();
    // ...
}
```

> Make sure to call the `UseElmahIo`-method **after** installation of other pieces of middleware handling exceptions and auth (like `UseDeveloperExceptionPage`, `UseExceptionHandler`, `UseAuthentication`, and `UseAuthorization`), but **before** any calls to `UseEndpoints`, `UseMvc` and similar.

That's it. Every uncaught exception will be logged to elmah.io.

## Configuring API key and log ID in options

If you have different environments (everyone have a least localhost and production), you should consider adding the API key and log ID in your `appsettings.json` file:

```json
{
  // ...
  "ElmahIo": {
    "ApiKey": "API_KEY",
    "LogId": "LOG_ID"
  }
}
```

Configuring elmah.io is done by calling the `Configure`-method before `AddElmahIo`:

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.Configure<ElmahIoOptions>(Configuration.GetSection("ElmahIo"));
    services.AddElmahIo();
}
```

Notice that you still need to call `AddElmahIo` to correctly register middleware dependencies.

Finally, call the `UseElmahIo`-method (as you would do with config in C# too):

```csharp
public void Configure(IApplicationBuilder app, IHostingEnvironment env)
{
    // ...
    app.UseElmahIo();
    // ...
}
```

You can still configure additional options on the `ElmahIoOptions` object:

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.Configure<ElmahIoOptions>(Configuration.GetSection("ElmahIo"));
    services.Configure<ElmahIoOptions>(o =>
    {
        o.OnMessage = msg =>
        {
            msg.Version = "1.0.0";
        };
    });
    services.AddElmahIo();
}
```

## Logging exceptions manually

While automatically logging all uncaught exceptions is definitely a nice feature, sometimes you may want to catch exceptions and log them manually. If you just want to log the exception details, without all of the contextual information about the HTTP context (cookies, server variables, etc.), we recommend you to look at our integration for [Microsoft.Extensions.Logging](https://docs.elmah.io/logging-to-elmah-io-from-microsoft-extensions-logging/). If the context is important for the error, you can utilize the `Ship`-methods available in `Elmah.Io.AspNetCore`:

```csharp
try
{
    var i = 0;
    var result = 42/i;
}
catch (DivideByZeroException e)
{
    e.Ship(HttpContext);
}
```

When catching an exception, you simply call the `Ship` extension method with the current HTTP context as parameter.

From `Elmah.Io.AspNetCore` version `3.12.*` or newer, you can log manually using the `ElmahIoApi` class as well:

```csharp
ElmahIoApi.Log(e, HttpContext);
```

The `Ship`-method uses `ElmahIoApi` underneath why both methods will give the same end result.

## Breadcrumbs

> Breadcrumbs is currently in prerelease and only supported on `Elmah.Io.AspNetCore` version `3.12.21-pre` or newer.

You can log one or more breadcrumbs as part of both automatic and manually logged errors. Breadcrumbs indicate steps happening just before a message logged by `Elmah.Io.AspNetCore`. Breadcrumbs are supported in two ways: manual and through Microsoft.Extensions.Logging.

If you want to log a breadcrumb manually as part of an MVC controller action or similar, you can use the `ElmahIoApi` class:

```csharp
ElmahIoApi.AddBreadcrumb(
    new Elmah.Io.Client.Models.Breadcrumb(DateTime.UtcNow, message: "Requesting the frontpage"),
    HttpContext);
```

Notice that the `Breadcrumb` class is located in the `Elmah.Io.Client` that will be automatically installed when installing `Elmah.Io.AspNetCore`.

We also provide an automatic generation of breadcrumbs using Microsoft.Extensions.Logging. This will pick up all log messages logged through the `ILogger` and include those as part of an error logged. This behavior is currently in opt-in mode, meaning that you will need to enable it in options:

```csharp
services.AddElmahIo(options =>
{
    // ...
    options.TreatLoggingAsBreadcrumbs = true;
});
```

The boolean can also be configured through `appsettings.json`:

```json
{
  // ...
  "ElmahIo": {
    // ...
    "TreatLoggingAsBreadcrumbs": true
  }
}
```

When enabling this automatic behavior, you may need to adjust the log level included as breadcrumbs. This is done in the `appsettings.json` file by including the following JSON:

```json
{
  "Logging": {
    // ...
    "ElmahIoBreadcrumbs": {
      "LogLevel": {
        "Default": "Information"
      }
    }
  }
}
```

Breacrumbs can be filtered using one or more rules as well:

```csharp
services.AddElmahIo(options =>
{
    // ...
    options.OnFilterBreadcrumb =
        breadcrumb => breadcrumb.Message == "A message we don't want as a breadcrumb";
});
```

## Additional options

### Setting application name

If logging to the same log from multiple web apps it is a good idea to set unique application names from each app. This will let you search and filter errors on the elmah.io UI. To set an application name, add the following code to the options:

```csharp
services.AddElmahIo(o =>
{
    // ...
    o.Application = "MyApp";
});
```

The application name can also be configured through `appsettings.json`:

```json
{
  // ...
  "ElmahIo": {
    // ...
    "Application": "MyApp"
  }
}
```

### Events

elmah.io for ASP.NET Core supports a range of events for hooking into the process of logging messages. Events are registered as actions when installing the elmah.io middleware:

```csharp
services.AddElmahIo(o =>
{
    // ...
    o.OnMessage = message =>
    {
        message.Version = "42";
    };
    o.OnError = (message, exception) =>
    {
        logger.LogError(1, exception, "Error during log to elmah.io");
    };
});
```

The actions provide a mechanism for hooking into the log process. The action registered in the `OnMessage` property is called by elmah.io just before logging a new message to the API. Use this action to decorate/enrich your log messages with additional data, like a version number. The `OnError` action is called if communication with the elmah.io API failed. If this happens, you should log the message to a local log (through Microsoft.Extensions.Logging, Serilog or similar). 

> Do not log to elmah.io in your `OnError` action, since that could cause an infinite loop in your code.

While elmah.io supports [ignore rules](https://docs.elmah.io/creating-rules-to-perform-actions-on-messages/#ignore-errors-with-a-http-status-code-of-400) serverside, you may want to filter out errors without even hitting the elmah.io API. Using the `OnFilter` function on the options object, filtering is easy:

```csharp
services.AddElmahIo(o =>
{
    // ...
    o.OnFilter = message =>
    {
        return message.Type == "System.NullReferenceException";
    };
});
```

The example above, ignores all messages of type `System.NullReferenceException`.

### Remove sensitive form data

The `OnMessage` event can be used to filter sensitive form data as well. In the following example, we remove the server variable named `Secret-Key` from all messages, before sending them to elmah.io.

```csharp
services.AddElmahIo(options =>
{
    // ...
    options.OnMessage = msg =>
    {
        var item = msg.ServerVariables.FirstOrDefault(x => x.Key == "Secret-Key"); 
        if (item != null)
        {
            msg.ServerVariables.Remove(item);
        }
    };
});
```

### Formatting exceptions

A default exception formatter is used to format any exceptions, before sending them off to the elmah.io API. To override the format of the details field in elmah.io, set a new `IExceptionFormatter` in the `ExceptionFormatter` property on the `ElmahIoOptions` object:

```csharp
services.AddElmahIo(o =>
{
    // ...
    o.ExceptionFormatter = new DefaultExceptionFormatter();
}
```

Besides the default exception formatted (`DefaultExceptionFormatter`), Elmah.Io.AspNetCore comes with a formatter called `YellowScreenOfDeathExceptionFormatter`. This formatter, outputs an exception and its inner exceptions as a list of exceptions, much like on the ASP.NET yellow screen of death. If you want, implementing your own exception formatter, requires you to implement a single method.

### Logging responses not throwing an exception

As default, uncaught exceptions (500's) and 404's are logged automatically. Let's say you have a controller returning a Bad Request and want to log that as well. Since returning a 400 from a controller doesn't trigger an exception, you will need to configure this status code:

```csharp
services.AddElmahIo(o =>
{
    // ...
    o.HandledStatusCodesToLog = new List<int> { 400 };
}
```

The list can also be configured through `appsettings.json`:

```json
{
  // ...
  "ElmahIo": {
    // ...
    "HandledStatusCodesToLog": [ 400 ],
  }
}
```

When configuring status codes through the `appsettings.json` file, `404`s will always be logged. To avoid this, configure the list in C# as shown above.

### Logging through a proxy

Since ASP.NET Core no longer support proxy configuration through `web.config`, you can log to elmah.io by configuring a proxy manually:

```csharp
services.AddElmahIo(o =>
{
    // ...
    o.WebProxy = new System.Net.WebProxy("localhost", 8888);
}
```

In this example, the elmah.io client routes all traffic through `http://localhost:8000`.

> ASP.NET Core 2.1 seems to have some problems when setting up authenticated proxies.

## Logging health check results

Check out [Logging heartbeats from ASP.NET Core](/logging-heartbeats-from-asp-net-core/) for details.