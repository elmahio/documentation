---
title: Documentation for integrations and elmah.io features
description: Here you will find updated documentation on how to use elmah.io. From our different integrations to all of the features available, this is the place to look for help.
---

# elmah.io Installation Quick Start

Welcome to the quick start installation guide. Here you will find a quick introduction to installing elmah.io. For the full overview, read through the individual guides by clicking a technology in the left menu.

## ASP.NET / MVC / Web API

Install the `Elmah.Io` NuGet package:

```ps
Install-Package Elmah.Io
```

During the installation, you will be asked for your API key and log ID.

For more information, check out the installation guides for [WebForms](/logging-to-elmah-io-from-elmah/), [MVC](/logging-to-elmah-io-from-aspnet-mvc/) and [Web API](/logging-to-elmah-io-from-web-api/). There is a short video tutorial available here:

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/ZiebaLptkKs?rel=0" allowfullscreen></iframe>
</div><br/>

## ASP.NET Core

Install the `Elmah.Io.AspNetCore` NuGet package:

```ps
Install-Package Elmah.Io.AspNetCore
```

Once installed, call `AddElmahIo` in the `ConfigureServices`-method and `UseElmahIo` in the `Configure`-method (both in the `Startup.cs` file):

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddElmahIo(o =>
    {
        o.ApiKey = "API_KEY";
        o.LogId = new Guid("LOG_ID");
    });
    ...
}

public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory fac)
{
    ...
    app.UseElmahIo();
    ...
}
```

Make sure to insert your API key and log ID.

For more information, check out the installation guides for [ASP.NET Core](/logging-to-elmah-io-from-aspnet-core/) and [Microsoft.Extensions.Logging](/logging-to-elmah-io-from-microsoft-extensions-logging/).

## JavaScript

Install the `elmah.io.javascript` npm package:

```ps
npm install elmah.io.javascript
```

Reference the installed script and include your API key and log ID as part of the URL:

```html
<script src="~/node_modules/elmah.io.javascript/dist/elmahio.min.js?apiKey=YOUR-API-KEY&logId=YOUR-LOG-ID" type="text/javascript"></script>
```

For more information, check out the installation guide for [JavaScript](/logging-to-elmah-io-from-javascript/).