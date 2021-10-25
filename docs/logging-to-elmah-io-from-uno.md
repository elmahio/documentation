---
title: Logging to elmah.io from Uno
description: Learn about how to set up error monitoring and log uncaught exceptions from Uno applications to elmah.io. Get crash reports from your users.
---

[![Build status](https://github.com/elmahio/elmah.io.uno/workflows/build/badge.svg)](https://github.com/elmahio/elmah.io.uno/actions?query=workflow%3Abuild)
[![NuGet](https://img.shields.io/nuget/v/elmah.io.uno.svg)](https://www.nuget.org/packages/elmah.io.uno)
[![Samples](https://img.shields.io/badge/samples-1-brightgreen.svg)](https://github.com/elmahio/elmah.io.uno/tree/main/samples)

# Logging to elmah.io from Uno

> The Uno integration for elmah.io is currently in prerelease.

Integrating Uno with elmah.io is done by installing the `Elmah.Io.Uno` NuGet package:

```powershell fct_label="Package Manager"
Install-Package Elmah.Io.Uno -IncludePrerelease
```
```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.Uno --prerelease
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.Uno" Version="4.0.19-pre" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.Uno
```

While configured in the shared project, the NuGet package will need to be installed in all platform projects.

`Elmah.Io.Uno` comes with a logger for Microsoft.Extensions.Logging. To configure the logger, open the `App.xaml.cs` file and locate the `InitializeLogging` method. Here you will see the logging configuration for your application. Include logging to elmah.io by calling the `AddElmahIo` method:

```csharp
var factory = LoggerFactory.Create(builder =>
{
    // ...
    builder.AddElmahIo("API_KEY", new Guid("LOG_ID"));
    // ...
});
```

Replace `API_KEY` with your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and `LOG_ID` ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)) with the log Id of the log you want to log to.

elmah.io will now automatically log all warning, error, and fatal messages to elmah.io. Uno log messages internally, but you can also do manual logging like this:

```csharp
this.Log().LogWarning("Oh no");
```

Logging with Uno's log helper will require you to add the following usings:

```csharp
using Microsoft.Extensions.Logging;
using Uno.Extensions;
```