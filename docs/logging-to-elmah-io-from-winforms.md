---
title: Logging to elmah.io from Windows Forms
description: Learn about how to set up cloud-logging on Windows Forms applications using elmah.io. Log all errors happening on installations of your client.
---

# Logging to elmah.io from Windows Forms

elmah.io logging can be easily added to Windows Forms applications. We don't provide a package specific for WinForms, but the `Elmah.Io.Client` package, combined with a bit of code, will achieve just the same.

To start logging to elmah.io, install the `Elmah.Io.Client` NuGet package:

```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.Client
```
```powershell fct_label="Package Manager"
Install-Package Elmah.Io.Client
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.Client" Version="5.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.Client
```

Add the following usings to the `Program.cs` file:

```csharp
using Elmah.Io.Client;
using System.Security.Principal;
using System.Threading;
```

Add an event handler to the `ThreadException` event in the `Main` method before calling `Application.Run`:

```csharp
Application.ThreadException += Application_ThreadException;
// ApplicationConfiguration.Initialize, Application.Run, and similar
```

Finally, add the `Application_ThreadException` method:

```csharp
static void Application_ThreadException(object sender, ThreadExceptionEventArgs e)
{
    var logger = ElmahioAPI.Create("API_KEY");
    var exception = e.Exception;
    var baseException = exception.GetBaseException();

    var data = exception.ToDataList() ?? new List<Item>();

    // Include this to log screen size
    if (Screen.PrimaryScreen != null)
    {
        data.Add(new Item("Screen-Width", Screen.PrimaryScreen.Bounds.Width.ToString()));
        data.Add(new Item("Screen-Height", Screen.PrimaryScreen.Bounds.Height.ToString()));
    }

    logger.Messages.Create("LOG_ID", new CreateMessage
    {
        DateTime = DateTime.UtcNow,
        Detail = exception.ToString(),
        Type = baseException.GetType().FullName,
        Title = baseException.Message ?? "An error occurred",
        Data = data,
        Severity = "Error",
        Source = baseException.Source,
        User = WindowsIdentity.GetCurrent().Name,
        Version = Application.ProductVersion,
        Hostname = Environment.MachineName ?? Environment.GetEnvironmentVariable("COMPUTERNAME"),
        ServerVariables = new List<Item>
        {
            new Item("User-Agent", $"X-ELMAHIO-APPLICATION; OS=Windows; OSVERSION={Environment.OSVersion.Version}; ENGINE=WinForms")
        }
    });

    Application.Exit();
}
```

Replace `API_KEY` with your API key ([Where is my API key?](where-is-my-api-key.md)) and `LOG_ID` with the id of the log ([Where is my log ID?](where-is-my-log-id.md)) where you want errors logged.

This example closes the application when an error occurs. If you only want to log the error, make sure to re-use the `logger` object:

```csharp
private static IElmahioAPI logger;

static void Application_ThreadException(object sender, ThreadExceptionEventArgs e)
{
    if (logger == null)
    {
        logger = ElmahioAPI.Create("API_KEY");
    }

    // ...
}
```