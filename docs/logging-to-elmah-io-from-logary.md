# Logging from Logary

Logary is a semantic logging framework like Serilog and Microsoft Semantic Logging. Combining semantic logs with elmah.io are a perfect fit, since elmah.io has been designed with semantics from the ground up.

In this tutorial, we’ll add Logary to a Console application, but the process is almost identical with other project types. Create a new console application and add the elmah.io target for Logary:

```powershell
Install-Package Logary.Targets.Elmah.Io
```

## Configuration in F&#35;

Configure elmah.io just like you would any normal target:

```fsharp
withTargets [
  // ...
  ElmahIO.create { ElmahIO with logId = "LOG_ID" } "elmah.io"
] >>
withRules [
 // ...
 Rule.createForTarget "elmah.io"
]
```

where `LOG_ID` is the id of your log ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)).

## Configuration in C&#35;

Configuration in C# is just as easy:

```csharp
.Target<ElmahIO.Builder>(
  "elmah.io",
  conf => conf.Target.SendTo(apiKey: "LOG_ID"))
```

where `LOG_ID` is the id of your log.

## Logging

To start logging messages to elmah.io, you can use the following F# code:

```fsharp
let logger = logary.getLogger (PointName [| "Logary"; "Samples"; "main" |])

Message.event Info "User logged in"
  |> Message.setField "userName" "haf"
  |> Logger.logSimple logger

```

or in C#:

```csharp
var logger = logary.GetLogger("Logary.CSharpExample");
logger.LogEventFormat(LogLevel.Fatal, "Unhandled {exception}!", e);
```