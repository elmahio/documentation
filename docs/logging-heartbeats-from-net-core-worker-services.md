---
title: Logging heartbeats from .NET (Core) Worker Services
description: .NET (Core) offers Worker Services as a way to schedule recurring tasks. Monitoring that services run can be set up with elmah.io Heartbeats.
howto_steps:
  - name: Create a new heartbeat on elmah.io
    text: "Create a new heartbeat on the elmah.io UI. For a worker running every 5 minutes, set Interval to 5 minutes and Grace to 1 minute."
  - name: Install the Elmah.Io.Client package
    text: "Install the Elmah.Io.Client NuGet package, for example with the .NET CLI: dotnet add package Elmah.Io.Client"
  - name: Register IHeartbeatsClient
    text: |
      In Program.cs, register IHeartbeatsClient from the elmah.io client:
      var builder = Host.CreateApplicationBuilder(args);
      var elmahIoApi = ElmahioAPI.Create(builder.Configuration["ElmahIo:ApiKey"]);
      builder.Services.AddSingleton(elmahIoApi.Heartbeats);
      builder.Services.AddHostedService<Worker>();
  - name: Inject IHeartbeatsClient into the Worker
    text: |
      In the Worker class, inject IHeartbeatsClient and read the log ID and heartbeat ID from configuration:
      this.logId = new Guid(configuration["ElmahIo:LogId"]);
      this.heartbeatId = configuration["ElmahIo:HeartbeatId"];
  - name: Publish heartbeats from ExecuteAsync
    text: |
      In ExecuteAsync, wrap the worker code in try/catch and report the result:
      await heartbeats.HealthyAsync(logId, heartbeatId);
      on success, or in the catch block:
      await heartbeats.UnhealthyAsync(logId, heartbeatId, e.ToString());
  - name: Add the configuration to appsettings.json
    text: |
      Add the ElmahIo section to appsettings.json:
      {
        "ElmahIo": {
          "ApiKey": "API_KEY",
          "LogId": "LOG_ID",
          "HeartbeatId": "HEARTBEAT_ID"
        }
      }
      Replace the values with those from the elmah.io UI, using an API key with the Heartbeats | Write permission.
---

# Logging heartbeats from .NET (Core) Worker Services

.NET (Core) offers Worker Services as a way to schedule recurring tasks either hosted inside an ASP.NET Core website or as a Windows Service. Monitoring that Worker Services run successfully, can be easily set up with elmah.io Heartbeats.

To register heartbeats from a worker service, start by creating a new heartbeat on the elmah.io UI. For this example, we want to monitor that a Service Worker is running every 5 minutes, why we set *Interval* to 5 minutes and *Grace* to 1 minute. Next, install the `Elmah.Io.Client` NuGet package:

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

<div class="tabbable-responsive">
<div class="tabbable">
<ul class="nav nav-tabs" role="tablist">
    <li role="presentation" class="nav-item"><a class="nav-link active" href="#ihostapplicationbuilder" aria-controls="ihostapplicationbuilder" role="tab" data-bs-toggle="tab" data-bs-tab="ihostapplicationbuilder">IHostApplicationBuilder</a></li>
    <li role="presentation" class="nav-item"><a class="nav-link" href="#ihostbuilder" aria-controls="ihostbuilder" role="tab" data-bs-toggle="tab" data-bs-tab="ihostbuilder">IHostBuilder</a></li>
</ul>
</div>
</div>

<div class="tab-content tab-content-tabbable" markdown="1">
<div role="tabpanel" class="tab-pane active" id="ihostapplicationbuilder" markdown="1">
In the `Program.cs` file, register `IHeartbeatsClient` from the elmah.io client:

```csharp
var builder = Host.CreateApplicationBuilder(args);

var elmahIoApi = ElmahioAPI.Create(builder.Configuration["ElmahIo:ApiKey"]);
builder.Services.AddSingleton(elmahIoApi.Heartbeats);
// ...
builder.Services.AddHostedService<Worker>();
```
</div>

<div role="tabpanel" class="tab-pane" id="ihostbuilder" markdown="1">
In the `Program.cs` file, register `IHeartbeatsClient` from the elmah.io client:

```csharp
.ConfigureServices((hostContext, services) =>
{
    var elmahIoApi = ElmahioAPI.Create(hostContext.Configuration["ElmahIo:ApiKey"]);
    services.AddSingleton(elmahIoApi.Heartbeats);
    // ...
    services.AddHostedService<Worker>();
});
```
</div>
</div>

In the example, the configuration should be made available in the `appsettings.json` file as shown later in this article.

In the service class (`Worker`) you can inject the `IHeartbeatsClient` object, as well as additional configuration needed to create heartbeats:

```csharp
public class Worker : BackgroundService
{
    private readonly IHeartbeatsClient heartbeats;
    private readonly Guid logId;
    private readonly string heartbeatId;

    public Worker(IHeartbeatsClient heartbeats, IConfiguration configuration)
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