# Logging from Umbraco

Since Umbraco itself is written in ASP.NET, ELMAH works like a dream inside Umbraco. Besides logging uncaught errors, elmah.io also supports other types of messages like information and debug. In fact all of the log levels that you already know from log4net, NLog and Serilog, are supported on elmah.io as well. Logging in Umbraco CMS is based on log4net, [which elmah.io also support](logging-to-elmah-io-from-log4net). We have brought all these pieces together into a NuGet package that we call: [elmah.io.umbraco](https://www.nuget.org/packages/elmah.io.umbraco/).

To start utilizing elmah.io from your Umbraco site, all you need to do is install the elmah.io.umbraco package:

```powershell
Install-Package elmah.io.umbraco
```

Hit F5 and watch messages start flowing into elmah.io.

