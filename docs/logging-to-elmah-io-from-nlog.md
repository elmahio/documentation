[![Build status](https://ci.appveyor.com/api/projects/status/gdgwwlu1j8yh7esl?svg=true)](https://ci.appveyor.com/project/ThomasArdal/elmah-io-nlog)
[![NuGet](https://img.shields.io/nuget/v/elmah.io.nlog.svg)](https://www.nuget.org/packages/elmah.io.nlog)
[![Samples](https://img.shields.io/badge/samples-3-brightgreen.svg)](https://github.com/elmahio/elmah.io.nlog/tree/master/samples)

# Logging to elmah.io from NLog

[TOC]

NLog is one of the most popular logging frameworks for .NET. With an active history on almost 10 years, the possibilities with NLog are many and it’s easy to find documentation on how to use it.

To start logging messages from NLog to elmah.io, you need to install the [Elmah.Io.NLog](https://www.nuget.org/packages/Elmah.Io.NLog/) NuGet package:

```powershell
Install-Package elmah.io.nlog
```

> Please don't use NLog `4.6.0` since that version contains a bug that causes the elmah.io target to not load correctly. `4.5.11`, `4.6.1`, or newer.

## Configuration in .NET

To configure the elmah.io target, add the following configuration to your app.config/web.config/nlog.config depending on what kind of project you’ve created:

```xml
<extensions>
  <add assembly="Elmah.Io.NLog"/>
</extensions>
 
<targets>
  <target name="elmahio" type="elmah.io" apiKey="API_KEY" logId="LOG_ID"/>
</targets>
 
<rules>
  <logger name="*" minlevel="Info" writeTo="elmahio" />
</rules>
```

Replace `API_KEY` with your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and `LOG_ID` with the ID of the log you want messages sent to ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)).

In the example we specify the level minimum as Info. This tells NLog to log only information, warning, error and fatal messages. You may adjust this, but be aware that your elmah.io log may run full pretty fast, especially if you log thousands and thousands of trace and debug messages.

Log messages to elmah.io, just as with every other target and NLog:

```csharp
log.Warn("This is a warning message");
log.Error(new Exception(), "This is an error message");
```

### Specify API key and log ID in appSettings

If you are already using elmah.io, you may have your API key and log ID in the `appSettings` element already. To use these settings from withing the NLog target configuration you can use an NLog layout formatter:

```xml
<targets>
  <target name="elmahio" type="elmah.io" apiKey="${appsetting:item=apiKey}" logId="${appsetting:item=logId}"/>
</targets>
```

By using the layout `${appsetting:item=apiKey}` you tell NLog that the value for this attribute is in an `appSettings` element named `elmahKey`:

```xml
<appSettings>
  <add key="apiKey" value="API_KEY" />
  <add key="logId" value="LOG_ID" />
</appSettings>
```

> The `appSettings` layout formatter only works when targeting .NET Full Framework and requires `Elmah.Io.NLog` version 3.3.x or above and `NLog` version 4.6.x or above.

### Setting application name

The application field on elmah.io can be set globally through NLog config:

```xml
<targets>
  <target name="elmahio" xsi:type="elmahio:elmah.io" apiKey="API_KEY" logId="LOG_ID" application="APP_NAME" />
</targets>
```

Replace `APP_NAME` with the application you want logged to elmah.io

## Configuration in .NET Core

.NET Core switched from declaring XML configuration in `app/web/nlog.config` files to JSON configuration in an `appsettings.json` file. To configure elmah.io in JSON, install the `NLog.Extensions.Logging` NuGet package:

```ps
Install-Package NLog.Extensions.Logging
```

Extend the `appsettings.json` file with a new `NLog` section:

```json
{
  "NLog": {
    "throwConfigExceptions": true,
    "extensions": [
      { "assembly": "Elmah.Io.NLog" }
    ],
    "targets": {
      "elmahio": {
        "type": "elmah.io",
        "apiKey": "API_KEY",
        "logId": "LOG_ID"
      }
    },
    "rules": [
      {
        "logger": "*",
        "minLevel": "Info",
        "writeTo": "elmahio"
      }
    ]
  }
}
```

Replace `API_KEY` with your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and `LOG_ID` with the ID of the log you want messages sent to ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)).

If you haven't already loaded the configuration in your application, make sure to do so:

```csharp
var config = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
    .Build();

```

Finally, tell NLog how to load the `NLog` configuration section:

```csharp
LogManager.Configuration = new NLogLoggingConfiguration(config.GetSection("NLog"));
```

### elmah.io configuration outside the NLog section

You might not want the elmah.io API key and log Id inside the `NLog` section or already have an `ElmahIo` section defined and want to reuse that. Splitting up configuration like that is supported through NLog layout renderers:

```json
{
  "NLog": {
    ...
    "targets": {
      "elmahio": {
        "type": "elmah.io",
        "apiKey": "${configsetting:item=ElmahIo.ApiKey}",
        "logId": "${configsetting:item=ElmahIo.LogId}"
      }
    },
    ...
  },
  "ElmahIo": {
    "ApiKey": "API_KEY",
    "LogId": "LOG_ID"
  }
}
```

Notice how the value of the `apiKey` and `logId` parameters have been replaced with `${configsetting:item=ElmahIo.*}`. In the bottom the `ElmahIo` section wrap the API key and log Id.

To make this work, you will need an additional line of C# when setting up NLog logging:

```csharp
var config = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
    .Build();

ConfigSettingLayoutRenderer.DefaultConfiguration = config; // 👈 add this line

LogManager.Configuration = new NLogLoggingConfiguration(config.GetSection("NLog"));
```

## Configuration in code

The elmah.io target can be configured from C# code if you prefer or need to access the built-in events (see more later). The following adds logging to elmah.io:

```csharp
var config = new LoggingConfiguration();
var elmahIoTarget = new ElmahIoTarget();
elmahIoTarget.Name = "elmahio";
elmahIoTarget.ApiKey = "API_KEY";
elmahIoTarget.LogId = "LOG_ID";
config.AddTarget(elmahIoTarget);
config.AddRuleForAllLevels(elmahIoTarget);
LogManager.Configuration = config;
```

The example will log all log levels to elmah.io. For more information about how to configure individual log levels, check out the [NLog documentation on GitHub](https://github.com/NLog/NLog/wiki/Configure-from-code).

## Logging custom properties

NLog supports logging custom properties in multiple ways. If you want to include a property (like a version number) to all log messages, you might want to look into the [`OnMessage`](#decorating-log-messages) feature on `Elmah.Io.NLog`.

With custom properties, you can log additional key/value pairs with every log message. The elmah.io appender for NLog, supports [custom properties](https://docs.elmah.io/logging-custom-data/) as well. Properties are persisted alongside every log message in elmah.io and searchable if [named correctly](https://docs.elmah.io/logging-custom-data/#searching-custom-data).

One way to log custom properties with NLog and elmah.io, is to use the overload of each logging-method that takes a `LogEventInfo` object as parameter:

```csharp
var infoMessage = new LogEventInfo(LogLevel.Info, "", "This is an information message");
infoMessage.Properties.Add("Some Property Key", "Some Property Value");
log.Info(infoMessage);
```

This saves the information message in elmah.io with a custom property with key `Some Property Key`and value `Some Property Value`.

As of NLog 4.5, structured logging is supported as well. To log a property as part of the log message, use the new syntax as shown here:

```csharp
log.Warn("Property named {FirstName}", "Donald");
```

In the example, NLog will log the message `Property named "Donald"`, but the key (`FirstName`) and value (`Donald`), will also be available in the *Data* tab inside elmah.io.

`Elmah.Io.NLog` provides a range of reserved property names, that can be used to fill in data in the correct fields on the elmah.io UI. Let's say you want to fill the `User` field using structured logging only:

```csharp
log.Info("{Quote} from {User}", "Hasta la vista, baby", "T-800");
```

This will fill in the value `T-800` in the `User` field, as well as add two key/value pairs (`Quote` and `User`) to the *Data* tab on elmah.io. For a reference of all possible property names, check out the property names on [CreateMessage](https://github.com/elmahio/Elmah.Io.Client/blob/master/src/Elmah.Io.Client/Models/CreateMessage.cs).


NLog also provides a fluent API (available in the `NLog.Fluent` namespace) that some might find more readable:

```csharp
logger.Info()
      .Message("I'll be back")
      .Property("User", "T-800")
      .Write();
```

If you want to use the normal logging methods like `Info` and `Error`, you can do so in junction with the `MappedDiagnosticsLogicalContext` class, also provided by NLog:

```csharp
using (MappedDiagnosticsLogicalContext.SetScoped("User", "T-800"))
{
   logger.Info("I'll be back");
}
```

This will create the exact same result as the example above.

## Message hooks

`Elmah.Io.NLog` provide message hooks similar to the integrations with ASP.NET and ASP.NET Core. Similar for all hooks is that the elmah.io NLog target must be [configured through C#](#configure-the-elmahio-target-from-code).

> Message hooks require `Elmah.Io.NLog` version `3.4.53` or newer.

### Decorating log messages

To include additional information on log messages, you can use the OnMessage event when initializing the elmah.io target:

```csharp
var elmahIoTarget = new ElmahIoTarget();
...
elmahIoTarget.OnMessage = msg =>
{
    msg.Version = "1.0.0";
};
```

The example above includes a version number on all errors.

### Handle errors

To handle any errors happening while processing a log message, you can use the OnError event when initializing the elmah.io target:

```csharp
var elmahIoTarget = new ElmahIoTarget();
...
elmahIoTarget.OnError = (msg, err) =>
{
    // Do something here
};
```

The example implements a callback if logging to elmah.io fails. How you choose to implement this is entirely up to your application and tech stack.

### Error filtering
To ignore specific errors based on their content, you can use the OnFilter event when initializing the elmah.io target:

```csharp
var elmahIoTarget = new ElmahIoTarget();
...
elmahIoTarget.OnFilter = msg =>
{
    return msg.Title.Contains("trace");
};
```

The example above ignores any log messages with the word `trace` in the title.

## Troubleshooting

Here are some things to try out if logging from NLog to elmah.io doesn't work:

- Make sure that you have the newest `Elmah.Io.NLog` and `Elmah.Io.Client` packages installed.
- Make sure to include all of the configuration from the example above. That includes both the `<extensions>`, `<targets>`, and `<rules>` element.
- Make sure that the API key is valid and allow the *Messages* | *Write* [permission](https://docs.elmah.io/how-to-configure-api-key-permissions/).
- Make sure to include a valid log ID.
- Make sure that you have sufficient log messages in your subscription and that you didn't disable logging to the log or include any ignore filters/rules.
- Always make sure to call `LogManager.Shutdown()` before existing the application to make sure that all log messages are flushed.
- Extend the `nlog` element with `internalLogLevel="Warn" internalLogFile="c:\temp\nlog-internal.log` and inspect that log file for any internal NLog errors.