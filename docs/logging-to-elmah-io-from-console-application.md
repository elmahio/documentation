# Logging from Console

Even though elmah.io support various logging frameworks like [Serilog](https://docs.elmah.io/logging-to-elmah-io-from-serilog/), [log4net](https://docs.elmah.io/logging-to-elmah-io-from-log4net/) and [NLog](https://docs.elmah.io/logging-to-elmah-io-from-nlog/), logging from a simple console application is dead simple. Since we currently provide two different versions of our API, the examples are split by version.

To start logging, install the [Elmah.Io.Client](https://www.nuget.org/packages/elmah.io.client/) NuGet package (in either version 2.x or 3.x):

```powershell
Install-Package Elmah.Io.Client
```

## Version 3.x

Create a new `ElmahioAPI`:

```csharp
var logger = ElmahioAPI.Create("API_KEY");
```

Replace `API_KEY` with your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)).

The elmah.io client supports logging in different log levels much like other logging frameworks for .NET:

```csharp
var logId = new Guid("LOG_ID");
logger.Messages.Fatal(logId, new ApplicationException("A fatal exception"), "Fatal message");
logger.Messages.Error(logId, new ApplicationException("An exception"), "Error message");
logger.Messages.Warning(logId, "A warning");
logger.Messages.Information(logId, "An info message");
logger.Messages.Debug(logId, "A debug message");
logger.Messages.Verbose(logId, "A verbose message");
```

Replace ```LOG_ID``` with your log ID from elmah.io ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)).

## Version 2.x

Create a new ```Logger```and assign it to a variable of type ```ILogger```:

```csharp
Elmah.Io.Client.ILogger logger = new Elmah.Io.Client.Logger(new Guid("LOG_ID"));
```

Replace ```LOG_ID``` with your log ID from elmah.io ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)).

The elmah.io client supports logging in different log levels much like other logging frameworks for .NET:

```csharp
logger.Verbose("Verbose message");
logger.Debug("Debug message");
logger.Information("Information message");
logger.Warning("Warning message");
logger.Error("Error message");
logger.Fatal("Fatal message");
```