---
title: Logging to elmah.io from CoreWCF
description: Learn how to set up logging to elmah.io from CoreWCF. Integrating cloud-logging from CoreWCF is easy with the Microsoft.Extensions.Logging integration.
---

# Logging to elmah.io from CoreWCF

elmah.io supports CoreWCF using our integration with Microsoft.Extensions.Logging. Start by installing the `Elmah.Io.Extensions.Logging` NuGet package:

```powershell fct_label="Package Manager"
Install-Package Elmah.Io.Extensions.Logging
```
```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.Extensions.Logging
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.Extensions.Logging" Version="4.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.Extensions.Logging
```

Configure logging as part of the configuration (typically in the `Program.cs` file):

```csharp
public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
    WebHost
        .CreateDefaultBuilder(args)
        // ...
        .ConfigureLogging(logging =>
        {
            logging.AddElmahIo(options =>
            {
                options.ApiKey = "API_KEY";
                options.LogId = new Guid("LOG_ID");
            });
        })
        // ...
        .UseStartup<Startup>();

```

Replace `API_KEY` with your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and `LOG_ID` with the id of the log ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)) where you want messages logged.

CoreWCF will now send all messages logged from your application to elmah.io. All of the settings from `Elmah.Io.Extensions.Logging` work as you'd expect in CoreWCF too. Check out [Logging to elmah.io from Microsoft.Extensions.Logging](/logging-to-elmah-io-from-microsoft-extensions-logging/) for details.