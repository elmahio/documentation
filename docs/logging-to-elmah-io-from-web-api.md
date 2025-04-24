---
title: Logging to elmah.io from ASP.NET Web API
description: Learn about how to set up logging of all uncaught exceptions in ASP.NET Web API to elmah.io. Monitor your APIs with a single NuGet install only.
---

[![Build status](https://github.com/elmahio/elmah.io/workflows/build/badge.svg)](https://github.com/elmahio/elmah.io/actions?query=workflow%3Abuild)
[![NuGet](https://img.shields.io/nuget/v/Elmah.Io.WebApi.svg)](https://www.nuget.org/packages/Elmah.Io.WebApi)
[![Samples](https://img.shields.io/badge/samples-1-brightgreen.svg)](https://github.com/elmahio/elmah.io/tree/master/samples/Elmah.Io.WebApi)

# Logging to elmah.io from Web API

Web API provides its own mechanism for handling errors, why ELMAH’s modules and handlers don't work there. Luckily, Richard Dingwall created the [Elmah.Contrib.WebApi](https://www.nuget.org/packages/Elmah.Contrib.WebApi/) NuGet package to fix this. We've built a package for ASP.NET Web API exclusively, which installs all the necessary packages.

To start logging exceptions from Web API, install the `Elmah.Io.WebApi` NuGet package:

```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.WebApi
```
```powershell fct_label="Package Manager"
Install-Package Elmah.Io.WebApi
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.WebApi" Version="5.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.WebApi
```

During the installation, you will be asked for your API key ([Where is my API key?](where-is-my-api-key.md)) and log ID ([Where is my log ID?](where-is-my-log-id.md)).

<div class="tabbable-responsive">
<div class="tabbable">
<ul class="nav nav-tabs" role="tablist">
    <li role="presentation" class="nav-item"><a class="nav-link active" href="#setup2" aria-controls="home" role="tab" data-bs-toggle="tab" data-bs-tab="webapi2">Web API 2.x</a></li>
    <li role="presentation" class="nav-item"><a class="nav-link" href="#setup1" aria-controls="profile" role="tab" data-bs-toggle="tab" data-bs-tab="webapi1">Web API 1.x</a></li>
</ul>
</div>
</div>

<div class="tab-content tab-content-tabbable" markdown="1">
<div role="tabpanel" class="tab-pane active" id="setup2" markdown="1">
Add the following code to your `WebApiConfig.cs` file:

```csharp
public static class WebApiConfig
{
    public static void Register(HttpConfiguration config)
    {
        // ...
        config.Services.Add(typeof(IExceptionLogger), new ElmahExceptionLogger());
        // ...
    }
}
```

The registered `IExceptionLogger` intercepts all thrown exceptions, even errors in controller constructors and routing errors.
</div>

<div role="tabpanel" class="tab-pane" id="setup1" markdown="1">
Add the following code to your `Global.asax.cs` file:

```csharp
protected void Application_Start()
{
    // ...
    GlobalConfiguration.Configuration.Filters.Add(new ElmahHandleErrorApiAttribute());
    // ...
}
```

In this case you register a new global filter with Web API. The downside of this approach is, that only errors thrown in controller actions are logged.
</div>
</div>

All uncaught exceptions in ASP.NET Web API are now logged to elmah.io

## Logging from exception/action filters

It's a widely used Web API approach, to handle all exceptions in a global exception/action filter and return a nicely formatted JSON/XML error response to the client. This is a nice approach to avoid throwing internal server errors, but it also puts ELMAH out of the game. When catching any exception manually and converting it to a response message, errors won't be logged in elmah.io.

To overcome this, errors should be logged manually from your global exception/action filter:

```csharp
public class NotImplExceptionFilterAttribute : ExceptionFilterAttribute 
{
    public override void OnException(HttpActionExecutedContext context)
    {
        ErrorSignal.FromCurrentContext().Raise(context.Exception);

        // Now generate the result to the client
    }
}
```
