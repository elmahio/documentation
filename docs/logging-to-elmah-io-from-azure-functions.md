[![Build status](https://ci.appveyor.com/api/projects/status/wijhscta71muvd5b?svg=true)](https://ci.appveyor.com/project/ThomasArdal/elmah-io-functions)
[![NuGet](https://img.shields.io/nuget/v/Elmah.Io.Functions.svg)](https://www.nuget.org/packages/Elmah.Io.Functions)
[![Samples](https://img.shields.io/badge/samples-2-brightgreen.svg)](https://github.com/elmahio/Elmah.Io.Functions/tree/master/samples)

# Logging from Azure Functions

Logging errors from Azure Functions, requires only a few lines of code. To start logging exceptions from a Function, choose one of two methods:

### Manually using `Elmah.Io.Client` (the stable choice)

Install the [Elmah.Io.Client](https://www.nuget.org/packages/elmah.io.client/) NuGet package into your Function project:

```powershell
Install-Package Elmah.Io.Client
```

Wrap your Function code in try-catch:

```csharp
public class Function
{
    public static void Run()
    {
        try
        {
            // Business logic goes here
        }
        catch (Exception e)
        {
            var logger = ElmahioAPI.Create("API_KEY");
            client.Messages.Error(new Guid("LOG_ID"), e, "An error message");
            throw;
        }
    }
}
```

Remember to replace `API_KEY` with your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and `LOG_ID` ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)) with the ID of the log you want to log to.

By re-throwing the catched exception, Azure Function features like retry works smoothly.

### Automatic using `Elmah.Io.Functions` (the prerelease choice)

We've created a client specifically for Azure Functions. Before you start, make sure to install `Microsoft.Azure.WebJobs` version `2.1.0-beta4` into your Function App:

```powershell
Install-Package Microsoft.Azure.WebJobs -Version 2.1.0-beta4 -Pre
```

Then install the [Elmah.Io.Functions](https://www.nuget.org/packages/elmah.io.functions/) package:

```powershell
Install-Package Elmah.Io.Functions -Pre
```

Log all uncaught exceptions using the `ElmahIoExceptionFilter` attribute:

```csharp
[ElmahIoExceptionFilter("API_KEY", "LOG_ID")]
public static class Function1
{
    [FunctionName("Function1")]
    public static void Run([TimerTrigger("0 */1 * * * *")]TimerInfo myTimer, TraceWriter log)
    {
        throw new Exception("Some exception");
    }
}
```

Replace `API_KEY` with your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and `LOG_ID` ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)) with your log ID.

> If your function method is declared as async, remember to change the return type to `Task`. Without it, the function host never invoke `ElmahIoExceptionFilter`.