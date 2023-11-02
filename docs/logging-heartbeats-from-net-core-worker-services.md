---
title: Logging heartbeats from .NET (Core) Worker Services
description: .NET (Core) offers Worker Services as a way to schedule recurring tasks. Monitoring that services run can be set up with elmah.io Heartbeats.
---

# Logging heartbeats from .NET (Core) Worker Services

.NET (Core) offers Worker Services as a way to schedule recurring tasks either hosted inside an ASP.NET Core website or as a Windows Service. Monitoring that Worker Services run successfully, can be easily set up with elmah.io Heartbeats.

To register heartbeats from a worker service, start by creating a new heartbeat on the elmah.io UI. For this example, we want to monitor that a Service Worker is running every 5 minutes, why we set *Interval* to 5 minutes and *Grace* to 1 minute. Next, install the `Elmah.Io.Client` NuGet package:

```powershell fct_label="Package Manager"
Install-Package Elmah.Io.Client
```
```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.Client
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.Client" Version="5.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.Client
```

In the `Program.cs` or `Startup.cs` file (depending on where you register dependencies), register `IHeartbeats` from the elmah.io client:

```csharp
.ConfigureServices((hostContext, services) =>
{
    var elmahIoApi = ElmahioAPI.Create(hostContext.Configuration["ElmahIo:ApiKey"]);
    services.AddSingleton(elmahIoApi.Heartbeats);
    // ...
    services.AddHostedService<Worker>();
});
```

In the example, the configuration should be made available in the `appsettings.json` file as shown later in this article.

In the service class (`Worker`) you can inject the `IHeartbeats` object, as well as additional configuration needed to create heartbeats:

```csharp
public class Worker : BackgroundService
{
    private readonly IHeartbeats heartbeats;
    private readonly Guid logId;
    private readonly string heartbeatId;

    public Worker(IHeartbeats heartbeats, IConfiguration configuration)
    {
        this.heartbeats = heartbeats;
        this.logId = new Guid(configuration["ElmahIo:LogId"]);
        this.heartbeatId = configuration["ElmahIo:HeartbeatId"];
    }
}
```

Inside the `ExecuteAsync` method, wrap the worker code in try-catch and call the `HealthyAsync` method when the worker successfully run and the `UnhealthyAsync` method when an exception occurs:

```csharp
protected override async Task ExecuteAsync(CancellationToken stoppingToken)
{
    while (!stoppingToken.IsCancellationRequested)
    {
        try
        {
            // Do work

            await heartbeats.HealthyAsync(logId, heartbeatId);
        }
        catch (Exception e)
        {
            await heartbeats.UnhealthyAsync(logId, heartbeatId, e.ToString());
        }

        await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
    }
}
```

In the `appsettings.json` file, add the elmah.io configuration:

```json
{
  "ElmahIo": {
    "ApiKey": "API_KEY",
    "LogId": "LOG_ID",
    "HeartbeatId": "HEARTBEAT_ID"
  }
}
```

Replace the values with values found in the elmah.io UI. Remember to enable the *Heartbeats* | *Write* permission on the used API key.