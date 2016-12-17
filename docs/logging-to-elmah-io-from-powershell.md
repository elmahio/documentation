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
nuget install elmah.io.client
```

This will create a `packages` folder containing the latest stable version of the elmah.io.client package. Since you probably don't want to hardcode the path to the current version number, get a reference to `elmah.io.client.dll` and load it:

```powershell
$elmahIoClientPath = Get-ChildItem -Path . -Filter elmah.io.client.dll -Recurse
[Reflection.Assembly]::LoadFile($elmahIoClientPath.FullName)
```

You now have `elmah.io.client.dll` loaded into your shell and everything is set up in order to log to elmah.io. To do so, add try-catch around critical code:

```powershell
$logger = New-Object Elmah.Io.Client.Logger([guid]::new("LOG_ID"))
Try {
    # some code that may throw exceptions
}
Catch {
    $logger.Error($_.Exception, "Oh no, something bad happened");
}
```

In the first line, we create a new logger object with the `LOG_ID` of the log we want to write to. Then, in the `Catch` block, the catched exception is shipped off to elmah.io including a custom message.