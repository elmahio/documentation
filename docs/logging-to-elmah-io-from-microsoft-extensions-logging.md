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

Replace `API_KEY` with your API key found on the profile page and `LOG_ID` with the id of the log you wish to log to.

Finally create a new logger and start logging exceptions:

```csharp
var logger = factory.CreateLogger("MyLog");
logger.LogError(1, ex, "Unexpected error");
```