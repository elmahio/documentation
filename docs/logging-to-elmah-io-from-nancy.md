---
title: Logging to elmah.io from Nancy
description: Learn about how to add error monitoring and cloud logging to any Nancy website with elmah.io. Simply install two NuGet packages and you are done.
---

# Logging to elmah.io from Nancy

As with MVC and WebAPI, Nancy already provides ELMAH support out of the box. Start by installing the `Elmah.Io` NuGet package:

```powershell fct_label="Package Manager"
Install-Package Elmah.Io
```
```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io" Version="4.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io
```

During the installation, you will be asked for your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and log ID ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)).

To integrate Nancy and ELMAH, Christian Westman already did a great job with his `Nancy.Elmah` package. Install it using NuGet:

```powershell fct_label="Package Manager"
Install-Package Nancy.Elmah
```
```cmd fct_label=".NET CLI"
dotnet add package Nancy.Elmah
```
```xml fct_label="PackageReference"
<PackageReference Include="Nancy.Elmah" Version="0.*" />
```
```xml fct_label="Paket CLI"
paket add Nancy.Elmah
```

You must install the `Elmah.Io` package before `Nancy.Elmah`, because both packages like to add the ELMAH configuration to the web.config file. If you install it the other way around, you will need to add the elmah.io ErrorLog element manually.

For Nancy to know how to log errors to Elmah, you need to add an override of the DefaultNancyBootstrapper. Create a new class in the root named Bootstrapper:

```csharp
using Nancy;
using Nancy.Bootstrapper;
using Nancy.Elmah;
using Nancy.TinyIoc;
 
namespace Elmah.Io.NancyExample
{
    public class Bootstrapper : DefaultNancyBootstrapper
    {
        protected override void ApplicationStartup(TinyIoCContainer container, IPipelines pipelines)
        {
            base.ApplicationStartup(container, pipelines);
            Elmahlogging.Enable(pipelines, "elmah");
        }
    }
}
```

The important thing in the code sample is line 13, where we tell Nancy.Elmah to hook into the pipeline of Nancy for it to catch and log HTTP errors. The second parameter for the Enable-method, lets us define a URL for the ELMAH error page, which can be used as an alternative to elmah.io for quick viewing of errors.
