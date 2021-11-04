---
title: Logging to elmah.io from Sitefinity
description: Monitor errors in Telerik Sitefinity by including the elmah.io cloud-logging package. Automatically notify you when errors in the CMS are logged.
---

# Logging to elmah.io from Sitefinity

Sitefinity is a CMS from Telerik, implemented on top of ASP.NET. Like other content management systems build on top of ASP.NET, ELMAH is supported out of the box.

To install elmah.io in a Sitefinity website, start by opening the website in Visual Studio by selecting _File | Open Web Site..._ and navigate to the Sitefinity projects folder (something similar to this: `C:\Program Files (x86)\Telerik\Sitefinity\Projects\Default`).

Right-click the website and install the `Elmah.Io` NuGet package:

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

During installation, you will be prompted for your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and log ID ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)).

That's it! Uncaught errors in Sitefinity are logged to your elmah.io log. To test that the integration works, right-click the website and add a new Web Form named ELMAH.aspx. In the code-behind file add the following code:

```chsarp
protected void Page_Load(object sender, EventArgs e)
{
    throw new ApplicationException();
}
```

Start the website and navigate to the ELMAH.aspx page. If everything works as intended, you will see the yellow screen of death, and a new error will pop up on elmah.io.