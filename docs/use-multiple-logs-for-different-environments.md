---
title: Use multiple logs for different environments
description: Learn about how to log to individual elmah.io logs per environment. Let you set up notifications, apps, and more for production only.
---

# Use multiple logs for different environments

We bet that you use at least two environments for hosting your website: localhost and a production environment. You probably need to log website errors on all your environments, but you don’t want to mix errors from different environments in the same error log. Lucky for you, Microsoft provides a great way of differentiating configuration for different environments called [Web Config transformation](https://learn.microsoft.com/en-us/previous-versions/aspnet/dd465326(v=vs.110)).

> To avoid spending numerous hours of debugging, remember that Web Config transformations are only run on deploy and not on build. In other words, deploy your website using Visual Studio, MSBuild, or third for the transformations to replace the right ELMAH config.

Whether or not you want errors from localhost logged on elmah.io, start by installing the `Elmah.Io` NuGet package:

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

Then choose one of the two paths below.

<div class="alert alert-primary">
    <div class="row">
        <div class="col-auto align-self-start">
            <div class="fa fa-lightbulb"></div>
        </div>
        <div class="col">Our <a href="https://blog.elmah.io/web-config-transformations-the-definitive-syntax-guide/" target="_blank">Web.config transformations - The definitive syntax guide</a> contains general information about how transformations work and you can use the <a href="https://elmah.io/tools/webconfig-transformation-tester/" target="_blank">Web.config Transformation Tester</a> to validate transformation files.</div>
    </div>
</div>

## Logging to elmah.io from both localhost and production

Create two new logs at the elmah.io website called something like “My website” and “My website development”. The naming isn’t really important, so pick something telling.

During installation of the elmah.io package, NuGet will ask you for your elmah.io log id. In this dialog input the log id from the log named “My website development”. The default configuration is used when running your website locally. When installed open the `web.release.config` file and add the following code:

```xml
<elmah xdt:Transform="Replace">
  <errorLog type="Elmah.Io.ErrorLog, Elmah.Io" apiKey="API_KEY" logId="LOG_ID" />
  <security allowRemoteAccess="false" />
</elmah>
```

Replace the `API_KEY` with your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and `LOG_ID` with your log ID ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)). For more information about Web.config transformations, check out the blog post [Web.config transformations - The definitive syntax guide](https://blog.elmah.io/web-config-transformations-the-definitive-syntax-guide/). For help debugging problems, we have created the [Web.config Transformation Tester](https://elmah.io/tools/webconfig-transformation-tester/).

That’s it! You can now build and deploy your website using different configurations. When nothing is changed, Visual Studio will build your website using the Debug configuration. This configuration looks for the ELMAH code in the `web.debug.config` file. We didn’t add any ELMAH configuration to this file, why the default values from `web.config` are used. When selecting the Release configuration, Web. Config transformations will replace the default values in `web.config` with the new ELMAH configuration from `web.release.config`.

## Logging to elmah.io from production only

During the installation, NuGet will ask you for your elmah.io log id. You don't need to write anything in this dialog since we will remove the default elmah.io config in a moment. When installed open the `web.config` file and locate the `<elmah>` element. Remove the `<errorLog>` element and set the `allowRemoveAccess` attribute to `true`. Your configuration should look like this now:

```xml
<elmah>
  <security allowRemoteAccess="true" />
</elmah>
```

Open the `web.release.config` file and insert the following code:

```xml
<elmah xdt:Transform="Replace">
  <errorLog type="Elmah.Io.ErrorLog, Elmah.Io" apiKey="API_KEY" logId="LOG_ID" />
  <security allowRemoteAccess="false" />
</elmah>
```

Like above, replace `API_KEY` and `LOG_ID` with the correct values. Errors happening on your local machine will be logged using ELMAH's default error logger (in-memory) and errors happening in production will be logged to elmah.io.