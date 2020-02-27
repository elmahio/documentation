# Logging to elmah.io from a running website on IIS

> Adding elmah.io on a running website isn't the recommended way to install. It should be used if you are unable to deploy a new version only.

To enable error logging to elmah.io, you usually install one of our client integrations through PowerShell or Visual Studio and deploy a new version of your website to a web server. Sometimes you need to monitor an already running website or don't want logging logic as part of your repository. elmah.io can be added to a running website by following this guide.

Run the following command somewhere on your computer:

```ps
nuget install elmah.io
```

From the folder where you ran the command, copy the following files to the `bin` folder of your running website:

```
elmah.corelibrary.x.y.z\lib\Elmah.dll
elmah.io.x.y.z\lib\net45\Elmah.Io.dll
Elmah.Io.Client.x.y.z\lib\<.net version your website is using>\Elmah.Io.Client.dll
Microsoft.Rest.ClientRuntime.x.y.z\lib\net452\Microsoft.Rest.ClientRuntime.dll
Newtonsoft.Json.x.y.z\lib\<.net version your website is using>\Newtonsoft.Json.dll
```

Configure elmah.io in `Web.config` as described here: [Configure elmah.io manually](/configure-elmah-io-manually/) (you don't need to call the `Install-Package` command).

If the website doesn't start logging errors to elmah.io, you may need to restart it.