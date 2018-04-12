[![Build status](https://ci.appveyor.com/api/projects/status/j82k842uc26w2drg?svg=true)](https://ci.appveyor.com/project/ThomasArdal/elmah-io)
[![NuGet](https://img.shields.io/nuget/v/Elmah.Io.WebApi.svg)](https://www.nuget.org/packages/Elmah.Io.WebApi)
[![Samples](https://img.shields.io/badge/samples-1-brightgreen.svg)](https://github.com/elmahio/elmah.io/tree/master/samples/Elmah.Io.WebApi)

# Logging to elmah.io from Web API

Web API provides its own mechanism for handling errors, why ELMAH’s modules and handlers doesn’t work there. Luckily, Richard Dingwall created the [Elmah.Contrib.WebApi](https://www.nuget.org/packages/Elmah.Contrib.WebApi/) NuGet package to fix this. We've built a package for ASP.NET Web API exclusively, which installs all the necessary packages.

To start logging exceptions from Web API, install the NuGet package:

```powershell
Install-Package Elmah.Io.WebApi
```

During the installation, you will be asked for your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and log ID ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)).

Add the following code to your `WebApiConfig.cs` file:

```csharp
public static class WebApiConfig
{
    public static void Register(HttpConfiguration config)
    {
        ...
        config.Services.Add(typeof(IExceptionLogger), new ElmahExceptionLogger());
        ...
    }
}
```

`IExceptionLogger` is a new concept in Web API 2. It intercepts all thrown exceptions, even errors in controller contructors and routing errors.

If you are using Web API 1, there’s another way to add exception logging:

```csharp
protected void Application_Start()
{
    ...
    GlobalConfiguration.Configuration.Filters.Add(new ElmahHandleErrorApiAttribute());
    ...
}
```

In this case you register a new global filter with Web API. The downside of this approach is, that only errors thrown in controller actions are logged.

All uncaught exceptions in ASP.NET Web API are now logged to elmah.io