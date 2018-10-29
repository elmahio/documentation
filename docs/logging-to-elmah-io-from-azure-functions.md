[![Build status](https://ci.appveyor.com/api/projects/status/wijhscta71muvd5b?svg=true)](https://ci.appveyor.com/project/ThomasArdal/elmah-io-functions)
[![NuGet](https://img.shields.io/nuget/v/Elmah.Io.Functions.svg)](https://www.nuget.org/packages/Elmah.Io.Functions)
[![Samples](https://img.shields.io/badge/samples-3-brightgreen.svg)](https://github.com/elmahio/Elmah.Io.Functions/tree/master/samples)

# Logging to elmah.io from Azure Functions

Logging errors from [Azure Functions](https://elmah.io/features/azure-functions/), requires only a few lines of code. We've created a client specifically for Azure Functions.

> For Functions v1, make sure to install the `Microsoft.Azure.WebJobs` in minimum version `2.2.0`

Install the newest `Elmah.Io.Functions` package in your Azure Functions project:

```powershell
Install-Package Elmah.Io.Functions
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

The filter also supports config variables:

```csharp
[ElmahIoExceptionFilter("%apiKey%", "%logId%")]
```

The variables above, would require you to add your API key and log ID to your `settings.json`:

```json
{
  "Values": {
    "apiKey": "API_KEY",
    "logId": "LOG_ID"
  }
}
```

## Adding debug information to error messages

When debugging error messages logged from functions, it may be a good help to add information about the context the failing function is executed in. Contextual information isn't available for exception filters, but you can add it by implementing the following class:

```csharp
public class DebuggingFilter : FunctionInvocationFilterAttribute
{
    public override Task OnExecutingAsync(FunctionExecutingContext executingContext, CancellationToken cancellationToken)
    {
        executingContext.Properties.Add("message", executingContext.Arguments.First().Value.ToString());
        executingContext.Properties.Add("connection", ConfigurationManager.AppSettings["connection"]);
        return base.OnExecutingAsync(executingContext, cancellationToken);
    }
}
```

In the example, I add two properties (`message` and `connectiction`). This is an example only and you will need to add named values matching your setup. Properties added to `FunctionExecutingContext` are automatically picked up and logged to elmah.io.

Finally, add `DebuggingFilter` to your function:

```csharp
public static class MyFunction
{
    [DebuggingFilter]
    [FunctionName("MyFunction")]
    public static async Task Run(string mySbMsg)
    {
        ...
    }
}
```