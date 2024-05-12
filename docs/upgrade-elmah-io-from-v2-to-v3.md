---
title: Upgrade elmah.io from v2 to v3
description: Details about upgrading elmah.io clients from major version 2 to 3. Minor changes may be required to utilize some of the new features in v3.
---

# Upgrade elmah.io from v2 to v3

When we launched the new version of our API ([v3](https://api.elmah.io/swagger/index.html)), we used the jump in major version to fix some issues that would require major changes in our client. One of them is a move to netstandard, which makes the new client usable from .NET Core. With interface changes in the client, upgrading from 2.x to 3.x requires more than simply upgrading the NuGet package. This is a guide to upgrading the Elmah.Io package.

> If you are logging to elmah.io from ASP.NET Core, you are already using the 3.x client.

## Updating the NuGet package

First, you need to upgrade the Elmah.Io NuGet package:

```ps
Update-Package Elmah.Io
```

This installs the latest 3.x client. After doing so, we recommend updating to the latest Elmah.Io.Client package as well (updating Elmah.Io already updated Elmah.Io.Client but to the lowest possible version):

```ps
Update-Package Elmah.Io.Client
```

The elmah.io.core package is no longer needed and can be uninstalled:

```ps
Uninstall-Package elmah.io.core
```

Next, you will need to add your API key to your `web.config`. Where the 2.x client only required a log ID to log messages to elmah.io, the new API improves security by introducing API keys ([Where is my API key?](where-is-my-api-key.md)). Copy your API key and extend the `errorLog`-element in `web.config`:

```xml
<elmah>
  <errorLog type="Elmah.Io.ErrorLog, Elmah.Io" apiKey="API_KEY" logId="LOG_ID" />
</elmah>
```

If you didn't utilize elmah.io's code from C#, you are ready to rock and roll.

## Code changes

The 3.x client is auto-generated from our new Swagger endpoint. This means that the code doesn't work like previously. We have tried to create extension methods to make some of the API work like previously, but since the client now supports both Messages, Logs, and Deployments, code changes are needed.

If you are using the `ErrorSignal` class from ELMAH (the open-source project) to log exceptions manually, everything works as previously. If you are using methods from the Elmah.Io.Client package, there's a new API documented here: [Logging from Console](logging-to-elmah-io-from-console-application.md).

## Elmah.Io.Mvc and Elmah.Io.WebApi

When launching the packages for 3.x, we also decided to create two new proxy packages: Elmah.Io.Mvc and Elmah.Io.WebApi. The reason I call them proxy packages is, that they do nothing more than simply install the dependencies needed to log from each framework. The packages are intended for new installs only, so if your code already logs exceptions to elmah.io, there is no need to install any of these packages.