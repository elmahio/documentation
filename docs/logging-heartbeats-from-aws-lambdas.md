# Logging heartbeats from AWS Lambdas

AWS Lambdas running on a schedule are great candidates for logging heartbeats to elmah.io. To send a healthy heartbeat when the Lambda runs successfully and an unhealthy heartbeat when an error happens, start by installing the `Elmah.Io.Client` NuGet package:

```powershell fct_label="Package Manager"
Install-Package Elmah.Io.Client
```
```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.Client
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.Client" Version="3.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.Client
```

Include elmah.io API key, log ID, and heartbeat ID in your code. In this example, they are added as static fields:

```csharp
private const string ApiKey = "API_KEY";
private const string HeartbeatId = "HEARTBEAT_ID";
private static Guid LogId = new Guid("LOG_ID");
```

Replace `API_KEY` with an API key with the *Heartbeats | Write* permission ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)), `HEARTBEAT_ID` with the ID of the heartbeat available on the elmah.io UI, and `LOG_ID` with the ID of the log containing the heartbeat ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)).

Create the elmah.io client and store the `IHeartbeat` object somewhere. In the following example, it is initialized in the `Main` method and stored in a static field:

```csharp
private static IHeartbeats heartbeats;

private static async Task Main(string[] args)
{
    heartbeats = ElmahioAPI.Create(ApiKey).Heartbeats;
    // ...
}
```

In the function handler, wrap your code in try/catch and call either the `Healthy` or `Unhealthy` method:

```csharp
public static string FunctionHandler(string input, ILambdaContext context)
{
    try
    {
        // Lambda code goes here

        heartbeats.Healthy(LogId, HeartbeatId);
        return input?.ToUpper();
    }
    catch (Exception e)
    {
        heartbeats.Unhealthy(LogId, HeartbeatId, e.ToString());
        throw;
    }
}
```

When the lambda code runs (replace the `Lambda code goes here` comment with your code) without exceptions, a healthy heartbeat is logged to elmah.io. In case of an exception, an unhealthy heartbeat is logged to elmah.io. In case your Lambda doesn't run at all, elmah.io automatically logs a missing heartbeat.