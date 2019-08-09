[![Build status](https://ci.appveyor.com/api/projects/status/wijhscta71muvd5b?svg=true)](https://ci.appveyor.com/project/ThomasArdal/elmah-io-functions)
[![NuGet](https://img.shields.io/nuget/v/Elmah.Io.Functions.svg)](https://www.nuget.org/packages/Elmah.Io.Functions)
[![Samples](https://img.shields.io/badge/samples-1-brightgreen.svg)](https://github.com/elmahio/Elmah.Io.Functions/tree/master/samples)

# Logging to elmah.io from Azure WebJobs

Logging errors from [Azure WebJobs](https://elmah.io/features/azure-functions/), requires only a few lines of code. We've created a client specifically for Azure WebJobs.

Install the [Elmah.Io.Functions](https://www.nuget.org/packages/elmah.io.functions/) package:

```powershell
Install-Package Elmah.Io.Functions
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

Replace `API_KEY` with your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and `LOG_ID` ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)) with your log ID.

> If your WebJob method is declared as async, remember to change the return type to `Task`. Without it, `ElmahIoExceptionFilter` is never invoked.

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