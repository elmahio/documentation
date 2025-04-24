---
title: Logging to elmah.io from Piranha CMS
description: Learn how to set up error logging to elmah.io from the headless CMS Piranha. Install a NuGet package and a few lines of code and you're done.
---

# Logging to elmah.io from Piranha CMS

Piranha CMS is a popular headless CMS written in ASP.NET Core. elmah.io works with Piranha CMS out of the box. This document contains a quick installation guide for setting up elmah.io logging in Piranha CMS. For the full overview of logging from ASP.NET Core, check out [Logging to elmah.io from ASP.NET Core](logging-to-elmah-io-from-aspnet-core.md).

To start logging to elmah.io, install the `Elmah.Io.AspNetCore` NuGet package:

```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.AspNetCore
```
```powershell fct_label="Package Manager"
Install-Package Elmah.Io.AspNetCore
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.AspNetCore" Version="5.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.AspNetCore
```

Then modify your `Startup.cs` file:

```csharp
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        // ...
        services.AddElmahIo(o =>
        {
            o.ApiKey = "API_KEY";
            o.LogId = new Guid("LOG_ID");
        });
    }

    public void Configure(IApplicationBuilder app, IHostingEnvironment env)
    {
        // ...
        app.UseElmahIo();
        // ...
    }
}
```

Replace `API_KEY` with your API key ([Where is my API key?](where-is-my-api-key.md)) and `LOG_ID` with the id of the log ([Where is my log ID?](where-is-my-log-id.md)) where you want errors logged.

Make sure to call the `UseElmahIo`-method after setting up other middleware handling exceptions (like `UseDeveloperExceptionPage`), but before the call to `UsePiranha`.

To use structured logging and the `ILogger` interface with Piranha CMS and elmah.io, set up Microsoft.Extensions.Logging as explained here: [Logging to elmah.io from Microsoft.Extensions.Logging](logging-to-elmah-io-from-microsoft-extensions-logging.md).