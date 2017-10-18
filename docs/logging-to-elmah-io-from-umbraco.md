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

## Umbraco Cloud

When using Umbraco Cloud, you may not have a local clone of the source code. To install elmah.io on Umbraco cloud, execute the following steps:

* Clone your Umbraco Cloud project to a local folder as explained here: [Visual Studio Setup](https://our.umbraco.org/documentation/Umbraco-Cloud/Set-Up/Visual-Studio/).

* Install `Elmah.Io.Umbraco` into your local clone. During the installation, you will be asked for your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and log ID ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)).

```powershell
Install-Package Elmah.Io.Umbraco
```

* Commit and push all changes to the git respository. This will add elmah.io logging to your remote Umbraco Cloud project.

In case you want logging to different elmah.io logs from each Umbraco Cloud environment, please check out Umbraco's support for config transformations here: [Config transforms](https://our.umbraco.org/documentation/Umbraco-Cloud/Set-Up/Config-Transforms/).