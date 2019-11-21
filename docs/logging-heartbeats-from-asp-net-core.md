# Logging heartbeats from ASP.NET Core

[TOC]

> The Heartbeats feature is currently in closed beta and highly experimental.

ASP.NET Core offers a feature called Health Checks from version 2.2 and forward. For more information about health checks, check out our blog post: [ASP.NET Core 2.2 Health Checks Explained](https://blog.elmah.io/asp-net-core-2-2-health-checks-explained/). The Heartbeats feature on elmah.io support health checks too, by publishing health check results as heartbeats.

To publish health checks as elmah.io heartbeats, install the `Elmah.Io.AspNetCore.HealthChecks` NuGet package:

```ps
Install-Package Elmah.Io.AspNetCore.HealthChecks -IncludePrerelease
```

Then configure the elmah.io health check publisher:

```csharp
services
    .AddHealthChecks()
    .AddElmahIoPublisher(options =>
    {
        options.ApiKey = "API_KEY";
        options.LogId = new Guid("LOG_ID");
        options.HeartbeatId = "HEARTBEAT_ID";
    });
```

Replace the variables with the correct values as explained in [Set up Heartbeats](/setup-heartbeats/). Remember to use an API key that includes the *Heartbeats - Write* permission.

## Additional options

### Application name

Much like the error logging integration with ASP.NET Core, you can set an application name on log messages produced by Heartbeats. To do so, set the `Application` property when adding the publisher:

```csharp
services
    .AddHealthChecks()
    .AddElmahIoPublisher(options =>
    {
        ...
        options.Application = "My app";
    });
```

If `Application` is not set, log messages will receive a default value of `Heartbeats` to make the messages distinguable from other messages.

### Callbacks

The elmah.io publisher offer callbacks already known from `Elmah.Io.AspNetCore`.

**OnHeartbeat**

The `OnHeartbeat` callback can be used to set a version number on all log messages produced by a heartbeat and/or trigger your own code every time a heartbeat is logged to elmah.io:

```csharp
services
    .AddHealthChecks()
    .AddElmahIoPublisher(options =>
    {
        ...
        options.OnHeartbeat = hb =>
        {
            hb.Version = "1.0.0";
        };
    });
```

**OnFilter**

The `OnFilter` callback can used to ignore one or more heartbeats:

```csharp
services
    .AddHealthChecks()
    .AddElmahIoPublisher(options =>
    {
        ...
        options.OnFilter = hb =>
        {
            return hb.Result == "Degraded";
        };
    });
```

The example ignores any `Degraded` heartbeats.

**OnError**

The `OnError` callback can be used to listen for errors communicating with the elmah.io API:

```csharp
services
    .AddHealthChecks()
    .AddElmahIoPublisher(options =>
    {
        ...
        options.OnError = (hb, ex) =>
        {
            // Do something
        };
    });
```

The elmah.io publisher already logs any internal errors through Microsoft.Extensions.Logging, why you don't need to do that in the `OnError` handler. If you are using another logging framework and don't have that hooked up on Microsoft.Extensions.Logging, the `OnError` is a good place to add some additional logging.

### Period

As default, ASP.NET Core runs health checks every 30 seconds when setting up a publisher. To change this interval, add the following code:

```csharp
services.Configure<HealthCheckPublisherOptions>(options =>
{
    options.Period = TimeSpan.FromMinutes(5);
});
```

There's a bug in ASP.NET Core 2.2 that requires you to use reflection when setting `Period`:

```csharp
services.Configure<HealthCheckPublisherOptions>(options =>
{
    var prop = options.GetType().GetField("_period", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance);
    prop.SetValue(options, TimeSpan.FromMinutes(5));
});
```

If setting `Period` to 5 minutes, you should set the heartbeat interval on elmah.io to 5 minutes and grace to 1 minute.

## Troubleshooting

Here's a list of things to check for if no heartbeats are registered:

- Did you include both `API_KEY`, `LOG_ID`, and `HEARTBEAT_ID`?
- The publisher needs to be called before the `AddElmahIo` call from `Elmah.Io.AspNetCore`:

```csharp
services
    .AddHealthChecks()
    .AddElmahIoPublisher();

services.AddElmahIo();
```

- If you are using Health Checks UI, it needs to be configured after the `AddElmahIoPublisher`-method:

```csharp
services
    .AddHealthChecks()
    .AddElmahIoPublisher();

service
    .AddHealthChecksUI();
```