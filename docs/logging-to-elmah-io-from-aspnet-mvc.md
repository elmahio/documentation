# Logging from ASP.NET MVC

Even though ELMAH works out of the box with ASP.NET MVC, ELMAH and MVC provides some features with interfere with one another. As usual, the great community around ELMAH have done something to fix this, using the [Elmah.Mvc](https://www.nuget.org/packages/Elmah.MVC/) NuGet package.

To start logging exceptions from ASP.NET MVC, install the NuGet packages:

```powershell
Install-Package Elmah.MVC
Install-Package elmah.io
```

That's basically it. Every unhandled exception in ASP.NET MVC, is logged to elmah.io.

So why install `Elmah.MVC` at all, when the `elmah.io` package works out of the box? For starters, `Elmah.MVC` adds some interesting logic around routing and authentication, which matches how things are handled in MVC. Take a look in the `web.config` for application settings with the `elmah.mvc.` prefix. For documentation about these settings, check out the [Elmah.MVC project](https://github.com/alexbeletsky/elmah-mvc) on GitHub.

Since `Elmah.MVC` configures its own URL for accessing the ELMAH UI (just `/elmah` and not `/elmah.axd`), you can remove the `location` element in `web.config`, added by the `elmah.io` NuGet package installer.