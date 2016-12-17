# Logging from NLog

NLog is one of the most popular logging frameworks for .NET. With an active history on almost 10 years, the possibilities with NLog are many and it’s easy to find documentation on how to use it.

To start logging messages from NLog to elmah.io, you need to install the elmah.io.nlog NuGet package:

```powershell
Install-Package elmah.io.nlog
```

To configure the elmah.io target, add the following configuration to your app.config/web.config/nlog.config depending on what kind of project you’ve created:

```xml
<extensions>
  <add assembly="Elmah.Io.NLog"/>
</extensions>
 
<targets>
  <target name="elmahio" type="elmah.io" logId="cc6043e9-5d7b-4986-8056-cb76d4d52e5e"/>
</targets>
 
<rules>
  <logger name="*" minlevel="Info" writeTo="elmahio" />
</rules>
```

In the example we specify the level minimum as Info. This tells NLog to log only information, warning, error and fatal messages. You may adjust this, but be aware that your elmah.io log may run full pretty fast, especially if you log thousands and thousands of trace and debug messages.

Log messages to elmah.io, just as with every other target and NLog:

```csharp
log.Warn("This is a warning message");
log.Error(new Exception(), "This is an error message");
```

## Custom Properties

NLog supports custom properties like most other logging frameworks. With custom properties, you can log additional key/value pairs with every log message. The elmah.io appender for NLog, supports [custom properties](http://docs.elmah.io/logging-custom-data/) as well. Properties are persisted alongside every log message in elmah.io and searchable if [named correctly](http://localhost:8000/logging-custom-data/#searching-custom-data).

To log custom properties with NLog and elmah.io, you need to use an overload of each logging-method that takes a `LogEventInfo` object as parameter:

```csharp
var infoMessage = new LogEventInfo(LogLevel.Info, "", "This is an information message");
infoMessage.Properties.Add("Some Property Key", "Some Property Value");
log.Info(infoMessage);
```

This saves the information message in elmah.io with a custom property with key `Some Property Key`and value `Some Property Value`.