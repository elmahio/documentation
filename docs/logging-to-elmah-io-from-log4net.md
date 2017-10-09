# Logging from Log4net

[TOC]

In this tutorial we’ll add logging to elmah.io from an ASP.NET MVC project through log4net. The process is identical with other project types. Create a new MVC project and install the elmah.io appender:

```powershell
Install-Package elmah.io.log4net
```

Add the following to your AssemblyInfo.cs file:

```csharp
[assembly: log4net.Config.XmlConfigurator(Watch = true)]
```

Add the following config section to your web.config file:

```xml
<section name="log4net" type="log4net.Config.Log4NetConfigurationSectionHandler, log4net" />
```

Finally, add the log4net configuration element to web.config:

```xml
<log4net>
  <appender name="ElmahIoAppender" type="elmah.io.log4net.ElmahIoAppender, elmah.io.log4net">
    <logId value="LOG_ID" />
    <apiKey value="API_KEY" />
  </appender>
  <root>
    <level value="Info" />
    <appender-ref ref="ElmahIoAppender" />
  </root>
</log4net>
```

That’s it! log4net is now configured and log messages to elmah.io. Remember to replace `API_KEY`([Where do I find my API key?](https://docs.elmah.io/where-do-i-find-my-api-key/)) and `LOG_ID` with your actual log Id. To start logging, write your usual log4net log statements:

```csharp
var log = log4net.LogManager.GetLogger(typeof(HomeController));
try
{
    log.Info("Trying something");
    throw new ApplicationException();
}
catch (ApplicationException ex)
{
    log.Error("Error happening", ex);
}
```

## Context Properties

log4net offers a feature called context properties. With context properties, you can log additional key/value pairs with every log message. The elmah.io appender for log4net, supports context properties as well. Context properties are handled like [custom properties](https://docs.elmah.io/logging-custom-data/) in the elmah.io UI.

Let's utilize two different hooks in log4net, to add context properties to elmah.io:

```csharp
log4net.GlobalContext.Properties["ApplicationIdentifier"] = "MyCoolApp";
log4net.ThreadContext.Properties["ThreadId"] = Thread.CurrentThread.ManagedThreadId;

log.Info("This is a message with custom properties");
```

Basically, we set two custom properties on contextual classes provided by log4net. To read more about the choices in log4net, check out the [log4net manual](https://logging.apache.org/log4net/release/manual/contexts.html).

When looking up the log message in elmah.io, we see the context properties in the Data tab. Besides the two custom variables that we set through `GlobalContext` and `ThreadContext`, we see a couple of build-in properties in log4net, both prefixed with `log4net:`.

## Additional Resources

- [Samples](https://github.com/elmahio/elmah.io.log4net/tree/master/samples)
- [Source](https://github.com/elmahio/elmah.io.log4net)
- [log4net Manual](https://logging.apache.org/log4net/release/manual/introduction.html)