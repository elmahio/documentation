---
title: Logging to elmah.io from DevExpress (eXpressApp Framework)
description: Learn about how to set up error monitoring in DevExpress (eXpressApp Framework). Add cloud logging by installing a single NuGet package only.
---

# Logging to elmah.io from DevExpress (eXpressApp Framework)

eXpressApp Framework (XAF) is built on top of ASP.NET. Installing elmah.io corresponds to any other ASP.NET site:

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

During the installation, you will be asked for your API key ([Where is my API key?](where-is-my-api-key.md)) and log ID ([Where is my log ID?](where-is-my-log-id.md)).

To verify the integration, throw a new exception in `Default.aspx` or similar:

```html
<body class="VerticalTemplate">
    <% throw new Exception("Test exception"); %>
    <form id="form2" runat="server">
        <!-- ... -->
    </form>
</body>
```

Launch the project and see the test exception flow into elmah.io.