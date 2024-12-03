---
title: Logging heartbeats from ASP.NET Core
description: ASP.NET Core offers a feature called Health Checks. Heartbeats on elmah.io support health checks too by publishing results as heartbeats.
---

# Logging heartbeats from ASP.NET Core

[TOC]

ASP.NET Core offers a feature called Health Checks from version 2.2 and forward. For more information about health checks, check out our blog post: [ASP.NET Core 2.2 Health Checks Explained](https://blog.elmah.io/asp-net-core-2-2-health-checks-explained/). The Heartbeats feature on elmah.io supports health checks too, by publishing health check results as heartbeats.

To publish health checks as elmah.io heartbeats, install the `Elmah.Io.AspNetCore.HealthChecks` NuGet package:

```powershell fct_label="Package Manager"
Install-Package Elmah.Io.AspNetCore.HealthChecks
```
```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.AspNetCore.HealthChecks
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.AspNetCore.HealthChecks" Version="5.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.AspNetCore.HealthChecks
```

Then configure the elmah.io health check publisher:

```csharp
builder
    .Services
    .AddHealthChecks()
    .AddElmahIoPublisher(options =>
    {
        options.ApiKey = "API_KEY";
        options.LogId = new Guid("LOG_ID");
        options.HeartbeatId = "HEARTBEAT_ID";
    });
```

Replace the variables with the correct values as explained in [Set up Heartbeats](setup-heartbeats.md). Remember to use an API key that includes the *Heartbeats - Write* permission.

## Additional options

### Application name

Much like the error logging integration with ASP.NET Core, you can set an application name on log messages produced by Heartbeats. To do so, set the `Application` property when adding the publisher:

```csharp
.AddElmahIoPublisher(options =>
{
    ...
    options.Application = "My app";
});
```

If `Application` is not set, log messages will receive a default value of `Heartbeats` to make the messages distinguishable from other messages.

### Callbacks

The elmah.io publisher offer callbacks already known from `Elmah.Io.AspNetCore`.

**OnHeartbeat**

The `OnHeartbeat` callback can be used to set a version number on all log messages produced by a heartbeat and/or trigger custom code every time a heartbeat is logged to elmah.io:

```csharp
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
builder.Services.Configure<HealthCheckPublisherOptions>(options =>
{
    options.Period = TimeSpan.FromMinutes(5);
});
```

There's a bug in ASP.NET Core 2.2 that requires you to use reflection when setting `Period`:

```csharp
builder.Services.Configure<HealthCheckPublisherOptions>(options =>
{
    var prop = options.GetType().GetField("_period", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance);
    prop.SetValue(options, TimeSpan.FromMinutes(5));
});
```

If setting `Period` to 5 minutes, you should set the heartbeat interval on elmah.io to 5 minutes and grace to 1 minute.

## Ignoring heartbeats on localhost, staging, etc.

Monitoring heartbeats is important in your production environment. When running locally or even on staging, you probably don't want to monitor heartbeats. ASP.NET Core health checks doesn't seem to support a great deal of configuration through `appsettings.json`, Azure app settings, etc. The easiest way to tell ASP.NET Core to log heartbeats to elmah.io is to avoid setting up health checks unless a heartbeat id is configured:

```csharp
if (!string.IsNullOrWhiteSpace(Configuration["ElmahIo:HeartbeatId"]))
{
    builder.Services.AddHealthChecks().AddElmahIoPublisher();
}
```

In this example, we only configure health checks and the elmah.io publisher if the `ElmahIo:HeartbeatId` setting is defined in config.

## ASP.NET Core Troubleshooting

Here's a list of things to check for if no heartbeats are registered:

- Did you include both `API_KEY`, `LOG_ID`, and `HEARTBEAT_ID`?
- The publisher needs to be called before the `AddElmahIo` call from `Elmah.Io.AspNetCore`:

```csharp
builder
    .Services
    .AddHealthChecks()
    .AddElmahIoPublisher();

builder.Services.AddElmahIo();
```

- If you are using Health Checks UI, it needs to be configured after the `AddElmahIoPublisher`-method:

```csharp
builder
    .Services
    .AddHealthChecks()
    .AddElmahIoPublisher();

builder
    .Services
    .AddHealthChecksUI();
```