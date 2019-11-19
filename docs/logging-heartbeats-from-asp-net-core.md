# Logging heartbeats from ASP.NET Core

> The Heartbeats feature is currently in closed beta and highly experimental.

ASP.NET Core offers a feature called Health Checks from version 2.2 and forward. For more information about health checks, check out our blog post: [ASP.NET Core 2.2 Health Checks Explained](https://blog.elmah.io/asp-net-core-2-2-health-checks-explained/). The Heartbeats feature on elmah.io support health checks too, by publishing health check results as heartbeats.

To publish health checks as elmah.io heartbeats, install the `Elmah.Io.AspNetCore.HealthChecks` NuGet package:

```ps
Install-Package Elmah.Io.AspNetCore.HealthChecks -IncludePrerelease
```

Then configure the elmah.io health check publisher:

```csharp
services
    .AddHealthChecks()
    .AddElmahIoPublisher(options =>
    {
        options.ApiKey = "API_KEY";
        options.LogId = new Guid("LOG_ID");
        options.HeartbeatId = "HEARTBEAT_ID";
    });
```

Replace the variables with the correct values as explained in [Set up Heartbeats](/setup-heartbeats/). Remember to use an API key that includes the *Heartbeats - Write* permission.

As default, ASP.NET Core runs health checks every 30 seconds when setting up a publisher. To change this interval, add the following code:

```csharp
services.Configure<HealthCheckPublisherOptions>(options =>
{
    options.Period = TimeSpan.FromMinutes(5);
});
```

There's a bug in ASP.NET Core 2.2 that requires you to use reflection when setting `Period`:

```csharp
services.Configure<HealthCheckPublisherOptions>(options =>
{
    var prop = options.GetType().GetField("_period", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance);
    prop.SetValue(options, TimeSpan.FromMinutes(5));
});
```

If setting `Period` to 5 minutes, you should set the heartbeat interval on elmah.io to 5 minutes and grace to 1 minute.