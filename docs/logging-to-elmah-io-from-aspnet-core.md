# Logging from ASP.NET Core

Since ELMAH hasn't been ported to ASP.NET Core yet, we've built a provider for the new logging abstraction bundled with ASP.NET Core: [Microsoft.Extensions.Logging](https://github.com/aspnet/Logging).

> The elmah.io provider for ASP.NET logging is currently in beta. We would really appreciate some feedback from you guys.

To log all warnings and errors from ASP.NET (Core), install the following NuGet package:

```powershell
Install-Package Elmah.Io.AspNetCore -Pre
```

Configure the elmah.io logger in `Startup.cs` or whatever file you are using to initialize your web app:

```csharp
public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory fac)
{
    app.UseElmahIo("API_KEY", new Guid("LOG_ID"));
}
```

(replace `API_KEY` with your API key found on your profile on elmah.io and `LOG_ID` with the log Id of the log you want to log to).

To decorate errors with information about the failing request, you will need to install the [Microsoft.AspNetCore.Http](https://www.nuget.org/packages/Microsoft.AspNetCore.Http/)  NuGet package and register `IHttpContextAccessor` in `Startup.cs`:

```csharp
public void ConfigureServices(IServiceCollection services)
{
    ...
    services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
    ...
}
```

That's it. Every warning and error will be logged to elmah.io. Logging manuel errors are as easy as 1-2-3:

```csharp
logger.LogError(1, new Exception(), "Unexpected error");
```

where `logger` is an instance of `Microsoft.Extensions.Logging.ILogger`.