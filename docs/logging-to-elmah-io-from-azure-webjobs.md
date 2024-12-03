---
title: Logging to elmah.io from Azure WebJobs
description: Logging errors to elmah.io from Azure WebJobs requires only a few lines of code. We've created a client specifically for Azure WebJobs.
---

[![Build status](https://github.com/elmahio/Elmah.Io.Functions/workflows/build/badge.svg)](https://github.com/elmahio/Elmah.Io.Functions/actions?query=workflow%3Abuild)
[![NuGet](https://img.shields.io/nuget/v/Elmah.Io.Functions.svg)](https://www.nuget.org/packages/Elmah.Io.Functions)
[![Samples](https://img.shields.io/badge/samples-1-brightgreen.svg)](https://github.com/elmahio/Elmah.Io.Functions/tree/b17a45991a724f79fb2cb154bbdf9edd0e2a15ce/samples/Elmah.Io.Functions.WebJob)

# Logging to elmah.io from Azure WebJobs

Logging errors from [Azure WebJobs](https://elmah.io/features/azure-functions/) requires only a few lines of code. We've created a client specifically for Azure WebJobs.

!!! warning
    Support for Azure WebJobs has been stopped on version `3.1.23` of the `Elmah.Io.Functions` package. The newer versions only work with Azure Functions.

Install the [Elmah.Io.Functions](https://www.nuget.org/packages/elmah.io.functions/) package:

```powershell fct_label="Package Manager"
Install-Package Elmah.Io.Functions -Version 3.1.23
```
```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.Functions --version 3.1.23
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.Functions" Version="3.1.23" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.Functions --version 3.1.23
```

Log all uncaught exceptions using the `ElmahIoExceptionFilter` attribute:

```csharp
[ElmahIoExceptionFilter("API_KEY", "LOG_ID")]
public class Functions
{
    public static void ProcessQueueMessage([QueueTrigger("queue")] string msg, TextWriter log)
    {
        throw new Exception("Some exception");
    }
}
```

Replace `API_KEY` with your API key ([Where is my API key?](where-is-my-api-key.md)) and `LOG_ID` ([Where is my log ID?](where-is-my-log-id.md)) with your log ID.

!!! note
    If your WebJob method is declared as async, remember to change the return type to `Task`. Without it, `ElmahIoExceptionFilter` is never invoked.

The filter also supports config variables:

```csharp
[ElmahIoExceptionFilter("%apiKey%", "%logId%")]
```

The variables above, would require you to add your API key and log ID to your `App.config`:

```xml
<configuration>
  <appSettings>
    <add key="apiKey" value="API_KEY"/>
    <add key="logId" value="LOG_ID"/>
  </appSettings>
</configuration>
```