# Use multiple logs for different environments

We bet that you use at least two environments for hosting your website: localhost and a production environment. You probably need to log website errors on all your environments, but you don’t want to mix errors from different environments in the same error log. Lucky for you, Microsoft provides a great way of differentiating configuration for different environments called [Web Config transformation](https://msdn.microsoft.com/en-us/library/dd465326(v=vs.110).aspx).

> To avoid spending numerous hours of debugging, remember that Web Config transformations are only run on deploy and not on build. In other words, deploy your website using Visual Studio, MSBuild or third for the transformations to replace the right ELMAH config.

Whether or not you want errors from localhost logged on elmah.io, start by installing the elmah.io NuGet package:

```powershell
Install-Package Elmah.Io
```

Then choose one of the two paths below.

## Logging to elmah.io from both localhost and production

Create two new logs at the elmah.io website called something like “My website” and “My website development”. The naming isn’t really important, so pick something telling.

During installation of the elmah.io package, NuGet will ask you for your elmah.io log id. In this dialog input the log id from the log named “My website development”. The default configuration is used when running your website locally. When installed open the `web.release.config` file and add the following code:

```xml
<elmah xdt:Transform="Replace">
  <errorLog type="Elmah.Io.ErrorLog, Elmah.Io" apiKey="API_KEY" logId="LOG_ID" />
  <security allowRemoteAccess="false" />
</elmah>
```

Replace the `API_KEY` with your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and `LOG_ID` with your log ID ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)). That’s it! You can now build and deploy your website using different configurations. When nothing is changed, Visual Studio will build your website using the Debug configuration. This configuration looks for the ELMAH code in the `web.debug.config` file. We didn’t add any ELMAH configuration to this file, why the default values from `web.config` are used. When selecting the Release configuration, Web. Config transformations will replace the default values in `web.config` with the new ELMAH configuration from `web.release.config`.

## Logging to elmah.io from production only

During the installation, NuGet will ask you for your elmah.io log id. You don't need to write anything in this dialog, since we will remove the default elmah.io config in a moment. When installed open the `web.config` file and locate the `<elmah>` element. Remove the `<errorLog>` element and set the `allowRemoveAccess` attribute to `true`. Your configuration should look like this now:

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