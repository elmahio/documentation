# ASP.NET Troubleshooting

You are probably here because your application doesn't log errors to elmah.io, even though you installed the integration. Before contacting support, there are some things you can try out yourself.

- Make sure that you are referencing one of the following NuGet packages: <a href="https://www.nuget.org/packages/elmah.io/" target="_blank" rel="noopener noreferrer">Elmah.Io</a>, <a href="https://www.nuget.org/packages/Elmah.Io.AspNet/" target="_blank" rel="noopener noreferrer">Elmah.Io.AspNet</a>, <a href="https://www.nuget.org/packages/Elmah.Io.Mvc/" target="_blank" rel="noopener noreferrer">Elmah.Io.Mvc</a> or <a href="https://www.nuget.org/packages/Elmah.Io.WebApi/" target="_blank" rel="noopener noreferrer">Elmah.Io.WebApi</a>.
- Make sure that the <a href="https://www.nuget.org/packages/Elmah.Io.Client/" target="_blank" rel="noopener noreferrer">Elmah.Io.Client</a> NuGet package is installed and that the major version matches that of `Elmah.Io`, `Elmah.Io.AspNet`, `Elmah.Io.Mvc` or `Elmah.Io.WebApi`.
- Make sure that your project reference the following assemblies: `Elmah`, `Elmah.Io`, and `Elmah.Io.Client`.
- Make sure that your `web.config` file contains valid config as [described here](/configure-elmah-io-manually/). You can validate your `web.config` file using this [Web.config Validator](https://elmah.io/tools/configvalidator/). When installing the `Elmah.Io` NuGet package, config is automatically added to your `web.config` file, as long as your Visual Studio allows for running PowerShell scripts as part of the installation. To check if you have the correct execution policy, go to the Package Manager Console and verify that the result of the follow statement is `RemoteSigned`: `Get-ExecutionPolicy`
- Make sure that your server has an outgoing internet connection and that it can communicate with `api.elmah.io` on port `443`. Most of our integrations support setting up an HTTP proxy if your server doesn't allow outgoing traffic.
- Make sure that you didn't enable any Ignore filters or set up any Rules with an ignore action on the log in question.
- Make sure that you don't have any code catching all exceptions happening in your system and ignoring them (could be a logging filter or similar).
- If you are using custom errors, make sure to configure it correctly. For more details, check out the following posts: [Web.config customErrors element with ASP.NET explained](https://blog.elmah.io/web-config-customerrors-element-with-aspnet-explained/) and <a href="https://dusted.codes/demystifying-aspnet-mvc-5-error-pages-and-error-logging" target="_blank" rel="noopener noreferrer">Demystifying ASP.NET MVC 5 Error Pages and Error Logging</a>.
- 

## Common errors and how to fix them

Here you will a list of common errors/exceptions and how to solve them.

### TypeLoadException

**Exception**

```
[TypeLoadException: Inheritance security rules violated by type: 'System.Net.Http.WebRequestHandler'. Derived types must either match the security accessibility of the base type or be less accessible.]
   Microsoft.Rest.ServiceClient`1.CreateRootHandler() +0
   Microsoft.Rest.ServiceClient`1..ctor(DelegatingHandler[] handlers) +59
   Elmah.Io.Client.ElmahioAPI..ctor(DelegatingHandler[] handlers) +96
   Elmah.Io.Client.ElmahioAPI..ctor(ServiceClientCredentials credentials, DelegatingHandler[] handlers) +70
   Elmah.Io.Client.ElmahioAPI.Create(String apiKey, ElmahIoOptions options) +146
   Elmah.Io.Client.ElmahioAPI.Create(String apiKey) +91
   Elmah.Io.ErrorLog..ctor(IDictionary config) +109
```

**Solution**

This is most likely caused by a problem with the `System.Net.Http` NuGet package. Make sure to upgrade to the newest version (`4.3.4` as of writing this). The default template for creating a new web application, installs version `4.3.0` which is seriously flawed.

### AmbiguousMatchException

**Exception**

```
[AmbiguousMatchException: Multiple custom attributes of the same type found.]
   System.Attribute.GetCustomAttribute(Assembly element, Type attributeType, Boolean inherit) +119
   System.Reflection.CustomAttributeExtensions.GetCustomAttribute(Assembly element, Type attributeType) +16
   Microsoft.Rest.ServiceClient`1.get_FrameworkVersion() +226
   Microsoft.Rest.ServiceClient`1.SetDefaultAgentInfo() +93
   Microsoft.Rest.ServiceClient`1.InitializeHttpClient(HttpClient httpClient, HttpClientHandler httpClientHandler, DelegatingHandler[] handlers) +386
   Microsoft.Rest.ServiceClient`1..ctor(HttpClient serviceHttpClient, HttpClientHandler rootHandler, Boolean disposeHttpClient, DelegatingHandler[] delHandlers) +82
   Microsoft.Rest.ServiceClient`1..ctor(HttpClientHandler rootHandler, DelegatingHandler[] handlers) +66
   Elmah.Io.Client.ElmahioAPI..ctor(HttpClientHandler rootHandler, DelegatingHandler[] handlers) +104
   Elmah.Io.Client.ElmahioAPI..ctor(ServiceClientCredentials credentials, HttpClientHandler rootHandler, DelegatingHandler[] handlers) +78
   Elmah.Io.ErrorLog..ctor(IDictionary config) +225
 
[TargetInvocationException: Exception has been thrown by the target of an invocation.]
   System.RuntimeMethodHandle.InvokeMethod(Object target, Object[] arguments, Signature sig, Boolean constructor) +0
   System.Reflection.RuntimeConstructorInfo.Invoke(BindingFlags invokeAttr, Binder binder, Object[] parameters, CultureInfo culture) +359
   System.RuntimeType.CreateInstanceImpl(BindingFlags bindingAttr, Binder binder, Object[] args, CultureInfo culture, Object[] activationAttributes, StackCrawlMark& stackMark) +1485
   System.Activator.CreateInstance(Type type, BindingFlags bindingAttr, Binder binder, Object[] args, CultureInfo culture, Object[] activationAttributes) +298
   System.Activator.CreateInstance(Type type, Object[] args) +34
   Elmah.ErrorLog.GetDefaultImpl(HttpContext context) +178
   Elmah.ServiceCenter.GetService(Object context, Type serviceType) +17
   Elmah.ErrorLog.GetDefault(HttpContext context) +34
   Elmah.ErrorPageBase.get_ErrorLog() +39
   Elmah.ErrorLogPage.OnLoad(EventArgs e) +400
   System.Web.UI.Control.LoadRecursive() +154
   System.Web.UI.Page.ProcessRequestMain(Boolean includeStagesBeforeAsyncPoint, Boolean includeStagesAfterAsyncPoint) +4082
```

**Solution**

This is most likely caused by some other software installed on the machine hosting your website. Applications like Microsoft Monitoring Agent (Application Insights) are known for creating problems for other software running on the same machine. Pause or stop any other monitoring service to see if the problem goes away.

### Exceptions aren't logged to elmah.io when adding the `HandleError` attribute

Much like custom errors, the `HandleError` attribute can swallow exceptions from your website. This means that ASP.NET MVC catches any exceptions and show the `Error.cshtml` view. To log exceptions with this setup, you will need to extend your `Error.cshtml` file:

```csharp
@model System.Web.Mvc.HandleErrorInfo

@{
    if (Model.Exception != null)
    {
        Elmah.ErrorLog.GetDefault(HttpContext.Current).Log(new Elmah.Error(Model.Exception, HttpContext.Current));
    }
}

<div>
    Your error page content goes here 
</div> 
```

### Errors are not logged when using update panels

ASP.NET Update Panels are great at many things. Unfortunately, one of those things is causing problems when trying to log server-side errors. If errors aren't logged as part of a call made from an update panel, you can try to add the following code to `Global.asax.cs`:

```csharp
protected void Application_Error(object sender, EventArgs e)
{
    var ex = Server.GetLastError();
    var error = new Elmah.Error(ex);
    error.ServerVariables.Add("URL", HttpContext.Current?.Request?.Url?.AbsolutePath);
    error.ServerVariables.Add("HTTP_USER_AGENT", HttpContext.Current?.Request?.UserAgent);
    error.ServerVariables.Add("REMOTE_ADDR", HttpContext.Current?.Request?.UserHostAddress);
    Elmah.ErrorLog.GetDefault(HttpContext.Current).Log(error);
}
```

If you start experiencing errors logged multiple times, you can remove the ELMAH module from `web.config`:

```xml
<modules>
    <add name="ErrorLog" type="Elmah.ErrorLogModule, Elmah" preCondition="managedHandler" />
</modules>
```