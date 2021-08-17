# Logging to elmah.io from Windows Forms

elmah.io logging can be easily added to Windows Forms applications. We don't provide a package specific for WinForms, but the `Elmah.Io.Client` package, combined with a bit of code, will achieve just the same.

To start logging to elmah.io, install the `Elmah.Io.Client` NuGet package:

```powershell fct_label="Package Manager"
Install-Package Elmah.Io.Client
```
```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.Client
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.Client" Version="3.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.Client
```

Add the following usings to the `Program.cs` file:

```csharp
using Elmah.Io.Client;
using Elmah.Io.Client.Models; // 👈 Required for Elmah.Io.Client v3.x and lower only
using System.Security.Principal;
using System.Threading;
```

Add an event handler to the `ThreadException` event in the `Main` method:

```csharp
Application.ThreadException += Application_ThreadException;
```

Finally, add the `Application_ThreadException` method:

```csharp
static void Application_ThreadException(object sender, ThreadExceptionEventArgs e)
{
    var logger = ElmahioAPI.Create("API_KEY");
    var exception = e.Exception;
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

    Application.Exit();
}
```

Replace `API_KEY` with your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and `LOG_ID` with the id of the log ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)) where you want errors logged.

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