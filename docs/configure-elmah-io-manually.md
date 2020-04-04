# Configure elmah.io manually

The [Elmah.Io NuGet package](https://www.nuget.org/packages/elmah.io/) normally adds all of the necessary configuration, in order to get up and running with elmah.io. In fact, this is one of our killer features and our customers tell us, that we have the simplest installer on the market. In some cases, you may experience problems with the automatic configuration, though. Different reasons can cause the configuration not to be added automatically. The most common reason is restrictions to executing PowerShell inside Visual Studio.

Start by installing the `Elmah.Io` package:

```powershell fct_label="Package Manager"
Install-Package Elmah.Io
```
```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io" Version="3.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io
```

If a dialog is shown during the installation, input your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and log ID ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)). Don't worry if the configuration isn't added, since we will verify this later.

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

Add the following as a root element beneath the `<configuration>` element in your `web.config`:

```xml
<elmah>
    <security allowRemoteAccess="false" />
    <errorLog type="Elmah.Io.ErrorLog, Elmah.Io" apiKey="API_KEY" logId="LOG_ID" />
</elmah>
```

Replace `API_KEY` with your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and `LOG_ID` with your log ID ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)).

That's it. You managed to install elmah.io manually and you should go to your LinkedIn profile and update with a new certification called "Certified elmah.io installer" :)

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