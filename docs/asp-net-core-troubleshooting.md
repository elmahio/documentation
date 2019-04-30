# ASP.NET Core Troubleshooting

So, your ASP.NET Core application doesn't log errors to elmah.io? We are here with a few things to try out.

- Make sure to reference the most recent version of the <a href="https://www.nuget.org/packages/elmah.io.aspnetcore/" target="_blank" rel="noopener noreferrer">Elmah.Io.AspNetCore</a> NuGet package.
- Make sure that the <a href="https://www.nuget.org/packages/Elmah.Io.Client/" target="_blank" rel="noopener noreferrer">Elmah.Io.Client</a> NuGet package is installed and that the major version matches that of `Elmah.Io.AspNetCore`.
- Make sure that you are calling both the `AddElmahIo`- and `UseElmahIo`-methods in the `Startup.cs` file, as described on [Logging to elmah.io from ASP.NET Core](/logging-to-elmah-io-from-aspnet-core/).
- Make sure that you call the `UseElmah`-method after invoking other `Use*` methods that in any way inspect exceptions (like `UseDeveloperExceptionPage` and `UseExceptionHandler`).
- Make sure that your server has an outgoing internet connection and that it can communicate with `api.elmah.io` on port `443`. The integration for ASP.NET Core support setting up an HTTP proxy if your server doesn't allow outgoing traffic. Check out [Logging through a proxy](/logging-to-elmah-io-from-aspnet-core/#logging-through-a-proxy) for details.
- Make sure that you didn't enable any Ignore filters or set up any Rules with an ignore action on the log in question.
- Make sure that you don't have any code catching all exceptions happening in your system and ignoring them (could be a logging filter, a piece of middleware, or similar).

## Common exceptions and how to fix them

Here you will a list of common exceptions and how to solve them.

### InvalidOperationException

**Exception**

```
[InvalidOperationException: Unable to resolve service for type 'Elmah.Io.AspNetCore.IBackgroundTaskQueue' while attempting to activate 'Elmah.Io.AspNetCore.ElmahIoMiddleware'.]
   Microsoft.Extensions.Internal.ActivatorUtilities+ConstructorMatcher.CreateInstance(IServiceProvider provider)
   Microsoft.AspNetCore.Builder.UseMiddlewareExtensions+<>c__DisplayClass4_0.<UseMiddleware>b__0(RequestDelegate next)
   Microsoft.AspNetCore.Builder.Internal.ApplicationBuilder.Build()
   Microsoft.AspNetCore.Hosting.Internal.WebHost.BuildApplication()
```

**Solution**

You forgot to call the `AddElmahIo`-method in the `Startup.cs` file:

```csharp
public void ConfigureServices(IServiceCollection services)
{
    ...
    services.AddElmahIo(o =>
    {
        ...
    });
    ....
}
```