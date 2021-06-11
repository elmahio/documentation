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
<PackageReference Include="Elmah.Io.Xamarin" Version="4.0.19-pre" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.Xamarin
```

For each platform (Android and iOS) you will need to set up elmah.io as illustrated in the following sections. The code is the same for both Xamarin and Xamarin.Forms.

<div class="tabbable-responsive">
<div class="tabbable">
<ul class="nav nav-tabs" role="tablist">
    <li role="presentation" class="nav-item"><a class="nav-link active" href="#android" aria-controls="home" role="tab" data-toggle="tab">Android</a></li>
    <li role="presentation" class="nav-item"><a class="nav-link" href="#ios" aria-controls="home" role="tab" data-toggle="tab">iOS</a></li>
</ul>
</div>
</div>

 <div class="tab-content tab-content-tabbable">
<div role="tabpanel" class="tab-pane active" id="android">
Open the <code>MainActivity.cs</code> file and add the following <code>using</code> statements:

```csharp
using System;
using Elmah.Io.Xamarin;
```

Locate the <code>OnCreate</code> method and add the following code before all other lines:

```csharp
ElmahIoXamarin.Init(new ElmahIoXamarinOptions
{
    ApiKey = "API_KEY",
    LogId = new Guid("LOG_ID"),
});
```

Replace <code>API_KEY</code> with your API key (<a href="https://docs.elmah.io/where-is-my-api-key">Where is my API key?</a>) and <code>LOG_ID</code> (<a href="https://docs.elmah.io/where-is-my-log-id">Where is my log ID?</a>) with the log Id of the log you want to log to.

Calling the <code>Init</code> method will initialize elmah.io. For more configuration options see the <a href="#additional-configuration">Additional configuration</a> section.
</div>
<div role="tabpanel" class="tab-pane active" id="ios">
Open the <code>Main.cs</code> file and add the following <code>using</code> statements:

```csharp
using System;
using Elmah.Io.Xamarin;
```

Locate the <code>Main</code> method and add the following code after the call to <code>UIApplication.Main</code>:

```csharp
ElmahIoXamarin.Init(new ElmahIoXamarinOptions
{
    ApiKey = "API_KEY",
    LogId = new Guid("LOG_ID"),
});
```

Replace <code>API_KEY</code> with your API key (<a href="https://docs.elmah.io/where-is-my-api-key">Where is my API key?</a>) and <code>LOG_ID</code> (<a href="https://docs.elmah.io/where-is-my-log-id/">Where is my log ID?</a>) with the log Id of the log you want to log to.

Calling the <code>Init</code> method will initialize elmah.io. For more configuration options see the <a href="#additional-configuration">Additional configuration</a> section.
</div>
</div>

## Log exceptions manually

Once the `ElmahIoXamarin.Init` method has been configured during initialization of the app, any exception can be logged manually using the `Log` methods available in the `Elmah.Io.Xamarin` namespace:

```csharp
try
{
    // Code that may break
}
catch (Exception e)
{
    // Log the exception with the Log extension-method:
    
    e.Log();

    // or use the Log method on ElmahIoXamarin:

    ElmahIoXamarin.Log(e);
}
```

## Breadcrumbs

Breadcrumbs can be a great help when needing to figure out how a user ended up with an error. To log breadcrumbs you can use the `AddBreadcrumb` method on `ElmahIoXamarin`. The following is a sample for Android which will log breadcrumbs on interesting events:

```csharp
public class MainActivity : AppCompatActivity, BottomNavigationView.IOnNavigationItemSelectedListener
{
    public override void OnBackPressed()
    {
        ElmahIoXamarin.AddBreadcrumb("OnBackPressed", DateTime.UtcNow, action: "Navigation");
        base.OnBackPressed();
    }

    protected override void OnPause()
    {
        ElmahIoXamarin.AddBreadcrumb("OnPause", DateTime.UtcNow);
        base.OnPause();
    }

    // ...

    public bool OnNavigationItemSelected(IMenuItem item)
    {
        switch (item.ItemId)
        {
            case Resource.Id.navigation_home:
                ElmahIoXamarin.AddBreadcrumb("Navigate to Home", DateTime.UtcNow, action: "Navigation");
                textMessage.SetText(Resource.String.title_home);
                return true;
            case Resource.Id.navigation_dashboard:
                ElmahIoXamarin.AddBreadcrumb("Navigate to Dashboard", DateTime.UtcNow, action: "Navigation");
                textMessage.SetText(Resource.String.title_dashboard);
                return true;
            case Resource.Id.navigation_notifications:
                ElmahIoXamarin.AddBreadcrumb("Navigate to Notifications", DateTime.UtcNow, action: "Navigation");
                textMessage.SetText(Resource.String.title_notifications);
                return true;
        }
        return false;
    }
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

<div class="tabbable-responsive">
<div class="tabbable">
<ul class="nav nav-tabs" role="tablist">
    <li role="presentation" class="nav-item"><a class="nav-link active" href="#androidlegacy" aria-controls="home" role="tab" data-toggle="tab">Android</a></li>
    <li role="presentation" class="nav-item"><a class="nav-link" href="#ioslegacy" aria-controls="home" role="tab" data-toggle="tab">iOS</a></li>
</ul>
</div>
</div>

 <div class="tab-content tab-content-tabbable">
<div role="tabpanel" class="tab-pane active" id="androidlegacy">
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
</div>
<div role="tabpanel" class="tab-pane active" id="ioslegacy">
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
</div>
</div>
