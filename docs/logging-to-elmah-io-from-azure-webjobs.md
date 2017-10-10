# Logging from Azure WebJobs

Logging errors from Azure WebJobs, requires only a few lines of code. To start logging exceptions from WebJobs, install the Elmah.Io.Client NuGet package into your WebJob project:

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