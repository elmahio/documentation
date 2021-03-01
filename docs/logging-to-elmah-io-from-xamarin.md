[![Build status](https://github.com/elmahio/elmah.io.xamarin/workflows/build/badge.svg)](https://github.com/elmahio/elmah.io.xamarin/actions?query=workflow%3Abuild)
[![NuGet](https://img.shields.io/nuget/v/elmah.io.xamarin.svg)](https://www.nuget.org/packages/elmah.io.xamarin)
[![Samples](https://img.shields.io/badge/samples-3-brightgreen.svg)](https://github.com/elmahio/elmah.io.xamarin/tree/main/samples)

# Logging to elmah.io from Xamarin

[TOC]

> The Xamarin integration for elmah.io is currently in prerelease.

Integrating Xamarin with elmah.io is done by installing the `Elmah.Io.Xamarin` NuGet package:

```powershell fct_label="Package Manager"
Install-Package Elmah.Io.Xamarin -IncludePrerelease
```
```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.Xamarin --prerelease
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.Xamarin" Version="3.0.7-pre" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.Xamarin
```

For each platform (Android and iOS) you will need to set up elmah.io as illustrated in the following sections. The code is the same for both Xamarin and Xamarin.Forms.

## Android

Open the `MainActivity.cs` file and add the following `using` statements:

```csharp
using Elmah.Io.Xamarin;
using System.Threading.Tasks;
```

Locate the `OnCreate` method and add the following code before all other lines:

```csharp
ElmahIoXamarin.Init(new ElmahIoXamarinOptions
{
    ApiKey = "API_KEY",
    LogId = new Guid("LOG_ID"),
});
AndroidEnvironment.UnhandledExceptionRaiser += (sender, e) =>
{
    e.Exception.Log();
    e.Handled = true;
};
TaskScheduler.UnobservedTaskException += (sender, e) =>
{
    e.Exception.Log();
    e.SetObserved();
};
```

Replace `API_KEY` with your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and `LOG_ID` ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)) with the log Id of the log you want to log to.

Calling the `Init` method will initialize elmah.io. For more configuration options see the [Additional configuration](#additional-configuration) section. The code then subscribes to the `UnhandledExceptionRaiser` and `UnobservedTaskException` events which will log any exceptions to elmah.io using the `Log` method.

## iOS

Open the `Main.cs` file and add the following `using` statements:

```csharp
using System;
using System.Threading.Tasks;
using Elmah.Io.Xamarin;
```

Locate the `Main` method and add the following code after the call to `UIApplication.Main`:

```csharp
ElmahIoXamarin.Init(new ElmahIoXamarinOptions
{
    ApiKey = "API_KEY",
    LogId = new Guid("LOG_ID"),
});
AppDomain.CurrentDomain.UnhandledException += (sender, e) =>
{
    (e.ExceptionObject as Exception).Log();
};
TaskScheduler.UnobservedTaskException += (sender, e) =>
{
    e.Exception.Log();
    e.SetObserved();
};
```

Replace `API_KEY` with your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and `LOG_ID` ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)) with the log Id of the log you want to log to.

Calling the `Init` method will initialize elmah.io. For more configuration options see the [Additional configuration](#additional-configuration) section. The code then subscribes to the `UnhandledException` and `UnobservedTaskException` events which will log any exceptions to elmah.io using the `Log` method.

## Log exceptions manually

Once the `ElmahIoXamarin.Init` method has been configured during initialization of the app, any exception can be logged manually using the `Log` method available in the `Elmah.Io.Xamarin` namespace:

```csharp
try
{
    // Code that may break
}
catch (Exception e)
{
    e.Log();
}
```

## Additional configuration

Besides the mandatory properties `ApiKey` and `LogId` the `ElmahIoXamarinOptions` provide a range of other configuration parameters.

### Application

The elmah.io integration for Xamarin will automatically use the package name for the `Application` field. To override this you can set the application name in settings:

```csharp
ElmahIoXamarin.Init(new ElmahIoXamarinOptions
{
    // ...
    Application = "MyApp"
});
```

### Version

The elmah.io integration for Xamarin will automatically use the package version for the `Version` field. To override this you can set the version string in settings:

```csharp
ElmahIoXamarin.Init(new ElmahIoXamarinOptions
{
    // ...
    Version = "1.0.2"
});
```

### Decorating all messages

All log messages logged through this integration can be decorated with the `OnMessage` action:

```csharp
ElmahIoXamarin.Init(new ElmahIoXamarinOptions
{
    // ...
    OnMessage = msg =>
    {
        msg.Source = "Custom source";
    }
});
```

### Filtering log messages

Log messages can be filtered directly on the device to avoid specific log messages from being sent to elmah.io with the `OnFilter` function:

```csharp
ElmahIoXamarin.Init(new ElmahIoXamarinOptions
{
    // ...
    OnFilter = msg => msg.Title.Contains("foo")
});
```

This code will automatically ignore all log messages with the text `foo` in the title.

### Handling errors

You may want to handle the scenario where the device cannot communicate with the elmah.io API. You can use the `OnError` action:

```csharp
ElmahIoXamarin.Init(new ElmahIoXamarinOptions
{
    // ...
    OnError = (msg, ex) =>
    {
        // Do something with ex
    }
});
```

## Legacy integration

If you prefer you can configure elmah.io manually without the use of the `Elmah.Io.Xamarin` package. This is not the recommended way to integrate with elmah.io from Xamarin and this approach will be discontinued.

Start by installing the `Elmah.Io.Client` NuGet package:

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

### Android

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

### iOS

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