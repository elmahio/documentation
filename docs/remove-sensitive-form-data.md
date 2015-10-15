# Remove sensitive form data

You may have something like usernames and passwords in form posts on your website. Since ELMAH automatically logs the content of a failing form POST, sensitive data potentially ends up in your log. No one else but you and your company should really get to look inside your log, but remember that everyone connected to the internet, is a potential hacking victim.

There’s no build-in feature to remove data from the error data, before logging it to ELMAH. Luckily [ELMAH’s Error Filtering](https://code.google.com/p/elmah/wiki/ErrorFiltering) feature lets you accomplish that anyway by writing a bit of additional code in your `global.asax.cs` file:

```csharp
void ErrorLog_Filtering(object sender, ExceptionFilterEventArgs args)
{
    var httpContext = args.Context as HttpContext;
    if (httpContext != null && httpContext.Request.Form.AllKeys.Any(k => k == "SomeSecretFormField"))
    {
        var error = new Error(args.Exception, httpContext);
        error.Form.Set("SomeSecretFormField", "***hidden***");
        ErrorLog.GetDefault(httpContext).Log(error);
        args.Dismiss();
    }
}
```

The `ErrorLog_Filtering` method is called by ELMAH, every time a new exception is about to get logged. The purpose of the method is to be able to tell ELMAH not to log certain kinds of exceptions, but in this case we use the method as a hook to modify the logged error. Since you cannot modify the Form property of the HTTP request, we create a new Error object and update the value of the “SomeSecretFormField” key. The new Error object is then manually logged to the default ELMAH error logger and we dismiss the original error. It’s essential to remember to call `Dismiss()`, because if you don’t, the original error containing the sensitive form field is logged as well.