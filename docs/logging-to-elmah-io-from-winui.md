---
title: Logging to elmah.io from WinUI
description: Learn about how to set up cloud-logging on WinUI applications using elmah.io. Catch and log all errors happening on installations of your client.
---

[![Build status](https://github.com/elmahio/Elmah.Io.WinUI/workflows/build/badge.svg)](https://github.com/elmahio/Elmah.Io.WinUI/actions?query=workflow%3Abuild)
[![NuGet](https://img.shields.io/nuget/v/Elmah.Io.WinUI.svg)](https://www.nuget.org/packages/Elmah.Io.WinUI)
[![Samples](https://img.shields.io/badge/samples-1-brightgreen.svg)](https://github.com/elmahio/Elmah.Io.WinUI/tree/main/samples)

# Logging to elmah.io from WinUI

[TOC]

elmah.io logging can be easily added to WinUI applications. To start logging to elmah.io, install the `Elmah.Io.WinUI` NuGet package:

```powershell fct_label="Package Manager"
Install-Package Elmah.Io.WinUI -IncludePrerelease
```
```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.WinUI --prerelease
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.WinUI" Version="5.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.WinUI
```

Next, initialize elmah.io in the `App.xaml.cs` file:

```csharp
public partial class App : Application
{
    public App()
    {
        ElmahIoWinUI.Init(new ElmahIoWinUIOptions(
            "API_KEY",
            new Guid("LOG_ID")));
    }
}
```

Replace `API_KEY` with your API key ([Where is my API key?](where-is-my-api-key.md)) and `LOG_ID` with the id of the log ([Where is my log ID?](where-is-my-log-id.md)) where you want errors logged.

!!! note
    Remember to [generate a new API key](how-to-configure-api-key-permissions.md) with `messages_write` permission only. This makes it easy to revoke the API key if someone starts sending messages to your log with your key.

That's it. All uncaught exceptions are now logged to elmah.io.

## Logging exceptions manually

Once initialized using the `Init` call, exceptions can be logged manually:

```csharp
ElmahIoWinUI.Log(new Exception());
```

## Breadcrumbs

The `Elmah.Io.WinUI` package provide an API to manually include breadcrumbs:

```csharp
ElmahIoWinUI.AddBreadcrumb(new Client.Breadcrumb(DateTime.UtcNow, severity:"Information", action:"Save", message:"Record save"));
```

`severity` can be set to `Verbose`, `Debug`, `Information`, `Warning`, `Error`, or `Fatal`. The value of `action` is a string of your choice. If using one of the following values, the action will get a special icon in the elmah.io UI: `click`, `submit`, `navigation`, `request`, `error`, `warning`, `fatal`. The `message` field can be used to describe the breadcrumb in more detail and/or include IDs or similar related to the breadcrumb.

The number of breadcrumbs to store in memory is 10 as a default. If you want to lower or increase this number, set the `MaximumBreadcrumbs` property during initialization:

```csharp
ElmahIoWinUI.Init(new ElmahIoWinUIOptions(/* ... */)
{
    // ...
    MaximumBreadcrumbs = 20,
});
```

## Additional options

### Setting application name

The application name can be set on all logged messages by setting the `Application` property on `ElmahIoWinUIOptions` during initialization:

```csharp
ElmahIoWinUI.Init(new ElmahIoWinUIOptions(/* ... */)
{
    // ...
    Application = "WinUI on .NET 8",    
});
```

### Hooks

The `ElmahIoWinUIOptions` class also supports a range of actions to hook into various stages of logging errors. Hooks are registered as actions when installing `Elmah.Io.WinUI`:

```csharp
ElmahIoWinUI.Init(new ElmahIoWinUIOptions(/* ... */)
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