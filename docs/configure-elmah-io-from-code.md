---
title: Configure elmah.io from code
description: ELMAH and elmah.io are normally configured in the web.config file when using ASP.NET. With a few lines of C#, you can configure it from code too.
---

# Configure elmah.io from code

You typically configure elmah.io in your `web.config` file. With a little help from some custom code, you will be able to configure everything in code as well:

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
            HttpApplication.RegisterModule(typeof(ErrorLogModule));
        }
 
        private static ServiceProviderQueryHandler CreateServiceProviderQueryHandler(ServiceProviderQueryHandler sp)
        {
            return context =>
            {
                var container = new ServiceContainer(sp(context));
 
                var config = new Dictionary<string, string>();
                config["apiKey"] = "API_KEY";
                config["logId"] = "LOG_ID";
                var log = new Elmah.Io.ErrorLog(config);
 
                container.AddService(typeof(Elmah.ErrorLog), log);
                return container;
            };
        }
    }
}
```

Replace `API_KEY` with your API key ([Where is my API key?](where-is-my-api-key.md)) and `LOG_ID` with a log ID ([Where is my log ID?](where-is-my-log-id.md)).

Let's look at the code. Our class `ElmahConfig` is configured as a `PreApplicationStartMethod` which means, that ASP.NET (MVC) will execute the Start method when the web application starts up. Inside this method, we set the `ServiceCenter.Current` property to the return type of the `CreateServiceProviderQueryHandler` method. This method is where the magic happens. Besides creating the new `ServiceContainer`, we created the `Elmah.Io.ErrorLog` class normally configured through XML. The Dictionary should contain the API key and log ID as explained earlier.

In the second line of the `Start`-method, we call the `RegisterModule`-method with `ErrorLogModule` as a parameter. This replaces the need for registering the module in `web.config` as part of the `system.webServer` element.

That's it! You no longer need the `<elmah>` element, config sections, or anything else related to ELMAH and elmah.io in your `web.config` file.