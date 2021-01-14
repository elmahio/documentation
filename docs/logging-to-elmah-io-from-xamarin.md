# Logging to elmah.io from Xamarin

[TOC]

While we don't provide a package specific for Xamarin, logging uncaught exceptions can be accomplished using a bit of code. Start by installing the `Elmah.Io.Client` NuGet package:

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

If you are targeting a single platform, you can install the package directly in the startup project. If you are targeting multiple platforms, you can either install the package in all platform-specific projects or a shared project.

Additional steps will vary from platform to platform.

## Android

Locate your main activity class and look for the `OnCreate` method. Here, you'd want to set up event handlers for when uncaught exceptions happen:

```csharp
protected override void OnCreate(Bundle savedInstanceState)
{
    // ...

    AndroidEnvironment.UnhandledExceptionRaiser += AndroidEnvironment_UnhandledExceptionRaiser;
    AppDomain.CurrentDomain.UnhandledException += CurrentDomain_UnhandledException;
    TaskScheduler.UnobservedTaskException += TaskScheduler_UnobservedTaskException;

    // ... LoadApplication(new App()); etc.
}
```

Next, implement a method that can log an exception to elmah.io:

```csharp
private void LogExceptionToElmahIo(Exception exception)
{
    if (exception == null) return;

    if (elmahIoClient == null)
    {
        elmahIoClient = ElmahioAPI.Create("API_KEY");
    }

    var packageInfo = PackageManager.GetPackageInfo(PackageName, PackageInfoFlags.MetaData);

    var baseException = exception?.GetBaseException();
    var errorMessage = baseException?.Message ?? "Unhandled exception";
    try
    {
        elmahIoClient.Messages.Create("LOG_ID", new CreateMessage
        {
            Data = exception?.ToDataList(),
            DateTime = DateTime.UtcNow,
            Detail = exception?.ToString(),
            Severity = "Error",
            Source = baseException?.Source,
            Title = errorMessage,
            Type = baseException?.GetType().FullName,
            Version = packageInfo.VersionName,
            Application = packageInfo.PackageName,
        });
    }
    catch (Exception inner)
    {
        Android.Util.Log.Error("elmahio", inner.Message);
    }

    // Log to Android Device Logging.
    Android.Util.Log.Error("crash", errorMessage);
}
```

Replace `API_KEY` with your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and `LOG_ID` ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)) with the log Id of the log you want to log to.

Finally, implement the three event handlers that we added in the first step:

```csharp
private void TaskScheduler_UnobservedTaskException(object sender, UnobservedTaskExceptionEventArgs e)
{
    LogExceptionToElmahIo(e.Exception);
    e.SetObserved();
}

private void CurrentDomain_UnhandledException(object sender, UnhandledExceptionEventArgs e)
{
    LogExceptionToElmahIo(e.ExceptionObject as Exception);
}

private void AndroidEnvironment_UnhandledExceptionRaiser(object sender, RaiseThrowableEventArgs e)
{
    LogExceptionToElmahIo(e.Exception);
    e.Handled = true;
}
```

## iOS

Locate your main application class and look for the `Main` method. Here, you'd want to set up event handlers for when uncaught exceptions happen:

```csharp
static void Main(string[] args)
{
    // ...

    AppDomain.CurrentDomain.UnhandledException += CurrentDomain_UnhandledException;
    TaskScheduler.UnobservedTaskException += TaskScheduler_UnobservedTaskException;
}
```

Next, implement a method that can log an exception to elmah.io:

```csharp
private static void LogExceptionToElmahIo(Exception exception)
{
    if (exception == null) return;

    if (elmahIoClient == null)
    {
        elmahIoClient = ElmahioAPI.Create("API_KEY");
    }

    var baseException = exception?.GetBaseException();
    elmahIoClient.Messages.Create("LOG_ID", new CreateMessage
    {
        Data = exception?.ToDataList(),
        DateTime = DateTime.UtcNow,
        Detail = exception?.ToString(),
        Severity = "Error",
        Source = baseException?.Source,
        Title = baseException?.Message ?? "Unhandled exception",
        Type = baseException?.GetType().FullName,
    });
}
```

Replace `API_KEY` with your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and `LOG_ID` ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)) with the log Id of the log you want to log to.

Finally, implement the two event handlers that we added in the first step:

```csharp
private static void TaskScheduler_UnobservedTaskException(
    object sender, UnobservedTaskExceptionEventArgs e)
{
    LogExceptionToElmahIo(e.Exception);
    e.SetObserved();
}

private static void CurrentDomain_UnhandledException(object sender, UnhandledExceptionEventArgs e)
{
    LogExceptionToElmahIo(e.ExceptionObject as Exception);
}
```