---
title: Logging to elmah.io from System.Diagnostics
description: Log trace and debug message from System.Diagnostics directly to elmah.io. Add cloud monitoring of internal .NET logging using Elmah.Io.Trace.
---

# Logging to elmah.io from System.Diagnostics

!!! warning
    Logging through `System.Diagnostics` have been deprecated. Please use the `Elmah.Io.Client` package to log trace messages to elmah.io.

.NET comes with its own tracing/logging feature located in the `System.Diagnostics` namespaces. A core part of `System.Diagnostics` is the `Trace` class, but that namespace contains utilities for performance counters, working with the event log, and a lot of other features. In this article, we will focus on logging to elmah.io from `System.Diagnostics.Trace`.

To start logging, install the `Elmah.Io.Trace` package:

```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.Trace
```
```powershell fct_label="Package Manager"
Install-Package Elmah.Io.Trace
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.Trace" Version="3.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.Trace
```

As default, `Trace` logs to the Win32 OutputDebugString function, but it is possible to log to multiple targets (like appenders in log4net). To do so, tell `Trace` about elmah.io:

```csharp
System.Diagnostics.Trace.Listeners.Add(
    new ElmahIoTraceListener("API_KEY", new Guid("LOG_ID")));
```

Replace `API_KEY` with your API key ([Where is my API key?](where-is-my-api-key.md)) and `LOG_ID` with your log id ([Where is my log ID?](where-is-my-log-id.md)).

To start logging, call the `Trace` API:

```csharp
try
{
    System.Diagnostics.Trace.Write("Starting something dangerous");
    // ...
}
catch (Exception e)
{
    System.Diagnostics.Trace.Fail(e.Message, e.ToString());
}
```

In the example, we write an information message with the message `Starting something dangerous` and log any thrown exception to elmah.io.