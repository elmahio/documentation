---
title: Set up Heartbeats
description: Heartbeats complement the elmah.io Error Logging and Uptime Monitoring features. Learn about monitoring scheduled tasks and services.
---

# Set up Heartbeats

[TOC]

elmah.io Heartbeats complements the Error Logging and Uptime Monitoring features already available on elmah.io. Where Uptime Monitoring is based on us pinging your public HTTP endpoints, Heartbeats is the other way around. When configured, your services, scheduled tasks, and websites ping the elmah.io in a specified interval. We call these ping Heartbeats, hence the name of the feature. Whether you should use Uptime Monitoring or Heartbeats to monitor your code, depends on a range of variables. Uptime Monitoring is great at making sure that your public endpoints can be reached from multiple locations. Scheduled tasks and services typically don't have public endpoints and are expected to run at a specified interval. With Heartbeats, setting up monitoring on these kinds of services is extremely easy, since elmah.io will automatically detect when an unhealthy heartbeat is received or if no heartbeat is received.

Click one of the integrations below or continue reading to learn more about Heartbeats:

<div class="guides-boxes row">
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/logging-heartbeats-from-asp-net-core/" title="ASP.NET Core">
            <div class="guide-box">
                <div class="guide-image">
                    <img class="no-lightbox" src="/./assets/img/guides/aspnetcore.png" alt="ASP.NET Core" />
                </div>
                <div class="guide-title">ASP.NET Core</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/logging-heartbeats-from-azure-functions/" title="Azure Functions">
            <div class="guide-box">
                <div class="guide-image">
                    <img class="no-lightbox" src="/./assets/img/guides/azure-functions.png" alt="Azure Functions" />
                </div>
                <div class="guide-title">Functions</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/logging-heartbeats-from-isolated-azure-functions/" title="Isolated Azure Functions">
            <div class="guide-box">
                <div class="guide-image">
                    <img class="no-lightbox" src="/./assets/img/guides/azure-functions.png" alt="Isolated Azure Functions" />
                </div>
                <div class="guide-title">Isolated Functions</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/logging-heartbeats-from-powershell/" title="PowerShell">
            <div class="guide-box">
                <div class="guide-image">
                    <img class="no-lightbox" src="/./assets/img/guides/powershell.png" alt="PowerShell" />
                </div>
                <div class="guide-title">PowerShell</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/logging-heartbeats-from-curl/" title="cURL">
            <div class="guide-box">
                <div class="guide-image">
                    <img class="no-lightbox" src="/./assets/img/guides/curl.png" alt="cURL" />
                </div>
                <div class="guide-title">cURL</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/logging-heartbeats-from-umbraco/" title="Umbraco">
            <div class="guide-box">
                <div class="guide-image">
                    <img class="no-lightbox" src="/./assets/img/guides/umbraco.png" alt="Umbraco" />
                </div>
                <div class="guide-title">Umbraco</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/logging-heartbeats-from-hangfire/" title="Hangfire">
            <div class="guide-box">
                <div class="guide-image">
                    <img class="no-lightbox" src="/./assets/img/guides/hangfire.png" alt="Hangfire" />
                </div>
                <div class="guide-title">Hangfire</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/logging-heartbeats-from-coravel/" title="Coravel">
            <div class="guide-box">
                <div class="guide-image">
                    <img class="no-lightbox" src="/./assets/img/guides/coravel.png" alt="Coravel" />
                </div>
                <div class="guide-title">Coravel</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/logging-heartbeats-from-net-core-worker-services/" title="Worker Services">
            <div class="guide-box">
                <div class="guide-image">
                    <img class="no-lightbox" src="/./assets/img/guides/aspnetcore.png" alt="Worker Services" />
                </div>
                <div class="guide-title">Worker Services</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/logging-heartbeats-from-aws-lambdas/" title="AWS Lambda">
            <div class="guide-box">
                <div class="guide-image">
                    <img class="no-lightbox" src="/./assets/img/guides/aws-lambda.png" alt="AWS Lambda" />
                </div>
                <div class="guide-title">AWS Lambda</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/logging-heartbeats-from-windows-scheduled-tasks/" title="Windows Scheduled Tasks">
            <div class="guide-box">
                <div class="guide-image">
                    <img class="no-lightbox" src="/./assets/img/guides/windows-scheduled-tasks.png" alt="Windows Scheduled Tasks" />
                </div>
                <div class="guide-title">Scheduled Tasks</div>
            </div>
        </a>
    </div>
</div>

To better understand Heartbeats, let's create a simple example. For detailed instructions on how to set up Heartbeats in different languages and frameworks, select one of the specific articles in the left menu.

In this example, we will extend a C# console application, executed as a Windows Scheduled task, with a heartbeat. The scheduled task is run every 30 minutes.

Open a log on elmah.io and navigate to the *Heartbeats* tab:

![No heartbeats](images/no-heartbeats-v2.png)

Click the *Add Heartbeat* button and fill in a name. For *Interval* we are selecting 30 minutes since the task is scheduled to run every 30 minutes. For *Grace*, we select 5 minutes to give the task a chance to complete. Selecting 30 and 5 minutes means that elmah.io will log an error if more than 35 minutes pass since we last heard from the task:

![Create heartbeat](images/create-heartbeat-v2.png)

To create heartbeats from our task, we will need an API key, a log ID, and a heartbeat ID. Let's start with the API key. Go to the organization settings page and click the *API Keys* tab. Add a new API key and check the *Heartbeats - Write* permission only:

![Create Heartbeats API key](images/create-heartbeats-api-key-v2.png)

Copy and store the API key somewhere. Navigate back to your log and click the *Instructions* link on the newly created Heartbeat. This will reveal the log ID and heartbeat ID. Copy and store both values since we will need them in a minute.

Time to do the integration. Like mentioned before, there are multiple ways of invoking the API. For this example, we'll use C#. Install the `Elmah.Io.Client` NuGet package:

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

Extend your C# with the following code:

```csharp
using Elmah.Io.Client;

public class Program
{
    public static void Main()
    {
        var logId = new Guid("LOG_ID");
        var api = ElmahioAPI.Create("API_KEY");
        try
        {
            // Your task code goes here

            api.Heartbeats.Healthy(logId, "HEARTBEAT_ID");
        }
        catch (Exception e)
        {
            api.Heartbeats.Unhealthy(logId, "HEARTBEAT_ID");
        }
    }
}
```

Replace `LOG_ID`, `API_KEY`, and `HEARTBEAT_ID` with the values stored in the previous steps.

When the code runs without throwing an exception, your task now creates a `Healthy` heartbeat. If an exception occurs, the code creates an `Unhealthy` heartbeat and uses the exception text as the reason. There's an additional method named `Degraded` for logging a degraded heartbeat.

Depending on the heartbeat status, a log message can be created in the configured log. Log messages are only created on state changes. This means that if logging two `Unhealthy` requests, only the first request triggers a new error. If logging a `Healthy` heartbeat after logging an `Unhealthy` heartbeat, an information message will be logged. Transitioning to `Degraded` logs a warning.

## Additional properties

### Reason

The `Healthy`, `Unhealthy`, and `Degraded` methods (or the `CreateHeartbeat` class when using the raw `Create` method) accept an additional parameter named `reason`.

`reason` can be used to specify why a heartbeat check is either `Degraded` or `Unhealthy`. If your service throws an exception, the full exception including its stack trace is a good candidate for the `reason` parameter. When using integrations like the one with ASP.NET Core Health Checks, the health check report is used as the reason for the failing heartbeat.

### Application and Version

When logging errors through one or more of the integrations, you may already use the `Application` and/or `Version` fields to set an application name and software version on all messages logged to elmah.io. Since Heartbeats will do the actual logging of messages, in this case, you can configure it to use the same application name and/or version number as your remaining integrations.

```csharp
api.Heartbeats.Unhealthy(logId, "HEARTBEAT_ID", application: "MyApp", version: "1.0.0");
```

If an application name is not configured, all messages logged from Heartbeats will get a default value of `Heartbeats`. If no version number is configured, log messages from Heartbeats will be assigned the latest version created through [Deployment Tracking](https://elmah.io/features/deployment-tracking/).

### Took

A single performance metric named `Took` can be logged alongside a heartbeat. The value should be the elapsed time in milliseconds for the job, scheduled task, or whatever code resulting in the heartbeat. For a scheduled task, the `Took` value would be the time from the scheduled task start until the task ends:

```csharp
var stopwatch = new Stopwatch();
stopwatch.Start();
// run job
stopwatch.Stop();
api.Heartbeats.Healthy(
    logId,
    heartbeatId,
    took: stopwatch.ElapsedMilliseconds);
```

The value of the `Took` property is shown in the *History* modal on the *Heartbeats* page on elmah.io.

### Checks

!!! note
    Checks require `Elmah.Io.Client` version `5.1.*` or newer.

Some sites and services implement a range of different checks to decide if the program is healthy or not. Consider an ASP.NET Core website that verifies that both a connection to a database and a service bus can be established. In this example, a failing heartbeat to elmah.io can be decorated with one or more `Checks`:

```csharp
api.Heartbeats.Unhealthy(logId, heartbeatId, checks: new List<Check>
{
    new Check
    {
        Name = "Database",
        Result = "Unhealthy",
        Reason = "Could not connect to database"
    },
    new Check
    {
        Name = "Service Bus",
        Result = "Healthy"
    },
});
```

When logging checks in a heartbeat, the elmah.io UI will list each check on the *Root Cause* tab part of the unhealthy heartbeat error.