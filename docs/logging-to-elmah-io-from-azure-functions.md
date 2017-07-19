# Logging from Azure Functions

Logging errors from Azure Functions, requires only a few lines of code. To start logging exceptions from a Function, install the Elmah.Io.Client NuGet package into your Function project:

```powershell
Install-Package Elmah.Io.Client
```

Functions don't provide any mechanism for logging all uncaught exceptions, why you will need to wrap your Function code in try-catch:

```csharp
public class Function
{
    public static void Run(string mySbMsg)
    {
        try
        {
            // Business logic goes here
        }
        catch (Exception e)
        {
            var logger = Elmah.Io.Client.Logger.Create(new Guid("LOG_ID"));
            logger.Error(e, e.Message);
            throw;
        }
    }
}
```

Remember to throw the catched exception, to make retry and other Azure Function features work. 