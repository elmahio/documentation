# Upgrade elmah.io from v3 to v4

[TOC]

There is a new major version update named `4.x` on all client packages. All integrations are based on the `Elmah.Io.Client` package which has switched from using AutoRest to NSwag. We have tried supporting most of the existing code from the `3.x` packages, but some minor code changes may be needed after upgrading. This guide will go through the changes needed and potential problems when upgrading.

You may experience problems where NuGet refuses to upgrade an `Elmah.Io.*` package. We experienced this when referencing more `Elmah.Io.*` packages from the same project. Like if you would reference both `Elmah.Io.AspNetCore` and `Elmah.Io.Extensions.Logging` from the same project. Upgrading in this scenario can be achieved in one of the following ways:

1. Uninstall all `Elmah.Io.*` packages and install them one by one.
2. Install the `4.x` version of the `Elmah.Io.Client` NuGet package. Then upgrade the remaining `Elmah.Io.*` NuGet packages one by one. Finally, uninstall the `Elmah.Io.Client` package.

## Upgrading Elmah.Io.Client

If you are using the `Elmah.Io.Client` package directly, you can simply upgrade that package through NuGet:

```powershell
Update-Package Elmah.Io.Client
```

This installs the latest 4.x client. Most people are using one of the integrations with ASP.NET Core, Serilog, NLog, or similar. There are new major versions of these packages available as well.

### Code changes

As mentioned, some code changes may be required from your part after upgrading. Most of the API stayed the same, but NSwag generates output differently from AutoRest in some cases. Here's a list of changes needed:

- Remove any references to `Elmah.Io.Client.Models`. All generated classes are now in the `Elmah.Io.Client` namespace.
- Replace any reference to `IMessages`, `IHeartbeats`, and similar to `IMessagesClient`, `IHeartbeatsClient`, and similar.
- Replace any instances of `new ElmahioAPI(new ApiKeyCredentials(apiKey));` with `ElmahioAPI.Create(apiKey);`. The `ApiKeyCredentials` class was specific to AutoRest and has therefore been removed.
- Collection types on messages like `Data`, `ServerVariables`, etc. are now of type `ICollection` and not `IList`. This means you can no longer use indexers on these properties. To use indexer you can call `ToList()` on each collection.
- Properties of type `DateTime` are replaced with `DateTimeOffset`. This shouldn't require any changes on your part since you can assign a value of type `DateTime` to a property of type `DateTimeOffset`.
- You no longer need to make the following cast: `(ElmahioAPI)ElmahioAPI.Create(apiKey)`. The `IElmahioAPI` interface will have all the properties you need from the client.
- If you for some reason manually installed the `Microsoft.Rest.ClientRuntime` package you can remove that after upgrading `Elmah.Io.Client` to v4. Unless you have other dependencies on `Microsoft.Rest.ClientRuntime`.
- The `OnMessageFail` event, available on the `IMessagesClient` interface (previously just `IMessages`), does now trigger more often. On v3, this event would only trigger on timeouts connecting with the server, when the server returned `500`, and similar. In v4, the event will trigger on every failing request, meaning a request where the response contains a status code >= `400`. This will make it a lot easier to make smart choices on the client when something fails. An example of this could be to implement a circuit breaker pattern or a local processing queue on the client when the elmah.io API starts returning `429` (too many requests).

## Upgrading Elmah.Io.AspNetCore

Upgrading the `Elmah.Io.AspNetCore` package can be done through NuGet:

```ps
Update-Package Elmah.Io.AspNetCore
```

### Code changes

Besides the changes mentioned in the section about the `Elmah.Io.Client` package, there's a single change in the `Elmah.Io.AspNetCore` v4 package as well:

- The `ElmahIoExtensions` class has been moved from the `Elmah.Io.AspNetCore` namespace to the `Microsoft.Extensions.DependencyInjection` namespace. The `ElmahIoExtensions` class contains the `UseElmahIo` and `AddElmahIo` methods that you call in your `Startup.cs` file. This change should not cause any compile errors. For simple installations without custom options, you can most likely remove the `using Elmah.Io.AspNetCore;` line from the `Startup.cs` file. Visual Studio will tell if that line is no longer needed.