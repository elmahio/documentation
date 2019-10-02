[![Build status](https://ci.appveyor.com/api/projects/status/xdujoaelpbyg8lov?svg=true)](https://ci.appveyor.com/project/ThomasArdal/elmah-io-log4net)
[![NuGet](https://img.shields.io/nuget/v/elmah.io.log4net.svg)](https://www.nuget.org/packages/elmah.io.log4net)
[![Samples](https://img.shields.io/badge/samples-2-brightgreen.svg)](https://github.com/elmahio/elmah.io.log4net/tree/master/samples)

# Logging to elmah.io from Log4net

[TOC]

In this tutorial we'll add logging to elmah.io from a .NET application with log4net. Install the elmah.io appender:

```powershell
Install-Package elmah.io.log4net
```

Add the following to your AssemblyInfo.cs file:

```csharp
[assembly: log4net.Config.XmlConfigurator(Watch = true)]
```

Add the following config section to your `web/app.config` file:

```xml
<section name="log4net" type="log4net.Config.Log4NetConfigurationSectionHandler, log4net" />
```

Finally, add the log4net configuration element to `web/app.config`:

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

## Logging custom properties

log4net offers a feature called context properties. With context properties, you can log additional key/value pairs with every log message. The elmah.io appender for log4net, supports context properties as well. Context properties are handled like [custom properties](https://docs.elmah.io/logging-custom-data/) in the elmah.io UI.

Let's utilize two different hooks in log4net, to add context properties to elmah.io:

```csharp
log4net.GlobalContext.Properties["ApplicationIdentifier"] = "MyCoolApp";
log4net.ThreadContext.Properties["ThreadId"] = Thread.CurrentThread.ManagedThreadId;

log.Info("This is a message with custom properties");
```

Basically, we set two custom properties on contextual classes provided by log4net. To read more about the choices in log4net, check out the [log4net manual](https://logging.apache.org/log4net/release/manual/contexts.html).

When looking up the log message in elmah.io, we see the context properties in the Data tab. Besides the two custom variables that we set through `GlobalContext` and `ThreadContext`, we see a couple of build-in properties in log4net, both prefixed with `log4net:`.

In addition, `Elmah.Io.Log4Net` provides a range of reserved property names, that can be used to fill in data in the correct fields on the elmah.io UI. Let's say you want to fill the User field:

```csharp
var properties = new PropertiesDictionary();
properties["User"] = "Arnold Schwarzenegger";
log.Logger.Log(new LoggingEvent(new LoggingEventData
{
    Level = Level.Error,
    TimeStampUtc = DateTime.UtcNow,
    Properties = properties,
    Message = "Hasta la vista, baby",
}));
```

This will fill in the value `Arnold Schwarzenegger` in the `User` field, as well as add a key/value pair to the Data tab on elmah.io. For a reference of all possible property names, check out the property names on [CreateMessage](https://github.com/elmahio/Elmah.Io.Client/blob/master/src/Elmah.Io.Client/Models/CreateMessage.cs).

## Message hooks

### Decorating log messages

In case you want to set one or more core properties on each elmah.io message logged, using message hooks may be a better solution. In that case you will need to add a bit of log4net magic. An example could be setting the `Version` property on all log messages. In the following code, we set a hard-coded version number on all log messages, but the value could come from assembly info, a text file, or similar:

```csharp
Hierarchy hier = log4net.LogManager.GetRepository() as Hierarchy;
var elmahIoAppender = (ElmahIoAppender)(hier?.GetAppenders())
    .FirstOrDefault(appender => appender.Name
        .Equals("ElmahIoAppender", StringComparison.InvariantCultureIgnoreCase));

elmahIoAppender.ActivateOptions();
elmahIoAppender.Client.Messages.OnMessage += (sender, a) =>
{
    a.Message.Version = "1.0.0";
};
```

This rather ugly piece of code would go into an initalization block, depending on the project type. The code starts by getting the configured elmah.io appender (typically set up in `web/app.config` or `log4net.config`). With the appender, you can access the underlying elmah.io client and subscribe to the `OnMessage` event. This let you trigger a small piece of code, just before sending log messages to elmah.io. In this case, we set the `Version` property to `1.0.0`. Remember to call the `ActiveOptions` method, to make sure that the `Client` property is initialized.

## Specify API key and log ID in appSettings

You may prefer storing the API key and log ID in the `appSettings` element over having the values embedded into the `appender` element. This can be the case for easy config transformation, overwriting values on Azure, or similar. log4net provides a feature named pattern strings to address just that:

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <configSections>
    <section name="log4net" type="log4net.Config.Log4NetConfigurationSectionHandler, log4net" />
  </configSections>
  <appSettings>
    <add key="logId" value="LOG_ID"/>
    <add key="apiKey" value="API_KEY"/>
  </appSettings>
  <log4net>
    <root>
      <level value="ALL" />
      <appender-ref ref="ElmahIoAppender" />
    </root>
    <appender name="ElmahIoAppender" type="elmah.io.log4net.ElmahIoAppender, elmah.io.log4net">
      <logId type="log4net.Util.PatternString" value="%appSetting{logId}" />
      <apiKey type="log4net.Util.PatternString" value="%appSetting{apiKey}" />
    </appender>
  </log4net>
</configuration>
```

The `logId` and `apiKey` elements underneath the elmah.io appender have been extended to include `type="log4net.Util.PatternString"`. This allows for complex patterns in the `value` attribute. In this example, I reference an app setting from its name, by adding a value of `%appSetting{logId}` where `logId` is a reference to the app setting key specified above.

## ASP.NET Core

Like other logging frameworks, logging through log4net from ASP.NET Core is also supported. We have a [sample](https://github.com/elmahio/elmah.io.log4net/tree/master/samples/Elmah.Io.Log4Net.AspNetCore22) to show you how to set it up. The required NuGet packages and configuration are documented in this section.

To start logging to elmah.io from Microsoft.Extensions.Logging (through log4net), install the `Microsoft.Extensions.Logging.Log4Net.AspNetCore` NuGet package:

```ps
Install-Package Microsoft.Extensions.Logging.Log4Net.AspNetCore
```

Include a log4net config file to the root of the project:

```xml
<?xml version="1.0" encoding="utf-8" ?>
<log4net>
  <root>
    <level value="WARN" />
    <appender-ref ref="ElmahIoAppender" />
    <appender-ref ref="ConsoleAppender" />
  </root>
  <appender name="ElmahIoAppender" type="elmah.io.log4net.ElmahIoAppender, elmah.io.log4net">
    <logId value="LOG_ID" />
    <apiKey value="API_KEY" />
    <!--<application value="My app" />-->
  </appender>
  <appender name="ConsoleAppender" type="log4net.Appender.ConsoleAppender">
    <layout type="log4net.Layout.PatternLayout">
      <conversionPattern value="%date [%thread] %-5level %logger [%property{NDC}] - %message%newline" />
    </layout>
  </appender>
</log4net>
```

In the `Program.cs` file, make sure to set up log4net:

```csharp
public class Program
{
    public static void Main(string[] args)
    {
        CreateWebHostBuilder(args).Build().Run();
    }

    public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
        WebHost.CreateDefaultBuilder(args)
            .ConfigureLogging((hostingContext, logging) =>
            {
                logging.AddLog4Net();
            })
            .UseStartup<Startup>();
}
```

All internal logging from ASP.NET Core, as well as manual logging you create through the `ILogger` interface, now goes directly into elmah.io.

A common request is to include all of the HTTP contextual information you usually get logged when using a package like `Elmah.Io.AspNetCore`. We have developed a specialized NuGet package to include cookies, server variables, etc. when logging through log4net from ASP.NET Core. To set it up, install the `Elmah.Io.AspNetCore.Log4Net` NuGet package:

```ps
Install-Package Elmah.Io.AspNetCore.Log4Net
```

Finally, make sure to call the `UseElmahIoLog4Net` method in the `Configure` method in the `Startup.cs` file:

```csharp
public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
{
    ... // Exception handling middleware
    app.UseElmahIoLog4Net();
    ... // UseMvc etc.
}
```