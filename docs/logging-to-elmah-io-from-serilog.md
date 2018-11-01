[![Build status](https://ci.appveyor.com/api/projects/status/j4rsru1m0lhkfwc4/branch/master?svg=true)](https://ci.appveyor.com/project/serilog/serilog-sinks-elmahio/branch/master)
[![NuGet](https://img.shields.io/nuget/v/Serilog.Sinks.ElmahIo.svg)](https://www.nuget.org/packages/Serilog.Sinks.ElmahIo)
[![Samples](https://img.shields.io/badge/samples-1-brightgreen.svg)](https://github.com/serilog/serilog-sinks-elmahio/tree/master/examples)

# Logging to elmah.io from Serilog

[TOC]

Serilog is a great addition to the flowering .NET logging community, described as “A no-nonsense logging library for the NoSQL era” on their project page. Serilog works just like other logging frameworks such as log4net and NLog, but offers a great fluent API and the concept of sinks (a bit like appenders in log4net). Sinks are superior to appenders, because they threat errors as objects rather than strings, a perfect fit for elmah.io which itself is built on NoSQL. Serilog already comes with native support for elmah.io, which makes it easy to integrate with any application using Serilog.

In this example we’ll use a ASP.NET MVC project as an example. Neither Serilog nor elmah.io are bound to log errors from web applications. Adding this type of logging to your windows and console applications is just as easy. Add the `Serilog.Sinks.ElmahIo` NuGet package to your project:

```powershell
Install-Package Serilog.Sinks.ElmahIo
```

To configure Serilog, add the following code to the Application_Start method in global.asax.cs:

```csharp
var log =
    new LoggerConfiguration()
        .WriteTo.ElmahIo("API_KEY", new Guid("LOG_ID"))
        .CreateLogger();
Log.Logger = log;
```

Replace `API_KEY` with your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and `LOG_ID` with the ID of the log you want messages sent to ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)),

First, we create a new LoggerConfiguration and tell it to write to elmah.io. The log object can be used to log errors and you should register this in your IoC container. In this case, we don’t use IoC, that is why the log object is set as the public static Logger property, which makes it accessible from everywhere.

To log log exceptions to elmah.io through Serilog, is the `Log` class provided by Serilog:

```csharp
try {
    // Do some stuff which may cause an exception
}
catch (Exception e) {
    Log.Error(e, "The actual error message");
}
```

The Error method tells Serilog to log the error in the configured sinks, which in our case logs to elmah.io. Simple and beautiful.

## Logging custom properties

Serilog support logging custom properties in three ways: As part of the log message, through enrichers and using `LogContext`. All three types of properties are implemented in the elmah.io sink as part of the Data dictionary to elmah.io.

The following example shows how to log all three types of properties:

```csharp
var logger =
    new LoggerConfiguration()
        .Enrich.WithProperty("ApplicationIdentifier", "MyCoolApp")
        .Enrich.FromLogContext()
        .WriteTo.ElmahIO(new Guid("a6ac10b1-98b3-495f-960e-424fb18e3caf"))
        .CreateLogger();

using (LogContext.PushProperty("ThreadId", Thread.CurrentThread.ManagedThreadId))
{
    logger.Error("This is a message with {Type} properties", "custom");
}
```

Beneath the Data tab on the logged message details, the `ApplicationIdentifier`, `ThreadId` and `Type` properties can be found.

## ASP.NET Core

Serilog provides a package for ASP.NET Core, that routes log messages from inside core through Serilog. We recommend to use this package together with the elmah.io sink, in order to capture warnings and errors happening inside ASP.NET Core.

To use this, install the following packages:

```powershell
Install-Package Serilog.AspNetCore -DependencyVersion Highest
Install-Package Elmah.Io.Client
Install-Package Serilog.Sinks.ElmahIo
```

(We install the `Elmah.Io.Client` manually, to make sure we run on the most recent version)

Configure Serilog as usual:

```csharp
Log.Logger = new LoggerConfiguration()
    ...
    .WriteTo.ElmahIo("API_KEY", new Guid("LOG_ID"), LogEventLevel.Warning)
    .CreateLogger();
```

Finally, call the `UseSerilog`-method:

```csharp
public static IWebHost BuildWebHost(string[] args) =>
    WebHost
        .CreateDefaultBuilder(args)
	    .UseStartup<Startup>()
        .UseSerilog()
        .Build();
```

Now, all warnings, errors and fatals happening inside ASP.NET Core are logged to elmah.io.

## Config using appsettings.json

While Serilog provides a great fluent C# API, some prefer to configure Serilog using an `appsettings.json` file. To configure the elmah.io sink this way, you will need to install the `Serilog.Settings.Configuration` NuGet package. Then configure elmah.io in your `appsettings.json` file:

```json
{
    ...
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