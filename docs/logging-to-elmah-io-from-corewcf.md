---
title: Logging to elmah.io from CoreWCF
description: Learn how to set up logging to elmah.io from CoreWCF. Integrating cloud-logging from CoreWCF is easy with the Microsoft.Extensions.Logging integration.
howto_steps:
  - name: Install the Elmah.Io.Extensions.Logging NuGet package
    text: 'Run: dotnet add package Elmah.Io.Extensions.Logging (or the equivalent Package Manager, PackageReference, or Paket command).'
  - name: Configure logging in Program.cs
    text: 'Call builder.Logging.AddElmahIo(options => { options.ApiKey = "API_KEY"; options.LogId = new Guid("LOG_ID"); }), replacing API_KEY and LOG_ID with your values.'
  - name: Add a custom IErrorHandler class
    text: Create an ElmahIoErrorHandler class implementing IErrorHandler that logs the error via an injected ILogger in ProvideFault, since CoreWCF does not forward uncaught WCF exceptions to Microsoft.Extensions.Logging automatically.
  - name: Add a service behavior to register the error handler
    text: Create an ElmahIoErrorBehavior class implementing IServiceBehavior that adds ElmahIoErrorHandler to each ChannelDispatcher's ErrorHandlers collection in ApplyDispatchBehavior.
  - name: Register the service behavior
    text: 'Add builder.Services.AddSingleton<IServiceBehavior, ElmahIoErrorBehavior>(); to Program.cs so CoreWCF picks up the behavior.'
---

# Logging to elmah.io from CoreWCF

elmah.io supports CoreWCF using our integration with Microsoft.Extensions.Logging. Start by installing the `Elmah.Io.Extensions.Logging` NuGet package:

```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.Extensions.Logging
```
```powershell fct_label="Package Manager"
Install-Package Elmah.Io.Extensions.Logging
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.Extensions.Logging" Version="5.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.Extensions.Logging
```

Configure logging as part of the configuration (typically in the `Program.cs` file):

```csharp
builder.Logging.AddElmahIo(options =>
{
    options.ApiKey = "API_KEY";
    options.LogId = new Guid("LOG_ID");
});
```

Replace `API_KEY` with your API key ([Where is my API key?](where-is-my-api-key.md)) and `LOG_ID` with the id of the log ([Where is my log ID?](where-is-my-log-id.md)) where you want messages logged.

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

The `ElmahIoErrorHandler` class will be called by CoreWCF when exceptions are thrown and log to the configure `ILogger`. To invoke the error handler, add the following service behavior:

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

Finally, register the service behavior in the `Program.cs` file:

```csharp
builder.Services.AddSingleton<IServiceBehavior, ElmahIoErrorBehavior>();
```

Uncaught errors will now be logged to elmah.io.

All of the settings from `Elmah.Io.Extensions.Logging` not mentioned on this page work with CoreWCF. Check out [Logging to elmah.io from Microsoft.Extensions.Logging](logging-to-elmah-io-from-microsoft-extensions-logging.md) for details.