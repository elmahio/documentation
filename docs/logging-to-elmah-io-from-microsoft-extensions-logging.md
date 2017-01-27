# Logging from Microsoft.Extensions.Logging

[Microsoft.Extensions.Logging](https://github.com/aspnet/Logging) is a common logging abstraction from Microsoft, much like log4net and Serilog. Microsoft.Extensions.Logging started as a new logging mechanism for ASP.NET Core, but now acts as a logging framework for all sorts of project types.

Start by installing the [Elmah.Io.Extensions.Logging](https://www.nuget.org/packages/Elmah.Io.Extensions.Logging/) package:

```powershell
Install-Package Elmah.Io.Extensions.Logging -Pre
```

Then create a new `LoggerFactory`:

```csharp
var factory = new LoggerFactory();
```

A dependency injection based application like ASP.NET Core would get `ILoggerFactory` injected instead.

Configure Microsoft.Extensions.Logging to use elmah.io:

```csharp
factory.AddElmahIo("API_KEY", new Guid("LOG_ID"));
```

Replace `API_KEY` with your API key found on the organization settings page and `LOG_ID` with the id of the log you wish to log to.

Finally, create a new logger and start logging exceptions:

```csharp
var logger = factory.CreateLogger("MyLog");
logger.LogError(1, ex, "Unexpected error");
```

## Filtering log messages

As default, the elmah.io logger for Microsoft.Extensions.Logging only logs warnings, errors and fatals. The rationale behind this is that we build an error management system and really doesn't do much to support millions of debug messages from your code. Sometimes you may want to log non-exception messages, though. To do so, use filters in Microsoft.Extensions.Logging.

To log everything from log level `Information` and up, use the `AddElmahIo` overload which accepts a filter:

```csharp
factory.AddElmahIo("API_KEY", new Guid("LOG_ID"), new FilterLoggerSettings
{
    {"elmah.io", LogLevel.Information}
});
```

In the code sample, every log message with the category `elmah.io` and a log level of `Information` and up, will be logged to elmah.io. To log a new information message, create a logger with the `elmah.io` category and call the `LogInformation` method:

```csharp
var logger = factory.CreateLogger("elmah.io");
logger.LogInformation("This is an information message");
```