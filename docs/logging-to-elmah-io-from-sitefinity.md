# Logging to elmah.io from Sitefinity

Sitefinity is a CMS from Telerik, implemented on top of ASP.NET. Like other content management systems build on top of ASP.NET, ELMAH is supported out of the box.

To install elmah.io in a Sitefinity web-site, start by opening the web-site in Visual Studio by selecting _File | Open Web Site..._ and navigate to the Sitefinity projects folder (something similar to this: `C:\Program Files (x86)\Telerik\Sitefinity\Projects\Default`).

Right click the web site and install the elmah.io NuGet package or install it through Package Manager Console:

```powershell
Install-Package Elmah.Io
```

During installation you will be prompted for your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and log ID ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)).

That's it! Uncaught errors in Sitefinity are logged to your elmah.io log. To test that the integration works, right click the web site and add a new Web Form named ELMAH.aspx. In the code behind file add the following code:

```chsarp
protected void Page_Load(object sender, EventArgs e)
{
    throw new ApplicationException();
}
```

Start the web-site and navigate to the ELMAH.aspx page. If everything works as intended, you will see the yellow screen of death and a new error will pop up on elmah.io.