# ELMAH and custom errors

ELMAH and ASP.NET (MVC) custom errors isn't exactly known to be best friends. Question after question have been posted on forums like Stack Overflow, from people having problems with ELMAH, when custom errors are configured. In fact, these problems make perfect sense, since both ELMAH and custom errors are designed to catch errors and do something about them.

Before looking at some code, we really recommend you to read [Web.config customErrors element with ASP.NET explained](https://blog.elmah.io/web-config-customerrors-element-with-aspnet-explained/) and [Demystifying ASP.NET MVC 5 Error Pages and Error Logging](https://dusted.codes/demystifying-aspnet-mvc-5-error-pages-and-error-logging). Together, the posts are a great introduction to different ways of implementing custom error pages in ASP.NET MVC.

Back to ELMAH. In most implementations of custom error pages, ASP.NET actually swallows any uncaught exceptions, putting ELMAH out of play. To overcome this issue, you can utilize MVC's `IExceptionFilter` to log all exceptions, whether or not it is handled by a custom error page:

```csharp
public class ElmahExceptionLogger : IExceptionFilter
{
    public void OnException (ExceptionContext context)
    {
        if (context.ExceptionHandled)
        {
            ErrorSignal.FromCurrentContext().Raise(context.Exception);
        }
    }
 }
```

The `OnException` method on `ElmahExceptionLogger` is executed every time an error is happening, by registering it in `Application_Start`:

```csharp
protected void Application_Start()
{
    // ...
    GlobalConfiguration.Configuration.Filters.Add(new ElmahExceptionLogger());
    // ...
}
```