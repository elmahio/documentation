# Logging heartbeats from Umbraco

> The Heartbeats feature is currently in beta and still experimental.

Umbraco comes with a nice health check feature which can carry out a range of built-in health checks as well as custom checks you may want to add. Umbraco Health Checks fits perfectly with elmah.io Heartbeats.

To start publishing Umbraco Health Checks to elmah.io, create a new health check. Select *1 day* in *Interval* and *5 minutes* in *Grace*. Next, install the `Elmah.Io.Umbraco` NuGet package:

```powershell
Install-Package Elmah.Io.Umbraco -IncludePrelease
```

For Umbraco to automatically execute health checks, you will need to set your back office URL in the `umbracoSettings.config` file:

```xml
<?xml version="1.0" encoding="utf-8" ?>
<settings>
  ...
  <web.routing ... umbracoApplicationUrl="https://localhost:44381/umbraco/">
  </web.routing>
</settings>
```

(localhost used as an example and should be replaced with a real URL)

Umbraco comes with an email publisher already configured. To publish health check results to your newly created heartbeat, extend the `HealthChecks.config` file:

```xml
<?xml version ="1.0" encoding="utf-8" ?>
<HealthChecks>
  <disabledChecks>
  </disabledChecks>
  <notificationSettings enabled="true" firstRunTime="" periodInHours="24">
    <notificationMethods>
      <notificationMethod alias="elmah.io" enabled="true" verbosity="Summary">
        <settings>
          <add key="apiKey" value="API_KEY" />
          <add key="logId" value="LOG_ID" />
          <add key="heartbeatId" value="HEARTBEAT_ID" />
        </settings>
      </notificationMethod>
      <notificationMethod alias="email" enabled="false" verbosity="Summary">
        <settings>
          <add key="recipientEmail" value="" />
        </settings>
      </notificationMethod>
    </notificationMethods>
    <disabledChecks>
    </disabledChecks>
  </notificationSettings>
</HealthChecks>
```

For this example I have disabled the email notification publisher but you can run with both if you'd like. Replace `API_KEY`, `LOG_ID`, and `HEARTBEAT_ID` with the values found on the elmah.io UI.

When launching the website Umbraco automatically executes the health checks once every 24 hours and sends the results to elmah.io.