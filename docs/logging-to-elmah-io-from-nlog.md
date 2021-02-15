[![Build status](https://github.com/elmahio/elmah.io.nlog/workflows/build/badge.svg)](https://github.com/elmahio/elmah.io.nlog/actions?query=workflow%3Abuild)
[![NuGet](https://img.shields.io/nuget/v/elmah.io.nlog.svg)](https://www.nuget.org/packages/elmah.io.nlog)
[![Samples](https://img.shields.io/badge/samples-3-brightgreen.svg)](https://github.com/elmahio/elmah.io.nlog/tree/main/samples)

# Logging to elmah.io from NLog

[TOC]

NLog is one of the most popular logging frameworks for .NET. With an active history of almost 10 years, the possibilities with NLog are many and it’s easy to find documentation on how to use it.

To start logging messages from NLog to elmah.io, you need to install the `Elmah.Io.NLog` NuGet package:

```powershell fct_label="Package Manager"
Install-Package Elmah.Io.NLog
```
```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.NLog
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.NLog" Version="3.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.NLog
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

The application field on elmah.io can be set globally using NLog's global context:

```csharp
GlobalDiagnosticsContext.Set("Application", "My application name");
```

### Setting version number

The version field on elmah.io can be set globally using NLog's global context:

```csharp
GlobalDiagnosticsContext.Set("Version", "1.2.3");
```

### IntelliSense

There is support for adding IntelliSense in Visual Studio for the `NLog.config` file. Extend the `nlog` root element like this:

```xml
<?xml version="1.0" encoding="utf-8" ?>
<nlog xmlns="http://www.nlog-project.org/schemas/NLog.xsd"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xmlns:elmahio="http://www.nlog-project.org/schemas/NLog.Targets.Elmah.Io.xsd"
      xsi:schemaLocation="http://www.nlog-project.org/schemas/NLog.Targets.Elmah.Io.xsd http://www.nlog-project.org/schemas/NLog.Targets.Elmah.Io.xsd">
  <!-- ... -->
</nlog>
```

## Configuration in .NET Core

.NET Core switched from declaring XML configuration in `app/web/nlog.config` files to JSON configuration in an `appsettings.json` file. To configure elmah.io in JSON, install the `NLog.Extensions.Logging` NuGet package:

```powershell fct_label="Package Manager"
Install-Package NLog.Extensions.Logging
```
```cmd fct_label=".NET CLI"
dotnet add package NLog.Extensions.Logging
```
```xml fct_label="PackageReference"
<PackageReference Include="NLog.Extensions.Logging" Version="1.*" />
```
```xml fct_label="Paket CLI"
paket add NLog.Extensions.Logging
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
    // ...
    "targets": {
      "elmahio": {
        "type": "elmah.io",
        "apiKey": "${configsetting:item=ElmahIo.ApiKey}",
        "logId": "${configsetting:item=ElmahIo.LogId}"
      }
    },
    // ...
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

### IntelliSense

There is support for adding IntelliSense in Visual Studio for the `NLog` section in the `appsettings.json` file. Copy and paste the following link into the *Schema* textbox above the file content:

```
https://nlog-project.org/schemas/appsettings.schema.json
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

With custom properties, you can log additional key/value pairs with every log message. The elmah.io target for NLog supports [custom properties](https://docs.elmah.io/logging-custom-data/) as well. Properties are persisted alongside every log message in elmah.io and searchable if [named correctly](https://docs.elmah.io/logging-custom-data/#searching-custom-data).

One way to log custom properties with NLog and elmah.io is to use the overload of each logging-method that takes a `LogEventInfo` object as a parameter:

```csharp
var infoMessage = new LogEventInfo(LogLevel.Info, "", "This is an information message");
infoMessage.Properties.Add("Some Property Key", "Some Property Value");
log.Info(infoMessage);
```

This saves the information message in elmah.io with a custom property with key `Some Property Key` and value `Some Property Value`.

As of NLog 4.5, structured logging is supported as well. To log a property as part of the log message, use the new syntax as shown here:

```csharp
log.Warn("Property named {FirstName}", "Donald");
```

In the example, NLog will log the message `Property named "Donald"`, but the key (`FirstName`) and value (`Donald`), will also be available in the *Data* tab inside elmah.io.

`Elmah.Io.NLog` provides a range of reserved property names, that can be used to fill in data in the correct fields on the elmah.io UI. Let's say you want to fill the `User` field using structured logging only:

```csharp
log.Info("{Quote} from {User}", "Hasta la vista, baby", "T-800");
```

This will fill in the value `T-800` in the `User` field, as well as add two key/value pairs (`Quote` and `User`) to the *Data* tab on elmah.io. For a reference of all possible property names, check out the property names on [CreateMessage](https://github.com/elmahio/Elmah.Io.Client/blob/main/src/Elmah.Io.Client/Models/CreateMessage.cs).


NLog also provides a fluent API (available in the `NLog.Fluent` namespace) that some might find more readable:

```csharp
logger.Info()
      .Message("I'll be back")
      .Property("User", "T-800")
      .Write();
```

If you want to use the normal logging methods like `Info` and `Error`, you can do so injunction with the `MappedDiagnosticsLogicalContext` class, also provided by NLog:

```csharp
using (MappedDiagnosticsLogicalContext.SetScoped("User", "T-800"))
{
   logger.Info("I'll be back");
}
```

This will create the same result as the example above.

## Message hooks

`Elmah.Io.NLog` provides message hooks similar to the integrations with ASP.NET and ASP.NET Core. Message hooks need to be implemented in C#. Either [configure the elmah.io target in C#](#configuration-in-code) or fetch the target already configured in XML:

```csharp
var elmahIoTarget = (ElmahIoTarget)LogManager.Configuration.FindTargetByName("elmahio");
```

You also need to install the most recent version of the `Elmah.Io.Client` NuGet package to use message hooks.

### Decorating log messages

To include additional information on log messages, you can use the `OnMessage` action:

```csharp
elmahIoTarget.OnMessage = msg =>
{
    msg.Version = "1.0.0";
};
```

The example above includes a version number on all errors.

### Handle errors

To handle any errors happening while processing a log message, you can use the OnError event when initializing the elmah.io target:

```csharp
elmahIoTarget.OnError = (msg, err) =>
{
    // Do something here
};
```

The example implements a callback if logging to elmah.io fails. How you choose to implement this is entirely up to your application and tech stack.

### Error filtering
To ignore specific errors based on their content, you can use the OnFilter event when initializing the elmah.io target:

```csharp
elmahIoTarget.OnFilter = msg =>
{
    return msg.Title.Contains("trace");
};
```

The example above ignores any log messages with the word `trace` in the title.

## Include HTTP context in ASP.NET and ASP.NET Core

When logging through NLog from a web application, you may want to include HTTP contextual information like the current URL, status codes, server variables, etc. NLog provides two web-packages to include this information. For ASP.NET, MVC, and Web API you can install the `NLog.Web` NuGet package and include the following code in `web.config`:

```xml
<system.webServer>
  <modules runAllManagedModulesForAllRequests="true">
    <add name="NLog" type="NLog.Web.NLogHttpModule, NLog.Web" />
  </modules>
</system.webServer>
```

For ASP.NET Core you can install the `NLog.Web.AspNetCore` NuGet package. When installed, the elmah.io NLog target automatically picks up the HTTP context and fill in all possible fields on messages sent to elmah.io.

## Troubleshooting

Here are some things to try out if logging from NLog to elmah.io doesn't work:

- Make sure that you have the newest `Elmah.Io.NLog` and `Elmah.Io.Client` packages installed.
- Make sure to include all of the configuration from the example above. That includes both the `<extensions>`, `<targets>`, and `<rules>` element.
- Make sure that the API key is valid and allow the *Messages* | *Write* [permission](https://docs.elmah.io/how-to-configure-api-key-permissions/).
- Make sure to include a valid log ID.
- Make sure that you have sufficient log messages in your subscription and that you didn't disable logging to the log or include any ignore filters/rules.
- Always make sure to call `LogManager.Shutdown()` before exiting the application to make sure that all log messages are flushed.
- Extend the `nlog` element with `internalLogLevel="Warn" internalLogFile="c:\temp\nlog-internal.log` and inspect that log file for any internal NLog errors.
- The new way to fully quality target names in NLog 5 is not yet supported since we have a dot (.) in the target name. This example shows both the wrong and the correct way to reference the target in NLog 5:

```xml
<!-- Wrong way -->
<targets>
  <target name="elmahio" type="Elmah.Io.NLog.elmah.io" ... />
</targets>

<!-- Correct way -->
<extensions>
  <add assembly="Elmah.Io.NLog" />
</extensions> 

<targets>
  <target name="elmahio" type="elmah.io" ... />
</targets>
```