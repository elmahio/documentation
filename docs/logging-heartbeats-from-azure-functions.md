# Logging heartbeats from Azure Functions

[TOC]

Azure Functions are great candidates for adding heartbeats. For web API's implemented with Azure Functions, you should create a `/health` endpoint and ping that using Uptime Monitoring. But for timer triggered, queue triggers, and similar function apps, heartbeats are a great way to verify that your function is successfully running. The rest of this document is split into different ways of adding heartbeats to one or more functions.

## Using a filter in Elmah.Io.Functions

The easiest way of including a heartbeat is to include the `ElmahIoHeartbeatFilter` available in the `Elmah.Io.Functions` package. This will automatically publish a `Healthy` or `Unhealthy` heartbeat, depending on if your functions execute successfully. This option is great for timer triggered functions like nightly batch jobs.

Start by installing the `Elmah.Io.Functions` package:

```powershell fct_label="Package Manager"
Install-Package Elmah.Io.Functions
```
```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.Functions
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.Functions" Version="3.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.Functions
```

`Elmah.Io.Functions` requires dependency injection part of the `Microsoft.Azure.Functions.Extensions` package, why you will need this package if not already added.

Extend the `Startup.cs` (or whatever you named your function startup class) file with the following code:

```csharp
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Elmah.Io.Functions;

[assembly: FunctionsStartup(typeof(My.FunctionApp.Startup))]

namespace My.FunctionApp
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            var config = new ConfigurationBuilder()
                .AddJsonFile("local.settings.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables()
                .Build();
            
            builder.Services.Configure<ElmahIoFunctionOptions>(o =>
            {
                o.ApiKey = config["apiKey"];
                o.LogId = new Guid(config["logId"]);
                o.HeartbeatId = config["heartbeatId"];
            });

            builder.Services.AddSingleton<IFunctionFilter, ElmahIoHeartbeatFilter>();
        }
    }
}
```

The code installs the `ElmahIoHeartbeatFilter` class, which will handle all of the communication with the elmah.io API.

Finally, add the config variables (`apiKey`, `logId`, and `heartbeatId`) to the `local.settings.json` file, environment variables, Azure configuration settings, or in whatever way you specify settings for your function app.

## Manually using Elmah.Io.Client

The example above installs the heartbeat filter for all functions. If you have multiple functions inside your function app, or you want greater control of when and how to send heartbeats, you can use `Elmah.Io.Client` to create heartbeats.

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

Extend the `Startup.cs` file with the following code:

```csharp
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Elmah.Io.Client;

[assembly: FunctionsStartup(typeof(My.FunctionApp.Startup))]

namespace My.FunctionApp
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            var config = new ConfigurationBuilder()
                .AddJsonFile("local.settings.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables()
                .Build();
            builder.Services.AddSingleton(config);
            
            var elmahIo = ElmahioAPI.Create(config["apiKey"]);
            builder.Services.AddSingleton(elmahIo.Heartbeats);
        }
    }
}
```

Inside your function, wrap all of the code in `try/catch` and add code to create either a `Healthy` or `Unhealthy` heartbeat:

```csharp
using System;
using System.Threading.Tasks;
using Elmah.Io.Client;
using Elmah.Io.Client.Models; // 👈 Required for Elmah.Io.Client v3.x and lower only
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Configuration;

namespace My.FunctionApp
{
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
}
```

If your function code executes successfully, a `Healthy` heartbeat is created. If an exception is thrown, an `Unhealthy` heartbeat with the thrown exception in `Reason` is created.

## Using a separate heartbeat function

You may want a single heartbeat representing your entire function app consisting of multiple functions. This is a good option if you want to create heartbeats from queue triggered functions or similar. In these cases, you don't want to create a heartbeat every time a message from the queue is handled, but you will want to notify elmah.io if dependencies like database connection suddenly aren't available. We recommend creating a new heartbeat function for this kind of functions. Like in the previous example, make sure to extend your `Startup.cs` file like this:

```csharp
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Elmah.Io.Client;

[assembly: FunctionsStartup(typeof(My.FunctionApp.Startup))]

namespace My.FunctionApp
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            var config = new ConfigurationBuilder()
                .AddJsonFile("local.settings.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables()
                .Build();
            builder.Services.AddSingleton(config);
            
            var elmahIo = ElmahioAPI.Create(config["apiKey"]);
            builder.Services.AddSingleton(elmahIo.Heartbeats);
        }
    }
}
```

Then create a new timed function with the following code:

```csharp
using System;
using System.Threading.Tasks;
using Elmah.Io.Client;
using Elmah.Io.Client.Models; // 👈 Required for Elmah.Io.Client v3.x and lower only
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

When running locally, you may want to disable heartbeats. You can use the `Disable` attribute for that by including the following code:

```csharp
#if DEBUG
    [Disable]
#endif
    public class Heartbeat
    {
        // ...
    }
```

or add the following to `local.settings.json`:

```json
{
  // ...
  "Values": {
    "AzureWebJobs.Heartbeat.Disabled": true,
    // ...
  }
}
```