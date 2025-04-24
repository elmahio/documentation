---
title: Logging to elmah.io from Sitefinity
description: Monitor errors in Telerik Sitefinity by including the elmah.io cloud-logging package. Automatically notify you when errors in the CMS are logged.
---

# Logging to elmah.io from Sitefinity

Sitefinity is a CMS from Telerik, implemented on top of ASP.NET. Like other content management systems build on top of ASP.NET, ELMAH is supported out of the box.

To install elmah.io in a Sitefinity website, start by opening the website in Visual Studio by selecting _File | Open Web Site..._ and navigate to the Sitefinity projects folder (something similar to this: `C:\Program Files (x86)\Telerik\Sitefinity\Projects\Default`).

Right-click the website and install the `Elmah.Io` NuGet package:

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

During installation, you will be prompted for your API key ([Where is my API key?](where-is-my-api-key.md)) and log ID ([Where is my log ID?](where-is-my-log-id.md)).

That's it! Uncaught errors in Sitefinity are logged to your elmah.io log. To test that the integration works, right-click the website and add a new Web Form named ELMAH.aspx. In the code-behind file add the following code:

```chsarp
protected void Page_Load(object sender, EventArgs e)
{
    throw new ApplicationException();
}
```

Start the website and navigate to the ELMAH.aspx page. If everything works as intended, you will see the yellow screen of death, and a new error will pop up on elmah.io.

## Sitefinity Troubleshooting

**Config section 'system.webServer/validation' already defined**

In case you see an Internal Server Error with the Config error above when launching the site, it means that changes to the `web.config` file are required. Open the `web.config` file and search for `validateIntegratedModeConfiguration`. This attribute may be found on multiple `<validation>` elements. The element should only be specified in the configuration once so go ahead and remove instances bringing the total number down to one. Also, make sure to set the value of the attribute to `false`:

```xml
<validation validateIntegratedModeConfiguration="false" />
```