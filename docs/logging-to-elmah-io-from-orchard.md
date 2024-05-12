---
title: Logging to elmah.io from Orchard CMS
description: Learn how to set up error logging to elmah.io from Orchard CMS. Integration from either ASP.NET Core or MVC to start monitoring your website.
---

# Logging to elmah.io from Orchard CMS

Orchard CMS is a free, open-source community-focused content management system built on the ASP.NET MVC and ASP.NET Core platforms. This tutorial is written for the ASP.NET Core version of Orchard. If you want to log to elmah.io from the MVC version, you should follow our [tutorial for MVC](logging-to-elmah-io-from-aspnet-mvc.md).

To start logging to elmah.io, install the `Elmah.Io.Client` and `Elmah.Io.AspNetCore` NuGet packages:

```powershell fct_label="Package Manager"
Install-Package Elmah.Io.Client
Install-Package Elmah.Io.AspNetCore
```
```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.Client
dotnet add package Elmah.Io.AspNetCore
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.Client" Version="5.*" />
<PackageReference Include="Elmah.Io.AspNetCore" Version="5.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.Client
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

Like with any other ASP.NET Core application, it's important to call the `UseElmahIo`-method after setting up other middleware handling exceptions (like `UseDeveloperExceptionPage`).

Orchard uses NLog as the internal logging framework. Hooking into this pipeline is a great way to log warnings and errors through NLog to elmah.io as well.

Install the `Elmah.Io.Nlog` NuGet package:

```powershell fct_label="Package Manager"
Install-Package Elmah.Io.NLog
```
```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.NLog
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.NLog" Version="5.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.NLog
```

Add the elmah.io target to the `NLog.config`-file:

```xml
<?xml version="1.0" encoding="utf-8" ?>
<nlog>

  <extensions>
    <!-- ... -->
    <add assembly="Elmah.Io.NLog"/>
  </extensions>
 
  <targets>
    <!-- ... -->
    <target name="elmahio" type="elmah.io" apiKey="API_KEY" logId="LOG_ID"/>
  </targets>

  <rules>
    <!-- ... -->
    <logger name="*" minlevel="Warn" writeTo="elmahio" />
  </rules>
</nlog>
```

Make sure not to log Trace and Debug messages to elmah.io, which will quickly use up the included storage.