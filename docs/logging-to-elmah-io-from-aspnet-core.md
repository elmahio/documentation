---
title: Logging from ASP.NET Core
description: "To log all warnings and errors from ASP.NET Core, install the following NuGet package: Install-Package Elmah.Io.AspNetCore. Call the AddElmahIo method."
---

[![Build status](https://github.com/elmahio/Elmah.Io.AspNetCore/workflows/build/badge.svg)](https://github.com/elmahio/Elmah.Io.AspNetCore/actions?query=workflow%3Abuild)
[![NuGet](https://img.shields.io/nuget/v/Elmah.Io.AspNetCore.svg)](https://www.nuget.org/packages/Elmah.Io.AspNetCore)
[![Samples](https://img.shields.io/badge/samples-4-brightgreen.svg)](https://github.com/elmahio/Elmah.Io.AspNetCore/tree/main/samples)

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
<PackageReference Include="Elmah.Io.AspNetCore" Version="4.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.AspNetCore
```

In the `Startup.cs` file, add a new `using` statement:

```csharp
using Elmah.Io.AspNetCore;
```

<div class="tabbable-responsive">
<div class="tabbable">
<ul class="nav nav-tabs" role="tablist">
    <li role="presentation" class="nav-item"><a class="nav-link active" href="#standard" aria-controls="standard" role="tab" data-toggle="tab">Standard</a></li>
    <li role="presentation" class="nav-item"><a class="nav-link" href="#toplevel" aria-controls="toplevel" role="tab" data-toggle="tab">Top-level statements</a></li>
</ul>
</div>
</div>

<div class="tab-content tab-content-tabbable" markdown="1">
<div role="tabpanel" class="tab-pane active" id="standard" markdown="1">
Call `AddElmahIo` in the `ConfigureServices`-method:

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddElmahIo(options =>
    {
        options.ApiKey = "API_KEY";
        options.LogId = new Guid("LOG_ID");
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
</div>

<div role="tabpanel" class="tab-pane" id="toplevel" markdown="1">
Call `AddElmahIo` in the `Program.cs` file:

```csharp
builder.Services.AddElmahIo(options =>
{
    options.ApiKey = "API_KEY";
    options.LogId = new Guid("LOG_ID");
});
```

Replace `API_KEY` with your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and `LOG_ID` ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)) with the log Id of the log you want to log to.

Call `UseElmahIo` in the `Program.cs` file:

```csharp
app.UseElmahIo();
```
</div>
</div>

> Make sure to call the `UseElmahIo`-method **after** installation of other pieces of middleware handling exceptions and auth (like `UseDeveloperExceptionPage`, `UseExceptionHandler`, `UseAuthentication`, and `UseAuthorization`), but **before** any calls to `UseEndpoints`, `UseMvc`, `MapRazorPages`, and similar.

That's it. Every uncaught exception will be logged to elmah.io. For an example of configuring elmah.io with ASP.NET Core minimal APIs, check out [this sample](https://github.com/elmahio/Elmah.Io.AspNetCore/tree/main/samples/Elmah.Io.AspNetCore60.Example).

## Configuring API key and log ID in options

If you have different environments (everyone has a least localhost and production), you should consider adding the API key and log ID in your `appsettings.json` file:

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

<div class="tabbable-responsive">
<div class="tabbable">
<ul class="nav nav-tabs" role="tablist">
    <li role="presentation" class="nav-item"><a class="nav-link active" href="#standard2" aria-controls="standard2" role="tab" data-toggle="tab">Standard</a></li>
    <li role="presentation" class="nav-item"><a class="nav-link" href="#toplevel2" aria-controls="toplevel2" role="tab" data-toggle="tab">Top-level statements</a></li>
</ul>
</div>
</div>

<div class="tab-content tab-content-tabbable" markdown="1">
<div role="tabpanel" class="tab-pane active" id="standard2" markdown="1">
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
    services.Configure<ElmahIoOptions>(options =>
    {
        options.OnMessage = msg =>
        {
            msg.Version = "1.0.0";
        };
    });
    services.AddElmahIo();
}
```
</div>

<div role="tabpanel" class="tab-pane" id="toplevel2" markdown="1">
```csharp
builder.Services.Configure<ElmahIoOptions>(builder.Configuration.GetSection("ElmahIo"));
builder.Services.AddElmahIo();
```

Notice that you still need to call `AddElmahIo` to correctly register middleware dependencies.

Finally, call the `UseElmahIo`-method (as you would do with config in C# too):

```csharp
app.UseElmahIo();
```

You can still configure additional options on the `ElmahIoOptions` object:

```csharp
builder.Services.Configure<ElmahIoOptions>(builder.Configuration.GetSection("ElmahIo"));
builder.Services.Configure<ElmahIoOptions>(o =>
{
    o.OnMessage = msg =>
    {
        msg.Version = "1.0.0";
    };
});
builder.Services.AddElmahIo();
```
</div>
</div>

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

When catching an exception (in this example an [DivideByZeroException](https://elmah.io/exceptions/System.DivideByZeroException/)), you call the `Ship` extension method with the current HTTP context as parameter.

From `Elmah.Io.AspNetCore` version `3.12.*` or newer, you can log manually using the `ElmahIoApi` class as well:

```csharp
ElmahIoApi.Log(e, HttpContext);
```

The `Ship`-method uses `ElmahIoApi` underneath why both methods will give the same end result.

## Breadcrumbs

See [Logging breadcrumbs from ASP.NET Core](/logging-breadcrumbs-from-asp-net-core/).

## Additional options

### Setting application name

If logging to the same log from multiple web apps it is a good idea to set unique application names from each app. This will let you search and filter errors on the elmah.io UI. To set an application name, add the following code to the options:

```csharp
builder.Services.AddElmahIo(o =>
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

### Hooks

elmah.io for ASP.NET Core supports a range of actions for hooking into the process of logging messages. Hooks are registered as actions when installing the elmah.io middleware:

```csharp
builder.Services.AddElmahIo(options =>
{
    // ...
    options.OnMessage = message =>
    {
        message.Version = "42";
    };
    options.OnError = (message, exception) =>
    {
        logger.LogError(1, exception, "Error during log to elmah.io");
    };
});
```

The actions provide a mechanism for hooking into the log process. The action registered in the `OnMessage` property is called by elmah.io just before logging a new message to the API. Use this action to decorate/enrich your log messages with additional data, like a version number. The `OnError` action is called if communication with the elmah.io API failed. If this happens, you should log the message to a local log (through Microsoft.Extensions.Logging, Serilog or similar). 

> Do not log to elmah.io in your `OnError` action, since that could cause an infinite loop in your code.

While elmah.io supports [ignore rules](https://docs.elmah.io/creating-rules-to-perform-actions-on-messages/#ignore-errors-with-a-http-status-code-of-400) serverside, you may want to filter out errors without even hitting the elmah.io API. Using the `OnFilter` function on the options object, filtering is easy:

```csharp
builder.Services.AddElmahIo(options =>
{
    // ...
    options.OnFilter = message =>
    {
        return message.Type == "System.NullReferenceException";
    };
});
```

The example above, ignores all messages of type [System.NullReferenceException](https://elmah.io/exceptions/System.NullReferenceException/).

#### Decorate from HTTP context

When implementing the `OnMessage` action as shown above you don't have access to the current HTTP context. `Elmah.Io.AspNetCore` already tries to fill in as many fields as possible from the current context, but you may want to tweak something from time to time. In this case, you can implement a custom decorator like this:

```csharp
public class DecorateElmahIoMessages : IConfigureOptions<ElmahIoOptions>
{
    private readonly IHttpContextAccessor httpContextAccessor;

    public DecorateElmahIoMessages(IHttpContextAccessor httpContextAccessor)
    {
        this.httpContextAccessor = httpContextAccessor;
    }

    public void Configure(ElmahIoOptions options)
    {
        options.OnMessage = msg =>
        {
            var context = httpContextAccessor.HttpContext;
            msg.User = context?.User?.Identity?.Name;
        };
    }
}
```

<div class="tabbable-responsive">
<div class="tabbable">
<ul class="nav nav-tabs" role="tablist">
    <li role="presentation" class="nav-item"><a class="nav-link active" href="#standard3" aria-controls="standard3" role="tab" data-toggle="tab">Standard</a></li>
    <li role="presentation" class="nav-item"><a class="nav-link" href="#toplevel3" aria-controls="toplevel3" role="tab" data-toggle="tab">Top-level statements</a></li>
</ul>
</div>
</div>

<div class="tab-content tab-content-tabbable" markdown="1">
<div role="tabpanel" class="tab-pane active" id="standard3" markdown="1">
Then register `IHttpContextAccessor` and the new class in the `ConfigureServices` method in the `Startup.cs` file:

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddHttpContextAccessor();
    services.AddSingleton<IConfigureOptions<ElmahIoOptions>, DecorateElmahIoMessages>();
    // ...
}
```
</div>

<div role="tabpanel" class="tab-pane" id="toplevel3" markdown="1">
Then register `IHttpContextAccessor` and the new class in the in the `Program.cs` file:

```csharp
builder.Services.AddHttpContextAccessor();
builder.Services.AddSingleton<IConfigureOptions<ElmahIoOptions>, DecorateElmahIoMessages>();
```
</div>
</div>

> Decorating messages using `IConfigureOptions` requires `Elmah.Io.AspNetCore` version `4.1.37` or newer.

#### Include source code

You can use the `OnMessage` action to include source code to log messages. This will require a stack trace in the `Detail` property with filenames and line numbers in it.

There are multiple ways of including source code to log messages. In short, you will need to install the `Elmah.Io.Client.Extensions.SourceCode` NuGet package and call the `WithSourceCodeFromPdb` method in the `OnMessage` action:

```csharp
builder.Services.AddElmahIo(options =>
{
    // ...
    options.OnMessage = msg =>
    {
        msg.WithSourceCodeFromPdb();
    };
});
```

Check out [How to include source code in log messages](/how-to-include-source-code-in-log-messages/) for additional requirements to make source code show up on elmah.io.

> Including source code on log messages is available in the `Elmah.Io.Client` v4 package and forward.

#### Remove sensitive form data

The `OnMessage` event can be used to filter sensitive form data as well. In the following example, we remove the server variable named `Secret-Key` from all messages, before sending them to elmah.io.

```csharp
builder.Services.AddElmahIo(options =>
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
builder.Services.AddElmahIo(options =>
{
    // ...
    options.ExceptionFormatter = new DefaultExceptionFormatter();
}
```

Besides the default exception formatted (`DefaultExceptionFormatter`), Elmah.Io.AspNetCore comes with a formatter called `YellowScreenOfDeathExceptionFormatter`. This formatter, outputs an exception and its inner exceptions as a list of exceptions, much like on the ASP.NET yellow screen of death. If you want, implementing your own exception formatter, requires you to implement a single method.

### Logging responses not throwing an exception

As default, uncaught exceptions (500's) and 404's are logged automatically. Let's say you have a controller returning a Bad Request and want to log that as well. Since returning a 400 from a controller doesn't trigger an exception, you will need to configure this status code:

```csharp
builder.Services.AddElmahIo(options =>
{
    // ...
    options.HandledStatusCodesToLog = new List<int> { 400 };
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
builder.Services.AddElmahIo(options =>
{
    // ...
    options.WebProxy = new System.Net.WebProxy("localhost", 8888);
}
```

In this example, the elmah.io client routes all traffic through `http://localhost:8000`.

## Logging health check results

Check out [Logging heartbeats from ASP.NET Core](/logging-heartbeats-from-asp-net-core/) for details.