---
title: Logging to elmah.io from WPF
description: Learn about how to set up cloud-logging on WPF applications using elmah.io. Catch and log all errors happening on installations of your client.
---

# Logging to elmah.io from WPF

elmah.io logging can be easily added to WPF applications. We don't provide a package specific to WPF, but the `Elmah.Io.Client` package, combined with a bit of code, will achieve just the same.

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