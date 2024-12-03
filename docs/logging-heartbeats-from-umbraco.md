---
title: Logging heartbeats from Umbraco
description: Umbraco comes with a health check feature that can carry out a range of built-in checks. Health Checks fits perfectly with elmah.io Heartbeats.
---

# Logging heartbeats from Umbraco

[TOC]

Umbraco comes with a nice health check feature that can carry out a range of built-in health checks as well as custom checks you may want to add. Umbraco Health Checks fits perfectly with [elmah.io Heartbeats](https://elmah.io/features/heartbeats/).

To start publishing Umbraco Health Checks to elmah.io, create a new health check. Select *1 day* in *Interval* and *5 minutes* in *Grace*. The next step depends on the major version of Umbraco. For both examples, replace `API_KEY`, `LOG_ID`, and `HEARTBEAT_ID` with the values found on the elmah.io UI.

When launching the website Umbraco automatically executes the health checks once every 24 hours and sends the results to elmah.io.

## Umbraco >= 9

!!! note
    Umbraco 9 is targeting .NET 5.0 which is no longer supported by Microsoft. This is why we have chosen to support Umbraco 10 and up only.

Install the `Elmah.Io.Umbraco` NuGet package:

```powershell fct_label="Package Manager"
Install-Package Elmah.Io.Umbraco
```
```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.Umbraco
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.Umbraco" Version="5.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.Umbraco
```

To publish health check results to your newly created heartbeat, extend the `appsettings.json` file:

```json
{
  ...
  "Umbraco": {
    "CMS": {
      ...
      "HealthChecks": {
        "Notification": {
          "Enabled": true,
          "NotificationMethods": {
            "elmah.io": {
              "Enabled": true,
              "Verbosity": "Summary",
              "Settings": {
                "apiKey": "API_KEY",
                "logId": "LOG_ID",
                "heartbeatId": "HEARTBEAT_ID"
              }
            }
          }
        }
      }
    }
  }
}
```

## Umbraco 8

install the `Elmah.Io.Umbraco` v4 NuGet package:

```powershell fct_label="Package Manager"
Install-Package Elmah.Io.Umbraco -Version 4.2.21
```
```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.Umbraco --version 4.2.21
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.Umbraco" Version="4.2.21" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.Umbraco --version 4.2.21
```

For Umbraco to automatically execute health checks, you will need to set your back office URL in the `umbracoSettings.config` file:

```xml
<?xml version="1.0" encoding="utf-8" ?>
<settings>
  <!-- ... -->
  <web.routing umbracoApplicationUrl="https://localhost:44381/umbraco/">
  </web.routing>
</settings>
```

(localhost is used as an example and should be replaced with a real URL)

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

For this example, I have disabled the email notification publisher but you can run with both if you'd like.