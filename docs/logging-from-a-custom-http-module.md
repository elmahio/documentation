---
title: Logging from a custom HTTP module
description: Learn how to gather the configuration of multiple loggers to different destinations using a custom HTTP module in ASP.NET.
---

# Logging from a custom HTTP module

Some developers like to gather all logging into a single module. An example of this would be to log to multiple log destinations and maybe even enrich log messages to multiple loggers with the same info. We always recommend using the modules and handlers that come with ELMAH. But in case you want to log from a module manually, here's the recipe:

```csharp
public class CustomLoggingModule : IHttpModule
{
    public void Init(HttpApplication context)
    {
        context.Error += Application_Error;
    }

    public void Application_Error(object sender, EventArgs messageData)
    {
        HttpApplication application = (HttpApplication)sender;
        var context = application.Context;
        var error = new Error(application.Server.GetLastError(), context);
        var log = ErrorLog.GetDefault(context);
        log.Log(error);
    }

    public void Dispose()
    {
    }
}
```

In the example, I've created a new module named `CustomLoggingModule`. The module needs to be configured in `web.config` as explained <a href="https://learn.microsoft.com/en-us/iis/configuration/system.webserver/modules/" target="_blank" rel="noopener noreferrer">here</a>. When starting up the application, ASP.NET calls the `Init`-method. In this method, an `Error` event handler is set. Every time a new error is happening in your web application, ASP.NET now calls the `Application_Error`-method. In this method, I wrap the last thrown error in ELMAH's `Error` object and log it through the `ErrorLog` class.

> Be aware that logging errors this way, disables ELMAH's built-in events like filtering.