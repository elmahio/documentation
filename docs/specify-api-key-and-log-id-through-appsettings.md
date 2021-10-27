---
title: Specify API key and log ID through appSettings
description: Learn about how to specify an elmah.io API key and log ID in the appSettings element rather than in the errorLog element inside the ELMAH config.
---

# Specify API key and log ID through appSettings

When integrating to elmah.io from ASP.NET, MVC, Web API and similar, we use the open source project ELMAH to log uncaught exceptions. ELMAH requires configuration in `web.config`, which in the case of elmah.io could look something like this:

```xml
<elmah>
    <errorLog type="Elmah.Io.ErrorLog, Elmah.Io" apiKey="API_KEY" logId="LOG_ID" />
</elmah>
```

You'd normally use web.config Transformations to specify different API keys and log IDs for different environments (see [Use multiple logs for different environments](https://docs.elmah.io/use-multiple-logs-for-different-environments/)). When hosting on Microsoft Azure (and other cloud-based offerings), a better approach is to specify the configuration in the `appSettings` element and overwrite values through the web app settings in the Portal.

The elmah.io clients built for ASP.NET based web frameworks support this scenario through additional attributes on the `<errorLog>` element:

```xml
<appSettings>
    <add key="apiKeyRef" value="API_KEY" />
    <add key="logIdRef" value="LOG_ID" />
</appSettings>
<!-- ... -->
<elmah>
    <errorLog type="Elmah.Io.ErrorLog, Elmah.Io" apiKeyKey="apiKeyRef" logIdKey="logIdRef" />
</elmah>
```

Unlike the first example, the term _Key_ has been appended to both the `apiKey` and `logId` attributes. The values of those attributes need to match a key specified in `appSettings` (in this example _apiKeyRef_ and _logIdRef_). How you choose to name these keys is entirely up to you, as long as the names match.

elmah.io now picks up your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and log ID ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)) from the `appSettings` element and can be overwritten on your production site on Azure.