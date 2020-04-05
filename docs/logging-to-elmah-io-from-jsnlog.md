# Logging to elmah.io from JSNLog

> While logging through JSNLog still works, we recommend to use our native integration with JavaScript: [Logging to elmah.io from JavaScript](https://docs.elmah.io/logging-to-elmah-io-from-javascript/)

Using JSNLog you will be able to log JavaScript errors to elmah.io. In this sample, we will focus about logging JavaScript errors from a ASP.NET MVC web application, but you can use JSNLog to log anything to elmah.io, so please check out their documentation.

Start by installing the `JSNLog.Elmah` package:

```powershell fct_label="Package Manager"
Install-Package JSNLog.Elmah
```
```cmd fct_label=".NET CLI"
dotnet add package JSNLog.Elmah
```
```xml fct_label="PackageReference"
<PackageReference Include="JSNLog.Elmah" Version="2.*" />
```
```xml fct_label="Paket CLI"
paket add JSNLog.Elmah
```

This installs and setup JSNLog into your project, using ELMAH as an appender. Then, install `Elmah.Io`:

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

During the installation, you will be asked for your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and log ID ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)).

Add the JSNLog code before any script imports in your _Layout.cshtml file:

```csharp
@Html.Raw(JSNLog.JavascriptLogging.Configure())
```

You are ready to log errors from JavaScript til elmah.io. To test that everything is installed correctly, launch your web application and execute the following JavaScript using Chrome Developer Tools or similar:

```javascript
JL().fatal("log message");
```

Navigate to you log at elmah.io and observe the new error. As you can see, logging JavaScript errors is now extremely simple and can be built into any try-catch, jQuery fail handlers and pretty much anywhere else. To log every JavaScript error, add the following to the bottom of the _Layout.cshtml file:

```javascript
<script>
window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
 
    // Send object with all data to server side log, using severity fatal,
    // from logger "onerrorLogger"
    JL("onerrorLogger").fatalException({
        "msg": "Exception!",
        "errorMsg": errorMsg, "url": url,
        "line number": lineNumber, "column": column
    }, errorObj);
         
    // Tell browser to run its own error handler as well  
    return false;
}
</script>
```


