---
title: Logging to elmah.io from OpenTelemetry
description: Learn about how to send structured logs from OpenTelemetry. Use a standardized logging system with elmah.io.
---

[![Build status](https://github.com/elmahio/Elmah.Io.OpenTelemetry/workflows/build/badge.svg)](https://github.com/elmahio/Elmah.Io.OpenTelemetry/actions?query=workflow%3Abuild)
[![NuGet](https://img.shields.io/nuget/v/Elmah.Io.OpenTelemetry.svg)](https://www.nuget.org/packages/Elmah.Io.OpenTelemetry)
[![Samples](https://img.shields.io/badge/samples-1-brightgreen.svg)](https://github.com/elmahio/Elmah.Io.OpenTelemetry/tree/main/samples)

# Logging to elmah.io from OpenTelemetry

[TOC]

elmah.io provides an exporter for OpenTelemetry that will store log entries sent through OpenTelemetry in elmah.io.

Start by installing the [Elmah.Io.OpenTelemetry](https://www.nuget.org/packages/Elmah.Io.OpenTelemetry/) package:

```powershell fct_label="Package Manager"
Install-Package Elmah.Io.OpenTelemetry -IncludePrerelease
```
```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.OpenTelemetry --prerelease
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.OpenTelemetry" Version="5.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.OpenTelemetry
```

In the `Program.cs` file, configure the elmah.io exporter:

```csharp
builder.Logging.AddOpenTelemetry(options =>
{
    options.AddElmahIoExporter(options =>
    {
        options.ApiKey = "API_KEY";
        options.LogId = new Guid("LOG_ID");
    });
});
```

Replace `API_KEY` with your API key ([Where is my API key?](where-is-my-api-key.md)) and `LOG_ID` ([Where is my log ID?](where-is-my-log-id.md)) with the log ID of the log you want to log to.

This will store log messages sent through OpenTelemetry in elmah.io. It is recommended only to send warnings and up to avoid spending your message quota with debug and information messages:

```csharp
builder.Logging.AddFilter<OpenTelemetryLoggerProvider>("*", LogLevel.Warning);
```

## Enriching log messages

The elmah.io exporter pulls as much information as possible, but you might want to enrich log messages with even more data. This can be done in numerous ways.

The export options provide an `OnMessage` action that you may already know from other client integrations:

```csharp
options.AddElmahIoExporter(options =>
{
    // ...

    options.OnMessage = msg => msg.Version = "42";
});
```

You can include a service name on log messages using the `ResourceBuilder` part of OpenTelemetry:

```csharp
builder.Logging.AddOpenTelemetry(options =>
{
    // ...

    options.SetResourceBuilder(ResourceBuilder
        .CreateEmpty()
        .AddService("Elmah.Io.OpenTelemetry.AspNetCore80"));
});
```

OpenTelemetry supports custom properties as *Attributes*. Global attributes can be added using the `ResourceBuilder` too:

```csharp
options.SetResourceBuilder(ResourceBuilder
    .CreateEmpty()
    // ...
    .AddAttributes(new Dictionary<string, object>
    {
        { "deployment.environment", builder.Environment.EnvironmentName }
    }));
```

When logging messages through the `ILogger` interface, logging scopes can be configured by setting the `IncludeScopes` property:

```csharp
builder.Logging.AddOpenTelemetry(options =>
{
    // ...

    options.IncludeScopes = true;
});
```

When enabling scopes, log messages can be enriched by wrapping the log message in a new scope:

```csharp
using (logger.BeginScope(new { CorrelationId = "42" }))
{
    logger.LogInformation("A log message");
}
```