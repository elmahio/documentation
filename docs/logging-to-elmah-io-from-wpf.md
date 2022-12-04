---
title: Logging to elmah.io from WPF
description: Learn about how to set up cloud-logging on WPF applications using elmah.io. Catch and log all errors happening on installations of your client.
---

[![Build status](https://github.com/elmahio/Elmah.Io.Wpf/workflows/build/badge.svg)](https://github.com/elmahio/Elmah.Io.Wpf/actions?query=workflow%3Abuild)
[![NuGet](https://img.shields.io/nuget/v/Elmah.Io.Wpf.svg)](https://www.nuget.org/packages/Elmah.Io.Wpf)
[![Samples](https://img.shields.io/badge/samples-2-brightgreen.svg)](https://github.com/elmahio/Elmah.Io.Wpf/tree/main/samples)

# Logging to elmah.io from WPF

[TOC]

elmah.io logging can be easily added to WPF applications. To start logging to elmah.io, install the `Elmah.Io.Wpf` NuGet package:

```powershell fct_label="Package Manager"
Install-Package Elmah.Io.Wpf -IncludePrerelease
```
```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.Wpf --prerelease
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.Wpf" Version="4.0.7-pre" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.Wpf
```

Next, initialize elmah.io in the `App.xaml.cs` file:

```csharp
public partial class App : Application
{
    public App()
    {
        ElmahIoWpf.Init(new ElmahIoWpfOptions
        {
            ApiKey = "API_KEY",
            LogId = new Guid("LOG_ID")
        });
    }
}
```

Replace `API_KEY` with your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and `LOG_ID` with the id of the log ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)) where you want errors logged.

> Remember to [generate a new API key](https://docs.elmah.io/how-to-configure-api-key-permissions/) with `messages_write` permission only. This makes it easy to revoke the API key if someone starts sending messages to your log with your key.

That's it. All uncaught exceptions are now logged to elmah.io.

## Logging exceptions manually

Once initialized using the `Init` call, exceptions can be logged manually:

```csharp
ElmahIoWpf.Log(new Exception());
```

## Breadcrumbs

The `Elmah.Io.Wpf` package automatically records breadcrumbs when clicking buttons and opening/closing windows. To manually include a breadcrumb you can include the following code:

```csharp
ElmahIoWpf.AddBreadcrumb(new Client.Breadcrumb(DateTime.UtcNow, severity:"Information", action:"Save", message:"Record save"));
```

`severity` can be set to `Verbose`, `Debug`, `Information`, `Warning`, `Error`, or `Fatal`. The value of `action` is a string of your choice. If using one of the following values, the action will get a special icon in the elmah.io UI: `click`, `submit`, `navigation`, `request`, `error`, `warning`, `fatal`. The `message` field can be used to describe the breadcrumb in more detail and/or include IDs or similar related to the breadcrumb.

The number of breadcrumbs to store in memory is 10 as a default. If you want to lower or increase this number, set the `MaximumBreadcrumbs` property during initialization:

```csharp
ElmahIoWpf.Init(new ElmahIoWpfOptions
{
    // ...
    MaximumBreadcrumbs = 20,
});
```

## Additional options

### Setting application name

The application name can be set on all logged messages by setting the `Application` property on `ElmahIoWpfOptions` during initialization:

```csharp
ElmahIoWpf.Init(new ElmahIoWpfOptions
{
    // ...
    Application = "WPF on .NET 6",    
});
```

### Hooks

The `ElmahIoWpfOptions` class also supports a range of actions to hook into various stages of logging errors. Hooks are registered as actions when installing `Elmah.Io.Wpf`:

```csharp
ElmahIoWpf.Init(new ElmahIoWpfOptions
{
    // ...
    OnFilter = msg =>
    {
        return msg.Type.Equals("System.NullReferenceException");
    },
    OnMessage = msg =>
    {
        msg.Version = "42";
    },
    OnError = (msg, ex) =>
    {
        // Log somewhere else
    }
});
```

The `OnFilter` action can be used to ignore/filter specific errors. In this example, all errors of type `System.NullReferenceException` is ignored. The `OnMessage` action can be used to decorate/enrich all errors with different information. In this example, all errors get a version number of `42`. The `OnError` action can be used to handle if the elmah.io API is down. While this doesn't happen frequently, you might want to log errors elsewhere.

## Legacy

Before the `Elmah.Io.Wpf` package was developed, this was the recommended way of installing elmah.io in WPF.

To start logging to elmah.io, install the `Elmah.Io.Client` NuGet package:

```powershell fct_label="Package Manager"
Install-Package Elmah.Io.Client
```
```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.Client
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.Client" Version="4.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.Client
```

Add the following usings to the `App.xaml.cs` file:

```csharp
using Elmah.Io.Client;
using Elmah.Io.Client.Models; // 👈 Required for Elmah.Io.Client v3.x and lower only
using System.Diagnostics;
using System.Security.Principal;
using System.Threading.Tasks;
```

Add the following code:

```csharp
private IElmahioAPI logger;

public App()
{
    logger = ElmahioAPI.Create("API_KEY");

    AppDomain.CurrentDomain.UnhandledException += (sender, args) =>
        LogException(args.ExceptionObject as Exception);

    TaskScheduler.UnobservedTaskException += (sender, args) =>
        LogException(args.Exception);

    Dispatcher.UnhandledException += (sender, args) =>
    {
        if (!Debugger.IsAttached)
            LogException(args.Exception);
    };
}

private void LogException(Exception exception)
{
    var baseException = exception.GetBaseException();
    logger.Messages.Create("LOG_ID", new CreateMessage
    {
        DateTime = DateTime.UtcNow,
        Detail = exception?.ToString(),
        Type = baseException?.GetType().FullName,
        Title = baseException?.Message ?? "An error occurred",
        Data = exception.ToDataList(),
        Severity = "Error",
        Source = baseException?.Source,
        User = WindowsIdentity.GetCurrent().Name,
    });
}
```

Replace `API_KEY` with your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and `LOG_ID` with the id of the log ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)) where you want errors logged.