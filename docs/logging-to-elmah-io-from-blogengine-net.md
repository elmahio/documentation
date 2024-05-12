---
title: Logging to elmah.io from BlogEngine.NET
description: Set up error monitoring and cloud logging of any BlogEngine.NET blog. Instant notifications when your blog is down os starts failing.
---

# Logging to elmah.io from BlogEngine.NET

Because BlogEngine.NET is written in ASP.NET, it doesn't need any custom code to use ELMAH and elmah.io. ELMAH works out of the box for most web frameworks by Microsoft. If you are building and deploying the code yourself, installing elmah.io is achieved using our NuGet package:

```powershell fct_label="Package Manager"
Install-Package Elmah.Io
```
```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io" Version="5.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io
```

During the installation, you will be asked for your API key ([Where is my API key?](where-is-my-api-key.md)) and log ID ([Where is my log ID?](where-is-my-log-id.md)).

When installed, BlogEngine.NET starts reporting errors to elmah.io. To check it out, force an internal server error or similar, and visit /elmah.axd or the search area of your log at elmah.io.

Some of you may use the BlogEngine.NET binaries or even installed it using a one-click installer. In this case you will need to add elmah.io manually. To do that, use a tool like NuGet Package Explorer to download the most recent versions of ELMAH and elmah.io. Copy Elmah.dll and Elmah.Io.dll to the bin directory of your BlogEngine.NET installation. Also modify your web.config to include the ELMAH config as shown in the config example. Last but not least, remember to add the elmah.io error logger configuration as a child node to the ```<elmah>``` element:

```xml
<errorLog type="Elmah.Io.ErrorLog, Elmah.Io" apiKey="API_KEY" logId="LOG_ID" />
```

Where `API_KEY` is your API key and `LOG_ID` is your log ID.

To wrap this up, you may have noticed that there's a [NuGet package](https://www.nuget.org/packages/Elmah.BlogEngine.Net/) to bring ELMAH support into BlogEngine.NET. This package adds the ELMAH assembly and config as well as adds a nice BlogEngine.NET compliant URL for browsing errors. Feel free to use this package, but remember to add it after the elmah.io package. Also, make sure to clean up the dual error log configuration:

```xml
<elmah>
  <security allowRemoteAccess="false" />
  <errorLog type="Elmah.Io.ErrorLog, Elmah.Io" apiKey="APIKEY" logId="LOGID" />
  <security allowRemoteAccess="true" />
  <errorLog type="Elmah.SqlServerCompactErrorLog, Elmah" connectionStringName="elmah-sqlservercompact" />
</elmah>
```
