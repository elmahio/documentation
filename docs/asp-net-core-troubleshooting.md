# ASP.NET Core Troubleshooting

So, your ASP.NET Core application doesn't log errors to elmah.io? Here is a list of things to try out:

- Make sure to reference the most recent version of the <a href="https://www.nuget.org/packages/elmah.io.aspnetcore/" target="_blank" rel="noopener noreferrer">Elmah.Io.AspNetCore</a> NuGet package.
- Make sure that the <a href="https://www.nuget.org/packages/Elmah.Io.Client/" target="_blank" rel="noopener noreferrer">Elmah.Io.Client</a> NuGet package is installed and that the major version matches that of `Elmah.Io.AspNetCore`.
- Make sure that you are calling both the `AddElmahIo`- and `UseElmahIo`-methods in the `Startup.cs` file, as described on [Logging to elmah.io from ASP.NET Core](/logging-to-elmah-io-from-aspnet-core/).
- Make sure that you call the `UseElmahIo`-method after invoking other `Use*` methods that in any way inspect exceptions (like `UseDeveloperExceptionPage` and `UseExceptionHandler`).
- Make sure that you call the `UseElmahIo`-method before invoking `UseMvc`.
- Make sure that your server has an outgoing internet connection and that it can communicate with `api.elmah.io` on port `443`. The integration for ASP.NET Core support setting up an HTTP proxy if your server doesn't allow outgoing traffic. Check out [Logging through a proxy](/logging-to-elmah-io-from-aspnet-core/#logging-through-a-proxy) for details.
- Make sure that you didn't enable any Ignore filters or set up any Rules with an ignore action on the log in question.
- Make sure that you don't have any code catching all exceptions happening in your system and ignoring them (could be a logging filter, a piece of middleware, or similar).
- Make sure that you haven't reached the message limit included in your current plan. Your current usage can be viewed on the *Subscription* tab on organization settings.

<div class="alert alert-primary">
    <div class="row">
        <div class="col-auto align-self-start">
            <div class="fa fa-lightbulb"></div>
        </div>
        <div class="col">Some of the bullets above have been implemented as Roslyn analyzers. Check out <a href="/roslyn-analyzers-for-elmah-io-and-aspnet-core/">Roslyn analyzers for elmah.io and ASP.NET Core</a> for details.</div>
    </div>
</div>

## Common problems and how to fix them

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
    // ...
    services.AddElmahIo(o =>
    {
        // ...
    });
    // ...
}
```

### ArgumentException

**Exception**

```
[ArgumentException: Input an API key Parameter name: apiKey]
   Elmah.Io.AspNetCore.Extensions.StringExtensions.AssertApiKey(string apiKey)
   Elmah.Io.AspNetCore.ElmahIoMiddleware..ctor(RequestDelegate next, IBackgroundTaskQueue queue, IOptions<ElmahIoOptions> options)
   Microsoft.Extensions.Internal.ActivatorUtilities+ConstructorMatcher.CreateInstance(IServiceProvider provider)
   Microsoft.Extensions.Internal.ActivatorUtilities.CreateInstance(IServiceProvider provider, Type instanceType, Object[] parameters)
   Microsoft.AspNetCore.Builder.UseMiddlewareExtensions+<>c__DisplayClass4_0.<UseMiddleware>b__0(RequestDelegate next)
   Microsoft.AspNetCore.Builder.Internal.ApplicationBuilder.Build()
   Microsoft.AspNetCore.Hosting.Internal.WebHost.BuildApplication()
```

**Solution**

You forgot to call the `AddElmahIo`-method in the `Startup.cs` file:

```csharp
public void ConfigureServices(IServiceCollection services)
{
    // ...
    services.AddElmahIo(o =>
    {
        // ...
    });
    // ...
}
```

or you called `AddElmahIo` without options and didn't provide these options elsewhere:

```csharp
public void ConfigureServices(IServiceCollection services)
{
    // ...
    services.AddElmahIo();
    // ...
}
```

Even though you configure elmah.io through `appsettings.json` you still need to call `AddElmahIo`. In this case, you can register `ElmahIoOptions` manually and use the empty `AddElmahIo` overload:

```csharp
public void ConfigureServices(IServiceCollection services)
{
    // ...
    services.Configure<ElmahIoOptions>(Configuration.GetSection("ElmahIo"));
    services.AddElmahIo();
    // ...
}
```

### An error occurred while starting the application

If you see the error `An error occurred while starting the application` and the exception isn't logged to elmah.io, the error probably happens before hitting the elmah.io middleware. To help find out what is going on, add the following lines to your `Program.cs` file:

```csharp
public static IHostBuilder CreateHostBuilder(string[] args) =>
    Host.CreateDefaultBuilder(args)
        .ConfigureWebHostDefaults(webBuilder =>
        {
            webBuilder.UseSetting(WebHostDefaults.DetailedErrorsKey, "true");
            webBuilder.CaptureStartupErrors(true);
            webBuilder.UseStartup<Startup>();
        });
```

### URL missing when using Map

When handling requests with the `Map` method, ASP.NET Core will remove the path from `HttpRequest.Path`. In this case, `Elmah.Io.AspNetCore` will look for an URL in the `HttpRequest.PathBase` property. This is not already enough and won't always return the right URL. Consider using the `MapWhen` method instead.