---
title: Logging to elmah.io from ServiceStack
description: Learn about how to set up error monitoring in ServiceStack projects using the cloud-based error logging platform elmah.io.
---

# Logging to elmah.io from ServiceStack

Logging errors to elmah.io from ServiceStack is almost as easy as installing in MVC and Web API. The folks over at ServiceStack provide you with a NuGet package named ServiceStack.Logging.Elmah. Like Web API you need to tell ServiceStack to use ELMAH as the logging framework for errors, besides adding the standard ELMAH configuration in web.config. Start by installing both `ServiceStack.Logging.Elmah` and `Elmah.Io` into your ServiceStack web project:

```powershell fct_label="Package Manager"
Install-Package ServiceStack.Logging.Elmah
Install-Package Elmah.Io
```
```cmd fct_label=".NET CLI"
dotnet add package ServiceStack.Logging.Elmah
dotnet add package Elmah.Io
```
```xml fct_label="PackageReference"
<PackageReference Include="ServiceStack.Logging.Elmah" Version="5.*" />
<PackageReference Include="Elmah.Io" Version="5.*" />
```
```xml fct_label="Paket CLI"
paket add ServiceStack.Logging.Elmah
paket add Elmah.Io
```

During the installation, you will be asked for your API key ([Where is my API key?](where-is-my-api-key.md)) and log ID ([Where is my log ID?](where-is-my-log-id.md)).

Once installed, add the following line to your AppHost:

```csharp
LogManager.LogFactory = new ElmahLogFactory(new NLogFactory());
```

The above example assumes that you are already using NLog as the existing framework for logging. Wrapping different logger factories in each other and makes it possible to log errors through ELMAH and other types of messages like warnings and info messages through another logging framework. If you don’t need anything other than ELMAH logging, use the NullLogFactory instead of NLogFactory.

That’s it! By installing both the ServiceStack.Logging.Elmah and elmah.io packages, you should have sufficient configuration in your web.config to start logging errors.

