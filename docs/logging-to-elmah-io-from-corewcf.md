---
title: Logging to elmah.io from CoreWCF
description: Learn how to set up logging to elmah.io from CoreWCF. Integrating cloud-logging from CoreWCF is easy with the Microsoft.Extensions.Logging integration.
---

# Logging to elmah.io from CoreWCF

elmah.io supports CoreWCF using our integration with Microsoft.Extensions.Logging. Start by installing the `Elmah.Io.Extensions.Logging` NuGet package:

```powershell fct_label="Package Manager"
Install-Package Elmah.Io.Extensions.Logging
```
```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.Extensions.Logging
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.Extensions.Logging" Version="4.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.Extensions.Logging
```

Configure logging as part of the configuration (typically in the `Program.cs` file):

```csharp
public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
    WebHost
        .CreateDefaultBuilder(args)
        // ...
        .ConfigureLogging(logging =>
        {
            logging.AddElmahIo(options =>
            {
                options.ApiKey = "API_KEY";
                options.LogId = new Guid("LOG_ID");
            });
        })
        // ...
        .UseStartup<Startup>();

```

Replace `API_KEY` with your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and `LOG_ID` with the id of the log ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)) where you want messages logged.

CoreWCF will now send all messages logged from your application to elmah.io. CoreWCF doesn't log uncaught exceptions happening in WCF services to `Microsoft.Extensions.Logging` as you'd expect if coming from ASP.NET Core. To do this, you will need to add a custom error logger by including the following class:

```csharp
public class ElmahIoErrorHandler : IErrorHandler
{
    private readonly ILogger<ElmahIoErrorHandler> logger;

    public ElmahIoErrorHandler(ILogger<ElmahIoErrorHandler> logger)
    {
        this.logger = logger;
    }

    public bool HandleError(Exception error) => false;

    public void ProvideFault(Exception error, MessageVersion version, ref Message fault)
    {
        if (error == null) return;

        logger.LogError(error, error.Message);
    }
}
```

The `ElmahIoErrorHandler` class will be called by CoreWCF when exceptions are thrown and log the to the configure `ILogger`. To invoke the error handler, add the following service behavior:

```csharp
public class ElmahIoErrorBehavior : IServiceBehavior
{
    private readonly ILogger<ElmahIoErrorHandler> logger;

    public ElmahIoErrorBehavior(ILogger<ElmahIoErrorHandler> logger)
    {
        this.logger = logger;
    }

    public void Validate(ServiceDescription description, ServiceHostBase serviceHostBase)
    {
    }

    public void AddBindingParameters(ServiceDescription description, ServiceHostBase serviceHostBase, System.Collections.ObjectModel.Collection<ServiceEndpoint> endpoints, BindingParameterCollection parameters)
    {
    }

    public void ApplyDispatchBehavior(ServiceDescription description, ServiceHostBase serviceHostBase)
    {
        var errorHandler = (IErrorHandler)Activator.CreateInstance(typeof(ElmahIoErrorHandler), logger);

        foreach (ChannelDispatcherBase channelDispatcherBase in serviceHostBase.ChannelDispatchers)
        {
            ChannelDispatcher channelDispatcher = channelDispatcherBase as ChannelDispatcher;
            channelDispatcher.ErrorHandlers.Add(errorHandler);
        }
    }
}
```

The service behavior will look up the `ElmahIoErrorHandler` and register it with CoreWCF. The code above is hardcoded to work with the elmah.io error handler only. If you have multiple error handlers, you will need to register all of them.

Finally, register the service behavior in the `ConfigureServices` method in the `Startup.cs` file:

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddSingleton<IServiceBehavior, ElmahIoErrorBehavior>();
    // ...
}
```

Uncaught errors will now be logged to elmah.io.

All of the settings from `Elmah.Io.Extensions.Logging` not mentioned on this page work with CoreWCF. Check out [Logging to elmah.io from Microsoft.Extensions.Logging](/logging-to-elmah-io-from-microsoft-extensions-logging/) for details.