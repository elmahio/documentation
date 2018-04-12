# Logging to elmah.io from DevExpress (eXpressApp Framework)

eXpressApp Framework (XAF) is built on top of ASP.NET. Installing elmah.io corresponds any other ASP.NET site:

```powershell
Install-Package Elmah.Io
```

During the installation, you will be asked for your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and log ID ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)).

To verify the integration, throw a new exception in `Default.aspx` or similar:

```html
<body class="VerticalTemplate">
    <% throw new Exception("Test exception"); %>
    <form id="form2" runat="server">
    ...
    </form>
</body>
```

Launch the project and see the test exception flow into elmah.io.