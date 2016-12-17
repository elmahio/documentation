# Configure elmah.io from code

You typically configure elmah.io in your `web.config` file. With a little help from ELMAH and some custom code, you will be able to configure any ELMAH error logger through code as well:

```csharp
using Elmah;
using System.Collections.Generic;
using System.ComponentModel.Design;
 
[assembly: WebActivatorEx.PreApplicationStartMethod(typeof(ElmahFromCodeExample.ElmahConfig), "Start")]
 
namespace ElmahFromCodeExample
{
    public static class ElmahConfig
    {
        public static void Start()
        {
            ServiceCenter.Current = CreateServiceProviderQueryHandler(ServiceCenter.Current);
        }
 
        private static ServiceProviderQueryHandler CreateServiceProviderQueryHandler(ServiceProviderQueryHandler sp)
        {
            return context =>
            {
                var container = new ServiceContainer(sp(context));
 
                var config = new Dictionary<string, string>();
                config["LogId"] = "6aeabe21-e2e9-4d07-a338-c2380e575fc1";
                var log = new Elmah.Io.ErrorLog(config);
 
                container.AddService(typeof(ErrorLog), log);
                return container;
            };
        }
    }
}
```

Let’s look at the code. In line 5, the `ElmahConfig` class is configured as a `PreApplicationStartMethod` which means, that ASP.NET (MVC) will execute the Start method when the web application starts up. In line 13 the `ServiceCenter.Current` property is set to the return type of the `CreateServiceProviderQueryHandler` method. This method is where the magic happens. Besides creating the new `ServiceContainer`, we actually created the `Elmah.Io.ErrorLog` class normally configured through XML. The Dictionary should contain the LogId found on the dashboard of the elmah.io website.

Since `ServiceContainer` and friends are bundled with ELMAH, you still need to configure ELMAH as part of the pipeline. Add the `ErrorLogModule` to your `web.config` like this:

```xml
<system.webserver>
  <modules>
    <add name="ErrorLog" type="Elmah.ErrorLogModule, Elmah" precondition="managedHandler"/>
  </modules>
</system.webserver>
```

That’s it! You no longer need the `<elmah>` element, config sections or anything else other than the module in your `web.config` file.