[![Build status](https://ci.appveyor.com/api/projects/status/eiw9tpstm67t02v6?svg=true)](https://ci.appveyor.com/project/ThomasArdal/elmah-io-extensions-logging)
[![NuGet](https://img.shields.io/nuget/v/Elmah.Io.Extensions.Logging.svg)](https://www.nuget.org/packages/Elmah.Io.Extensions.Logging)
[![Samples](https://img.shields.io/badge/samples-2-brightgreen.svg)](https://github.com/elmahio/Elmah.Io.Extensions.Logging/tree/master/samples)

# Logging from Entity Framework Core

Both elmah.io and Entity Framework Core supports logging through Microsoft.Extensions.Logging. To log all errors happening inside Entity Framework Core, install the [Elmah.Io.Extensions.Logging](https://www.nuget.org/packages/Elmah.Io.Extensions.Logging/) NuGet package:

```powershell
Install-Package Elmah.Io.Extensions.Logging
```

Then add elmah.io to a new or existing `LoggerFactory`:

```csharp
var loggerFactory = new LoggerFactory()
    .AddElmahIo("API_KEY", new Guid("LOG_ID"));
```

Replace `API_KEY` with your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and `LOG_ID` with the log ID ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)) that should receive errors from Entity Framework.

> When using Entity Framework Core from ASP.NET Core, you never create your own `LoggerFactory`. Factories are provided through DI by ASP.NET Core. Check out [this sample](https://github.com/elmahio/Elmah.Io.Extensions.Logging/tree/master/samples/Elmah.Io.Extensions.LoggingAspNetCore2WithEfCore2) for details.

Finally, enable logging in Entity Framework Core:

```csharp
optionsBuilder
    .UseLoggerFactory(loggerFactory)
    .UseSqlServer(...);
```

(`UseSqlServer` included for illustration purposes only - elmah.io works with any provider)

That's it! All errors happening in Entity Framework Core, are now logged in elmah.io.