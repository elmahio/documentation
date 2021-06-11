# Upgrade elmah.io from v3 to v4

There is a new major version update named `4.x` on all client packages. All integrations are based on the `Elmah.Io.Client` package which has switched from using AutoRest to NSwag. We have tried supporting most of the existing code from the `3.x` packages, but some minor code changes may be needed after upgrading. This guide will go through the changes needed and potential problems when upgrading.

## Updating the NuGet package

Which NuGet package to update rely on which integration you have installed. If you are using the `Elmah.Io.Client` package directly, you can simply upgrade that package through NuGet:

```ps
Update-Package Elmah.Io.Client
```

This installs the latest 4.x client. Most people are using one of the integrations with ASP.NET Core, Serilog, NLog, or similar. There are new major versions of these packages available as well.

You may experience problems where NuGet refuses to upgrade an `Elmah.Io.*` package. We experienced this when referencing more `Elmah.Io.*` packages from the same project. Like if you would reference both `Elmah.Io.AspNetCore` and `Elmah.Io.Extensions.Logging` from the same project. Upgrading in this scenario can be achieved in one of the following ways:

1. Uninstall all `Elmah.Io.*` packages and install them one by one.
2. Install the `4.x` version of the `Elmah.Io.Client` NuGet package. Then upgrade the remaining `Elmah.Io.*` NuGet packages one by one. Finally, uninstall the `Elmah.Io.Client` package.

## Code changes

As mentioned, some code changes may be required from your part after upgrading. Most of the API stayed the same, but NSwag generates output differently from AutoRest in some cases. Here's a list of changes needed:

- Remove any references to `Elmah.Io.Client.Models`. All generated classes are now in the `Elmah.Io.Client` namespace.
- Replace any reference to `IMessages`, `IHeartbeats`, and similar to `IMessagesClient`, `IHeartbeatsClient`, and similar.
- Replace any instances of `new ElmahioAPI(new ApiKeyCredentials(apiKey));` with `ElmahioAPI.Create(apiKey);`. The `ApiKeyCredentials` class was specific to AutoRest and have therefore been removed.
- Collection types on messages like `Data`, `ServerVariables`, etc. are now of type `ICollection` and not `IList`. This means you can no longer use indexers on these properties.
- Properties of type `DateTime` are replaced with `DateTimeOffset`. This shouldn't require any changes from your part since you can assign a value of type `DateTime` to a property of type `DateTimeOffset`.
