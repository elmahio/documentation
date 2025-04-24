---
title: Logging to elmah.io from Logary
description: Learn about how to set up logging to elmah.io from Logary. Add cloud logging and error monitoring to F# in a breeze with Logary and elmah.io.
---

[![NuGet](https://img.shields.io/nuget/v/Logary.Targets.ElmahIO.svg)](https://www.nuget.org/packages/Logary.Targets.ElmahIO/)

# Logging to elmah.io from Logary

Logary is a semantic logging framework like Serilog and Microsoft Semantic Logging. Combining semantic logs with elmah.io is a perfect fit since elmah.io has been designed with semantics from the ground up.

In this tutorial, we’ll add Logary to a Console application, but the process is almost identical to other project types. Create a new console application and add the elmah.io target for Logary:

```cmd fct_label=".NET CLI"
dotnet add package Logary.Targets.ElmahIO
```
```powershell fct_label="Package Manager"
Install-Package Logary.Targets.ElmahIO
```
```xml fct_label="PackageReference"
<PackageReference Include="Logary.Targets.ElmahIO" Version="5.*" />
```
```xml fct_label="Paket CLI"
paket add Logary.Targets.ElmahIO
```

## Configuration in F&#35;

Configure elmah.io just like you would any normal target:

```fsharp
withTargets [
  // ...
  ElmahIO.create { logId = Guid.Parse "LOG_ID"; apiKey = "API_KEY" } "elmah.io"
] >>
withRules [
 // ...
 Rule.createForTarget "elmah.io"
]
```

where `LOG_ID` is the id of your log ([Where is my log ID?](where-is-my-log-id.md)).

## Configuration in C&#35;

Configuration in C# is just as easy:

```csharp
.Target<ElmahIO.Builder>(
  "elmah.io",
  conf => conf.Target.SendTo(logId: "LOG_ID", apiKey: "API_KEY"))
```

where `API_KEY` is your API key and `LOG_ID` is the ID of your log.

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