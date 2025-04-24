---
title: Logging heartbeats from Coravel
description: Monitoring if Coravel scheduled tasks are successfully executed or even run can be a challenge. With elmah.io Heartbeats, we provide monitoring.
---

# Logging heartbeats from Coravel

Coravel supports scheduled tasks similar to Quartz and Hangfire. With elmah.io Heartbeats, monitoring if and when Coraval tasks are running is easy.

To publish heartbeats from Coravel, install the `Elmah.Io.Client` NuGet package:

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

For this example, we'll schedule a job named `MyJob` to execute every minute:

```csharp
builder.Services.AddTransient<MyJob>();
builder.Services.AddScheduler();

// ...

app.Services.UseScheduler(scheduler =>
{
    scheduler.Schedule<MyJob>().EveryMinute();
});
```

To automatically publish a heartbeat when the job is executed, add the following code to the same file where you configure Coravel:

```csharp
var elmahIoClient = ElmahioAPI.Create("API_KEY", new ElmahIoOptions
{
    Timeout = TimeSpan.FromSeconds(30)
});
builder.Services.AddSingleton(elmahIoClient.Heartbeats);
```

Replace `API_KEY` ([Where is my API key?](where-is-my-api-key.md)) with an API key containing permission to create heartbeats.

In the `MyJob` class, you can inject the `IHeartbeatsClient` and wrap the job code in a `try/catch` block:

```csharp
public class MyJob : IInvocable
{
    private readonly IHeartbeatsClient heartbeats;

    public MyJob(IHeartbeatsClient heartbeats)
    {
        this.heartbeats = heartbeats;
    }

    public async Task Invoke()
    {
        var logId = new Guid("LOG_ID");
        var heartbeatId = "HEARTBEAT_ID";
        var stopwatch = new Stopwatch();
        try
        {
            stopwatch.Start();

            // Execute your job

            await heartbeats.HealthyAsync(logId, heartbeatId, took: stopwatch.ElapsedMilliseconds);
        }
        catch (Exception e)
        {
            await heartbeats.UnhealthyAsync(logId, heartbeatId, e.ToString(), took: stopwatch.ElapsedMilliseconds);
            throw;
        }
    }
}
```

Replace `LOG_ID` ([Where is my log ID?](where-is-my-log-id.md)) and `HEARTBEAT_ID` with the correct values from elmah.io.

When the job successfully runs, a `Healthy` heartbeat is logged to elmah.io. If an exception is thrown an `Unhealthy` heartbeat is logged. elmah.io will automatically create an error if a heartbeat is missing, as long as the heartbeat is correctly configured as explained in [Set up Heartbeats](setup-heartbeats.md).