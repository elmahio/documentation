# Logging from Web API

Web API provides its own mechanism for handling errors, why ELMAH’s modules and handlers doesn’t work there. Luckily Richard Dingwall created the [Elmah.Contrib.WebApi](https://www.nuget.org/packages/Elmah.Contrib.WebApi/) NuGet package to fix this.

To start logging exceptions from Web API, install the NuGet packages:

```powershell
Install-Package elmah.io
Install-Package Elmah.Contrib.WebApi
```

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