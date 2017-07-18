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
        var logger = Elmah.Io.Client.Logger.Create(new Guid("LOG_ID"));
        var exception = e.ExceptionObject as Exception;
        if (exception != null)
        {
            logger.Error(exception, exception.Message);
        }
    }
}
```

Azure WebJobs automatically executes the `Log`-method when an exception is thrown. In this example, we simply log the exception registered in `UnhandledExceptionEventArgs`.