# Logging from Azure Functions

Logging errors from Azure Functions, requires only a few lines of code. To start logging exceptions from a Function, install the Elmah.Io.Client NuGet package into your Function project:

```powershell
Install-Package Elmah.Io.Client
```

Functions don't provide any mechanism for logging all uncaught exceptions, why you will need to wrap your Function code in try-catch:

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

Remember to replace `API_KEY` with your API key located on the organization settings page and `LOG_ID` with the ID of the log you want to log to.

By re-throwing the catched exception, Azure Function features like retry works smoothly.