---
title: Logging to elmah.io from MAUI
description: Try out our alpha support for logging uncaught errors from .NET MAUI to elmah.io. Get crashes from real users logged instantly and react before your users.
---

# Logging to elmah.io from MAUI

We just started looking into .NET MAUI. If you want to go for the stable choice, check out the [integration with Xamarin](logging-to-elmah-io-from-xamarin.md) (the NuGet package is also in prerelease but more stable than the integration described on this page).

A quick way to get started with logging from MAUI to elmah.io is by installing the `Elmah.Io.Blazor.Wasm` NuGet package:

```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.Blazor.Wasm --prerelease
```
```powershell fct_label="Package Manager"
Install-Package Elmah.Io.Blazor.Wasm -IncludePrerelease
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.Blazor.Wasm" Version="4.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.Blazor.Wasm
```

The name is, admittedly, misleading here. The `Elmah.Io.Blazor.Wasm` package contains a simplified version of the `Elmah.Io.Extensions.Logging` package that doesn't make use of the `Elmah.Io.Client` package to communicate with the elmah.io API.

Finally, configure the elmah.io logger in the `MauiProgram.cs` file:

```csharp
public static MauiApp CreateMauiApp()
{
	var builder = MauiApp.CreateBuilder();
	builder
		.UseMauiApp<App>()
		// ...
		.Logging
			.AddElmahIo(options =>
			{
				options.ApiKey = "API_KEY";
				options.LogId = new Guid("LOG_ID");
			});

	return builder.Build();
}
```

Replace `API_KEY` with your API key ([Where is my API key?](where-is-my-api-key.md)) and `LOG_ID` with the ID of the log you want messages sent to ([Where is my log ID?](where-is-my-log-id.md)).

The logging initialization code will log all exceptions logged through `ILogger` both manually and by MAUI itself. MAUI supports dependency injection of the `ILogger` like most other web and mobile frameworks built on top of .NET.

Some exceptions are not logged through Microsoft.Extensions.Logging why you need to handle these manually. If you have worked with Xamarin, you probably know about the various exceptions-related events (like `UnhandledException`). Which event you need to subscribe to depends on the current platform. An easy approach is to use Matt Johnson-Pint's `MauiExceptions` class available <a href="https://gist.github.com/ThomasArdal/a598ba5113d63fd4a904c757c2267ca1#file-mauiexceptions-cs" target="_blank" rel="noopener noreferrer">here</a>. When the class is added, logging uncaught exceptions is using a few lines of code:

```csharp
// Replace with an instance of the ILogger
ILogger logger;

// Subscribe to the UnhandledException event and log it through ILogger
MauiExceptions.UnhandledException += (sender, args) =>
{
	var exception = (Exception)args.ExceptionObject;
	logger.LogError(exception, exception.GetBaseException().Message);
}
```

In case `MauiExceptions` doesn't trigger the `UnhandledException` event you can implement the code yourself. The event you need to implements depends on the platform where the application is executed. Look through the code for `MauiExceptions` to get inspiration. For Windows the code will look like this:

```csharp
public class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();

        // ...

        builder.Logging.AddElmahIo(options =>
        {
            options.ApiKey = "API_KEY";
            options.LogId = new Guid("LOG_ID");
        });

        var provider = builder.Build();

        AppDomain.CurrentDomain.FirstChanceException += (_, args) =>
        {
            var logger = provider.Services.GetRequiredService<ILogger<MauiProgram>>();
            logger.LogError(args.Exception, args.Exception.Message);
        };

        return provider;
    }
}
```