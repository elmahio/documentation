---
title: Logging to elmah.io from Entity Framework Core
description: Log all errors inside Entity Framework Core with elmah.io. Get insights into failing requests and much more with just a few lines of code.
---

[![Build status](https://github.com/elmahio/Elmah.Io.Extensions.Logging/workflows/build/badge.svg)](https://github.com/elmahio/Elmah.Io.Extensions.Logging/actions?query=workflow%3Abuild)
[![NuGet](https://img.shields.io/nuget/v/Elmah.Io.Extensions.Logging.svg)](https://www.nuget.org/packages/Elmah.Io.Extensions.Logging)
[![Samples](https://img.shields.io/badge/samples-2-brightgreen.svg)](https://github.com/elmahio/Elmah.Io.Extensions.Logging/tree/main/samples)

# Logging to elmah.io from Entity Framework Core

Both elmah.io and Entity Framework Core supports logging through Microsoft.Extensions.Logging. To log all errors happening inside Entity Framework Core, install the [Elmah.Io.Extensions.Logging](https://www.nuget.org/packages/Elmah.Io.Extensions.Logging/) NuGet package:

```powershell fct_label="Package Manager"
Install-Package Elmah.Io.Extensions.Logging
```
```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.Extensions.Logging
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.Extensions.Logging" Version="5.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.Extensions.Logging
```

Then add elmah.io to a new or existing `LoggerFactory`:

```csharp
var loggerFactory = new LoggerFactory()
    .AddElmahIo("API_KEY", new Guid("LOG_ID"));
```

Replace `API_KEY` with your API key ([Where is my API key?](where-is-my-api-key.md)) and `LOG_ID` with the log ID ([Where is my log ID?](where-is-my-log-id.md)) that should receive errors from Entity Framework.

> When using Entity Framework Core from ASP.NET Core, you never create a `LoggerFactory`. Factories are provided through DI by ASP.NET Core. Check out [this sample](https://github.com/elmahio/Elmah.Io.Extensions.Logging/tree/main/samples/Elmah.Io.Extensions.Logging.EntityFrameworkCore80) for details.

Finally, enable logging in Entity Framework Core:

```csharp
optionsBuilder
    .UseLoggerFactory(loggerFactory)
    .UseSqlServer(/*...*/);
```

(`UseSqlServer` included for illustration purposes only - elmah.io works with any provider)

That's it! All errors happening in Entity Framework Core, are now logged in elmah.io.

## Logging from interceptors

Interceptors in Entity Framework are hooks/events that you can implement to get notified when different actions happen towards your database. Interceptors can be used for a range of tasks like maintaining created/modified dates, calculating fields on save, logging, and many more.

To illustrate how interceptors can be used to enrich elmah.io with custom log messages, the following code shows how to create a simple audit log of creating new users in the database. The code for the interceptor could look similar to this:

```csharp
public class SaveUsersAuditLog : SaveChangesInterceptor
{
    private readonly ILogger<SaveUsersAuditLog> logger;

    public SaveUsersAuditLog(ILogger<SaveUsersAuditLog> logger)
    {
        this.logger = logger;
    }

    public override int SavedChanges(SaveChangesCompletedEventData eventData, int result)
    {
        var dbContext = eventData.Context;
        foreach (var entry in dbContext
            .ChangeTracker
            .Entries<User>()
            .Where(user => user.State == EntityState.Added))
        {
            using (logger.BeginScope(new Dictionary<string, object> { { "DebugView", entry.DebugView.LongView } }))
            {
                logger.LogInformation("Adding user with {UserId}", entry.Entity.Id);
            }
        }

        return base.SavedChanges(eventData, result);
    }
}
```

The class extends `SaveChangesIntercepter` and overrides the `SavedChanges` method. This will be called by Entity Framework when entities are saved to the database. By filtering on the entity state `Added`, you can log a custom message for all new users added to the database. In the example, the message `Adding user with {UserId}` is logged and the value of the `Id` property is used as part of the structured log message. In addition, the code uses scopes in Microsoft.Extensions.Logging to log an additional property named `DebugView` with the long debug message provided by Entity Framework. This key/value will show up on the *Data* tab within the elmah.io UI.

> Be careful when logging entities that may contain personal identifiable data (PID). Adding debug messages from Entity Framework will contain this PID and share it with elmah.io.

Registering interceptors varies by the way you set up Entity Framework. Following the code in the first parts of this page, you can create a logger and register the interceptor like this:

```csharp
var logger = loggerFactory.CreateLogger<SaveUsersAuditLog>();
optionsBuilder.AddInterceptors(new SaveUsersAuditLog(logger));
```