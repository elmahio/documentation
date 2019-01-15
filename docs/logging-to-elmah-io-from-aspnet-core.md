[![Build status](https://ci.appveyor.com/api/projects/status/j57ekc2k9eon3u9u?svg=true)](https://ci.appveyor.com/project/ThomasArdal/elmah-io-aspnetcore)
[![NuGet](https://img.shields.io/nuget/v/Elmah.Io.AspNetCore.svg)](https://www.nuget.org/packages/Elmah.Io.AspNetCore)
[![Samples](https://img.shields.io/badge/samples-5-brightgreen.svg)](https://github.com/elmahio/Elmah.Io.AspNetCore/tree/master/samples)

# Logging to elmah.io from ASP.NET Core

[TOC]

If you are looking to log all uncaught errors from ASP.NET Core, you've come to the right place. For help setting up general .NET Core logging similar to log4net, check out [Logging from Microsoft.Extensions.Logging](https://docs.elmah.io/logging-to-elmah-io-from-microsoft-extensions-logging/).

To log all warnings and errors from ASP.NET Core, install the following NuGet package:

```powershell
Install-Package Elmah.Io.AspNetCore
```

Call `AddElmahIo` in the `ConfigureServices`-method in the `Startup.cs` file:

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddElmahIo(o =>
    {
        o.ApiKey = "API_KEY";
        o.LogId = new Guid("LOG_ID");
    });
    ...
}
```

Replace `API_KEY` with your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and `LOG_ID` ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)) with the log Id of the log you want to log to.

Call `UseElmahIo` in the `Configure`-method in the `Startup.cs` file:

```csharp
public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory fac)
{
    ...
    app.UseElmahIo();
    ...
}
```

> Make sure to call the `UseElmahIo`-method **after** installation of other pieces of middleware handling exceptions (like `UseDeveloperExceptionPage` and `UseExceptionHandler`), but **before** any calls to `UseStaticFiles`, `UseMvc` and similar.

That's it. Every uncaught exception will be logged to elmah.io.

## Configuring API key and log ID in options

If you have different environments (everyone have a least localhost and production), you should consider adding the API key and log ID in your `appsettings.json` file:

```json
{
  ...
  "ElmahIo": {
    "ApiKey": "API_KEY",
    "LogId": "LOG_ID"
  }
}
```

Configuring elmah.io is done by calling the `Configure` method instead of `AddElmahIo`:

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.Configure<ElmahIoOptions>(Configuration.GetSection("ElmahIo"));
}
```

Then call the `AddElmahIo` without parameters:

```csharp
public void Configure(IApplicationBuilder app, IHostingEnvironment env)
{
    ...
    app.UseElmahIo();
    ...
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

## Additional options

### Events

elmah.io for ASP.NET Core supports a range of events for hooking into the process of logging messages. Events are registered as actions when installing the elmah.io middleware:

```csharp
services.AddElmahIo(o =>
{
    o.ApiKey = "API_KEY";
    o.LogId = new Guid("LOG_ID");
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
    ...
    o.OnFilter = message =>
    {
        return message.Type == "System.NullReferenceException";
    };
});
```

The example above, ignores all messages of type `System.NullReferenceException`.

### Formatting exceptions

A default exception formatter is used to format any exceptions, before sending them off to the elmah.io API. To override the format of the details field in elmah.io, set a new `IExceptionFormatter` in the `ExceptionFormatter` property on the `ElmahIoOptions` object:

```csharp
services.AddElmahIo(o =>
{
    ...
    o.ExceptionFormatter = new DefaultExceptionFormatter();
}
```

Besides the default exception formatted (`DefaultExceptionFormatter`), Elmah.Io.AspNetCore comes with a formatter called `YellowScreenOfDeathExceptionFormatter`. This formatter, outputs an exception and its inner exceptions as a list of exceptions, much like on the ASP.NET yellow screen of death. If you want, implementing your own exception formatter, requires you to implement a single method.

### Logging responses not throwing an exception

As default, uncaught exceptions (500's) and 404's are logged automatically. Let's say you have a controller returning a Bad Request and want to log that as well. Since returning a 400 from a controller doesn't trigger an exception, you will need to configure this status code:

```csharp
services.AddElmahIo(o =>
{
    ...
    o.HandledStatusCodesToLog = new List<int> { 400 };
}
```

### Logging through a proxy

Since ASP.NET Core no longer support proxy configuration through `web.config`, you can log to elmah.io by configuring a proxy manually:

```csharp
services.AddElmahIo(o =>
{
    ...
    o.WebProxy = new System.Net.WebProxy("localhost", 8888);
}
```

In this example, the elmah.io client routes all traffic through `http://localhost:8000`.

## Logging health check results

ASP.NET Core 2.2 introduced a new feature named Health Checks. Health checks enable much more sofisticated uptime checks, by allowing you to verify not only uptime on your own website, but also on any dependency or precondition necessary for your website to work. For a general introduction to health checks, I recommend you to read [ASP.NET Core 2.2 Health Checks Explained](https://blog.elmah.io/asp-net-core-2-2-health-checks-explained/).

Health checks have error reporting built-in. We provide a publisher in order to allow ASP.NET Core to ship health check errors directly to your log on elmah.io. Start by installing the `Elmah.Io.AspNetCore.HealthChecks` NuGet package:

```ps
Install-Package Elmah.Io.AspNetCore.HealthChecks -IncludePrerelease
```

Then configure the elmah.io publisher as part of initializing health checks:

```csharp
public void ConfigureServices(IServiceCollection services)
{
    ...
    services
        .AddHealthChecks()
        .AddElmahIoPublisher("API_KEY", new Guid("LOG_ID"));
    ...
}
```