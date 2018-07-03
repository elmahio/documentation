[![Build status](https://ci.appveyor.com/api/projects/status/xdujoaelpbyg8lov?svg=true)](https://ci.appveyor.com/project/ThomasArdal/elmah-io-log4net)
[![NuGet](https://img.shields.io/nuget/v/elmah.io.log4net.svg)](https://www.nuget.org/packages/elmah.io.log4net)
[![Samples](https://img.shields.io/badge/samples-2-brightgreen.svg)](https://github.com/elmahio/elmah.io.log4net/tree/master/samples)

# Logging to elmah.io from Log4net

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

That’s it! log4net is now configured and log messages to elmah.io. Remember to replace `API_KEY`([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and `LOG_ID` ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)) with your actual log Id. To start logging, write your usual log4net log statements:

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

## Override Properties

In case you want to set one or more core properties on each elmah.io message logged, you will need to add a bit of log4net magic. Examples could be, setting the `User` property on all log messages or setting a version number in the `Version` property. In the following code, we set the currently logged in username on all log messages:

```csharp
Hierarchy hier = log4netassembly.LogManager.GetRepository() as Hierarchy;
var elmahIoAppender = (ElmahIoAppender)(hier?.GetAppenders())
    .FirstOrDefault(appender => appender.Name
        .Equals("ElmahIoAppender", StringComparison.InvariantCultureIgnoreCase));

elmahIoAppender.ActivateOptions();
elmahIoAppender.Client.Messages.OnMessage += (sender, a) =>
{
    a.Message.User = Thread.CurrentPrincipal?.Identity?.Name;
};
```

This rather ugly piece of code would go into an initalization block, depending on the project type. The code starts by getting the configured elmah.io appender (typically set up in `web.config` or `log4net.config`). With the appender, you can access the underlying elmah.io client and subscribe to the `OnMessage` event. This let you trigger a small piece of code, just before sending log messages to elmah.io. In this case, we set the `User` property to the currently logged in user. Remember to call the `ActiveOptions` method, to make sure that the `Client` property is initialized.