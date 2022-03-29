---
title: Logging to elmah.io from MAUI
description: Try out our alpha support for logging uncaught errors from .NET MAUI to elmah.io. Get crashes from real users logged instantly and react before your users.
---

# Logging to elmah.io from MAUI

We just started looking into .NET MAUI. If you want to go for the stable choice, check out the [integration with Xamarin](/logging-to-elmah-io-from-xamarin/) (the NuGet package is also in prerelease but more stable than the integration described in this page).

A quick way to get started with logging from MAUI to elmah.io is by installing the `Elmah.Io.Blazor.Wasm` NuGet package:

```powershell fct_label="Package Manager"
Install-Package Elmah.Io.Blazor.Wasm -IncludePrerelease
```
```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.Blazor.Wasm --prerelease
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

Replace `API_KEY` with your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and `LOG_ID` with the ID of the log you want messages sent to ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)).