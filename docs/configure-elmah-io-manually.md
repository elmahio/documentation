---
title: Configure elmah.io manually
description: When installing the elmah.io package, all config is automatically added. In case this doesn't work or you want to do it manually, here's a guide.
---

# Configure elmah.io manually

The [Elmah.Io NuGet package](https://www.nuget.org/packages/elmah.io/) normally adds all of the necessary configuration, to get up and running with elmah.io. This is one of our killer features and our customers tell us, that we have the simplest installer on the market. In some cases, you may experience problems with the automatic configuration, though. Different reasons can cause the configuration not to be added automatically. The most common reason is restrictions to executing PowerShell inside Visual Studio.

Start by installing the `Elmah.Io` package:

```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io
```
```powershell fct_label="Package Manager"
Install-Package Elmah.Io
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io" Version="5.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io
```

If a dialog is shown during the installation, input your API key ([Where is my API key?](where-is-my-api-key.md)) and log ID ([Where is my log ID?](where-is-my-log-id.md)). Don't worry if the configuration isn't added, since we will verify this later.

Add the following to the `<configSections>` element in your `web.config`:

```xml
<sectionGroup name="elmah">
  <section name="security" requirePermission="false" type="Elmah.SecuritySectionHandler, Elmah" />
  <section name="errorLog" requirePermission="false" type="Elmah.ErrorLogSectionHandler, Elmah" />
  <section name="errorMail" requirePermission="false" type="Elmah.ErrorMailSectionHandler, Elmah" />
  <section name="errorFilter" requirePermission="false" type="Elmah.ErrorFilterSectionHandler, Elmah" />
</sectionGroup>
```

Add the following to the `<httpModules>` element (inside `<system.web>`) in your `web.config`:

```xml
<add name="ErrorLog" type="Elmah.ErrorLogModule, Elmah" />
<add name="ErrorMail" type="Elmah.ErrorMailModule, Elmah" />
<add name="ErrorFilter" type="Elmah.ErrorFilterModule, Elmah"/>
```

Add the following to the `<modules>` element (inside `<system.webServer>`) in your `web.config`:

```xml
<add name="ErrorLog" type="Elmah.ErrorLogModule, Elmah" preCondition="managedHandler" />
<add name="ErrorMail" type="Elmah.ErrorMailModule, Elmah" preCondition="managedHandler" />
<add name="ErrorFilter" type="Elmah.ErrorFilterModule, Elmah" preCondition="managedHandler" />
```

Add the following to the `system.webServer` element in your `web.config`:

```xml
<validation validateIntegratedModeConfiguration="false" />
```

Add the following as a root element beneath the `<configuration>` element in your `web.config`:

```xml
<elmah>
    <security allowRemoteAccess="false" />
    <errorLog type="Elmah.Io.ErrorLog, Elmah.Io" apiKey="API_KEY" logId="LOG_ID" />
</elmah>
```

Replace `API_KEY` with your API key ([Where is my API key?](where-is-my-api-key.md)) and `LOG_ID` with your log ID ([Where is my log ID?](where-is-my-log-id.md)).

That's it. You managed to install elmah.io manually and you should go to your LinkedIn profile and update with a new certification called "Certified elmah.io installer" :)

Here's a full example of ELMAH configuration in a `web.config` file:

```xml
<configuration>
  <configSections>
    <sectionGroup name="elmah">
      <section name="security" requirePermission="false" type="Elmah.SecuritySectionHandler, Elmah" />
      <section name="errorLog" requirePermission="false" type="Elmah.ErrorLogSectionHandler, Elmah" />
      <section name="errorMail" requirePermission="false" type="Elmah.ErrorMailSectionHandler, Elmah" />
      <section name="errorFilter" requirePermission="false" type="Elmah.ErrorFilterSectionHandler, Elmah" />
    </sectionGroup>
  </configSections>
  <system.web>
    <httpModules>
      <add name="ErrorLog" type="Elmah.ErrorLogModule, Elmah" />
      <add name="ErrorMail" type="Elmah.ErrorMailModule, Elmah" />
      <add name="ErrorFilter" type="Elmah.ErrorFilterModule, Elmah"/>
    </httpModules>
  </system.web>
  <system.webServer>
    <validation validateIntegratedModeConfiguration="false" />
    <modules>
      <add name="ErrorLog" type="Elmah.ErrorLogModule, Elmah" preCondition="managedHandler" />
      <add name="ErrorMail" type="Elmah.ErrorMailModule, Elmah" preCondition="managedHandler" />
      <add name="ErrorFilter" type="Elmah.ErrorFilterModule, Elmah" preCondition="managedHandler" />
    </modules>
  </system.webServer>
  <elmah>
    <security allowRemoteAccess="false" />
    <errorLog type="Elmah.Io.ErrorLog, Elmah.Io" apiKey="API_KEY" logId="LOG_ID" />
  </elmah>
</configuration>
```

In case you need to access your error log on `/elmah.axd`, you need to add the following to the `<configuration>` element in your `web.config`:

```xml
<location path="elmah.axd" inheritInChildApplications="false">
    <system.web>
        <httpHandlers>
            <add verb="POST,GET,HEAD" path="elmah.axd" type="Elmah.ErrorLogPageFactory, Elmah" />
        </httpHandlers>
    </system.web>
    <system.webServer>
        <handlers>
            <add name="ELMAH" verb="POST,GET,HEAD" path="elmah.axd" type="Elmah.ErrorLogPageFactory, Elmah" preCondition="integratedMode" />
        </handlers>
    </system.webServer>
</location>
```

We don't recommend browsing your error logs through the `/elmah.axd` endpoint. The elmah.io UI will let you control different levels of access and more.