[![Build status](https://ci.appveyor.com/api/projects/status/600b3gwr4vh8qxsd?svg=true)](https://ci.appveyor.com/project/ThomasArdal/elmah-io-heartbeats-hangfire)
[![NuGet](https://img.shields.io/nuget/v/Elmah.Io.Heartbeats.Hangfire.svg)](https://www.nuget.org/packages/Elmah.Io.Heartbeats.Hangfire)
[![Samples](https://img.shields.io/badge/samples-1-brightgreen.svg)](https://github.com/elmahio/Elmah.Io.Heartbeats.Hangfire/tree/master/samples)

# Logging heartbeats from Hangfire

> The Heartbeats feature is currently in closed beta and highly experimental.

Scheduling recurring tasks with Hangfire is easy. Monitoring if tasks successfully execute or even run can be a challenge. With elmah.io Heartbeats we provide native monitoring of Hangfire recurring taks.

To publish heartbeats from Hangifre, install the `Elmah.Io.Heartbeats.Hangfire` NuGet package:

```ps
Install-Package Elmah.Io.Heartbeats.Hangfire -IncludePrerelease
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
    ...
}
```

Replace `API_KEY` ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)), `LOG_ID` ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)), and `HEARTBEAT_ID` with the correct variables from elmah.io.

When the job successfully runs, a `Healthy` heartbeat is logged to elmah.io. If an exception is thrown an `Unhealthy` heartbeat is logged. elmah.io will automatically create an error if a heartbeat is missing, as long as the heartbeat is correctly configured as explained in [Set up Heartbeats](https://docs.elmah.io/setup-heartbeats/).