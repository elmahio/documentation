# ASP.NET Troubleshooting

You are probably here because your application doesn't log errors to elmah.io, even though you installed the integration. Before contacting support, there are some things you can try out yourself.

- Make sure that you are referencing one of the following NuGet packages: <a href="https://www.nuget.org/packages/elmah.io/" target="_blank" rel="noopener noreferrer">Elmah.Io</a>, <a href="https://www.nuget.org/packages/Elmah.Io.AspNet/" target="_blank" rel="noopener noreferrer">Elmah.Io.AspNet</a>, <a href="https://www.nuget.org/packages/Elmah.Io.Mvc/" target="_blank" rel="noopener noreferrer">Elmah.Io.Mvc</a> or <a href="https://www.nuget.org/packages/Elmah.Io.WebApi/" target="_blank" rel="noopener noreferrer">Elmah.Io.WebApi</a>.
- Make sure that the <a href="https://www.nuget.org/packages/Elmah.Io.Client/" target="_blank" rel="noopener noreferrer">Elmah.Io.Client</a> NuGet package is installed and that the major version matches that of `Elmah.Io`, `Elmah.Io.AspNet`, `Elmah.Io.Mvc` or `Elmah.Io.WebApi`.
- Make sure that your project reference the following assemblies: `Elmah`, `Elmah.Io`, and `Elmah.Io.Client`.
- Make sure that your `web.config` file contains valid config as [described here](http://localhost:8000/configure-elmah-io-manually/). You can validate your `web.config` file here: [Web.config Validator](https://elmah.io/tools/configvalidator/).
- Make sure that your server has an outgoing internet connection and that it can communicate with `api.elmah.io` on port `443`. Most of our integrations support setting up an HTTP proxy if your server doesn't allow outgoing traffic.
- Make sure that you didn't enable any Ignore filters or set up any Rules with an ignore action on the log in question.
- Make sure that you don't have any code catching all exceptions happening in your system and ignoring them (could be a logging filter or similar).
- If you are using custom errors, make sure to configure it correctly. For more details, check out the following post: <a href="https://dusted.codes/demystifying-aspnet-mvc-5-error-pages-and-error-logging" target="_blank" rel="noopener noreferrer">Demystifying ASP.NET MVC 5 Error Pages and Error Logging</a>.