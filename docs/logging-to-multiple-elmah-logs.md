---
title: Logging to multiple ELMAH logs
description: Logging to multiple destinations with ELMAH is a good way to keep an existing log while trialing elmah.io. Learn about how to set it up here.
---

# Logging to multiple ELMAH logs

Unfortunately, ELMAH (the open source project) doesn't support multiple log targets like other logging frameworks like Serilog. This makes logging to multiple logs a bit tricky but in no way impossible. Let's say that you're using ELMAH in your web application and configured it to log everything in SQL Server. If you look through your `web.config` file, you will have code looking like this somewhere:

```xml
<elmah>
    <errorLog type="Elmah.SqlErrorLog, Elmah" connectionStringName="elmah"/>
</elmah>
```

As you probably know, this tells ELMAH to log all unhandled errors in SQL Server with the connection string “elmah”. You cannot add more `<errorLog>` elements, why logging into a second log seems impossible. Meet ELMAH's `Logged` event, which is a great hook to log to multiple targets. Install the [Elmah.Io](https://www.nuget.org/packages/elmah.io/) NuGet package and add the following code to your `global.asax.cs` file:

```csharp
void ErrorLog_Logged(object sender, Elmah.ErrorLoggedEventArgs args)
{
    var elmahIoLog = new Elmah.Io.ErrorLog(ElmahioAPI.Create("API_KEY"), new Guid("LOG_ID"));
    elmahIoLog.Log(args.Entry.Error);
}
```

In the above code, we listen for the `Logged` event by simply declaring a method named `ErrorLog_Logged`. When called, we create a new `(Elmah.Io.)ErrorLog` instance with an `IElmahioAPI` object and the log ID. Remember to replace `API_KEY` with your API key ([Where is my API key?](where-is-my-api-key.md)) and `LOG_ID` with your log ID ([Where is my log ID?](where-is-my-log-id.md)). You may want to share the `ElmahioAPI` object between requests by declaring it as a private member. Next, we simply call the `Log` method with a new `Error` object. Bam! The error is logged both in SQL Server and in elmah.io.

If you only want to log certain types of errors in elmah.io, but everything to your normal log, you can extend your code like this:

```csharp
void ErrorLog_Logged(object sender, Elmah.ErrorLoggedEventArgs args)
{
    if (args.Entry.Error.StatusCode == 500)
    {
        var elmahIoLog = new Elmah.Io.ErrorLog(/*...*/);
        elmahIoLog.Log(args.Entry.Error);
    }
}
```

This time we only begin logging to elmah.io, if the thrown exception is of type `HttpException` and contains an HTTP status code of `500`. This example only logs errors with status code 500 in elmah.io and all errors in your normal error log. If you want to create this filter on all logs, you should use the `ErrorLog_Filtering` method instead. This method is called before `ErrorLog_Logged` and before actually logging the error to your normal error log.
