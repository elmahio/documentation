---
title: Documentation for integrations and elmah.io features
description: Here you will find updated documentation on how to use elmah.io. From our different integrations to all of the features available, this is the place to look for help.
---

# elmah.io Installation Quick Start

Welcome to the quick-start installation guide. Here you will find a quick introduction to installing elmah.io. For the full overview, read through the individual guides by clicking a technology below:

<div class="guides-boxes row">
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/logging-to-elmah-io-from-elmah/" title="ASP.NET">
            <div class="guide-box">
                <div class="guide-image">
                    <img class="no-lightbox" src="/./assets/img/guides/aspnet.png" alt="ASP.NET" />
                </div>
                <div class="guide-title">ASP.NET</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/logging-to-elmah-io-from-aspnet-mvc/" title="ASP.NET MVC">
            <div class="guide-box">
                <div class="guide-image">
                    <img class="no-lightbox" src="/./assets/img/guides/aspnet.png" alt="ASP.NET MVC" />
                </div>
                <div class="guide-title"><span>ASP.NET MVC</span></div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/logging-to-elmah-io-from-web-api/" title="ASP.NET Web API">
            <div class="guide-box">
                <div class="guide-image">
                    <img class="no-lightbox" src="/./assets/img/guides/aspnet.png" alt="ASP.NET Web API" />
                </div>
                <div class="guide-title">ASP.NET Web API</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/logging-to-elmah-io-from-aspnet-core/" title="ASP.NET Core">
            <div class="guide-box">
                <div class="guide-image">
                    <img class="no-lightbox" src="/./assets/img/guides/aspnetcore.png" alt="ASP.NET Core" />
                </div>
                <div class="guide-title">ASP.NET Core</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/logging-to-elmah-io-from-microsoft-extensions-logging/" title="Microsoft.Extensions.Logging">
            <div class="guide-box">
                <div class="guide-image">
                    <img class="no-lightbox" src="/./assets/img/guides/microsoft.png" alt="Microsoft.Extensions.Logging" />
                </div>
                <div class="guide-title">MEL</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/logging-to-elmah-io-from-azure-functions/" title="Azure Functions">
            <div class="guide-box">
                <div class="guide-image">
                    <img class="no-lightbox" src="/./assets/img/guides/azure-functions.png" alt="Azure Functions" />
                </div>
                <div class="guide-title">Functions</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/logging-to-elmah-io-from-serilog/" title="Serilog">
            <div class="guide-box">
                <div class="guide-image">
                    <img class="no-lightbox" src="/./assets/img/guides/serilog.png" alt="Serilog" />
                </div>
                <div class="guide-title">Serilog</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/logging-to-elmah-io-from-log4net/" title="log4net">
            <div class="guide-box">
                <div class="guide-image">
                    <img class="no-lightbox" src="/./assets/img/guides/log4net.png" alt="log4net" />
                </div>
                <div class="guide-title">log4net</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/logging-to-elmah-io-from-nlog/" title="NLog">
            <div class="guide-box">
                <div class="guide-image">
                    <img class="no-lightbox" src="/./assets/img/guides/nlog.png" alt="NLog" />
                </div>
                <div class="guide-title">NLog</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/logging-to-elmah-io-from-logary/" title="Logary">
            <div class="guide-box">
                <div class="guide-image">
                    <img class="no-lightbox" src="/./assets/img/guides/logary.png" alt="Logary" />
                </div>
                <div class="guide-title">Logary</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/logging-to-elmah-io-from-umbraco/" title="Umbraco">
            <div class="guide-box">
                <div class="guide-image">
                    <img class="no-lightbox" src="/./assets/img/guides/umbraco.png" alt="Umbraco" />
                </div>
                <div class="guide-title">Umbraco</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/logging-to-elmah-io-from-javascript/" title="JavaScript">
            <div class="guide-box">
                <div class="guide-image">
                    <img class="no-lightbox" src="/./assets/img/guides/javascript.png" alt="JavaScript" />
                </div>
                <div class="guide-title">JavaScript</div>
            </div>
        </a>
    </div>
</div>

## ASP.NET / MVC / Web API

Install the `Elmah.Io` NuGet package:

```powershell fct_label="Package Manager"
Install-Package Elmah.Io
```
```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io" Version="3.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io
```

During the installation, you will be asked for your API key and log ID.

For more information, check out the installation guides for [WebForms](/logging-to-elmah-io-from-elmah/), [MVC](/logging-to-elmah-io-from-aspnet-mvc/), and [Web API](/logging-to-elmah-io-from-web-api/). There is a short video tutorial available here:

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/OeQG2PkSpSE?rel=0" title="elmah.io Introduction - Installation" allowfullscreen></iframe>
</div><br/>

## ASP.NET Core

Install the `Elmah.Io.AspNetCore` NuGet package:

```powershell fct_label="Package Manager"
Install-Package Elmah.Io.AspNetCore
```
```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.AspNetCore
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.AspNetCore" Version="3.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.AspNetCore
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
    // ...
}

public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory fac)
{
    // ...
    app.UseElmahIo();
    // ...
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