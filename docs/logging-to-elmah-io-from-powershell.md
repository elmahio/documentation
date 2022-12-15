---
title: Logging to elmah.io from PowerShell
description: Learn how to set up error logging from a PowerShell script to elmah.io. Log errors during a build, a scheduled task, and similar with elmah.io.
---

# Logging to elmah.io from PowerShell

[TOC]

There are a couple of options for logging to elmah.io from PowerShell. If you need to log a few messages, using the API is the easiest.

## Log through the API

Logging to elmah.io from PowerShell is easy using built-in cmdlets:

```powershell
$apiKey = "API_KEY"
$logId = "LOG_ID"
$url = "https://api.elmah.io/v3/messages/$logId/?api_key=$apiKey"

$body = @{
    title = "Error from PowerShell"
    severity = "Error"
    detail = "This is an error message logged from PowerShell"
    hostname = hostname
}
Invoke-RestMethod -Method Post -Uri $url -Body ($body|ConvertTo-Json) -ContentType "application/json-patch+json"
```

Replace `API_KEY` with your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and `LOG_ID` with the ID of the log you want messages sent to ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)).

## Log through PoShLog.Sinks.ElmahIo

PoShLog is a PowerShell logging module built on top of Serilog. To log to elmah.io using PoShLog, install the following packages:

```powershell
Install-Module -Name PoShLog
Install-Module -Name PoShLog.Sinks.ElmahIo
```

Logging messages can now be done using `Write-*Log`:

```powershell
Import-Module PoShLog
Import-Module PoShLog.Sinks.ElmahIo

New-Logger |
    Add-SinkElmahIo -ApiKey 'API_KEY' -LogId 'LOG_ID' |
    Start-Logger

Write-ErrorLog 'Say My Name'

# Don't forget to close the logger
Close-Logger
```

## Log through `Elmah.Io.Client`

If you prefer to use the `Elmah.Io.Client` NuGet package, you can do this in PowerShell too. First of all, you will need to include `elmah.io.client.dll`. How you do this is entirely up to you. You can include this assembly in your script location or you can download it through NuGet on every execution. To download the package through NuGet, you will need `nuget.exe`:

```powershell
$source = "https://dist.nuget.org/win-x86-commandline/latest/nuget.exe"
$target = ".\nuget.exe"
Invoke-WebRequest $source -OutFile $target
Set-Alias nuget $target -Scope Global
```

This script will download the latest version of the NuGet command-line tool and make it available through the command `nuget`.

To install `Elmah.Io.Client` run `nuget.exe`:

```powershell
nuget install Elmah.Io.Client
```

This will create an `Elmah.Io.Client-version` folder containing the latest stable version of the `Elmah.Io.Client` package.

You now have `Elmah.Io.Client.dll` loaded into your shell and everything is set up to log to elmah.io. To do so, add try-catch around critical code:

```powershell
$logger = [Elmah.Io.Client.ElmahioAPI]::Create("API_KEY")
Try {
    # some code that may throw exceptions
}
Catch {
    $logger.Messages.Error([guid]::new("LOG_ID"), $_.Exception, "Oh no")
}
```

In the first line, we create a new logger object. Then, in the `Catch` block, the catched exception is shipped off to the elmah.io log specified in `LOG_ID` together with a custom message.

## Examples

For inspiration, here's a list of examples of common scenarios where you'd want to log to elmah.io from PowerShell.

### Log error on low remaining disk

You can monitor when a server is running low on disk space like this:

```powershell
$cdrive = Get-Volume -DriveLetter C
$sizeremainingingb = $cdrive.SizeRemaining/1024/1024/1024
if ($sizeremainingingb -lt 10) {
    $apiKey = "API_KEY"
    $logId = "LOG_ID"
    $url = "https://api.elmah.io/v3/messages/$logId/?api_key=$apiKey"

    $body = @{
        title = "Disk storage less than 10 gb"
        severity = "Error"
        detail = "Remaining storage in gb: $sizeremainingingb"
        hostname = hostname
    }
    Invoke-RestMethod -Method Post -Uri $url -Body ($body|ConvertTo-Json) -ContentType "application/json-patch+json"
}
```

## Troubleshooting

**Elmah.Io.Client.ElmahioAPI cannot be loaded**

If PowerShell complains about `Elmah.Io.Client.ElmahioAPI` not being found, try adding the following lines to the script after installing the `Elmah.Io.Client` NuGet package:

```powershell
$elmahIoClientPath = Get-ChildItem -Path . -Filter Elmah.Io.Client.dll -Recurse `
  | Where-Object {$_.FullName -match "net45"}
[Reflection.Assembly]::LoadFile($elmahIoClientPath.FullName)

$jsonNetPath = Get-ChildItem -Path . -Filter Newtonsoft.Json.dll -Recurse `
  | Where-Object {$_.FullName -match "net45" -and $_.FullName -notmatch "portable"}
[Reflection.Assembly]::LoadFile($jsonNetPath.FullName)
```

You may need to include additional assemblies if PowerShell keeps complaining.

**The catch block is not invoked even though a cmdlet failed**

Most errors in PowerShell are non-terminating meaning that they are handled internally in the cmdlet. To force a cmdlet to use terminating errors use the `-ErrorAction` parameter:

```powershell
Try {
    My-Cmdlet -ErrorAction Stop
}
Catch {
    // Log to elmah.io
}
```