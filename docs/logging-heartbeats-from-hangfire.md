[![Build status](https://github.com/elmahio/Elmah.Io.Heartbeats.Hangfire/workflows/build/badge.svg)](https://github.com/elmahio/Elmah.Io.Heartbeats.Hangfire/actions?query=workflow%3Abuild)
[![NuGet](https://img.shields.io/nuget/v/Elmah.Io.Heartbeats.Hangfire.svg)](https://www.nuget.org/packages/Elmah.Io.Heartbeats.Hangfire)
[![Samples](https://img.shields.io/badge/samples-1-brightgreen.svg)](https://github.com/elmahio/Elmah.Io.Heartbeats.Hangfire/tree/main/samples)

# Logging heartbeats from Hangfire

Scheduling recurring tasks with Hangfire is easy. Monitoring if tasks successfully execute or even run can be a challenge. With elmah.io Heartbeats we provide native monitoring of Hangfire recurring taks.

To publish heartbeats from Hangifre, install the `Elmah.Io.Heartbeats.Hangfire` NuGet package:

```powershell fct_label="Package Manager"
Install-Package Elmah.Io.Heartbeats.Hangfire
```
```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.Heartbeats.Hangfire
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.Heartbeats.Hangfire" Version="4.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.Heartbeats.Hangfire
```

For this example, we'll schedule a method named `Test` to execute every minute:

```csharp
RecurringJob.AddOrUpdate(() => Test(), Cron.Minutely);
```

To automatically publish a heartbeat when the job is executed, add the following `using`:

```csharp
using Elmah.Io.Heartbeats.Hangfire;
```

And decorate the `Test`-method with the `ElmahIoHeartbeat` attribute:

```csharp
[ElmahIoHeartbeat("API_KEY", "LOG_ID", "HEARTBEAT_ID")]
public void Test()
{
    // ...
}
```

Replace `API_KEY` ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)), `LOG_ID` ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)), and `HEARTBEAT_ID` with the correct variables from elmah.io.

When the job successfully runs, a `Healthy` heartbeat is logged to elmah.io. If an exception is thrown an `Unhealthy` heartbeat is logged. elmah.io will automatically create an error if a heartbeat is missing, as long as the heartbeat is correctly configured as explained in [Set up Heartbeats](https://docs.elmah.io/setup-heartbeats/).

## Move configuration to config files

You normally don't include your API key, log ID and heartbeat ID in C# code as shown in the example above. Unfortunately, Hangfire attributes doesn't support dependency injection or configuration from config files. There's a small "hack" that you can use to move configuration to a configuration file by creating a custom attribute:

```csharp
using Elmah.Io.Heartbeats.Hangfire;
using Hangfire.Common;
using Hangfire.Server;
using System.Configuration;

public class AppSettingsElmahIoHeartbeatAttribute : JobFilterAttribute, IServerFilter
{
    private readonly ElmahIoHeartbeatAttribute _inner;

    public AppSettingsElmahIoHeartbeatAttribute()
    {
        var apiKey = ConfigurationManager.AppSettings["apiKey"];
        var logId = ConfigurationManager.AppSettings["logId"];
        var heartbeatId = ConfigurationManager.AppSettings["heartbeatId"];
        _inner = new ElmahIoHeartbeatAttribute(apiKey, logId, heartbeatId);
    }

    public void OnPerformed(PerformedContext filterContext)
    {
        _inner.OnPerformed(filterContext);
    }

    public void OnPerforming(PerformingContext filterContext)
    {
        _inner.OnPerforming(filterContext);
    }
}
```

In the example the `AppSettingsElmahIoHeartbeatAttribute` class wrap `ElmahIoHeartbeatAttribute`. By doing so, it is possible to fetch configuration from application settings as part of the constructor. The approach would be similar when using `IConfiguration` (like in ASP.NET Core), but you will need to share a reference to the configuration object somehow.

To use `AppSettingsElmahIoHeartbeatAttribute` simply add it to the method:

```csharp
[AppSettingsElmahIoHeartbeat]
public void Test()
{
    // ...
}
```

As an alternative you can register the `ElmahIoHeartbeatAttribute` as a global attribute. In this example we use `IConfiguration` in ASP.NET Core to fetch configuration from the `appsettings.json` file:

```csharp
public class Startup
{
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddHangfire(config => config
            // ...
            .UseFilter(new ElmahIoHeartbeatAttribute(
                Configuration["ElmahIo:ApiKey"],
                Configuration["ElmahIo:LogId"],
                Configuration["ElmahIo:HeartbeatId"])));
    }

    // ...
}
```

This will execute the `ElmahIoHeartbeat` filter for every Hangfire job which isn't ideal if running multiple jobs within the same project.