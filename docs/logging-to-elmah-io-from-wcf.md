# Logging from WCF

ELMAH and WCF isn't exactly known to go hand in hand. But, with a bit of custom code, logging exceptions from WCF to elmah.io is possible.

> Before we begin: my condolences on the fact that you have to deal with WCF. WCF is probably the worst HTTP library ever born out of Redmond. I strongly recommend you to switch to something else like ASP.NET Web API or ASP.NET Core.

Let's get started. Install elmah.io into your WCF project using NuGet:

```powershell
Install-Package elmah.io
```

Add a new class named `HttpErrorHandler`:

```csharp
public class HttpErrorHandler : IErrorHandler
{
    public bool HandleError(Exception error)
    {
        return false;
    }

    public void ProvideFault(Exception error, MessageVersion version, ref Message fault)
    {
        if (error != null)
        {
            Elmah.ErrorSignal.FromCurrentContext().Raise(error);
        }
    }
}
```

This is an implementation of WCF's `IErrorHandler` that instructs WCF to log any errors to ELMAH, using the `Raise`-method on `ErrorSignal`.

Then create an attribute named `ServiceErrorBehaviourAttribute`:

```csharp
public class ServiceErrorBehaviourAttribute : Attribute, IServiceBehavior
{
    Type errorHandlerType;

    public ServiceErrorBehaviourAttribute(Type errorHandlerType)
    {
        this.errorHandlerType = errorHandlerType;
    }

    public void Validate(ServiceDescription description, ServiceHostBase serviceHostBase)
    {
    }

    public void AddBindingParameters(ServiceDescription serviceDescription, ServiceHostBase serviceHostBase, Collection<ServiceEndpoint> endpoints,
        BindingParameterCollection bindingParameters)
    {
    }

    public void ApplyDispatchBehavior(ServiceDescription description, ServiceHostBase serviceHostBase)
    {
        IErrorHandler errorHandler;
        errorHandler = (IErrorHandler)Activator.CreateInstance(errorHandlerType);
        foreach (ChannelDispatcherBase channelDispatcherBase in serviceHostBase.ChannelDispatchers)
        {
            ChannelDispatcher channelDispatcher = channelDispatcherBase as ChannelDispatcher;
            channelDispatcher.ErrorHandlers.Add(errorHandler);
        }
    }
}
```

We'll use the `ServiceErrorBehaviourAttribute` class for decorating endpoints which we want logging uncaught errors to ELMAH. Add the new attribute to your service implementation like this:

```csharp
[ServiceErrorBehaviour(typeof(HttpErrorHandler))]
public class Service1 : IService1
{
    ...
}
```

That's it. Services decorated with the `ServiceErrorBehaviourAttribute` now logs exceptions to ELMAH.