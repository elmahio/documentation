# Logging from PowerShell

In order for you to be able to log to elmah.io from PowerShell, you will need the [elmah.io.client](https://www.nuget.org/packages/elmah.io.client/) NuGet package. This package contains the raw client libraries for communicating with the [elmah.io API](https://elmah.io/api/v2).

First of all, you will need to include `elmah.io.client.dll` in your PowerShell script. How you do this is entirely up to you of course. You can place this assembly with your script or you can download it through NuGet on every execution. To download the elmah.io.client package through NuGet, you will need `nuget.exe`:

```powershell
$source = "https://dist.nuget.org/win-x86-commandline/latest/nuget.exe"
$target = ".\nuget.exe"
Invoke-WebRequest $source -OutFile $target
Set-Alias nuget $target -Scope Global
```

This script will download the latest version of the NuGet command line tool and make it available through the command `nuget`.

To install elmah.io.client, run `nuget.exe`:

```powershell
nuget install Elmah.Io.Client
```

This will create a `Elmah.Io.Client-version` folder containing the latest stable version of the elmah.io.client package. Since you probably don't want to hardcode the path to the current version number, reference `Elmah.Io.Client.dll` and its dependencies using `Get-ChildItem` and a bit of recursive magic:

```powershell
$elmahIoClientPath = Get-ChildItem -Path . -Filter Elmah.Io.Client.dll -Recurse `
  | Where-Object {$_.FullName -match "net45"}
[Reflection.Assembly]::LoadFile($elmahIoClientPath.FullName)

$restClientPath = Get-ChildItem -Path . -Filter Microsoft.Rest.ClientRuntime.dll -Recurse `
  | Where-Object {$_.FullName -match "net45"}
[Reflection.Assembly]::LoadFile($restClientPath.FullName)

$jsonNetPath = Get-ChildItem -Path . -Filter Newtonsoft.Json.dll -Recurse `
  | Where-Object {$_.FullName -match "net45" -and $_.FullName -notmatch "portable"}
[Reflection.Assembly]::LoadFile($jsonNetPath.FullName)
```

You now have `Elmah.Io.Client.dll` loaded into your shell and everything is set up in order to log to elmah.io. To do so, add try-catch around critical code:

```powershell
$logger = [Elmah.Io.Client.ElmahioAPI]::Create("API_KEY")
Try {
    # some code that may throw exceptions
}
Catch {
    $logger.Messages.Error([guid]::new("LOG_ID"), $_.Exception, "Oh no")
}
```

In the first line, we create a new logger object with the `API_KEY` of the subscription we want to use ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)). Then, in the `Catch` block, the catched exception is shipped off to the elmah.io log specified in `LOG_ID` ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)) together with a custom message.