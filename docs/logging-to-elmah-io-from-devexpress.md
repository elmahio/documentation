# Logging to elmah.io from DevExpress (eXpressApp Framework)

eXpressApp Framework (XAF) is built on top of ASP.NET. Installing elmah.io corresponds any other ASP.NET site:

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

During the installation, you will be asked for your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and log ID ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)).

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