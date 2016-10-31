# Logging from System.Diagnostics

.NET comes with its own tracing/logging feature located in the [System.Diagnostics namespaces](https://msdn.microsoft.com/en-us/library/gg145030(v=vs.110).aspx). A core part of `System.Diagnostics` is the `Trace` class, but that namespace contains utilities for performance counters, working with the event log and a lot of other features. In this article, we will focus on logging to elmah.io from `System.Diagnostics.Trace`.

To start logging, install the [Elmah.Io.Trace](https://www.nuget.org/packages/Elmah.Io.Trace/) package:

```powershell
Install-Package Elmah.Io.Trace
```

As default, `Trace` logs to the Win32 OutputDebugString function, but it is possible to log to multiple targets (like appenders in log4net). To do so, tell `Trace` about elmah.io:

```csharp
System.Diagnostics.Trace.Listeners.Add(new ElmahIoTraceListener(new Guid("LOG_ID")));
```

(replace `LOG_ID` with your log id)

To start logging, call the `Trace` API:

```csharp
try
{
    System.DIagnostics.Trace.Write("Starting something dangerous");
    ...
}
catch (Exception e)
{
    System.Diagnostics.Trace.Fail(e.Message, e.ToString());
}
```

In the example, we write an information message with the message `Starting something dangerous` and logs any thrown exception to elmah.io.