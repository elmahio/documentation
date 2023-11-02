---
title: Logging to elmah.io from SignalR
description: Easy logging and error monitoring in SignalR using elmah.io and Microsoft.Extensions.Logging. Get instant notifications when errors happen.
---

[![Build status](https://github.com/elmahio/Elmah.Io.Extensions.Logging/workflows/build/badge.svg)](https://github.com/elmahio/Elmah.Io.Extensions.Logging/actions?query=workflow%3Abuild)
[![NuGet](https://img.shields.io/nuget/v/Elmah.Io.Extensions.Logging.svg)](https://www.nuget.org/packages/Elmah.Io.Extensions.Logging)
[![Samples](https://img.shields.io/badge/samples-1-brightgreen.svg)](https://github.com/elmahio/Elmah.Io.Extensions.Logging/tree/main/samples/Elmah.Io.Extensions.Logging.AspNetCore31.SignalR)

# Logging to elmah.io from SignalR

Logging from SignalR is supported through our `Elmah.Io.Extensions.Logging` package. For details not included in this article, check out [Logging from Microsoft.Extensions.Logging](https://docs.elmah.io/logging-to-elmah-io-from-microsoft-extensions-logging/).

Start by installing the [Elmah.Io.Extensions.Logging](https://www.nuget.org/packages/Elmah.Io.Extensions.Logging/) package:

```powershell fct_label="Package Manager"
Install-Package Elmah.Io.Extensions.Logging
```
```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.Extensions.Logging
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.Extensions.Logging" Version="5.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.Extensions.Logging
```

In the `Program.cs` file, add a new `using` statement:

```csharp
using Elmah.Io.Extensions.Logging;
```

Then configure elmah.io like shown here:

```csharp
builder.Logging.AddElmahIo(options =>
{
    options.ApiKey = "API_KEY";
    options.LogId = new Guid("LOG_ID");
});
builder.Logging.AddFilter<ElmahIoLoggerProvider>(null, LogLevel.Warning);
```

Replace `API_KEY` with your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and `LOG_ID` ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)) with the log Id of the log you want to log to.

The code only logs `Warning`, `Error`, and `Fatal` messages. To change that you can change the `LogLevel` filter specified in the line calling the `AddFilter` method. You may also need to change log levels for SignalR itself:

```csharp
logging.AddFilter("Microsoft.AspNetCore.SignalR", LogLevel.Debug);
logging.AddFilter("Microsoft.AspNetCore.Http.Connections", LogLevel.Debug);
```

Be aware that changing log levels to `Debug` or lower will cause a lot of messages to be stored in elmah.io. Log levels can be specified through the `appsettings.json` file as with any other ASP.NET Core application. Check out [appsettings.json configuration](/logging-to-elmah-io-from-microsoft-extensions-logging/#appsettingsjson-configuration) for more details.