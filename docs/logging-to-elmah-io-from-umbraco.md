[![Build status](https://ci.appveyor.com/api/projects/status/hn4jr5q06ba7vp7c?svg=true)](https://ci.appveyor.com/project/ThomasArdal/elmah-io-umbraco)
[![NuGet](https://img.shields.io/nuget/v/elmah.io.umbraco.svg)](https://www.nuget.org/packages/elmah.io.umbraco/)
[![Samples](https://img.shields.io/badge/samples-1-brightgreen.svg)](https://github.com/elmahio/elmah.io.umbraco/tree/master/samples/)

# Logging to elmah.io from Umbraco

[TOC]

Since Umbraco itself is written in ASP.NET, ELMAH works like a dream inside Umbraco. Besides logging uncaught errors, elmah.io also supports other types of messages like information and debug. In fact, all the log levels that you already know from log4net, NLog and Serilog, are supported on elmah.io as well. Logging in Umbraco CMS is based on Serilog, [which elmah.io also support](https://docs.elmah.io/logging-to-elmah-io-from-serilog/). We have brought all these pieces together into a NuGet package that we call: [Elmah.Io.Umbraco](https://www.nuget.org/packages/elmah.io.umbraco/).

To start utilizing elmah.io from your Umbraco site, all you need to do is install the `Elmah.Io.Umbraco` package:

```powershell fct_label="Package Manager"
Install-Package Elmah.Io.Umbraco
```
```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.Umbraco
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.Umbraco" Version="3.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.Umbraco
```

During the installation, you will be asked for your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and log ID ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)).

Hit F5 and watch messages start flowing into elmah.io.

## Umbraco Cloud

When using Umbraco Cloud, you may not have a local clone of the source code. To install elmah.io on Umbraco cloud, execute the following steps:

* Clone your Umbraco Cloud project to a local folder as explained here: [Visual Studio Setup](https://our.umbraco.org/documentation/Umbraco-Cloud/Set-Up/Visual-Studio/).

* Install `Elmah.Io.Umbraco` into your local clone. During the installation, you will be asked for your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and log ID ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)).

```powershell fct_label="Package Manager"
Install-Package Elmah.Io.Umbraco
```
```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.Umbraco
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.Umbraco" Version="3.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.Umbraco
```

* Commit and push all changes to the git respository. This will add elmah.io logging to your remote Umbraco Cloud project.

In case you want logging to different elmah.io logs from each Umbraco Cloud environment, please check out Umbraco's support for config transformations here: [Config transforms](https://our.umbraco.org/documentation/Umbraco-Cloud/Set-Up/Config-Transforms/).

## What's inside?

The Elmah.Io.Umbraco package basically installs and configures three things:

* The elmah.io Serilog sink (Warning and above)
* An Umbraco content finder for logging 404's
* ELMAH with elmah.io as error log

All unhandled exceptions from both ASP.NET / MVC / Web API as well as 404's are logged automatically. Warnings, errors and fatal messages logged through Serilog are send to elmah.io as well.

## Configuration

If you are running on the default Umbraco template, all nessecary configuration is added during installation of the `Elmah.Io.Umbraco` NuGet package. If your `web.config` file for some reason aren't updated during installation, you can configure elmah.io manually: [Configure elmah.io manually](https://docs.elmah.io/configure-elmah-io-manually/). Likewise, the installer configure the elmah.io sink for Serilog in your `config\serilog.user.config` file.

### Different environments

You may have different environments like *Staging* and *Production*. At least you have two: *Localhost* and *Production*. If you want to log to different error logs depending on the current environment, check out [Use multiple logs for different environments](/use-multiple-logs-for-different-environments/). Web.config transformations work on the `Web.config` file only but you may have other config files that need transformation as well. In terms of elmah.io, the `serilog.user.config` file also includes elmah.io configuration that you may want to disable on localhost and include on production. If you are running on Umbraco Cloud this is natively supported as explained here: [Config Transforms](https://our.umbraco.com/documentation/Umbraco-Cloud/set-up/Config-Transforms/). Even in self-hosted environments, you can achieve something similar using the SlowCheetah extension. Check out this question on Our for details: [Deploying different umbracoSettings.config for different environments](https://our.umbraco.com/forum/umbraco-7/using-umbraco-7/57392-Deploying-different-umbracoSettingsconfig-for-different-environments).

## Umbraco 7

We still support Umbraco 7 through the `Elmah.Io.Umbraco` package version `3.2.35`:

```powershell fct_label="Package Manager"
Install-Package Elmah.Io.Umbraco -Version 3.2.35
```
```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.Umbraco --version 3.2.35
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.Umbraco" Version="3.2.35" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.Umbraco --version 3.2.35
```

New features will be added to the updated package for Umbraco 8 only.