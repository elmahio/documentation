---
title: Logging errors programmatically
description: Learn how to log errors to elmah.io manually when configured in ASP.NET. ELMAH provides a nice API to do just that through error signaling.
---

# Logging errors programmatically

So you've set up a shiny new ELMAH log and all of your unhandled errors are logged to ELMAH. Now you're wondering: "How do I log my handled errors to ELMAH programmatically?"

You are in luck! ELMAH provides a nice API to do just that through error signaling. Consider the following code:

```csharp
try
{
    int i = 0;
    int result = 42 / i;
}
catch (DivideByZeroException e)
{
    // What to do?
}
```

An exception is thrown when trying to divide by zero, but what if we want to catch (and log) that exception instead of throwing it back through the call stack? With ELMAH's `ErrorSignal` class we can log the error:

```csharp
try
{
    int i = 0;
    int result = 42 / i;
}
catch (DivideByZeroException e)
{
    ErrorSignal.FromCurrentContext().Raise(e);
}
```

We call the static method `FromCurrentContext` on the `ErrorSignal` class, which returns a new object for doing the actual logging. Logging happens through the Raise method, which logs the exception to the configured ELMAH storage endpoint.

In the example above, I use the `FromCurrentContext` helper to create a new instance of `ErrorSignal`. ELMAH also works outside the context of a webserver and in this case, you would simply use the default logger with `null` as the HTTP context:

```csharp
ErrorLog.GetDefault(null).Log(new Error(e));
```

If you simply want to log text messages and don't need all of the HTTP context information, consider using one of our integrations for popular logging frameworks like [log4net](https://docs.elmah.io/logging-to-elmah-io-from-log4net/), [NLog](https://docs.elmah.io/logging-to-elmah-io-from-nlog/), or [Serilog](https://docs.elmah.io/logging-to-elmah-io-from-serilog/). Also, the [Elmah.Io.Client](https://www.nuget.org/packages/Elmah.Io.Client/) package contains a logging API [documented here](https://github.com/elmahio/Elmah.Io.Client).