[![Build status](https://ci.appveyor.com/api/projects/status/hn4jr5q06ba7vp7c?svg=true)](https://ci.appveyor.com/project/ThomasArdal/elmah-io-umbraco)
[![NuGet](https://img.shields.io/nuget/v/elmah.io.umbraco.svg)](https://www.nuget.org/packages/elmah.io.umbraco/)
[![Samples](https://img.shields.io/badge/samples-1-brightgreen.svg)](https://github.com/elmahio/elmah.io.umbraco/tree/master/Elmah.Io.Umbraco.Example)

# Logging from Umbraco

Since Umbraco itself is written in ASP.NET, ELMAH works like a dream inside Umbraco. Besides logging uncaught errors, elmah.io also supports other types of messages like information and debug. In fact, all the log levels that you already know from log4net, NLog and Serilog, are supported on elmah.io as well. Logging in Umbraco CMS is based on log4net, [which elmah.io also support](https://docs.elmah.io/logging-to-elmah-io-from-log4net/). We have brought all these pieces together into a NuGet package that we call: [Elmah.Io.Umbraco](https://www.nuget.org/packages/elmah.io.umbraco/).

To start utilizing elmah.io from your Umbraco site, all you need to do is install the `Elmah.Io.Umbraco` package:

```powershell
Install-Package Elmah.Io.Umbraco
```

During the installation, you will be asked for your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and log ID ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)).

Hit F5 and watch messages start flowing into elmah.io.

> Elmah.Io.Umbraco 3.x depends on UmbracoCms.Core >= 7.6.3. If you are on a previous version of Umbraco, you can use Elmah.Io.Umbraco 1.0.25, which depends on UmbracoCms.Core 7.2.5.

## Umbraco Cloud

When using Umbraco Cloud, you may not have a local clone of the source code. To install elmah.io on Umbraco cloud, execute the following steps:

* Clone your Umbraco Cloud project to a local folder as explained here: [Visual Studio Setup](https://our.umbraco.org/documentation/Umbraco-Cloud/Set-Up/Visual-Studio/).

* Install `Elmah.Io.Umbraco` into your local clone. During the installation, you will be asked for your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and log ID ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)).

```powershell
Install-Package Elmah.Io.Umbraco
```

* Commit and push all changes to the git respository. This will add elmah.io logging to your remote Umbraco Cloud project.

In case you want logging to different elmah.io logs from each Umbraco Cloud environment, please check out Umbraco's support for config transformations here: [Config transforms](https://our.umbraco.org/documentation/Umbraco-Cloud/Set-Up/Config-Transforms/).

## What's inside?

The Elmah.Io.Umbraco package basically installs and configures three things:

* The elmah.io log4net appender (Warn and above)
* An Umbraco content finder for logging 404's
* ELMAH with elmah.io as error log

All unhandled exceptions from both ASP.NET / MVC / Web API as well as 404's are logged automatically. Warnings, errors and fatal messages logged through log4net are send to elmah.io as well.

## Configuration

If you are running on the default Umbraco template, all nessecary configuration is added during installation of the Elmah.Io.Umbraco NuGet package. If your `web.config` file for some reason aren't updated during installation, you can configure elmah.io manually: [Configure elmah.io manually](https://docs.elmah.io/configure-elmah-io-manually/). Likewise, the installer configure the elmah.io appender for log4net in your `Config\log4net.config` file. If the config isn't added or you are configuring log4net in another location (like `web.config`, here's a guide to set it up: [Logging from log4net](https://docs.elmah.io/logging-to-elmah-io-from-log4net/).