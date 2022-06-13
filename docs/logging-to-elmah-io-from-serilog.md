---
title: Logging to elmah.io from Serilog
description: Add cloud logging of structured log messages from Serilog directly to elmah.io. Search, analyze, and instant notifications on new errors logged.
---

[![Build status](https://github.com/elmahio/serilog-sinks-elmahio/workflows/build/badge.svg)](https://github.com/elmahio/serilog-sinks-elmahio/actions?query=workflow%3Abuild)
[![NuGet](https://img.shields.io/nuget/v/Serilog.Sinks.ElmahIo.svg)](https://www.nuget.org/packages/Serilog.Sinks.ElmahIo)
[![Samples](https://img.shields.io/badge/samples-3-brightgreen.svg)](https://github.com/elmahio/serilog-sinks-elmahio/tree/main/examples)

# Logging to elmah.io from Serilog

[TOC]

Serilog is a great addition to the flowering .NET logging community, described as “A no-nonsense logging library for the NoSQL era” on their project page. Serilog works just like other logging frameworks such as log4net and NLog but offers a great fluent API and the concept of sinks (a bit like appenders in log4net). Sinks are superior to appenders because they threat errors as objects rather than strings, a perfect fit for elmah.io which itself is built on NoSQL. Serilog already comes with native support for elmah.io, which makes it easy to integrate with any application using Serilog.

Adding this type of logging to your windows and console applications is just as easy. Add the `Serilog.Sinks.ElmahIo` NuGet package to your project:

```powershell fct_label="Package Manager"
Install-Package Serilog.Sinks.ElmahIo
```
```cmd fct_label=".NET CLI"
dotnet add package Serilog.Sinks.ElmahIo
```
```xml fct_label="PackageReference"
<PackageReference Include="Serilog.Sinks.ElmahIo" Version="4.*" />
```
```xml fct_label="Paket CLI"
paket add Serilog.Sinks.ElmahIo
```

To configure Serilog, add the following code to the Application_Start method in global.asax.cs:

```csharp
var log =
    new LoggerConfiguration()
        .WriteTo.ElmahIo(new ElmahIoSinkOptions("API_KEY", new Guid("LOG_ID")))
        .CreateLogger();
Log.Logger = log;
```

Replace `API_KEY` with your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and `LOG_ID` with the ID of the log you want messages sent to ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)).

First, we create a new LoggerConfiguration and tell it to write to elmah.io. The log object can be used to log errors and you should register this in your IoC container. In this case, we don't use IoC, that is why the log object is set as the public static Logger property, which makes it accessible from everywhere.

To log exceptions to elmah.io through Serilog use the `Log` class provided by Serilog:

```csharp
try
{
    // Do some stuff that may cause an exception
}
catch (Exception e)
{
    Log.Error(e, "The actual error message");
}
```

The Error method tells Serilog to log the error in the configured sinks, which in our case logs to elmah.io. Simple and beautiful.

> Always call `Log.CloseAndFlush();` before your program terminates.

## Logging custom properties

Serilog supports logging custom properties in three ways: As part of the log message, through enrichers, and using `LogContext`. All three types of properties are implemented in the elmah.io sink as part of the Data dictionary to elmah.io.

The following example shows how to log all three types of properties:

```csharp
var logger =
    new LoggerConfiguration()
        .Enrich.WithProperty("ApplicationIdentifier", "MyCoolApp")
        .Enrich.FromLogContext()
        .WriteTo.ElmahIo(new ElmahIoSinkOptions("API_KEY", new Guid("LOG_ID")))
        .CreateLogger();

using (LogContext.PushProperty("ThreadId", Thread.CurrentThread.ManagedThreadId))
{
    logger.Error("This is a message with {Type} properties", "custom");
}
```

Beneath the Data tab on the logged message details, the `ApplicationIdentifier`, `ThreadId`, and `Type` properties can be found.

`Serilog.Sinks.ElmahIo` provides a range of reserved property names, that can be used to fill in data in the correct fields on the elmah.io UI. Let's say you want to fill the User field using structured logging only:

```csharp
logger.Information("{Quote} from {User}", "Hasta la vista, baby", "Arnold Schwarzenegger");
```

This will fill in the value `Arnold Schwarzenegger` in the `User` field, as well as add two key/value pairs (Quote and User) to the Data tab on elmah.io. For a reference of all possible property names, check out the property names on [CreateMessage](https://github.com/elmahio/Elmah.Io.Client/blob/main/src/Elmah.Io.Client/ElmahioClient.cs#L3617).

## Message hooks

`Serilog.Sinks.ElmahIo` provides message hooks similar to the integrations with ASP.NET and ASP.NET Core.

> Message hooks require `Serilog.Sinks.ElmahIo` version `3.3.0` or newer.

### Decorating log messages

To include additional information on log messages, you can use the OnMessage event when initializing the elmah.io target:

```csharp
Log.Logger =
    new LoggerConfiguration()
        .WriteTo.ElmahIo(new ElmahIoSinkOptions("API_KEY", new Guid("LOG_ID"))
        {
            OnMessage = msg =>
            {
                msg.Version = "1.0.0";
            }
        })
        .CreateLogger();
```

The example above includes a version number on all errors. Since the elmah.io sink also picks up enrichers specified with Serilog, this example could be implemented by enriching all log messages with a field named `version`.

#### Include source code

You can use the `OnMessage` action to include source code to log messages. This will require a stack trace in the `Detail` property with filenames and line numbers in it.

There are multiple ways of including source code to log messages. In short, you will need to install the `Elmah.Io.Client.Extensions.SourceCode` NuGet package and call the `WithSourceCodeFromPdb` method in the `OnMessage` action:

```csharp
Log.Logger =
    new LoggerConfiguration()
        .WriteTo.ElmahIo(new ElmahIoSinkOptions("API_KEY", new Guid("LOG_ID"))
        {
            OnMessage = msg =>
            {
                msg.WithSourceCodeFromPdb();
            }
        })
        .CreateLogger();
```

Check out [How to include source code in log messages](/how-to-include-source-code-in-log-messages/) for additional requirements to make source code show up on elmah.io.

> Including source code on log messages is available in the `Elmah.Io.Client` v4 package and forward.

### Handle errors

To handle any errors happening while processing a log message, you can use the OnError event when initializing the elmah.io sink:

```csharp
Log.Logger =
    new LoggerConfiguration()
        .WriteTo.ElmahIo(new ElmahIoSinkOptions("API_KEY", new Guid("LOG_ID"))
        {
            OnError = (msg, ex) =>
            {
                Console.Error.WriteLine(ex.Message);
            }
        })
        .CreateLogger();
```

The example implements a callback if logging to elmah.io fails. How you choose to implement this is entirely up to your application and tech stack.

### Error filtering

To ignore specific messages based on their content, you can use the OnFilter event when initializing the elmah.io sink:

```csharp
Log.Logger =
    new LoggerConfiguration()
        .WriteTo.ElmahIo(new ElmahIoSinkOptions("API_KEY", new Guid("LOG_ID"))
        {
            OnFilter = msg =>
            {
                return msg.Title.Contains("trace");
            }
        })
        .CreateLogger();
```

The example above ignores any log message with the word `trace` in the title.

## ASP.NET Core

Serilog provides a package for ASP.NET Core, that routes log messages from inside the framework through Serilog. We recommend using this package together with the elmah.io sink, in order to capture warnings and errors happening inside ASP.NET Core.

To use this, install the following packages:

```powershell fct_label="Package Manager"
Install-Package Serilog.AspNetCore
Install-Package Serilog.Sinks.ElmahIo
```
```cmd fct_label=".NET CLI"
dotnet add package Serilog.AspNetCore
dotnet add package Serilog.Sinks.ElmahIo
```
```xml fct_label="PackageReference"
<PackageReference Include="Serilog.AspNetCore" Version="3.*" />
<PackageReference Include="Serilog.Sinks.ElmahIo" Version="4.*" />
```
```xml fct_label="Paket CLI"
paket add Serilog.AspNetCore
paket add Serilog.Sinks.ElmahIo
```

Configure Serilog as usual:

```csharp
public static int Main(string[] args)
{
    Log.Logger = new LoggerConfiguration()
        .WriteTo.ElmahIo(new ElmahIoSinkOptions("API_KEY", new Guid("LOG_ID"))
        {
            MinimumLogEventLevel = Events.LogEventLevel.Warning
        })
        .CreateLogger();

    try
    {
        CreateWebHostBuilder(args).Build().Run();
        return 0;
    }
    catch (Exception ex)
    {
        Log.Fatal(ex, "Host terminated unexpectedly");
        return 1;
    }
    finally
    {
        Log.CloseAndFlush();
    }
}
```

Finally, call the `UseSerilog`-method in `CreateHostBuilder`:

```csharp
public static IHostBuilder CreateHostBuilder(string[] args) =>
    Host.CreateDefaultBuilder(args)
        .ConfigureWebHostDefaults(webBuilder =>
        {
            webBuilder.UseStartup<Startup>();
            webBuilder.UseSerilog();
        });
```

Now, all warnings, errors, and fatals happening inside ASP.NET Core are logged to elmah.io.

A common request is to include all of the HTTP contextual information you usually get logged when using a package like `Elmah.Io.AspNetCore`. We have developed a specialized NuGet package to include cookies, server variables, etc. when logging through Serilog from ASP.NET Core. To set it up, install the `Elmah.Io.AspNetCore.Serilog` NuGet package:

```powershell fct_label="Package Manager"
Install-Package Elmah.Io.AspNetCore.Serilog
```
```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.AspNetCore.Serilog
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.AspNetCore.Serilog" Version="4.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.AspNetCore.Serilog
```

Then, call the `UseElmahIoSerilog` method in the `Configure` method in the `Startup.cs` file:

```csharp
public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
{
    // ... Exception handling middleware
    app.UseElmahIoSerilog();
    // ... UseMvc etc.
}
```

The middleware uses Serilog's `LogContext` feature to enrich each log message with additional properties. To turn on the log context, extend your Serilog config:

```csharp
Log.Logger = new LoggerConfiguration()
    .WriteTo.ElmahIo(/*...*/)
    .Enrich.FromLogContext() // <-- add this line
    .CreateLogger();
```

There's a problem with this approach when an endpoint throws an uncaught exception. Microsoft.Extensions.Logging logs all uncaught exceptions as errors, but the `LogContext` is already popped when doing so. The recommended approach is to ignore these errors in the elmah.io sink and install the `Elmah.Io.AspNetCore` package to log uncaught errors to elmah.io (as explained in [Logging from ASP.NET Core](https://docs.elmah.io/logging-to-elmah-io-from-aspnet-core/)). The specific error message can be ignored in the sink by providing the following filter during initialization of Serilog:

```csharp
.WriteTo.ElmahIo(new ElmahIoSinkOptions("API_KEY", new Guid("LOG_ID"))
{
    // ...
    OnFilter = msg =>
    {
        return
            msg != null
            && msg.TitleTemplate != null
            && msg.TitleTemplate.Equals(
                "An unhandled exception has occurred while executing the request.",
                StringComparison.InvariantCultureIgnoreCase);
    }
})
```

## ASP.NET

Messages logged through Serilog in an ASP.NET WebForms, MVC, or Web API application can be enriched with a range of HTTP contextual information using the `SerilogWeb.Classic` NuGet package. Start by installing the package:

```powershell fct_label="Package Manager"
Install-Package SerilogWeb.Classic
```
```cmd fct_label=".NET CLI"
dotnet add package SerilogWeb.Classic
```
```xml fct_label="PackageReference"
<PackageReference Include="SerilogWeb.Classic" Version="5.*" />
```
```xml fct_label="Paket CLI"
paket add SerilogWeb.Classic
```

The package includes automatic HTTP request and response logging as well as some Serilog enrichers. Unless you are trying to debug a specific problem with your website, we recommend disabling HTTP logging since that will produce a lot of messages (depending on the traffic on your website). HTTP logging can be disabled by including the following code in the `Global.asax.cs` file:

```csharp
protected void Application_Start()
{
    SerilogWebClassic.Configure(cfg => cfg
        .Disable()
    );

    // ...
}
```

To enrich log messages with HTTP contextual information you can configure one or more enrichers in the same place as you configure the elmah.io sink:

```csharp
Log.Logger = new LoggerConfiguration()
    .WriteTo.ElmahIo(new ElmahIoSinkOptions("API_KEY", new Guid("LOG_ID")))
    .Enrich.WithHttpRequestClientHostIP()
    .Enrich.WithHttpRequestRawUrl()
    .Enrich.WithHttpRequestType()
    .Enrich.WithHttpRequestUrl()
    .Enrich.WithHttpRequestUserAgent()
    .Enrich.WithUserName(anonymousUsername:null)
    .CreateLogger();
```

This will automatically fill in fields on elmah.io like URL, method, client IP, and UserAgent.

Check out [this full sample](https://github.com/elmahio/serilog-sinks-elmahio/tree/main/examples/Serilog.Sinks.ElmahIo.AspNet) for more details.

## Config using appsettings.json

While Serilog provides a great fluent C# API, some prefer to configure Serilog using an `appsettings.json` file. To configure the elmah.io sink this way, you will need to install the `Serilog.Settings.Configuration` NuGet package. Then configure elmah.io in your `appsettings.json` file:

```json
{
    // ...
    "Serilog":{
        "Using":[
            "Serilog.Sinks.ElmahIo"
        ],
        "MinimumLevel": "Warning",
        "WriteTo":[
            {
                "Name": "ElmahIo",
                "Args":{
                    "apiKey": "API_KEY",
                    "logId": "LOG_ID"
                }
            }
        ]
    }
}
```

> Make sure to specify the `apiKey` and `logId` arguments with the first character in lowercase.

Finally, tell Serilog to read the configuration from the `appsettings.json` file:

```csharp
var configuration = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json")
    .Build();

var logger = new LoggerConfiguration()
    .ReadFrom.Configuration(configuration)
    .CreateLogger();
```

## Extended exception details with Serilog.Exceptions

The more information you have on an error, the easier it is to find out what went wrong. Muhammad Rehan Saeed made a nice enrichment package for Serilog named `Serilog.Exceptions`. The package uses reflection on a logged exception to log additional information depending on the concrete exception type. You can install the package through NuGet:

```powershell fct_label="Package Manager"
Install-Package Serilog.Exceptions
```
```cmd fct_label=".NET CLI"
dotnet add package Serilog.Exceptions
```
```xml fct_label="PackageReference"
<PackageReference Include="Serilog.Exceptions" Version="5.*" />
```
```xml fct_label="Paket CLI"
paket add Serilog.Exceptions
```

And configure it in C# code:

```csharp
var logger = new LoggerConfiguration()
    .Enrich.WithExceptionDetails()
    .WriteTo.ElmahIo(/*...*/)
    .CreateLogger();
```

The elmah.io sink will automatically pick up the additional information and show them in the extended message details overlay. To navigate to this view, click an error on the search view. Then click the <kbd><span class="fa fa-bars"></span></kbd> button in the upper right corner to open extended message details. The information logged by `Serilog.Exceptions` are available beneath the *Data* tab.

## Remove sensitive data

Structured logging with Serilog is a great way to store a lot of contextual information about a log message. In some cases, it may result in sensitive data being stored in your log, though. We recommend you remove any sensitive data from your log messages before storing them on elmah.io and anywhere else. To implement this, you can use the `OnMessage` event as already shown previously in the document:

```csharp
OnMessage = msg =>
{
    foreach (var d in msg.Data)
    {
        if (d.Key.Equals("Password"))
        {
            d.Value = "****";
        }
    }
}
```

An alternative to replacing sensitive values manually is to use a custom destructuring package for Serilog. The following example shows how to achieve this using the `Destructurama.Attributed` package:

```powershell fct_label="Package Manager"
Install-Package Destructurama.Attributed
```
```cmd fct_label=".NET CLI"
dotnet add package Destructurama.Attributed
```
```xml fct_label="PackageReference"
<PackageReference Include="Destructurama.Attributed" Version="2.*" />
```
```xml fct_label="Paket CLI"
paket add Destructurama.Attributed
```

Set up destructuring from attributes:

```csharp
Log.Logger = new LoggerConfiguration()
    .Destructure.UsingAttributes()
    .WriteTo.ElmahIo(/*...*/)
    .CreateLogger();
```

Make sure to decorate any properties including sensitive data with the `NotLogged` attribute:

```csharp
public class LoginModel
{
    public string Username { get; set; }

    [NotLogged]
    public string Password { get; set; }
}
```

## Troubleshooting

Here are some things to try out if logging from Serilog to elmah.io doesn't work:

- Make sure that you have the newest `Serilog.Sinks.ElmahIo` and `Elmah.Io.Client` packages installed.
- Make sure to include all of the configuration from the example above.
- Make sure that the API key is valid and allow the *Messages* | *Write* [permission](https://docs.elmah.io/how-to-configure-api-key-permissions/).
- Make sure to include a valid log ID.
- Make sure that you have sufficient log messages in your subscription and that you didn't disable logging to the log or include any ignore filters/rules.
- Always make sure to call `Log.CloseAndFlush()` before exiting the application to make sure that all log messages are flushed.
- Set up Serilog's SelfLog to inspect any errors happening inside Serilog or the elmah.io sink: `Serilog.Debugging.SelfLog.Enable(msg => Debug.WriteLine(msg));`.
- Implement the [`OnError`](#handle-errors) action and put a breakpoint in the handler to inspect if any errors are thrown while logging to the elmah.io API.