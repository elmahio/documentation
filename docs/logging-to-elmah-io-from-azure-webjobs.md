[![Build status](https://ci.appveyor.com/api/projects/status/wijhscta71muvd5b?svg=true)](https://ci.appveyor.com/project/ThomasArdal/elmah-io-functions)
[![NuGet](https://img.shields.io/nuget/v/Elmah.Io.Functions.svg)](https://www.nuget.org/packages/Elmah.Io.Functions)
[![Samples](https://img.shields.io/badge/samples-2-brightgreen.svg)](https://github.com/elmahio/Elmah.Io.Functions/tree/master/samples)

# Logging from Azure WebJobs

Logging errors from Azure WebJobs, requires only a few lines of code. To start logging exceptions from WebJobs, choose one of two methods:

### Manually using `Elmah.Io.Client` (the stable choice)

Install the [Elmah.Io.Client](https://www.nuget.org/packages/elmah.io.client/) NuGet package into your WebJob project:

```powershell
Install-Package Elmah.Io.Client
```

Add the following code to your `Program.cs` file:

```csharp
class Program
{
    static void Main()
    {
        AppDomain.CurrentDomain.UnhandledException += Log;
        ...
    }

    private static void Log(object sender, UnhandledExceptionEventArgs e)
    {
        var exception = e.ExceptionObject as Exception;
        if (exception != null)
        {
            var logger = ElmahioAPI.Create("API_KEY");
            client.Messages.Error(new Guid("LOG_ID"), exception, "An error message");
        }
    }
}
```

Remember to replace `API_KEY` with your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and `LOG_ID` ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)) with the ID of the log you want to log to.

Azure WebJobs automatically executes the `Log`-method when an exception is thrown. In this example, we simply log the exception registered in `UnhandledExceptionEventArgs`.

### Automatic using `Elmah.Io.Functions` (the prerelease choice)

We've created a client specifically for Azure WebJobs. Install the [Elmah.Io.Functions](https://www.nuget.org/packages/elmah.io.functions/) package:

```powershell
Install-Package Elmah.Io.Functions -Pre
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