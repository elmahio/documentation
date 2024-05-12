---
title: Upgrade elmah.io from v4 to v5
description: Details about upgrading elmah.io clients from major version 4 to 5. Minor changes may be required to utilize some of the new features in v5.
---

# Upgrade elmah.io from v4 to v5

[TOC]

There is a new major version update named `5.x` on all client packages. We have tried supporting most of the existing code from the `4.x` packages, but some minor code changes may be needed after upgrading. This guide will go through the changes needed and potential problems when upgrading.

You may experience problems where NuGet refuses to upgrade an `Elmah.Io.*` package. We experienced this when referencing more `Elmah.Io.*` packages from the same project. Like if you would reference both `Elmah.Io.AspNetCore` and `Elmah.Io.Extensions.Logging` from the same project. Upgrading in this scenario can be achieved in one of the following ways:

1. Uninstall all `Elmah.Io.*` packages and install them one by one.
2. Install the `5.x` version of the `Elmah.Io.Client` NuGet package. Then upgrade the remaining `Elmah.Io.*` NuGet packages one by one. Finally, uninstall the `Elmah.Io.Client` package.

## Upgrading Elmah.Io.Client

If you are using the `Elmah.Io.Client` package directly, you can simply upgrade that package through NuGet:

```powershell
Update-Package Elmah.Io.Client
```

This installs the latest 5.x client. Most people are using one of the integrations with ASP.NET Core, Serilog, NLog, or similar. There are new major versions of these packages available as well.

### Code changes

We used the major version number upgrade to clean up the double methods problem introduced back when adding overloads with `CancellationToken` on all `async` methods. This means that `async` methods now only have a single version looking similar to this:

```csharp
Task<Message> CreateAndNotifyAsync(
    Guid logId, CreateMessage message, CancellationToken cancellationToken = default)
```

This shouldn't cause any compile problems since the v4 version had the following two overloads:

```csharp
Task<Message> CreateAndNotifyAsync(
    Guid logId, CreateMessage message)
Task<Message> CreateAndNotifyAsync(
    Guid logId, CreateMessage message, CancellationToken cancellationToken = default)
```

In addition, we removed all code marked as `Obsolete`. Each section below will describe what has been removed for each package. For the `Elmah.Io.Client` package, the `HttpClient` property on the `IElmahioAPI` interface has been removed. If you need to provide a custom `HttpClient` for the client, you can use the following overload of the `Create` method on the `ElmahioAPI` class:

```csharp
public static IElmahioAPI Create(string apiKey, ElmahIoOptions options, HttpClient httpClient)
```

## Upgrading Elmah.Io.AspNetCore

Upgrading the `Elmah.Io.AspNetCore` package can be done through NuGet:

```ps
Update-Package Elmah.Io.AspNetCore
```

### Code changes

Besides the changes mentioned in the section about the `Elmah.Io.Client` package, the following obsolete method has been removed from the `IHealthChecksBuilder` interface:

```csharp
public static IHealthChecksBuilder AddElmahIoPublisher(
    this IHealthChecksBuilder builder, string apiKey, Guid logId, string application = null)
```

Instead, use the `AddElmahIoPublisher` method accepting options:

```csharp
public static IHealthChecksBuilder AddElmahIoPublisher(
    this IHealthChecksBuilder builder, Action<ElmahIoPublisherOptions> options)
```

## Upgrading Serilog.Sinks.ElmahIo

Upgrading the `Serilog.Sinks.ElmahIo` package can be done through NuGet:

```ps
Update-Package Serilog.Sinks.ElmahIo
```

### Code changes

v5 of the `Serilog.Sinks.ElmahIo` package moves to Serilog 3. Serilog 3 contains a lot of changes which are fully documented [here](https://github.com/serilog/serilog/releases/tag/v3.0.0). Your code may need updates caused by changes in the `Serilog` package.

Besides the changes mentioned in the section about the `Elmah.Io.Client` package, the following obsolete methods have been removed from the `LoggerSinkConfiguration` class:

```csharp
public static LoggerConfiguration ElmahIo(
    this LoggerSinkConfiguration loggerConfiguration,
    string apiKey,
    string logId,
    LogEventLevel restrictedToMinimumLevel = LevelAlias.Minimum,
    IFormatProvider formatProvider = null)

public static LoggerConfiguration ElmahIo(
    this LoggerSinkConfiguration loggerConfiguration,
    string apiKey,
    Guid logId,
    LogEventLevel restrictedToMinimumLevel = LevelAlias.Minimum,
    IFormatProvider formatProvider = null)
```

Instead, use the `ElmahIo` method accepting options:

```csharp
public static LoggerConfiguration ElmahIo(
    this LoggerSinkConfiguration loggerConfiguration,
    ElmahIoSinkOptions options)
```

## Upgrading Elmah.Io.NLog

Upgrading the `Elmah.Io.NLog` package can be done through NuGet:

```ps
Update-Package Elmah.Io.NLog
```

Unlike other packages, `Elmah.Io.NLog` had a version `5.0.38` that was built on top of `Elmah.Io.Client` v4 and `NLog` v5. Going forward we recommend using `Elmah.Io.NLog` version `5.1.x` which is built on top of the v5 version of `Elmah.Io.Client`.

### Code changes

v5 of the `Elmah.Io.NLog` package moves to NLog 5. NLog 5 contains a lot of changes that are fully documented [here](https://nlog-project.org/2022/05/16/nlog-5-0-finally-ready.html). Your code may need updates caused by changes in the `NLog` package.

## Upgrading Elmah.Io.Umbraco

Upgrading the `Elmah.Io.Umbraco` package can be done through NuGet:

```ps
Update-Package Elmah.Io.Umbraco
```

### Code changes

v5 of the `Elmah.Io.Umbraco` package moves to Umbraco 10. For earlier versions of Umbraco, check out our documentation [here](logging-to-elmah-io-from-umbraco.md). Since Umbraco 10 is built on top of ASP.NET Core, pretty much everything in the v5 version of the `Elmah.Io.Umbraco` package is a breaking change. The package now relies on the `Elmah.Io.AspNetCore` package documented above. We recommend completely uninstalling any `Elmah.Io.*` NuGet packages and install the `Elmah.Io.Umbraco` package from scratch.