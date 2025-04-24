---
title: Logging heartbeats from Isolated Azure Functions
description: Monitor Isolated Azure Functions with elmah.io Heartbeats. Get instant notifications when someone accidentally stops or misconfigures functions.
---

# Logging heartbeats from Isolated Azure Functions

[TOC]

Isolated Azure Functions are great candidates for adding heartbeats. For web APIs implemented with Isolated Azure Functions, you should create a `/health` endpoint and ping that using [Uptime Monitoring](https://elmah.io/features/uptime-monitoring/). But for timer triggered, queue triggers, and similar function apps, heartbeats are a great way to verify that your function is successfully running. The rest of this document is split into different ways of adding heartbeats to one or more functions.

## Using middleware in Elmah.Io.Functions.Isolated

Scheduled functions or functions not running often can use the heartbeat middleware part of the `Elmah.Io.Functions.Isolated` package. This will log a `Healthy` or `Unhealthy` endpoint every time a function is running. All functions within the same function app uses the same middleware, why this is primarily inteded for function apps with one scheduled function.

Start by installing the `Elmah.Io.Functions.Isolated` package:

```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.Functions.Isolated
```
```powershell fct_label="Package Manager"
Install-Package Elmah.Io.Functions.Isolated
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.Functions.Isolated" Version="5.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.Functions.Isolated
```

Extend the `Program.cs` file with the following code:

```csharp
.ConfigureFunctionsWorkerDefaults((context, app) =>
{
    app.AddHeartbeat(options =>
    {
        options.ApiKey = "API_KEY";
        options.LogId = new Guid("LOG_ID");
        options.HeartbeatId = "HEARTBEAT_ID";
    });
})
```

The code installs the heartbeat middleware, which will handle all of the communication with the elmah.io API.

## Manually using Elmah.Io.Client

The example above installs the heartbeat filter for all functions. If you have multiple functions inside your function app, or you want greater control of when and how to send heartbeats, you can use `Elmah.Io.Client` to create heartbeats.

Start by installing the `Elmah.Io.Client` NuGet package:

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

Extend the `Program.cs` file with the following code:

```csharp
.ConfigureServices((ctx, services) =>
{
    var elmahIo = ElmahioAPI.Create("API_KEY");
    services.AddSingleton(elmahIo.Heartbeats);
});
```

Inside your function, wrap all of the code in `try/catch` and add code to create either a `Healthy` or `Unhealthy` heartbeat:

```csharp
public class TimedFunction
{
    private readonly IHeartbeats heartbeats;
    private readonly IConfiguration configuration;

    public TimedFunction(IHeartbeats heartbeats, IConfiguration configuration)
    {
        this.heartbeats = heartbeats;
        this.configuration = configuration;
    }

    [FunctionName("TimedFunction")]
    public async Task Run([TimerTrigger("0 0 * * * *")]TimerInfo myTimer)
    {
        var heartbeatId = configuration["heartbeatId"];
        var logId = configuration["logId"];
        try
        {
            // Your function code goes here

            await heartbeats.CreateAsync(heartbeatId, logId, new CreateHeartbeat
            {
                Result = "Healthy"
            });
        }
        catch (Exception e)
        {
            await heartbeats.CreateAsync(heartbeatId, logId, new CreateHeartbeat
            {
                Result = "Unhealthy",
                Reason = e.ToString(),
            });
        }
    }
}
```

If your function code executes successfully, a `Healthy` heartbeat is created. If an exception is thrown, an `Unhealthy` heartbeat with the thrown exception in `Reason` is created.

Be aware that configuring a function to run in an internal (like every hour for the example above) does not ensure that the function is executed exactly on the hour. We recommend to set the grace period for these types of heartbeats to 15-30 minutes to avoid heartbeat errors when the timed function is past due.

## Using a separate heartbeat function

You may want a single heartbeat representing your entire function app consisting of multiple functions. This is a good option if you want to create heartbeats from queue-triggered functions or similar. In these cases, you don't want to create a heartbeat every time a message from the queue is handled, but you will want to notify elmah.io if dependencies like database connection suddenly aren't available. We recommend creating a new heartbeat function for this kind of Function. Like in the previous example, make sure to extend your `Program.cs` file like this:

```csharp
.ConfigureServices((ctx, services) =>
{
    var elmahIo = ElmahioAPI.Create("API_KEY");
    services.AddSingleton(elmahIo.Heartbeats);
});
```

Then create a new timed function with the following code:

```csharp
using System;
using System.Threading.Tasks;
using Elmah.Io.Client;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Configuration;

namespace My.FunctionApp
{
    public class Heartbeat
    {
        private readonly IConfiguration config;
        private readonly IHeartbeats heartbeats;

        public Heartbeat(IHeartbeats heartbeats, IConfiguration config)
        {
            this.heartbeats = heartbeats;
            this.config = config;
        }

        [FunctionName("Heartbeat")]
        public async Task Run([TimerTrigger("0 */5 * * * *")]TimerInfo myTimer)
        {
            var result = "Healthy";
            var reason = (string)null;
            try
            {
                // Check your dependencies here
            }
            catch (Exception e)
            {
                result = "Unhealthy";
                reason = e.ToString();
            }

            await heartbeats.CreateAsync(config["heartbeatId"], config["logId"], new CreateHeartbeat
            {
                Result = result,
                Reason = reason,
            });
        }
    }
}
```

In the example above, the new function named `Heartbeat` (the name is entirely up to you) executes every 5 minutes. Replace the comment with your checks like opening a connection to the database. If everything works as it should, a `Healthy` heartbeat is logged to elmah.io. If an exception is thrown while checking your dependencies, an `Unhealthy` heartbeat is created.

When running locally, you may want to disable heartbeats:

```csharp
#if DEBUG
[FunctionName("Heartbeat")]
#endif
public async Task Run([TimerTrigger("0 */5 * * * *")]TimerInfo myTimer)
{
    // ...
}
```