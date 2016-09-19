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

That's it. Every uncaught exception will be logged to elmah.io. To log exceptions manually (or even log verbose and information messages), check out [Logging from Microsoft.Extensions.Logging](/logging-to-elmah-io-from-microsoft-extensions-logging).

## Events

elmah.io for ASP.NET Core supports a range of events for hooking into the process of logging messages. Events are registered as actions when installing the elmah.io middleware:

```csharp
app.UseElmahIo(
    "API_KEY", 
    new Guid("LOG_ID"), 
    message => {
        message.Version = "42";
    },
    (message, exception) => {
        logger.LogError(1, exception, "Error during log to elmah.io");
    });
```

Two additional parameters are sent to the `UseElmahIo` method. The first parameter is an action (`Action<CreateMessage>`) with a single parameter named `message`. This action is called by elmah.io just before logging a new message to the API. Use this method to decorate/enrich your log messages with additional data like a version number. The second parameter is also an action (`Action<CreateMessage, Exception>`), but with two parameters (`message` and `exception`). This action is called if communication with the elmah.io API failed. If this happens, you should log the message to a local log (through Microsoft.Extensions.Logging, Serilog or similar).

> Do not log to elmah.io in your `onError` event handler, since that could cause an infinite loop in your code.